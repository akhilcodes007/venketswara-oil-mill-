import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { C as MapPin, g as Plus, nt as House, ot as CircleCheck, s as Trash2 } from "../_libs/lucide-react.mjs";
import { t as SiteHeader } from "./SiteHeader-BCPL4uGc.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { t as useAuth } from "./auth-DbjdK8_c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/addresses-CaZmUM54.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "svom_addresses_v1";
var blankAddress = {
	label: "Home",
	address: "",
	landmark: "",
	city: "",
	state: "",
	pincode: "",
	phone: ""
};
function Addresses() {
	const { user, loading } = useAuth();
	const [addresses, setAddresses] = (0, import_react.useState)([]);
	const [form, setForm] = (0, import_react.useState)({ ...blankAddress });
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setAddresses(JSON.parse(raw));
		} catch {}
	}, []);
	(0, import_react.useEffect)(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
	}, [addresses]);
	const editing = (0, import_react.useMemo)(() => addresses.find((address) => address.id === editingId) ?? null, [addresses, editingId]);
	(0, import_react.useEffect)(() => {
		if (!editing) {
			setForm({ ...blankAddress });
			return;
		}
		setForm({
			label: editing.label,
			address: editing.address,
			landmark: editing.landmark,
			city: editing.city,
			state: editing.state,
			pincode: editing.pincode,
			phone: editing.phone
		});
	}, [editing]);
	const handleSave = (event) => {
		event.preventDefault();
		const cleaned = {
			...form,
			label: form.label.trim() || "Home",
			address: form.address.trim(),
			city: form.city.trim(),
			state: form.state.trim(),
			pincode: form.pincode.trim(),
			phone: form.phone.trim()
		};
		if (!cleaned.address || !cleaned.city || !cleaned.state || !cleaned.pincode || !cleaned.phone) return;
		setSaving(true);
		const next = [...addresses];
		if (editingId) {
			const index = next.findIndex((address) => address.id === editingId);
			if (index >= 0) next[index] = {
				...next[index],
				...cleaned
			};
			setEditingId(null);
		} else next.push({
			id: typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `${Date.now()}`,
			...cleaned,
			isDefault: next.length === 0
		});
		setAddresses(next);
		setSaving(false);
		setForm({ ...blankAddress });
	};
	const setDefaultAddress = (id) => {
		setAddresses((prev) => prev.map((address) => ({
			...address,
			isDefault: address.id === id
		})));
	};
	const removeAddress = (id) => {
		setAddresses((prev) => {
			const next = prev.filter((address) => address.id !== id);
			if (!next.some((address) => address.isDefault) && next.length > 0) next[0].isDefault = true;
			return next;
		});
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-5xl px-4 py-10 text-center text-muted-foreground",
			children: "Loading…"
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl px-4 py-16 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mx-auto h-12 w-12 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 font-serif text-3xl text-foreground",
					children: "Saved addresses require an account"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Please sign in to manage your delivery locations and speed up checkout."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							children: "Sign in"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/shop",
							children: "Browse products"
						})
					})]
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 py-10 md:px-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl text-foreground",
					children: "Saved Addresses"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Keep multiple delivery addresses for easy checkout."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary" }), "Your addresses are stored locally in your browser."]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-8 xl:grid-cols-[420px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSave,
					className: "rounded-3xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: editingId ? "Edit address" : "Add new address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Add a location for delivery and save it for later."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Label" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.label,
									onChange: (event) => setForm({
										...form,
										label: event.target.value
									}),
									placeholder: "Home, Office, Relative"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Address" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.address,
									onChange: (event) => setForm({
										...form,
										address: event.target.value
									}),
									placeholder: "Street, house number, area"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Landmark" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: form.landmark,
									onChange: (event) => setForm({
										...form,
										landmark: event.target.value
									}),
									placeholder: "Nearby landmark"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.city,
										onChange: (event) => setForm({
											...form,
											city: event.target.value
										}),
										placeholder: "City"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "State" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.state,
										onChange: (event) => setForm({
											...form,
											state: event.target.value
										}),
										placeholder: "State"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pincode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.pincode,
										onChange: (event) => setForm({
											...form,
											pincode: event.target.value
										}),
										placeholder: "Pin code"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: form.phone,
										onChange: (event) => setForm({
											...form,
											phone: event.target.value
										}),
										placeholder: "Mobile number"
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: saving,
								children: editingId ? "Update address" : "Save address"
							}), editingId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => {
									setEditingId(null);
									setForm({ ...blankAddress });
								},
								children: "Cancel"
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "space-y-6",
					children: addresses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-3xl border border-border bg-card p-10 text-center text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mx-auto h-12 w-12 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 text-xl text-foreground",
								children: "No saved addresses yet"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2",
								children: "Add your first delivery address to make checkout faster."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: addresses.map((address) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-3xl border border-border bg-card p-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm font-semibold text-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "h-4 w-4" }),
										address.label,
										address.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-primary/10 px-2 py-1 text-[11px] uppercase tracking-[0.3em] text-primary",
											children: "Default"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm text-muted-foreground leading-6",
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
										address.phone
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap gap-2",
									children: [
										!address.isDefault && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											onClick: () => setDefaultAddress(address.id),
											children: "Set default"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "secondary",
											onClick: () => {
												setEditingId(address.id);
											},
											children: "Edit"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => removeAddress(address.id),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})
									]
								})]
							})
						}, address.id))
					})
				})]
			})]
		})]
	});
}
//#endregion
export { Addresses as component };
