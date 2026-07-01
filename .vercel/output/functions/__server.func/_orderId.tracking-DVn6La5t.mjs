import { o as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/client--XIMi9ld.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { C as MapPin, S as Map, i as Truck, ot as CircleCheck, tt as LoaderCircle, z as Clock } from "./_libs/lucide-react.mjs";
import { t as Route } from "./_orderId.tracking-DqeeRGBR.mjs";
import { r as format } from "./_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_orderId.tracking-DVn6La5t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeliveryMap({ coordinates, status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full h-64 md:h-80 bg-muted/30 rounded-xl border overflow-hidden flex items-center justify-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 opacity-10",
			style: {
				backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
				backgroundSize: "20px 20px"
			}
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "z-10 flex flex-col items-center p-6 bg-background/80 backdrop-blur-sm rounded-2xl border shadow-sm text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, { className: "h-8 w-8 text-primary mb-2" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-foreground",
					children: "Live Tracking Map"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground mt-1 max-w-[250px]",
					children: [
						"Google Maps Integration Pending. ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"(Coordinates: ",
						coordinates ? `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}` : "Fetching...",
						")"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider",
					children: status
				})
			]
		})]
	});
}
function OrderTracking() {
	const { orderId } = Route.useParams();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchTrackingData = async () => {
		const { data: oData, error: oError } = await supabase.from("new_orders").select(`
        id, order_number, status, expected_delivery_date, created_at,
        delivery_partners ( name, mobile ),
        addresses ( address, city, state, pincode )
      `).eq("id", orderId).single();
		if (oData) setOrder(oData);
		const { data: lData } = await supabase.from("delivery_logs").select("*").eq("order_id", orderId).order("created_at", { ascending: false });
		if (lData) setLogs(lData);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchTrackingData();
		const channel = supabase.channel(`tracking-${orderId}`).on("postgres_changes", {
			event: "INSERT",
			schema: "public",
			table: "delivery_logs",
			filter: `order_id=eq.${orderId}`
		}, () => fetchTrackingData()).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [orderId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-screen items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-primary" })
	});
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-[50vh] flex flex-col items-center justify-center text-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-12 w-12 text-muted-foreground mb-4" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-bold",
				children: "Order Not Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted-foreground mt-2",
				children: "The tracking link might be invalid or expired."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "text-2xl font-bold tracking-tight",
				children: ["Tracking: ", order.order_number]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-muted-foreground mt-1 flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
					" Ordered on ",
					format(new Date(order.created_at), "MMM d, yyyy")
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-left md:text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium text-muted-foreground uppercase tracking-wider",
					children: "Current Status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xl font-bold text-primary capitalize mt-1 flex items-center md:justify-end gap-2",
					children: [order.status === "Delivered" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-green-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-5 w-5" }), order.status]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid md:grid-cols-3 gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:col-span-2 space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeliveryMap, {
					coordinates: [13.0827, 80.2707],
					status: order.status
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border bg-card p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-lg mb-6",
						children: "Delivery Timeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-sm",
							children: "No tracking updates yet."
						}) : logs.map((log, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative pl-8",
							children: [
								index !== logs.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-2.5 top-8 bottom-[-24px] w-0.5 bg-border" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 bg-background flex items-center justify-center ${index === 0 ? "border-primary" : "border-muted-foreground"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-2 w-2 rounded-full ${index === 0 ? "bg-primary" : "bg-muted-foreground"}` })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: `font-medium capitalize ${index === 0 ? "text-foreground" : "text-muted-foreground"}`,
										children: log.status
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: format(new Date(log.created_at), "MMM d, h:mm a")
									}),
									log.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-2 text-sm bg-muted/50 p-3 rounded-md text-foreground",
										children: log.note
									})
								] })
							]
						}, log.id))
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-5 space-y-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm uppercase tracking-wider text-muted-foreground",
							children: "Expected Delivery"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xl font-bold",
							children: order.expected_delivery_date ? format(new Date(order.expected_delivery_date), "EEEE, MMM d") : "To be assigned"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-5 space-y-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm uppercase tracking-wider text-muted-foreground",
							children: "Delivery Partner"
						}), order.delivery_partners ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-lg",
							children: order.delivery_partners.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground mt-1",
							children: ["Contact: ", order.delivery_partners.mobile]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground italic",
							children: "Partner not yet assigned to this shipment."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border bg-card p-5 space-y-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm uppercase tracking-wider text-muted-foreground",
							children: "Shipping Address"
						}), order.addresses ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm leading-relaxed",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: order.addresses.address
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									order.addresses.city,
									", ",
									order.addresses.state
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["PIN: ", order.addresses.pincode] })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground italic",
							children: "Address hidden."
						})]
					})
				]
			})]
		})]
	});
}
//#endregion
export { OrderTracking as component };
