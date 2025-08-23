import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseMiddlewareClient } from './lib/supabase/middleware/client'

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next()
    const pathname = request.nextUrl.pathname

    // RUTAS PÚBLICAS: Cualquiera puede acceder sin verificación de sesión
    const publicRoutes = [
      '/',
      '/copropiedad-fraccional',
      '/propiedad-alfa', 
      '/la-propuesta',
      '/faq',
      '/acceder',
      '/auth/callback',
      '/revision',
      '/verificar-correo'
    ]
    
    // Verificar si es una ruta pública ANTES de cualquier otra lógica
    if (publicRoutes.includes(pathname)) {
      return response
    }

    // Solo para rutas protegidas: verificar sesión y rol
    try {
      const supabase = createSupabaseMiddlewareClient(request, response)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('[MIDDLEWARE] Session error:', sessionError)
        return NextResponse.redirect(new URL('/acceder', request.url))
      }

      // SI NO HAY SESIÓN Y LA RUTA NO ES PÚBLICA, REDIRIGIR A ACCEDER
      if (!session) {
        return NextResponse.redirect(new URL('/acceder', request.url))
      }

      // SI HAY SESIÓN, VERIFICAMOS EL ROL Y APLICAMOS REGLAS
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .single()

      if (profileError) {
        console.error('[MIDDLEWARE] Profile error:', profileError)
        // Si no se puede obtener el perfil, redirigir a acceder
        return NextResponse.redirect(new URL('/acceder', request.url))
      }

      const role = profile?.role

      // Regla 1: Si el rol es PENDIENTE, solo puede estar en /revision.
      if (role === 'PENDIENTE' && pathname !== '/revision') {
        return NextResponse.redirect(new URL('/revision', request.url))
      }

      // Regla 2: Si es COPROPIETARIO, solo puede acceder a su portal.
      if (role === 'COPROPIETARIO' && !pathname.startsWith('/copropietario')) {
        return NextResponse.redirect(new URL('/copropietario/dashboard', request.url))
      }

      // Regla 3: Si es PROSPECTO, solo puede acceder a su portal.
      if (role === 'PROSPECTO' && !pathname.startsWith('/prospecto')) {
        return NextResponse.redirect(new URL('/prospecto/bienvenida', request.url))
      }

      // Regla 4: Si es ADMIN, solo puede acceder a su portal.
      if (role === 'ADMIN' && !pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }

      return response
    } catch (error) {
      console.error('[MIDDLEWARE] Unexpected error:', error)
      // En caso de error inesperado, redirigir a acceder para evitar bloqueos
      return NextResponse.redirect(new URL('/acceder', request.url))
    }
  } catch (globalError) {
    console.error('[MIDDLEWARE] Global error:', globalError)
    // En caso de error global, permitir el acceso
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)',
  ],
}