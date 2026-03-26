import { createClient } from '@supabase/supabase-js'

// ВНИМАНИЕ: Проверь, чтобы в кавычках ниже НЕ БЫЛО русских букв!
const supabaseUrl = 'https://ahaemmswtjnkoljltkrp.supabase.co' 
const supabaseAnonKey = 'sb_publishable_Sxyfdj48zJEWh9izClVqrA_JX1Csj04'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)