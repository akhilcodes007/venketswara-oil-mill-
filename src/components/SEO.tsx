import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

export function SEO({
  title = "SRI VENKETESWARA OIL MILL - Premium Wood Pressed Oils",
  description = "Discover the purest cold-pressed and wood-pressed oils. Buy premium dry fruits directly from SRI VENKETESWARA OIL MILL.",
  image = "/lovable-uploads/27fb6e0b-d2c6-4d2c-801c-6d149de1e604.png", // Company logo as default OG image
  url = "https://sriVENKETESWARAoilmill.com",
  type = "website",
  jsonLd,
}: SEOProps) {
  
  const defaultOrganizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SRI VENKETESWARA OIL MILL",
    "url": "https://sriVENKETESWARAoilmill.com",
    "logo": "https://sriVENKETESWARAoilmill.com/lovable-uploads/27fb6e0b-d2c6-4d2c-801c-6d149de1e604.png"
  };

  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [defaultOrganizationLd];

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* JSON-LD Structured Data */}
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
