import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { J as Bell, V as Circle, a as TrendingUp, b as MessageSquare, i as Truck, nt as House, o as TrendingDown, ot as CircleCheck, v as Package } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SiteHeader } from "./SiteHeader-BCPL4uGc.mjs";
import { t as useAuth } from "./auth-DbjdK8_c.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as PRODUCTS } from "./products-rNIC7C_F.mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DZwnXZJf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGES = [
	"confirmed",
	"packed",
	"shipped",
	"out_for_delivery",
	"delivered"
];
var STAGE_LABEL = {
	confirmed: "Confirmed",
	packed: "Packed",
	shipped: "Shipped",
	out_for_delivery: "Out For Delivery",
	delivered: "Delivered"
};
function Dashboard() {
	const { user, isAdmin, loading: authLoading } = useAuth();
	const queryClient = useQueryClient();
	const audioRef = (0, import_react.useRef)(null);
	const ordersQuery = useQuery({
		queryKey: [
			"orders",
			user?.id,
			isAdmin
		],
		enabled: !!user,
		queryFn: async () => {
			const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	const reviewsQuery = useQuery({
		queryKey: ["reviews-all"],
		enabled: isAdmin,
		queryFn: async () => {
			const { data, error } = await supabase.from("reviews").select("id, product_id, rating, created_at").order("created_at", { ascending: false });
			if (error) throw error;
			return data ?? [];
		}
	});
	(0, import_react.useEffect)(() => {
		if (!isAdmin) return;
		if (typeof window !== "undefined" && "Notification" in window) {
			if (Notification.permission === "default") Notification.requestPermission();
		}
		const channel = supabase.channel("orders-owner").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "orders"
		}, (payload) => {
			const o = payload.new;
			toast.success(`New order from ${o.customer_name} · ₹${o.total}`, { description: `${o.items.length} item(s) · ${o.payment_method}` });
			try {
				audioRef.current?.play().catch(() => {});
			} catch {}
			if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") new Notification("New order received", { body: `${o.customer_name} placed an order of ₹${o.total}` });
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [isAdmin, queryClient]);
	if (authLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground",
			children: "Loading…"
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-md px-4 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-2xl text-foreground",
					children: "Sign in to view your dashboard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Track orders, view payment history and manage your account."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/auth",
						children: "Sign in"
					})
				})
			]
		})]
	});
	const orders = ordersQuery.data ?? [];
	const reviews = reviewsQuery.data ?? [];
	const totalRevenue = orders.reduce((s, o) => s + Number(o.total), 0);
	const today = (/* @__PURE__ */ new Date()).toDateString();
	const todayOrders = orders.filter((o) => new Date(o.created_at).toDateString() === today);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
				ref: audioRef,
				src: "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=",
				preload: "auto"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-7xl px-4 py-10 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif text-3xl md:text-4xl text-foreground",
								children: isAdmin ? "Owner Dashboard" : "Your Dashboard"
							}), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "bg-[var(--gold)] text-[oklch(0.22_0.04_50)]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mr-1 h-3 w-3" }), " Live alerts on"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: isAdmin ? "Realtime order feed, sales mix and review trends." : "Track orders, payment history and delivery progress."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								children: "Continue shopping"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: isAdmin ? "Total Orders" : "My Orders",
								value: orders.length.toString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Today's Orders",
								value: todayOrders.length.toString()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: isAdmin ? "Total Revenue" : "Spent Total",
								value: `₹${totalRevenue}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "Avg. Order Value",
								value: `₹${orders.length ? Math.round(totalRevenue / orders.length) : 0}`
							})
						]
					}),
					isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductSalesMix, { orders }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewsCompare, { reviews })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl text-foreground",
							children: isAdmin ? "All Orders" : "My Orders"
						}), ordersQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground",
							children: "Loading orders…"
						}) : orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground",
							children: "No orders yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 space-y-5",
							children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
								className: "rounded-2xl border border-border bg-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
										className: "flex flex-wrap items-start justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "font-mono text-xs text-muted-foreground",
												children: ["Order #", o.id.slice(0, 8).toUpperCase()]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 font-serif text-lg text-foreground",
												children: o.customer_name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground",
												children: [
													new Date(o.created_at).toLocaleString(),
													" · ",
													o.payment_method,
													isAdmin && o.phone && ` · ${o.phone}`
												]
											}),
											isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-1 text-xs text-muted-foreground",
												children: o.address
											})
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-right",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: "bg-primary text-primary-foreground capitalize",
												children: STAGE_LABEL[o.status] ?? o.status
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2 font-serif text-2xl font-semibold text-foreground",
												children: ["₹", o.total]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tracker, { status: o.status }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-4 grid gap-2 text-sm md:grid-cols-2",
										children: o.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex justify-between rounded-lg bg-muted/50 px-3 py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-foreground",
												children: [
													i.name,
													" · ",
													i.size,
													" × ",
													i.qty
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground",
												children: ["₹", i.price * i.qty]
											})]
										}, i.id + i.size))
									}),
									isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 flex flex-wrap gap-2",
										children: STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: async () => {
												const { error } = await supabase.from("orders").update({ status: s }).eq("id", o.id);
												if (error) toast.error(error.message);
												else {
													toast.success(`Marked as ${STAGE_LABEL[s]}`);
													queryClient.invalidateQueries({ queryKey: ["orders"] });
												}
											},
											className: `rounded-full border px-3 py-1 text-xs transition ${o.status === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"}`,
											children: STAGE_LABEL[s]
										}, s))
									})
								]
							}, o.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl text-foreground",
							children: "Payment History"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 overflow-hidden rounded-2xl border border-border bg-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Order ID" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Method" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
									className: "text-right",
									children: "Amount"
								})
							] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								colSpan: 5,
								className: "py-8 text-center text-muted-foreground",
								children: "No payments yet."
							}) }) : orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
									className: "font-mono text-xs",
									children: o.id.slice(0, 8).toUpperCase()
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: o.customer_name }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: o.payment_method }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: new Date(o.created_at).toLocaleDateString() }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
									className: "text-right font-medium",
									children: ["₹", o.total]
								})
							] }, o.id)) })] })
						})]
					})
				]
			})
		]
	});
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-xs uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2 font-serif text-3xl font-semibold text-foreground",
			children: value
		})]
	});
}
function Tracker({ status }) {
	const currentIdx = Math.max(0, STAGES.indexOf(status));
	const icons = [
		CircleCheck,
		Package,
		Truck,
		Truck,
		House
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-5 flex items-center gap-2",
		children: STAGES.map((s, i) => {
			const Icon = i <= currentIdx ? icons[i] : Circle;
			const active = i <= currentIdx;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `hidden text-xs md:block ${active ? "text-foreground" : "text-muted-foreground"}`,
						children: STAGE_LABEL[s]
					}),
					i < STAGES.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-px flex-1 ${i < currentIdx ? "bg-primary" : "bg-border"}` })
				]
			}, s);
		})
	});
}
function ProductSalesMix({ orders }) {
	const stats = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		let totalUnits = 0;
		for (const o of orders) for (const it of o.items) {
			const key = it.id;
			const cur = map.get(key) ?? {
				name: it.name,
				units: 0,
				revenue: 0
			};
			cur.units += it.qty;
			cur.revenue += it.qty * it.price;
			map.set(key, cur);
			totalUnits += it.qty;
		}
		const rows = Array.from(map.entries()).map(([id, v]) => ({
			id,
			...v,
			pct: totalUnits ? v.units / totalUnits * 100 : 0
		}));
		rows.sort((a, b) => b.units - a.units);
		return {
			rows,
			totalUnits
		};
	}, [orders]);
	const top = stats.rows[0];
	const low = stats.rows.filter((r) => r.units > 0).slice(-1)[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-foreground",
				children: "Product Sales Mix"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Share of every product in total units sold."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalCard, {
					tone: "up",
					title: "Top seller",
					name: top?.name ?? "—",
					detail: top ? `${top.units} units · ${top.pct.toFixed(1)}% of sales` : "No data yet"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalCard, {
					tone: "down",
					title: "Lowest mover",
					name: low?.name ?? "—",
					detail: low ? `${low.units} units · ${low.pct.toFixed(1)}% of sales` : "No data yet"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 overflow-hidden rounded-2xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Units sold" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Revenue" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[40%]",
						children: "Share of sales"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "%"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: stats.totalUnits === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "py-8 text-center text-muted-foreground",
					children: "Sales data will appear after the first order."
				}) }) : stats.rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium text-foreground",
						children: r.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: r.units }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: ["₹", r.revenue] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 w-full overflow-hidden rounded-full bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-primary",
							style: { width: `${r.pct.toFixed(1)}%` }
						})
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right font-mono text-xs",
						children: [r.pct.toFixed(1), "%"]
					})
				] }, r.id)) })] })
			})
		]
	});
}
function SignalCard({ tone, title, name, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(tone === "up" ? TrendingUp : TrendingDown, { className: `h-4 w-4 ${tone === "up" ? "text-primary" : "text-destructive"}` }), title]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-serif text-2xl text-foreground",
				children: name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-sm text-muted-foreground",
				children: detail
			})
		]
	});
}
function ReviewsCompare({ reviews }) {
	const { thisCount, lastCount, thisAvg, lastAvg, productNames } = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		const startThis = new Date(now.getFullYear(), now.getMonth(), 1);
		const startLast = new Date(now.getFullYear(), now.getMonth() - 1, 1);
		const endLast = startThis;
		const productNames = new Map(PRODUCTS.map((p) => [p.id, p.name]));
		const inThis = reviews.filter((r) => new Date(r.created_at) >= startThis);
		const inLast = reviews.filter((r) => {
			const d = new Date(r.created_at);
			return d >= startLast && d < endLast;
		});
		const avg = (arr) => arr.length ? arr.reduce((s, r) => s + r.rating, 0) / arr.length : 0;
		return {
			thisCount: inThis.length,
			lastCount: inLast.length,
			thisAvg: avg(inThis),
			lastAvg: avg(inLast),
			productNames
		};
	}, [reviews]);
	const diff = thisCount - lastCount;
	const pctChange = lastCount === 0 ? thisCount > 0 ? 100 : 0 : (thisCount - lastCount) / lastCount * 100;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mt-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-serif text-2xl text-foreground",
				children: "Customer Reviews"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "This month compared with the previous month."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Reviews this month",
						value: thisCount.toString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Reviews last month",
						value: lastCount.toString()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground",
								children: [diff >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-4 w-4 text-destructive" }), "Change"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-serif text-3xl font-semibold text-foreground",
								children: [
									diff >= 0 ? "+" : "",
									diff,
									" (",
									pctChange >= 0 ? "+" : "",
									pctChange.toFixed(0),
									"%)"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Avg rating: ",
									thisAvg.toFixed(1),
									" ★ this · ",
									lastAvg.toFixed(1),
									" ★ last"
								]
							})
						]
					})
				]
			}),
			reviews.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 overflow-hidden rounded-2xl border border-border bg-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Rating" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: reviews.slice(0, 10).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-medium text-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-1 inline h-3 w-3 text-muted-foreground" }), productNames.get(r.product_id) ?? r.product_id]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: ["★".repeat(r.rating), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "★".repeat(5 - r.rating)
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: new Date(r.created_at).toLocaleDateString() })
				] }, r.id)) })] })
			})
		]
	});
}
//#endregion
export { Dashboard as component };
