import { quoteSchema } from "@/lib/commerce/contracts";
import { enforceRateLimit } from "@/lib/commerce/data";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { buildVerifiedQuote } from "@/lib/commerce/quote";
import { getDatabase } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, quoteSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable", message: "Secure checkout storage is not available on this deployment." }, 503);
    await enforceRateLimit(db, request, "quote", 60, 10 * 60_000);
    const result = await buildVerifiedQuote(db, input);
    return json({ ok: true, quote: result.quote, shipping: result.shipping });
  } catch (error) {
    return errorResponse(error);
  }
}
