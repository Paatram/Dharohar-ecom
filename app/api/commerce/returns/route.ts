import { requireApiCustomer } from "@/lib/commerce/auth";
import { returnSchema } from "@/lib/commerce/contracts";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, returnSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { customerId } = await requireApiCustomer(db);
    const order = await db.prepare("SELECT id, fulfillment_status FROM orders WHERE order_number = ? AND customer_id = ?").bind(input.orderNumber, customerId).first<{ id: string; fulfillment_status: string }>();
    if (!order) return json({ ok: false, code: "order_not_found" }, 404);
    if (order.fulfillment_status !== "delivered") return json({ ok: false, code: "return_not_eligible", message: "Returns can start only after confirmed delivery." }, 409);
    const existing = await db.prepare("SELECT id FROM returns WHERE order_id = ? AND status NOT IN ('rejected', 'closed')").bind(order.id).first();
    if (existing) return json({ ok: false, code: "return_already_open" }, 409);
    const id = crypto.randomUUID();
    const now = Date.now();
    await db.prepare("INSERT INTO returns (id, order_id, customer_id, reason, status, created_at, updated_at) VALUES (?, ?, ?, ?, 'requested', ?, ?)").bind(id, order.id, customerId, input.reason, now, now).run();
    return json({ ok: true, id, status: "requested" }, 201);
  } catch (error) { return errorResponse(error); }
}

