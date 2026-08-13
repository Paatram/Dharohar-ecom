import type { Metadata } from "next";
import { CollectionExplorer } from "@/components/commerce/CollectionExplorer";
import { ContentPage } from "@/components/storefront/ContentPage";
import { searchProducts } from "@/lib/merchandising";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const matches = searchProducts(q);
  return <ContentPage eyebrow="Catalogue search" title={q ? `Results for “${q}”` : "Search the collection."} introduction={q ? `${matches.length} matching pieces across objects, metals, finishes and uses.` : "Search by object, metal, finish or the ritual it supports."}>
    {q ? <CollectionExplorer initialProducts={matches} /> : <form className="page-search" action="/search"><label htmlFor="page-search">What are you looking for?</label><div><input id="page-search" name="q" type="search" placeholder="Copper bottle, tawa, dining…" required /><button className="button button-wine" type="submit">Search</button></div></form>}
  </ContentPage>;
}
