// Fix image paths for GitHub Pages deployment
// Change absolute paths to relative paths that work with base path

const fs = require('fs');
const path = require('path');

const antennasPath = path.join(__dirname, 'src', 'data', 'antennas.json');
const antennas = JSON.parse(fs.readFileSync(antennasPath, 'utf8'));

// Update all image URLs to use relative paths
let updatedCount = 0;
antennas.forEach(antenna => {
    if (antenna.imageUrl && antenna.imageUrl.startsWith('/images/')) {
        // Remove leading slash to make it relative
        antenna.imageUrl = antenna.imageUrl.substring(1);
        updatedCount++;
    }
});

fs.writeFileSync(antennasPath, JSON.stringify(antennas, null, 2));

console.log(`✅ Updated ${updatedCount} image paths`);
console.log(`Images will now load from: images/products/...`);
