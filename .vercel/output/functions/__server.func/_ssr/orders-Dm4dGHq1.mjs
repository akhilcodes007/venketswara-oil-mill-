import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { A as IndianRupee, C as MapPin, G as Check, I as CreditCard, K as Calendar, L as Copy, P as Eye, at as CircleCheckBig, h as Printer, i as Truck, p as Search, tt as LoaderCircle, v as Package, z as Clock } from "../_libs/lucide-react.mjs";
import { r as format, s as startOfDay, t as subDays } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-3HhpKDcy.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root$1, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-Dm4dGHq1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root$1, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root$1.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
var STATUSES = [
	"pending",
	"confirmed",
	"Order Confirmed",
	"Packed",
	"Ready for Dispatch",
	"Assigned to Delivery Partner",
	"Out for Delivery",
	"Delivered",
	"Delivery Failed",
	"Returned",
	"Cancelled"
];
function OrderDetailsModal({ order, open, onOpenChange, partners, onUpdateStatus }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [updating, setUpdating] = (0, import_react.useState)(false);
	if (!order) return null;
	const copyOrderNum = () => {
		navigator.clipboard.writeText(order.order_number);
		setCopied(true);
		toast.success("Order number copied");
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleStatusChange = async (newStatus) => {
		setUpdating(true);
		try {
			await onUpdateStatus(order.id, newStatus, order.delivery_partner_id || void 0);
			toast.success("Order status updated");
		} catch (err) {
			toast.error(err.message || "Failed to update status");
		} finally {
			setUpdating(false);
		}
	};
	const handlePartnerChange = async (partnerId) => {
		if (partnerId === "none") partnerId = "";
		setUpdating(true);
		try {
			await onUpdateStatus(order.id, order.order_status, partnerId || void 0);
			toast.success("Delivery partner updated");
		} catch (err) {
			toast.error(err.message || "Failed to assign partner");
		} finally {
			setUpdating(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
				className: "p-6 border-b border-border bg-card shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-2xl font-serif flex items-center gap-3",
						children: [
							"Order #",
							order.order_number,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: copyOrderNum,
								className: "text-muted-foreground hover:text-foreground transition",
								title: "Copy Order Number",
								children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 text-green-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-4 w-4" })
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: ["Placed on ", new Date(order.created_at).toLocaleString("en-IN")]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: `/order/${order.id}/tracking`,
								target: "_blank",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "mr-2 h-4 w-4" }), " Live Tracking"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: `/invoice/${order.id}`,
								target: "_blank",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 h-4 w-4" }), " Print Invoice"]
							})
						})]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "flex-1 p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "md:col-span-2 space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-border bg-card/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "mr-2 h-4 w-4" }), " Customer & Shipping"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: order.customer_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground mt-1",
										children: order.customer_mobile
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 text-sm flex items-start gap-2 text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											order.shipping_address,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											order.shipping_city,
											", ",
											order.shipping_state,
											" ",
											order.shipping_pincode
										] })]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 rounded-xl border border-border bg-card/50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "mr-2 h-4 w-4" }), " Payment Details"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium uppercase",
										children: order.payment_method
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: order.payment_status === "paid" ? "default" : "secondary",
										className: "mt-2",
										children: order.payment_status
									}),
									order.expected_delivery_date && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 pt-4 border-t border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground flex items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-2 h-3 w-3" }), " Expected Delivery"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium mt-1",
											children: new Date(order.expected_delivery_date).toLocaleDateString("en-IN")
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/50 text-muted-foreground text-xs uppercase",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Product"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Price"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium",
											children: "Qty"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 font-medium text-right",
											children: "Total"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border",
									children: order.items?.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "bg-card",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 font-medium",
												children: item.product_name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3 text-muted-foreground",
												children: ["₹", item.price]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3",
												children: item.quantity
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3 text-right font-medium",
												children: ["₹", item.total]
											})
										]
									}, item.id))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card/50 p-4 border-t border-border space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", order.subtotal] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GST (5%)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", order.gst_total] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", order.shipping_total] })]
									}),
									order.discount_total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between text-emerald-600",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-₹", order.discount_total] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, { className: "my-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between font-serif text-lg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grand Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["₹", order.grand_total] })]
									})
								]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-border bg-card shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4",
								children: "Manage Fulfillment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium mb-1.5 block",
									children: "Order Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: order.order_status,
									onValueChange: handleStatusChange,
									disabled: updating,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs font-medium mb-1.5 block flex items-center justify-between",
									children: ["Delivery Partner", order.delivery_partner_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded",
										children: "Assigned"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: order.delivery_partner_id || "none",
									onValueChange: handlePartnerChange,
									disabled: updating,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Assign a partner..." }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Unassigned"
									}), partners.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p.id,
										children: p.name
									}, p.id))] })]
								})] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-border bg-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "mr-2 h-4 w-4" }), " Delivery Timeline"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent",
								children: order.logs?.length ? order.logs.map((log, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex items-start gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 shrink-0 rounded-full border-2 border-background bg-primary z-10 mt-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: log.status
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: [
												new Date(log.created_at).toLocaleString("en-IN"),
												" · ",
												log.updated_by
											]
										}),
										log.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs mt-1 bg-muted p-2 rounded-md",
											children: log.note
										})
									] })]
								}, log.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground text-center py-4 relative z-10",
									children: "No updates yet."
								})
							})]
						})]
					})]
				})
			})]
		})
	});
}
function AdminOrders() {
	const [metrics, setMetrics] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [partners, setPartners] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [dateRange, setDateRange] = (0, import_react.useState)("all");
	const [page, setPage] = (0, import_react.useState)(0);
	const [hasMore, setHasMore] = (0, import_react.useState)(true);
	const PAGE_SIZE = 15;
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const fetchMetrics = async () => {
		const { data, error } = await supabase.rpc("get_orders_dashboard_metrics_v2");
		if (!error && data) setMetrics(data);
	};
	const fetchPartners = async () => {
		const { data } = await supabase.from("delivery_partners").select("id, name").eq("is_active", true);
		if (data) setPartners(data);
	};
	const fetchOrders = async (resetPage = false) => {
		if (resetPage) {
			setPage(0);
			setLoading(true);
		}
		let query = supabase.from("admin_orders_view").select("*", { count: "exact" }).order("created_at", { ascending: false });
		if (search.trim()) query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%`);
		if (statusFilter !== "all") query = query.eq("order_status", statusFilter);
		if (dateRange !== "all") {
			const now = /* @__PURE__ */ new Date();
			if (dateRange === "today") query = query.gte("created_at", startOfDay(now).toISOString());
			else if (dateRange === "7d") query = query.gte("created_at", subDays(now, 7).toISOString());
			else if (dateRange === "30d") query = query.gte("created_at", subDays(now, 30).toISOString());
		}
		const from = (resetPage ? 0 : page) * PAGE_SIZE;
		const to = from + PAGE_SIZE - 1;
		query = query.range(from, to);
		const { data, error, count } = await query;
		if (error) {
			toast.error("Failed to load orders");
			console.error(error);
		} else {
			if (resetPage) setOrders(data);
			else setOrders((prev) => [...prev, ...data]);
			setHasMore(count !== null && from + (data?.length || 0) < count);
		}
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchMetrics();
		fetchPartners();
		fetchOrders(true);
		const sub = supabase.channel("admin-orders").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "new_orders"
		}, () => {
			toast.info("Orders updated. Refreshing data...");
			fetchMetrics();
			fetchOrders(true);
		}).subscribe();
		return () => {
			supabase.removeChannel(sub);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (loading) return;
		const timer = setTimeout(() => {
			fetchOrders(true);
		}, 500);
		return () => clearTimeout(timer);
	}, [
		search,
		statusFilter,
		dateRange
	]);
	const loadMore = () => {
		setPage((p) => p + 1);
	};
	(0, import_react.useEffect)(() => {
		if (page > 0) fetchOrders(false);
	}, [page]);
	const handleUpdateStatus = async (orderId, status, partnerId) => {
		const { error } = await supabase.rpc("update_delivery_status", {
			p_order_id: orderId,
			p_status: status,
			p_partner_id: partnerId || null
		});
		if (error) throw error;
		setOrders((prev) => prev.map((o) => o.id === orderId ? {
			...o,
			order_status: status,
			delivery_partner_id: partnerId || o.delivery_partner_id
		} : o));
		if (selectedOrder && selectedOrder.id === orderId) setSelectedOrder((prev) => prev ? {
			...prev,
			order_status: status,
			delivery_partner_id: partnerId || prev.delivery_partner_id
		} : null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Orders Management"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Manage customer orders and fulfillment in real-time."
			})] }),
			metrics && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Total Revenue",
						value: `₹${metrics.totalRevenue.toLocaleString()}`,
						subtitle: `Today: ₹${metrics.todayRevenue.toLocaleString()}`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4 text-emerald-500" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Pending Orders",
						value: metrics.pendingOrders,
						subtitle: "Awaiting processing",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-orange-500" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Processing & Shipped",
						value: metrics.processingOrders,
						subtitle: "Active fulfillments",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-blue-500" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Delivered Orders",
						value: metrics.deliveredOrders,
						subtitle: `Total Orders: ${metrics.totalOrders}`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4 text-green-500" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row gap-4 items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 w-full sm:w-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 sm:w-64",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search order # or customer...",
							className: "pl-9",
							value: search,
							onChange: (e) => setSearch(e.target.value)
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: dateRange,
						onValueChange: setDateRange,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[140px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Date Range" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "today",
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "7d",
								children: "Last 7 Days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "30d",
								children: "Last 30 Days"
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: statusFilter,
						onValueChange: setStatusFilter,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[160px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Filter by status" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "pending",
								children: "Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "Order Confirmed",
								children: "Confirmed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "Packed",
								children: "Packed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "Out for Delivery",
								children: "Out for Delivery"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "Delivered",
								children: "Delivered"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "Cancelled",
								children: "Cancelled"
							})
						] })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/50 text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Order Number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Payment"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium text-right",
									children: "Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium text-center",
									children: "Action"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-border",
							children: [
								orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3 font-medium",
											children: ["#", o.order_number]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-medium",
												children: o.customer_name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground",
												children: o.customer_mobile
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-muted-foreground",
											children: format(new Date(o.created_at), "MMM d, yyyy")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "uppercase text-xs font-semibold",
												children: o.payment_method
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: o.payment_status === "paid" ? "default" : "secondary",
												className: "text-[10px]",
												children: o.payment_status
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: o.order_status === "Delivered" ? "border-green-500 text-green-500" : o.order_status === "Cancelled" ? "border-red-500 text-red-500" : o.order_status === "pending" ? "border-orange-500 text-orange-500" : "border-blue-500 text-blue-500",
												children: o.order_status
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "px-4 py-3 font-serif font-medium text-right",
											children: ["₹", o.grand_total]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-3 text-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												onClick: () => setSelectedOrder(o),
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})
										})
									]
								}, o.id)),
								loading && page === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "text-center py-8",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" })
								}) }),
								!loading && orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									colSpan: 7,
									className: "text-center py-8 text-muted-foreground",
									children: "No orders found matching your criteria."
								}) })
							]
						})]
					})
				}), hasMore && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 border-t border-border text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: loadMore,
						children: "Load More Orders"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderDetailsModal, {
				open: !!selectedOrder,
				onOpenChange: (op) => !op && setSelectedOrder(null),
				order: selectedOrder,
				partners,
				onUpdateStatus: handleUpdateStatus
			})
		]
	});
}
function Card({ title, value, subtitle, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-6 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-medium text-muted-foreground",
				children: title
			}), icon]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-3xl font-serif font-bold text-foreground",
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: subtitle
			})]
		})]
	});
}
//#endregion
export { AdminOrders as component };
