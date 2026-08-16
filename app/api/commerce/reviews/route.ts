import { requireApiCustomer } from "@/lib/commerce/auth";
import { reviewSchema } from "@/lib/commerce/contracts";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function GET(request: Request) {
  try {
    const productSlug = new URL(request.url).searchParams.get("product")?.trim();
    if (!productSlug) return json({ ok: false, code: "product_required", message: "Choose a product to view reviews." }, 400);
    const db = getDatabase();
    if (!db) return json({ ok: true, reviews: [], summary: { average: 0, count: 0 }, canReview: false });
    const result = await db.prepare("SELECT r.id, r.rating, r.title, r.body, r.created_at, c.full_name FROM reviews r JOIN customers c ON c.id = r.customer_id WHERE r.product_slug = ? AND r.status = 'approved' ORDER BY r.created_at DESC LIMIT 100")
      .bind(productSlug).all<{ id: string; rating: number; title: string; body: string; created_at: number; full_name: string | null }>();
    const reviews = result.results.map((review) => ({ id: review.id, rating: review.rating, title: review.title, body: review.body, createdAt: review.created_at, reviewerName: review.full_name?.split(" ")[0] || "Dharohar customer" }));
    const count = reviews.length;
    const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
    return json({ ok: true, reviews, summary: { average, count } });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, reviewSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { customerId } = await requireApiCustomer(db);
    const item = await db.prepare("SELECT oi.id, oi.product_slug FROM order_items oi JOIN orders o ON o.id = oi.order_id LEFT JOIN reviews r ON r.order_item_id = oi.id WHERE oi.product_slug = ? AND o.customer_id = ? AND o.fulfillment_status = 'delivered' AND o.payment_status = 'paid' AND r.id IS NULL ORDER BY o.created_at DESC LIMIT 1")
      .bind(input.productSlug, customerId).first<{ id: string; product_slug: string }>();
    if (!item) return json({ ok: false, code: "verified_purchase_required", message: "Reviews are available after a paid order is delivered." }, 403);
    const id = crypto.randomUUID();
    await db.prepare("INSERT INTO reviews (id, order_item_id, customer_id, product_slug, rating, title, body, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'approved', ?)")
      .bind(id, item.id, customerId, item.product_slug, input.rating, input.title, input.body, Date.now()).run();
    return json({ ok: true, id, status: "approved" }, 201);
  } catch (error) { return errorResponse(error); }
}
