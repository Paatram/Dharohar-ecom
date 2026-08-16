import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionExplorer } from "@/components/commerce/CollectionExplorer";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { categoryContent, products, subcategoryContent, type ProductCategory } from "@/lib/catalog";
import { absoluteUrl } from "@/lib/site";

type CollectionPageProps = { params: Promise<{ slug: string }>; searchParams: Promise<{ material?: string; use?: string }> };

export function generateStaticParams() {
  return ["all", ...Object.keys(categoryContent)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "all") {
    return { title: "All Products", description: "Explore all Dharohar cookware, drinkware, kitchen tools and complete sets." };
  }
  const category = categoryContent[slug as ProductCategory];
  if (!category) return {};
  return { title: category.name, description: category.description, alternates: { canonical: `/collections/${slug}` } };
}

export default async function CollectionPage({ params, searchParams }: CollectionPageProps) {
  const { slug } = await params;
  const filters = await searchParams;
  const isAll = slug === "all";
  const category = isAll ? null : categoryContent[slug as ProductCategory];
  if (!isAll && !category) notFound();

  const collectionProducts = isAll ? products : products.filter((product) => product.category === slug);
  const title = category?.name ?? "All Objects";
  const description = category?.description ?? "Useful objects in copper, peetal and kansa for kitchens, tables, spaces and gifts.";
  const image = category?.image ?? "/images/dharohar/brand/dharohar-hero-tableau.webp";
  const itemListSchema = { "@context": "https://schema.org", "@type": "ItemList", name: title, numberOfItems: collectionProducts.length, itemListElement: collectionProducts.map((product, index) => ({ "@type": "ListItem", position: index + 1, url: absoluteUrl(`/products/${product.slug}`), name: product.name })) };

  return (
    <>
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <section className="collection-hero">
          <Image src={image} alt="" fill priority sizes="100vw" />
          <div className="image-shade" />
          <div className="shell">
            <p className="eyebrow eyebrow-gold">The Dharohar collection</p>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
        </section>
        <div className="collection-toolbar shell">
          <p><strong>{collectionProducts.length}</strong> pieces</p>
          <nav aria-label="Product collections">
            <Link className={isAll ? "active" : ""} href="/collections/all">All</Link>
            {Object.entries(categoryContent).map(([categorySlug, item]) => (
              <Link className={slug === categorySlug ? "active" : ""} href={`/collections/${categorySlug}`} key={categorySlug}>{item.name}</Link>
            ))}
          </nav>
        </div>
        {category ? <nav className="subcategory-pills shell" aria-label={`${category.name} subcategories`}>
          {subcategoryContent[slug as ProductCategory].map((subcategory) => <Link href={`/collections/${slug}/${subcategory.slug}`} key={subcategory.slug}>{subcategory.name}<span aria-hidden="true">→</span></Link>)}
        </nav> : null}
        <section className="section shell collection-products" aria-label={`${title} products`}><CollectionExplorer initialProducts={collectionProducts} initialMaterial={filters.material} initialUse={filters.use} /></section>
      </main>
      <SiteFooter />
    </>
  );
}
