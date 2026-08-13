"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  audienceContent,
  categoryContent,
  featuredProducts,
  subcategoryContent,
  type ProductCategory,
} from "@/lib/catalog";
import { materialStories, useLabels } from "@/lib/merchandising";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const close = () => setOpen(false);

  return <div className="mobile-navigation">
    <button className="hamburger-button" type="button" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-drawer" onClick={() => setOpen((current) => !current)}>
      <span /><span /><span />
    </button>
    {open ? <button className="mobile-drawer-scrim" type="button" aria-label="Close navigation" onClick={close} /> : null}
    <aside className={`mobile-drawer ${open ? "mobile-drawer-open" : ""}`} id="mobile-drawer" aria-hidden={!open}>
      <div className="mobile-drawer-header">
        <div><small>Dharohar</small><strong>Explore the collection</strong></div>
        <button type="button" aria-label="Close navigation" onClick={close}>×</button>
      </div>
      <nav aria-label="Mobile navigation">
        <Link className="mobile-shop-all" href="/collections/all" onClick={close}>All products <span aria-hidden="true">→</span></Link>
        <p>Shop by category</p>
        {Object.entries(categoryContent).map(([slug, category]) => <details className="mobile-category" key={slug}>
          <summary>{category.name}<small>{subcategoryContent[slug as ProductCategory].length} groups</small></summary>
          <div>
            <Link className="mobile-category-all" href={`/collections/${slug}`} onClick={close}>View all {category.name}</Link>
            {subcategoryContent[slug as ProductCategory].map((subcategory) => <Link key={subcategory.slug} href={`/collections/${slug}/${subcategory.slug}`} onClick={close}>{subcategory.name}<small>{subcategory.productSlugs.length}</small></Link>)}
          </div>
        </details>)}
        <p>Shop by metal</p>
        <div className="mobile-menu-links mobile-space-links">
          {Object.entries(materialStories).map(([slug, material]) => <Link key={slug} href={`/collections/all?material=${slug}`} onClick={close}>{material.shortName}</Link>)}
        </div>
        <p>Shop by use</p>
        <div className="mobile-menu-links mobile-space-links">
          {Object.entries(useLabels).map(([slug, label]) => <Link key={slug} href={`/collections/all?use=${slug}`} onClick={close}>{label}</Link>)}
        </div>
        <p>Popular products</p>
        <div className="mobile-menu-links">
          {featuredProducts.slice(0, 4).map((product) => <Link key={product.slug} href={`/products/${product.slug}`} onClick={close}>{product.name}</Link>)}
        </div>
        <p>Shop by space</p>
        <div className="mobile-menu-links mobile-space-links">
          {Object.entries(audienceContent).map(([slug, audience]) => <Link key={slug} href={`/shop-for/${slug}`} onClick={close}>{audience.name}</Link>)}
        </div>
        <div className="mobile-menu-utility">
          <Link href="/materials" onClick={close}>Materials</Link>
          <Link href="/our-craft" onClick={close}>Our craft</Link>
          <Link href="/care" onClick={close}>Care</Link>
          <Link href="/gifting" onClick={close}>Gifting</Link>
          <Link href="/trade" onClick={close}>Trade quote</Link>
          <Link href="/journal" onClick={close}>Journal</Link>
          <Link href="/account" onClick={close}>Account</Link>
        </div>
      </nav>
    </aside>
  </div>;
}
