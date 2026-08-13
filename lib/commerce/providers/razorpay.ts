import { CommerceError } from "@/lib/commerce/http";
import { getCommerceEnv } from "@/lib/commerce/runtime";

export async function createRazorpayOrder(input: { amountPaise: number; receipt: string; notes: Record<string, string> }) {
  const runtime = getCommerceEnv();
  if (!runtime.RAZORPAY_KEY_ID || !runtime.RAZORPAY_KEY_SECRET) {
    throw new CommerceError("payment_unavailable", "Payment processing is not configured.", 503);
  }
  const credentials = btoa(`${runtime.RAZORPAY_KEY_ID}:${runtime.RAZORPAY_KEY_SECRET}`);
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: { authorization: `Basic ${credentials}`, "content-type": "application/json" },
    body: JSON.stringify({ amount: input.amountPaise, currency: "INR", receipt: input.receipt.slice(0, 40), notes: input.notes }),
  });
  if (!response.ok) throw new CommerceError("payment_provider_error", "The payment provider could not create a secure order.", 502);
  return response.json() as Promise<{ id: string; amount: number; currency: string; status: string }>;
}

export async function verifyRazorpayWebhook(body: string, signature: string | null) {
  const secret = getCommerceEnv().RAZORPAY_WEBHOOK_SECRET;
  if (!secret || !signature) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  const expected = [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (expected.length !== signature.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) difference |= expected.charCodeAt(index) ^ signature.charCodeAt(index);
  return difference === 0;
}

