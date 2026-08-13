import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { audienceContent, products, type Audience } from "@/lib/catalog";

type AudiencePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(audienceContent).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: AudiencePageProps): Promise<Metadata> {
  const { slug } = await params;
  const audience = audienceContent[slug as Audience];
  if (!audience) return {};
  return {
    title: `For ${audience.name}`,
    description: audience.description,
    alternates: { canonical: `/shop-for/${slug}` },
  };
}

export default async function AudiencePage({ params }: AudiencePageProps) {
  const { slug } = await params;
  const audience = audienceContent[slug as Audience];
  if (!audience) notFound();
  const audienceProducts = products.filter((product) => product.audiences.includes(slug as Audience));
  const requiresConsultation = slug !== "households";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="audience-page-hero">
          <Image src={audience.image} alt="" fill priority sizes="100vw" />
          <div className="image-shade" />
          <div className="shell">
            <p className="eyebrow eyebrow-gold">{audience.eyebrow}</p>
            <h1>{audience.name}</h1>
            <p>{audience.description}</p>
            <div className="hero-actions">
              <Link className="button button-gold" href="#selected-pieces">Explore selected pieces</Link>
              {requiresConsultation ? <Link className="button button-ghost" href={`/trade?service=${slug}`}>Discuss a project</Link> : null}
            </div>
          </div>
        </section>
        <section className="audience-value shell">
          <p className="eyebrow">A considered route</p>
          <div>
            <h2>{requiresConsultation ? "A collection, supported like a project." : "Begin with the way your home lives."}</h2>
            <p>{requiresConsultation ? "Tell us the quantity, context and delivery window. We will help refine material, finish, presentation and replenishment before preparing a clear quotation." : "Choose by daily ritual, family size and material preference, with care information kept close to every piece."}</p>
          </div>
        </section>
        <section className="section featured-section" id="selected-pieces">
          <div className="shell">
            <div className="section-heading split-heading">
              <div><p className="eyebrow eyebrow-gold">Selected for {audience.name.toLowerCase()}</p><h2>{audienceProducts.length} relevant pieces.</h2></div>
              <Link className="text-link text-link-light" href="/collections/all">View complete collection <span aria-hidden="true">→</span></Link>
            </div>
            <div className="product-grid">
              {audienceProducts.slice(0, 8).map((product) => <ProductCard product={product} key={product.slug} />)}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
