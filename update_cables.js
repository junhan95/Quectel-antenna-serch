
const fs = require('fs');
const path = require('path');

const antennasPath = path.join(__dirname, 'src/data/antennas.json');
const antennas = require(antennasPath);

console.log('Original Total Antennas:', antennas.length);

let updatedCount = 0;

const updatedAntennas = antennas.map(antenna => {
    if (antenna.category === 'External antennas') {
        const isCable = (antenna.description && antenna.description.toLowerCase().includes('cable')) ||
            (antenna.name && antenna.name.toLowerCase().includes('cable'));

        if (isCable) {
            updatedCount++;
            return { ...antenna, category: 'Cables' };
        }
    }
    return antenna;
});

console.log(`Updated ${updatedCount} antennas to category 'Cables'.`);

fs.writeFileSync(antennasPath, JSON.stringify(updatedAntennas, null, 2), 'utf8');
console.log('antennas.json updated successfully.');
