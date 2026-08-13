import Image from "next/image";
import Link from "next/link";
import { ChevronDown, HeartHandshake } from "lucide-react";
import { audienceContent, categoryContent, subcategoryContent, type ProductCategory } from "@/lib/catalog";
import { useLabels } from "@/lib/merchandising";
import { HeaderCommerceActions } from "@/components/commerce/CommerceOverlays";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader() {
  return <header className="site-header">
    <div className="shell header-inner">
      <MobileMenu />
      <Link className="brand" href="/" aria-label="Dharohar home">
        <span className="brand-mark"><Image src="/images/dharohar/brand/dharohar-mark.png" alt="" fill priority sizes="46px" /></span>
        <span><strong>DHAROHAR</strong><small>Heritage Kitchen</small></span>
      </Link>

      <nav className="desktop-nav" aria-label="Primary navigation">
        <div className="nav-menu">
          <Link className="nav-trigger" href="/collections/all">Shop <ChevronDown size={14} strokeWidth={1.6} aria-hidden="true" /></Link>
          <div className="mega-menu commerce-mega-menu">
            <div className="mega-menu-intro">
              <p className="menu-kicker">The complete catalogue</p>
              <h2>Shop by object.</h2>
              <p>Cook, drink, dine and serve with objects selected for real daily rituals.</p>
              <Link href="/collections/all">View all 34 products <span aria-hidden="true">→</span></Link>
            </div>
            <div className="mega-category-grid">
              {Object.entries(categoryContent).map(([slug, category]) => <section className="mega-category" key={slug}>
                <Link className="mega-category-title" href={`/collections/${slug}`}>{category.name}</Link>
                <ul>{subcategoryContent[slug as ProductCategory].map((subcategory) => <li key={subcategory.slug}><Link href={`/collections/${slug}/${subcategory.slug}`}>{subcategory.name}</Link></li>)}</ul>
              </section>)}
            </div>
            <div className="mega-discovery-rail">
              <p className="menu-kicker">Shop by ritual</p>
              {Object.entries(useLabels).map(([slug, label]) => <Link key={slug} href={`/collections/all?use=${slug}`}>{label}<span aria-hidden="true">→</span></Link>)}
              <p className="menu-kicker mega-secondary-kicker">Need material guidance?</p>
              <Link className="mega-material-guide" href="/materials">Read the compact material guide</Link>
            </div>
          </div>
        </div>

        <div className="nav-menu">
          <Link className="nav-trigger" href="/#shop-by-space">Spaces <ChevronDown size={14} strokeWidth={1.6} aria-hidden="true" /></Link>
          <div className="mega-menu spaces-mega-menu">
            <div><p className="menu-kicker">Made for your world</p><h2>From family kitchens to considered hospitality.</h2><p>Start with where and how the objects will be used.</p></div>
            <ul className="audience-menu-list">{Object.entries(audienceContent).map(([slug, audience]) => <li key={slug}><Link href={`/shop-for/${slug}`}><span>{audience.name}</span><small>{audience.eyebrow}</small></Link></li>)}</ul>
          </div>
        </div>

        <div className="nav-menu">
          <Link className="nav-trigger" href="/gifting">Gifting <ChevronDown size={14} strokeWidth={1.6} aria-hidden="true" /></Link>
          <div className="mega-menu compact-mega-menu"><div><p className="menu-kicker">Gifts that enter daily life</p><h2>Choose by occasion or budget.</h2><Link href="/gifting">Explore gifting <span aria-hidden="true">→</span></Link></div><ul><li><Link href="/gifting#occasions">Wedding & housewarming</Link></li><li><Link href="/gifting#budgets">Gifts by budget</Link></li><li><Link href="/trade?service=corporate-gifting">Corporate gifting</Link></li><li><Link href="/gifting#presentation">Presentation & messages</Link></li></ul></div>
        </div>

        <div className="nav-menu">
          <Link className="nav-trigger" href="/trade">Trade <ChevronDown size={14} strokeWidth={1.6} aria-hidden="true" /></Link>
          <div className="mega-menu compact-mega-menu"><div><p className="menu-kicker">For professional briefs</p><h2>Source with clarity.</h2><Link href="/trade">Request a trade quote <span aria-hidden="true">→</span></Link></div><ul><li><Link href="/shop-for/restaurants">Restaurants</Link></li><li><Link href="/shop-for/hotels">Hotels</Link></li><li><Link href="/shop-for/offices">Offices</Link></li><li><Link href="/shop-for/interior-designers">Interior designers</Link></li></ul></div>
        </div>

        <Link href="/our-craft">Our craft</Link>
        <Link className="care-nav-link" href="/care#plans"><HeartHandshake size={16} strokeWidth={1.7} aria-hidden="true" /> Care Plans</Link>
      </nav>

      <div className="header-actions" aria-label="Shopping actions"><HeaderCommerceActions /></div>
    </div>
  </header>;
}
