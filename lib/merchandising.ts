import { products, type CatalogProduct, type Material, type ProductCategory } from "./catalog.ts";

export type ProductUse = "cooking" | "drinking" | "dining" | "serving";

export const materialLabels: Record<Material, string> = {
  brass: "Peetal · Brass",
  copper: "Tamra · Copper",
  kansa: "Kansa · Bronze",
  mixed: "Mixed material",
};

export const materialStories: Record<Exclude<Material, "mixed">, { shortName: string; description: string }> = {
  copper: { shortName: "Copper", description: "Luminous drinkware that develops a natural, expressive patina." },
  brass: { shortName: "Peetal", description: "Warm, weighty cookware and tableware rooted in the Indian kitchen." },
  kansa: { shortName: "Kansa", description: "Grounded bronze dining pieces with a calm, enduring table presence." },
};

export const useLabels: Record<ProductUse, string> = {
  cooking: "Cooking",
  drinking: "Drinking",
  dining: "Dining",
  serving: "Serving",
};

export function productUse(product: CatalogProduct): ProductUse[] {
  if (product.category === "cookware") return ["cooking", "serving"];
  if (product.category === "drinkware") return ["drinking", "serving"];
  if (product.category === "kitchen-tools") return product.slug.includes("serving") || product.slug.includes("kalchul") ? ["cooking", "serving"] : ["cooking", "dining"];
  return ["dining", "serving"];
}

export const giftBudgets = [
  { slug: "under-1500", label: "Under ₹1,500", min: 0, max: 150000 },
  { slug: "1500-3000", label: "₹1,500–₹3,000", min: 150000, max: 300000 },
  { slug: "3000-7500", label: "₹3,000–₹7,500", min: 300000, max: 750000 },
  { slug: "above-7500", label: "Above ₹7,500", min: 750000, max: Number.POSITIVE_INFINITY },
] as const;

export const giftOccasions = [
  { slug: "wedding", name: "Wedding", description: "Heirloom-scale dining and serving pieces for a new household." },
  { slug: "housewarming", name: "Housewarming", description: "Useful metal objects selected to enter everyday rituals." },
  { slug: "corporate", name: "Corporate", description: "Considered client and team gifts with project-led fulfilment." },
  { slug: "festive", name: "Festive", description: "Warm table and drinkware pieces for shared celebrations." },
] as const;

export type Bundle = {
  slug: string;
  name: string;
  description: string;
  productSlugs: string[];
};

export const bundles: Bundle[] = [
  { slug: "dosa-ritual", name: "The Dosa Ritual", description: "A tawa and palta pairing for an essential southern breakfast ritual.", productSlugs: ["dosa-tawa", "peetal-palta"] },
  { slug: "bedside-water", name: "The Bedside Water Ritual", description: "A coordinated bottle and glass set for a calm nightly routine.", productSlugs: ["copper-bottle-glass-set-one", "copper-glass-lacquered"] },
  { slug: "peetal-table", name: "The Peetal Table", description: "A dinner set and katori set for an expansive brass place setting.", productSlugs: ["peetal-dinner-set-plain", "peetal-katori-set-plain"] },
];

export function bundleProducts(bundle: Bundle) {
  const included = new Set(bundle.productSlugs);
  return products.filter((product) => included.has(product.slug));
}

export function searchProducts(query: string) {
  const normalised = query.trim().toLowerCase().replace(/pital/g, "peetal").replace(/bronze/g, "kansa").replace(/brass/g, "peetal");
  if (!normalised) return [];
  return products.filter((product) => {
    const material = materialLabels[product.material];
    const haystack = `${product.name} ${product.description} ${product.finish} ${material} ${product.category} ${productUse(product).join(" ")}`.toLowerCase();
    return normalised.split(/\s+/).every((term) => haystack.includes(term));
  });
}

export const categoryUseMap: Record<ProductCategory, ProductUse[]> = {
  cookware: ["cooking", "serving"],
  drinkware: ["drinking", "serving"],
  "kitchen-tools": ["cooking", "dining", "serving"],
  "kitchen-sets": ["dining", "serving"],
};
