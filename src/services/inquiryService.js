import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Submit a new inquiry
 */
export const submitInquiry = async (inquiry) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
        .from('inquiries')
        .insert({
            company: inquiry.company,
            email: inquiry.email,
            phone: inquiry.phone || null,
            product_id: inquiry.productId || null,
            message: inquiry.message
        })

    if (error) {
        console.error('Error submitting inquiry:', error)
        throw new Error(error.message)
    }

    return data
}

/**
 * Get all inquiries (admin only)
 */
export const getInquiries = async () => {
    if (!isSupabaseConfigured()) {
        return []
    }

    const { data, error } = await supabase
        .from('inquiries')
        .select(`
            *,
            product:products(id, name)
        `)
        .order('timestamp', { ascending: false })

    if (error) {
        console.error('Error fetching inquiries:', error)
        return []
    }

    return data.map(transformInquiryFromDB)
}

/**
 * Delete a single inquiry
 */
export const deleteInquiry = async (id) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured')
    }

    const { error } = await supabase
        .from('inquiries')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting inquiry:', error)
        throw new Error(error.message)
    }

    return true
}

/**
 * Delete multiple inquiries
 */
export const deleteInquiries = async (ids) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured')
    }

    const { error } = await supabase
        .from('inquiries')
        .delete()
        .in('id', ids)

    if (error) {
        console.error('Error deleting inquiries:', error)
        throw new Error(error.message)
    }

    return true
}

/**
 * Update inquiry status
 */
export const updateInquiryStatus = async (id, status) => {
    if (!isSupabaseConfigured()) {
        throw new Error('Supabase not configured')
    }

    const { data, error } = await supabase
        .from('inquiries')
        .update({ status })
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating inquiry status:', error)
        throw new Error(error.message)
    }

    return data
}

// Transform from database format to app format
const transformInquiryFromDB = (dbInquiry) => ({
    id: dbInquiry.id,
    company: dbInquiry.company,
    email: dbInquiry.email,
    phone: dbInquiry.phone,
    productId: dbInquiry.product_id,
    productName: dbInquiry.product?.name || null,
    message: dbInquiry.message,
    timestamp: dbInquiry.timestamp,
    status: dbInquiry.status
})
