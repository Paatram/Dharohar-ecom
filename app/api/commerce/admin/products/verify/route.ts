import { requireAdmin } from "@/lib/commerce/auth";
import { productVerificationSchema } from "@/lib/commerce/contracts";
import { ensureCatalogSeeded } from "@/lib/commerce/data";
import { errorResponse, json, parseJson } from "@/lib/commerce/http";
import { getDatabase } from "@/lib/commerce/runtime";

export async function POST(request: Request) {
  try {
    const input = await parseJson(request, productVerificationSchema);
    const db = getDatabase();
    if (!db) return json({ ok: false, code: "database_unavailable" }, 503);
    const { user } = await requireAdmin(db);
    await ensureCatalogSeeded(db);
    const product = await db.prepare("SELECT slug FROM products WHERE slug = ?").bind(input.productSlug).first();
    if (!product) return json({ ok: false, code: "product_not_found" }, 404);
    const now = Date.now();
    await db.batch([
      db.prepare(`UPDATE products SET
        exact_image_urls_json = ?, composition_text = ?, dimensions_text = ?, care_text = ?, compatibility_text = ?, return_policy_text = ?, dispatch_sla_text = ?,
        hsn_code = ?, gst_basis_points = ?, price_includes_tax = ?, packed_weight_grams = ?, package_length_mm = ?, package_width_mm = ?, package_height_mm = ?,
        return_window_days = ?, dispatch_min_days = ?, dispatch_max_days = ?,
        exact_images_verified = 1, composition_verified = 1, dimensions_verified = 1, packed_weight_verified = 1, tax_verified = 1,
        care_verified = 1, compatibility_verified = 1, return_policy_verified = 1, dispatch_sla_verified = 1,
        commerce_status = 'active', updated_at = ? WHERE slug = ?`)
        .bind(JSON.stringify(input.exactImageUrls), input.compositionText, input.dimensionsText, input.careText, input.compatibilityText, input.returnPolicyText, input.dispatchSlaText, input.hsnCode, input.gstBasisPoints, input.priceIncludesTax ? 1 : 0, input.packedWeightGrams, input.packageLengthMm, input.packageWidthMm, input.packageHeightMm, input.returnWindowDays, input.dispatchMinDays, input.dispatchMaxDays, now, input.productSlug),
      db.prepare("INSERT INTO audit_events (id, actor_id, action, subject_type, subject_id, metadata_json, created_at) VALUES (?, ?, 'product.verify_and_activate', 'product', ?, ?, ?)")
        .bind(crypto.randomUUID(), user.userId, input.productSlug, JSON.stringify({ verifiedFields: Object.keys(input).filter((key) => key !== "productSlug") }), now),
    ]);
    return json({ ok: true, productSlug: input.productSlug, commerceStatus: "active", verifiedAt: now });
  } catch (error) { return errorResponse(error); }
}
