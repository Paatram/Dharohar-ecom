import { enquirySchema } from "@/lib/commerce/contracts";
import { enforceRateLimit, reference, sha256 } from "@/lib/commerce/data";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase, getProviderReadiness } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, enquirySchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable", message: "Secure enquiry storage is unavailable. Download and retain your local draft." }, 503);
    await enforceRateLimit(db, request, "enquiry", 10, 60 * 60_000);
    const requestHash = await sha256(JSON.stringify(input));
    const providedKey = request.headers.get("idempotency-key")?.trim();
    const key = providedKey && providedKey.length <= 120 ? `enquiry:${providedKey}` : `enquiry:${requestHash}`;
    const existing = await db.prepare("SELECT response_json FROM idempotency_keys WHERE key = ? AND expires_at > ?").bind(key, Date.now()).first<{ response_json: string | null }>();
    if (existing?.response_json) return json(JSON.parse(existing.response_json), 200);
    const enquiryReference = reference(input.kind === "trade" ? "DH-BRIEF" : "DH-ENQUIRY");
    const response = { ok: true, reference: enquiryReference, stored: true, notificationStatus: getProviderReadiness().notifications ? "queued" : "blocked_unconfigured" };
    const now = Date.now();
    await db.batch([
      db.prepare("INSERT INTO enquiries (id, reference, kind, email, name, subject, payload_json, status, consent_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'received', ?, ?)")
        .bind(crypto.randomUUID(), enquiryReference, input.kind, input.email.toLowerCase(), input.name, input.subject, JSON.stringify(input.payload), now, now),
      db.prepare("INSERT INTO idempotency_keys (key, scope, request_hash, response_status, response_json, expires_at, created_at) VALUES (?, 'enquiry', ?, 200, ?, ?, ?)")
        .bind(key, requestHash, JSON.stringify(response), now + 86_400_000, now),
      db.prepare("INSERT INTO notification_outbox (id, channel, template, destination, payload_json, status, attempts, created_at, updated_at) VALUES (?, 'email', 'new_enquiry', ?, ?, ?, 0, ?, ?)")
        .bind(crypto.randomUUID(), input.email.toLowerCase(), JSON.stringify({ reference: enquiryReference }), response.notificationStatus, now, now),
    ]);
    return json(response, 201);
  } catch (error) {
    return errorResponse(error);
  }
}
