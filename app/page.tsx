import Image from "next/image";
import Link from "next/link";
import { HomeProductExplorer } from "@/components/commerce/HomeProductExplorer";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import {
  audienceContent,
  categoryContent,
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
        <section className="hero" aria-labelledby="hero-title">
          <Image
            src="/images/dharohar/brand/dharohar-hero-tableau.webp"
            alt="Dharohar copper and brass vessels arranged in a warm heritage interior"
            fill
            priority
            sizes="100vw"
          />
          <div className="hero-shade" />
          <div className="shell hero-content">
            <p className="eyebrow eyebrow-gold">The heritage kitchen, reimagined</p>
            <h1 id="hero-title">Made for today.<br /><em>Carried forward.</em></h1>
            <p className="hero-intro">Handcrafted copper, peetal and kansa objects chosen for daily rituals, considered spaces and gifts with a life beyond the occasion.</p>
            <div className="hero-actions">
              <Link className="button button-gold" href="/collections/all">Shop the collection</Link>
              <Link className="button button-ghost" href="#shop-by-space">Shop by space</Link>
            </div>
            <div className="hero-note">
              <span>34 launch pieces</span>
              <span>Four collections</span>
              <span>One enduring standard</span>
            </div>
          </div>
        </section>

        <section className="section shell category-first" aria-labelledby="category-title">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Enter through the object</p>
              <h2 id="category-title">Shop the collection.</h2>
            </div>
            <p>Four clear families make it easy to begin with one useful piece or compose a complete material story.</p>
          </div>
          <div className="category-grid">
            {Object.entries(categoryContent).map(([slug, category], index) => (
              <Link className={`category-card category-card-${index + 1}`} href={`/collections/${slug}`} key={slug}>
                <Image src={category.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
                <div className="image-shade" />
                <span>0{index + 1}</span>
                <div>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <strong>Explore collection <span aria-hidden="true">↗</span></strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section shell space-priority-section" id="shop-by-space" aria-labelledby="audience-title">
          <div className="section-heading audience-heading">
            <p className="eyebrow">Made for your world</p>
            <h2 id="audience-title">Made for the spaces where life gathers.</h2>
            <p>Choose the context first—from a family kitchen to hospitality, workplace, project or meaningful gift.</p>
          </div>
          <div className="audience-grid">
            {Object.entries(audienceContent).map(([slug, audience], index) => <Link className={`audience-card ${index === 0 || index === 5 ? "audience-card-wide" : ""}`} href={`/shop-for/${slug}`} key={slug}>
              <Image src={audience.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" /><div className="image-shade" />
              <div><small>{audience.eyebrow}</small><h3>{audience.name}</h3><p>{audience.description}</p><strong>Explore <span aria-hidden="true">→</span></strong></div>
            </Link>)}
          </div>
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

        <section className="category-product-sections" aria-labelledby="shop-category-title">
          <header className="section shell category-sales-heading">
            <p className="eyebrow">Explore the opening collection</p>
            <h2 id="shop-category-title">Every piece, one place.</h2>
            <p>See the complete collection together, then use the category toggles to narrow it without leaving the page.</p>
          </header>
          <div className="shell"><HomeProductExplorer initialProducts={products} /></div>
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
