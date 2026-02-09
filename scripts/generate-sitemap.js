import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DATA_PATH = path.join(__dirname, '../src/data/antennas.json');
const PUBLIC_SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const BASE_URL = 'https://quectel-antenna.com';

// Read data
const antennas = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));

// Static routes
const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/#/inquiry', priority: '0.8', changefreq: 'monthly' } // Hash router format
];

// Generate XML
const generateSitemap = () => {
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static routes
    staticRoutes.forEach(route => {
        // Handle root specially if needed, but for hash router usually root is just /
        const loc = route.url === '/' ? BASE_URL + '/' : BASE_URL + route.url;

        xml += '  <url>\n';
        xml += `    <loc>${loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        xml += '  </url>\n';
    });

    // Add product routes (Hash router: /#/product/ID)
    antennas.forEach(antenna => {
        // Encode ID for URL safety
        const safeId = encodeURIComponent(antenna.id);
        const loc = `${BASE_URL}/#/product/${safeId}`;

        xml += '  <url>\n';
        xml += `    <loc>${loc}</loc>\n`;
        xml += `    <lastmod>${today}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.9</priority>\n`;
        xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
};

// Write file
const sitemapContent = generateSitemap();
fs.writeFileSync(PUBLIC_SITEMAP_PATH, sitemapContent);

console.log(`Sitemap generated with ${antennas.length + staticRoutes.length} URLs at ${PUBLIC_SITEMAP_PATH}`);
