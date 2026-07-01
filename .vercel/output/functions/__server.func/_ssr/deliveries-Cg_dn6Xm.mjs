import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { B as ClipboardList, f as Send, i as Truck, p as Search, st as CircleAlert, tt as LoaderCircle, y as PackageCheck, z as Clock } from "../_libs/lucide-react.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-3HhpKDcy.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deliveries-Cg_dn6Xm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_OPTIONS = [
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
function AdminDeliveries() {
	const [metrics, setMetrics] = (0, import_react.useState)(null);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [partners, setPartners] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [search, setSearch] = (0, import_react.useState)("");
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [selectedOrder, setSelectedOrder] = (0, import_react.useState)(null);
	const [newStatus, setNewStatus] = (0, import_react.useState)("");
	const [newPartner, setNewPartner] = (0, import_react.useState)("");
	const [newNote, setNewNote] = (0, import_react.useState)("");
	const [updating, setUpdating] = (0, import_react.useState)(false);
	const fetchDashboard = async () => {
		setLoading(true);
		const { data: mData } = await supabase.rpc("get_delivery_metrics");
		if (mData) setMetrics(mData);
		const { data: pData } = await supabase.from("delivery_partners").select("*").eq("is_active", true);
		if (pData) setPartners(pData);
		const { data: oData, error } = await supabase.from("new_orders").select(`
        id, order_number, status, grand_total, created_at, expected_delivery_date,
        delivery_partners ( id, name, mobile ),
        profiles ( full_name, mobile ),
        addresses ( address, city, state, pincode )
      `).neq("status", "pending").order("created_at", { ascending: false }).limit(50);
		if (oData) setOrders(oData);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchDashboard();
		const channel = supabase.channel("delivery-logs-admin").on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "delivery_logs"
		}, () => {
			fetchDashboard();
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, []);
	const openUpdateDialog = (order) => {
		setSelectedOrder(order);
		setNewStatus(order.status);
		setNewPartner(order.delivery_partners?.id || "unassigned");
		setNewNote("");
		setIsDialogOpen(true);
	};
	const handleUpdateDelivery = async () => {
		if (!selectedOrder) return;
		setUpdating(true);
		const partnerId = newPartner === "unassigned" ? null : newPartner;
		const { error } = await supabase.rpc("update_delivery_status", {
			p_order_id: selectedOrder.id,
			p_status: newStatus,
			p_note: newNote || null,
			p_partner_id: partnerId
		});
		if (error) toast.error(error.message);
		else {
			toast.success("Delivery status updated successfully!");
			setIsDialogOpen(false);
			fetchDashboard();
		}
		setUpdating(false);
	};
	const StatCard = ({ title, value, icon: Icon, alert }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border bg-card p-5 shadow-sm ${alert ? "border-amber-500/50 bg-amber-500/5" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-row items-center justify-between pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "tracking-tight text-sm font-medium text-muted-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${alert ? "text-amber-500" : "text-muted-foreground"}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `text-2xl font-bold ${alert ? "text-amber-600" : ""}`,
			children: value || 0
		})]
	});
	const filteredOrders = orders.filter((o) => o.order_number?.toLowerCase().includes(search.toLowerCase()) || o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: "Delivery Management"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground",
				children: "Monitor dispatch, assign partners, and track shipments."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3 lg:grid-cols-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Active Deliveries",
						value: metrics?.activeDeliveries,
						icon: Truck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Pending Assignment",
						value: metrics?.pendingAssignments,
						icon: Clock,
						alert: metrics?.pendingAssignments > 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Delivered Today",
						value: metrics?.deliveredToday,
						icon: PackageCheck
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Total Deliveries",
						value: metrics?.totalDeliveries,
						icon: ClipboardList
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Failed Deliveries",
						value: metrics?.failedDeliveries,
						icon: CircleAlert
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						title: "Returned Orders",
						value: metrics?.returnedOrders,
						icon: CircleAlert
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by Order # or Customer...",
						className: "pl-9",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Order Info" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Partner" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Expected Date" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "h-24 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" })
				}) }) : filteredOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "h-24 text-center text-muted-foreground",
					children: "No deliveries found."
				}) }) : filteredOrders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: order.order_number
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: format(new Date(order.created_at), "MMM d, h:mm a")
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: order.profiles?.full_name || "N/A"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground truncate max-w-[150px]",
						children: order.addresses?.[0]?.city || "N/A"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: order.delivery_partners ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "bg-blue-50 text-blue-700",
						children: order.delivery_partners.name
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded",
						children: "Unassigned"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "capitalize",
						children: order.status
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-sm",
						children: order.expected_delivery_date ? format(new Date(order.expected_delivery_date), "MMM d, yyyy") : "--"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => openUpdateDialog(order),
							children: "Manage"
						})
					})
				] }, order.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Update Delivery Status" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: newStatus,
									onValueChange: setNewStatus,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select status" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Assign Delivery Partner"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: newPartner,
									onValueChange: setNewPartner,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select partner" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "unassigned",
										children: "-- Unassigned --"
									}), partners.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: p.id,
										children: [
											p.name,
											" (",
											p.vehicle_number,
											")"
										]
									}, p.id))] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-sm font-medium",
									children: "Internal Note / Update Message"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									placeholder: "E.g., Package handed over to driver...",
									value: newNote,
									onChange: (e) => setNewNote(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsDialogOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleUpdateDelivery,
							disabled: updating,
							className: "gap-2",
							children: [updating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Update"]
						})]
					})
				] })
			})
		]
	});
}
//#endregion
export { AdminDeliveries as component };
