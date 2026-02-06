const fs = require('fs');
const path = require('path');

const antennasPath = path.join(__dirname, 'src/data/antennas.json');

try {
    const rawData = fs.readFileSync(antennasPath, 'utf8');
    let antennas = JSON.parse(rawData);
    let modifiedCount = 0;

    antennas = antennas.map(antenna => {
        if (antenna.specs && antenna.specs.Dimensions) {
            let dim = antenna.specs.Dimensions;
            const originalDim = dim;

            // Remove "Antenna: " prefix (case-insensitive just in case)
            // Also trim any leading/trailing whitespace
            if (dim.match(/^Antenna:\s*/i)) {
                dim = dim.replace(/^Antenna:\s*/i, '');
                dim = dim.trim();

                if (originalDim !== dim) {
                    antenna.specs.Dimensions = dim;
                    modifiedCount++;
                    console.log(`Modified ${antenna.id}: "${originalDim}" -> "${dim}"`);
                }
            }
        }
        return antenna;
    });

    if (modifiedCount > 0) {
        fs.writeFileSync(antennasPath, JSON.stringify(antennas, null, 2), 'utf8');
        console.log(`Successfully modified ${modifiedCount} entries.`);
    } else {
        console.log('No modifications needed.');
    }

} catch (error) {
    console.error('Error processing file:', error);
}
