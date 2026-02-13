const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config();

const app = express();
const PORT = 3001;

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://quectel-antenna.com').split(',').map(s => s.trim());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like curl, Postman, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Paths
const DATA_PATH = path.join(__dirname, 'src/data/antennas.json');
const BACKUP_DIR = path.join(__dirname, 'backups');
const IMAGES_DIR = path.join(__dirname, 'public/images/products');

// Ensure directories exist
async function ensureDirectories() {
    try {
        await fs.mkdir(BACKUP_DIR, { recursive: true });
        await fs.mkdir(IMAGES_DIR, { recursive: true });
    } catch (error) {
        console.error('Error creating directories:', error);
    }
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: IMAGES_DIR,
    filename: (req, file, cb) => {
        const productId = req.body.productId || 'temp';
        const ext = path.extname(file.originalname);
        cb(null, `${productId}${ext}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed'));
        }
    }
});

// ── Input Sanitization Helpers ──────────────────────────────────────────

/**
 * Strip HTML tags and trim whitespace to prevent XSS
 */
function sanitize(str, maxLength = 1000) {
    if (typeof str !== 'string') return '';
    return str.replace(/<[^>]*>/g, '').trim().slice(0, maxLength);
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper: Read products data
async function readProducts() {
    try {
        const data = await fs.readFile(DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading products:', error);
        throw error;
    }
}

// Helper: Write products data
async function writeProducts(products) {
    try {
        // Create backup before writing
        await createBackup();
        await fs.writeFile(DATA_PATH, JSON.stringify(products, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error('Error writing products:', error);
        throw error;
    }
}

// Helper: Create backup
async function createBackup() {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = path.join(BACKUP_DIR, `antennas_${timestamp}.json`);
        const data = await fs.readFile(DATA_PATH, 'utf8');
        await fs.writeFile(backupPath, data, 'utf8');

        // Clean old backups (keep last 10)
        const files = await fs.readdir(BACKUP_DIR);
        const backups = files
            .filter(f => f.startsWith('antennas_') && f.endsWith('.json'))
            .sort()
            .reverse();

        for (let i = 10; i < backups.length; i++) {
            await fs.unlink(path.join(BACKUP_DIR, backups[i]));
        }

        return backupPath;
    } catch (error) {
        console.error('Error creating backup:', error);
    }
}

// API Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const products = await readProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const product = products.find(p => p.id === req.params.id);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// Create new product
app.post('/api/products', async (req, res) => {
    try {
        const products = await readProducts();
        const newProduct = req.body;

        // Validate and sanitize required fields
        if (!newProduct.id || !newProduct.name) {
            return res.status(400).json({ error: 'ID and name are required' });
        }

        newProduct.id = sanitize(newProduct.id, 100);
        newProduct.name = sanitize(newProduct.name, 200);
        newProduct.description = sanitize(newProduct.description || '', 2000);
        newProduct.category = sanitize(newProduct.category || '', 100);
        newProduct.subcategory = sanitize(newProduct.subcategory || '', 100);

        // Check if ID already exists
        if (products.find(p => p.id === newProduct.id)) {
            return res.status(400).json({ error: 'Product ID already exists' });
        }

        // Add default fields
        newProduct.specs = newProduct.specs || {};
        newProduct.tags = newProduct.tags || [];
        newProduct.imageUrl = newProduct.imageUrl || '';
        newProduct.hasRealImage = newProduct.hasRealImage || false;

        products.push(newProduct);
        await writeProducts(products);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// Update product
app.put('/api/products/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const index = products.findIndex(p => p.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedProduct = { ...products[index], ...req.body };
        products[index] = updatedProduct;

        await writeProducts(products);
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/api/products/:id', async (req, res) => {
    try {
        const products = await readProducts();
        const index = products.findIndex(p => p.id === req.params.id);

        if (index === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const deletedProduct = products[index];
        products.splice(index, 1);

        await writeProducts(products);

        // Delete associated image if exists
        if (deletedProduct.imageUrl) {
            const imagePath = path.join(__dirname, 'public', deletedProduct.imageUrl);
            try {
                await fs.unlink(imagePath);
            } catch (err) {
                // Image might not exist, ignore error
            }
        }

        res.json({ message: 'Product deleted successfully', product: deletedProduct });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Upload image
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const productId = req.body.productId;
        const imageUrl = `/images/products/${req.file.filename}`;

        // Update product with new image URL
        if (productId) {
            const products = await readProducts();
            const product = products.find(p => p.id === productId);

            if (product) {
                product.imageUrl = imageUrl;
                product.hasRealImage = true;
                product.imageType = 'product';
                await writeProducts(products);
            }
        }

        res.json({
            message: 'Image uploaded successfully',
            imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Delete image
app.delete('/api/images/:filename', async (req, res) => {
    try {
        const imagePath = path.join(IMAGES_DIR, req.params.filename);
        await fs.unlink(imagePath);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete image' });
    }
});

// Export data
app.get('/api/export', async (req, res) => {
    try {
        const products = await readProducts();
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename=antennas_export.json');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to export data' });
    }
});

// Create manual backup
app.post('/api/backup', async (req, res) => {
    try {
        const backupPath = await createBackup();
        res.json({ message: 'Backup created successfully', path: backupPath });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create backup' });
    }
});

// Email configuration removed as per request


// Send inquiry email
// Send inquiry (Save to DB only)
app.post('/api/inquiry', async (req, res) => {
    try {
        const { name, company, email, phone, subject, message, to } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'Name, email, subject, and message are required' });
        }

        // Validate email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Sanitize all inputs
        const sanitizedData = {
            timestamp: new Date().toISOString(),
            name: sanitize(name, 100),
            company: sanitize(company || '', 200),
            email: sanitize(email, 200),
            phone: sanitize(phone || '', 30),
            subject: sanitize(subject, 300),
            message: sanitize(message, 5000),
            to: sanitize(to || 'admin', 50)
        };

        // Save inquiry to a file for record keeping
        const inquiriesPath = path.join(__dirname, 'inquiries.json');
        let inquiries = [];

        try {
            const data = await fs.readFile(inquiriesPath, 'utf8');
            inquiries = JSON.parse(data);
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }

        inquiries.push(sanitizedData);

        await fs.writeFile(inquiriesPath, JSON.stringify(inquiries, null, 2), 'utf8');

        console.log('✅ Inquiry saved successfully');

        res.json({
            message: 'Inquiry submitted successfully',
            success: true
        });
    } catch (error) {
        console.error('❌ Error processing inquiry:', error);
        res.status(500).json({
            error: 'Failed to submit inquiry',
            details: error.message
        });
    }
});

// Get all inquiries
app.get('/api/inquiries', async (req, res) => {
    try {
        const inquiriesPath = path.join(__dirname, 'inquiries.json');
        try {
            const data = await fs.readFile(inquiriesPath, 'utf8');
            const inquiries = JSON.parse(data);
            // Sort by timestamp (newest first)
            inquiries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            res.json(inquiries);
        } catch (error) {
            // If file doesn't exist, return empty array
            res.json([]);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
});

// Delete single inquiry by timestamp
app.delete('/api/inquiries/:timestamp', async (req, res) => {
    try {
        const inquiriesPath = path.join(__dirname, 'inquiries.json');
        const timestamp = req.params.timestamp;

        try {
            const data = await fs.readFile(inquiriesPath, 'utf8');
            let inquiries = JSON.parse(data);

            // Filter out the inquiry with matching timestamp
            const filteredInquiries = inquiries.filter(inq => inq.timestamp !== timestamp);

            if (filteredInquiries.length === inquiries.length) {
                return res.status(404).json({ error: 'Inquiry not found' });
            }

            await fs.writeFile(inquiriesPath, JSON.stringify(filteredInquiries, null, 2), 'utf8');
            res.json({ message: 'Inquiry deleted successfully' });
        } catch (error) {
            res.status(404).json({ error: 'No inquiries found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete inquiry' });
    }
});

// Delete multiple inquiries (or all if timestamps array is empty)
app.delete('/api/inquiries', async (req, res) => {
    try {
        const inquiriesPath = path.join(__dirname, 'inquiries.json');
        const { timestamps } = req.body;

        try {
            const data = await fs.readFile(inquiriesPath, 'utf8');
            let inquiries = JSON.parse(data);

            let filteredInquiries;
            if (!timestamps || timestamps.length === 0) {
                // Delete all inquiries
                filteredInquiries = [];
            } else {
                // Delete specific inquiries
                filteredInquiries = inquiries.filter(inq => !timestamps.includes(inq.timestamp));
            }

            await fs.writeFile(inquiriesPath, JSON.stringify(filteredInquiries, null, 2), 'utf8');

            const deletedCount = inquiries.length - filteredInquiries.length;
            res.json({
                message: `${deletedCount} inquiry(ies) deleted successfully`,
                deletedCount
            });
        } catch (error) {
            res.status(404).json({ error: 'No inquiries found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete inquiries' });
    }
});

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const products = await readProducts();
        const categories = new Set(products.map(p => p.category).filter(Boolean));
        const subcategories = new Set(products.map(p => p.subcategory).filter(Boolean));

        res.json({
            totalProducts: products.length,
            totalCategories: categories.size,
            totalSubcategories: subcategories.size,
            withImages: products.filter(p => p.hasRealImage).length,
            withoutImages: products.filter(p => !p.hasRealImage).length
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// Start server
ensureDirectories().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Admin API server running on http://localhost:${PORT}`);
        console.log(`📁 Data path: ${DATA_PATH}`);
        console.log(`💾 Backup directory: ${BACKUP_DIR}`);
        console.log(`🖼️  Images directory: ${IMAGES_DIR}`);
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
});
