/**
 * Advanced Image Matching and Fixing Script
 * 
 * This script applies multiple strategies to match products with images:
 * 1. Direct match: Product ID matches image filename exactly
 * 2. Base product match: EVB products can use their base product's image
 * 3. Extension variation: Try different file extensions (jpeg, jpg, png)
 * 4. Similar model match: Products with same base model number
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

// Create comprehensive image map (case-insensitive, multiple extensions)
const imageMap = new Map();
imageFiles.forEach(file => {
    const baseName = file.replace(/\.(jpeg|jpg|png|webp)$/i, '');
    const key = baseName.toUpperCase();
    if (!imageMap.has(key)) {
        imageMap.set(key, []);
    }
    imageMap.get(key).push(file);
});

console.log('='.repeat(80));
console.log('ADVANCED IMAGE MATCHING AND FIXING');
console.log('='.repeat(80));

let fixedCount = 0;
let alreadyCorrect = 0;
let stillMissing = 0;

// Process each product
antennas.forEach((product, index) => {
    const productId = product.id.toUpperCase();

    // Skip if already has real image
    if (product.hasRealImage) {
        alreadyCorrect++;
        return;
    }

    let matchedImage = null;
    let matchType = null;

    // Strategy 1: Direct match (case-insensitive)
    if (imageMap.has(productId)) {
        matchedImage = imageMap.get(productId)[0];
        matchType = 'direct';
    }

    // Strategy 2: EVB product → base product
    if (!matchedImage && productId.includes('EVB')) {
        // Try different EVB suffix patterns
        const basePatterns = [
            productId.replace(/EVB$/, ''),
            productId.replace(/EVBAA$/, ''),
            productId.replace(/EVBA$/, ''),
            productId.replace(/EVBB$/, ''),
        ];

        for (const baseId of basePatterns) {
            if (imageMap.has(baseId)) {
                matchedImage = imageMap.get(baseId)[0];
                matchType = 'base';
                break;
            }
        }
    }

    // Strategy 3: For non-EVB products, try to find related variant
    if (!matchedImage) {
        // Extract core product number (e.g., YC0018 from YC0018CA)
        const coreMatch = productId.match(/^([A-Z]+\d+)/);
        if (coreMatch) {
            const coreId = coreMatch[1];
            // Find any image that starts with this core ID
            for (const [imageId, files] of imageMap) {
                if (imageId.startsWith(coreId) && !imageId.includes('EVB')) {
                    matchedImage = files[0];
                    matchType = 'variant';
                    break;
                }
            }
        }
    }

    // Apply fix if match found
    if (matchedImage) {
        const newImageUrl = `/images/products/${matchedImage}`;

        console.log(`[FIX] ${product.id}`);
        console.log(`      Type: ${matchType}`);
        console.log(`      Old: ${product.imageUrl}`);
        console.log(`      New: ${newImageUrl}`);
        console.log('');

        antennas[index].imageUrl = newImageUrl;
        antennas[index].imageType = 'product';
        antennas[index].hasRealImage = true;
        fixedCount++;
    } else {
        stillMissing++;
        console.log(`[MISSING] ${product.id} - ${product.description || 'No description'}`);
    }
});

// Save updated data
fs.writeFileSync(ANTENNAS_PATH, JSON.stringify(antennas, null, 2));

console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`\nTotal products: ${antennas.length}`);
console.log(`Already had images: ${alreadyCorrect}`);
console.log(`Fixed in this run: ${fixedCount}`);
console.log(`Still missing images: ${stillMissing}`);
console.log(`\nUpdated: ${ANTENNAS_PATH}`);
