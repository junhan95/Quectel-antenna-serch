/**
 * Separate Evaluation Board (EVB) Products
 * 
 * This script:
 * 1. Identifies all EVB products (ID contains 'EVB')
 * 2. Changes their category to 'Evaluation Boards'
 * 3. Keeps original subcategory for reference
 */

const fs = require('fs');
const path = require('path');

const ANTENNAS_PATH = path.join(__dirname, 'src', 'data', 'antennas.json');

// Load data
const antennas = JSON.parse(fs.readFileSync(ANTENNAS_PATH, 'utf-8'));

console.log('='.repeat(60));
console.log('SEPARATING EVALUATION BOARDS');
console.log('='.repeat(60));
console.log(`\nTotal products before: ${antennas.length}`);

// Count by category before
const catsBefore = {};
antennas.forEach(p => {
    catsBefore[p.category] = (catsBefore[p.category] || 0) + 1;
});
console.log('\nCategories before:');
Object.entries(catsBefore).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}`);
});

// Identify and update EVB products
let evbCount = 0;
antennas.forEach((product, index) => {
    if (product.id.toUpperCase().includes('EVB')) {
        const oldCategory = product.category;

        antennas[index].category = 'Evaluation Boards';

        console.log(`[EVB] ${product.id}: ${oldCategory} → Evaluation Boards`);
        evbCount++;
    }
});

// Count by category after
const catsAfter = {};
antennas.forEach(p => {
    catsAfter[p.category] = (catsAfter[p.category] || 0) + 1;
});

console.log('\n' + '-'.repeat(60));
console.log(`\nTotal EVB products moved: ${evbCount}`);
console.log('\nCategories after:');
Object.entries(catsAfter).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}`);
});

// Save updated data
fs.writeFileSync(ANTENNAS_PATH, JSON.stringify(antennas, null, 2));
console.log(`\n✅ Updated: ${ANTENNAS_PATH}`);
