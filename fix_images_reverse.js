/**
 * Final Image Fix - Reverse EVB Matching
 * 
 * For products without images, try to use their EVB version's image
 */

const fs = require('fs');
const path = require('path');

const ANTENNAS_PATH = path.join(__dirname, 'src', 'data', 'antennas.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'products');

const antennas = JSON.parse(fs.readFileSync(ANTENNAS_PATH, 'utf-8'));
const imageFiles = fs.readdirSync(IMAGES_DIR).filter(f =>
    /\.(jpeg|jpg|png|webp)$/i.test(f)
);

// Create image map
const imageMap = new Map();
imageFiles.forEach(file => {
    const baseName = file.replace(/\.(jpeg|jpg|png|webp)$/i, '').toUpperCase();
    if (!imageMap.has(baseName)) {
        imageMap.set(baseName, file);
    }
});

let fixedCount = 0;

// Process products without images
antennas.forEach((product, index) => {
    if (product.hasRealImage) return;

    const productId = product.id.toUpperCase();

    // Try to find EVB version's image
    const evbPatterns = [
        productId + 'EVB',
        productId + 'EVBA',
        productId + 'EVBAA',
        productId.replace(/AA$/, 'AAEVB'),
        productId.replace(/WWA$/, 'WWAEVB'),
        productId.replace(/WWB$/, 'WWBEVB'),
    ];

    for (const evbId of evbPatterns) {
        if (imageMap.has(evbId)) {
            const matchedImage = imageMap.get(evbId);
            console.log(`[FIX] ${product.id} → using EVB image: ${matchedImage}`);

            antennas[index].imageUrl = `/images/products/${matchedImage}`;
            antennas[index].imageType = 'product';
            antennas[index].hasRealImage = true;
            fixedCount++;
            break;
        }
    }
});

fs.writeFileSync(ANTENNAS_PATH, JSON.stringify(antennas, null, 2));

console.log(`\nFixed ${fixedCount} additional products`);

// Final count
const withImages = antennas.filter(p => p.hasRealImage).length;
const withoutImages = antennas.filter(p => !p.hasRealImage);
console.log(`\nFinal status:`);
console.log(`- With images: ${withImages}`);
console.log(`- Without images: ${withoutImages.length}`);

if (withoutImages.length > 0) {
    console.log('\nRemaining products without images:');
    withoutImages.forEach(p => console.log(`  - ${p.id}`));
}
