import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials!')
  console.log('SUPABASE_URL:', supabaseUrl)
  console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// TABLES com nomes corretos (em INGLÊS como no banco)
export const TABLES = {
  RESTAURANTS: 'restaurants',
  PROFILES: 'profiles',
  CATEGORIES: 'categories',
  PRODUCTS: 'products',
  QR_CODES: 'qr_codes'
}

