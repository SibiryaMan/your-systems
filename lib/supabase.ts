import { createClient } from '@supabase/supabase-js';

// Прямая проверка переменных среды
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Если консоль в браузере выдаст эти ошибки — файл .env.local не читается
if (!supabaseUrl) console.error("ОШИБКА: NEXT_PUBLIC_SUPABASE_URL не определен!");
if (!supabaseAnonKey) console.error("ОШИБКА: NEXT_PUBLIC_SUPABASE_ANON_KEY не определен!");

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co', 
  supabaseAnonKey || 'placeholder-key'
);