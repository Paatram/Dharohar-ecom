"use client";

import { useState } from "react";
import { Heart, MapPin, Scale, ShoppingBag, Zap } from "lucide-react";
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
  const { addToCart, setCartOpen, wishlist, compare, toggleWishlist, toggleCompare } = useStore();
  const [added, setAdded] = useState(false);
  const add = () => { addToCart(slug); setAdded(true); window.setTimeout(() => setAdded(false), 900); };
  const saved = wishlist.includes(slug);
  const compared = compare.includes(slug);
  return <div className="purchase-actions">
    <div className="primary-purchase-actions">
      <button className={`button button-outline product-cta ${added ? "added" : ""}`} type="button" onClick={add}><ShoppingBag size={17} aria-hidden="true" />{added ? "Added to bag" : "Add to bag"}</button>
      <button className="button button-wine product-cta" type="button" onClick={() => { window.sessionStorage.setItem("dharohar-buy-now-slug", slug); setCartOpen(false); window.location.assign("/checkout"); }}><Zap size={17} aria-hidden="true" />Buy now</button>
    </div>
    <div><button className={saved ? "active" : ""} type="button" onClick={() => toggleWishlist(slug)}><Heart size={16} fill={saved ? "currentColor" : "none"} aria-hidden="true" />{saved ? "Saved" : "Save for later"}</button><button className={compared ? "active" : ""} type="button" onClick={() => toggleCompare(slug)}><Scale size={16} aria-hidden="true" />{compared ? "Comparing" : "Compare"}</button></div>
  </div>;
}

export function DeliveryChecker() {
  const [value, setValue] = useStateSafe("");
  const [message, setMessage] = useStateSafe("");
  const [loading, setLoading] = useState(false);
  return <form className="delivery-checker" onSubmit={async (event) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(value)) { setMessage("Enter a valid 6-digit Indian pincode."); return; }
    setLoading(true); setMessage("Finding your location…");
    try {
      const response = await fetch(`/api/commerce/postcode?pincode=${value}`);
      const result = await response.json() as { city?: string; state?: string; message?: string };
      setMessage(response.ok && result.city && result.state ? `${result.city}, ${result.state} selected. Delivery options will be confirmed at checkout.` : result.message ?? "We could not find that pincode. You can enter the address at checkout.");
    } catch { setMessage("We could not look up that pincode. You can enter the address at checkout."); }
    finally { setLoading(false); }
  }}>
    <label htmlFor="delivery-pincode"><MapPin size={15} aria-hidden="true" /> Check delivery location</label><div><input id="delivery-pincode" inputMode="numeric" maxLength={6} value={value} onChange={(event) => setValue(event.target.value.replace(/\D/g, ""))} placeholder="6-digit pincode" /><button disabled={loading} type="submit">{loading ? "Checking" : "Check"}</button></div>{message ? <p role="status">{message}</p> : null}
  </form>;
}

function useStateSafe(initial: string) { return useState(initial); }
