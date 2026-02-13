/**
 * Post-build script: Generate static HTML files for all SPA routes
 * 
 * GitHub Pages returns HTTP 404 for paths without actual files.
 * Google's crawler refuses to index pages with 404 status codes.
 * 
 * This script copies dist/index.html into each route directory so
 * GitHub Pages returns HTTP 200, and the React SPA takes over routing.
 * 
 * FOR PRODUCT PAGES: Injects product-specific <title>, <meta>, JSON-LD,
 * and <noscript> content so that search engine crawlers can see product
 * information without executing JavaScript.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Load antenna data to get all product IDs
const antennasData = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'src', 'data', 'antennas.json'), 'utf-8')
);

// Static routes (non-product pages)
const staticRoutes = ['inquiry', 'admin', 'policy'];

// Product routes
const productIds = antennasData.map(p => p.id);

/**
 * Escape HTML special characters to prevent injection
 */
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/**
 * Escape string for use inside JSON (inside a <script> tag)
 */
function escapeJsonString(str) {
    if (!str) return '';
    return str.replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e');
}

/**
 * Generate product-specific HTML by injecting SEO tags into the base index.html
 */
function generateProductHtml(product) {
    const { id, name, description, category, subcategory, specs, imageUrl } = product;
    const canonicalUrl = `https://quectel-antenna.com/product/${id}`;

    // Build SEO title & description
    const seoTitle = `${escapeHtml(name)} - Quectel ${escapeHtml(subcategory || category)} Antenna | quectel-antenna.com`;

    let seoDesc = escapeHtml(description || '');
    if (specs?.['Frequency range']) {
        seoDesc += ` Frequency: ${escapeHtml(specs['Frequency range'])}.`;
    }
    if (specs?.['Mounting type']) {
        seoDesc += ` Mounting: ${escapeHtml(specs['Mounting type'])}.`;
    }
    seoDesc += ' Get a quote or datasheet from Quectel authorized distributor.';

    // Build keywords
    const keywords = [
        name, 'Quectel', '퀵텔', category, subcategory,
        'antenna', '안테나', 'datasheet', 'specifications'
    ].filter(Boolean).map(escapeHtml).join(', ');

    const ogImage = imageUrl || 'https://quectel-antenna.com/favicon.jpeg';

    // Product JSON-LD structured data
    const productJsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": name,
        "description": description || '',
        "brand": {
            "@type": "Brand",
            "name": "Quectel"
        },
        "category": `${category}${subcategory ? ' > ' + subcategory : ''}`,
        "url": canonicalUrl,
        ...(imageUrl ? { "image": imageUrl } : {}),
        ...(specs ? {
            "additionalProperty": Object.entries(specs).map(([key, value]) => ({
                "@type": "PropertyValue",
                "name": key,
                "value": value
            }))
        } : {})
    };

    // BreadcrumbList JSON-LD
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://quectel-antenna.com/"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": category,
                "item": `https://quectel-antenna.com/?category=${encodeURIComponent(category)}`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": name,
                "item": canonicalUrl
            }
        ]
    };

    // Build noscript HTML content (visible to crawlers that don't execute JS)
    let noscriptSpecs = '';
    if (specs) {
        const specRows = Object.entries(specs)
            .map(([k, v]) => `<tr><td>${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`)
            .join('');
        noscriptSpecs = `<table><thead><tr><th>Specification</th><th>Value</th></tr></thead><tbody>${specRows}</tbody></table>`;
    }

    const noscriptBlock = `
    <noscript>
      <div style="max-width:900px;margin:0 auto;padding:2rem;font-family:sans-serif;">
        <nav><a href="/">Home</a> / <a href="/?category=${encodeURIComponent(category)}">${escapeHtml(category)}</a> / ${escapeHtml(name)}</nav>
        <h1>${escapeHtml(name)} - Quectel ${escapeHtml(subcategory || category)} Antenna</h1>
        <p>${escapeHtml(description || '')}</p>
        ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="Quectel ${escapeHtml(name)} ${escapeHtml(subcategory || category)} antenna" width="400"/>` : ''}
        <h2>Technical Specifications</h2>
        ${noscriptSpecs}
        <p><a href="/inquiry?productId=${encodeURIComponent(id)}">Get a Quote / Inquiry</a></p>
        <p><a href="/">Browse All Quectel Antennas</a></p>
      </div>
    </noscript>`;

    // SEO meta tags to inject into <head>
    const seoMetaTags = `
    <!-- Product-specific SEO (generated by generate_static_pages.js) -->
    <title>${seoTitle}</title>
    <meta name="description" content="${seoDesc}" />
    <meta name="keywords" content="${keywords}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <meta property="og:type" content="product" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:title" content="${seoTitle}" />
    <meta property="og:description" content="${seoDesc}" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:locale" content="ko_KR" />
    <meta property="og:site_name" content="Quectel Antenna Search" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seoTitle}" />
    <meta name="twitter:description" content="${seoDesc}" />
    <meta name="twitter:image" content="${escapeHtml(ogImage)}" />
    <script type="application/ld+json">${JSON.stringify(productJsonLd)}</script>
    <script type="application/ld+json">${JSON.stringify(breadcrumbJsonLd)}</script>`;

    // Inject: replace the generic <title> and add product SEO tags
    let html = indexHtml;

    // Remove the generic <title> tag so we can replace it
    html = html.replace(/<title>.*?<\/title>/i, '');

    // Remove generic <meta name="description"> too
    html = html.replace(/<meta\s+name="description"[\s\S]*?>/i, '');

    // Remove generic <meta name="keywords"> too
    html = html.replace(/<meta\s+name="keywords"[\s\S]*?>/i, '');

    // Insert product-specific SEO tags right before </head>
    html = html.replace('</head>', `${seoMetaTags}\n</head>`);

    // Insert noscript block right after <div id="root">...</div>
    html = html.replace('</body>', `${noscriptBlock}\n</body>`);

    return html;
}

// ── Main ──────────────────────────────────────────────────────────────

console.log(`📄 Generating static pages for ${staticRoutes.length} static routes...`);

// Create static route directories (these keep the generic index.html)
for (const route of staticRoutes) {
    const routeDir = path.join(distDir, route);
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(path.join(routeDir, 'index.html'), indexHtml);
    console.log(`  ✅ /${route}/index.html`);
}

console.log(`📄 Generating SEO-optimized pages for ${productIds.length} products...`);

// Create product route directories with product-specific HTML
let count = 0;
for (const product of antennasData) {
    const productDir = path.join(distDir, 'product', product.id);
    fs.mkdirSync(productDir, { recursive: true });

    const productHtml = generateProductHtml(product);
    fs.writeFileSync(path.join(productDir, 'index.html'), productHtml);
    count++;
}

console.log(`  ✅ ${count} SEO-optimized product pages generated`);
console.log(`\n🎉 Total: ${staticRoutes.length + count} static pages created`);
console.log('   Each product page now has unique <title>, <meta>, JSON-LD, and <noscript> content!');
