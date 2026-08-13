// Vercel does not expose Cloudflare bindings. The commerce API detects this
// empty runtime and returns a controlled unavailable response instead of
// accepting an order without durable storage.
export const env = process.env;
