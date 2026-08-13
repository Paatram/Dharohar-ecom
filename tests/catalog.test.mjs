import assert from "node:assert/strict";
import test from "node:test";
import {
  audienceContent,
  catalogSummary,
  categoryContent,
  products,
  subcategoryContent,
} from "../lib/catalog.ts";
import { bundles, bundleProducts, productUse, searchProducts } from "../lib/merchandising.ts";
import { productFacts, productIsCommerceReady } from "../lib/product-readiness.ts";

test("catalog preserves the supplied launch inventory totals", () => {
  assert.deepEqual(catalogSummary(), {
    skus: 34,
    units: 216,
    landedCostPaise: 48_383_000,
    selloutRevenuePaise: 56_309_850,
  });
});

test("every launch product has a unique, internally valid record", () => {
  const slugs = new Set();
  for (const product of products) {
    assert.match(product.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(slugs.has(product.slug), false, `duplicate slug: ${product.slug}`);
    slugs.add(product.slug);
    assert.ok(product.launchStock > 0, `${product.slug}: stock must be positive`);
    assert.ok(product.landedCostPaise > 0, `${product.slug}: cost must be positive`);
    assert.ok(product.sellingPricePaise > product.landedCostPaise, `${product.slug}: price must exceed landed cost`);
    assert.ok(product.image.startsWith("/images/dharohar/"), `${product.slug}: image must use approved Dharohar assets`);
    assert.ok(product.category in categoryContent, `${product.slug}: unknown category`);
    assert.ok(product.audiences.length > 0, `${product.slug}: missing audience`);
    for (const audience of product.audiences) {
      assert.ok(audience in audienceContent, `${product.slug}: unknown audience ${audience}`);
    }
  }
});

test("customer-facing audience journeys remain complete", () => {
  assert.deepEqual(Object.keys(audienceContent).sort(), [
    "gifting",
    "hotels",
    "households",
    "interior-designers",
    "offices",
    "restaurants",
  ]);
});

test("every product belongs to exactly one category subcategory", () => {
  const assignedSlugs = Object.values(subcategoryContent).flatMap((subcategories) =>
    subcategories.flatMap((subcategory) => subcategory.productSlugs),
  );
  assert.equal(new Set(assignedSlugs).size, assignedSlugs.length, "a product appears in more than one subcategory");
  assert.deepEqual([...assignedSlugs].sort(), products.map((product) => product.slug).sort());
  for (const [category, subcategories] of Object.entries(subcategoryContent)) {
    for (const subcategory of subcategories) {
      for (const slug of subcategory.productSlugs) {
        assert.equal(products.find((product) => product.slug === slug)?.category, category, `${slug}: assigned to the wrong category`);
      }
    }
  }
});

test("commerce discovery is complete and typo tolerant", () => {
  assert.ok(searchProducts("pital kadai").some((product) => product.slug === "peetal-kadai"));
  assert.ok(searchProducts("copper drinking").every((product) => product.material === "copper"));
  for (const product of products) assert.ok(productUse(product).length > 0, `${product.slug}: missing use mapping`);
});

test("curated bundles reference real, unique products", () => {
  for (const bundle of bundles) {
    assert.equal(new Set(bundle.productSlugs).size, bundle.productSlugs.length, `${bundle.slug}: duplicate product`);
    assert.equal(bundleProducts(bundle).length, bundle.productSlugs.length, `${bundle.slug}: missing product`);
  }
});

test("commerce activation fails closed while exact-SKU facts are pending", () => {
  for (const product of products) {
    assert.equal(productIsCommerceReady(product), false, `${product.slug}: must not activate without evidence`);
    const facts = productFacts(product);
    assert.equal(facts.exactImagesApproved, false);
    assert.equal(facts.stockReconciled, false);
  }
});
