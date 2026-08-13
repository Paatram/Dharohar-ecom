"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { categoryContent, type CatalogProduct, type ProductCategory } from "@/lib/catalog";

type CategoryFilter = ProductCategory | "all";

export function HomeProductExplorer({ initialProducts }: { initialProducts: CatalogProduct[] }) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const filtered = useMemo(() => category === "all" ? initialProducts : initialProducts.filter((product) => product.category === category), [category, initialProducts]);
  const options: { value: CategoryFilter; label: string; count: number }[] = [
    { value: "all", label: "All products", count: initialProducts.length },
    ...Object.entries(categoryContent).map(([value, content]) => ({ value: value as ProductCategory, label: content.name, count: initialProducts.filter((product) => product.category === value).length })),
  ];

  return <div className="home-product-explorer">
    <div className="category-filter-toggles" role="group" aria-label="Filter products by category">
      {options.map((option) => <button className={category === option.value ? "active" : ""} type="button" key={option.value} aria-pressed={category === option.value} onClick={() => setCategory(option.value)}><span>{option.label}</span><small>{option.count}</small></button>)}
    </div>
    <p className="category-filter-status" aria-live="polite"><strong>{filtered.length}</strong> {category === "all" ? "products in the complete collection" : `products in ${categoryContent[category].name}`}</p>
    <div className="product-grid product-grid-light home-product-grid">
      {filtered.map((product) => <ProductCard product={product} key={product.slug} />)}
    </div>
  </div>;
}
