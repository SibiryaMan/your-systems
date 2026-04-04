import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Клиент строго для браузерных компонентов (use client)
export const createClient = () => createBrowserClient(supabaseUrl, supabaseAnonKey)

/**
 * Функция для получения категорий на КЛИЕНТЕ
 */
export const getCategoriesClient = async () => {
  const supabase = createClient()
  const { data } = await supabase
    .from('categories')
    .select('*')
    .is('parent_id', null)
  return data || []
}