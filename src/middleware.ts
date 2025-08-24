import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Usamos getUser() para refrescar y obtener la sesión de forma segura.
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  // --- LÓGICA DE PROTECCIÓN ---

  // 1. Definimos las rutas que son 100% públicas
  const publicRoutes = ['/', '/copropiedad-fraccional', '/nuestra-villa', '/la-propuesta', '/faq', '/propiedad-inteligente', '/nuestro-equipo']
  if (publicRoutes.includes(pathname)) {
    return response // Si es una de estas, dejamos pasar sin hacer nada más.
  }

  // 2. Definimos las rutas de autenticación
  const authRoutes = ['/acceder', '/verificar-correo', '/auth/callback', '/revision']
  
  // Si no hay usuario y la ruta NO es de autenticación, lo mandamos a acceder.
  if (!user && !authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/acceder', request.url))
  }

  // 3. Si SÍ hay usuario, aplicamos la lógica de roles.
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    const role = profile?.role
    
    // Si no hay perfil por alguna razón, lo mejor es sacarlo por seguridad.
    if (!role) {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL('/acceder', request.url))
    }

    // Regla para PENDIENTE: Su único hogar es /revision.
    if (role === 'PENDIENTE' && pathname !== '/revision') {
      return NextResponse.redirect(new URL('/revision', request.url))
    }

    // Regla para COPROPIETARIO: No puede estar en ningún otro portal.
    if (role === 'COPROPIETARIO' && !pathname.startsWith('/copropietario')) {
      return NextResponse.redirect(new URL('/copropietario/dashboard', request.url))
    }

    // Regla para PROSPECTO: No puede estar en ningún otro portal.
    if (role === 'PROSPECTO' && !pathname.startsWith('/prospecto')) {
      return NextResponse.redirect(new URL('/prospecto/bienvenida', request.url))
    }

    // Regla para ADMIN: No puede estar en ningún otro portal.
    if (role === 'ADMIN' && !pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}