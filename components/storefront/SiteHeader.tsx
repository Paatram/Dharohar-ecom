import Image from "next/image";
import Link from "next/link";
import { audienceContent, categoryContent, featuredProducts, subcategoryContent, type ProductCategory } from "@/lib/catalog";
import { MobileMenu } from "./MobileMenu";
import { HeaderCommerceActions } from "@/components/commerce/CommerceOverlays";
import { materialStories, useLabels } from "@/lib/merchandising";

export function SiteHeader() {
  return (
    <>
      <div className="announcement">
        Heritage metalware <span aria-hidden="true">·</span> Product facts verified before commerce <span aria-hidden="true">·</span> Launch collection preview
      </div>
      <header className="site-header">
        <div className="shell header-inner">
          <MobileMenu />
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
            <div className="nav-menu">
              <Link className="nav-trigger" href="/collections/all">Shop</Link>
              <div className="mega-menu commerce-mega-menu">
                <div className="mega-menu-intro">
                  <p className="menu-kicker">Complete catalogue</p>
                  <h2>Shop by object.</h2>
                  <Link href="/collections/all">View all 34 products →</Link>
                </div>
                <div className="mega-category-grid">
                  {Object.entries(categoryContent).map(([slug, category]) => (
                    <section className="mega-category" key={slug}>
                      <Link className="mega-category-title" href={`/collections/${slug}`}>{category.name}</Link>
                      <ul>
                        {subcategoryContent[slug as ProductCategory].map((subcategory) => (
                          <li key={subcategory.slug}><Link href={`/collections/${slug}/${subcategory.slug}`}>{subcategory.name}</Link></li>
                        ))}
                      </ul>
                    </section>
                  ))}
                </div>
                <div className="mega-featured-products">
                  <p className="menu-kicker">Popular pieces</p>
                  <ul>
                    {featuredProducts.slice(0, 4).map((product) => (
                      <li key={product.slug}><Link href={`/products/${product.slug}`}>{product.name}<span aria-hidden="true">→</span></Link></li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="nav-menu">
              <Link className="nav-trigger" href="/materials">Discover</Link>
              <div className="mega-menu discover-mega-menu">
                <section><p className="menu-kicker">Shop by metal</p><h2>Begin with the material.</h2>{Object.entries(materialStories).map(([slug, material]) => <Link key={slug} href={`/collections/all?material=${slug}`}><strong>{material.shortName}</strong><small>{material.description}</small></Link>)}</section>
                <section><p className="menu-kicker">Shop by use</p><div className="discover-use-grid">{Object.entries(useLabels).map(([slug, label]) => <Link key={slug} href={`/collections/all?use=${slug}`}>{label}<span aria-hidden="true">→</span></Link>)}</div></section>
              </div>
            </div>

            <div className="nav-menu">
              <Link className="nav-trigger" href="/#shop-by-space">Shop by space</Link>
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
            </div>

            <Link href="/our-craft">Our craft</Link>
            <div className="nav-menu"><Link className="nav-trigger" href="/gifting">Gifting</Link><div className="mega-menu gifting-mega-menu"><div><p className="menu-kicker">Gifts with a life beyond the occasion</p><h2>Chosen by ritual, recipient and budget.</h2><Link href="/gifting">Explore all gifting →</Link></div><ul><li><Link href="/gifting#occasions">Wedding & housewarming</Link></li><li><Link href="/gifting#budgets">Gifts by budget</Link></li><li><Link href="/trade?service=corporate-gifting">Corporate gifting</Link></li><li><Link href="/gifting#presentation">Presentation & messages</Link></li></ul></div></div>
            <div className="nav-menu"><Link className="nav-trigger" href="/trade">Trade</Link><div className="mega-menu trade-mega-menu"><div><p className="menu-kicker">For professional briefs</p><h2>Hospitality, workplaces and considered interiors.</h2><Link href="/trade">Request a trade quote →</Link></div><ul className="audience-menu-list">{["offices", "restaurants", "hotels", "interior-designers"].map((slug) => <li key={slug}><Link href={`/shop-for/${slug}`}>{audienceContent[slug as keyof typeof audienceContent].name}</Link></li>)}</ul></div></div>
            <Link href="/journal">Journal</Link>
          </nav>

          <div className="header-actions" aria-label="Shopping actions"><HeaderCommerceActions /></div>
        </div>
        <nav className="category-nav shell" aria-label="Shop product categories">
          <Link className="category-nav-all" href="/collections/all">All products</Link>
          {Object.entries(categoryContent).map(([slug, category]) => {
            const categoryProducts = featuredProducts.filter((product) => product.category === slug).slice(0, 2);
            return <div className="category-nav-menu" key={slug}>
              <Link className="category-nav-trigger" href={`/collections/${slug}`}>{category.name}</Link>
              <div className="category-nav-dropdown">
                <div>
                  <p className="menu-kicker">{category.name}</p>
                  <Link className="category-nav-view-all" href={`/collections/${slug}`}>View all {category.name} →</Link>
                </div>
                <ul>
                  {subcategoryContent[slug as ProductCategory].map((subcategory) => <li key={subcategory.slug}><Link href={`/collections/${slug}/${subcategory.slug}`}><strong>{subcategory.name}</strong><small>{subcategory.productSlugs.length} {subcategory.productSlugs.length === 1 ? "product" : "products"}</small></Link></li>)}
                </ul>
                {categoryProducts.length ? <div className="category-nav-featured"><p className="menu-kicker">Featured products</p>{categoryProducts.map((product) => <Link key={product.slug} href={`/products/${product.slug}`}>{product.name}<span aria-hidden="true">→</span></Link>)}</div> : null}
              </div>
            </div>;
          })}
          <Link href="/gifting">Gifting</Link>
          <Link href="/trade">Trade</Link>
        </nav>
      </header>
    </>
  );
}
