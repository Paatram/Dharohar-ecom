import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { DeliveryChecker, ProductPurchaseActions } from "@/components/commerce/ProductActions";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { categoryContent, findProduct, formatInr, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";
import { bundleProducts, bundles, materialLabels, productUse, useLabels } from "@/lib/merchandising";
import { pendingFactLabel, productFacts } from "@/lib/product-readiness";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: { images: [{ url: product.image, alt: product.name }] },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();
  const related = products.filter((item) => item.category === product.category && item.slug !== product.slug).slice(0, 4);
  const materialName = materialLabels[product.material];
  const matchingBundle = bundles.find((bundle) => bundle.productSlugs.includes(product.slug));
  const uses = productUse(product).map((use) => useLabels[use]).join(" · ");
  const facts = productFacts(product);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    material: materialName,
  };
  const breadcrumbData = {
    "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: categoryContent[product.category].name, item: absoluteUrl(`/collections/${product.category}`) },
      { "@type": "ListItem", position: 3, name: product.name, item: absoluteUrl(`/products/${product.slug}`) },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />
        <nav className="breadcrumbs shell" aria-label="Breadcrumb">
          <Link href="/">Home</Link><span>/</span><Link href={`/collections/${product.category}`}>{categoryContent[product.category].name}</Link><span>/</span><span>{product.name}</span>
        </nav>
        <section className="product-detail shell">
          <div className="product-gallery">
            <div className="product-main-image"><Image src={product.image} alt={product.name} fill priority sizes="(max-width: 900px) 100vw, 58vw" /></div>
            <div className="product-image-note"><span>Material view</span><p>Final launch photography will document scale, interior, base and craft details for this exact SKU.</p></div>
          </div>
          <aside className="product-buy-panel">
            <p className="eyebrow">{categoryContent[product.category].name} · {product.finish}</p>
            <h1>{product.name}</h1>
            <p className="product-material">{materialName}</p>
            <p className="product-description">{product.description}</p>
            <div className="product-price"><strong>{formatInr(product.sellingPricePaise)}</strong><small>Indicative launch price · GST treatment under final review</small></div>
            <div className="product-status"><span>Opening collection</span><strong>{product.launchStock} pieces planned</strong></div>
            <ProductPurchaseActions slug={product.slug} />
            <p className="product-accuracy-note">Purchasing remains intentionally closed until material composition, capacity, weight, dimensions, GST and shipping data pass the launch data-quality gate.</p>
            <DeliveryChecker />
            <dl className="product-facts">
              <div><dt>Material</dt><dd>{materialName}</dd></div>
              <div><dt>Finish</dt><dd>{product.finish}</dd></div>
              <div><dt>Collection</dt><dd>{categoryContent[product.category].name}</dd></div>
              <div><dt>Designed for</dt><dd>{uses}</dd></div>
              <div><dt>Dimensions</dt><dd>{facts.dimensions ?? pendingFactLabel}</dd></div>
              <div><dt>Weight / capacity</dt><dd>{facts.netWeight ?? pendingFactLabel}{facts.capacity ? ` · ${facts.capacity}` : ""}</dd></div>
              <div><dt>Compatibility</dt><dd>{facts.compatibility ?? pendingFactLabel}</dd></div>
              <div><dt>What is included</dt><dd>{product.name.includes("Set") ? "Piece count follows the product name; exact contents pending verification" : "One product; accessories shown in lifestyle imagery are not included unless stated"}</dd></div>
            </dl>
            <div className="product-accordions">
              <details><summary>Care & natural variation <span>+</span></summary><p>Traditional metals naturally change with handling, air and use. The final care card will specify safe cleaning, drying, storage and restoration for this exact finish. Avoid abrasive treatment until that guide is approved.</p></details>
              <details><summary>Shipping & returns <span>+</span></summary><p>Dispatch time, packed weight, serviceability and return eligibility are launch-gated. No delivery date or return promise is made on this preview.</p></details>
              <details><summary>Material transparency <span>+</span></summary><p>Alloy composition, lining and food-contact guidance will be published only from supplier records and product verification. Dharohar does not publish unsupported therapeutic claims.</p></details>
            </div>
          </aside>
        </section>
        <section className="product-principles shell">
          <article><span>01</span><h2>Accurate before available</h2><p>No unverified dimensions, compatibility or health claims are published as product facts.</p></article>
          <article><span>02</span><h2>Inspected before dispatch</h2><p>Every launch piece will follow a documented finish, edge, balance and packaging check.</p></article>
          <article><span>03</span><h2>Care beyond purchase</h2><p>Use, cleaning and restoration guidance will remain attached to the object through its life.</p></article>
        </section>
        {matchingBundle ? <section className="section bundle-feature"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Complete the ritual</p><h2>{matchingBundle.name}</h2></div><p>{matchingBundle.description} Products remain individually priced; a bundle saving will appear only when commercially approved.</p></div><div className="product-grid product-grid-light">{bundleProducts(matchingBundle).map((item) => <ProductCard product={item} key={item.slug} />)}</div></div></section> : null}
        <section className="shell product-community" aria-label="Reviews and product questions">
          <article><p className="eyebrow">Verified reviews</p><h2>Real ownership, not seeded praise.</h2><p>Reviews open after verified orders. Until then, Dharohar will not publish invented ratings or review schema.</p></article>
          <article><p className="eyebrow">Product questions</p><h2>Ask before you choose.</h2><p>Need a specification that is still pending? Register your question with the product attached so the answer can be verified against the exact SKU.</p><Link className="text-link" href={`/contact?product=${product.slug}`}>Ask about this piece <span aria-hidden="true">→</span></Link></article>
        </section>
        {related.length ? <section className="section featured-section"><div className="shell"><div className="section-heading"><p className="eyebrow eyebrow-gold">Continue the material story</p><h2>Related pieces.</h2></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.slug} />)}</div></div></section> : null}
      </main>
      <SiteFooter />
    </>
  );
}
