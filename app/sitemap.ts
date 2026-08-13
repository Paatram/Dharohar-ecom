import type { MetadataRoute } from "next";
import { audienceContent, categoryContent, products } from "@/lib/catalog";
import { getSiteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteOrigin();
  const now = new Date();
  return [
    { url: baseUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...["materials", "our-craft", "care"].map((slug) => ({ url: `${baseUrl}/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .6 })),
    ...Object.keys(categoryContent).map((slug) => ({ url: `${baseUrl}/collections/${slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: .8 })),
    ...Object.keys(audienceContent).map((slug) => ({ url: `${baseUrl}/shop-for/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: .7 })),
    ...products.map((product) => ({ url: `${baseUrl}/products/${product.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: .8 })),
  ];
}
