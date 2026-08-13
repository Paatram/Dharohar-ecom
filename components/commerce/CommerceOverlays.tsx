"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Scale, Search, ShoppingBag, X } from "lucide-react";
import { findProduct, formatInr, products } from "@/lib/catalog";
import { materialLabels, searchProducts } from "@/lib/merchandising";
import { useStore } from "./StoreProvider";

export function HeaderCommerceActions() {
  const { cart, wishlist, compare, setCartOpen, setSearchOpen } = useStore();
  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  return <div className="commerce-actions">
    <button className="header-icon-action" type="button" onClick={() => setSearchOpen(true)} aria-label="Search Dharohar"><Search size={19} strokeWidth={1.7} aria-hidden="true" /><span className="action-tooltip">Search</span></button>
    <Link className={`header-icon-action header-heart ${wishlist.length ? "has-items" : ""}`} href="/wishlist" aria-label={`Wishlist with ${wishlist.length} items`}><Heart size={19} strokeWidth={1.7} fill={wishlist.length ? "currentColor" : "none"} aria-hidden="true" />{wishlist.length ? <span className="action-count">{wishlist.length}</span> : null}<span className="action-tooltip">Wishlist</span></Link>
    <Link className="header-icon-action" href="/compare" aria-label={`Compare ${compare.length} items`}><Scale size={19} strokeWidth={1.7} aria-hidden="true" />{compare.length ? <span className="action-count">{compare.length}</span> : null}<span className="action-tooltip">Compare</span></Link>
    <button className="header-icon-action" type="button" onClick={() => setCartOpen(true)} aria-label={`Open selection bag with ${cartCount} items`}><ShoppingBag size={19} strokeWidth={1.7} aria-hidden="true" />{cartCount ? <span className="action-count">{cartCount}</span> : null}<span className="action-tooltip">Bag</span></button>
  </div>;
}

export function CommerceOverlays() {
  return <><SearchDialog /><CartDrawer /></>;
}

function SearchDialog() {
  const { searchOpen, setSearchOpen } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => query ? searchProducts(query).slice(0, 6) : products.filter((product) => product.featured).slice(0, 4), [query]);
  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 20);
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSearchOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { window.clearTimeout(timer); document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [searchOpen, setSearchOpen]);
  if (!searchOpen) return null;
  return <div className="overlay-shell search-overlay" role="dialog" aria-modal="true" aria-label="Search products">
    <button className="overlay-scrim" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)} />
    <section className="search-panel">
      <header><p className="eyebrow">Find an object</p><button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={19} aria-hidden="true" /></button></header>
      <form action="/search" onSubmit={() => setSearchOpen(false)}>
        <label htmlFor="global-search">Search by object, metal, finish or use</label>
        <div><input ref={inputRef} id="global-search" name="q" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “copper bottle” or “dining”" autoComplete="off" /><button type="submit">View results</button></div>
      </form>
      <p className="search-caption">{query ? `${results.length}${searchProducts(query).length > 6 ? "+" : ""} matching pieces` : "Popular pieces"}</p>
      <div className="search-results">
        {results.map((product) => <Link href={`/products/${product.slug}`} key={product.slug} onClick={() => setSearchOpen(false)}><Image src={product.image} alt="" width={84} height={96} /><span><strong>{product.name}</strong><small>{materialLabels[product.material]} · {formatInr(product.sellingPricePaise)}</small></span></Link>)}
        {query && !results.length ? <div className="empty-state"><strong>No exact match yet.</strong><p>Try a metal such as copper, peetal or kansa, or browse the complete collection.</p><Link href="/collections/all" onClick={() => setSearchOpen(false)}>Browse all products</Link></div> : null}
      </div>
    </section>
  </div>;
}

function CartDrawer() {
  const { cart, cartOpen, giftWrap, giftMessage, setCartOpen, setQuantity, removeFromCart, setGiftWrap, setGiftMessage } = useStore();
  const lines = cart.map((line) => ({ ...line, product: findProduct(line.slug) })).filter((line): line is typeof line & { product: NonNullable<typeof line.product> } => Boolean(line.product));
  const subtotal = lines.reduce((sum, line) => sum + line.product.sellingPricePaise * line.quantity, 0);
  useEffect(() => {
    if (!cartOpen) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setCartOpen(false); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", close); };
  }, [cartOpen, setCartOpen]);
  return <div className={`drawer-layer ${cartOpen ? "drawer-layer-open" : ""}`} aria-hidden={!cartOpen}>
    <button className="overlay-scrim" type="button" aria-label="Close bag" onClick={() => setCartOpen(false)} />
    <aside className="cart-drawer" aria-label="Selection bag">
      <header><div><p className="eyebrow">Your selection</p><h2>Bag</h2></div><button type="button" onClick={() => setCartOpen(false)} aria-label="Close bag"><X size={19} aria-hidden="true" /></button></header>
      <div className="cart-readiness"><strong>Preview mode</strong><p>Your selection is saved on this device. Payment opens only after the catalogue and fulfilment launch gates pass.</p></div>
      <div className="cart-lines">
        {lines.map(({ product, quantity }) => <article key={product.slug}><Image src={product.image} alt="" width={92} height={108} /><div><Link href={`/products/${product.slug}`} onClick={() => setCartOpen(false)}>{product.name}</Link><small>{product.finish} · {formatInr(product.sellingPricePaise)}</small><div className="quantity-control"><button type="button" onClick={() => setQuantity(product.slug, quantity - 1)} aria-label={`Decrease ${product.name} quantity`}>−</button><span>{quantity}</span><button type="button" onClick={() => setQuantity(product.slug, quantity + 1)} aria-label={`Increase ${product.name} quantity`}>+</button><button type="button" onClick={() => removeFromCart(product.slug)}>Remove</button></div></div></article>)}
        {!lines.length ? <div className="empty-state"><strong>Your bag is waiting.</strong><p>Save a considered group of pieces while you explore.</p><Link href="/collections/all" onClick={() => setCartOpen(false)}>Explore the collection</Link></div> : null}
      </div>
      {lines.length ? <footer>
        <label className="gift-toggle"><input type="checkbox" checked={giftWrap} onChange={(event) => setGiftWrap(event.target.checked)} /><span>Add gift presentation and a message <small>Your choice is saved with this bag on this device.</small></span></label>
        {giftWrap ? <label className="gift-message">Gift message<textarea value={giftMessage} maxLength={240} rows={3} onChange={(event) => setGiftMessage(event.target.value)} placeholder="Write a message for the recipient" /><small>{giftMessage.length}/240 · Presentation availability and price are confirmed before launch.</small></label> : null}
        <div className="cart-total"><span>Indicative product total</span><strong>{formatInr(subtotal)}</strong></div>
        <p>GST treatment, delivery fees and serviceability are not yet confirmed and are therefore excluded.</p>
        <Link className="button button-wine" href="/checkout-readiness" onClick={() => setCartOpen(false)}>Review checkout readiness</Link>
        <Link className="cart-enquire" href="/cart" onClick={() => setCartOpen(false)}>View full selection bag</Link>
        <Link className="cart-enquire" href="/contact" onClick={() => setCartOpen(false)}>Enquire about this selection</Link>
      </footer> : null}
    </aside>
  </div>;
}
