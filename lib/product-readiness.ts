import type { CatalogProduct } from "./catalog.ts";

export type VerifiedProductFacts = {
  exactImagesApproved: boolean;
  composition: string | null;
  foodContactLining: string | null;
  dimensions: string | null;
  netWeight: string | null;
  packedDimensions: string | null;
  packedWeight: string | null;
  capacity: string | null;
  compatibility: string | null;
  careInstructions: string | null;
  hsnCode: string | null;
  gstRate: number | null;
  dispatchSla: string | null;
  returnEligibility: string | null;
  stockReconciled: boolean;
};

const pendingFacts: VerifiedProductFacts = {
  exactImagesApproved: false,
  composition: null,
  foodContactLining: null,
  dimensions: null,
  netWeight: null,
  packedDimensions: null,
  packedWeight: null,
  capacity: null,
  compatibility: null,
  careInstructions: null,
  hsnCode: null,
  gstRate: null,
  dispatchSla: null,
  returnEligibility: null,
  stockReconciled: false,
};

// Exact-SKU overrides belong here only after the evidence is reviewed and retained.
const verifiedFactsBySlug: Record<string, Partial<VerifiedProductFacts>> = {
  "peetal-kadai": {
    exactImagesApproved: true,
    capacity: "1 qt.",
  },
  "steel-copper-glass-set-six": {
    exactImagesApproved: true,
    composition: "Steel with copper lining",
  },
  "kansa-thali-set-two": {
    exactImagesApproved: true,
  },
  "brass-masala-daani": {
    exactImagesApproved: true,
  },
};

export function productFacts(product: CatalogProduct): VerifiedProductFacts {
  return { ...pendingFacts, ...verifiedFactsBySlug[product.slug] };
}

export function productIsCommerceReady(product: CatalogProduct) {
  const facts = productFacts(product);
  return facts.exactImagesApproved && facts.stockReconciled && Object.entries(facts).every(([key, value]) => key === "capacity" || value !== null);
}

export const pendingFactLabel = "Pending exact-SKU verification";
