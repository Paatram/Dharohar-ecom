import type { Metadata } from "next";
import { ComparisonTable } from "@/components/commerce/SavedProductGrid";
import { ContentPage } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Compare Products", robots: { index: false, follow: true } };
export default function ComparePage() { return <ContentPage eyebrow="Object comparison" title="Compare without guesswork." introduction="Place up to three pieces side by side. Unknown specifications remain clearly marked until exact-SKU verification is complete."><ComparisonTable /></ContentPage>; }
