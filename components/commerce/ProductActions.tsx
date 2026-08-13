"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, Scale, ShoppingBag } from "lucide-react";
import { useStore } from "./StoreProvider";

export function ProductCardActions({ slug }: { slug: string }) {
  const { wishlist, compare, toggleWishlist, toggleCompare } = useStore();
  const saved = wishlist.includes(slug);
  const compared = compare.includes(slug);
  return <div className="product-card-actions">
    <button type="button" className={`wishlist-action ${saved ? "active" : ""}`} onClick={() => toggleWishlist(slug)} aria-pressed={saved} aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}><Heart className="action-icon" size={18} strokeWidth={1.8} fill={saved ? "currentColor" : "none"} aria-hidden="true" /><span className="action-ring" aria-hidden="true" /></button>
    <button type="button" className={`compare-action ${compared ? "active" : ""}`} onClick={() => toggleCompare(slug)} aria-pressed={compared} aria-label={compared ? "Remove from comparison" : "Add to comparison"}><Scale size={17} strokeWidth={1.8} aria-hidden="true" /></button>
  </div>;
}

export function ProductPurchaseActions({ slug }: { slug: string }) {
  const { addToCart, wishlist, compare, toggleWishlist, toggleCompare } = useStore();
  const [added, setAdded] = useState(false);
  const add = () => { addToCart(slug); setAdded(true); window.setTimeout(() => setAdded(false), 900); };
  const saved = wishlist.includes(slug);
  const compared = compare.includes(slug);
  return <div className="purchase-actions">
    <button className={`button button-wine product-cta ${added ? "added" : ""}`} type="button" onClick={add}><ShoppingBag size={17} aria-hidden="true" />{added ? "Added to bag" : "Add to selection bag"}</button>
    <div><button className={saved ? "active" : ""} type="button" onClick={() => toggleWishlist(slug)}><Heart size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />{saved ? "Saved" : "Save for later"}</button><button className={compared ? "active" : ""} type="button" onClick={() => toggleCompare(slug)}><Scale size={16} aria-hidden="true" />{compared ? "Comparing" : "Compare"}</button></div>
    <Link href={`/contact?product=${slug}`}>Register purchase interest</Link>
  </div>;
}

export function DeliveryChecker() {
  const [value, setValue] = useStateSafe("");
  const [message, setMessage] = useStateSafe("");
  return <form className="delivery-checker" onSubmit={(event) => { event.preventDefault(); setMessage(/^\d{6}$/.test(value) ? "Pincode recorded for preview. Live serviceability and delivery dates activate with the shipping connection." : "Enter a valid 6-digit Indian pincode."); }}>
    <label htmlFor="delivery-pincode"><MapPin size={15} aria-hidden="true" /> Check delivery readiness</label><div><input id="delivery-pincode" inputMode="numeric" maxLength={6} value={value} onChange={(event) => setValue(event.target.value.replace(/\D/g, ""))} placeholder="6-digit pincode" /><button type="submit">Check</button></div>{message ? <p role="status">{message}</p> : null}
  </form>;
}

function useStateSafe(initial: string) { return useState(initial); }
