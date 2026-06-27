import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  size: string;
  price: number;
  qty: number;
  image?: string;
};

export type WishlistItem = {
  id: string;
  size: string;
};

type ShopState = {
  cart: CartItem[];
  wishlist: WishlistItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, size: string) => void;
  updateQty: (id: string, size: string, qty: number) => void;
  clearCart: () => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string, size: string) => void;
  toggleWishlist: (item: WishlistItem) => void;
  isWishlisted: (id: string, size: string) => boolean;
};

const ShopContext = createContext<ShopState | null>(null);

const CART_STORAGE_KEY = "svom_cart_v1";
const WISHLIST_STORAGE_KEY = "svom_wishlist_v1";

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const cartRaw = localStorage.getItem(CART_STORAGE_KEY);
      if (cartRaw) {
        const data = JSON.parse(cartRaw);
        setCart(data.cart || []);
      }
      const wishlistRaw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (wishlistRaw) {
        setWishlist(JSON.parse(wishlistRaw));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart }));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const addToCart: ShopState["addToCart"] = (item) => {
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id && p.size === item.size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
  };

  const removeFromCart: ShopState["removeFromCart"] = (id, size) =>
    setCart((prev) => prev.filter((p) => !(p.id === id && p.size === size)));

  const updateQty: ShopState["updateQty"] = (id, size, qty) =>
    setCart((prev) =>
      prev.map((p) => (p.id === id && p.size === size ? { ...p, qty: Math.max(1, qty) } : p))
    );

  const clearCart = () => setCart([]);

  const addToWishlist: ShopState["addToWishlist"] = (item) => {
    setWishlist((prev) => {
      if (prev.some((entry) => entry.id === item.id && entry.size === item.size)) {
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromWishlist: ShopState["removeFromWishlist"] = (id, size) =>
    setWishlist((prev) => prev.filter((item) => !(item.id === id && item.size === size)));

  const toggleWishlist: ShopState["toggleWishlist"] = (item) => {
    setWishlist((prev) => {
      if (prev.some((entry) => entry.id === item.id && entry.size === item.size)) {
        return prev.filter((entry) => !(entry.id === item.id && entry.size === item.size));
      }
      return [...prev, item];
    });
  };

  const isWishlisted: ShopState["isWishlisted"] = (id, size) =>
    wishlist.some((item) => item.id === id && item.size === size);

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isWishlisted,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}