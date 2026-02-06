
const antennas = require('./src/data/antennas.json');

const cablesCategory = antennas.filter(a => a.category === 'Cables');
const externalAntennas = antennas.filter(a => a.category === 'External antennas');

console.log(`count in 'Cables' category: ${cablesCategory.length}`);
console.log(`count in 'External antennas' category: ${externalAntennas.length}`);

// Check if any cables remain in External antennas
const remainingCables = externalAntennas.filter(a =>
    (a.description && a.description.toLowerCase().includes('cable')) ||
    (a.name && a.name.toLowerCase().includes('cable'))
);

if (remainingCables.length > 0) {
    console.error('ERROR: Some cable products remain in External antennas:');
    remainingCables.forEach(c => console.log(`- ${c.id}: ${c.name}`));
} else {
    console.log('SUCCESS: No cable products found in External antennas.');
}

// Check if all items in Cables category seem correct
const suspiciousCables = cablesCategory.filter(a =>
    !((a.description && a.description.toLowerCase().includes('cable')) ||
        (a.name && a.name.toLowerCase().includes('cable')))
);

if (suspiciousCables.length > 0) {
    console.warn('WARNING: Some items in Cables category might not be cables:');
    suspiciousCables.forEach(c => console.log(`- ${c.id}: ${c.name}`));
} else {
    console.log('SUCCESS: All items in Cables category appear to be cables.');
}
