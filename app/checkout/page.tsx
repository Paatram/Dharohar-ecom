import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/commerce/CheckoutFlow";
import { ContentPage } from "@/components/storefront/ContentPage";

export const metadata: Metadata = { title: "Secure Checkout", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return <ContentPage eyebrow="Secure checkout" title="Verify every promise before payment." introduction="Delivery, product readiness, stock, tax and courier totals are checked by the server. Payment remains unavailable whenever any required fact is missing."><CheckoutFlow /></ContentPage>;
}
