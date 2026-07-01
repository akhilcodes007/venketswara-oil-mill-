import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { _ as Pencil, g as Plus, i as Truck, p as Search, s as Trash2, tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as stringType, r as objectType, t as booleanType } from "../_libs/zod.mjs";
import { i as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-3HhpKDcy.mjs";
import { a as FormLabel, i as FormItem, n as FormControl, o as FormMessage, r as FormField, s as Switch, t as Form } from "./switch-C3WxrCzI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/delivery-partners-DlHDrDxq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var schema = objectType({
	id: stringType().optional(),
	name: stringType().min(2, "Name is required"),
	mobile: stringType().min(10, "Valid mobile number is required"),
	vehicle_type: stringType().min(2, "Vehicle type is required"),
	vehicle_number: stringType().min(4, "Vehicle number is required"),
	is_active: booleanType().default(true)
});
function AdminDeliveryPartners() {
	const [partners, setPartners] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [selectedPartner, setSelectedPartner] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(schema),
		defaultValues: {
			name: "",
			mobile: "",
			vehicle_type: "",
			vehicle_number: "",
			is_active: true
		}
	});
	const fetchPartners = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("delivery_partners").select("*").order("created_at", { ascending: false });
		if (error) toast.error("Failed to load delivery partners");
		else setPartners(data || []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchPartners();
	}, []);
	const openAddDialog = () => {
		setSelectedPartner(null);
		form.reset({
			name: "",
			mobile: "",
			vehicle_type: "",
			vehicle_number: "",
			is_active: true
		});
		setIsDialogOpen(true);
	};
	const openEditDialog = (partner) => {
		setSelectedPartner(partner);
		form.reset({
			id: partner.id,
			name: partner.name,
			mobile: partner.mobile,
			vehicle_type: partner.vehicle_type,
			vehicle_number: partner.vehicle_number,
			is_active: partner.is_active ?? true
		});
		setIsDialogOpen(true);
	};
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this delivery partner? Note: If they have active deliveries, this will fail.")) return;
		const { error } = await supabase.from("delivery_partners").delete().eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success("Delivery partner deleted successfully");
			fetchPartners();
		}
	};
	const onSubmit = async (values) => {
		if (selectedPartner) {
			const { error } = await supabase.from("delivery_partners").update(values).eq("id", selectedPartner.id);
			if (error) toast.error(error.message);
			else toast.success("Delivery partner updated successfully");
		} else {
			const { error } = await supabase.from("delivery_partners").insert([values]);
			if (error) toast.error(error.message);
			else toast.success("Delivery partner created successfully");
		}
		setIsDialogOpen(false);
		fetchPartners();
	};
	const filtered = partners.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.mobile.includes(search) || p.vehicle_number.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Delivery Partners"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Manage your delivery fleet and personnel."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openAddDialog,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Partner"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by name, mobile or vehicle #...",
						className: "pl-9",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Partner Name" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Mobile" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Vehicle Details" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "h-24 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" })
				}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 5,
					className: "h-24 text-center text-muted-foreground",
					children: "No delivery partners found."
				}) }) : filtered.map((partner) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4" })
							}), partner.name]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: partner.mobile }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm font-medium",
						children: partner.vehicle_number
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground capitalize",
						children: partner.vehicle_type
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: partner.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "default",
						className: "bg-green-100 text-green-800 hover:bg-green-100",
						children: "Active"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Inactive"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right space-x-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => openEditDialog(partner),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "text-destructive border-destructive/20 hover:bg-destructive/5",
							onClick: () => handleDelete(partner.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})
				] }, partner.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: selectedPartner ? "Edit Delivery Partner" : "Add Delivery Partner" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, {
					...form,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: form.handleSubmit(onSubmit),
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								control: form.control,
								name: "name",
								render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Full Name" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...field }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
								] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								control: form.control,
								name: "mobile",
								render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Mobile Number" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...field }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
								] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									control: form.control,
									name: "vehicle_type",
									render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Vehicle Type" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "e.g. Van, Bike",
											...field
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									control: form.control,
									name: "vehicle_number",
									render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Vehicle Number" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "KA 01 AB 1234",
											...field
										}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
									] })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								control: form.control,
								name: "is_active",
								render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, {
									className: "flex flex-row items-center justify-between rounded-lg border p-4 mt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
											className: "text-base",
											children: "Active Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "Is this partner currently available?"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: field.value,
										onCheckedChange: field.onChange
									}) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-end gap-2 pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsDialogOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: selectedPartner ? "Save Changes" : "Create Partner"
								})]
							})
						]
					})
				})] })
			})
		]
	});
}
//#endregion
export { AdminDeliveryPartners as component };
