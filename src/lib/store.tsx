import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [userId, setUserId] = useState<string | null>(null);

  // Initial Auth & LocalStorage
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUserId(data.session?.user?.id ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUserId(session?.user?.id ?? null);
    });

    try {
      const cartRaw = localStorage.getItem(CART_STORAGE_KEY);
      if (cartRaw) setCart(JSON.parse(cartRaw).cart || []);
      const wishlistRaw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (wishlistRaw) setWishlist(JSON.parse(wishlistRaw));
    } catch {}
    setHydrated(true);

    return () => subscription.unsubscribe();
  }, []);

  // Sync from Supabase on Login
  useEffect(() => {
    if (!hydrated || !userId) return;

    async function syncCart() {
      const { data: dbItems } = await supabase.from("cart_items").select("*").eq("user_id", userId!);
      
      let mergedCart = [...cart];
      if (dbItems && dbItems.length > 0) {
        for (const item of dbItems) {
          const exists = mergedCart.find((c) => c.id === item.product_id && c.size === item.size);
          if (!exists) {
            // Need product details, so this would be complex without full data.
            // Simplified: Assuming we only push to db on login for this phase to avoid complex joins.
          }
        }
      }

      // Overwrite DB with local cart for guest merge
      if (cart.length > 0) {
        console.log("Trace - Cart State (sync to DB):", cart.map(c => c.id));
        for (const item of cart) {
          await supabase.from("cart_items").upsert({
            user_id: userId!,
            product_id: item.id,
            size: item.size,
            quantity: item.qty
          }, { onConflict: "user_id,product_id,size" });
        }
      }
    }
    syncCart();
  }, [userId, hydrated]);

  // Persist LocalStorage
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart }));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const pushToDb = async (item: CartItem, qty: number) => {
    if (!userId) return;
    if (qty <= 0) {
      await supabase.from("cart_items").delete().match({ user_id: userId, product_id: item.id, size: item.size });
    } else {
      await supabase.from("cart_items").upsert({
        user_id: userId,
        product_id: item.id,
        size: item.size,
        quantity: qty
      }, { onConflict: "user_id,product_id,size" });
    }
  };

  const addToCart: ShopState["addToCart"] = (item) => {
    console.log("Trace - Cart State (addToCart):");
    console.log("cart.product_id:", item.id);
    setCart((prev) => {
      const idx = prev.findIndex((p) => p.id === item.id && p.size === item.size);
      let nextQty = item.qty;
      if (idx >= 0) {
        nextQty = prev[idx].qty + item.qty;
        const next = [...prev];
        next[idx] = { ...next[idx], qty: nextQty };
        pushToDb(item, nextQty);
        return next;
      }
      pushToDb(item, nextQty);
      return [...prev, item];
    });
  };

  const removeFromCart: ShopState["removeFromCart"] = (id, size) => {
    setCart((prev) => {
      const item = prev.find((p) => p.id === id && p.size === size);
      if (item) pushToDb(item, 0);
      return prev.filter((p) => !(p.id === id && p.size === size));
    });
  };

  const updateQty: ShopState["updateQty"] = (id, size, qty) => {
    setCart((prev) => {
      const item = prev.find((p) => p.id === id && p.size === size);
      if (item) pushToDb(item, Math.max(1, qty));
      return prev.map((p) => (p.id === id && p.size === size ? { ...p, qty: Math.max(1, qty) } : p));
    });
  };

  const clearCart = () => {
    setCart([]);
    if (userId) {
      supabase.from("cart_items").delete().eq("user_id", userId).then();
    }
  };

  // Wishlist logic remains unmodified (localStorage only for now)
  const addToWishlist: ShopState["addToWishlist"] = (item) => {
    setWishlist((prev) => {
      if (prev.some((entry) => entry.id === item.id && entry.size === item.size)) return prev;
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