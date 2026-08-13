import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { categoryContent, products, type ProductCategory } from "@/lib/catalog";

type CollectionPageProps = { params: Promise<{ slug: string }> };

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

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const isAll = slug === "all";
  const category = isAll ? null : categoryContent[slug as ProductCategory];
  if (!isAll && !category) notFound();

  const collectionProducts = isAll ? products : products.filter((product) => product.category === slug);
  const title = category?.name ?? "All Objects";
  const description = category?.description ?? "The complete opening collection: useful objects in copper, peetal and kansa for kitchens, tables, spaces and gifts.";
  const image = category?.image ?? "/images/dharohar/brand/dharohar-hero-tableau.webp";

  return (
    <>
      <SiteHeader />
      <main>
        <section className="collection-hero">
          <Image src={image} alt="" fill priority sizes="100vw" />
          <div className="image-shade" />
          <div className="shell">
            <p className="eyebrow eyebrow-gold">The opening collection</p>
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
        <section className="section shell collection-products" aria-label={`${title} products`}>
          <div className="product-grid product-grid-light">
            {collectionProducts.map((product) => <ProductCard product={product} key={product.slug} />)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
