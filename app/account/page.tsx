import type { Metadata } from "next";
import Link from "next/link";
import { AccountDashboard } from "@/components/commerce/AccountDashboard";
import { chatGPTSignInPath, chatGPTSignOutPath, getChatGPTUser } from "@/app/chatgpt-auth";
import { ContentPage, ContentSection } from "@/components/storefront/ContentPage";
export const metadata: Metadata = { title: "Account", robots: { index: false, follow: true } };
export default async function AccountPage() {
  const user = await getChatGPTUser();
  if (!user) return <ContentPage eyebrow="Customer account" title="Orders, addresses and care in one place." introduction="Use the platform-managed sign-in route. Dharohar never receives or stores a password."><ContentSection title="Private account"><ul className="feature-list"><li>Order history and shipment timeline</li><li>Saved addresses and GST details</li><li>Returns, verified-purchase reviews and care plans</li><li>Wishlist sync across signed-in devices</li></ul></ContentSection><p><Link className="button button-wine" href={chatGPTSignInPath("/account")}>Sign in securely</Link></p></ContentPage>;
  return <ContentPage eyebrow="Customer account" title={`Welcome, ${user.displayName}.`} introduction="Your account data is loaded from the server and scoped to your authenticated identity."><p><Link className="text-link" href={chatGPTSignOutPath("/")}>Sign out</Link></p><AccountDashboard /></ContentPage>;
}
