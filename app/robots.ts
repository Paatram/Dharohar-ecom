import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteOrigin();
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/account", "/cart", "/checkout", "/search", "/contact"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
