import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { _ as Pencil, g as Plus, j as Image, p as Search, s as Trash2, tt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { i as stringType, n as coerce, r as objectType, t as booleanType } from "../_libs/zod.mjs";
import { i as useForm, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-3HhpKDcy.mjs";
import { a as FormLabel, i as FormItem, n as FormControl, o as FormMessage, r as FormField, s as Switch, t as Form } from "./switch-C3WxrCzI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/products-CJbKpMUX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var productSchema = objectType({
	id: stringType().optional(),
	name: stringType().min(2, "Name must be at least 2 characters"),
	slug: stringType().min(2, "Slug must be at least 2 characters"),
	price: coerce.number().min(0, "Price must be positive"),
	stock: coerce.number().min(0, "Stock cannot be negative"),
	sku: stringType().min(2, "SKU is required"),
	description: stringType().optional(),
	is_active: booleanType().default(true)
});
function AdminProducts() {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [isDialogOpen, setIsDialogOpen] = (0, import_react.useState)(false);
	const [selectedProduct, setSelectedProduct] = (0, import_react.useState)(null);
	const [uploadingImage, setUploadingImage] = (0, import_react.useState)(false);
	const [imageUrl, setImageUrl] = (0, import_react.useState)("");
	const form = useForm({
		resolver: u(productSchema),
		defaultValues: {
			name: "",
			slug: "",
			price: 0,
			stock: 0,
			sku: "",
			description: "",
			is_active: true
		}
	});
	const fetchProducts = async () => {
		setLoading(true);
		const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
		if (error) toast.error("Failed to load products");
		else setProducts(data || []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchProducts();
	}, []);
	const openAddDialog = () => {
		setSelectedProduct(null);
		setImageUrl("");
		form.reset({
			name: "",
			slug: "",
			price: 0,
			stock: 0,
			sku: "",
			description: "",
			is_active: true
		});
		setIsDialogOpen(true);
	};
	const openEditDialog = (product) => {
		setSelectedProduct(product);
		setImageUrl(product.images?.[0] || "");
		form.reset({
			id: product.id,
			name: product.name,
			slug: product.slug,
			price: product.price,
			stock: product.stock,
			sku: product.sku,
			description: product.description || "",
			is_active: product.is_active ?? true
		});
		setIsDialogOpen(true);
	};
	const handleDelete = async (id) => {
		if (!confirm("Are you sure you want to delete this product?")) return;
		const { error } = await supabase.from("products").delete().eq("id", id);
		if (error) toast.error(error.message);
		else {
			toast.success("Product deleted successfully");
			fetchProducts();
		}
	};
	const handleImageUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploadingImage(true);
		const fileExt = file.name.split(".").pop();
		const filePath = `products/${`${Math.random().toString(36).substring(2)}.${fileExt}`}`;
		const { error: uploadError } = await supabase.storage.from("product-images").upload(filePath, file);
		if (uploadError) {
			toast.error("Error uploading image");
			setUploadingImage(false);
			return;
		}
		const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
		setImageUrl(data.publicUrl);
		setUploadingImage(false);
	};
	const onSubmit = async (values) => {
		const payload = {
			...values,
			images: imageUrl ? [imageUrl] : []
		};
		if (selectedProduct) {
			const { error } = await supabase.from("products").update(payload).eq("id", selectedProduct.id);
			if (error) toast.error(error.message);
			else toast.success("Product updated successfully");
		} else {
			const { error } = await supabase.from("products").insert([payload]);
			if (error) toast.error(error.message);
			else toast.success("Product created successfully");
		}
		setIsDialogOpen(false);
		fetchProducts();
	};
	const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Inventory Management"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Manage products, pricing, and stock levels."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openAddDialog,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Product"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search products by name or SKU...",
						className: "pl-9",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[80px]",
						children: "Image"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Product Name" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "SKU" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Price" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Stock" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "h-24 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" })
				}) }) : filteredProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "h-24 text-center text-muted-foreground",
					children: "No products found."
				}) }) : filteredProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: product.images?.[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.images[0],
						alt: product.name,
						className: "h-10 w-10 rounded-md object-cover border"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 rounded-md bg-muted flex items-center justify-center border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-4 w-4 text-muted-foreground" })
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: product.sku }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: ["₹", product.price] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: product.stock === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "destructive",
						children: "Out of Stock"
					}) : product.stock <= 5 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "destructive",
						className: "bg-amber-500 hover:bg-amber-600",
						children: ["Low: ", product.stock]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-green-600 font-medium",
						children: [product.stock, " in stock"]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: product.is_active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "default",
						className: "bg-green-100 text-green-800 hover:bg-green-100",
						children: "Active"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: "Hidden"
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-right space-x-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => openEditDialog(product),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							className: "text-destructive border-destructive/20 hover:bg-destructive/5",
							onClick: () => handleDelete(product.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})
				] }, product.id)) })] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDialogOpen,
				onOpenChange: setIsDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl max-h-[90vh] overflow-y-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: selectedProduct ? "Edit Product" : "Add New Product" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Form, {
						...form,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: form.handleSubmit(onSubmit),
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										control: form.control,
										name: "name",
										render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Product Name" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...field }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
										control: form.control,
										name: "slug",
										render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "URL Slug" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...field }) }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
										] })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "sku",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "SKU" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...field }) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "price",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Price (₹)" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													...field
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
											control: form.control,
											name: "stock",
											render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Stock Quantity" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													type: "number",
													...field
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
											] })
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									control: form.control,
									name: "description",
									render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, { children: "Description" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, { ...field }) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormMessage, {})
									] })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-sm font-medium",
										children: "Product Image"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [imageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: imageUrl,
											alt: "Preview",
											className: "h-20 w-20 rounded-md object-cover border"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-20 w-20 rounded-md bg-muted flex items-center justify-center border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Image, { className: "h-6 w-6 text-muted-foreground" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "file",
												accept: "image/*",
												onChange: handleImageUpload,
												disabled: uploadingImage
											}), uploadingImage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-muted-foreground mt-2 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Uploading..."]
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
									control: form.control,
									name: "is_active",
									render: ({ field }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FormItem, {
										className: "flex flex-row items-center justify-between rounded-lg border p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormLabel, {
												className: "text-base",
												children: "Visibility"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted-foreground",
												children: "Make this product visible in the store"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormControl, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: field.value,
											onCheckedChange: field.onChange
										}) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "outline",
										onClick: () => setIsDialogOpen(false),
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: uploadingImage,
										children: selectedProduct ? "Save Changes" : "Create Product"
									})]
								})
							]
						})
					})]
				})
			})
		]
	});
}
//#endregion
export { AdminProducts as component };
