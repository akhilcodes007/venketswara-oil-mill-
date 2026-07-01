import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { at as CircleCheckBig, l as Star, p as Search, rt as CircleX, s as Trash2, tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-3HhpKDcy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-DW0OW2th.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminReviews() {
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [isViewOpen, setIsViewOpen] = (0, import_react.useState)(false);
	const [selectedReview, setSelectedReview] = (0, import_react.useState)(null);
	const fetchReviews = async () => {
		setLoading(true);
		let query = supabase.from("reviews").select("*, products(name), profiles!reviews_customer_id_fkey(full_name)").order("created_at", { ascending: false });
		if (statusFilter !== "all") query = query.eq("approved", statusFilter === "approved");
		const { data, error } = await query;
		if (error) toast.error("Failed to load reviews");
		else setReviews(data || []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchReviews();
	}, [statusFilter]);
	const updateStatus = async (id, newApproved) => {
		const { error } = await supabase.from("reviews").update({
			approved: newApproved,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success(newApproved ? "Review Approved" : "Review Rejected/Pending");
			fetchReviews();
			if (selectedReview?.id === id) setSelectedReview({
				...selectedReview,
				approved: newApproved
			});
		}
	};
	const deleteReview = async (id) => {
		if (!confirm("Are you sure you want to permanently delete this review?")) return;
		const { error } = await supabase.from("reviews").delete().eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success("Review deleted");
			setIsViewOpen(false);
			fetchReviews();
		}
	};
	const filtered = reviews.filter((r) => r.title?.toLowerCase().includes(search.toLowerCase()) || r.products?.name?.toLowerCase().includes(search.toLowerCase()) || r.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()));
	const getStatusBadge = (approved) => {
		if (approved) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-green-100 text-green-800 hover:bg-green-100 border-none",
			children: "Approved"
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "secondary",
			className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none",
			children: "Pending"
		});
	};
	const renderStars = (rating) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex",
			children: [
				1,
				2,
				3,
				4,
				5
			].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3 w-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}` }, star))
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Reviews Moderation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Manage and moderate customer reviews across all products."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search reviews...",
						className: "pl-9",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: statusFilter === "all" ? "default" : "outline",
							size: "sm",
							onClick: () => setStatusFilter("all"),
							children: "All"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: statusFilter === "pending" ? "default" : "outline",
							size: "sm",
							onClick: () => setStatusFilter("pending"),
							children: "Pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: statusFilter === "approved" ? "default" : "outline",
							size: "sm",
							onClick: () => setStatusFilter("approved"),
							children: "Approved"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Customer" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Rating" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Review" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Date" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "h-24 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" })
				}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "h-24 text-center text-muted-foreground",
					children: "No reviews found."
				}) }) : filtered.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: !review.approved ? "bg-amber-50/30" : "",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium max-w-[150px] truncate",
							title: review.products?.name,
							children: review.products?.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [review.profiles?.full_name || "Unknown", review.verified_purchase && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								title: "Verified Purchase",
								className: "flex items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3 text-blue-500" })
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: renderStars(review.rating) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "max-w-[200px] truncate",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-sm mr-2",
								children: review.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: review.review
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: getStatusBadge(review.approved) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: format(new Date(review.created_at), "MMM d, yyyy")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right space-x-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setSelectedReview(review);
									setIsViewOpen(true);
								},
								children: "View & Moderate"
							})
						})
					]
				}, review.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isViewOpen,
				onOpenChange: setIsViewOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Review Details" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Review submitted on ", selectedReview && format(new Date(selectedReview.created_at), "PPP")] })] }), selectedReview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-lg",
									children: selectedReview.products?.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 mt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: selectedReview.profiles?.full_name
									}), selectedReview.verified_purchase && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-blue-600 border-blue-200 bg-blue-50 text-[10px]",
										children: "Verified Purchase"
									})]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: getStatusBadge(selectedReview.approved) })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border bg-muted/20 p-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 mb-3",
										children: [renderStars(selectedReview.rating), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-sm",
											children: [selectedReview.rating, ".0"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-bold mb-2",
										children: selectedReview.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-gray-700 whitespace-pre-wrap",
										children: selectedReview.review
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Helpful votes: ", selectedReview.helpful_count] }), selectedReview.updated_at !== selectedReview.created_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Edited on ", format(new Date(selectedReview.updated_at), "MMM d")] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "text-destructive border-destructive/30 hover:bg-destructive/10",
									onClick: () => deleteReview(selectedReview.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 mr-2" }), " Delete"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [selectedReview.approved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										className: "border-red-200 hover:bg-red-50 text-red-600",
										onClick: () => updateStatus(selectedReview.id, false),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 mr-2" }), " Revoke Approval"]
									}), !selectedReview.approved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "bg-green-600 hover:bg-green-700 text-white",
										onClick: () => updateStatus(selectedReview.id, true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4 mr-2" }), " Approve"]
									})]
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminReviews as component };
