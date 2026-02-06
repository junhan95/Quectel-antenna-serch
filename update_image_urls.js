const fs = require('fs');
const path = require('path');

/**
 * Update antennas.json with image URLs based on available product images
 */
function updateAntennaImages() {
    console.log('Updating antenna data with image URLs...\n');

    // Paths
    const dataPath = './src/data/antennas.json';
    const productsDir = './public/images/products';
    const categoriesDir = './public/images/categories';

    // Load antenna data
    const antennas = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    console.log(`Loaded ${antennas.length} products from antennas.json`);

    // Get list of available product images
    let availableImages = [];
    if (fs.existsSync(productsDir)) {
        availableImages = fs.readdirSync(productsDir)
            .filter(f => f.match(/\.(png|jpg|jpeg)$/i))
            .map(f => path.parse(f).name);
    }
    console.log(`Found ${availableImages.length} product images`);

    // Category image mapping
    const categoryImages = {
        '5G antennas': '5g-antenna.png',
        '4G antennas': '4g-antenna.png',
        'GNSS antennas': 'gnss-antenna.png',
        'Wi-Fi antennas': 'wifi-antenna.png',
        'Combo antennas': 'combo-antenna.png',
        'LPWA/ISM antennas': 'lpwa-antenna.png',
        'L-Band & GNSS L1 & Iridium antennas': 'gnss-antenna.png',
        'UWB chip antennas': 'uwb-antenna.png'
    };

    // Update antenna data
    let withRealImages = 0;
    let withCategoryImages = 0;
    let withDefaultImages = 0;

    const updatedAntennas = antennas.map(antenna => {
        const hasImage = availableImages.includes(antenna.id);
        let imageUrl;
        let imageType;

        if (hasImage) {
            // Real product image available
            imageUrl = `/images/products/${antenna.id}.png`;
            imageType = 'product';
            withRealImages++;
        } else if (categoryImages[antenna.subcategory]) {
            // Use category placeholder
            imageUrl = `/images/categories/${categoryImages[antenna.subcategory]}`;
            imageType = 'category';
            withCategoryImages++;
        } else {
            // Use default placeholder
            imageUrl = `/images/categories/default-antenna.png`;
            imageType = 'default';
            withDefaultImages++;
        }

        return {
            ...antenna,
            imageUrl,
            imageType,
            hasRealImage: hasImage
        };
    });

    // Save updated data
    fs.writeFileSync(dataPath, JSON.stringify(updatedAntennas, null, 2));

    console.log('\n' + '='.repeat(50));
    console.log('Update complete!');
    console.log('='.repeat(50));
    console.log(`Products with real images:     ${withRealImages}`);
    console.log(`Products with category images: ${withCategoryImages}`);
    console.log(`Products with default images:  ${withDefaultImages}`);
    console.log(`Total products:                ${antennas.length}`);
    console.log('='.repeat(50));

    // Show some examples
    console.log('\nExample products with real images:');
    updatedAntennas
        .filter(a => a.hasRealImage)
        .slice(0, 5)
        .forEach(a => {
            console.log(`  ${a.id}: ${a.imageUrl}`);
        });
}

// Run the update
try {
    updateAntennaImages();
} catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
}
