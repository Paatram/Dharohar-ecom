import type { Metadata } from "next";
import { headers } from "next/headers";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-dharohar-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-dharohar-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "Dharohar — The Heritage Kitchen, Reimagined",
      template: "%s · Dharohar",
    },
    description: "Shop Dharohar handcrafted copper, peetal and kansa cookware, drinkware, kitchen tools and sets for homes, hospitality, designers and gifting.",
    keywords: ["heritage cookware India", "peetal cookware", "copper drinkware", "kansa dinnerware", "Indian metal craft"],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "Dharohar",
      title: "Dharohar — The Heritage Kitchen, Reimagined",
      description: "Objects in copper, peetal and kansa, crafted for use and made to be carried forward.",
      url: origin,
      images: [
        {
          url: "/images/dharohar/brand/dharohar-social-tableau.png",
          width: 1200,
          height: 630,
          alt: "A conceptual Dharohar tableau of copper, peetal and kansa vessels",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Dharohar — The Heritage Kitchen, Reimagined",
      description: "Objects in copper, peetal and kansa, crafted for use and made to be carried forward.",
      images: ["/images/dharohar/brand/dharohar-social-tableau.png"],
    },
    robots: { index: true, follow: true },
    icons: {
      icon: "/images/dharohar/brand/dharohar-mark.png",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-IN">
      <body className={`${manrope.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
