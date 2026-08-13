import test from "node:test";
import assert from "node:assert/strict";
import { isCheckoutReady, missingProductFacts } from "../lib/commerce/readiness.ts";

const verified = {
  slug: "test-piece",
  commerce_status: "active",
  inventory_on_hand: 5,
  inventory_reserved: 0,
  exact_images_verified: 1,
  composition_verified: 1,
  dimensions_verified: 1,
  packed_weight_verified: 1,
  tax_verified: 1,
  care_verified: 1,
  compatibility_verified: 1,
  return_policy_verified: 1,
  dispatch_sla_verified: 1,
  exact_image_urls_json: JSON.stringify(["https://example.com/1.webp"]),
  composition_text: "Verified composition",
  dimensions_text: "Verified dimensions",
  care_text: "Verified care guidance",
  compatibility_text: "Verified compatibility",
  return_policy_text: "Verified return policy",
  dispatch_sla_text: "Verified dispatch SLA",
  hsn_code: "7418",
  gst_basis_points: 1800,
  packed_weight_grams: 1000,
  package_length_mm: 200,
  package_width_mm: 200,
  package_height_mm: 100,
  return_window_days: 7,
  dispatch_min_days: 1,
  dispatch_max_days: 3,
};

test("a fully evidenced active SKU is checkout-ready", () => {
  assert.equal(isCheckoutReady(verified), true);
  assert.deepEqual(missingProductFacts(verified), []);
});

test("an unverified SKU fails closed", () => {
  const product = { ...verified, exact_images_verified: 0, commerce_status: "verification_required" };
  const missing = missingProductFacts(product);
  assert.equal(isCheckoutReady(product), false);
  assert.ok(missing.includes("exact product imagery"));
  assert.ok(missing.includes("commerce activation"));
});

test("a verification flag cannot hide a missing source value", () => {
  const product = { ...verified, gst_basis_points: null };
  assert.ok(missingProductFacts(product).includes("HSN and GST rate values"));
});

test("reserved stock is not offered twice", () => {
  const product = { ...verified, inventory_on_hand: 3, inventory_reserved: 3 };
  assert.ok(missingProductFacts(product).includes("available inventory"));
});

