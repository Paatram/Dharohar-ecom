"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type CartLine = { slug: string; quantity: number };
type StoreState = {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  cartOpen: boolean;
  searchOpen: boolean;
  addToCart: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  toggleWishlist: (slug: string) => void;
  toggleCompare: (slug: string) => void;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
};

const StoreContext = createContext<StoreState | null>(null);
const storageKey = "dharohar-store-state-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) ?? "{}") as Partial<Pick<StoreState, "cart" | "wishlist" | "compare">>;
        if (Array.isArray(saved.cart)) setCart(saved.cart.filter((line) => typeof line?.slug === "string" && Number.isInteger(line.quantity) && line.quantity > 0));
        if (Array.isArray(saved.wishlist)) setWishlist(saved.wishlist.filter((slug): slug is string => typeof slug === "string"));
        if (Array.isArray(saved.compare)) setCompare(saved.compare.filter((slug): slug is string => typeof slug === "string").slice(0, 3));
      } catch { /* Ignore malformed browser storage. */ }
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(storageKey, JSON.stringify({ cart, wishlist, compare }));
  }, [cart, wishlist, compare, hydrated]);

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

  const value = useMemo(() => ({ cart, wishlist, compare, cartOpen, searchOpen, addToCart, setQuantity, removeFromCart, toggleWishlist, toggleCompare, setCartOpen, setSearchOpen }), [cart, wishlist, compare, cartOpen, searchOpen, addToCart, setQuantity, removeFromCart, toggleWishlist, toggleCompare]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside StoreProvider");
  return context;
}
