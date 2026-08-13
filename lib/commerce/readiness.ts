export const verificationFields = [
  ["exact_images_verified", "exact product imagery"],
  ["composition_verified", "metal composition"],
  ["dimensions_verified", "dimensions and capacity"],
  ["packed_weight_verified", "packed shipping weight"],
  ["tax_verified", "GST classification"],
  ["care_verified", "care instructions"],
  ["compatibility_verified", "heat-source compatibility"],
  ["return_policy_verified", "return eligibility"],
  ["dispatch_sla_verified", "dispatch SLA"],
] as const;

export type ReadinessProduct = Record<(typeof verificationFields)[number][0], number | boolean> & {
  slug: string;
  commerce_status: string;
  inventory_on_hand: number;
  inventory_reserved: number;
  hsn_code?: string | null;
  gst_basis_points?: number | null;
  packed_weight_grams?: number | null;
  package_length_mm?: number | null;
  package_width_mm?: number | null;
  package_height_mm?: number | null;
  return_window_days?: number | null;
  dispatch_min_days?: number | null;
  dispatch_max_days?: number | null;
  exact_image_urls_json?: string | null;
  composition_text?: string | null;
  dimensions_text?: string | null;
  care_text?: string | null;
  compatibility_text?: string | null;
  return_policy_text?: string | null;
  dispatch_sla_text?: string | null;
};

export function missingProductFacts(product: ReadinessProduct): string[] {
  const missing: string[] = verificationFields.filter(([field]) => !product[field]).map(([, label]) => label);
  if (product.exact_images_verified && !product.exact_image_urls_json) missing.push("exact image URLs");
  if (product.composition_verified && !product.composition_text) missing.push("composition value");
  if (product.dimensions_verified && !product.dimensions_text) missing.push("dimensions value");
  if (product.care_verified && !product.care_text) missing.push("care value");
  if (product.compatibility_verified && !product.compatibility_text) missing.push("compatibility value");
  if (product.return_policy_verified && !product.return_policy_text) missing.push("return-policy value");
  if (product.dispatch_sla_verified && !product.dispatch_sla_text) missing.push("dispatch-SLA value");
  if (product.tax_verified && (!product.hsn_code || product.gst_basis_points == null)) missing.push("HSN and GST rate values");
  if (product.packed_weight_verified && (!product.packed_weight_grams || !product.package_length_mm || !product.package_width_mm || !product.package_height_mm)) missing.push("packed weight and package dimensions");
  if (product.return_policy_verified && product.return_window_days == null) missing.push("return-window value");
  if (product.dispatch_sla_verified && (product.dispatch_min_days == null || product.dispatch_max_days == null)) missing.push("dispatch-range values");
  if (product.commerce_status !== "active") missing.push("commerce activation");
  if (product.inventory_on_hand - product.inventory_reserved < 1) missing.push("available inventory");
  return missing;
}

export function isCheckoutReady(product: ReadinessProduct) {
  return missingProductFacts(product).length === 0;
}
