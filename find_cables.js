
const fs = require('fs');
const antennas = require('./src/data/antennas.json');

const externalAntennas = antennas.filter(a => a.category === 'External antennas');
console.log('Total External Antennas:', externalAntennas.length);

const cableProducts = externalAntennas.filter(a =>
    (a.description && a.description.toLowerCase().includes('cable')) ||
    (a.name && a.name.toLowerCase().includes('cable'))
);

console.log('Cable Products found:', cableProducts.length);
cableProducts.forEach(a => {
    console.log(`${a.id}: ${a.name} - ${a.description}`);
});
