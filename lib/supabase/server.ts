import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Cliente para Server Components, Server Actions y Route Handlers.
// Usa las cookies de la request para respetar RLS según el usuario autenticado.
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Se puede ignorar si se llama desde un Server Component sin
            // posibilidad de escribir cookies (se refresca en el middleware).
          }
        },
      },
    }
  )
}
