import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { A as IndianRupee, C as MapPin, N as Heart, d as ShoppingBag, n as Users, p as Search, tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-3HhpKDcy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/customers-BgvqJKJm.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminCustomers() {
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [totalCount, setTotalCount] = (0, import_react.useState)(0);
	const [search, setSearch] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [page, setPage] = (0, import_react.useState)(1);
	const limit = 10;
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [selectedCustomer, setSelectedCustomer] = (0, import_react.useState)(null);
	const [detailsLoading, setDetailsLoading] = (0, import_react.useState)(false);
	const fetchCustomers = async (searchTerm = search, pageNum = page) => {
		setLoading(true);
		const offset = (pageNum - 1) * limit;
		const { data, error } = await supabase.rpc("get_customers_with_metrics", {
			p_search: searchTerm,
			p_limit: limit,
			p_offset: offset
		});
		if (error) toast.error("Failed to load customers: " + error.message);
		else {
			setCustomers(data || []);
			setTotalCount(data?.[0]?.total_count || 0);
		}
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		const delayDebounceFn = setTimeout(() => {
			fetchCustomers(search, 1);
			setPage(1);
		}, 500);
		return () => clearTimeout(delayDebounceFn);
	}, [search]);
	(0, import_react.useEffect)(() => {
		fetchCustomers(search, page);
	}, [page]);
	const openCustomerDetails = async (id) => {
		setIsDialogOpen(true);
		setDetailsLoading(true);
		const { data, error } = await supabase.rpc("get_customer_details", { p_user_id: id });
		if (error) {
			toast.error("Failed to load details");
			setIsDialogOpen(false);
		} else setSelectedCustomer(data);
		setDetailsLoading(false);
	};
	const totalPages = Math.ceil(totalCount / limit);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Customers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Manage your customer profiles and view their lifetime value."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by name or mobile...",
						className: "pl-9",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border bg-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer Name" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mobile" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Total Orders" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Lifetime Value" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Joined Date" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "h-24 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" })
				}) }) : customers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "h-24 text-center text-muted-foreground",
					children: "No customers found."
				}) }) : customers.map((customer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs",
								children: customer.full_name?.charAt(0)?.toUpperCase() || "U"
							}), customer.full_name || "Unknown"]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: customer.mobile || "N/A" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: customer.total_orders }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "font-semibold text-green-600",
						children: ["₹", customer.lifetime_value]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: format(new Date(customer.created_at), "MMM d, yyyy") }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => openCustomerDetails(customer.id),
							children: "View Profile"
						})
					})
				] }, customer.id)) })] }), totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end space-x-2 py-4 px-4 border-t",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							disabled: page === 1 || loading,
							children: "Previous"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-muted-foreground",
							children: [
								"Page ",
								page,
								" of ",
								totalPages
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							disabled: page === totalPages || loading,
							children: "Next"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-4xl max-h-[90vh] overflow-y-auto",
					children: detailsLoading || !selectedCustomer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64 flex items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "text-2xl flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold",
							children: selectedCustomer.profile.full_name?.charAt(0)?.toUpperCase() || "U"
						}), selectedCustomer.profile.full_name || "Customer Profile"]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid md:grid-cols-3 gap-6 mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border bg-muted/20 p-5 space-y-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "font-semibold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4 text-green-600" }), " Lifetime Value"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-3xl font-bold text-green-600",
											children: ["₹", selectedCustomer.metrics.lifetime_value]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-4 border-t border-border/50 grid grid-cols-2 gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Orders"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: selectedCustomer.metrics.total_orders
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Avg. Order"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "font-semibold",
												children: ["₹", Math.round(selectedCustomer.metrics.average_order_value)]
											})] })]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border p-5 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-semibold flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }), " Contact Details"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Mobile:"
											}),
											" ",
											selectedCustomer.profile.mobile || "N/A"
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Joined:"
											}),
											" ",
											format(new Date(selectedCustomer.profile.created_at), "MMM d, yyyy")
										] })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border p-5 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "font-semibold flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4" }),
											" Saved Addresses (",
											selectedCustomer.addresses.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [selectedCustomer.addresses.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-sm p-3 bg-muted/30 rounded-md",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-medium",
													children: [
														a.name,
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "ml-1 text-[10px]",
															children: a.is_default ? "Default" : "Other"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-muted-foreground mt-1",
													children: [
														a.address,
														", ",
														a.city,
														", ",
														a.state,
														" - ",
														a.pincode
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-muted-foreground mt-1 text-xs",
													children: ["Ph: ", a.mobile]
												})
											]
										}, a.id)), selectedCustomer.addresses.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "No saved addresses."
										})]
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "md:col-span-2 space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-5 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-4 w-4" }), " Order History"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [selectedCustomer.orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border rounded-lg p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-start mb-3 border-b pb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: o.order_number
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: format(new Date(o.created_at), "PPp")
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-bold",
													children: ["₹", o.grand_total]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "mt-1 capitalize",
													children: o.status
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: o.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													i.quantity,
													"x ",
													i.product_name
												] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-muted-foreground",
													children: ["₹", i.total]
												})]
											}, i.id))
										})]
									}, o.id)), selectedCustomer.orders.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "No order history."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border p-5 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-semibold flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-4 w-4" }),
										" Wishlist (",
										selectedCustomer.wishlist.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid grid-cols-2 gap-4",
									children: selectedCustomer.wishlist.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3 border rounded-lg p-3",
										children: [w.product_image && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: w.product_image,
											alt: w.product_name,
											className: "h-10 w-10 object-cover rounded"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium line-clamp-1",
											children: w.product_name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground",
											children: ["₹", w.price]
										})] })]
									}, w.id))
								})]
							})]
						})]
					})] })
				})
			})
		]
	});
}
//#endregion
export { AdminCustomers as component };
