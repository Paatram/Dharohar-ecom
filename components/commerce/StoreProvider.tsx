"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

type CartLine = { slug: string; quantity: number };
type StoreState = {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  giftWrap: boolean;
  giftMessage: string;
  cartOpen: boolean;
  searchOpen: boolean;
  addToCart: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  toggleWishlist: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  setGiftWrap: (enabled: boolean) => void;
  setGiftMessage: (message: string) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreState | null>(null);
const storageKey = "dharohar-store-state-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const wishlistSyncReady = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Partial<Pick<StoreState, "cart" | "wishlist" | "compare" | "giftWrap" | "giftMessage">>;
        const storedCart = Array.isArray(saved.cart) ? saved.cart.filter((line) => typeof line?.slug === "string" && Number.isInteger(line.quantity) && line.quantity > 0) : [];
        const buyNowSlug = window.sessionStorage.getItem("dharohar-buy-now-slug");
        const nextCart = buyNowSlug ? (storedCart.some((line) => line.slug === buyNowSlug) ? storedCart.map((line) => line.slug === buyNowSlug ? { ...line, quantity: Math.min(20, line.quantity + 1) } : line) : [...storedCart, { slug: buyNowSlug, quantity: 1 }]) : storedCart;
        if (buyNowSlug) window.sessionStorage.removeItem("dharohar-buy-now-slug");
        setCart(nextCart);
        if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist.filter((slug): slug is string => typeof slug === "string"));
        if (Array.isArray(saved.compare)) setCompare(saved.compare.filter((slug): slug is string => typeof slug === "string").slice(0, 3));
        if (typeof saved.giftWrap === "boolean") setGiftWrap(saved.giftWrap);
        if (typeof saved.giftMessage === "string") setGiftMessage(saved.giftMessage.slice(0, 240));
      } catch { /* Ignore malformed browser storage. */ }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify({ cart, wishlist, compare, giftWrap, giftMessage }));
  }, [cart, wishlist, compare, giftWrap, giftMessage, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    let active = true;
    void fetch("/api/commerce/wishlist", { cache: "no-store" }).then(async (response) => {
      if (!response.ok || !active) return;
      const result = await response.json() as { productSlugs?: string[] };
      const merged = [...new Set([...wishlist, ...(result.productSlugs ?? [])])];
      setWishlist(merged);
      wishlistSyncReady.current = true;
      await fetch("/api/commerce/wishlist", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ productSlugs: merged }) });
    }).catch(() => { /* Device-local wishlist remains available. */ });
    return () => { active = false; };
  // Run once after browser state hydration; later writes use the effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || !wishlistSyncReady.current) return;
    const timer = window.setTimeout(() => {
      void fetch("/api/commerce/wishlist", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ productSlugs: wishlist }) }).catch(() => { /* Retry on the next signed-in change. */ });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [wishlist, hydrated]);

  const addToCart = useCallback((slug: string, quantity = 1) => {
    setCart((current) => current.some((line) => line.slug === slug)
      ? current.map((line) => line.slug === slug ? { ...line, quantity: Math.min(20, line.quantity + quantity) } : line)
      : [...current, { slug, quantity }]);
    setCartOpen(true);
  }, []);
  const setQuantity = useCallback((slug: string, quantity: number) => setCart((current) => quantity < 1 ? current.filter((line) => line.slug !== slug) : current.map((line) => line.slug === slug ? { ...line, quantity: Math.min(20, quantity) } : line)), []);
  const removeFromCart = useCallback((slug: string) => setCart((current) => current.filter((line) => line.slug !== slug)), []);
  const toggleWishlist = useCallback((slug: string) => setWishlist((current) => current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug]), []);
  const toggleCompare = useCallback((slug: string) => setCompare((current) => current.includes(slug) ? current.filter((item) => item !== slug) : current.length < 3 ? [...current, slug] : [...current.slice(1), slug]), []);

  const value = useMemo(() => ({ cart, wishlist, compare, giftWrap, giftMessage, cartOpen, searchOpen, addToCart, setQuantity, removeFromCart, toggleWishlist, toggleCompare, setGiftWrap, setGiftMessage, setCartOpen, setSearchOpen }), [cart, wishlist, compare, giftWrap, giftMessage, cartOpen, searchOpen, addToCart, setQuantity, removeFromCart, toggleWishlist, toggleCompare]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
