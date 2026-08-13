import { releaseOrderReservations, sha256 } from "@/lib/commerce/data";
import { CommerceError, errorResponse, json } from "@/lib/commerce/http";
import { verifyRazorpayWebhook } from "@/lib/commerce/providers/razorpay";
import { getDatabase } from "@/lib/commerce/runtime";

type RazorpayPayload = {
  event?: string;
  payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; status?: string } } };
};

export async function POST(request: Request) {
  try {
    const contentLength = Number(request.headers.get("content-length") ?? "0");
    if (contentLength > 1_000_000) throw new CommerceError("payload_too_large", "Webhook payload is too large.", 413);
    const raw = await request.text();
    if (raw.length > 1_000_000) throw new CommerceError("payload_too_large", "Webhook payload is too large.", 413);
    if (!(await verifyRazorpayWebhook(raw, request.headers.get("x-razorpay-signature")))) return json({ ok: false, code: "invalid_signature" }, 401);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    let payload: RazorpayPayload;
    try {
      payload = JSON.parse(raw) as RazorpayPayload;
    } catch {
      throw new CommerceError("invalid_payload", "Webhook payload is not valid JSON.", 400);
    }
    const eventType = payload.event ?? "unknown";
    const payment = payload.payload?.payment?.entity;
    const providerEventId = (request.headers.get("x-razorpay-event-id") ?? `${eventType}:${payment?.id ?? await sha256(raw)}`).slice(0, 200);
    const hash = await sha256(raw);
    let eventId = crypto.randomUUID();
    const now = Date.now();
    const accepted = await db.prepare("INSERT OR IGNORE INTO webhook_events (id, provider, provider_event_id, event_type, payload_hash, status, created_at) VALUES (?, 'razorpay', ?, ?, ?, 'received', ?)")
      .bind(eventId, providerEventId, eventType, hash, now).run();
    if ((accepted.meta.changes ?? 0) !== 1) {
      const existing = await db.prepare("SELECT id, status, created_at FROM webhook_events WHERE provider = 'razorpay' AND provider_event_id = ?").bind(providerEventId).first<{ id: string; status: string; created_at: number }>();
      if (!existing || existing.status !== "received" || existing.created_at > now - 30_000) return json({ ok: true, duplicate: true }, existing?.status === "received" ? 202 : 200);
      eventId = existing.id;
      await db.prepare("UPDATE webhook_events SET created_at = ?, processed_at = NULL WHERE id = ? AND status = 'received'").bind(now, eventId).run();
    }
    if (!payment?.order_id || !payment.id || !payment.amount || !["payment.captured", "order.paid"].includes(eventType)) {
      await db.prepare("UPDATE webhook_events SET status = 'ignored', processed_at = ? WHERE id = ?").bind(Date.now(), eventId).run();
      return json({ ok: true, ignored: true });
    }
    const internalPayment = await db.prepare("SELECT id, order_id, amount_paise, status FROM payments WHERE provider = 'razorpay' AND provider_order_id = ?").bind(payment.order_id).first<{ id: string; order_id: string; amount_paise: number; status: string }>();
    if (!internalPayment || internalPayment.amount_paise !== payment.amount) {
      await db.prepare("UPDATE webhook_events SET status = 'rejected_amount_or_order', processed_at = ? WHERE id = ?").bind(Date.now(), eventId).run();
      return json({ ok: false, code: "payment_mismatch" }, 409);
    }
    if (internalPayment.status === "paid" || internalPayment.status === "paid_manual_review") {
      await db.prepare("UPDATE webhook_events SET status = 'processed_duplicate_payment', processed_at = ? WHERE id = ?").bind(now, eventId).run();
      return json({ ok: true, duplicatePayment: true });
    }
    let reservations = await db.prepare("SELECT id, product_slug, quantity, status, expires_at, updated_at FROM inventory_reservations WHERE order_id = ?").bind(internalPayment.order_id).all<{ id: string; product_slug: string; quantity: number; status: string; expires_at: number; updated_at: number }>();
    const converting = reservations.results.filter((reservation) => reservation.status === "converting");
    if (converting.length > 0) {
      if (converting.some((reservation) => reservation.updated_at > now - 30_000)) {
        await db.prepare("UPDATE webhook_events SET status = 'processing_duplicate_payment', processed_at = ? WHERE id = ?").bind(now, eventId).run();
        return json({ ok: true, processing: true }, 202);
      }
      await db.prepare("UPDATE inventory_reservations SET status = 'active', updated_at = ? WHERE order_id = ? AND status = 'converting'").bind(now, internalPayment.order_id).run();
      reservations = await db.prepare("SELECT id, product_slug, quantity, status, expires_at, updated_at FROM inventory_reservations WHERE order_id = ?").bind(internalPayment.order_id).all<{ id: string; product_slug: string; quantity: number; status: string; expires_at: number; updated_at: number }>();
    }
    const reservationsAreActive = reservations.results.length > 0 && reservations.results.every((reservation) => reservation.status === "active" && reservation.expires_at > now);
    if (!reservationsAreActive) {
      await releaseOrderReservations(db, internalPayment.order_id, "expired");
      await db.batch([
        db.prepare("UPDATE payments SET provider_payment_id = ?, status = 'paid_manual_review', updated_at = ? WHERE id = ?").bind(payment.id, now, internalPayment.id),
        db.prepare("UPDATE orders SET status = 'payment_received_after_reservation', payment_status = 'paid_manual_review', updated_at = ? WHERE id = ?").bind(now, internalPayment.order_id),
        db.prepare("INSERT INTO order_events (id, order_id, event_type, public_message, created_at) VALUES (?, ?, 'payment_manual_review', 'Payment was received after the stock hold changed. Dharohar will confirm fulfilment or issue a refund.', ?)").bind(crypto.randomUUID(), internalPayment.order_id, now),
        db.prepare("UPDATE webhook_events SET status = 'processed_manual_review', processed_at = ? WHERE id = ?").bind(now, eventId),
      ]);
      return json({ ok: true, manualReview: true });
    }
    const claims = await db.batch(reservations.results.map((reservation) => db.prepare("UPDATE inventory_reservations SET status = 'converting', updated_at = ? WHERE id = ? AND status = 'active' AND expires_at > ?")
      .bind(now, reservation.id, now)));
    if (claims.some((result) => (result.meta.changes ?? 0) !== 1)) {
      await db.prepare("UPDATE inventory_reservations SET status = 'active', updated_at = ? WHERE order_id = ? AND status = 'converting'").bind(now, internalPayment.order_id).run();
      await releaseOrderReservations(db, internalPayment.order_id, "expired");
      await db.batch([
        db.prepare("UPDATE payments SET provider_payment_id = ?, status = 'paid_manual_review', updated_at = ? WHERE id = ?").bind(payment.id, now, internalPayment.id),
        db.prepare("UPDATE orders SET status = 'payment_received_after_reservation', payment_status = 'paid_manual_review', updated_at = ? WHERE id = ?").bind(now, internalPayment.order_id),
        db.prepare("UPDATE webhook_events SET status = 'processed_manual_review', processed_at = ? WHERE id = ?").bind(now, eventId),
      ]);
      return json({ ok: true, manualReview: true });
    }
    const conversionStatements = reservations.results.flatMap((reservation) => [
      db.prepare("UPDATE products SET inventory_reserved = inventory_reserved - ?, inventory_on_hand = inventory_on_hand - ?, updated_at = ? WHERE slug = ? AND inventory_reserved >= ? AND inventory_on_hand >= ? AND EXISTS (SELECT 1 FROM inventory_reservations WHERE id = ? AND status = 'converting')")
        .bind(reservation.quantity, reservation.quantity, now, reservation.product_slug, reservation.quantity, reservation.quantity, reservation.id),
      db.prepare("UPDATE inventory_reservations SET status = 'converted', updated_at = ? WHERE id = ? AND status = 'converting'").bind(now, reservation.id),
    ]);
    await db.batch([
      db.prepare("UPDATE payments SET provider_payment_id = ?, status = 'paid', updated_at = ? WHERE id = ? AND status != 'paid'").bind(payment.id, now, internalPayment.id),
      db.prepare("UPDATE orders SET status = 'confirmed', payment_status = 'paid', updated_at = ? WHERE id = ? AND payment_status != 'paid'").bind(now, internalPayment.order_id),
      ...conversionStatements,
      db.prepare("INSERT INTO order_events (id, order_id, event_type, public_message, created_at) SELECT ?, ?, 'payment_captured', 'Payment confirmed. Your order is being prepared.', ? WHERE NOT EXISTS (SELECT 1 FROM order_events WHERE order_id = ? AND event_type = 'payment_captured')").bind(crypto.randomUUID(), internalPayment.order_id, now, internalPayment.order_id),
      db.prepare("UPDATE webhook_events SET status = 'processed', processed_at = ? WHERE id = ?").bind(now, eventId),
    ]);
    return json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
