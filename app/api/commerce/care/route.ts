import { careSchema } from "@/lib/commerce/contracts";
import { enforceRateLimit } from "@/lib/commerce/data";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase, getProviderReadiness } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, careSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable", message: "Your device plan is saved, but account sync is unavailable." }, 503);
    await enforceRateLimit(db, request, "care", 10, 60 * 60_000);
    const now = Date.now();
    const status = input.reminderConsent && getProviderReadiness().notifications ? "reminders_queued" : "interest_registered";
    const id = crypto.randomUUID();
    await db.prepare("INSERT INTO care_subscriptions (id, email, plan, status, reminder_consent, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(id, input.email.toLowerCase(), `${input.material}:${input.plan}`, status, input.reminderConsent ? 1 : 0, now, now).run();
    return json({ ok: true, id, status, paid: false, message: "Care preference saved. No payment has been taken." }, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
