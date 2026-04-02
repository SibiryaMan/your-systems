import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * BUILD 3.5.5: STABLE DATA FETCHING
 * Очищено от конфликтующих заголовков кэширования Next.js
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== 'undefined',
    storageKey: 'yoursystems-auth-v2'
  },
  global: {
    fetch: (url, options) => 
      fetch(url, { 
        ...options, 
        cache: 'no-store' // Только этот параметр для динамических данных
      }),
  },
});

export const getFullCategoryTree = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, parent_id, name, slug, specs, icon')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase Query Error:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error('Network crash:', err);
    return [];
  }
};