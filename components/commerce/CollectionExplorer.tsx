"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/storefront/ProductCard";
import { type CatalogProduct, type Material, formatInr } from "@/lib/catalog";
import { materialLabels, productUse, useLabels, type ProductUse } from "@/lib/merchandising";

type Sort = "featured" | "price-low" | "price-high" | "name";

export function CollectionExplorer({ initialProducts, initialMaterial, initialUse }: { initialProducts: CatalogProduct[]; initialMaterial?: string; initialUse?: string }) {
  const validMaterial = ["brass", "copper", "kansa", "mixed"].includes(initialMaterial ?? "") ? initialMaterial as Material : "all";
  const validUse = ["cooking", "drinking", "dining", "serving"].includes(initialUse ?? "") ? initialUse as ProductUse : "all";
  const [material, setMaterial] = useState<Material | "all">(validMaterial);
  const [use, setUse] = useState<ProductUse | "all">(validUse);
  const [availability, setAvailability] = useState<"all" | "available">("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [price, setPrice] = useState(4000000);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => initialProducts
    .filter((product) => material === "all" || product.material === material)
    .filter((product) => use === "all" || productUse(product).includes(use))
    .filter((product) => availability === "all" || product.launchStock > 0)
    .filter((product) => product.sellingPricePaise <= price)
    .sort((a, b) => sort === "price-low" ? a.sellingPricePaise - b.sellingPricePaise : sort === "price-high" ? b.sellingPricePaise - a.sellingPricePaise : sort === "name" ? a.name.localeCompare(b.name) : Number(Boolean(b.featured)) - Number(Boolean(a.featured))), [initialProducts, material, use, availability, price, sort]);

  const reset = () => { setMaterial("all"); setUse("all"); setAvailability("all"); setPrice(4000000); setSort("featured"); };
  return <div className="collection-explorer">
    <div className="collection-controls">
      <button className="filter-toggle" type="button" aria-expanded={filtersOpen} onClick={() => setFiltersOpen((current) => !current)}>Filters <span>{filtered.length}</span></button>
      <p><strong>{filtered.length}</strong> of {initialProducts.length} pieces</p>
      <label>Sort <select value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name</option></select></label>
    </div>
    <div className={`collection-results-layout ${filtersOpen ? "filters-open" : ""}`}>
      <aside className="filter-panel" aria-label="Product filters">
        <div><h2>Material</h2>{(["all", "brass", "copper", "kansa", "mixed"] as const).map((value) => <label key={value}><input type="radio" name="material" checked={material === value} onChange={() => setMaterial(value)} /><span>{value === "all" ? "All metals" : materialLabels[value]}</span></label>)}</div>
        <div><h2>Use</h2>{(["all", "cooking", "drinking", "dining", "serving"] as const).map((value) => <label key={value}><input type="radio" name="use" checked={use === value} onChange={() => setUse(value)} /><span>{value === "all" ? "All uses" : useLabels[value]}</span></label>)}</div>
        <div><h2>Price up to</h2><input aria-label="Maximum price" type="range" min={50000} max={4000000} step={50000} value={price} onChange={(event) => setPrice(Number(event.target.value))} /><p>{formatInr(price)}</p></div>
        <div><h2>Availability</h2><label><input type="checkbox" checked={availability === "available"} onChange={(event) => setAvailability(event.target.checked ? "available" : "all")} /><span>In stock</span></label></div>
        <button type="button" className="filter-reset" onClick={reset}>Reset all filters</button>
      </aside>
      <section aria-live="polite" aria-label="Filtered products">
        {filtered.length ? <div className="product-grid product-grid-light">{filtered.map((product) => <ProductCard product={product} key={product.slug} />)}</div> : <div className="empty-state collection-empty"><strong>No pieces match every filter.</strong><p>Remove one or more filters to widen the selection.</p><button type="button" onClick={reset}>Reset filters</button></div>}
      </section>
    </div>
  </div>;
}
