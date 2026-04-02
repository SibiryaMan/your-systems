import { createBrowserClient } from '@supabase/ssr'

/**
 * Стандартный клиент Supabase для использования в Client Components ('use client')
 */
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )