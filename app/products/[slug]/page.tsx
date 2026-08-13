import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { categoryContent, findProduct, formatInr, products } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

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
  const materialName = product.material === "brass" ? "Peetal · Brass" : product.material === "copper" ? "Tamra · Copper" : product.material === "kansa" ? "Kansa · Bronze" : "Mixed material";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: [absoluteUrl(product.image)],
    material: materialName,
  };

  return (
    <>
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
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
            <div className="product-price"><strong>{formatInr(product.sellingPricePaise)}</strong><small>Launch price · tax treatment under final review</small></div>
            <div className="product-status"><span>Opening collection</span><strong>{product.launchStock} pieces planned</strong></div>
            <Link className="button button-wine product-cta" href={`/contact?product=${product.slug}`}>Register purchase interest</Link>
            <p className="product-accuracy-note">Purchasing remains intentionally closed until material composition, capacity, weight, dimensions, GST and shipping data pass the launch data-quality gate.</p>
            <dl className="product-facts">
              <div><dt>Material</dt><dd>{materialName}</dd></div>
              <div><dt>Finish</dt><dd>{product.finish}</dd></div>
              <div><dt>Collection</dt><dd>{categoryContent[product.category].name}</dd></div>
              <div><dt>Care</dt><dd>Material-specific guide supplied</dd></div>
            </dl>
          </aside>
        </section>
        <section className="product-principles shell">
          <article><span>01</span><h2>Accurate before available</h2><p>No unverified dimensions, compatibility or health claims are published as product facts.</p></article>
          <article><span>02</span><h2>Inspected before dispatch</h2><p>Every launch piece will follow a documented finish, edge, balance and packaging check.</p></article>
          <article><span>03</span><h2>Care beyond purchase</h2><p>Use, cleaning and restoration guidance will remain attached to the object through its life.</p></article>
        </section>
        {related.length ? <section className="section featured-section"><div className="shell"><div className="section-heading"><p className="eyebrow eyebrow-gold">Continue the material story</p><h2>Related pieces.</h2></div><div className="product-grid">{related.map((item) => <ProductCard product={item} key={item.slug} />)}</div></div></section> : null}
      </main>
      <SiteFooter />
    </>
  );
}
