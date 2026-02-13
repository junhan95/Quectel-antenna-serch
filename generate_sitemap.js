const fs = require('fs');
const data = require('./antennas.json');

const today = new Date().toISOString().split('T')[0];
const ids = data.map(a => a.id);

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://quectel-antenna.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://quectel-antenna.com/inquiry</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;

ids.forEach(id => {
  xml += `  <url>
    <loc>https://quectel-antenna.com/product/${id}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
`;
});

xml += `</urlset>
`;

fs.writeFileSync('public/sitemap.xml', xml);
console.log(`Sitemap generated with ${ids.length + 2} URLs (no hash fragments)`);
