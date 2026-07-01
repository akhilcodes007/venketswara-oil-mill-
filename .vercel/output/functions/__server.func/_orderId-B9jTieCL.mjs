import { o as __toESM } from "./_runtime.mjs";
import { t as supabase } from "./_ssr/client--XIMi9ld.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "./_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Route } from "./_orderId-eS-yD-ms.mjs";
import { t as Button } from "./_ssr/button-PJVP9td7.mjs";
import { Z as ArrowLeft, h as Printer } from "./_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_orderId-B9jTieCL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InvoicePage() {
	const { orderId } = Route.useParams();
	const [order, setOrder] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		async function loadData() {
			try {
				const { data: o, error: errO } = await supabase.from("new_orders").select("*, addresses(*)").eq("id", orderId).single();
				if (errO) throw errO;
				setOrder(o);
				const { data: i } = await supabase.from("order_items").select("*").eq("order_id", orderId);
				setItems(i || []);
				const { data: p } = await supabase.from("profiles").select("*").eq("id", o.user_id).single();
				setProfile(p);
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, [orderId]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-20 text-center",
		children: "Loading invoice..."
	});
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-20 text-center text-destructive",
		children: "Order not found."
	});
	const invoiceUrl = `${window.location.origin}/invoice/${orderId}`;
	const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(invoiceUrl)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-muted/20 pb-20",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "print:hidden mx-auto max-w-4xl px-4 py-8 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/dashboard",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Orders"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => window.print(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "mr-2 h-4 w-4" }), " Print Invoice"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl bg-white p-8 shadow-sm print:shadow-none print:p-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between border-b border-gray-200 pb-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-serif text-3xl font-bold text-gray-900",
							children: "SRI VENKETESWARA OIL MILL"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-gray-500",
							children: "Premium Cold Pressed Oils"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gray-500",
							children: "123 Market Street, City, State - 123456"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gray-500",
							children: "GSTIN: 29XXXXXXXXXXXX"
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold text-gray-900",
								children: "TAX INVOICE"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-gray-500",
								children: ["Invoice #: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-gray-900",
									children: order.invoice_number || "Pending"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-gray-500",
								children: ["Order #: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-gray-900",
									children: order.order_number || order.id.slice(0, 8)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-gray-500",
								children: ["Date: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-gray-900",
									children: new Date(order.created_at).toLocaleDateString()
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-gray-900",
							children: "Bill To:"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-gray-900",
							children: order.addresses?.name || profile?.full_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-gray-500",
							children: order.addresses?.address
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-gray-500",
							children: [
								order.addresses?.city,
								", ",
								order.addresses?.state,
								" - ",
								order.addresses?.pincode
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-gray-500",
							children: ["Phone: ", order.addresses?.mobile]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: qrCodeUrl,
						alt: "Scan to view online",
						className: "h-24 w-24 object-contain"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-center text-[10px] text-gray-400",
						children: "Scan to verify"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm text-gray-900",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-gray-200 text-gray-500",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-semibold",
										children: "Item Description"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-semibold text-center",
										children: "Qty"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-semibold text-right",
										children: "Price"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "pb-3 font-semibold text-right",
										children: "Total"
									})
								] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-gray-100",
								children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4",
										children: item.product_name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-4 text-center",
										children: item.quantity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-4 text-right",
										children: ["₹", item.price]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "py-4 text-right",
										children: ["₹", item.total]
									})
								] }, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tfoot", {
								className: "border-t border-gray-200",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 3,
										className: "pt-4 text-right font-medium text-gray-500",
										children: "Subtotal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "pt-4 text-right text-gray-900",
										children: ["₹", order.subtotal]
									})] }),
									order.discount_total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 3,
										className: "pt-2 text-right font-medium text-gray-500",
										children: "Discount"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "pt-2 text-right text-red-600",
										children: ["-₹", order.discount_total]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 3,
										className: "pt-2 text-right font-medium text-gray-500",
										children: "GST (5%)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "pt-2 text-right text-gray-900",
										children: ["₹", order.gst_total]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 3,
										className: "pt-2 text-right font-medium text-gray-500",
										children: "Shipping"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "pt-2 text-right text-gray-900",
										children: ["₹", order.shipping_total === 0 ? "Free" : order.shipping_total]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 3,
										className: "pt-4 text-right text-lg font-bold text-gray-900",
										children: "Grand Total"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "pt-4 text-right text-lg font-bold text-gray-900",
										children: ["₹", order.grand_total]
									})] })
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 border-t border-gray-200 pt-8 text-center text-xs text-gray-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Thank you for choosing SRI VENKETESWARA OIL MILL!" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This is a computer-generated document. No signature is required." })]
				})
			]
		})]
	});
}
//#endregion
export { InvoicePage as component };
