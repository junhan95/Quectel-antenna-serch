/**
 * Image Analysis and Matching Script
 * 
 * This script:
 * 1. Identifies products without images (hasRealImage: false)
 * 2. Checks available images in the products folder
 * 3. Attempts to match products with available images using various strategies
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

// Create a map of available images (without extension)
const imageMap = new Map();
imageFiles.forEach(file => {
  const baseName = file.replace(/\.(jpeg|jpg|png|webp)$/i, '');
  imageMap.set(baseName.toUpperCase(), { baseName, file });
});

console.log('='.repeat(80));
console.log('IMAGE ANALYSIS REPORT');
console.log('='.repeat(80));
console.log(`\nTotal products: ${antennas.length}`);
console.log(`Total image files: ${imageFiles.length}`);

// Find products without real images
const productsWithoutImages = antennas.filter(p => !p.hasRealImage);
const productsWithImages = antennas.filter(p => p.hasRealImage);

console.log(`\nProducts WITH real images: ${productsWithImages.length}`);
console.log(`Products WITHOUT real images: ${productsWithoutImages.length}`);

// Check for direct matches (product ID matches image filename)
console.log('\n' + '-'.repeat(80));
console.log('PRODUCTS WITHOUT IMAGES - ANALYSIS');
console.log('-'.repeat(80));

const matchResults = {
  directMatch: [],      // Exact ID match with available image
  baseProductMatch: [], // EVB products that can use base product image
  similarMatch: [],     // Similar product name found
  noMatch: []           // No matching image found
};

productsWithoutImages.forEach(product => {
  const productId = product.id.toUpperCase();
  
  // Strategy 1: Direct match
  if (imageMap.has(productId)) {
    matchResults.directMatch.push({
      product,
      matchedImage: imageMap.get(productId).file
    });
    return;
  }
  
  // Strategy 2: For EVB products, try to find base product image
  if (productId.endsWith('EVB')) {
    const baseId = productId.replace(/EVB$/, '');
    if (imageMap.has(baseId)) {
      matchResults.baseProductMatch.push({
        product,
        baseProductId: baseId,
        matchedImage: imageMap.get(baseId).file
      });
      return;
    }
    // Also try with different EVB suffixes
    const altBaseId = productId.replace(/EVBAA$/, '').replace(/EVBA$/, '');
    if (altBaseId !== baseId && imageMap.has(altBaseId)) {
      matchResults.baseProductMatch.push({
        product,
        baseProductId: altBaseId,
        matchedImage: imageMap.get(altBaseId).file
      });
      return;
    }
  }
  
  // Strategy 3: Try to find similar product (same prefix with different suffix)
  const prefix = productId.replace(/[A-Z]{0,3}(EVB)?$/i, '');
  let found = false;
  for (const [imageId, imageData] of imageMap) {
    if (imageId.startsWith(prefix) && imageId.length <= productId.length + 3) {
      matchResults.similarMatch.push({
        product,
        prefix,
        matchedImage: imageData.file
      });
      found = true;
      break;
    }
  }
  
  if (!found) {
    matchResults.noMatch.push(product);
  }
});

// Report results
console.log('\n## 1. Direct Matches Available (Image exists but not linked):');
if (matchResults.directMatch.length > 0) {
  matchResults.directMatch.forEach(({ product, matchedImage }) => {
    console.log(`   - ${product.id} → ${matchedImage}`);
  });
} else {
  console.log('   (None)');
}

console.log('\n## 2. EVB products that can use base product image:');
if (matchResults.baseProductMatch.length > 0) {
  matchResults.baseProductMatch.forEach(({ product, baseProductId, matchedImage }) => {
    console.log(`   - ${product.id} → base: ${baseProductId} → ${matchedImage}`);
  });
} else {
  console.log('   (None)');
}

console.log('\n## 3. Similar products with available images:');
if (matchResults.similarMatch.length > 0) {
  matchResults.similarMatch.forEach(({ product, prefix, matchedImage }) => {
    console.log(`   - ${product.id} (prefix: ${prefix}) → ${matchedImage}`);
  });
} else {
  console.log('   (None)');
}

console.log('\n## 4. No matching image found:');
if (matchResults.noMatch.length > 0) {
  matchResults.noMatch.forEach(product => {
    console.log(`   - ${product.id} (${product.description || 'No description'})`);
  });
} else {
  console.log('   (None)');
}

// Summary
console.log('\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`\nDirect matches available: ${matchResults.directMatch.length}`);
console.log(`EVB products (can use base image): ${matchResults.baseProductMatch.length}`);
console.log(`Similar products found: ${matchResults.similarMatch.length}`);
console.log(`No match available: ${matchResults.noMatch.length}`);

// Check for images that are not used by any product
console.log('\n' + '-'.repeat(80));
console.log('UNUSED IMAGES');
console.log('-'.repeat(80));

const usedImages = new Set();
antennas.forEach(p => {
  if (p.imageUrl && p.imageUrl.includes('/products/')) {
    const imageName = path.basename(p.imageUrl).replace(/\.(jpeg|jpg|png|webp)$/i, '').toUpperCase();
    usedImages.add(imageName);
  }
});

const unusedImages = [];
imageFiles.forEach(file => {
  const baseName = file.replace(/\.(jpeg|jpg|png|webp)$/i, '').toUpperCase();
  if (!usedImages.has(baseName) && !baseName.startsWith('UNKNOWN') && !baseName.startsWith('MULTI')) {
    unusedImages.add(file);
  }
});

console.log(`\nUnused images (excluding UNKNOWN/MULTI): ${unusedImages.size || 0}`);
if (unusedImages.size > 0) {
  [...unusedImages].slice(0, 20).forEach(img => console.log(`   - ${img}`));
  if (unusedImages.size > 20) {
    console.log(`   ... and ${unusedImages.size - 20} more`);
  }
}

// Output JSON for potential automatic fixing
const fixableProducts = [
  ...matchResults.directMatch.map(({ product, matchedImage }) => ({
    id: product.id,
    type: 'direct',
    newImageUrl: `/images/products/${matchedImage}`
  })),
  ...matchResults.baseProductMatch.map(({ product, matchedImage }) => ({
    id: product.id,
    type: 'base',
    newImageUrl: `/images/products/${matchedImage}`
  }))
];

fs.writeFileSync(
  path.join(__dirname, 'fixable_images.json'),
  JSON.stringify(fixableProducts, null, 2)
);

console.log(`\n\nFixable products saved to: fixable_images.json (${fixableProducts.length} products)`);
