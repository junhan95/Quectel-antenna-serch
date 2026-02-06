// Frequency band data extracted from Frequency table.xlsx
// Used for Detailed Search filtering

export const frequencyBands = {
    '5G NR': [
        { band: 'n1', uplink: '1920-1980', downlink: '2110-2170', mode: 'FDD' },
        { band: 'n2', uplink: '1850-1910', downlink: '1930-1990', mode: 'FDD' },
        { band: 'n3', uplink: '1710-1785', downlink: '1805-1880', mode: 'FDD' },
        { band: 'n5', uplink: '824-849', downlink: '869-894', mode: 'FDD' },
        { band: 'n7', uplink: '2500-2570', downlink: '2620-2690', mode: 'FDD' },
        { band: 'n8', uplink: '880-915', downlink: '925-960', mode: 'FDD' },
        { band: 'n12', uplink: '699-716', downlink: '729-746', mode: 'FDD' },
        { band: 'n13', uplink: '777-787', downlink: '746-756', mode: 'FDD' },
        { band: 'n14', uplink: '788-798', downlink: '758-768', mode: 'FDD' },
        { band: 'n18', uplink: '815-830', downlink: '860-875', mode: 'FDD' },
        { band: 'n20', uplink: '832-862', downlink: '791-821', mode: 'FDD' },
        { band: 'n24', uplink: '1626.5-1660.5', downlink: '1525-1559', mode: 'FDD' },
        { band: 'n25', uplink: '1850-1915', downlink: '1930-1995', mode: 'FDD' },
        { band: 'n26', uplink: '814-849', downlink: '859-894', mode: 'FDD' },
        { band: 'n28', uplink: '703-748', downlink: '758-803', mode: 'FDD' },
        { band: 'n29', uplink: null, downlink: '717-728', mode: 'SDL' },
        { band: 'n30', uplink: '2305-2315', downlink: '2350-2360', mode: 'FDD' },
        { band: 'n31', uplink: '452.5-457.5', downlink: '462.5-467.5', mode: 'FDD' },
        { band: 'n34', uplink: '2010-2025', downlink: null, mode: 'TDD' },
        { band: 'n38', uplink: '2570-2620', downlink: null, mode: 'TDD' },
        { band: 'n39', uplink: '1880-1920', downlink: null, mode: 'TDD' },
        { band: 'n40', uplink: '2300-2400', downlink: null, mode: 'TDD' },
        { band: 'n41', uplink: '2496-2690', downlink: null, mode: 'TDD' },
        { band: 'n46', uplink: '5150-5925', downlink: null, mode: 'TDD' },
        { band: 'n48', uplink: '3550-3700', downlink: null, mode: 'TDD' },
        { band: 'n50', uplink: '1432-1517', downlink: null, mode: 'TDD' },
        { band: 'n51', uplink: '1427-1432', downlink: null, mode: 'TDD' },
        { band: 'n53', uplink: '2483.5-2495', downlink: null, mode: 'TDD' },
        { band: 'n54', uplink: '1670-1675', downlink: null, mode: 'TDD' },
        { band: 'n65', uplink: '1920-2010', downlink: '2110-2200', mode: 'FDD' },
        { band: 'n66', uplink: '1710-1780', downlink: '2110-2200', mode: 'FDD' },
        { band: 'n67', uplink: null, downlink: '738-758', mode: 'SDL' },
        { band: 'n70', uplink: '1695-1710', downlink: '1995-2010', mode: 'FDD' },
        { band: 'n71', uplink: '663-698', downlink: '617-652', mode: 'FDD' },
        { band: 'n72', uplink: '451-456', downlink: '461-466', mode: 'FDD' },
        { band: 'n74', uplink: '1427-1470', downlink: '1475-1518', mode: 'FDD' },
        { band: 'n75', uplink: null, downlink: '1432-1517', mode: 'SDL' },
        { band: 'n76', uplink: null, downlink: '1427-1432', mode: 'SDL' },
        { band: 'n77', uplink: '3300-4200', downlink: null, mode: 'TDD' },
        { band: 'n78', uplink: '3300-3800', downlink: null, mode: 'TDD' },
        { band: 'n79', uplink: '4400-5000', downlink: null, mode: 'TDD' },
        { band: 'n80', uplink: '1710-1785', downlink: null, mode: 'SUL' },
        { band: 'n81', uplink: '880-915', downlink: null, mode: 'SUL' },
        { band: 'n82', uplink: '832-862', downlink: null, mode: 'SUL' },
        { band: 'n83', uplink: '703-748', downlink: null, mode: 'SUL' },
        { band: 'n84', uplink: '1920-1980', downlink: null, mode: 'SUL' },
        { band: 'n85', uplink: '698-716', downlink: '728-746', mode: 'FDD' },
        { band: 'n86', uplink: '1710-1780', downlink: null, mode: 'SUL' },
        { band: 'n89', uplink: '824-849', downlink: null, mode: 'SUL' },
        { band: 'n90', uplink: '2496-2690', downlink: null, mode: 'TDD' },
        { band: 'n91', uplink: '832-862', downlink: '1427-1432', mode: 'FDD' },
        { band: 'n92', uplink: '832-862', downlink: '1432-1517', mode: 'FDD' },
        { band: 'n93', uplink: '880-915', downlink: '1427-1432', mode: 'FDD' },
        { band: 'n94', uplink: '880-915', downlink: '1432-1517', mode: 'FDD' },
        { band: 'n95', uplink: '2010-2025', downlink: null, mode: 'SUL' },
        { band: 'n96', uplink: '5925-7125', downlink: null, mode: 'TDD' },
        { band: 'n97', uplink: '2300-2400', downlink: null, mode: 'SUL' },
        { band: 'n98', uplink: '1880-1920', downlink: null, mode: 'SUL' },
        { band: 'n99', uplink: '1626.5-1660.5', downlink: null, mode: 'SUL' },
        { band: 'n100', uplink: '874.4-880', downlink: '919.4-925', mode: 'FDD' },
        { band: 'n101', uplink: '1900-1910', downlink: null, mode: 'TDD' },
        { band: 'n102', uplink: '5925-6425', downlink: null, mode: 'TDD' },
        { band: 'n104', uplink: '6425-7125', downlink: null, mode: 'TDD' },
        { band: 'n105', uplink: '663-703', downlink: '612-652', mode: 'FDD' },
        { band: 'n106', uplink: '896-901', downlink: '935-940', mode: 'FDD' },
        { band: 'n109', uplink: '703-733', downlink: '1432-1517', mode: 'FDD' },
        { band: 'n257', uplink: '26500-29500', downlink: null, mode: 'TDD' },
        { band: 'n258', uplink: '24250-27500', downlink: null, mode: 'TDD' },
        { band: 'n259', uplink: '39500-43500', downlink: null, mode: 'TDD' },
        { band: 'n260', uplink: '37000-40000', downlink: null, mode: 'TDD' },
        { band: 'n261', uplink: '27500-28350', downlink: null, mode: 'TDD' },
        { band: 'n262', uplink: '47200-48200', downlink: null, mode: 'TDD' },
        { band: 'n263', uplink: '57000-71000', downlink: null, mode: 'TDD' },
    ],

    '4G LTE': [
        { band: 'b1', uplink: '1920-1980', downlink: '2110-2170', gap: '190' },
        { band: 'b2', uplink: '1850-1910', downlink: '1930-1990', gap: '80' },
        { band: 'b3', uplink: '1710-1785', downlink: '1805-1880', gap: '95' },
        { band: 'b4', uplink: '1710-1755', downlink: '2110-2155', gap: '400' },
        { band: 'b5', uplink: '824-849', downlink: '869-894', gap: '45' },
        { band: 'b6', uplink: '830-840', downlink: '875-885', gap: '45' },
        { band: 'b7', uplink: '2500-2570', downlink: '2620-2690', gap: '120' },
        { band: 'b8', uplink: '880-915', downlink: '925-960', gap: '45' },
        { band: 'b9', uplink: '1749.9-1784.9', downlink: '1844.9-1879.9', gap: '95' },
        { band: 'b10', uplink: '1710-1770', downlink: '2110-2170', gap: '400' },
        { band: 'b11', uplink: '1427.9-1447.9', downlink: '1475.9-1495.9', gap: '48' },
        { band: 'b12', uplink: '699-716', downlink: '729-746', gap: '30' },
        { band: 'b13', uplink: '777-787', downlink: '746-756', gap: '-31' },
        { band: 'b14', uplink: '788-798', downlink: '758-768', gap: '-30' },
        { band: 'b17', uplink: '704-716', downlink: '734-746', gap: '30' },
        { band: 'b18', uplink: '815-830', downlink: '860-875', gap: '45' },
        { band: 'b19', uplink: '830-845', downlink: '875-890', gap: '45' },
        { band: 'b20', uplink: '832-862', downlink: '791-821', gap: '-41' },
        { band: 'b21', uplink: '1447.9-1462.9', downlink: '1495.9-1510.9', gap: '48' },
        { band: 'b22', uplink: '3410-3490', downlink: '3510-3590', gap: '100' },
        { band: 'b23', uplink: '2000-2020', downlink: '2180-2200', gap: '180' },
        { band: 'b24', uplink: '1626.5-1660.5', downlink: '1525-1559', gap: '-101.5' },
        { band: 'b25', uplink: '1850-1915', downlink: '1930-1995', gap: '80' },
        { band: 'b26', uplink: '814-849', downlink: '859-894', gap: '45' },
        { band: 'b27', uplink: '807-824', downlink: '852-869', gap: '45' },
        { band: 'b28', uplink: '703-748', downlink: '758-803', gap: '55' },
        { band: 'b29', uplink: null, downlink: '717-728', gap: 'SDL' },
        { band: 'b30', uplink: '2305-2315', downlink: '2350-2360', gap: '45' },
        { band: 'b31', uplink: '452.5-457.5', downlink: '462.5-467.5', gap: '10' },
        { band: 'b32', uplink: null, downlink: '1452-1496', gap: 'SDL' },
        { band: 'b33', uplink: '1900-1920', downlink: null, gap: 'TDD' },
        { band: 'b34', uplink: '2010-2025', downlink: null, gap: 'TDD' },
        { band: 'b35', uplink: '1850-1910', downlink: null, gap: 'TDD' },
        { band: 'b36', uplink: '1930-1990', downlink: null, gap: 'TDD' },
        { band: 'b37', uplink: '1910-1930', downlink: null, gap: 'TDD' },
        { band: 'b38', uplink: '2570-2620', downlink: null, gap: 'TDD' },
        { band: 'b39', uplink: '1880-1920', downlink: null, gap: 'TDD' },
        { band: 'b40', uplink: '2300-2400', downlink: null, gap: 'TDD' },
        { band: 'b41', uplink: '2496-2690', downlink: null, gap: 'TDD' },
        { band: 'b42', uplink: '3400-3600', downlink: null, gap: 'TDD' },
        { band: 'b43', uplink: '3600-3800', downlink: null, gap: 'TDD' },
        { band: 'b44', uplink: '703-803', downlink: null, gap: 'TDD' },
        { band: 'b45', uplink: '1447-1467', downlink: null, gap: 'TDD' },
        { band: 'b46', uplink: '5150-5925', downlink: null, gap: 'TDD' },
        { band: 'b47', uplink: '5855-5925', downlink: null, gap: 'TDD' },
        { band: 'b48', uplink: '3550-3700', downlink: null, gap: 'TDD' },
        { band: 'b49', uplink: '3550-3700', downlink: null, gap: 'TDD' },
        { band: 'b50', uplink: '1432-1517', downlink: null, gap: 'TDD' },
        { band: 'b51', uplink: '1427-1432', downlink: null, gap: 'TDD' },
        { band: 'b52', uplink: '3300-3400', downlink: null, gap: 'TDD' },
        { band: 'b53', uplink: '2483.5-2495', downlink: null, gap: 'TDD' },
        { band: 'b54', uplink: '1670-1675', downlink: null, gap: 'TDD' },
        { band: 'b65', uplink: '1920-2010', downlink: '2110-2200', gap: '190' },
        { band: 'b66', uplink: '1710-1780', downlink: '2110-2200', gap: '400' },
        { band: 'b67', uplink: null, downlink: '738-758', gap: 'SDL' },
        { band: 'b68', uplink: '698-728', downlink: '753-783', gap: '55' },
        { band: 'b69', uplink: null, downlink: '2570-2620', gap: 'SDL' },
        { band: 'b70', uplink: '1695-1710', downlink: '1995-2020', gap: '300' },
        { band: 'b71', uplink: '663-698', downlink: '617-652', gap: '-46' },
        { band: 'b72', uplink: '451-456', downlink: '461-466', gap: '10' },
        { band: 'b73', uplink: '450-455', downlink: '460-465', gap: '10' },
        { band: 'b74', uplink: '1427-1470', downlink: '1475-1518', gap: '48' },
        { band: 'b75', uplink: null, downlink: '1432-1517', gap: 'SDL' },
        { band: 'b76', uplink: null, downlink: '1427-1432', gap: 'SDL' },
        { band: 'b85', uplink: '698-716', downlink: '728-746', gap: '30' },
        { band: 'b87', uplink: '410-415', downlink: '420-425', gap: '10' },
        { band: 'b88', uplink: '412-417', downlink: '422-427', gap: '10' },
        { band: 'b103', uplink: '787-788', downlink: '757-758', gap: '-30' },
        { band: 'b107', uplink: null, downlink: '612-652', gap: 'SDO' },
        { band: 'b108', uplink: null, downlink: '470-698', gap: 'SDO' },
    ],

    'NB-IoT': [
        { band: 'band 1', uplink: '1920-1980', downlink: '2110-2170', gap: '190' },
        { band: 'band 2', uplink: '1850-1910', downlink: '1930-1990', gap: '80' },
        { band: 'band 3', uplink: '1710-1785', downlink: '1805-1880', gap: '95' },
        { band: 'band 4', uplink: '1710-1755', downlink: '2110-2155', gap: '400' },
        { band: 'band 5', uplink: '824-849', downlink: '869-894', gap: '45' },
        { band: 'band 7', uplink: '2500-2570', downlink: '2620-2690', gap: '120' },
        { band: 'band 8', uplink: '880-915', downlink: '925-960', gap: '45' },
        { band: 'band 11', uplink: '1427.9-1447.9', downlink: '1475.9-1495.9', gap: '48' },
        { band: 'band 12', uplink: '699-716', downlink: '729-746', gap: '30' },
        { band: 'band 13', uplink: '777-787', downlink: '746-756', gap: '-31' },
        { band: 'band 14', uplink: '788-798', downlink: '758-768', gap: '-30' },
        { band: 'band 17', uplink: '704-716', downlink: '734-746', gap: '30' },
        { band: 'band 18', uplink: '815-830', downlink: '860-875', gap: '45' },
        { band: 'band 19', uplink: '830-845', downlink: '875-890', gap: '45' },
        { band: 'band 20', uplink: '832-862', downlink: '791-821', gap: '-41' },
        { band: 'band 21', uplink: '1447.9-1462.9', downlink: '1495.9-1510.9', gap: '48' },
        { band: 'band 24', uplink: '1626.5-1660.5', downlink: '1525-1559', gap: '-101.5' },
        { band: 'band 25', uplink: '1850-1915', downlink: '1930-1995', gap: '80' },
        { band: 'band 26', uplink: '814-849', downlink: '859-894', gap: '45' },
        { band: 'band 28', uplink: '703-748', downlink: '758-803', gap: '55' },
        { band: 'band 31', uplink: '452.5-457.5', downlink: '462.5-467.5', gap: '10' },
        { band: 'band 41', uplink: '2496-2690', downlink: null, gap: 'TDD' },
        { band: 'band 42', uplink: '3400-3600', downlink: null, gap: 'TDD' },
        { band: 'band 43', uplink: '3600-3800', downlink: null, gap: 'TDD' },
        { band: 'band 65', uplink: '1920-2010', downlink: '2110-2200', gap: '190' },
        { band: 'band 66', uplink: '1710-1780', downlink: '2110-2200', gap: '400' },
        { band: 'band 70', uplink: '1695-1710', downlink: '1995-2020', gap: '300' },
        { band: 'band 71', uplink: '663-698', downlink: '617-652', gap: '-46' },
        { band: 'band 72', uplink: '451-456', downlink: '461-466', gap: '10' },
        { band: 'band 73', uplink: '450-455', downlink: '460-465', gap: '10' },
        { band: 'band 74', uplink: '1427-1470', downlink: '1475-1518', gap: '48' },
        { band: 'band 85', uplink: '698-716', downlink: '728-746', gap: '30' },
        { band: 'band 87', uplink: '410-415', downlink: '420-425', gap: '10' },
        { band: 'band 88', uplink: '412-417', downlink: '422-427', gap: '10' },
        { band: 'band 90', uplink: '2496-2690', downlink: null, gap: null },
        { band: 'band 103', uplink: '787-788', downlink: '757-758', gap: '-30' },
    ],

    'WiFi': [
        { band: '802.11a', frequency: '5150-5875' },        // 5 GHz only
        { band: '802.11b', frequency: '2400-2500' },        // 2.4 GHz only
        { band: '802.11g', frequency: '2400-2500' },        // 2.4 GHz only
        { band: '802.11n', frequencies: ['2400-2500', '5150-5875'] }, // Dual-band: 2.4 GHz + 5 GHz
        { band: '802.11ac', frequency: '5150-5875' },       // 5 GHz only
        { band: '802.11ad', frequency: '57000-66000' },     // 60 GHz (WiGig)
        { band: '802.11af', frequency: '54-790' },          // TV White Space
        { band: '802.11ah', frequency: '902-928' },         // Sub-1 GHz (HaLow)
        { band: '802.11ax', frequencies: ['2400-2500', '5150-5875', '5925-7125'] }, // Wi-Fi 6/6E: 2.4+5+6 GHz
    ],

    'GPS': [
        { band: 'L1', frequency: '1560-1590' },             // L1: 1575.42 MHz ±15 MHz
        { band: 'L2', frequency: '1215-1240' },             // L2: 1227.6 MHz ±12 MHz
        { band: 'L5', frequency: '1165-1190' },             // L5: 1176.45 MHz ±12 MHz
    ],
}

// Helper function to get all frequency ranges for a band
export function getBandFrequencyRanges(bandData) {
    const ranges = []

    if (bandData.uplink) {
        const [min, max] = bandData.uplink.split('-').map(parseFloat)
        ranges.push({ min, max })
    }
    if (bandData.downlink) {
        const [min, max] = bandData.downlink.split('-').map(parseFloat)
        ranges.push({ min, max })
    }
    if (bandData.frequency) {
        const parts = bandData.frequency.split('-').map(parseFloat)
        if (parts.length === 2) {
            ranges.push({ min: parts[0], max: parts[1] })
        } else {
            // Single frequency - should not happen after GPS update
            ranges.push({ min: parts[0], max: parts[0] })
        }
    }
    // Handle dual-band WiFi (frequencies array) - antenna must support ANY ONE of the bands
    if (bandData.frequencies) {
        // For dual-band, we treat it as "any one range is sufficient"
        // This is handled specially in the matching logic
        bandData.frequencies.forEach(freqStr => {
            const parts = freqStr.split('-').map(parseFloat)
            if (parts.length === 2) {
                ranges.push({ min: parts[0], max: parts[1], optional: true })
            }
        })
    }

    return ranges
}

// Parse antenna frequency range string into array of {min, max} objects
export function parseAntennaFrequencyRange(freqString) {
    if (!freqString) return []

    const ranges = []
    // Handle various formats: "698-960 MHz", "698–960 MHz", "698-960 MHz, 1710-2690 MHz"
    const segments = freqString.split(/[,;]/).map(s => s.trim())

    for (const segment of segments) {
        // Extract numbers from the segment
        const numbers = segment.match(/[\d.]+/g)
        if (numbers && numbers.length >= 2) {
            ranges.push({
                min: parseFloat(numbers[0]),
                max: parseFloat(numbers[1])
            })
        }
    }

    return ranges
}

// Check if antenna supports a specific band
export function antennaSupportsFrequency(antennaRanges, bandRanges) {
    // Separate required and optional ranges
    const requiredRanges = bandRanges.filter(r => !r.optional)
    const optionalRanges = bandRanges.filter(r => r.optional)

    // For required ranges (all cellular bands), ALL must be supported
    for (const bandRange of requiredRanges) {
        let supported = false
        for (const antennaRange of antennaRanges) {
            // Band is supported if its range falls within antenna's range
            if (antennaRange.min <= bandRange.min && antennaRange.max >= bandRange.max) {
                supported = true
                break
            }
        }
        if (!supported) return false
    }

    // For optional ranges (dual-band WiFi), at least ONE must be supported
    if (optionalRanges.length > 0) {
        let anySupported = false
        for (const bandRange of optionalRanges) {
            for (const antennaRange of antennaRanges) {
                if (antennaRange.min <= bandRange.min && antennaRange.max >= bandRange.max) {
                    anySupported = true
                    break
                }
            }
            if (anySupported) break
        }
        if (!anySupported) return false
    }

    return true
}
