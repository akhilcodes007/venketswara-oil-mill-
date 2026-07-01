import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as TriangleAlert, A as IndianRupee, b as MessageSquare, d as ShoppingBag, n as Users, ot as CircleCheck, rt as CircleX, v as Package } from "../_libs/lucide-react.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { a as YAxis, c as Line, i as LineChart, l as CartesianGrid, m as Tooltip, o as XAxis, p as ResponsiveContainer, r as BarChart, u as Bar } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CDCbLIYb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const [metrics, setMetrics] = (0, import_react.useState)(null);
	const [charts, setCharts] = (0, import_react.useState)(null);
	const [notifications, setNotifications] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadDashboard() {
			try {
				const { data: metricsData } = await supabase.rpc("get_dashboard_metrics");
				if (metricsData) setMetrics(metricsData);
				const { data: chartsData } = await supabase.rpc("get_dashboard_charts");
				if (chartsData) setCharts(chartsData);
				const { data: notifs } = await supabase.from("admin_notifications").select("*").order("created_at", { ascending: false }).limit(10);
				if (notifs) setNotifications(notifs);
				setLoading(false);
			} catch (err) {
				console.error("Dashboard error:", err);
				setLoading(false);
			}
		}
		loadDashboard();
		const channel = supabase.channel("admin-notifications").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "admin_notifications"
		}, (payload) => {
			setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-center h-64",
		children: "Loading Dashboard..."
	});
	const StatCard = ({ title, value, icon: Icon, subtitle, alert }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border bg-card p-6 shadow-sm ${alert ? "border-destructive/50 bg-destructive/5" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-row items-center justify-between space-y-0 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "tracking-tight text-sm font-medium text-muted-foreground",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${alert ? "text-destructive" : "text-muted-foreground"}` })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `text-2xl font-bold ${alert ? "text-destructive" : ""}`,
				children: value
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: subtitle
			})
		]
	});
	const getNotificationIcon = (type) => {
		switch (type) {
			case "new_order": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4 text-blue-500" });
			case "cancelled_order": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-destructive" });
			case "payment_success": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-green-500" });
			case "customer_message": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-purple-500" });
			case "low_stock": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-gray-500" });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold tracking-tight",
				children: "Dashboard Overview"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-2",
				children: "Monitor your store's realtime performance and alerts."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Revenue",
						value: `₹${metrics?.totalRevenue?.toLocaleString() || 0}`,
						icon: IndianRupee,
						subtitle: `₹${metrics?.monthlyRevenue?.toLocaleString() || 0} this month`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Orders",
						value: metrics?.totalOrders || 0,
						icon: ShoppingBag,
						subtitle: `${metrics?.todayOrders || 0} orders today`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Customers",
						value: metrics?.customerCount || 0,
						icon: Users
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Active Products",
						value: metrics?.productCount || 0,
						icon: Package,
						subtitle: metrics?.lowStockCount > 0 ? `${metrics.lowStockCount} items low in stock` : "Stock levels healthy",
						alert: metrics?.lowStockCount > 0
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 md:grid-cols-7",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-5 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-6 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold mb-6",
							children: "Daily Revenue (Last 7 Days)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-[300px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
									data: charts?.dailySales || [],
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											vertical: false,
											stroke: "#eee"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "date",
											axisLine: false,
											tickLine: false,
											tick: {
												fill: "#888",
												fontSize: 12
											},
											dy: 10
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											axisLine: false,
											tickLine: false,
											tick: {
												fill: "#888",
												fontSize: 12
											},
											dx: -10,
											tickFormatter: (val) => `₹${val}`
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											formatter: (value) => [`₹${value}`, "Revenue"],
											contentStyle: {
												borderRadius: "8px",
												border: "1px solid #eee",
												boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
											type: "monotone",
											dataKey: "revenue",
											stroke: "#2563eb",
											strokeWidth: 3,
											dot: {
												r: 4,
												fill: "#2563eb",
												strokeWidth: 0
											},
											activeDot: { r: 6 }
										})
									]
								})
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 md:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-6 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold mb-6",
								children: "Monthly Revenue Trend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-[250px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: charts?.monthlySales || [],
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												vertical: false,
												stroke: "#eee"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												dataKey: "month",
												axisLine: false,
												tickLine: false,
												tick: {
													fill: "#888",
													fontSize: 12
												},
												dy: 10
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
												formatter: (value) => [`₹${value}`, "Revenue"],
												cursor: { fill: "#f1f5f9" }
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "revenue",
												fill: "#3b82f6",
												radius: [
													4,
													4,
													0,
													0
												]
											})
										]
									})
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border bg-card p-6 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold mb-6",
								children: "Top Selling Products"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-[250px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
									width: "100%",
									height: "100%",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
										data: charts?.productPerformance || [],
										layout: "vertical",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
												strokeDasharray: "3 3",
												horizontal: false,
												stroke: "#eee"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
												type: "number",
												hide: true
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
												dataKey: "name",
												type: "category",
												width: 100,
												axisLine: false,
												tickLine: false,
												tick: {
													fill: "#888",
													fontSize: 11
												}
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { cursor: { fill: "#f1f5f9" } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
												dataKey: "sold",
												fill: "#8b5cf6",
												radius: [
													0,
													4,
													4,
													0
												]
											})
										]
									})
								})
							})]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "md:col-span-2 space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card shadow-sm h-full flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 border-b",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold",
								children: "Live Notifications"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-auto p-2",
							children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center text-sm text-muted-foreground",
								children: "No recent notifications"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1",
								children: notifications.map((notif) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `flex items-start gap-3 p-3 rounded-lg transition-colors ${!notif.is_read ? "bg-muted/50" : "hover:bg-muted/30"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-0.5 shrink-0",
										children: getNotificationIcon(notif.type)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium text-gray-900 leading-snug",
											children: notif.message
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-1",
											children: format(new Date(notif.created_at), "MMM d, h:mm a")
										})]
									})]
								}, notif.id))
							})
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
