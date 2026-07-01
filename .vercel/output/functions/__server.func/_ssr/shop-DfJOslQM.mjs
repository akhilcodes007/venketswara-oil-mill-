import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trigger2, i as Root2, n as Header, r as Item, t as Content2, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { M as ImageOff, N as Heart, U as ChevronRight, W as ChevronDown, at as CircleCheckBig, c as ThumbsUp, l as Star, tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { n as useShop } from "./store-BFWNyGG7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SiteHeader } from "./SiteHeader-BCPL4uGc.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-3HhpKDcy.mjs";
import { t as PRODUCTS } from "./products-rNIC7C_F.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dg1urBTx.mjs";
import { t as Textarea } from "./textarea-kko37XEX.mjs";
import { t as SEO } from "./SEO-DwGENTSq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-DfJOslQM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function WriteReviewModal({ productId, isOpen, onClose, onSuccess }) {
	const [rating, setRating] = (0, import_react.useState)(0);
	const [hoverRating, setHoverRating] = (0, import_react.useState)(0);
	const [title, setTitle] = (0, import_react.useState)("");
	const [reviewText, setReviewText] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [initialLoading, setInitialLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		if (isOpen) loadExistingReview();
		else {
			setRating(0);
			setHoverRating(0);
			setTitle("");
			setReviewText("");
		}
	}, [isOpen, productId]);
	const loadExistingReview = async () => {
		setInitialLoading(true);
		const { data: { session } } = await supabase.auth.getSession();
		if (!session) {
			setInitialLoading(false);
			return;
		}
		const { data, error } = await supabase.from("reviews").select("*").eq("product_id", productId).eq("customer_id", session.user.id).maybeSingle();
		if (data) {
			setRating(data.rating);
			setTitle(data.title || "");
			setReviewText(data.review || "");
		}
		setInitialLoading(false);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (rating === 0) {
			toast.error("Please select a rating.");
			return;
		}
		if (!title.trim() || !reviewText.trim()) {
			toast.error("Please provide both a title and description.");
			return;
		}
		setLoading(true);
		const { data, error } = await supabase.rpc("submit_review", {
			p_product_id: productId,
			p_rating: rating,
			p_title: title,
			p_review: reviewText
		});
		setLoading(false);
		if (error) toast.error(error.message);
		else {
			toast.success("Review submitted! It will appear once approved.");
			onSuccess();
			onClose();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: isOpen,
		onOpenChange: onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Write a Review" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Share your experience with this product. Honest reviews help other customers!" })] }), initialLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-center py-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6 pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium",
							children: "Your Rating"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1 cursor-pointer",
							children: [
								1,
								2,
								3,
								4,
								5
							].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
								className: `h-8 w-8 transition-colors ${star <= (hoverRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`,
								onMouseEnter: () => setHoverRating(star),
								onMouseLeave: () => setHoverRating(0),
								onClick: () => setRating(star)
							}, star))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium mb-1 block",
							children: "Review Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Summarize your experience...",
							value: title,
							onChange: (e) => setTitle(e.target.value),
							maxLength: 100
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium mb-1 block",
							children: "Review Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							placeholder: "What did you like or dislike? How did you use this product?",
							className: "min-h-[120px]",
							value: reviewText,
							onChange: (e) => setReviewText(e.target.value),
							maxLength: 1e3
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2 pt-4 border-t",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: onClose,
							disabled: loading,
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: loading || rating === 0,
							children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Submit Review"]
						})]
					})
				]
			})]
		})
	});
}
var Accordion = Root2;
var AccordionItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Header, {
	className: "flex",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Trigger2, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = Trigger2.displayName;
var AccordionContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = Content2.displayName;
function ProductReviews({ productId }) {
	const [summary, setSummary] = (0, import_react.useState)(null);
	const [reviews, setReviews] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [session, setSession] = (0, import_react.useState)(null);
	const [sortBy, setSortBy] = (0, import_react.useState)("newest");
	const [page, setPage] = (0, import_react.useState)(1);
	const limit = 5;
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getSession().then(({ data }) => setSession(data.session));
		fetchSummary();
	}, [productId]);
	(0, import_react.useEffect)(() => {
		fetchReviews();
	}, [
		productId,
		sortBy,
		page
	]);
	const fetchSummary = async () => {
		const { data, error } = await supabase.rpc("get_product_reviews_summary", { p_product_id: productId });
		if (!error && data) setSummary(data);
	};
	const fetchReviews = async () => {
		setLoading(true);
		let query = supabase.from("reviews").select("*, profiles!reviews_customer_id_fkey(full_name)").eq("product_id", productId).eq("approved", true);
		switch (sortBy) {
			case "newest":
				query = query.order("created_at", { ascending: false });
				break;
			case "highest":
				query = query.order("rating", { ascending: false }).order("created_at", { ascending: false });
				break;
			case "lowest":
				query = query.order("rating", { ascending: true }).order("created_at", { ascending: false });
				break;
			case "helpful":
				query = query.order("helpful_count", { ascending: false }).order("created_at", { ascending: false });
				break;
		}
		const from = (page - 1) * limit;
		const to = from + limit - 1;
		query = query.range(from, to);
		const { data, error } = await query;
		if (!error) setReviews(data || []);
		setLoading(false);
	};
	const handleHelpfulVote = async (reviewId) => {
		if (!session) {
			toast.error("Please login to vote");
			return;
		}
		const { data, error } = await supabase.rpc("toggle_helpful_vote", { p_review_id: reviewId });
		if (error) toast.error(error.message);
		else {
			const result = data;
			setReviews((prev) => prev.map((r) => r.id === reviewId ? {
				...r,
				helpful_count: result.helpful_count
			} : r));
		}
	};
	const deleteOwnReview = async (reviewId) => {
		if (!confirm("Delete your review?")) return;
		const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
		if (!error) {
			toast.success("Review deleted");
			fetchSummary();
			fetchReviews();
		} else toast.error(error.message);
	};
	if (!summary) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-12 flex justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin" })
	});
	const totalReviews = summary.totalReviews || 0;
	const avgRating = summary.averageRating || 0;
	const distribution = summary.distribution || {
		"1": 0,
		"2": 0,
		"3": 0,
		"4": 0,
		"5": 0
	};
	const totalPages = Math.ceil(totalReviews / limit);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-12 max-w-5xl mx-auto px-4 lg:px-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-border pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl font-serif font-bold text-foreground",
					children: "Customer Reviews"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-muted-foreground whitespace-nowrap",
						children: "Sort by:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: sortBy,
						onValueChange: setSortBy,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[180px] bg-card",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sort by" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "newest",
								children: "Newest First"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "highest",
								children: "Highest Rating"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "lowest",
								children: "Lowest Rating"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "helpful",
								children: "Most Helpful"
							})
						] })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10 rounded-2xl bg-[var(--cream)] border border-border p-6 md:p-8 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid md:grid-cols-2 gap-8 md:gap-12 items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center md:items-start text-center md:text-left space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-6xl font-bold font-serif text-foreground",
								children: avgRating.toFixed(1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex text-[var(--gold)]",
								children: [
									1,
									2,
									3,
									4,
									5
								].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-6 w-6 ${star <= Math.round(avgRating) ? "fill-current" : "text-gray-300"}` }, star))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted-foreground font-medium",
								children: [
									"Based on ",
									totalReviews,
									" reviews"
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2.5",
						children: [
							5,
							4,
							3,
							2,
							1
						].map((star) => {
							const count = distribution[star.toString()] || 0;
							const percent = totalReviews > 0 ? count / totalReviews * 100 : 0;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "w-12 font-medium text-foreground",
										children: [star, " stars"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex-1 h-2.5 bg-white/50 border border-border/50 rounded-full overflow-hidden relative",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "absolute top-0 left-0 h-full bg-[var(--gold)] rounded-full transition-all duration-500",
											style: { width: `${percent}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 text-right text-muted-foreground",
										children: count
									})
								]
							}, star);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 pt-8 border-t border-border/50 flex justify-center md:justify-start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "lg",
						className: "md:w-auto px-8",
						onClick: () => {
							if (!session) toast.error("Please login to write a review");
							else setIsModalOpen(true);
						},
						children: "Write a Review"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
				type: "single",
				collapsible: true,
				className: "w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
					value: "reviews",
					className: "border-b-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionTrigger, {
						className: "text-xl font-serif hover:no-underline py-0 mb-4 px-2",
						children: [
							"View All Reviews (",
							totalReviews,
							")"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
						className: "px-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pb-4 border-b",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium",
										children: [totalReviews, " Reviews"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: sortBy,
										onValueChange: setSortBy,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "w-[180px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sort by" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "newest",
												children: "Newest First"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "highest",
												children: "Highest Rating"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "lowest",
												children: "Lowest Rating"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "helpful",
												children: "Most Helpful"
											})
										] })]
									})]
								}),
								loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "py-12 flex justify-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-muted-foreground" })
								}) : reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center py-16 text-muted-foreground bg-[var(--cream)] rounded-2xl border border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-serif text-xl mb-2 text-foreground",
										children: "No reviews yet"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Be the first to share your experience with this product!" })]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid gap-6",
									children: reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-elegant)] transition hover:shadow-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex text-[var(--gold)] mb-2",
													children: [
														1,
														2,
														3,
														4,
														5
													].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-4 w-4 ${star <= review.rating ? "fill-current" : "text-gray-300"}` }, star))
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "font-serif font-bold text-lg text-foreground",
													children: review.title
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full",
													children: format(new Date(review.created_at), "MMM d, yyyy")
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap mb-6",
												children: review.review
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3 text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium text-foreground",
														children: review.profiles?.full_name || "Anonymous"
													}), review.verified_purchase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center text-[oklch(0.6_0.15_150)] bg-[oklch(0.95_0.05_150)] px-2 py-0.5 rounded-full text-xs font-medium border border-[oklch(0.9_0.1_150)]",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3 mr-1.5" }), " Verified Purchase"]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														size: "sm",
														className: "h-8 rounded-full text-xs",
														onClick: () => handleHelpfulVote(review.id),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: `h-3.5 w-3.5 mr-2 ${review.helpful_count > 0 ? "text-primary" : "text-muted-foreground"}` }),
															"Helpful (",
															review.helpful_count,
															")"
														]
													}), session?.user?.id === review.customer_id && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "sm",
														className: "text-destructive hover:text-destructive hover:bg-destructive/10 h-8 rounded-full text-xs px-3",
														onClick: () => deleteOwnReview(review.id),
														children: "Delete"
													})]
												})]
											})
										]
									}, review.id))
								}),
								totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-center gap-3 pt-8 pb-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "rounded-full",
											onClick: () => setPage((p) => Math.max(1, p - 1)),
											disabled: page === 1,
											children: "Previous"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-sm font-medium text-muted-foreground mx-2",
											children: [
												"Page ",
												page,
												" of ",
												totalPages
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											className: "rounded-full",
											onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
											disabled: page === totalPages,
											children: "Next"
										})
									]
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WriteReviewModal, {
				productId,
				isOpen: isModalOpen,
				onClose: () => setIsModalOpen(false),
				onSuccess: () => {
					fetchSummary();
					fetchReviews();
				}
			})
		]
	});
}
function Breadcrumbs({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		"aria-label": "Breadcrumb",
		className: "my-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
			className: "flex items-center space-x-2 text-sm text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "hover:text-foreground transition-colors",
				children: "Home"
			}) }), items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center space-x-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }), item.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: item.href,
					className: "hover:text-foreground transition-colors",
					children: item.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-foreground font-medium",
					"aria-current": "page",
					children: item.label
				})]
			}, index))]
		})
	});
}
var generateBreadcrumbJsonLd = (items) => {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		"itemListElement": [{
			"@type": "ListItem",
			"position": 1,
			"name": "Home",
			"item": "https://sriVENKETESWARAoilmill.com"
		}, ...items.map((item, index) => ({
			"@type": "ListItem",
			"position": index + 2,
			"name": item.label,
			"item": item.href ? `https://sriVENKETESWARAoilmill.com${item.href}` : void 0
		}))]
	};
};
function Shop() {
	useNavigate();
	const [cat, setCat] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)("featured");
	const products = (0, import_react.useMemo)(() => {
		let list = PRODUCTS.filter((p) => cat === "all" || p.category === cat);
		if (search.trim()) {
			const s = search.toLowerCase();
			list = list.filter((p) => p.name.toLowerCase().includes(s));
		}
		if (sort === "price-asc") list = [...list].sort((a, b) => a.variants[0].price - b.variants[0].price);
		if (sort === "price-desc") list = [...list].sort((a, b) => b.variants[0].price - a.variants[0].price);
		if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
		return list;
	}, [
		cat,
		search,
		sort
	]);
	const breadcrumbs = [{
		label: "Shop",
		href: "/shop"
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SEO, {
				title: "Shop — SRI VENKETESWARA OIL MILL",
				description: "Shop traditional cold-pressed oils, premium dry fruits, natural honey, and millets from SRI VENKETESWARA OIL MILL.",
				jsonLd: generateBreadcrumbJsonLd(breadcrumbs)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "border-b border-border",
				style: { background: "var(--gradient-hero)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4 pt-6 md:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { items: breadcrumbs })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.3em] text-[var(--gold-deep)]",
							children: "FROM OUR MILL TO YOUR TABLE"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-3 font-serif text-4xl md:text-5xl text-foreground",
							children: "Cold-pressed oils, premium dry fruits, pure natural honey & millets"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 max-w-2xl text-muted-foreground",
							children: "Traditionally wood-pressed, naturally filtered, lovingly bottled. Choose your size and add to cart."
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-7xl px-4 py-8 md:px-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: [
								"all",
								"oils",
								"dryfruits",
								"palm-products",
								"honey",
								"millets"
							].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCat(c),
								className: `rounded-full border px-4 py-1.5 text-sm transition ${cat === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40"}`,
								children: c === "all" ? "All Products" : c === "oils" ? "Cold Pressed Oils" : c === "dryfruits" ? "Dry Fruits & Nuts" : c === "palm-products" ? "Palm Products" : c === "honey" ? "Natural Honey" : "Millets & Traditional Grains"
							}, c))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex flex-1 gap-3 md:flex-none",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "Search products…",
								value: search,
								onChange: (e) => setSearch(e.target.value),
								className: "md:w-64"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: sort,
								onValueChange: (v) => setSort(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "md:w-48",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Sort" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "featured",
										children: "Featured"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "price-asc",
										children: "Price: Low to High"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "price-desc",
										children: "Price: High to Low"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "name",
										children: "Name (A–Z)"
									})
								] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
						children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.id))
					}),
					products.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "py-20 text-center text-muted-foreground",
						children: "No products match your search."
					})
				]
			})
		]
	});
}
function ProductCard({ product }) {
	const navigate = useNavigate();
	const [variantIdx, setVariantIdx] = (0, import_react.useState)(0);
	const [qty, setQty] = (0, import_react.useState)(0);
	const { addToCart, toggleWishlist, isWishlisted } = useShop();
	const variant = product.variants[variantIdx];
	const wishlisted = isWishlisted(product.id, variant.size);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-[var(--shadow-elegant)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative aspect-[4/5] overflow-hidden bg-[var(--cream)]",
			children: [product.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: product.image,
				alt: product.imageAlt ?? product.name,
				loading: "lazy",
				className: "h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageOff, { className: "h-10 w-10 opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs tracking-wide",
					children: "Image coming soon"
				})]
			}), product.tags?.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "absolute left-3 top-3 border-0 bg-[var(--gold)] text-[oklch(0.22_0.04_50)]",
				children: t
			}, t))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-1 flex-col gap-3 p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-serif text-xl text-foreground",
					children: product.name
				}), product.tamilName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: product.tamilName
				}) : null] }), product.rating ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1 text-[0.75rem] text-[var(--gold)]",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: i < Math.round(product.rating || 0) ? "★" : "☆" }, i))
				}) : null]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 line-clamp-2 text-sm text-muted-foreground",
				children: product.description
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: product.variants.map((v, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setVariantIdx(i),
							className: `rounded-full border px-3 py-1 text-xs transition ${i === variantIdx ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-primary/40"}`,
							children: v.size
						}, v.size))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-serif text-2xl font-semibold text-foreground",
							children: ["₹", variant.price]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: ["per ", variant.size]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-full border border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQty((q) => Math.max(0, q - 1)),
									disabled: qty === 0,
									className: "h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed",
									"aria-label": "Decrease quantity",
									children: "−"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "w-6 text-center text-sm",
									children: qty
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setQty((q) => q + 1),
									className: "h-8 w-8 text-muted-foreground hover:text-foreground",
									"aria-label": "Increase quantity",
									children: "+"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 text-sm text-muted-foreground",
								children: [typeof product.stock === "number" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-full bg-muted px-2 py-1",
									children: [product.stock, " left"]
								}) : null, product.category === "honey" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "rounded-full bg-[var(--peach)] text-[var(--brown)]",
									children: "Premium"
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => {
										if (qty === 0) {
											toast.error("Please increase the quantity before adding to cart.");
											return;
										}
										addToCart({
											id: product.id,
											name: product.name,
											size: variant.size,
											price: variant.price,
											qty,
											image: product.image
										});
										toast.success(`${product.name} (${variant.size}) added to cart`);
									},
									className: "w-full",
									children: "Add to Cart"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "secondary",
									onClick: () => {
										if (qty === 0) {
											toast.error("Please increase the quantity before buying.");
											return;
										}
										addToCart({
											id: product.id,
											name: product.name,
											size: variant.size,
											price: variant.price,
											qty,
											image: product.image
										});
										toast.success(`${product.name} (${variant.size}) added to cart`);
										navigate({ to: "/checkout" });
									},
									className: "w-full",
									children: "Buy Now"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: wishlisted ? "secondary" : "outline",
								onClick: () => {
									toggleWishlist({
										id: product.id,
										size: variant.size
									});
									toast.success(wishlisted ? `${product.name} (${variant.size}) removed from wishlist` : `${product.name} (${variant.size}) added to wishlist`);
								},
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "mr-2 h-4 w-4" }), wishlisted ? "Remove from wishlist" : "Save for later"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollapsibleReviewsWrapper, {
							productId: product.id,
							initialRating: product.rating
						})
					})
				]
			})]
		})]
	});
}
function CollapsibleReviewsWrapper({ productId, initialRating }) {
	const [isExpanded, setIsExpanded] = (0, import_react.useState)(false);
	const [summary, setSummary] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		supabase.rpc("get_product_reviews_summary", { p_product_id: productId }).then(({ data, error }) => {
			if (!error && data) setSummary(data);
		});
	}, [productId]);
	const rating = summary?.averageRating || initialRating || 0;
	const count = summary?.totalReviews || 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setIsExpanded(!isExpanded),
			className: "flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-[var(--cream)] py-3 text-sm font-semibold text-foreground hover:bg-[var(--gold)]/10 hover:border-[var(--gold)]/30 transition-all duration-300 shadow-sm",
			children: isExpanded ? "▲ Hide Customer Reviews" : count > 0 ? `⭐ Customer Reviews (${rating.toFixed(1)} • ${count} Review${count !== 1 ? "s" : ""}) ▼` : "⭐ Customer Reviews (No Reviews Yet) ▼"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `grid transition-[grid-template-rows] duration-300 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductReviews, { productId })
			})
		})]
	});
}
//#endregion
export { Shop as component };
