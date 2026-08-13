import { requireApiCustomer } from "@/lib/commerce/auth";
import { wishlistSchema } from "@/lib/commerce/contracts";
import { ensureCatalogSeeded } from "@/lib/commerce/data";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function GET() {
  try {
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { customerId } = await requireApiCustomer(db);
    const result = await db.prepare("SELECT product_slug FROM saved_products WHERE customer_id = ? ORDER BY created_at DESC").bind(customerId).all<{ product_slug: string }>();
    return json({ ok: true, productSlugs: result.results.map((row) => row.product_slug) });
  } catch (error) { return errorResponse(error); }
}

export async function PUT(request: Request) {
  try {
    const input = await parseJson(request, wishlistSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    await ensureCatalogSeeded(db);
    const { customerId } = await requireApiCustomer(db);
    const now = Date.now();
    await db.batch([
      db.prepare("DELETE FROM saved_products WHERE customer_id = ?").bind(customerId),
      ...[...new Set(input.productSlugs)].map((slug) => db.prepare("INSERT OR IGNORE INTO saved_products (customer_id, product_slug, created_at) SELECT ?, slug, ? FROM products WHERE slug = ?").bind(customerId, now, slug)),
    ]);
    return json({ ok: true, count: new Set(input.productSlugs).size });
  } catch (error) { return errorResponse(error); }
}

