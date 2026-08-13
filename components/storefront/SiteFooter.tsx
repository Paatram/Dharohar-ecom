import Link from "next/link";
import { categoryContent } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-lead">
        <div>
          <p className="eyebrow eyebrow-gold">The Dharohar correspondence</p>
          <h2>Stories of material, makers and the modern Indian table.</h2>
        </div>
        <div className="newsletter newsletter-preview">
          <p>Correspondence will open with the verified collection launch.</p>
          <Link className="text-link text-link-light" href="/contact">Make an enquiry <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className="shell footer-grid">
        <div className="footer-brand">
          <strong>DHAROHAR</strong>
          <p>Crafted by tradition. Carried by you.</p>
        </div>
        <div>
          <h3>Shop</h3>
          {Object.entries(categoryContent).map(([slug, category]) => (
            <Link key={slug} href={`/collections/${slug}`}>{category.name}</Link>
          ))}
        </div>
        <div>
          <h3>Services</h3>
          <Link href="/shop-for/gifting">Gifting</Link>
          <Link href="/shop-for/interior-designers">Trade & designers</Link>
          <Link href="/shop-for/restaurants">Restaurants</Link>
          <Link href="/care">Care & restoration</Link>
          <Link href="/trade">Request a trade quote</Link>
          <Link href="/gifting">Gifts by occasion</Link>
        </div>
        <div>
          <h3>Help</h3>
          <Link href="/shipping-returns">Shipping & returns</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/account">Account & orders</Link>
          <Link href="/track-order">Track an order</Link>
          <Link href="/faq">Frequently asked questions</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Dharohar</span>
        <span>Made with care in India</span>
      </div>
    </footer>
  );
}
