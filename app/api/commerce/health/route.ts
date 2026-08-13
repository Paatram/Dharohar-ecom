import { ensureCatalogSeeded } from "@/lib/commerce/data";
import { errorResponse, json } from "@/lib/commerce/http";
import { getDatabase, getProviderReadiness } from "@/lib/commerce/runtime";

export async function GET() {
  try {
    const providers = getProviderReadiness();
    const db = getDatabase();
    if (!db) return json({ ok: false, state: "database_unavailable", providers }, 503);
    await ensureCatalogSeeded(db);
    const counts = await db.prepare("SELECT commerce_status, COUNT(*) AS count FROM products GROUP BY commerce_status").all<{ commerce_status: string; count: number }>();
    return json({ ok: true, state: "operational_with_activation_gates", providers, catalog: counts.results });
  } catch (error) {
    return errorResponse(error);
  }
}

