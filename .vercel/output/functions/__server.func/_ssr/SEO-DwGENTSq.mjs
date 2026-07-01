import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Helmet } from "../_libs/react-helmet-async+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SEO-DwGENTSq.js
var import_jsx_runtime = require_jsx_runtime();
function SEO({ title = "SRI VENKETESWARA OIL MILL - Premium Wood Pressed Oils", description = "Discover the purest cold-pressed and wood-pressed oils. Buy premium dry fruits directly from SRI VENKETESWARA OIL MILL.", image = "/lovable-uploads/27fb6e0b-d2c6-4d2c-801c-6d149de1e604.png", url = "https://sriVENKETESWARAoilmill.com", type = "website", jsonLd }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Helmet, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("title", { children: title }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "title",
			content: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			name: "description",
			content: description
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
			rel: "canonical",
			href: url
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:type",
			content: type
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:url",
			content: url
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:title",
			content: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:description",
			content: description
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "og:image",
			content: image
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "twitter:card",
			content: "summary_large_image"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "twitter:url",
			content: url
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "twitter:title",
			content: title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "twitter:description",
			content: description
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("meta", {
			property: "twitter:image",
			content: image
		}),
		(jsonLd ? Array.isArray(jsonLd) ? jsonLd : [jsonLd] : [{
			"@context": "https://schema.org",
			"@type": "Organization",
			"name": "SRI VENKETESWARA OIL MILL",
			"url": "https://sriVENKETESWARAoilmill.com",
			"logo": "https://sriVENKETESWARAoilmill.com/lovable-uploads/27fb6e0b-d2c6-4d2c-801c-6d149de1e604.png"
		}]).map((schema, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
			type: "application/ld+json",
			children: JSON.stringify(schema)
		}, index))
	] });
}
//#endregion
export { SEO as t };
