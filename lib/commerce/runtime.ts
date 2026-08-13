import { env } from "cloudflare:workers";

export type CommerceRuntimeEnv = {
  DB?: D1Database;
  ADMIN_ACCOUNT_USER_IDS?: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
  SHIPROCKET_EMAIL?: string;
  SHIPROCKET_PASSWORD?: string;
  SHIPROCKET_PICKUP_PINCODE?: string;
  SHIPROCKET_PICKUP_LOCATION?: string;
  SHIPROCKET_WEBHOOK_SECRET?: string;
  NOTIFICATION_PROVIDER?: string;
};

export function getCommerceEnv(): CommerceRuntimeEnv {
  return env as unknown as CommerceRuntimeEnv;
}

export function getDatabase(): D1Database | null {
  return getCommerceEnv().DB ?? null;
}

export function getProviderReadiness() {
  const runtime = getCommerceEnv();
  return {
    database: Boolean(runtime.DB),
    payment: Boolean(runtime.RAZORPAY_KEY_ID && runtime.RAZORPAY_KEY_SECRET && runtime.RAZORPAY_WEBHOOK_SECRET),
    shipping: Boolean(runtime.SHIPROCKET_EMAIL && runtime.SHIPROCKET_PASSWORD && runtime.SHIPROCKET_PICKUP_PINCODE),
    notifications: Boolean(runtime.NOTIFICATION_PROVIDER),
  };
}
