import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-BFWNyGG7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ShopContext = (0, import_react.createContext)(null);
var CART_STORAGE_KEY = "svom_cart_v1";
var WISHLIST_STORAGE_KEY = "svom_wishlist_v1";
function ShopProvider({ children }) {
	const [cart, setCart] = (0, import_react.useState)([]);
	const [wishlist, setWishlist] = (0, import_react.useState)([]);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [userId, setUserId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
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
	(0, import_react.useEffect)(() => {
		if (!hydrated || !userId) return;
		async function syncCart() {
			const { data: dbItems } = await supabase.from("cart_items").select("*").eq("user_id", userId);
			let mergedCart = [...cart];
			if (dbItems && dbItems.length > 0) {
				for (const item of dbItems) if (!mergedCart.find((c) => c.id === item.product_id && c.size === item.size)) {}
			}
			if (cart.length > 0) {
				console.log("Trace - Cart State (sync to DB):", cart.map((c) => c.id));
				for (const item of cart) await supabase.from("cart_items").upsert({
					user_id: userId,
					product_id: item.id,
					size: item.size,
					quantity: item.qty
				}, { onConflict: "user_id,product_id,size" });
			}
		}
		syncCart();
	}, [userId, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ cart }));
	}, [cart, hydrated]);
	(0, import_react.useEffect)(() => {
		if (!hydrated) return;
		localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
	}, [wishlist, hydrated]);
	const pushToDb = async (item, qty) => {
		if (!userId) return;
		if (qty <= 0) await supabase.from("cart_items").delete().match({
			user_id: userId,
			product_id: item.id,
			size: item.size
		});
		else await supabase.from("cart_items").upsert({
			user_id: userId,
			product_id: item.id,
			size: item.size,
			quantity: qty
		}, { onConflict: "user_id,product_id,size" });
	};
	const addToCart = (item) => {
		console.log("Trace - Cart State (addToCart):");
		console.log("cart.product_id:", item.id);
		setCart((prev) => {
			const idx = prev.findIndex((p) => p.id === item.id && p.size === item.size);
			let nextQty = item.qty;
			if (idx >= 0) {
				nextQty = prev[idx].qty + item.qty;
				const next = [...prev];
				next[idx] = {
					...next[idx],
					qty: nextQty
				};
				pushToDb(item, nextQty);
				return next;
			}
			pushToDb(item, nextQty);
			return [...prev, item];
		});
	};
	const removeFromCart = (id, size) => {
		setCart((prev) => {
			const item = prev.find((p) => p.id === id && p.size === size);
			if (item) pushToDb(item, 0);
			return prev.filter((p) => !(p.id === id && p.size === size));
		});
	};
	const updateQty = (id, size, qty) => {
		setCart((prev) => {
			const item = prev.find((p) => p.id === id && p.size === size);
			if (item) pushToDb(item, Math.max(1, qty));
			return prev.map((p) => p.id === id && p.size === size ? {
				...p,
				qty: Math.max(1, qty)
			} : p);
		});
	};
	const clearCart = () => {
		setCart([]);
		if (userId) supabase.from("cart_items").delete().eq("user_id", userId).then();
	};
	const addToWishlist = (item) => {
		setWishlist((prev) => {
			if (prev.some((entry) => entry.id === item.id && entry.size === item.size)) return prev;
			return [...prev, item];
		});
	};
	const removeFromWishlist = (id, size) => setWishlist((prev) => prev.filter((item) => !(item.id === id && item.size === size)));
	const toggleWishlist = (item) => {
		setWishlist((prev) => {
			if (prev.some((entry) => entry.id === item.id && entry.size === item.size)) return prev.filter((entry) => !(entry.id === item.id && entry.size === item.size));
			return [...prev, item];
		});
	};
	const isWishlisted = (id, size) => wishlist.some((item) => item.id === id && item.size === size);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShopContext.Provider, {
		value: {
			cart,
			wishlist,
			addToCart,
			removeFromCart,
			updateQty,
			clearCart,
			addToWishlist,
			removeFromWishlist,
			toggleWishlist,
			isWishlisted
		},
		children
	});
}
function useShop() {
	const ctx = (0, import_react.useContext)(ShopContext);
	if (!ctx) throw new Error("useShop must be used inside ShopProvider");
	return ctx;
}
//#endregion
export { useShop as n, ShopProvider as t };
