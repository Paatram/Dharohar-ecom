import type { Metadata } from "next";
import { BagPage } from "@/components/commerce/SavedProductGrid";
import { ContentPage } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Selection Bag", robots: { index: false, follow: true } };
export default function CartPage() { return <ContentPage eyebrow="Your bag" title="Review your order." introduction="Update quantities and review the product subtotal and GST before checkout."><BagPage /></ContentPage>; }
