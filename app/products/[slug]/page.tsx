import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { DeliveryChecker, ProductPurchaseActions } from "@/components/commerce/ProductActions";
import { ProductReviews } from "@/components/commerce/ProductReviews";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { categoryContent, findProduct, formatInr, productGallery, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";
import { bundleProducts, bundles, materialLabels, productUse, useLabels } from "@/lib/merchandising";

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
  const gallery = productGallery(product);
  const pairings = [...(matchingBundle ? bundleProducts(matchingBundle) : []), ...related]
    .filter((item, index, items) => item.slug !== product.slug && items.findIndex((candidate) => candidate.slug === item.slug) === index)
    .slice(0, 4);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: gallery.map((image) => absoluteUrl(image.src)),
    material: materialName,
    offers: { "@type": "Offer", priceCurrency: "INR", price: (product.sellingPricePaise / 100).toFixed(2), availability: "https://schema.org/InStock", url: absoluteUrl(`/products/${product.slug}`) },
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
          <ProductGallery images={gallery} productName={product.name} />
          <aside className="product-buy-panel">
            <p className="eyebrow">{categoryContent[product.category].name} · {product.finish}</p>
            <h1>{product.name}</h1>
            <p className="product-material">{materialName}</p>
            <p className="product-description">{product.description}</p>
            <div className="product-price"><strong>{formatInr(product.sellingPricePaise)}</strong><small>5% GST calculated at checkout</small></div>
            <div className="product-status"><span>Availability</span><strong>In stock</strong></div>
            <ProductPurchaseActions slug={product.slug} />
            <DeliveryChecker />
            <dl className="product-facts">
              <div><dt>Material</dt><dd>{materialName}</dd></div>
              <div><dt>Finish</dt><dd>{product.finish}</dd></div>
              <div><dt>Collection</dt><dd>{categoryContent[product.category].name}</dd></div>
              <div><dt>Designed for</dt><dd>{uses}</dd></div>
            </dl>
            <div className="product-accordions">
              <details><summary>Care & natural variation <span>+</span></summary><p>Traditional metals develop a natural patina with air, handling and use. Clean gently, dry immediately and store in a dry place. See the material guide for finish-specific care.</p></details>
              <details><summary>Delivery <span>+</span></summary><p>Enter your delivery pincode above. Available courier options, charges and the order total are confirmed before payment.</p></details>
              <details><summary>Need help choosing? <span>+</span></summary><p>Our team can help with material, use, gifting and larger space requirements. Contact us with this product attached.</p></details>
            </div>
          </aside>
        </section>
        {pairings.length ? <section className="section bundle-feature"><div className="shell"><div className="section-heading split-heading"><div><p className="eyebrow">Frequently paired</p><h2>Complete the setting</h2></div><p>{matchingBundle?.description ?? `Pieces customers often consider alongside ${product.name}.`}</p></div><div className="product-grid product-grid-light">{pairings.map((item) => <ProductCard product={item} key={item.slug} />)}</div></div></section> : null}
        <section className="product-principles shell">
          <article><span>01</span><h2>Thoughtful material</h2><p>Traditional metals selected for everyday rituals, hosting and gifting.</p></article>
          <article><span>02</span><h2>Inspected before dispatch</h2><p>Each piece is checked for finish, edges, balance and protective packaging.</p></article>
          <article><span>03</span><h2>Care beyond purchase</h2><p>Practical care guidance helps every object age beautifully.</p></article>
        </section>
        <ProductReviews productSlug={product.slug} />
        <section className="shell product-community" aria-label="Product questions"><article><p className="eyebrow">Product questions</p><h2>Ask before you choose</h2><p>Need help with use, material, gifting or a larger requirement? Send our team the product link and your question.</p><Link className="text-link" href={`/contact?product=${product.slug}`}>Ask about this piece <span aria-hidden="true">→</span></Link></article></section>
      </main>
      <SiteFooter />
    </>
  );
}
