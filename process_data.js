const fs = require('fs');

const rawText = fs.readFileSync('raw_text.txt', 'utf-8');
const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const products = [];

// Helper to check if a line looks like a product name
// Quectel names: YC0018CA, YPCS001AA, YF0017FA, etc.
// Usually starts with Y, followed by letters/numbers. Length usually 8-15 chars.
function isProductName(line) {
    // Avoid confusion with some headers or noise
    if (line.includes(' ')) return false;
    if (line === 'Compliant') return false;
    // Y followed by at least 5 alphanumeric chars
    return /^Y[A-Za-z0-9_]{5,20}$/.test(line);
}

// Key headers to look for in specs
const keys = [
    "Frequency range", "Efficiency", "Peak gain",
    "Radiation pattern", "Polarization", "Dimensions",
    "Form factor", "Mounting type", "Connector type", "Cable type", "Cable length",
    "Operation temperature", "Impedance", "VSWR",
    "Radome material", "Ingress protection", "Installation method", "Mounting"
];

let i = 0;
let currentCategory = "Unknown";
let currentSubCategory = "Unknown";

// Helper to generate tags based on product data
function generateTags(product) {
    const tags = new Set();

    // Add hierarchical tags
    if (product.category && product.category !== 'Unknown') tags.add(product.category);
    if (product.subcategory && product.subcategory !== 'Unknown') tags.add(product.subcategory);

    // Extract useful keywords from Description
    const descLower = (product.description || "").toLowerCase();
    if (descLower.includes('5g')) tags.add('5G');
    if (descLower.includes('4g')) tags.add('4G');
    if (descLower.includes('gnss')) tags.add('GNSS');
    if (descLower.includes('wifi')) tags.add('Wi-Fi');
    if (descLower.includes('combo')) tags.add('Combo');
    if (descLower.includes('ism')) tags.add('ISM');
    if (descLower.includes('lpwa')) tags.add('LPWA');
    if (descLower.includes('uwb')) tags.add('UWB');
    if (descLower.includes('lora')) tags.add('LoRa');
    if (descLower.includes('nb-iot')) tags.add('NB-IoT');

    // Extract tags from Specs
    if (product.specs) {
        if (product.specs['Mounting type']) tags.add(product.specs['Mounting type']);
        else if (product.specs['Mounting']) tags.add(product.specs['Mounting']);
        else if (product.specs['Installation method']) tags.add(product.specs['Installation method']);

        if (product.specs['Form factor']) tags.add(product.specs['Form factor']);
        if (product.specs['Polarization']) tags.add(product.specs['Polarization']);
        if (product.specs['Connector type']) tags.add(product.specs['Connector type']);

        // Add frequency bands if identifiable? Maybe too distinct.
    }

    // Clean up tags
    return Array.from(tags).map(t => t.replace(/;/g, '').trim()).filter(t => t.length > 0);
}

while (i < lines.length) {
    const line = lines[i];

    // 1. Detect Category Headers
    // Format: "Category  |  Subcategory" (Note: raw text might have spaces/pipes)
    // Example: "Embedded antennas  |  5G antennas"
    if (line.includes('|')) {
        const parts = line.split('|').map(s => s.trim());
        if (parts.length >= 2) {
            // Validate if it looks like a header (check keywords)
            if (parts[0].toLowerCase().includes('antennas') || parts[1].toLowerCase().includes('antennas')) {
                currentCategory = parts[0];
                currentSubCategory = parts[1];
                i++;
                continue;
            }
        }
    }

    // 2. Look for Data Blocks to anchor product search
    if (line === 'Electrical data') {
        // We found a data block. Search BACKWARDS for product names belonging to this block.
        // There can be Main Product AND EVB sharing the same data.

        let foundIndices = [];
        // Look back up to 50 lines.
        // Stop at 'Electrical data' (prev block), 'Mechanical data', or Category headers.
        for (let j = i - 1; j >= Math.max(0, i - 50); j--) {
            if (lines[j] === 'Electrical data' || lines[j] === 'Mechanical data') break;
            if (lines[j].includes('|') && lines[j].includes('antennas')) break;

            if (isProductName(lines[j])) {
                foundIndices.push(j);
            }
        }

        // foundIndices now has products in REVERSE order of appearance (closest to Electrical Data first)
        // e.g. [EVB_Index, MainProduct_Index]

        if (foundIndices.length > 0) {
            // 3. Extract Specs (Forward from 'Electrical data')
            const specs = {};
            let specK = i + 1;
            let currentKey = null;

            while (specK < lines.length && specK < i + 100) {
                const subLine = lines[specK];

                // Stop conditions
                if (isProductName(subLine) && !subLine.match(/^[0-9]+$/)) break; // Next product
                if (subLine === 'Electrical data') break; // Next block
                if (subLine === 'Mechanical data') { specK++; continue; } // Skip header but continue
                if (subLine.includes('|') && subLine.includes('antennas')) break; // Next category
                if (subLine.match(/^[0-9]{2}$/) && subLine.length === 2) break; // Page number

                // Check for keys
                // Some keys might be "Mounting" or "Mounting type"
                const matchedKey = keys.find(key => {
                    return subLine === key || subLine.startsWith(key + ":") || subLine.startsWith(key + " ");
                });

                if (matchedKey) {
                    currentKey = matchedKey;

                    // Check if value is on the same line
                    // e.g. "Peak gain: 3.5 dBi"
                    let val = "";
                    if (subLine.includes(matchedKey) && subLine.length > matchedKey.length + 2) {
                        val = subLine.substring(matchedKey.length).replace(/^[:\s]+/, '').trim();
                    }

                    if (val) {
                        specs[currentKey] = val;
                        // Don't continue, maybe next line is continuation?
                        // Usually not for single line values.
                    }
                    specK++;
                    continue;
                }

                if (currentKey) {
                    // It's a value (or continuation) for the currentKey
                    if (!specs[currentKey]) {
                        specs[currentKey] = subLine;
                    } else {
                        // If it looks like a new key but we missed it, don't append.
                        // But we already checked keys above.

                        // Heuristic: If it's short and looks like a value, append.
                        specs[currentKey] += " " + subLine;
                    }
                }
                specK++;
            }

            // 4. Process Each Product Found
            // We iterate foundIndices (which is backwards) so we can look 'forward' for descriptions relative to each name?
            // Actually, descriptions are usually AFTER the name.

            // Let's sort indices to process in order of appearance
            foundIndices.sort((a, b) => a - b);

            for (let idx = 0; idx < foundIndices.length; idx++) {
                const nameIndex = foundIndices[idx];
                const name = lines[nameIndex];

                // Description Search
                // Description is between THIS name and:
                // - The NEXT product name (if any)
                // - OR 'Electrical data' (which is at 'i')
                // - OR 'Compatible with...'
                // - OR 'EVB' labels

                let limitIndex = i; // Default limit is the start of data block
                if (idx < foundIndices.length - 1) {
                    limitIndex = foundIndices[idx + 1]; // Limit is next product
                }

                let description = "";
                for (let descK = nameIndex + 1; descK < limitIndex; descK++) {
                    const l = lines[descK];

                    if (l === 'EVB' || l.startsWith('EVB ')) continue;
                    if (l.includes('Compliant')) continue;
                    if (l.includes('RoHS') || l.includes('REACH')) continue;
                    if (l.includes('Compatible with')) continue;

                    description += (description.length > 0 ? " " : "") + l;
                }

                // Logic for EVB Description Fallback
                if (name.includes('EVB') || name.endsWith('_A')) { // _A often denotes variant/EVB
                    if (!description || description.length < 5) {
                        // Try to inherit from main product if possible?
                        // Or just say "Evaluation Board"
                        description = "Evaluation Board for " + name.replace(/EVB.*$/, '');
                    }
                }

                const product = {
                    id: name,
                    name: name,
                    description: description.trim(),
                    category: currentCategory,
                    subcategory: currentSubCategory,
                    specs: { ...specs },
                    tags: []
                };

                product.tags = generateTags(product);

                // Add to list if unique
                if (!products.find(p => p.id === product.id)) {
                    products.push(product);
                }
            }
        }
    }
    i++;
}

console.log(`Extracted ${products.length} products.`);
fs.writeFileSync('antennas.json', JSON.stringify(products, null, 2));
