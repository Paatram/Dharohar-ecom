import { sha256 } from "@/lib/commerce/data";
import { errorResponse, json } from "@/lib/commerce/http";
import { verifyRazorpayWebhook } from "@/lib/commerce/providers/razorpay";
import { getDatabase } from "@/lib/commerce/runtime";

type RazorpayPayload = {
  event?: string;
  payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; status?: string } } };
};

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    if (!(await verifyRazorpayWebhook(raw, request.headers.get("x-razorpay-signature")))) return json({ ok: false, code: "invalid_signature" }, 401);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const payload = JSON.parse(raw) as RazorpayPayload;
    const eventType = payload.event ?? "unknown";
    const payment = payload.payload?.payment?.entity;
    const providerEventId = request.headers.get("x-razorpay-event-id") ?? `${eventType}:${payment?.id ?? await sha256(raw)}`;
    const hash = await sha256(raw);
    const existing = await db.prepare("SELECT status FROM webhook_events WHERE provider = 'razorpay' AND provider_event_id = ?").bind(providerEventId).first();
    if (existing) return json({ ok: true, duplicate: true });
    const eventId = crypto.randomUUID();
    const now = Date.now();
    await db.prepare("INSERT INTO webhook_events (id, provider, provider_event_id, event_type, payload_hash, status, created_at) VALUES (?, 'razorpay', ?, ?, ?, 'received', ?)")
      .bind(eventId, providerEventId, eventType, hash, now).run();
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
    const reservations = await db.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active FROM inventory_reservations WHERE order_id = ?").bind(internalPayment.order_id).first<{ total: number; active: number | null }>();
    if (!reservations?.total || reservations.active !== reservations.total) {
      await db.batch([
        db.prepare("UPDATE payments SET provider_payment_id = ?, status = 'paid_manual_review', updated_at = ? WHERE id = ?").bind(payment.id, now, internalPayment.id),
        db.prepare("UPDATE orders SET status = 'payment_received_after_reservation', payment_status = 'paid_manual_review', updated_at = ? WHERE id = ?").bind(now, internalPayment.order_id),
        db.prepare("INSERT INTO order_events (id, order_id, event_type, public_message, created_at) VALUES (?, ?, 'payment_manual_review', 'Payment was received after the stock hold changed. Dharohar will confirm fulfilment or issue a refund.', ?)").bind(crypto.randomUUID(), internalPayment.order_id, now),
        db.prepare("UPDATE webhook_events SET status = 'processed_manual_review', processed_at = ? WHERE id = ?").bind(now, eventId),
      ]);
      return json({ ok: true, manualReview: true });
    }
    await db.batch([
      db.prepare("UPDATE payments SET provider_payment_id = ?, status = 'paid', updated_at = ? WHERE id = ? AND status != 'paid'").bind(payment.id, now, internalPayment.id),
      db.prepare("UPDATE orders SET status = 'confirmed', payment_status = 'paid', updated_at = ? WHERE id = ? AND payment_status != 'paid'").bind(now, internalPayment.order_id),
      db.prepare("UPDATE inventory_reservations SET status = 'converted', updated_at = ? WHERE order_id = ? AND status = 'active'").bind(now, internalPayment.order_id),
      db.prepare("INSERT INTO order_events (id, order_id, event_type, public_message, created_at) SELECT ?, ?, 'payment_captured', 'Payment confirmed. Your order is being prepared.', ? WHERE NOT EXISTS (SELECT 1 FROM order_events WHERE order_id = ? AND event_type = 'payment_captured')").bind(crypto.randomUUID(), internalPayment.order_id, now, internalPayment.order_id),
      db.prepare("UPDATE webhook_events SET status = 'processed', processed_at = ? WHERE id = ?").bind(now, eventId),
    ]);
    return json({ ok: true });
  } catch (error) { return errorResponse(error); }
}
