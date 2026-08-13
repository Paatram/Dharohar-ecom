import { products } from "@/lib/catalog";
import type { ChatGPTUser } from "@/app/chatgpt-auth";
import { CommerceError } from "@/lib/commerce/http";

export type ProductRow = {
  slug: string;
  name: string;
  category: string;
  material: string;
  finish: string;
  indicative_price_paise: number;
  exact_image_urls_json: string | null;
  composition_text: string | null;
  dimensions_text: string | null;
  care_text: string | null;
  compatibility_text: string | null;
  return_policy_text: string | null;
  dispatch_sla_text: string | null;
  hsn_code: string | null;
  gst_basis_points: number | null;
  price_includes_tax: number;
  packed_weight_grams: number | null;
  package_length_mm: number | null;
  package_width_mm: number | null;
  package_height_mm: number | null;
  return_window_days: number | null;
  dispatch_min_days: number | null;
  dispatch_max_days: number | null;
  inventory_on_hand: number;
  inventory_reserved: number;
  exact_images_verified: number;
  composition_verified: number;
  dimensions_verified: number;
  packed_weight_verified: number;
  tax_verified: number;
  care_verified: number;
  compatibility_verified: number;
  return_policy_verified: number;
  dispatch_sla_verified: number;
  commerce_status: string;
};

export async function ensureCatalogSeeded(db: D1Database) {
  const now = Date.now();
  const statements = products.map((product) => db.prepare(`
    INSERT INTO products (
      slug, name, category, material, finish, currency,
      indicative_price_paise, inventory_on_hand, inventory_reserved,
      commerce_status, updated_at
    ) VALUES (?, ?, ?, ?, ?, 'INR', ?, ?, 0, 'verification_required', ?)
    ON CONFLICT(slug) DO UPDATE SET
      name = excluded.name,
      category = excluded.category,
      material = excluded.material,
      finish = excluded.finish,
      indicative_price_paise = excluded.indicative_price_paise
  `).bind(product.slug, product.name, product.category, product.material, product.finish, product.sellingPricePaise, product.launchStock, now));
  await db.batch(statements);
}

export async function readProducts(db: D1Database, slugs: string[]) {
  const unique = [...new Set(slugs)];
  if (unique.length === 0) return [];
  const placeholders = unique.map(() => "?").join(",");
  const result = await db.prepare(`SELECT * FROM products WHERE slug IN (${placeholders})`).bind(...unique).all<ProductRow>();
  return result.results;
}

export async function upsertCustomer(db: D1Database, user: ChatGPTUser) {
  const existing = await db.prepare("SELECT id FROM customers WHERE auth_user_id = ?").bind(user.userId).first<{ id: string }>();
  const now = Date.now();
  if (existing) {
    await db.prepare("UPDATE customers SET email = ?, full_name = ?, updated_at = ? WHERE id = ?")
      .bind(user.email.toLowerCase(), user.fullName, now, existing.id).run();
    return existing.id;
  }
  const id = crypto.randomUUID();
  await db.prepare("INSERT INTO customers (id, auth_user_id, email, full_name, marketing_consent, created_at, updated_at) VALUES (?, ?, ?, ?, 0, ?, ?)")
    .bind(id, user.userId, user.email.toLowerCase(), user.fullName, now, now).run();
  return id;
}

export function reference(prefix: string) {
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  return `${prefix}-${date}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function enforceRateLimit(db: D1Database, request: Request, scope: string, maximum: number, windowMs: number) {
  const address = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const bucket = Math.floor(Date.now() / windowMs);
  const key = `${scope}:${await sha256(address)}:${bucket}`;
  const expiresAt = (bucket + 1) * windowMs;
  const result = await db.prepare("INSERT INTO rate_limits (key, count, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET count = count + 1 RETURNING count")
    .bind(key, expiresAt).first<{ count: number }>();
  if ((result?.count ?? maximum + 1) > maximum) throw new CommerceError("rate_limited", "Too many requests. Please wait and try again.", 429);
}

export async function reserveInventory(db: D1Database, orderId: string, productSlug: string, quantity: number, expiresAt: number) {
  const now = Date.now();
  const guarded = await db.prepare("UPDATE products SET inventory_reserved = inventory_reserved + ?, updated_at = ? WHERE slug = ? AND inventory_on_hand - inventory_reserved >= ?")
    .bind(quantity, now, productSlug, quantity).run();
  if ((guarded.meta.changes ?? 0) !== 1) throw new CommerceError("insufficient_inventory", "The requested quantity is no longer available.", 409, { productSlug });
  try {
    await db.prepare("INSERT INTO inventory_reservations (id, order_id, product_slug, quantity, status, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, 'active', ?, ?, ?)")
      .bind(crypto.randomUUID(), orderId, productSlug, quantity, expiresAt, now, now).run();
  } catch (error) {
    await db.prepare("UPDATE products SET inventory_reserved = MAX(0, inventory_reserved - ?), updated_at = ? WHERE slug = ?").bind(quantity, Date.now(), productSlug).run();
    throw error;
  }
}

export async function releaseOrderReservations(db: D1Database, orderId: string, status: "released" | "expired") {
  const reservations = await db.prepare("SELECT id, product_slug, quantity FROM inventory_reservations WHERE order_id = ? AND status = 'active'").bind(orderId).all<{ id: string; product_slug: string; quantity: number }>();
  const now = Date.now();
  for (const reservation of reservations.results) {
    await db.batch([
      db.prepare("UPDATE products SET inventory_reserved = MAX(0, inventory_reserved - ?), updated_at = ? WHERE slug = ? AND EXISTS (SELECT 1 FROM inventory_reservations WHERE id = ? AND status = 'active')").bind(reservation.quantity, now, reservation.product_slug, reservation.id),
      db.prepare("UPDATE inventory_reservations SET status = ?, updated_at = ? WHERE id = ? AND status = 'active'").bind(status, now, reservation.id),
    ]);
  }
}

export async function expireReservations(db: D1Database) {
  const expired = await db.prepare("SELECT DISTINCT order_id FROM inventory_reservations WHERE status = 'active' AND expires_at <= ?").bind(Date.now()).all<{ order_id: string }>();
  for (const row of expired.results) await releaseOrderReservations(db, row.order_id, "expired");
}
