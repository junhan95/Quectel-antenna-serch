import { supabase, isSupabaseConfigured } from '../lib/supabase'
import antennasData from '../data/antennas.json'

/**
 * Get all products
 * Falls back to local JSON if Supabase is not configured
 */
export const getProducts = async () => {
    if (!isSupabaseConfigured()) {
        return antennasData
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id')

    if (error) {
        console.error('Error fetching products:', error)
        // Fallback to local data
        return antennasData
    }

    return data.map(transformProductFromDB)
}

/**
 * Get a single product by ID
 */
export const getProductById = async (id) => {
    if (!isSupabaseConfigured()) {
        return antennasData.find(p => p.id === id) || null
    }

    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching product:', error)
        return null
    }

    return transformProductFromDB(data)
}

/**
 * Create a new product
 */
export const createProduct = async (product) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured')
    }

    const dbProduct = transformProductToDB(product)

    const { data, error } = await supabase
        .from('products')
        .insert(dbProduct)
        .select()
        .single()

    if (error) {
        console.error('Error creating product:', error)
        throw new Error(error.message)
    }

    return transformProductFromDB(data)
}

/**
 * Update an existing product
 */
export const updateProduct = async (id, product) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured')
    }

    const dbProduct = transformProductToDB(product)

    const { data, error } = await supabase
        .from('products')
        .update(dbProduct)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating product:', error)
        throw new Error(error.message)
    }

    return transformProductFromDB(data)
}

/**
 * Delete a product
 */
export const deleteProduct = async (id) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured')
    }

    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting product:', error)
        throw new Error(error.message)
    }

    return true
}

/**
 * Get product statistics
 */
export const getProductStats = async () => {
    const products = await getProducts()

    const categories = new Set(products.map(p => p.category).filter(Boolean))
    const subcategories = new Set(products.map(p => p.subcategory).filter(Boolean))
    const withImages = products.filter(p => p.hasRealImage).length

    return {
        totalProducts: products.length,
        totalCategories: categories.size,
        totalSubcategories: subcategories.size,
        withImages,
        withoutImages: products.length - withImages
    }
}

// Transform from database format to app format
const transformProductFromDB = (dbProduct) => ({
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    category: dbProduct.category,
    subcategory: dbProduct.subcategory,
    specs: dbProduct.specs || {},
    tags: dbProduct.tags || [],
    imageUrl: dbProduct.image_url,
    imageType: dbProduct.image_type,
    hasRealImage: dbProduct.has_real_image
})

// Transform from app format to database format
const transformProductToDB = (product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    category: product.category,
    subcategory: product.subcategory,
    specs: product.specs || {},
    tags: product.tags || [],
    image_url: product.imageUrl,
    image_type: product.imageType,
    has_real_image: product.hasRealImage
})
