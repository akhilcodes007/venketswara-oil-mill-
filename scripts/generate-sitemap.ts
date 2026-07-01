import fs from 'fs';
import path from 'path';
import { PRODUCTS } from '../src/lib/products';

const SITE_URL = 'https://sriVENKETESWARAoilmill.com';

const routes = [
  '/',
  '/shop',
  '/heritage',
  '/auth',
];

async function generateSitemap() {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (route) => `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
${PRODUCTS.map(
  (product) => `  <url>
    <loc>${SITE_URL}/shop#${product.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`
).join('\n')}
</urlset>`;

  fs.writeFileSync(path.resolve(process.cwd(), 'public/sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully at public/sitemap.xml');
}

generateSitemap();
