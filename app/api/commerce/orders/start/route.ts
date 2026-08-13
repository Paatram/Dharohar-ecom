import { getChatGPTUser } from "@/app/chatgpt-auth";
import { orderStartSchema } from "@/lib/commerce/contracts";
import { enforceRateLimit, reference, releaseOrderReservations, reserveInventory, sha256, upsertCustomer } from "@/lib/commerce/data";
import { CommerceError, errorResponse, json, parseJson } from "@/lib/commerce/http";
import { createRazorpayOrder } from "@/lib/commerce/providers/razorpay";
import { buildVerifiedQuote } from "@/lib/commerce/quote";
import { getCommerceEnv, getDatabase, getProviderReadiness } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, orderStartSchema);
    const idempotency = request.headers.get("idempotency-key")?.trim();
    if (!idempotency || idempotency.length > 120) throw new CommerceError("idempotency_key_required", "A valid Idempotency-Key header is required.", 400);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    await enforceRateLimit(db, request, "order_start", 20, 60 * 60_000);
    if (!getProviderReadiness().payment) return json({ ok: false, code: "payment_unavailable", message: "Secure payment is not configured." }, 503);
    const requestHash = await sha256(JSON.stringify(input));
    const key = `order:${idempotency}`;
    const cached = await db.prepare("SELECT request_hash, response_status, response_json FROM idempotency_keys WHERE key = ? AND expires_at > ?").bind(key, Date.now()).first<{ request_hash: string; response_status: number | null; response_json: string | null }>();
    if (cached) {
      if (cached.request_hash !== requestHash) throw new CommerceError("idempotency_conflict", "This idempotency key was used with different order details.", 409);
      if (cached.response_json) return json(JSON.parse(cached.response_json), cached.response_status ?? 200);
      throw new CommerceError("request_in_progress", "This checkout request is already being processed.", 409);
    }

    const verified = await buildVerifiedQuote(db, input);
    const user = await getChatGPTUser();
    const customerId = user ? await upsertCustomer(db, user) : null;
    if (user && user.email.toLowerCase() !== input.email.toLowerCase()) throw new CommerceError("account_email_mismatch", "Use the email address connected to your signed-in account.", 409);
    const now = Date.now();
    const claim = await db.prepare("INSERT OR IGNORE INTO idempotency_keys (key, scope, request_hash, expires_at, created_at) VALUES (?, 'order', ?, ?, ?)")
      .bind(key, requestHash, now + 86_400_000, now).run();
    if ((claim.meta.changes ?? 0) !== 1) {
      const raced = await db.prepare("SELECT request_hash, response_status, response_json FROM idempotency_keys WHERE key = ? AND expires_at > ?").bind(key, now).first<{ request_hash: string; response_status: number | null; response_json: string | null }>();
      if (raced?.request_hash !== requestHash) throw new CommerceError("idempotency_conflict", "This idempotency key was used with different order details.", 409);
      if (raced?.response_json) return json(JSON.parse(raced.response_json), raced.response_status ?? 200);
      throw new CommerceError("request_in_progress", "This checkout request is already being processed.", 409);
    }
    const orderId = crypto.randomUUID();
    const orderNumber = reference("DH");
    const expiresAt = now + 15 * 60_000;
    const statements = [
      db.prepare("INSERT INTO orders (id, order_number, customer_id, email, status, payment_status, fulfillment_status, currency, subtotal_paise, discount_paise, tax_paise, shipping_paise, total_paise, address_json, gift_json, shipping_json, idempotency_key, created_at, updated_at) VALUES (?, ?, ?, ?, 'creating_payment', 'not_started', 'not_fulfilled', 'INR', ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
        .bind(orderId, orderNumber, customerId, input.email.toLowerCase(), verified.quote.subtotalPaise, verified.quote.taxPaise, verified.quote.shippingPaise, verified.quote.totalPaise, JSON.stringify(input.address), JSON.stringify({ giftWrap: input.giftWrap, giftMessage: input.giftMessage ?? null }), JSON.stringify(verified.shipping), key, now, now),
      db.prepare("INSERT INTO order_events (id, order_id, event_type, public_message, metadata_json, created_at) VALUES (?, ?, 'order_created', 'Order details received; payment is not yet complete.', ?, ?)")
        .bind(crypto.randomUUID(), orderId, JSON.stringify({ courier: verified.shipping.courierName }), now),
    ];
    for (const item of input.items) {
      const product = verified.rowMap.get(item.slug)!;
      const rate = product.gst_basis_points!;
      const line = product.indicative_price_paise * item.quantity;
      const lineTax = product.price_includes_tax ? Math.round((line * rate) / (10_000 + rate)) : Math.round((line * rate) / 10_000);
      statements.push(db.prepare("INSERT INTO order_items (id, order_id, product_slug, product_name, unit_price_paise, tax_paise, quantity) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(crypto.randomUUID(), orderId, product.slug, product.name, product.indicative_price_paise, lineTax, item.quantity));
    }
    await db.batch(statements);

    try {
      for (const item of input.items) await reserveInventory(db, orderId, item.slug, item.quantity, expiresAt);
    } catch (error) {
      await releaseOrderReservations(db, orderId, "released");
      const failure = JSON.stringify({ ok: false, code: "inventory_unavailable", message: "One or more pieces are no longer available." });
      await db.batch([
        db.prepare("UPDATE orders SET status = 'inventory_failed', updated_at = ? WHERE id = ?").bind(Date.now(), orderId),
        db.prepare("UPDATE idempotency_keys SET response_status = 409, response_json = ? WHERE key = ?").bind(failure, key),
      ]);
      throw error;
    }

    try {
      const providerOrder = await createRazorpayOrder({ amountPaise: verified.quote.totalPaise, receipt: orderNumber, notes: { order_id: orderId, order_number: orderNumber } });
      if (providerOrder.amount !== verified.quote.totalPaise || providerOrder.currency !== "INR") throw new CommerceError("payment_amount_mismatch", "Payment provider returned an unexpected amount.", 502);
      const response = { ok: true, orderNumber, provider: "razorpay", providerOrderId: providerOrder.id, amountPaise: verified.quote.totalPaise, currency: "INR", keyId: getCommerceEnv().RAZORPAY_KEY_ID };
      await db.batch([
        db.prepare("INSERT INTO payments (id, order_id, provider, provider_order_id, status, amount_paise, created_at, updated_at) VALUES (?, ?, 'razorpay', ?, 'created', ?, ?, ?)").bind(crypto.randomUUID(), orderId, providerOrder.id, verified.quote.totalPaise, now, Date.now()),
        db.prepare("UPDATE orders SET status = 'pending_payment', payment_status = 'pending', updated_at = ? WHERE id = ?").bind(Date.now(), orderId),
        db.prepare("UPDATE idempotency_keys SET response_status = 201, response_json = ? WHERE key = ? AND request_hash = ?").bind(JSON.stringify(response), key, requestHash),
      ]);
      return json(response, 201);
    } catch (error) {
      await db.batch([
        db.prepare("UPDATE orders SET status = 'payment_setup_failed', payment_status = 'failed', updated_at = ? WHERE id = ?").bind(Date.now(), orderId),
        db.prepare("INSERT INTO order_events (id, order_id, event_type, public_message, created_at) VALUES (?, ?, 'payment_setup_failed', 'Payment could not be started; no payment was taken.', ?)").bind(crypto.randomUUID(), orderId, Date.now()),
        db.prepare("UPDATE idempotency_keys SET response_status = 503, response_json = ? WHERE key = ?").bind(JSON.stringify({ ok: false, code: "payment_start_failed", message: "Payment could not be started; no payment was taken." }), key),
      ]);
      await releaseOrderReservations(db, orderId, "released");
      throw error;
    }
  } catch (error) {
    return errorResponse(error);
  }
}
