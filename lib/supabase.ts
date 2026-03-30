import { createClient } from '@supabase/supabase-js';

// Инициализация клиента Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Универсальная функция получения категорий для YourSystems v2.6.7
 * Забирает плоский список всех категорий для последующей фильтрации в Sidebar
 */
export const getFullCategoryTree = async () => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('id, parent_id, name, slug, specs, icon')
      .order('id', { ascending: true });

    if (error) {
      console.error('Ошибка при загрузке категорий из Supabase:', error.message);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('Критическая ошибка API:', err);
    return [];
  }
};