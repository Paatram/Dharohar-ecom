import { requireApiCustomer } from "@/lib/commerce/auth";
import { reviewSchema } from "@/lib/commerce/contracts";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, reviewSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { customerId } = await requireApiCustomer(db);
    const item = await db.prepare("SELECT oi.product_slug FROM order_items oi JOIN orders o ON o.id = oi.order_id WHERE oi.id = ? AND o.customer_id = ? AND o.fulfillment_status = 'delivered' AND o.payment_status = 'paid'")
      .bind(input.orderItemId, customerId).first<{ product_slug: string }>();
    if (!item) return json({ ok: false, code: "verified_purchase_required", message: "Reviews are available after a paid order is delivered." }, 403);
    const id = crypto.randomUUID();
    await db.prepare("INSERT INTO reviews (id, order_item_id, customer_id, product_slug, rating, title, body, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending_moderation', ?)")
      .bind(id, input.orderItemId, customerId, item.product_slug, input.rating, input.title, input.body, Date.now()).run();
    return json({ ok: true, id, status: "pending_moderation" }, 201);
  } catch (error) { return errorResponse(error); }
}
