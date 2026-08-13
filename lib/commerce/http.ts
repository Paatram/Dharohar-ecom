import type { ZodType } from "zod";

export function json(data: unknown, status = 200, requestId = crypto.randomUUID()) {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "x-request-id": requestId,
    },
  });
}

export async function parseJson<T>(request: Request, schema: ZodType<T>): Promise<T> {
  const length = Number(request.headers.get("content-length") ?? "0");
  if (length > 50_000) throw new CommerceError("payload_too_large", "Request body is too large.", 413);
  let value: unknown;
  try {
    value = await request.json();
  } catch {
    throw new CommerceError("invalid_json", "Request body must be valid JSON.", 400);
  }
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    throw new CommerceError("invalid_request", "Please check the submitted fields.", 400, parsed.error.flatten());
  }
  return parsed.data;
}

export class CommerceError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown,
  ) {
    super(message);
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof CommerceError) {
    return json({ ok: false, code: error.code, message: error.message, details: error.details }, error.status);
  }
  console.error("Commerce API error", error);
  return json({ ok: false, code: "internal_error", message: "The request could not be completed safely." }, 500);
}

