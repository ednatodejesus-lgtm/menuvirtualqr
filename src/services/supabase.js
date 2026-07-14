// src/services/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database tables - All in English matching SQL
export const TABLES = {
  RESTAURANTES: 'restaurants',
  ADMINS: 'profiles',
  CATEGORIAS: 'categories',
  PRODUTOS: 'products',
  QR_CODES: 'qr_codes'
}