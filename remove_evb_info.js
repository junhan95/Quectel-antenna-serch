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
            // distinct patterns
            // 1. "Antenna: ..., EVB: ..." -> preserve "Antenna: ..." (or just remove EVB part)
            // The user asked to remove "EVB: contents".

            if (dim.includes('EVB:')) {
                // Regex to remove ", EVB: ..." or "EVB: ..."
                // Handles cases like "Antenna: 20 x 10 x 3 mm, EVB: 60 x 20 x 0.8 mm"
                // We want to keep "Antenna: 20 x 10 x 3 mm" ideally?
                // Or maybe the user implies removing "Antenna: " as well since it's redundant if EVB is gone?
                // Let's safe bet: Remove ", EVB:.*"

                const originalDim = dim;
                dim = dim.replace(/,\s*EVB:.*$/, ''); // Remove ", EVB: ..." at the end
                dim = dim.replace(/EVB:.*$/, ''); // Remove "EVB: ..." if it's not preceded by comma (start of string or otherwise)

                // Cleanup logic: If "Antenna: " is present and EVB is gone, it might be cleaner to remove "Antenna: " too?
                // But user instruction was specific to EVB. I will stick to removing EVB part.

                // Trimming whitespace
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
