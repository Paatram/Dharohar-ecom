import type { z } from "zod";
import type { quoteSchema } from "@/lib/commerce/contracts";
import { ensureCatalogSeeded, readProducts } from "@/lib/commerce/data";
import { CommerceError } from "@/lib/commerce/http";
import { quoteShipping } from "@/lib/commerce/providers/shiprocket";
import { missingProductFacts } from "@/lib/commerce/readiness";

export async function buildVerifiedQuote(db: D1Database, input: z.infer<typeof quoteSchema>) {
  await ensureCatalogSeeded(db);
  const rows = await readProducts(db, input.items.map((item) => item.slug));
  const rowMap = new Map(rows.map((row) => [row.slug, row]));
  const blockers = input.items.flatMap((item) => {
    const product = rowMap.get(item.slug);
    if (!product) return [{ slug: item.slug, name: item.slug, missing: ["catalog record"] }];
    const missing = missingProductFacts(product);
    if (product.inventory_on_hand - product.inventory_reserved < item.quantity && !missing.includes("available inventory")) missing.push("requested inventory quantity");
    return missing.length ? [{ slug: item.slug, name: product.name, missing }] : [];
  });
  const indicativeSubtotalPaise = input.items.reduce((total, item) => total + (rowMap.get(item.slug)?.indicative_price_paise ?? 0) * item.quantity, 0);
  if (blockers.length) throw new CommerceError("checkout_not_ready", "These pieces are visible for catalogue review but are not yet safe to sell.", 409, { indicativeSubtotalPaise, blockers });
  if (input.coupon) throw new CommerceError("coupon_unavailable", "This coupon has not been configured or verified.", 422);
  if (input.giftWrap) throw new CommerceError("gift_wrap_unavailable", "Gift-wrap pricing and fulfilment have not been verified.", 422);
  if (!input.pincode) throw new CommerceError("pincode_required", "Enter a six-digit delivery pincode.", 422);

  let subtotalPaise = 0;
  let taxPaise = 0;
  let weightGrams = 0;
  for (const item of input.items) {
    const product = rowMap.get(item.slug)!;
    const line = product.indicative_price_paise * item.quantity;
    const rate = product.gst_basis_points!;
    const lineTax = product.price_includes_tax ? Math.round((line * rate) / (10_000 + rate)) : Math.round((line * rate) / 10_000);
    taxPaise += lineTax;
    subtotalPaise += product.price_includes_tax ? line - lineTax : line;
    weightGrams += product.packed_weight_grams! * item.quantity;
  }
  const shipping = await quoteShipping({ pincode: input.pincode, weightGrams, declaredValuePaise: subtotalPaise + taxPaise });
  const totalPaise = subtotalPaise + taxPaise + shipping.shippingPaise;
  return { rows, rowMap, shipping, quote: { currency: "INR", subtotalPaise, discountPaise: 0, taxPaise, shippingPaise: shipping.shippingPaise, totalPaise } };
}

