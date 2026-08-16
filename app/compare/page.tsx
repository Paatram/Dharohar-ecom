import type { Metadata } from "next";
import { ComparisonTable } from "@/components/commerce/SavedProductGrid";
import { ContentPage } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Compare Products", robots: { index: false, follow: true } };
export default function ComparePage() { return <ContentPage eyebrow="Product comparison" title="Choose the right piece." introduction="Compare up to three products by material, finish, use and price."><ComparisonTable /></ContentPage>; }
