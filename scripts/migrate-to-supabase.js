/**
 * Migration script to import existing products to Supabase
 * 
 * Usage:
 * 1. Set up environment variables in .env.local
 * 2. Run: node scripts/migrate-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials')
    console.log('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Transform product from JSON format to database format
const transformProduct = (product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    specs: product.specs || {},
    tags: product.tags || [],
    image_url: product.imageUrl,
    image_type: product.imageType,
    has_real_image: product.hasRealImage || false
})

async function migrate() {
    console.log('🚀 Starting migration to Supabase...')

    // Load antenna data
    const antennasPath = join(__dirname, '..', 'src', 'data', 'antennas.json')
    const antennasData = JSON.parse(readFileSync(antennasPath, 'utf8'))

    console.log(`📦 Found ${antennasData.length} products to migrate`)

    // Transform all products
    const products = antennasData.map(transformProduct)

    // Insert in batches of 100
    const batchSize = 100
    let inserted = 0
    let errors = 0

    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize)

        const { data, error } = await supabase
            .from('products')
            .upsert(batch, { onConflict: 'id' })

        if (error) {
            console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error.message)
            errors += batch.length
        } else {
            inserted += batch.length
            console.log(`✅ Inserted batch ${i / batchSize + 1} (${inserted}/${products.length})`)
        }
    }

    console.log('')
    console.log('='.repeat(50))
    console.log(`✅ Migration complete!`)
    console.log(`   - Inserted: ${inserted}`)
    console.log(`   - Errors: ${errors}`)
    console.log('='.repeat(50))
}

migrate().catch(console.error)
