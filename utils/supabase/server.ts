import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // В Next.js 16 получение куки ВСЕГДА асинхронное
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            // Пытаемся установить куки, но в Server Components 
            // это часто будет игнорироваться (за это отвечает Middleware)
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // В серверных компонентах запись может быть заблокирована,
            // если заголовки уже отправлены. Это нормально.
          }
        },
      },
      global: {
        fetch: (url, options) =>
          fetch(url, {
            ...options,
            // СТРОГО: отключаем автоматическое кэширование fetch для Supabase,
            // чтобы избежать "Cache Conflict" в Next.js 16
            cache: 'no-store',
          }),
      },
    }
  )
}