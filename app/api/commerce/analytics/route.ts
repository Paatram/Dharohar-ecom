import { z } from "zod";
import { enforceRateLimit } from "@/lib/commerce/data";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

const schema = z.object({
  eventName: z.enum(["product_view", "add_to_cart", "begin_checkout", "search", "care_plan_saved"]),
  pagePath: z.string().trim().startsWith("/").max(300).optional(),
  sessionId: z.string().trim().max(100).optional(),
  properties: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
  consented: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, schema);
    const db = getDatabase();
    if (!db) return new Response(null, { status: 204 });
    await enforceRateLimit(db, request, "analytics", 120, 60 * 60_000);
    await db.prepare("INSERT INTO analytics_events (id, session_id, event_name, page_path, properties_json, consented, created_at) VALUES (?, ?, ?, ?, ?, 1, ?)")
      .bind(crypto.randomUUID(), input.sessionId ?? null, input.eventName, input.pagePath ?? null, JSON.stringify(input.properties ?? {}), Date.now()).run();
    return json({ ok: true }, 201);
  } catch (error) { return errorResponse(error); }
}
