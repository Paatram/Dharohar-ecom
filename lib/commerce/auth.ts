import { getChatGPTUser } from "@/app/chatgpt-auth";
import { upsertCustomer } from "@/lib/commerce/data";
import { CommerceError } from "@/lib/commerce/http";
import { getCommerceEnv } from "@/lib/commerce/runtime";

export async function requireApiCustomer(db: D1Database) {
  const user = await getChatGPTUser();
  if (!user) throw new CommerceError("authentication_required", "Sign in to continue.", 401);
  const customerId = await upsertCustomer(db, user);
  return { user, customerId };
}

export async function requireAdmin(db: D1Database) {
  const authenticated = await requireApiCustomer(db);
  const allowed = (getCommerceEnv().ADMIN_ACCOUNT_USER_IDS ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  if (!allowed.includes(authenticated.user.userId)) {
    throw new CommerceError("forbidden", "This account does not have operations access.", 403);
  }
  return authenticated;
}

