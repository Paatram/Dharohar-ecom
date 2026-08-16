import { json } from "@/lib/commerce/http";

type PostalResponse = Array<{ Status?: string; Message?: string; PostOffice?: Array<{ District?: string; State?: string; Division?: string }> | null }>;

export async function GET(request: Request) {
  const pincode = new URL(request.url).searchParams.get("pincode")?.trim() ?? "";
  if (!/^\d{6}$/.test(pincode)) return json({ ok: false, message: "Enter a valid 6-digit Indian pincode." }, 400);
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, { headers: { accept: "application/json" }, next: { revalidate: 86400 } });
    if (!response.ok) throw new Error("postal_lookup_failed");
    const result = await response.json() as PostalResponse;
    const office = result[0]?.PostOffice?.[0];
    if (!office?.State || !(office.District || office.Division)) return json({ ok: false, message: "We could not find that pincode. Enter the city and state manually." }, 404);
    return Response.json({ ok: true, city: office.District || office.Division, state: office.State }, { headers: { "cache-control": "public, s-maxage=86400, stale-while-revalidate=604800", "x-content-type-options": "nosniff" } });
  } catch {
    return json({ ok: false, message: "Pincode lookup is temporarily unavailable. Enter the city and state manually." }, 503);
  }
}
