import { requireApiCustomer } from "@/lib/commerce/auth";
import { errorResponse, json } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function GET() {
  try {
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { user, customerId } = await requireApiCustomer(db);
    const [addresses, orders, care, wishlist] = await Promise.all([
      db.prepare("SELECT id, label, recipient_name, phone, line1, line2, city, state, pincode, gstin, is_default FROM addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC").bind(customerId).all(),
      db.prepare("SELECT order_number, status, payment_status, fulfillment_status, currency, total_paise, created_at FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT 50").bind(customerId).all(),
      db.prepare("SELECT id, plan, status, reminder_consent, created_at FROM care_subscriptions WHERE customer_id = ? ORDER BY created_at DESC").bind(customerId).all(),
      db.prepare("SELECT product_slug, created_at FROM saved_products WHERE customer_id = ? ORDER BY created_at DESC").bind(customerId).all(),
    ]);
    return json({ ok: true, profile: { email: user.email, fullName: user.fullName }, addresses: addresses.results, orders: orders.results, care: care.results, wishlist: wishlist.results });
  } catch (error) {
    return errorResponse(error);
  }
}

