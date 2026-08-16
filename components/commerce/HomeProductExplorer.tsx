"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ProductCard } from "@/components/storefront/ProductCard";
import {
  audienceContent,
  categoryContent,
  formatInr,
  type Audience,
  type CatalogProduct,
  type Material,
  type ProductCategory,
} from "@/lib/catalog";
import { materialLabels, productUse, useLabels, type ProductUse } from "@/lib/merchandising";

type CategoryFilter = ProductCategory | "all";
type Sort = "featured" | "price-low" | "price-high" | "name";
type Budget = "all" | "under-1500" | "1500-3000" | "3000-7500" | "above-7500";

const budgets: { value: Budget; label: string; min: number; max: number }[] = [
  { value: "all", label: "All prices", min: 0, max: Number.POSITIVE_INFINITY },
  { value: "under-1500", label: "Under ₹1,500", min: 0, max: 150000 },
  { value: "1500-3000", label: "₹1,500–₹3,000", min: 150000, max: 300000 },
  { value: "3000-7500", label: "₹3,000–₹7,500", min: 300000, max: 750000 },
  { value: "above-7500", label: "Above ₹7,500", min: 750000, max: Number.POSITIVE_INFINITY },
];

export function HomeProductExplorer({ initialProducts }: { initialProducts: CatalogProduct[] }) {
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [material, setMaterial] = useState<Material | "all">("all");
  const [use, setUse] = useState<ProductUse | "all">("all");
  const [audience, setAudience] = useState<Audience | "all">("all");
  const [finish, setFinish] = useState("all");
  const [budget, setBudget] = useState<Budget>("all");
  const [sort, setSort] = useState<Sort>("featured");
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryOptions: { value: CategoryFilter; label: string; count: number }[] = [
    { value: "all", label: "All products", count: initialProducts.length },
    ...Object.entries(categoryContent).map(([value, content]) => ({ value: value as ProductCategory, label: content.name, count: initialProducts.filter((product) => product.category === value).length })),
  ];
  const finishes = useMemo(() => [...new Set(initialProducts.map((product) => product.finish))].sort(), [initialProducts]);
  const selectedBudget = budgets.find((item) => item.value === budget)!;
  const normalisedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => initialProducts
    .filter((product) => category === "all" || product.category === category)
    .filter((product) => material === "all" || product.material === material)
    .filter((product) => use === "all" || productUse(product).includes(use))
    .filter((product) => audience === "all" || product.audiences.includes(audience))
    .filter((product) => finish === "all" || product.finish === finish)
    .filter((product) => product.sellingPricePaise >= selectedBudget.min && product.sellingPricePaise < selectedBudget.max)
    .filter((product) => !normalisedQuery || `${product.name} ${product.description} ${product.finish} ${materialLabels[product.material]}`.toLowerCase().includes(normalisedQuery))
    .sort((a, b) => sort === "price-low" ? a.sellingPricePaise - b.sellingPricePaise : sort === "price-high" ? b.sellingPricePaise - a.sellingPricePaise : sort === "name" ? a.name.localeCompare(b.name) : Number(Boolean(b.featured)) - Number(Boolean(a.featured))),
  [audience, category, finish, initialProducts, material, normalisedQuery, selectedBudget.max, selectedBudget.min, sort, use]);

  const activeFilterCount = [category !== "all", material !== "all", use !== "all", audience !== "all", finish !== "all", budget !== "all", Boolean(normalisedQuery)].filter(Boolean).length;
  const reset = () => { setCategory("all"); setMaterial("all"); setUse("all"); setAudience("all"); setFinish("all"); setBudget("all"); setSort("featured"); setQuery(""); };

  return <div className="home-product-explorer">
    <div className="category-filter-toggles" role="group" aria-label="Filter products by category">
      {categoryOptions.map((option) => <button className={category === option.value ? "active" : ""} type="button" key={option.value} aria-pressed={category === option.value} onClick={() => setCategory(option.value)}><span>{option.label}</span><small>{option.count}</small></button>)}
    </div>

    <div className="home-catalog-toolbar">
      <label className="catalog-search"><Search size={17} strokeWidth={1.7} aria-hidden="true" /><span className="sr-only">Search the collection</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search all products" /></label>
      <button className="home-filter-toggle" type="button" aria-expanded={filtersOpen} aria-controls="home-filter-panel" onClick={() => setFiltersOpen((current) => !current)}><SlidersHorizontal size={16} aria-hidden="true" /> Filters {activeFilterCount > 0 && <span>{activeFilterCount}</span>}</button>
      <p aria-live="polite"><strong>{filtered.length}</strong> of {initialProducts.length} pieces</p>
      <label className="catalog-sort"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value as Sort)}><option value="featured">Featured</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name A–Z</option></select></label>
    </div>

    <div className={`home-catalog-layout ${filtersOpen ? "filters-open" : ""}`}>
      <aside className="home-filter-panel" id="home-filter-panel" aria-label="Product filters">
        <div className="home-filter-heading"><h2>Filters</h2>{activeFilterCount > 0 && <button type="button" onClick={reset}>Clear all</button>}</div>
        <fieldset><legend>Price</legend>{budgets.map((item) => <label key={item.value}><input type="radio" name="home-budget" checked={budget === item.value} onChange={() => setBudget(item.value)} /><span>{item.label}</span></label>)}</fieldset>
        <fieldset><legend>Metal</legend>{(["all", "brass", "copper", "kansa", "mixed"] as const).map((value) => <label key={value}><input type="radio" name="home-material" checked={material === value} onChange={() => setMaterial(value)} /><span>{value === "all" ? "All metals" : materialLabels[value]}</span></label>)}</fieldset>
        <fieldset><legend>Use</legend>{(["all", "cooking", "drinking", "dining", "serving"] as const).map((value) => <label key={value}><input type="radio" name="home-use" checked={use === value} onChange={() => setUse(value)} /><span>{value === "all" ? "All uses" : useLabels[value]}</span></label>)}</fieldset>
        <fieldset><legend>Made for</legend><select aria-label="Filter by space" value={audience} onChange={(event) => setAudience(event.target.value as Audience | "all")}><option value="all">All spaces</option>{Object.entries(audienceContent).map(([value, content]) => <option value={value} key={value}>{content.name}</option>)}</select></fieldset>
        <fieldset><legend>Finish</legend><select aria-label="Filter by finish" value={finish} onChange={(event) => setFinish(event.target.value)}><option value="all">All finishes</option>{finishes.map((value) => <option value={value} key={value}>{value}</option>)}</select></fieldset>
        <p className="home-price-span">Collection range <strong>{formatInr(Math.min(...initialProducts.map((product) => product.sellingPricePaise)))}–{formatInr(Math.max(...initialProducts.map((product) => product.sellingPricePaise)))}</strong></p>
      </aside>

      <section className="home-catalog-results" aria-label="Filtered products">
        {activeFilterCount > 0 && <div className="active-filter-summary"><span>{activeFilterCount} active {activeFilterCount === 1 ? "filter" : "filters"}</span><button type="button" onClick={reset}><X size={14} aria-hidden="true" /> Clear</button></div>}
        {filtered.length ? <div className="product-grid product-grid-light home-product-grid">{filtered.map((product) => <ProductCard product={product} key={product.slug} />)}</div> : <div className="empty-state collection-empty"><strong>No pieces match every filter.</strong><p>Try another price, metal, use or space to widen the selection.</p><button type="button" onClick={reset}>Reset all filters</button></div>}
      </section>
    </div>
  </div>;
}
