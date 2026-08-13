import { CommerceError } from "@/lib/commerce/http";
import { getCommerceEnv } from "@/lib/commerce/runtime";

async function shiprocketToken() {
  const runtime = getCommerceEnv();
  if (!runtime.SHIPROCKET_EMAIL || !runtime.SHIPROCKET_PASSWORD) throw new CommerceError("shipping_unavailable", "Courier serviceability is not configured.", 503);
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email: runtime.SHIPROCKET_EMAIL, password: runtime.SHIPROCKET_PASSWORD }),
  });
  if (!response.ok) throw new CommerceError("shipping_provider_error", "Courier authentication failed.", 502);
  const payload = await response.json() as { token?: string };
  if (!payload.token) throw new CommerceError("shipping_provider_error", "Courier authentication returned no token.", 502);
  return payload.token;
}

export async function createShiprocketShipment(input: {
  orderNumber: string;
  orderDate: string;
  email: string;
  address: { recipientName: string; phone: string; line1: string; line2?: string; city: string; state: string; pincode: string };
  items: Array<{ name: string; sku: string; units: number; sellingPriceRupees: number }>;
  subtotalRupees: number;
  weightGrams: number;
  lengthMm: number;
  widthMm: number;
  heightMm: number;
  courierId: number;
}) {
  const runtime = getCommerceEnv();
  if (!runtime.SHIPROCKET_PICKUP_LOCATION) throw new CommerceError("shipping_unavailable", "Shiprocket pickup location is not configured.", 503);
  const token = await shiprocketToken();
  const [firstName, ...lastParts] = input.address.recipientName.trim().split(/\s+/);
  const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({
      order_id: input.orderNumber,
      order_date: input.orderDate,
      pickup_location: runtime.SHIPROCKET_PICKUP_LOCATION,
      billing_customer_name: firstName,
      billing_last_name: lastParts.join(" ") || "-",
      billing_address: input.address.line1,
      billing_address_2: input.address.line2 ?? "",
      billing_city: input.address.city,
      billing_pincode: input.address.pincode,
      billing_state: input.address.state,
      billing_country: "India",
      billing_email: input.email,
      billing_phone: input.address.phone,
      shipping_is_billing: true,
      order_items: input.items.map((item) => ({ name: item.name, sku: item.sku, units: item.units, selling_price: item.sellingPriceRupees })),
      payment_method: "Prepaid",
      sub_total: input.subtotalRupees,
      length: input.lengthMm / 10,
      breadth: input.widthMm / 10,
      height: input.heightMm / 10,
      weight: input.weightGrams / 1000,
    }),
  });
  if (!response.ok) throw new CommerceError("shipping_provider_error", "Shiprocket could not create the shipment.", 502);
  const created = await response.json() as { order_id?: number; shipment_id?: number; status?: string };
  if (!created.shipment_id) throw new CommerceError("shipping_provider_error", "Shiprocket returned no shipment identifier.", 502);
  const awbResponse = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
    method: "POST",
    headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ shipment_id: created.shipment_id, courier_id: input.courierId }),
  });
  if (!awbResponse.ok) throw new CommerceError("shipping_provider_error", "Shipment was created, but AWB assignment requires operations review.", 502, { shipmentId: created.shipment_id });
  const assigned = await awbResponse.json() as { response?: { data?: { awb_code?: string; courier_name?: string; assigned_date_time?: string } } };
  return { providerOrderId: String(created.order_id ?? ""), providerShipmentId: String(created.shipment_id), status: created.status ?? "created", awb: assigned.response?.data?.awb_code ?? null, courier: assigned.response?.data?.courier_name ?? null };
}

export async function quoteShipping(input: { pincode: string; weightGrams: number; declaredValuePaise: number }) {
  const runtime = getCommerceEnv();
  if (!runtime.SHIPROCKET_PICKUP_PINCODE) throw new CommerceError("shipping_unavailable", "The dispatch pincode is not configured.", 503);
  const token = await shiprocketToken();
  const url = new URL("https://apiv2.shiprocket.in/v1/external/courier/serviceability/");
  url.searchParams.set("pickup_postcode", runtime.SHIPROCKET_PICKUP_PINCODE);
  url.searchParams.set("delivery_postcode", input.pincode);
  url.searchParams.set("cod", "0");
  url.searchParams.set("weight", Math.max(0.01, input.weightGrams / 1000).toFixed(2));
  url.searchParams.set("declared_value", (input.declaredValuePaise / 100).toFixed(2));
  const response = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
  if (!response.ok) throw new CommerceError("shipping_provider_error", "Courier serviceability could not be checked.", 502);
  const payload = await response.json() as { data?: { available_courier_companies?: Array<{ courier_company_id: number; courier_name: string; rate: number; estimated_delivery_days: string; etd?: string }> } };
  const options = payload.data?.available_courier_companies ?? [];
  if (!options.length) throw new CommerceError("pincode_unserviceable", "No prepaid courier service is available for this pincode.", 422);
  options.sort((a, b) => a.rate - b.rate);
  const selected = options[0];
  return { courierId: selected.courier_company_id, courierName: selected.courier_name, shippingPaise: Math.round(selected.rate * 100), estimatedDeliveryDays: selected.estimated_delivery_days, etd: selected.etd ?? null };
}
