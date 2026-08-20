import { supabase } from './supabase.js'

async function getCount(query) {
  const { count, error } = await query

  if (error) throw new Error(error.message)
  return count || 0
}

export async function getDashboardStats() {
  const [totalProducts, activeProducts, totalCategories, soldOutVariants] = await Promise.all([
    getCount(supabase.from('products').select('*', { count: 'exact', head: true })),
    getCount(supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true)),
    getCount(supabase.from('categories').select('*', { count: 'exact', head: true })),
    getCount(supabase.from('product_variants').select('*', { count: 'exact', head: true }).eq('is_sold_out', true)),
  ])

  return { activeProducts, soldOutVariants, totalCategories, totalProducts }
}
