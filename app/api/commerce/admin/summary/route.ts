import { requireAdmin } from "@/lib/commerce/auth";
import { ensureCatalogSeeded } from "@/lib/commerce/data";
import { errorResponse, json } from "@/lib/commerce/http";
import { getDatabase, getProviderReadiness } from "@/lib/commerce/runtime";

export async function GET() {
  try {
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    await requireAdmin(db);
    await ensureCatalogSeeded(db);
    const now = Date.now();
    await db.batch([
      db.prepare("UPDATE inventory_reservations SET status = 'expired', updated_at = ? WHERE status = 'active' AND expires_at <= ?").bind(now, now),
      db.prepare("DELETE FROM rate_limits WHERE expires_at <= ?").bind(now),
      db.prepare("DELETE FROM idempotency_keys WHERE expires_at <= ?").bind(now),
    ]);
    const [inventory, orders, enquiries, returns, outbox] = await Promise.all([
      db.prepare("SELECT slug, name, category, inventory_on_hand, inventory_reserved, commerce_status, exact_images_verified, composition_verified, dimensions_verified, packed_weight_verified, tax_verified, care_verified, compatibility_verified, return_policy_verified, dispatch_sla_verified, updated_at FROM products ORDER BY category, name").all(),
      db.prepare("SELECT order_number, status, payment_status, fulfillment_status, total_paise, created_at FROM orders ORDER BY created_at DESC LIMIT 30").all(),
      db.prepare("SELECT reference, kind, name, email, subject, status, created_at FROM enquiries ORDER BY created_at DESC LIMIT 30").all(),
      db.prepare("SELECT r.id, o.order_number, r.reason, r.status, r.created_at FROM returns r JOIN orders o ON o.id = r.order_id ORDER BY r.created_at DESC LIMIT 30").all(),
      db.prepare("SELECT status, COUNT(*) AS count FROM notification_outbox GROUP BY status").all(),
    ]);
    return json({ ok: true, providers: getProviderReadiness(), inventory: inventory.results, orders: orders.results, enquiries: enquiries.results, returns: returns.results, outbox: outbox.results });
  } catch (error) { return errorResponse(error); }
}
