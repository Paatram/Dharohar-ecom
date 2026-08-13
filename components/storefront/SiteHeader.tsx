import Image from "next/image";
import Link from "next/link";
import { audienceContent, categoryContent } from "@/lib/catalog";

export function SiteHeader() {
  return (
    <>
      <div className="announcement">
        Handcrafted in India <span aria-hidden="true">·</span> Pure metals <span aria-hidden="true">·</span> Lifetime craftsmanship care
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <Link className="brand" href="/" aria-label="Dharohar home">
            <span className="brand-mark">
              <Image
                src="/images/dharohar/brand/dharohar-mark.png"
                alt=""
                fill
                priority
                sizes="52px"
              />
            </span>
            <span>
              <strong>DHAROHAR</strong>
              <small>Heritage Kitchen</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <details className="nav-menu">
              <summary>Shop</summary>
              <div className="mega-menu mega-menu-products">
                <div>
                  <p className="menu-kicker">Shop the collection</p>
                  <h2>Objects for a lifetime of use.</h2>
                  <Link href="/collections/all">View all 34 pieces</Link>
                </div>
                <ul>
                  {Object.entries(categoryContent).map(([slug, category]) => (
                    <li key={slug}>
                      <Link href={`/collections/${slug}`}>
                        <span>{category.name}</span>
                        <small>{category.description}</small>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            <details className="nav-menu">
              <summary>Shop by space</summary>
              <div className="mega-menu">
                <div>
                  <p className="menu-kicker">Made for your world</p>
                  <h2>From a family rasoi to considered hospitality.</h2>
                </div>
                <ul className="audience-menu-list">
                  {Object.entries(audienceContent).map(([slug, audience]) => (
                    <li key={slug}>
                      <Link href={`/shop-for/${slug}`}>{audience.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </details>

            <Link href="/materials">Materials</Link>
            <Link href="/our-craft">Our craft</Link>
            <Link href="/care">Care</Link>
          </nav>

          <div className="header-actions" aria-label="Shopping actions">
            <Link href="/contact">Enquire</Link>
            <details className="mobile-menu">
              <summary aria-label="Open navigation">Menu</summary>
              <nav aria-label="Mobile navigation">
                <Link href="/collections/all">Shop all</Link>
                {Object.entries(categoryContent).map(([slug, category]) => (
                  <Link key={slug} href={`/collections/${slug}`}>{category.name}</Link>
                ))}
                <span>Shop by space</span>
                {Object.entries(audienceContent).map(([slug, audience]) => (
                  <Link key={slug} href={`/shop-for/${slug}`}>{audience.name}</Link>
                ))}
                <Link href="/materials">Materials</Link>
                <Link href="/our-craft">Our craft</Link>
                <Link href="/care">Care</Link>
                <Link href="/contact">Enquire</Link>
              </nav>
            </details>
          </div>
        </div>
      </header>
    </>
  );
}
