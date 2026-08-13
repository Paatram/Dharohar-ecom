"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore } from "./StoreProvider";

export function ProductCardActions({ slug }: { slug: string }) {
  const { wishlist, compare, toggleWishlist, toggleCompare } = useStore();
  const saved = wishlist.includes(slug);
  const compared = compare.includes(slug);
  return <div className="product-card-actions">
    <button type="button" className={saved ? "active" : ""} onClick={() => toggleWishlist(slug)} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}>{saved ? "♥" : "♡"}</button>
    <button type="button" className={compared ? "active" : ""} onClick={() => toggleCompare(slug)} aria-pressed={compared} aria-label={compared ? "Remove from comparison" : "Add to comparison"}>⇄</button>
  </div>;
}

export function ProductPurchaseActions({ slug }: { slug: string }) {
  const { addToCart, wishlist, compare, toggleWishlist, toggleCompare } = useStore();
  return <div className="purchase-actions">
    <button className="button button-wine product-cta" type="button" onClick={() => addToCart(slug)}>Add to selection bag</button>
    <div><button type="button" onClick={() => toggleWishlist(slug)}>{wishlist.includes(slug) ? "♥ Saved" : "♡ Save for later"}</button><button type="button" onClick={() => toggleCompare(slug)}>{compare.includes(slug) ? "✓ Comparing" : "⇄ Compare"}</button></div>
    <Link href={`/contact?product=${slug}`}>Register purchase interest</Link>
  </div>;
}

export function DeliveryChecker() {
  const [value, setValue] = useStateSafe("");
  const [message, setMessage] = useStateSafe("");
  return <form className="delivery-checker" onSubmit={(event) => { event.preventDefault(); setMessage(/^\d{6}$/.test(value) ? "Pincode recorded for preview. Live serviceability and delivery dates activate with the shipping connection." : "Enter a valid 6-digit Indian pincode."); }}>
    <label htmlFor="delivery-pincode">Check delivery readiness</label><div><input id="delivery-pincode" inputMode="numeric" maxLength={6} value={value} onChange={(event) => setValue(event.target.value.replace(/\D/g, ""))} placeholder="6-digit pincode" /><button type="submit">Check</button></div>{message ? <p role="status">{message}</p> : null}
  </form>;
}

function useStateSafe(initial: string) { return useState(initial); }
