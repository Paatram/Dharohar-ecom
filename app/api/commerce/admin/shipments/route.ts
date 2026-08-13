import { requireAdmin } from "@/lib/commerce/auth";
import { shipmentStartSchema } from "@/lib/commerce/contracts";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { createShiprocketShipment } from "@/lib/commerce/providers/shiprocket";
import { getDatabase } from "@/lib/commerce/runtime";

type OrderRow = { id: string; order_number: string; email: string; payment_status: string; address_json: string; shipping_json: string; subtotal_paise: number; tax_paise: number; created_at: number };

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, shipmentStartSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { user } = await requireAdmin(db);
    const order = await db.prepare("SELECT id, order_number, email, payment_status, address_json, shipping_json, subtotal_paise, tax_paise, created_at FROM orders WHERE order_number = ?").bind(input.orderNumber).first<OrderRow>();
    if (!order) return json({ ok: false, code: "order_not_found" }, 404);
    if (order.payment_status !== "paid") return json({ ok: false, code: "paid_order_required", message: "Only webhook-confirmed paid orders can be shipped." }, 409);
    const existing = await db.prepare("SELECT id, status, awb FROM shipments WHERE order_id = ?").bind(order.id).first();
    if (existing) return json({ ok: false, code: "shipment_already_exists", shipment: existing }, 409);
    const items = await db.prepare("SELECT product_name, product_slug, unit_price_paise, quantity FROM order_items WHERE order_id = ?").bind(order.id).all<{ product_name: string; product_slug: string; unit_price_paise: number; quantity: number }>();
    const address = JSON.parse(order.address_json);
    const shipping = JSON.parse(order.shipping_json) as { courierId: number; courierName: string };
    const result = await createShiprocketShipment({
      orderNumber: order.order_number,
      orderDate: new Date(order.created_at).toISOString().slice(0, 19).replace("T", " "),
      email: order.email, address,
      items: items.results.map((item) => ({ name: item.product_name, sku: item.product_slug, units: item.quantity, sellingPriceRupees: item.unit_price_paise / 100 })),
      subtotalRupees: (order.subtotal_paise + order.tax_paise) / 100,
      weightGrams: input.weightGrams, lengthMm: input.lengthMm, widthMm: input.widthMm, heightMm: input.heightMm,
      courierId: shipping.courierId,
    });
    const now = Date.now();
    const shipmentId = crypto.randomUUID();
    await db.batch([
      db.prepare("INSERT INTO shipments (id, order_id, provider, provider_order_id, provider_shipment_id, awb, courier, status, tracking_url, updated_at) VALUES (?, ?, 'shiprocket', ?, ?, ?, ?, ?, ?, ?)")
        .bind(shipmentId, order.id, result.providerOrderId, result.providerShipmentId, result.awb, result.courier ?? shipping.courierName, result.awb ? "awb_assigned" : result.status, result.awb ? `https://shiprocket.co/tracking/${encodeURIComponent(result.awb)}` : null, now),
      db.prepare("UPDATE orders SET fulfillment_status = 'ready_for_pickup', updated_at = ? WHERE id = ?").bind(now, order.id),
      db.prepare("INSERT INTO order_events (id, order_id, event_type, public_message, metadata_json, created_at) VALUES (?, ?, 'shipment_created', 'Your order is packed and awaiting courier pickup.', ?, ?)")
        .bind(crypto.randomUUID(), order.id, JSON.stringify({ awb: result.awb, courier: result.courier ?? shipping.courierName }), now),
      db.prepare("INSERT INTO audit_events (id, actor_id, action, subject_type, subject_id, metadata_json, created_at) VALUES (?, ?, 'shipment.create', 'order', ?, ?, ?)")
        .bind(crypto.randomUUID(), user.userId, order.id, JSON.stringify({ measuredPackage: input, providerShipmentId: result.providerShipmentId }), now),
    ]);
    return json({ ok: true, shipmentId, ...result }, 201);
  } catch (error) { return errorResponse(error); }
}
