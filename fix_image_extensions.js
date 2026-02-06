/**
 * Fix Image URL Extension Mismatches
 * 
 * Problem: Many products have imageUrl with .png but actual files are .jpeg
 * Solution: Check actual files and update imageUrl to match real extension
 */

const fs = require('fs');
const path = require('path');

const ANTENNAS_PATH = path.join(__dirname, 'src', 'data', 'antennas.json');
const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'products');

// Load data
const antennas = JSON.parse(fs.readFileSync(ANTENNAS_PATH, 'utf-8'));
const imageFiles = fs.readdirSync(IMAGES_DIR).filter(f =>
    /\.(jpeg|jpg|png|webp)$/i.test(f)
);

// Create map: base name (uppercase) -> actual filename
const imageMap = new Map();
imageFiles.forEach(file => {
    const baseName = file.replace(/\.(jpeg|jpg|png|webp)$/i, '').toUpperCase();
    imageMap.set(baseName, file);
});

console.log('='.repeat(60));
console.log('FIXING IMAGE URL EXTENSIONS');
console.log('='.repeat(60));
console.log(`\nImage files available: ${imageFiles.length}`);
console.log(`Products to check: ${antennas.length}`);

let fixedCount = 0;
let missingCount = 0;

antennas.forEach((product, index) => {
    if (!product.imageUrl || !product.imageUrl.includes('/products/')) {
        return; // Skip category images
    }

    const currentFile = path.basename(product.imageUrl);
    const baseName = currentFile.replace(/\.(jpeg|jpg|png|webp)$/i, '').toUpperCase();

    if (imageMap.has(baseName)) {
        const actualFile = imageMap.get(baseName);
        const correctUrl = `/images/products/${actualFile}`;

        if (product.imageUrl !== correctUrl) {
            console.log(`[FIX] ${product.id}`);
            console.log(`      ${product.imageUrl}`);
            console.log(`   -> ${correctUrl}`);

            antennas[index].imageUrl = correctUrl;
            antennas[index].hasRealImage = true;
            antennas[index].imageType = 'product';
            fixedCount++;
        }
    } else {
        console.log(`[MISSING] ${product.id}: No image file for ${baseName}`);
        missingCount++;
    }
});

// Save
fs.writeFileSync(ANTENNAS_PATH, JSON.stringify(antennas, null, 2));

console.log('\n' + '='.repeat(60));
console.log('SUMMARY');
console.log('='.repeat(60));
console.log(`Fixed: ${fixedCount} products`);
console.log(`Missing files: ${missingCount} products`);
console.log(`\n✅ Updated: ${ANTENNAS_PATH}`);
