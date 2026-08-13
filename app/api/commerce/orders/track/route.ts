import { trackingSchema } from "@/lib/commerce/contracts";
import { enforceRateLimit } from "@/lib/commerce/data";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, trackingSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    await enforceRateLimit(db, request, "tracking", 30, 60 * 60_000);
    const order = await db.prepare("SELECT id, order_number, status, payment_status, fulfillment_status, created_at FROM orders WHERE UPPER(order_number) = UPPER(?) AND LOWER(email) = LOWER(?)")
      .bind(input.orderNumber, input.email).first<{ id: string; order_number: string; status: string; payment_status: string; fulfillment_status: string; created_at: number }>();
    if (!order) return json({ ok: false, code: "order_not_found", message: "No order matched those details." }, 404);
    const [events, shipment] = await Promise.all([
      db.prepare("SELECT event_type, public_message, created_at FROM order_events WHERE order_id = ? AND public_message IS NOT NULL ORDER BY created_at ASC").bind(order.id).all(),
      db.prepare("SELECT courier, status, tracking_url, updated_at FROM shipments WHERE order_id = ? ORDER BY updated_at DESC LIMIT 1").bind(order.id).first(),
    ]);
    return json({ ok: true, order, events: events.results, shipment });
  } catch (error) { return errorResponse(error); }
}
