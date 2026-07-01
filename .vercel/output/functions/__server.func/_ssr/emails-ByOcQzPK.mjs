import { o as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client--XIMi9ld.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-PJVP9td7.mjs";
import { $ as TriangleAlert, m as RefreshCw, p as Search, tt as LoaderCircle, w as Mail } from "../_libs/lucide-react.mjs";
import { r as format } from "../_libs/date-fns.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-C0WYWEQX.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/emails-ByOcQzPK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AdminEmails() {
	const [logs, setLogs] = (0, import_react.useState)([]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchLogs = async () => {
		setLoading(true);
		let query = supabase.from("email_logs").select("*").order("created_at", { ascending: false });
		if (statusFilter !== "all") query = query.eq("status", statusFilter);
		const { data, error } = await query;
		if (error) toast.error("Failed to load email logs");
		else setLogs(data || []);
		setLoading(false);
	};
	(0, import_react.useEffect)(() => {
		fetchLogs();
	}, [statusFilter]);
	const handleRetry = async (log) => {
		if (log.attempts >= 5) {
			toast.error("Maximum retry attempts (5) reached.");
			return;
		}
		toast.info("Retrying email...");
		const { data, error } = await supabase.functions.invoke("process-email", { body: { record: log } });
		if (error) toast.error(`Retry failed: ${error.message}`);
		else if (data?.error) toast.error(`Retry failed: ${data.error}`);
		else toast.success("Email sent successfully!");
		fetchLogs();
	};
	const filtered = logs.filter((l) => l.recipient?.toLowerCase().includes(search.toLowerCase()) || l.subject?.toLowerCase().includes(search.toLowerCase()) || l.template?.toLowerCase().includes(search.toLowerCase()));
	const getStatusBadge = (status) => {
		switch (status) {
			case "sent": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-green-100 text-green-800 hover:bg-green-100 border-none",
				children: "Sent"
			});
			case "failed": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-red-100 text-red-800 hover:bg-red-100 border-none",
				children: "Failed"
			});
			case "processing": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-none",
				children: "Processing"
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "secondary",
				className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none",
				children: "Pending"
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Email Logs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted-foreground",
					children: "Monitor automated emails and retry failures."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: fetchLogs,
					variant: "outline",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), " Refresh"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search recipient, subject, or template...",
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
							variant: statusFilter === "sent" ? "default" : "outline",
							size: "sm",
							onClick: () => setStatusFilter("sent"),
							children: "Sent"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: statusFilter === "failed" ? "default" : "outline",
							size: "sm",
							onClick: () => setStatusFilter("failed"),
							children: "Failed"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border bg-white",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Recipient" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Template & Subject" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Attempts" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Created / Sent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-right",
						children: "Actions"
					})
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "h-24 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin mx-auto text-muted-foreground" })
				}) }) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 6,
					className: "h-24 text-center text-muted-foreground",
					children: "No email logs found."
				}) }) : filtered.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "font-medium",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), log.recipient]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium text-sm",
						children: log.template
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground truncate max-w-[250px]",
						title: log.subject,
						children: log.subject
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-1 items-start",
						children: [getStatusBadge(log.status), log.status === "failed" && log.error_message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] text-red-600 flex items-center max-w-[150px] truncate",
							title: log.error_message,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3 mr-1 inline" }),
								" ",
								log.error_message
							]
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: log.attempts >= 5 ? "text-red-500 font-bold" : "",
						children: [log.attempts, " / 5"]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						className: "text-xs text-muted-foreground space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["C: ", format(new Date(log.created_at), "MMM d, HH:mm")] }), log.sent_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["S: ", format(new Date(log.sent_at), "MMM d, HH:mm")] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						className: "text-right",
						children: log.status === "failed" && log.attempts < 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => handleRetry(log),
							children: "Retry"
						})
					})
				] }, log.id)) })] })
			})
		]
	});
}
//#endregion
export { AdminEmails as component };
