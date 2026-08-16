import Image from "next/image";
import Link from "next/link";
import { HomeProductExplorer } from "@/components/commerce/HomeProductExplorer";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import {
  audienceContent,
  products,
} from "@/lib/catalog";
import { useLabels } from "@/lib/merchandising";

const assurances = [
  ["01", "Made in India", "Objects selected from living metal craft traditions."],
  ["02", "Material clarity", "Care, finish and use explained before you choose."],
  ["03", "Considered delivery", "Every piece inspected and packed for its journey."],
  ["04", "Care continuity", "Product-specific guidance designed to remain with the object."],
] as const;

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="hero storefront-hero" aria-labelledby="storefront-hero-title">
          <Image src="/images/dharohar/brand/dharohar-hero-tableau.webp" alt="A considered Dharohar table setting with brass and copper vessels" fill priority sizes="100vw" />
          <div className="hero-shade" />
          <div className="shell storefront-hero-layout">
            <div className="storefront-hero-content">
              <p className="eyebrow eyebrow-gold">The Dharohar collection</p>
              <h1 id="storefront-hero-title">The Heritage Kitchen, <em>Reimagined.</em></h1>
              <p className="hero-intro">Metalware chosen for how you cook, host, work and gift—presented with the clarity a modern purchase deserves.</p>
              <div className="hero-actions"><Link className="button button-gold" href="#shop-collection">Shop the collection</Link><Link className="button button-ghost" href="#shop-by-space">Choose by space</Link></div>
            </div>
          </div>
          <nav className="shell hero-shop-finder" aria-label="Quick ways to shop">
            <Link href="/shop-for/households"><small>Made for</small><strong>Homes & families</strong></Link>
            <Link href="/shop-for/offices"><small>For work</small><strong>Offices & teams</strong></Link>
            <Link href="/shop-for/restaurants"><small>For service</small><strong>Restaurants & hotels</strong></Link>
            <Link href="/shop-for/interior-designers"><small>For projects</small><strong>Designers & gifting</strong></Link>
            <Link className="hero-shop-finder-go" href="#shop-by-space" aria-label="Explore all spaces"><span aria-hidden="true">→</span></Link>
          </nav>
        </section>

        <section className="section shell space-priority-section commerce-entry" id="shop-by-space" aria-labelledby="audience-title">
          <div className="space-section-heading">
            <div>
              <p className="eyebrow">Shop by space</p>
              <h2 id="audience-title">Choose for where it belongs.</h2>
            </div>
            <div><p>Start with the setting—from a family kitchen to hospitality, workplace, design project or meaningful gift.</p><Link className="text-link" href="#shop-collection">Browse all 34 products <span aria-hidden="true">→</span></Link></div>
          </div>
          <nav className="space-quick-links" aria-label="Space shortcuts"><a href="#space-cards">All spaces</a><Link href="/shop-for/households">Everyday living</Link><Link href="/shop-for/hotels">Hospitality</Link><Link href="/trade">Projects & gifting</Link></nav>
          <div className="space-card-grid" id="space-cards">
            {Object.entries(audienceContent).map(([slug, audience]) => <Link className="space-card" href={`/shop-for/${slug}`} key={slug}>
              <Image src={audience.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" /><div className="image-shade" />
              <div><small>{audience.eyebrow}</small><h3>{audience.name}</h3><p>{products.filter((product) => product.audiences.includes(slug as keyof typeof audienceContent)).length} suitable pieces</p><strong>Explore <span aria-hidden="true">→</span></strong></div>
            </Link>)}
          </div>
        </section>

        <section className="category-product-sections home-shop-section" id="shop-collection" aria-labelledby="shop-category-title">
          <header className="section shell category-sales-heading">
            <p className="eyebrow">Shop Dharohar</p>
            <h2 id="shop-category-title">Find the right piece.</h2>
            <p>Filter the complete collection by product family, price, metal, use, finish or the space you are selecting for.</p>
          </header>
          <div className="shell"><HomeProductExplorer initialProducts={products} /></div>
        </section>

        <section className="assurance-strip" aria-label="Dharohar assurances">
          <div className="shell assurance-grid">
            {assurances.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span>
                <div><h2>{title}</h2><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="use-shortcuts shell" aria-labelledby="shop-by-use-title">
          <div><p className="eyebrow">Shop by use</p><h2 id="shop-by-use-title">Begin with the ritual.</h2></div>
          <nav aria-label="Shop products by use">{Object.entries(useLabels).map(([slug, label]) => <Link key={slug} href={`/collections/all?use=${slug}`}><span>{label}</span><strong aria-hidden="true">→</strong></Link>)}</nav>
        </section>

        <section className="material-compact shell" aria-labelledby="materials-title">
          <div><p className="eyebrow">Material clarity</p><h2 id="materials-title">Know what you bring home.</h2></div>
          <p>Composition, lining, compatibility and care belong on the exact product record. Use our short guide when material matters to your decision.</p>
          <Link className="text-link" href="/materials">Read the material guide <span aria-hidden="true">→</span></Link>
        </section>

        <section className="care-home-feature" aria-labelledby="care-home-title">
          <div className="shell care-home-layout"><div><p className="eyebrow eyebrow-gold">Dharohar Care Circle</p><h2 id="care-home-title">The relationship should not end at purchase.</h2><p>Compare care subscription paths, build a private care rhythm, and enter a future restoration pathway with clear assessment standards.</p></div><div className="care-home-points"><span>01 <strong>Choose the right care plan</strong></span><span>02 <strong>Save a care rhythm on this device</strong></span><span>03 <strong>Prepare for verified restoration support</strong></span><Link className="button button-gold" href="/care#plans">View care plans</Link></div></div>
        </section>

        <section className="section shell service-grid service-grid-secondary" aria-label="Dharohar services">
          <article className="service-card service-card-gifting">
            <p className="eyebrow eyebrow-gold">Personalisation & gifting</p>
            <h2>A gift that enters another family’s story.</h2>
            <p>Presentation, engraving and coordinated fulfilment for personal occasions, weddings and institutions.</p>
            <Link className="button button-ghost" href="/shop-for/gifting">Explore gifting</Link>
          </article>
          <article className="service-card service-card-care">
            <p className="eyebrow">Trade & projects</p>
            <h2>Source with a clear brief.</h2>
            <p>Quantities, finish, GST, destination and required date brought into one feasibility-led project route.</p>
            <Link className="button button-wine" href="/trade">Prepare a trade brief</Link>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
