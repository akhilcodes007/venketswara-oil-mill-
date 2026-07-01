import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { A as IndianRupee, F as Download, Q as ArrowDown, X as ArrowUp, d as ShoppingBag, h as Printer, i as Truck, l as Star, n as Users, tt as LoaderCircle, v as Package } from "../_libs/lucide-react.mjs";
import { a as endOfYear, i as startOfYear, n as startOfMonth, o as endOfMonth, r as format, t as subDays } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as YAxis, d as Pie, f as Cell, h as Legend, l as CartesianGrid, m as Tooltip, n as PieChart, o as XAxis, p as ResponsiveContainer, r as BarChart, s as Area, t as AreaChart, u as Bar } from "../_libs/recharts+[...].mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { n as writeFileSync, t as utils } from "../_libs/xlsx.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
import { t as autoTable } from "../_libs/jspdf-autotable.mjs";
import { t as Z } from "../_libs/react-to-print.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-BfsLyVXb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = /* @__PURE__ */ __toESM(require_jspdf_node_min());
var Card = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("rounded-xl border bg-card text-card-foreground shadow", className),
	...props
}));
Card.displayName = "Card";
var CardHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex flex-col space-y-1.5 p-6", className),
	...props
}));
CardHeader.displayName = "CardHeader";
var CardTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("font-semibold leading-none tracking-tight", className),
	...props
}));
CardTitle.displayName = "CardTitle";
var CardDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
CardDescription.displayName = "CardDescription";
var CardContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("p-6 pt-0", className),
	...props
}));
CardContent.displayName = "CardContent";
var CardFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	className: cn("flex items-center p-6 pt-0", className),
	...props
}));
CardFooter.displayName = "CardFooter";
function KPIGrid({ data }) {
	if (!data) return null;
	const current = data.current || {};
	const previous = data.previous || {};
	const global = data.global || {};
	const calculateChange = (curr, prev) => {
		if (prev === 0) return curr > 0 ? 100 : 0;
		return (curr - prev) / prev * 100;
	};
	const renderKPI = (title, value, change, icon, subtitle) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-row items-center justify-between pb-2 space-y-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-sm font-medium text-muted-foreground",
				children: title
			}), icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-4 w-4 text-muted-foreground",
				children: icon
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-2xl font-bold",
				children: value
			}),
			change !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `text-xs flex items-center mt-1 ${change >= 0 ? "text-green-600" : "text-red-600"}`,
				children: [
					change >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, { className: "h-3 w-3 mr-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, { className: "h-3 w-3 mr-1" }),
					Math.abs(change).toFixed(1),
					"% from prev. period"
				]
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1",
				children: subtitle
			})
		] })] });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8",
		children: [
			renderKPI("Total Revenue", `₹${current.revenue?.toLocaleString() || 0}`, calculateChange(current.revenue, previous.revenue), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, {})),
			renderKPI("Total Orders", current.orders || 0, calculateChange(current.orders, previous.orders), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, {})),
			renderKPI("Average Order Value", `₹${Math.round(current.aov || 0).toLocaleString()}`, calculateChange(current.aov, previous.aov), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, {})),
			renderKPI("New Customers", current.customers || 0, calculateChange(current.customers, previous.customers), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {})),
			renderKPI("Today's Revenue", `₹${global.today_revenue?.toLocaleString() || 0}`, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, {})),
			renderKPI("Monthly Revenue", `₹${global.monthly_revenue?.toLocaleString() || 0}`, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, {})),
			renderKPI("Delivered Orders", current.delivered || 0, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {})),
			renderKPI("Pending Orders", current.pending || 0, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {})),
			renderKPI("Total Products", global.total_products || 0, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {})),
			renderKPI("Total Categories", global.total_categories || 0, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, {})),
			renderKPI("Average Rating", `${Number(global.average_rating || 0).toFixed(1)} / 5`, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {})),
			renderKPI("Active Partners", global.active_delivery_partners || 0, void 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, {}))
		]
	});
}
function SalesCharts({ data }) {
	if (!data || data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "col-span-full mb-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "h-[350px] flex items-center justify-center text-muted-foreground",
			children: "No sales data available for this period."
		})
	});
	const formattedData = data.map((d) => ({
		...d,
		date: format(new Date(d.period), "MMM dd")
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-2 mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Revenue Trend" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[300px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data: formattedData,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "colorRevenue",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "5%",
								stopColor: "#3f513f",
								stopOpacity: .8
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "95%",
								stopColor: "#3f513f",
								stopOpacity: 0
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							vertical: false,
							opacity: .3
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "date",
							tick: { fontSize: 12 },
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tickFormatter: (val) => `₹${val}`,
							tick: { fontSize: 12 },
							tickLine: false,
							axisLine: false,
							width: 80
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (value) => [`₹${value}`, "Revenue"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "revenue",
							stroke: "#3f513f",
							fillOpacity: 1,
							fill: "url(#colorRevenue)"
						})
					]
				})
			})
		}) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Orders Volume" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[300px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: formattedData,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							vertical: false,
							opacity: .3
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "date",
							tick: { fontSize: 12 },
							tickLine: false,
							axisLine: false
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tick: { fontSize: 12 },
							tickLine: false,
							axisLine: false,
							width: 40
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							formatter: (value) => [value, "Orders"],
							cursor: { fill: "#f4f4f4" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "orders",
							fill: "#f2e3c6",
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
		}) })] })]
	});
}
function ProductAnalytics({ data, inventory }) {
	if (!data || !inventory) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-2 mb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Top Selling Products (Qty)" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Sold"
			})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.top_selling?.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right font-medium",
				children: p.qty
			})] }, i)) })] }) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Highest Revenue Products" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Revenue"
			})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.highest_revenue?.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
				className: "text-right font-medium text-green-600",
				children: ["₹", p.revenue]
			})] }, i)) })] }) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Least Selling Products" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Sold"
			})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: data.least_selling?.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "text-right font-medium",
				children: p.qty
			})] }, i)) })] }) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Inventory Alerts" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center pb-2 border-b",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "Total Inventory Value"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold",
							children: ["₹", inventory.total_stock_value?.toLocaleString()]
						})]
					}),
					inventory.out_of_stock?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-bold text-red-600 mb-2 block",
						children: [
							"Out of Stock (",
							inventory.out_of_stock.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "text-sm space-y-1 text-muted-foreground",
						children: inventory.out_of_stock.slice(0, 3).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: p.name }, i))
					})] }),
					inventory.low_stock?.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm font-bold text-orange-500 mb-2 block",
						children: [
							"Low Stock (",
							inventory.low_stock.length,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "text-sm space-y-1 text-muted-foreground flex flex-wrap gap-2",
						children: inventory.low_stock.slice(0, 3).map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "bg-orange-100 text-orange-800 px-2 rounded",
							children: [
								p.name,
								" (",
								p.stock,
								")"
							]
						}, i))
					})] })
				]
			}) })] })
		]
	});
}
var COLORS = [
	"#3f513f",
	"#f2e3c6",
	"#4ade80",
	"#fbbf24",
	"#f87171",
	"#94a3b8"
];
function CustomerOrderAnalytics({ customerData, orderData, deliveryData, reviewData }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 md:grid-cols-2 mb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Customer Insights" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4 mb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-muted p-4 rounded-lg text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold",
							children: customerData?.new_customers || 0
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "New Customers"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "bg-muted p-4 rounded-lg text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-2xl font-bold text-primary",
							children: [customerData?.repeat_purchase_rate || 0, "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Repeat Purchase Rate"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-sm font-semibold mb-2",
					children: "Top Spenders"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-right",
					children: "Spent"
				})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: customerData?.top_spenders?.slice(0, 4).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "text-right font-medium",
					children: ["₹", c.spent]
				})] }, i)) })] })
			] })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Order Status Distribution" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-[250px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: orderData?.status_distribution || [],
							cx: "50%",
							cy: "50%",
							innerRadius: 60,
							outerRadius: 80,
							paddingAngle: 5,
							dataKey: "count",
							nameKey: "status",
							children: (orderData?.status_distribution || []).map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
					] })
				})
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Delivery Partner Performance" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Partner" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-center",
					children: "Assigned"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-center",
					children: "Delivered"
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: deliveryData?.partner_performance?.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: p.name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-center",
					children: p.total_assigned
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-center text-green-600 font-medium",
					children: p.total_delivered
				})
			] }, i)) })] }) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Review Analytics" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-6 mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-3xl font-bold",
						children: reviewData?.average_rating || 0
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Avg Rating"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-1 flex-1",
					children: reviewData?.distribution?.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-8",
								children: [d.rating, " Star"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex-1 bg-muted h-2 rounded-full overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-yellow-400 h-full",
									style: { width: `${d.count / Math.max(reviewData?.total_reviews || 1, 1) * 100}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-6 text-right",
								children: d.count
							})
						]
					}, d.rating))
				})]
			}) })] })
		]
	});
}
function GSTAnalytics({ data }) {
	if (!data) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "GST Analytics" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted-foreground block",
				children: "Total GST Collected (Selected Period)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-3xl font-bold",
				children: ["₹", data.total_gst?.toLocaleString() || 0]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Month" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
			className: "text-right",
			children: "GST Collected"
		})] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [data.monthly?.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: format(new Date(m.month), "MMMM yyyy") }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
			className: "text-right font-medium",
			children: ["₹", m.gst]
		})] }, i)), (!data.monthly || data.monthly.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
			colSpan: 2,
			className: "text-center text-muted-foreground",
			children: "No GST data available."
		}) })] })] })] })]
	});
}
function AdminReports() {
	const [dateRange, setDateRange] = (0, import_react.useState)("last30");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [kpis, setKpis] = (0, import_react.useState)(null);
	const [sales, setSales] = (0, import_react.useState)([]);
	const [products, setProducts] = (0, import_react.useState)(null);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [gst, setGst] = (0, import_react.useState)(null);
	const [inventory, setInventory] = (0, import_react.useState)(null);
	const [customers, setCustomers] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)(null);
	const [deliveries, setDeliveries] = (0, import_react.useState)(null);
	const [reviews, setReviews] = (0, import_react.useState)(null);
	const printRef = (0, import_react.useRef)(null);
	const getDateFilter = () => {
		const today = /* @__PURE__ */ new Date();
		let start = today;
		let end = today;
		let grouping = "day";
		switch (dateRange) {
			case "today":
				start = new Date(today.setHours(0, 0, 0, 0));
				end = new Date(today.setHours(23, 59, 59, 999));
				break;
			case "yesterday":
				start = subDays(new Date(today.setHours(0, 0, 0, 0)), 1);
				end = subDays(new Date(today.setHours(23, 59, 59, 999)), 1);
				break;
			case "last7":
				start = subDays(today, 7);
				break;
			case "last30":
				start = subDays(today, 30);
				grouping = "week";
				break;
			case "thisMonth":
				start = startOfMonth(today);
				end = endOfMonth(today);
				grouping = "week";
				break;
			case "lastMonth":
				start = startOfMonth(subDays(startOfMonth(today), 1));
				end = endOfMonth(start);
				grouping = "week";
				break;
			case "thisYear":
				start = startOfYear(today);
				end = endOfYear(today);
				grouping = "month";
				break;
		}
		return {
			start: start.toISOString(),
			end: end.toISOString(),
			grouping
		};
	};
	const loadData = async () => {
		setLoading(true);
		try {
			const { start, end, grouping } = getDateFilter();
			const p = {
				p_start: start,
				p_end: end
			};
			const [rKpi, rSales, rProd, rCat, rGst, rInv, rCust, rOrd, rDel, rRev] = await Promise.all([
				supabase.rpc("get_dashboard_kpis", p),
				supabase.rpc("get_sales_analytics", {
					...p,
					p_grouping: grouping
				}),
				supabase.rpc("get_product_analytics", p),
				supabase.rpc("get_category_analytics", p),
				supabase.rpc("get_gst_analytics", p),
				supabase.rpc("get_inventory_analytics"),
				supabase.rpc("get_customer_analytics", p),
				supabase.rpc("get_order_analytics", p),
				supabase.rpc("get_delivery_analytics", p),
				supabase.rpc("get_review_analytics", p)
			]);
			setKpis(rKpi.data);
			setSales(rSales.data);
			setProducts(rProd.data);
			setCategories(rCat.data);
			setGst(rGst.data);
			setInventory(rInv.data);
			setCustomers(rCust.data);
			setOrders(rOrd.data);
			setDeliveries(rDel.data);
			setReviews(rRev.data);
		} catch (err) {
			toast.error("Failed to load analytics");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
		let debounceTimer;
		const handleRealtime = () => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => loadData(), 2e3);
		};
		const channels = supabase.channel("custom-all-channel").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "new_orders"
		}, handleRealtime).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "products"
		}, handleRealtime).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "reviews"
		}, handleRealtime).subscribe();
		return () => {
			clearTimeout(debounceTimer);
			supabase.removeChannel(channels);
		};
	}, [dateRange]);
	const handleExportExcel = () => {
		const wb = utils.book_new();
		const summaryData = [
			["Report Generated", format(/* @__PURE__ */ new Date(), "PPpp")],
			["Date Range Filter", dateRange],
			["Total Revenue", kpis?.current?.revenue],
			["Total Orders", kpis?.current?.orders]
		];
		utils.book_append_sheet(wb, utils.aoa_to_sheet(summaryData), "Summary");
		utils.book_append_sheet(wb, utils.json_to_sheet(sales || []), "Sales");
		if (products?.top_selling) utils.book_append_sheet(wb, utils.json_to_sheet(products.top_selling), "Top Products");
		writeFileSync(wb, `SVOM_Analytics_${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.xlsx`);
	};
	const handleExportPDF = () => {
		const doc = new import_jspdf_node_min.default();
		doc.text(`SRI VENKETESWARA OIL MILL - Analytics Report`, 14, 15);
		doc.setFontSize(10);
		doc.text(`Generated on: ${format(/* @__PURE__ */ new Date(), "PPpp")} | Range: ${dateRange}`, 14, 22);
		autoTable(doc, {
			startY: 30,
			head: [["Metric", "Value"]],
			body: [
				["Total Revenue", `Rs. ${kpis?.current?.revenue}`],
				["Total Orders", kpis?.current?.orders],
				["Total Customers", kpis?.current?.customers],
				["Average Order Value", `Rs. ${Math.round(kpis?.current?.aov || 0)}`]
			]
		});
		autoTable(doc, {
			head: [[
				"Period",
				"Revenue",
				"Orders"
			]],
			body: sales?.map((s) => [
				format(new Date(s.period), "PP"),
				s.revenue,
				s.orders
			]) || []
		});
		doc.save(`SVOM_Analytics_${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.pdf`);
	};
	const handlePrint = Z({
		contentRef: printRef,
		documentTitle: `SVOM_Analytics_${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}`
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Reports & Analytics"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Monitor your business performance and insights."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: dateRange,
						onValueChange: setDateRange,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[180px] bg-white",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select period" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "today",
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "yesterday",
								children: "Yesterday"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "last7",
								children: "Last 7 Days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "last30",
								children: "Last 30 Days"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "thisMonth",
								children: "This Month"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "lastMonth",
								children: "Last Month"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "thisYear",
								children: "This Year"
							})
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						onClick: handleExportExcel,
						title: "Export to Excel",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						onClick: handleExportPDF,
						title: "Export to PDF",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-xs",
							children: "PDF"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						onClick: () => handlePrint(),
						title: "Print Report",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" })
					})
				]
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center h-64",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: printRef,
			className: "print:p-8 space-y-8 bg-white/50 p-2 rounded-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden print:block mb-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-3xl font-serif font-bold text-[#3f513f]",
							children: "SRI VENKETESWARA OIL MILL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xl mt-2",
							children: "Analytics Report"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-gray-500 mt-1",
							children: [
								"Generated: ",
								format(/* @__PURE__ */ new Date(), "PPpp"),
								" | Filter: ",
								dateRange
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPIGrid, { data: kpis }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalesCharts, { data: sales }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomerOrderAnalytics, {
					customerData: customers,
					orderData: orders,
					deliveryData: deliveries,
					reviewData: reviews
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductAnalytics, {
					data: products,
					inventory
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GSTAnalytics, { data: gst })
			]
		})]
	});
}
//#endregion
export { AdminReports as component };
