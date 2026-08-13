import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import {
  categoryContent,
  findSubcategory,
  productsForSubcategory,
  subcategoryContent,
  type ProductCategory,
} from "@/lib/catalog";

type SubcategoryPageProps = { params: Promise<{ slug: string; subcategory: string }> };

export function generateStaticParams() {
  return Object.entries(subcategoryContent).flatMap(([slug, subcategories]) =>
    subcategories.map((subcategory) => ({ slug, subcategory: subcategory.slug })),
  );
}

export async function generateMetadata({ params }: SubcategoryPageProps): Promise<Metadata> {
  const { slug, subcategory: subcategorySlug } = await params;
  const category = categoryContent[slug as ProductCategory];
  const subcategory = category ? findSubcategory(slug as ProductCategory, subcategorySlug) : undefined;
  if (!category || !subcategory) return {};
  return {
    title: `${subcategory.name} — ${category.name}`,
    description: subcategory.description,
    alternates: { canonical: `/collections/${slug}/${subcategorySlug}` },
  };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { slug, subcategory: subcategorySlug } = await params;
  const category = categoryContent[slug as ProductCategory];
  const subcategory = category ? findSubcategory(slug as ProductCategory, subcategorySlug) : undefined;
  if (!category || !subcategory) notFound();
  const collectionProducts = productsForSubcategory(subcategory);

  return <>
    <SiteHeader />
    <main>
      <section className="collection-hero collection-hero-compact">
        <Image src={category.image} alt="" fill priority sizes="100vw" />
        <div className="image-shade" />
        <div className="shell">
          <p className="eyebrow eyebrow-gold">{category.name}</p>
          <h1>{subcategory.name}</h1>
          <p>{subcategory.description}</p>
        </div>
      </section>
      <div className="collection-toolbar shell">
        <p><strong>{collectionProducts.length}</strong> {collectionProducts.length === 1 ? "piece" : "pieces"}</p>
        <nav aria-label={`${category.name} subcategories`}>
          <Link href={`/collections/${slug}`}>All {category.name}</Link>
          {subcategoryContent[slug as ProductCategory].map((item) => <Link className={item.slug === subcategorySlug ? "active" : ""} href={`/collections/${slug}/${item.slug}`} key={item.slug}>{item.name}</Link>)}
        </nav>
      </div>
      <section className="section shell collection-products" aria-label={`${subcategory.name} products`}>
        <div className="product-grid product-grid-light">
          {collectionProducts.map((product) => <ProductCard product={product} key={product.slug} />)}
        </div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
