import { requireAdmin } from "@/lib/commerce/auth";
import { inventoryAdjustmentSchema } from "@/lib/commerce/contracts";
import { ensureCatalogSeeded, sha256 } from "@/lib/commerce/data";
import { CommerceError, errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, inventoryAdjustmentSchema);
    const idempotency = request.headers.get("idempotency-key")?.trim();
    if (!idempotency || idempotency.length > 120) throw new CommerceError("idempotency_key_required", "A valid Idempotency-Key header is required.", 400);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { user } = await requireAdmin(db);
    await ensureCatalogSeeded(db);
    const key = `inventory:${idempotency}`;
    const existing = await db.prepare("SELECT response_json FROM idempotency_keys WHERE key = ? AND expires_at > ?").bind(key, Date.now()).first<{ response_json: string | null }>();
    if (existing?.response_json) return json(JSON.parse(existing.response_json));
    const current = await db.prepare("SELECT inventory_on_hand FROM products WHERE slug = ?").bind(input.productSlug).first<{ inventory_on_hand: number }>();
    if (!current) return json({ ok: false, code: "product_not_found" }, 404);
    const next = current.inventory_on_hand + input.quantity;
    if (next < 0) return json({ ok: false, code: "negative_inventory", message: "This adjustment would create negative stock." }, 409);
    const now = Date.now();
    const response = { ok: true, productSlug: input.productSlug, inventoryOnHand: next };
    const hash = await sha256(JSON.stringify(input));
    await db.batch([
      db.prepare("UPDATE products SET inventory_on_hand = ?, updated_at = ? WHERE slug = ? AND inventory_on_hand = ?").bind(next, now, input.productSlug, current.inventory_on_hand),
      db.prepare("INSERT INTO inventory_movements (id, product_slug, movement_type, quantity, reason, actor_id, created_at) VALUES (?, ?, 'manual_adjustment', ?, ?, ?, ?)").bind(crypto.randomUUID(), input.productSlug, input.quantity, input.reason, user.userId, now),
      db.prepare("INSERT INTO audit_events (id, actor_id, action, subject_type, subject_id, metadata_json, created_at) VALUES (?, ?, 'inventory.adjust', 'product', ?, ?, ?)").bind(crypto.randomUUID(), user.userId, input.productSlug, JSON.stringify({ quantity: input.quantity, reason: input.reason }), now),
      db.prepare("INSERT INTO idempotency_keys (key, scope, request_hash, response_status, response_json, expires_at, created_at) VALUES (?, 'inventory', ?, 200, ?, ?, ?)").bind(key, hash, JSON.stringify(response), now + 86_400_000, now),
    ]);
    return json(response);
  } catch (error) { return errorResponse(error); }
}

