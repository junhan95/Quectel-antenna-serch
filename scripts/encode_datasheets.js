const fs = require('fs');

// Read the original file
const src = fs.readFileSync('src/data/datasheetLinks.js', 'utf-8');

// Extract all key-value pairs using regex
const entries = [];
const re = /"([^"]+)"\s*:\s*"([^"]+)"/g;
let m;
while ((m = re.exec(src)) !== null) {
    entries.push([m[1], m[2]]);
}

console.log('Found', entries.length, 'entries');

// Check if already encoded (Base64 URLs won't start with http)
const firstValue = entries[0]?.[1] || '';
if (!firstValue.startsWith('http')) {
    console.log('URLs appear to already be encoded. Skipping.');
    process.exit(0);
}

// Build new file with Base64-encoded URLs
let lines = [
    '// Auto-generated - URLs are Base64 encoded for protection',
    '// Decode with: atob(encodedUrl)',
    'const datasheetLinks = {'
];

entries.forEach(([key, url]) => {
    const encoded = Buffer.from(url).toString('base64');
    lines.push(`  "${key}": "${encoded}",`);
});

lines.push('};', '', 'export default datasheetLinks;', '');

fs.writeFileSync('src/data/datasheetLinks.js', lines.join('\n'), 'utf-8');
console.log('Encoded', entries.length, 'URLs to Base64');
