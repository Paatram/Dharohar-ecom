import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { products } from "@/lib/catalog";
import { bundleProducts, bundles, giftBudgets, giftOccasions } from "@/lib/merchandising";

export const metadata: Metadata = { title: "Gifting", description: "Explore Dharohar wedding, housewarming, festive and corporate gifting by occasion and budget.", alternates: { canonical: "/gifting" } };
export default function GiftingPage() {
  const giftProducts = products.filter((product) => product.audiences.includes("gifting"));
  return <><SiteHeader /><main>
    <header className="content-hero gifting-hero"><div className="shell"><p className="eyebrow eyebrow-gold">Gifts that enter daily life</p><h1>Given once.<br /><em>Carried forward.</em></h1><p>Explore useful metal objects by occasion and budget, with presentation and personalisation confirmed through a clear approval process.</p><Link className="button button-gold" href="#occasions">Find a gift</Link></div></header>
    <section id="occasions" className="section shell"><div className="section-heading"><p className="eyebrow">Shop by occasion</p><h2>Begin with the moment.</h2></div><div className="occasion-grid">{giftOccasions.map((occasion) => <article key={occasion.slug}><span>{occasion.name.slice(0, 1)}</span><h3>{occasion.name}</h3><p>{occasion.description}</p><Link href={occasion.slug === "corporate" ? "/trade?service=corporate-gifting" : `/collections/all?use=${occasion.slug === "wedding" ? "dining" : "serving"}`}>Explore <span aria-hidden="true">→</span></Link></article>)}</div></section>
    <section id="budgets" className="gift-budget-section"><div className="shell"><div className="section-heading"><p className="eyebrow eyebrow-gold">Shop by budget</p><h2>A clear place to begin.</h2></div><div className="gift-budget-links">{giftBudgets.map((budget) => <a href={`#${budget.slug}`} key={budget.slug}>{budget.label}</a>)}</div>{giftBudgets.map((budget) => { const within = giftProducts.filter((product) => product.sellingPricePaise >= budget.min && product.sellingPricePaise < budget.max).slice(0, 4); return within.length ? <section id={budget.slug} className="gift-budget-row" key={budget.slug}><h3>{budget.label}</h3><div className="product-grid">{within.map((product) => <ProductCard key={product.slug} product={product} />)}</div></section> : null; })}</div></section>
    <section className="section shell" id="presentation"><div className="section-heading split-heading"><div><p className="eyebrow">Curated pairings</p><h2>Complete the ritual.</h2></div><p>Consider these complementary objects together, then add each chosen piece to your bag.</p></div>{bundles.map((bundle) => <div className="bundle-row" key={bundle.slug}><div><h3>{bundle.name}</h3><p>{bundle.description}</p></div><div className="product-grid product-grid-light">{bundleProducts(bundle).map((product) => <ProductCard key={product.slug} product={product} />)}</div></div>)}</section>
    <section className="gift-service shell"><div><p className="eyebrow eyebrow-gold">Presentation & personalisation</p><h2>A considered final layer.</h2></div><div><p>Gift messages, packaging, engraving proofs, bulk quantities and scheduled fulfilment require operational approval. Tell us the occasion and deadline to prepare a feasibility-led brief.</p><Link className="button button-gold" href="/trade?service=weddings">Discuss gifting</Link></div></section>
  </main><SiteFooter /></>;
}
