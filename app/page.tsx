import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/storefront/ProductCard";
import { SiteFooter } from "@/components/storefront/SiteFooter";
import { SiteHeader } from "@/components/storefront/SiteHeader";
import {
  audienceContent,
  categoryContent,
  products,
  type CatalogProduct,
  type ProductCategory,
} from "@/lib/catalog";

const assurances = [
  ["01", "Made in India", "Objects selected from living metal craft traditions."],
  ["02", "Material clarity", "Care, finish and use explained before you choose."],
  ["03", "Considered delivery", "Every piece inspected and packed for its journey."],
  ["04", "Lifetime care", "Guidance, restoration and continuity beyond purchase."],
] as const;

const categoryProductRows = (Object.keys(categoryContent) as ProductCategory[]).map((slug) => {
  const inCategory = products.filter((product) => product.category === slug);
  const displayOrder = [inCategory[0], inCategory.at(-1), inCategory[1], inCategory.at(-2)]
    .filter((product): product is CatalogProduct => Boolean(product))
    .filter((product, index, selected) => selected.findIndex((item) => item.slug === product.slug) === index);
  return { slug, category: categoryContent[slug], products: displayOrder };
});

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
            <h2 id="shop-category-title">Shop by category.</h2>
            <p>A considered selection from every product family, followed by the complete catalogue inside each category.</p>
          </header>
          {categoryProductRows.map(({ slug, category, products: selectedProducts }, index) => <section className={`category-product-row ${index % 2 ? "category-product-row-tint" : ""}`} aria-labelledby={`${slug}-row-title`} key={slug}>
            <div className="shell">
              <div className="category-row-heading">
                <div><p className="eyebrow">0{index + 1} · Product family</p><h3 id={`${slug}-row-title`}>{category.name}</h3><p>{category.description}</p></div>
                <Link className="text-link" href={`/collections/${slug}`}>View all {category.name} <span aria-hidden="true">→</span></Link>
              </div>
              <div className="product-grid product-grid-light">
                {selectedProducts.map((product) => <ProductCard product={product} key={product.slug} />)}
              </div>
            </div>
          </section>)}
        </section>

        <section className="section shell" id="shop-by-space" aria-labelledby="audience-title">
          <div className="section-heading audience-heading">
            <p className="eyebrow">Enter through your world</p>
            <h2 id="audience-title">Made for the spaces where life gathers.</h2>
            <p>Every Dharohar piece belongs to a product collection and to the context in which it will be used.</p>
          </div>
          <div className="audience-grid">
            {Object.entries(audienceContent).map(([slug, audience], index) => (
              <Link className={`audience-card ${index === 0 || index === 5 ? "audience-card-wide" : ""}`} href={`/shop-for/${slug}`} key={slug}>
                <Image src={audience.image} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />
                <div className="image-shade" />
                <div>
                  <small>{audience.eyebrow}</small>
                  <h3>{audience.name}</h3>
                  <p>{audience.description}</p>
                  <strong>Explore <span aria-hidden="true">→</span></strong>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="material-story" aria-labelledby="materials-title">
          <div className="shell material-layout">
            <div className="material-image">
              <Image src="/images/dharohar/products/brass-patila.webp" alt="Hand-finished brass patila" fill sizes="(max-width: 900px) 100vw, 46vw" />
            </div>
            <div className="material-copy">
              <p className="eyebrow eyebrow-gold">Know what you bring home</p>
              <h2 id="materials-title">Material before marketing.</h2>
              <p className="material-intro">Traditional metals ask for clarity. We explain composition, lining, compatibility, care and the natural changes that come with use—before a piece enters your home.</p>
              <ol>
                <li><span>01</span><div><h3>Tamra · Copper</h3><p>Responsive, luminous and expressive in the way it develops character.</p></div></li>
                <li><span>02</span><div><h3>Peetal · Brass</h3><p>Warm, familiar and suited to generous everyday forms.</p></div></li>
                <li><span>03</span><div><h3>Kansa · Bronze</h3><p>Grounded in tone and weight, with a calm presence at the table.</p></div></li>
              </ol>
              <Link className="button button-gold" href="/materials">Explore the material library</Link>
            </div>
          </div>
        </section>

        <section className="section shell service-grid" aria-label="Dharohar services">
          <article className="service-card service-card-gifting">
            <p className="eyebrow eyebrow-gold">Personalisation & gifting</p>
            <h2>A gift that enters another family’s story.</h2>
            <p>Presentation, engraving and coordinated fulfilment for personal occasions, weddings and institutions.</p>
            <Link className="button button-ghost" href="/shop-for/gifting">Explore gifting</Link>
          </article>
          <article className="service-card service-card-care">
            <p className="eyebrow">Lifetime craftsmanship care</p>
            <h2>Use it. Care for it. Restore it.</h2>
            <p>Material-specific guidance and a restoration pathway keep meaningful objects in circulation.</p>
            <Link className="button button-wine" href="/care">Understand lifetime care</Link>
          </article>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
