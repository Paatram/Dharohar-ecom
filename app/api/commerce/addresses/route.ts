import { requireApiCustomer } from "@/lib/commerce/auth";
import { addressSchema } from "@/lib/commerce/contracts";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function GET() {
  try {
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { customerId } = await requireApiCustomer(db);
    const result = await db.prepare("SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC, created_at DESC").bind(customerId).all();
    return json({ ok: true, addresses: result.results });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, addressSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { customerId } = await requireApiCustomer(db);
    const id = crypto.randomUUID();
    const statements = [];
    if (input.isDefault) statements.push(db.prepare("UPDATE addresses SET is_default = 0 WHERE customer_id = ?").bind(customerId));
    statements.push(db.prepare("INSERT INTO addresses (id, customer_id, label, recipient_name, phone, line1, line2, city, state, pincode, gstin, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(id, customerId, input.label, input.recipientName, input.phone, input.line1, input.line2 ?? null, input.city, input.state, input.pincode, input.gstin ?? null, input.isDefault ? 1 : 0, Date.now()));
    await db.batch(statements);
    return json({ ok: true, id }, 201);
  } catch (error) { return errorResponse(error); }
}

