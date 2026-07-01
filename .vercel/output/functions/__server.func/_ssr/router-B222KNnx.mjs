import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as useRouter, O as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Route$22 } from "../_orderId-eS-yD-ms.mjs";
import { b as MessageSquare } from "../_libs/lucide-react.mjs";
import { t as Route$23 } from "../_orderId.tracking-DqeeRGBR.mjs";
import { t as ShopProvider } from "./store-BFWNyGG7.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { t as SiteFooter } from "./SiteFooter-DcL6_KDE.mjs";
import { i as stringType, n as coerce, r as objectType, t as booleanType } from "../_libs/zod.mjs";
import { n as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { n as HelmetProvider } from "../_libs/react-helmet-async+[...].mjs";
import { t as SEO } from "./SEO-DwGENTSq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B222KNnx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DiS8_5-O.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function WhatsAppSupportButton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: "https://wa.me/919840256318?text=Hello%20Sri%20VENKETESWARA%20Oil%20Mill%20Support",
		target: "_blank",
		rel: "noopener noreferrer",
		className: "fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl",
		"aria-label": "Chat with support on WhatsApp",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-5 w-5" }), "WhatsApp"]
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
			title: "Page Not Found - SRI VENKETESWARA OIL MILL",
			description: "The page you're looking for doesn't exist."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})]
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$21 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Lovable App" },
			{
				name: "description",
				content: "Lovable Generated Project"
			},
			{
				name: "author",
				content: "Lovable"
			},
			{
				property: "og:title",
				content: "Lovable App"
			},
			{
				property: "og:description",
				content: "Lovable Generated Project"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:site",
				content: "@Lovable"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$21.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelmetProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ShopProvider, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhatsAppSupportButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				richColors: true,
				position: "top-right"
			})
		] })
	}) });
}
var $$splitComponentImporter$20 = () => import("./wishlist-BiOyweSV.mjs");
var Route$20 = createFileRoute("/wishlist")({
	head: () => ({ meta: [{ title: "Wishlist — SRI VENKETESWARA OIL MILL" }, {
		name: "description",
		content: "Save products to your wishlist for later."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./shop-DfJOslQM.mjs");
var Route$19 = createFileRoute("/shop")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./profile-qzrGwCRb.mjs");
var Route$18 = createFileRoute("/profile")({
	head: () => ({ meta: [{ title: "Profile — SRI VENKETESWARA OIL MILL" }, {
		name: "description",
		content: "Manage your account, saved addresses, and wishlist."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var hero_asset_default = {
	version: 1,
	asset_id: "47a0f6ee-9d7c-4dbe-a834-6600959a517b",
	project_id: "87013ab3-bd28-43b4-9689-a43550f0806b",
	url: "https://ibb.co/W4GhvpYy",
	r2_key: "a/v1/87013ab3-bd28-43b4-9689-a43550f0806b/47a0f6ee-9d7c-4dbe-a834-6600959a517b/hero.png",
	original_filename: "hero.png",
	size: 2921537,
	content_type: "image/png",
	created_at: "2026-06-24T17:07:27Z"
};
var $$splitComponentImporter$17 = () => import("./heritage-BzWoDpWN.mjs");
var Route$17 = createFileRoute("/heritage")({
	head: () => ({ meta: [
		{ title: "Our Heritage — SRI VENKETESWARA OIL MILL" },
		{
			name: "description",
			content: "A century of tradition since 1919 — from a bullock-driven Chekku in Neikuppi to modern cold-press machines across Tamil Nadu."
		},
		{
			property: "og:title",
			content: "Our Heritage · Since 1919"
		},
		{
			property: "og:description",
			content: "A Century of Tradition, A Legacy of Trust, A Commitment to Purity."
		},
		{
			property: "og:image",
			content: hero_asset_default.url
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./forgot-password-C8PI0rOc.mjs");
var Route$16 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Forgot Password — SRI VENKETESWARA OIL MILL" }, {
		name: "description",
		content: "Recover access to your account or use email OTP login."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./dashboard-DZwnXZJf.mjs");
var Route$15 = createFileRoute("/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — SRI VENKETESWARA OIL MILL" }, {
		name: "description",
		content: "Orders, payment history and live sales analytics."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./checkout-BPmIIKW5.mjs");
var Route$14 = createFileRoute("/checkout")({
	head: () => ({ meta: [{ title: "Checkout — SRI VENKETESWARA OIL MILL" }, {
		name: "description",
		content: "Review your cart and complete your order."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
objectType({
	name: stringType().min(2, "Name is required"),
	mobile: stringType().min(10, "Valid mobile number is required"),
	address: stringType().min(5, "Delivery address is required"),
	landmark: stringType().optional(),
	city: stringType().min(2, "City is required"),
	state: stringType().min(2, "State is required"),
	pincode: stringType().min(6, "Valid pincode is required"),
	payment: stringType().min(1, "Payment method is required")
});
var $$splitComponentImporter$13 = () => import("./auth-ksIZlClU.mjs");
var Route$13 = createFileRoute("/auth")({
	component: lazyRouteComponent($$splitComponentImporter$13, "component"),
	head: () => ({ meta: [{ title: "Sign In · SRI VENKETESWARA OIL MILL" }, {
		name: "description",
		content: "Sign in with a one-time email code."
	}] })
});
var $$splitComponentImporter$12 = () => import("./admin-DMLhDQr1.mjs");
var Route$12 = createFileRoute("/admin")({
	beforeLoad: async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) throw redirect({ to: "/auth" });
		const { data: roleData } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id).single();
		if (roleData?.role !== "admin") {
			toast.error("You do not have permission to access this page.");
			throw redirect({ to: "/" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./addresses-CaZmUM54.mjs");
var Route$11 = createFileRoute("/addresses")({
	head: () => ({ meta: [{ title: "Saved Addresses — SRI VENKETESWARA OIL MILL" }, {
		name: "description",
		content: "Manage your delivery addresses for faster checkout."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./routes-GwE-WJxu.mjs");
var Route$10 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./admin-CDCbLIYb.mjs");
var Route$9 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./reviews-DW0OW2th.mjs");
var Route$8 = createFileRoute("/admin/reviews")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./reports-BfsLyVXb.mjs");
var Route$7 = createFileRoute("/admin/reports")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./products-CJbKpMUX.mjs");
var Route$6 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
objectType({
	id: stringType().optional(),
	name: stringType().min(2, "Name must be at least 2 characters"),
	slug: stringType().min(2, "Slug must be at least 2 characters"),
	price: coerce.number().min(0, "Price must be positive"),
	stock: coerce.number().min(0, "Stock cannot be negative"),
	sku: stringType().min(2, "SKU is required"),
	description: stringType().optional(),
	is_active: booleanType().default(true)
});
var $$splitComponentImporter$5 = () => import("./orders-Dm4dGHq1.mjs");
var Route$5 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./emails-ByOcQzPK.mjs");
var Route$4 = createFileRoute("/admin/emails")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./delivery-partners-DlHDrDxq.mjs");
var Route$3 = createFileRoute("/admin/delivery-partners")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
objectType({
	id: stringType().optional(),
	name: stringType().min(2, "Name is required"),
	mobile: stringType().min(10, "Valid mobile number is required"),
	vehicle_type: stringType().min(2, "Vehicle type is required"),
	vehicle_number: stringType().min(4, "Vehicle number is required"),
	is_active: booleanType().default(true)
});
var $$splitComponentImporter$2 = () => import("./deliveries-Cg_dn6Xm.mjs");
var Route$2 = createFileRoute("/admin/deliveries")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./customers-BgvqJKJm.mjs");
var Route$1 = createFileRoute("/admin/customers")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./cms-CElpfPqz.mjs");
var Route = createFileRoute("/admin/cms")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var WishlistRoute = Route$20.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$21
});
var ShopRoute = Route$19.update({
	id: "/shop",
	path: "/shop",
	getParentRoute: () => Route$21
});
var ProfileRoute = Route$18.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$21
});
var HeritageRoute = Route$17.update({
	id: "/heritage",
	path: "/heritage",
	getParentRoute: () => Route$21
});
var ForgotPasswordRoute = Route$16.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$21
});
var DashboardRoute = Route$15.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => Route$21
});
var CheckoutRoute = Route$14.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$21
});
var AuthRoute = Route$13.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$21
});
var AdminRoute = Route$12.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$21
});
var AddressesRoute = Route$11.update({
	id: "/addresses",
	path: "/addresses",
	getParentRoute: () => Route$21
});
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$21
});
var AdminIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var InvoiceOrderIdRoute = Route$22.update({
	id: "/invoice/$orderId",
	path: "/invoice/$orderId",
	getParentRoute: () => Route$21
});
var AdminReviewsRoute = Route$8.update({
	id: "/reviews",
	path: "/reviews",
	getParentRoute: () => AdminRoute
});
var AdminReportsRoute = Route$7.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$6.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$5.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminEmailsRoute = Route$4.update({
	id: "/emails",
	path: "/emails",
	getParentRoute: () => AdminRoute
});
var AdminDeliveryPartnersRoute = Route$3.update({
	id: "/delivery-partners",
	path: "/delivery-partners",
	getParentRoute: () => AdminRoute
});
var AdminDeliveriesRoute = Route$2.update({
	id: "/deliveries",
	path: "/deliveries",
	getParentRoute: () => AdminRoute
});
var AdminCustomersRoute = Route$1.update({
	id: "/customers",
	path: "/customers",
	getParentRoute: () => AdminRoute
});
var AdminCmsRoute = Route.update({
	id: "/cms",
	path: "/cms",
	getParentRoute: () => AdminRoute
});
var OrderOrderIdTrackingRoute = Route$23.update({
	id: "/order/$orderId/tracking",
	path: "/order/$orderId/tracking",
	getParentRoute: () => Route$21
});
var AdminRouteChildren = {
	AdminCmsRoute,
	AdminCustomersRoute,
	AdminDeliveriesRoute,
	AdminDeliveryPartnersRoute,
	AdminEmailsRoute,
	AdminOrdersRoute,
	AdminProductsRoute,
	AdminReportsRoute,
	AdminReviewsRoute,
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AddressesRoute,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	AuthRoute,
	CheckoutRoute,
	DashboardRoute,
	ForgotPasswordRoute,
	HeritageRoute,
	ProfileRoute,
	ShopRoute,
	WishlistRoute,
	InvoiceOrderIdRoute,
	OrderOrderIdTrackingRoute
};
var routeTree = Route$21._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
