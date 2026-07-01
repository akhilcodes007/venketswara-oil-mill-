import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { E as LogIn, V as Circle, s as Trash2, tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as useShop } from "./store-BFWNyGG7.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as SiteHeader } from "./SiteHeader-BCPL4uGc.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as useAuth } from "./auth-DbjdK8_c.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { i as useForm, n as Controller, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "../_libs/@radix-ui/react-radio-group+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-BPmIIKW5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
var PAYMENT_METHODS = [
	"UPI / Google Pay",
	"PhonePe",
	"Paytm",
	"Debit / Credit Card",
	"Net Banking",
	"Cash on Delivery"
];
var checkoutSchema = objectType({
	name: stringType().min(2, "Name is required"),
	mobile: stringType().min(10, "Valid mobile number is required"),
	address: stringType().min(5, "Delivery address is required"),
	landmark: stringType().optional(),
	city: stringType().min(2, "City is required"),
	state: stringType().min(2, "State is required"),
	pincode: stringType().min(6, "Valid pincode is required"),
	payment: stringType().min(1, "Payment method is required")
});
function loadRazorpayScript() {
	return new Promise((resolve) => {
		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.onload = () => resolve(true);
		script.onerror = () => resolve(false);
		document.body.appendChild(script);
	});
}
function Checkout() {
	const { cart, updateQty, removeFromCart, clearCart } = useShop();
	const { user, loading: authLoading } = useAuth();
	const navigate = useNavigate();
	const [coupon, setCoupon] = (0, import_react.useState)("");
	const [discountPct, setDiscountPct] = (0, import_react.useState)(0);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [savedAddresses, setSavedAddresses] = (0, import_react.useState)([]);
	const [selectedAddressId, setSelectedAddressId] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(checkoutSchema),
		defaultValues: {
			name: "",
			mobile: "",
			address: "",
			landmark: "",
			city: "",
			state: "",
			pincode: "",
			payment: PAYMENT_METHODS[0]
		}
	});
	const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
	const discount = Math.round(subtotal * discountPct / 100);
	const taxable = subtotal - discount;
	const gst = Math.round(taxable * .05);
	const shipping = taxable === 0 ? 0 : taxable > 999 ? 0 : 60;
	const total = taxable + gst + shipping;
	const applyCoupon = () => {
		if (coupon.trim().toUpperCase() === "SVOM10") {
			setDiscountPct(10);
			toast.success("Coupon applied — 10% off");
		} else {
			setDiscountPct(0);
			toast.error("Invalid coupon code");
		}
	};
	const getPaymentMethodEnum = (m) => {
		if (m === "Cash on Delivery") return "cod";
		if (m === "UPI / Google Pay") return "upi";
		if (m === "PhonePe") return "phonepe";
		if (m === "Paytm") return "paytm";
		if (m === "Net Banking") return "net_banking";
		return "credit_card";
	};
	const onSubmit = async (values) => {
		if (cart.length === 0) {
			toast.error("Your cart is empty");
			return;
		}
		if (!user) {
			toast.error("Please sign in to place your order");
			navigate({ to: "/auth" });
			return;
		}
		setSubmitting(true);
		console.log("Trace - Checkout State (onSubmit):");
		console.log("cart items being sent to RPC:", cart.map((c) => ({
			id: c.id,
			name: c.name
		})));
		try {
			let addressId = selectedAddressId;
			if (!addressId) {
				const { data, error } = await supabase.from("addresses").insert({
					user_id: user.id,
					name: values.name,
					mobile: values.mobile,
					address: values.address,
					landmark: values.landmark || null,
					city: values.city,
					state: values.state,
					pincode: values.pincode
				}).select("id").single();
				if (error) throw error;
				addressId = data.id;
			}
			const orderDetails = {
				address_id: addressId,
				subtotal,
				gst,
				shipping,
				discount,
				total,
				coupon: discountPct > 0 ? coupon.trim().toUpperCase() : null,
				payment_method: getPaymentMethodEnum(values.payment),
				items: cart
			};
			if (values.payment === "Cash on Delivery") {
				const { data, error } = await supabase.rpc("commit_order_transaction", {
					p_user_id: user.id,
					p_order_details: orderDetails
				});
				if (error) throw error;
				clearCart();
				toast.success("Order placed successfully");
				navigate({ to: `/invoice/${data}` });
			} else {
				if (!await loadRazorpayScript()) throw new Error("Razorpay SDK failed to load. Are you online?");
				const { data: session } = await supabase.auth.getSession();
				const { data: rzpOrderData, error: rzpOrderError } = await supabase.functions.invoke("create-razorpay-order", { body: { amount: total } });
				if (rzpOrderError || rzpOrderData?.error) throw new Error(rzpOrderError?.message || rzpOrderData?.error || "Failed to create order");
				const options = {
					key: "rzp_test_xxxx",
					amount: rzpOrderData.amount,
					currency: rzpOrderData.currency,
					name: "SRI VENKETESWARA OIL MILL",
					description: "Premium Cold Pressed Oils",
					order_id: rzpOrderData.id,
					handler: async function(response) {
						try {
							const { data: verifyData, error: verifyReqError } = await supabase.functions.invoke("verify-payment", { body: {
								razorpay_order_id: response.razorpay_order_id,
								razorpay_payment_id: response.razorpay_payment_id,
								razorpay_signature: response.razorpay_signature,
								orderDetails
							} });
							if (verifyReqError || verifyData?.error) throw new Error(verifyReqError?.message || verifyData?.error || "Payment verification failed");
							clearCart();
							toast.success("Payment successful! Order placed.");
							navigate({ to: `/invoice/${verifyData.orderId}` });
						} catch (err) {
							toast.error(err.message || "Payment verification failed");
						}
					},
					prefill: {
						name: values.name,
						email: user.email,
						contact: values.mobile
					},
					theme: { color: "#b0891d" }
				};
				const rzp = new window.Razorpay(options);
				rzp.on("payment.failed", function(response) {
					toast.error(response.error.description || "Payment failed");
				});
				rzp.open();
			}
		} catch (err) {
			toast.error(err.message || "Something went wrong");
		} finally {
			setSubmitting(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (user) supabase.from("addresses").select("*").eq("user_id", user.id).then(({ data }) => {
			if (data && data.length > 0) setSavedAddresses(data);
		});
	}, [user]);
	(0, import_react.useEffect)(() => {
		if (!savedAddresses.length || !selectedAddressId) return;
		const selected = savedAddresses.find((item) => item.id === selectedAddressId);
		if (!selected) return;
		form.reset({
			...form.getValues(),
			name: selected.name,
			mobile: selected.mobile,
			address: selected.address,
			landmark: selected.landmark || "",
			city: selected.city,
			state: selected.state,
			pincode: selected.pincode
		});
	}, [
		savedAddresses,
		selectedAddressId,
		form
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-10 md:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl md:text-4xl text-foreground",
					children: "Checkout"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Review your cart, share delivery details and complete your order."
				}),
				!authLoading && !user && cart.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 rounded-2xl border border-border bg-card p-10 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mx-auto h-10 w-10 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-serif text-xl text-foreground",
							children: "Sign in to checkout"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Your cart is saved. Sign in with a one-time email code to place the order."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-5",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/auth",
								children: "Sign in with email"
							})
						})
					]
				}) : cart.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 rounded-2xl border border-border bg-card p-10 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "Your cart is empty."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: "Browse products"
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: form.handleSubmit(onSubmit),
					className: "mt-8 grid gap-8 lg:grid-cols-[1fr_380px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-2xl border border-border bg-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-xl text-foreground",
										children: "Your cart"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "mt-4 divide-y divide-border",
										children: cart.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex gap-4 py-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--cream)]",
												children: item.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: item.image,
													alt: item.name,
													className: "h-full w-full object-contain p-2"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-muted-foreground",
													children: "No image"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-1 flex-col",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-start justify-between gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-medium text-foreground",
														children: item.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs text-muted-foreground",
														children: item.size
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => removeFromCart(item.id, item.size),
														className: "text-muted-foreground hover:text-destructive",
														"aria-label": "Remove",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "mt-auto flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center rounded-full border border-border",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => updateQty(item.id, item.size, item.qty - 1),
																className: "h-8 w-8",
																children: "−"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "w-6 text-center text-sm",
																children: item.qty
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => updateQty(item.id, item.size, item.qty + 1),
																className: "h-8 w-8",
																children: "+"
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-medium text-foreground",
														children: ["₹", item.price * item.qty]
													})]
												})]
											})]
										}, item.id + item.size))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "Coupon code (try SVOM10)",
											value: coupon,
											onChange: (e) => setCoupon(e.target.value)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "outline",
											onClick: applyCoupon,
											children: "Apply"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-2xl border border-border bg-card p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-serif text-xl text-foreground",
										children: "Delivery details"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4 space-y-4",
										children: savedAddresses.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-3xl border border-border bg-background/80 p-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mb-3 flex items-center justify-between gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-semibold text-foreground",
													children: "Saved delivery addresses"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: "Choose one to autofill the form."
												})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													asChild: true,
													variant: "outline",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/addresses",
														children: "Manage"
													})
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid gap-3 sm:grid-cols-2",
												children: savedAddresses.map((address) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													onClick: () => setSelectedAddressId(address.id),
													className: `rounded-2xl border px-4 py-3 text-left transition ${selectedAddressId === address.id ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between gap-3 text-sm text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-medium text-foreground",
															children: address.name
														}), address.is_default && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "rounded-full bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-primary",
															children: "Default"
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "mt-2 text-sm text-foreground leading-6",
														children: [
															address.address,
															address.landmark ? ` · ${address.landmark}` : "",
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
															address.city,
															", ",
															address.state,
															" · ",
															address.pincode,
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
															address.mobile
														]
													})]
												}, address.id))
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 grid gap-4 md:grid-cols-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "md:col-span-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Full Name *" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														...form.register("name"),
														className: "mt-1"
													}),
													form.formState.errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-xs text-destructive",
														children: form.formState.errors.name.message
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile Number *" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													...form.register("mobile"),
													className: "mt-1"
												}),
												form.formState.errors.mobile && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-destructive",
													children: form.formState.errors.mobile.message
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "md:col-span-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Delivery Address *" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														...form.register("address"),
														className: "mt-1"
													}),
													form.formState.errors.address && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mt-1 text-xs text-destructive",
														children: form.formState.errors.address.message
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Landmark" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												...form.register("landmark"),
												className: "mt-1"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City *" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													...form.register("city"),
													className: "mt-1"
												}),
												form.formState.errors.city && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-destructive",
													children: form.formState.errors.city.message
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State *" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													...form.register("state"),
													className: "mt-1"
												}),
												form.formState.errors.state && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-destructive",
													children: form.formState.errors.state.message
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pincode *" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													...form.register("pincode"),
													className: "mt-1"
												}),
												form.formState.errors.pincode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xs text-destructive",
													children: form.formState.errors.pincode.message
												})
											] })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "rounded-2xl border border-border bg-card p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-serif text-xl text-foreground",
									children: "Payment method"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Controller, {
									control: form.control,
									name: "payment",
									render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
										value: field.value,
										onValueChange: field.onChange,
										className: "mt-4 grid gap-3 md:grid-cols-2",
										children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: `flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${field.value === m ? "border-primary bg-primary/5" : "border-border"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, {
												value: m,
												id: m
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm text-foreground",
												children: m
											})]
										}, m))
									})
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
						className: "h-fit space-y-4 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-serif text-xl text-foreground",
								children: "Order Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Subtotal",
								value: `₹${subtotal}`
							}),
							discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: `Discount (${discountPct}%)`,
								value: `− ₹${discount}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "GST (5%)",
								value: `₹${gst}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Shipping",
								value: shipping === 0 ? "Free" : `₹${shipping}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Total",
								value: `₹${total}`,
								bold: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "w-full",
								size: "lg",
								disabled: submitting,
								children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Processing…"] }) : "Place Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-xs text-muted-foreground",
								children: "Secure checkout · Invoice generated automatically"
							})
						]
					})]
				})
			]
		})]
	});
}
function Row({ label, value, bold }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex items-center justify-between text-sm ${bold ? "text-base font-semibold text-foreground" : "text-muted-foreground"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: bold ? "font-serif text-xl text-foreground" : "text-foreground",
			children: value
		})]
	});
}
//#endregion
export { Checkout as component };
