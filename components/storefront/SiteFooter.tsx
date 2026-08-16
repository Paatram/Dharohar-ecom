import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { categoryContent } from "@/lib/catalog";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-lead">
        <div>
          <p className="eyebrow eyebrow-gold">Need help choosing?</p>
          <h2>Find the right pieces for your home, space or gift.</h2>
        </div>
        <div className="newsletter">
          <p>Our team can help with materials, quantities, gifting and care.</p>
          <Link className="text-link text-link-light" href="/contact">Talk to Dharohar <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <div className="shell footer-grid">
        <div className="footer-brand">
          <strong>DHAROHAR</strong>
          <p>Crafted by tradition. Carried by you.</p>
          <nav className="footer-socials" aria-label="Dharohar social media">
            <a href="https://www.instagram.com/dharohar91/" target="_blank" rel="noreferrer" aria-label="Dharohar on Instagram"><Instagram size={18} /></a>
            <a href="https://www.linkedin.com/company/dharohar91/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="Dharohar on LinkedIn"><Linkedin size={18} /></a>
            <a href="https://x.com/Dharoharxt42" target="_blank" rel="noreferrer" aria-label="Dharohar on X">X</a>
            <a href="https://www.facebook.com/profile.php?id=61592081474548" target="_blank" rel="noreferrer" aria-label="Dharohar on Facebook"><Facebook size={18} /></a>
          </nav>
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
          <Link href="/care#plans">Care plans & restoration</Link>
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
