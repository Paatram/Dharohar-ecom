import Image from "next/image";
import Link from "next/link";
import { audienceContent, categoryContent, featuredProducts, subcategoryContent, type ProductCategory } from "@/lib/catalog";
import { MobileMenu } from "./MobileMenu";

export function SiteHeader() {
  return (
    <>
      <div className="announcement">
        Handcrafted in India <span aria-hidden="true">·</span> Pure metals <span aria-hidden="true">·</span> Lifetime craftsmanship care
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

            <Link href="/materials">Materials</Link>
            <Link href="/our-craft">Our craft</Link>
            <Link href="/care">Care</Link>
          </nav>

          <div className="header-actions" aria-label="Shopping actions">
            <Link href="/contact">Enquire</Link>
          </div>
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
          <Link href="/shop-for/gifting">Gifting</Link>
          <Link href="/shop-for/restaurants">Hospitality</Link>
        </nav>
      </header>
    </>
  );
}
