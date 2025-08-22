import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Crear cliente de Supabase para middleware
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl

  // Rutas públicas que no requieren autenticación
  const publicRoutes = [
    '/',
    '/iniciar-sesion',
    '/login',
    '/registro',
    '/olvide-contrasena',
    '/actualizar-contrasena',
    '/verificar-correo',
    '/auth/callback',
    '/auth/signout'
  ]

  // Si es una ruta pública, permitir acceso
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/auth/'))) {
    return res
  }

  // Si no hay sesión, redirigir a login
  if (!session) {
    const redirectUrl = new URL('/iniciar-sesion', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Obtener datos del usuario desde la base de datos
  const { data: userData, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  if (error || !userData) {
    console.log('❌ Error obteniendo perfil del usuario:', error)
    // Si hay error obteniendo el usuario, redirigir a login
    const redirectUrl = new URL('/iniciar-sesion', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  const userRole = userData.role
  console.log('🔍 Middleware - Usuario:', session.user.email, 'Rol:', userRole, 'Ruta:', pathname)

  // Lógica de protección de rutas basada en roles
  
  // Usuarios con rol PENDIENTE solo pueden acceder a /revision
  if (userRole === 'PENDIENTE') {
    if (pathname !== '/revision') {
      console.log('🔄 Redirigiendo usuario PENDIENTE a /revision')
      return NextResponse.redirect(new URL('/revision', req.url))
    }
    return res
  }

  // Redirigir usuarios con roles específicos a sus dashboards si están en /revision
  if (pathname === '/revision') {
    let redirectPath = ''
    switch (userRole) {
      case 'ADMIN':
        redirectPath = '/admin/dashboard'
        break
      case 'COPROPIETARIO':
        redirectPath = '/copropietario/dashboard'
        break
      case 'PROSPECTO':
        redirectPath = '/prospecto/bienvenida'
        break
    }
    
    if (redirectPath) {
      console.log(`🔄 Redirigiendo usuario ${userRole} de /revision a ${redirectPath}`)
      return NextResponse.redirect(new URL(redirectPath, req.url))
    }
  }

  // Rutas de administrador - solo para rol ADMIN
  if (pathname.startsWith('/admin')) {
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/acceso-denegado', req.url))
    }
    return res
  }

  // Rutas de copropietario - solo para rol COPROPIETARIO
  if (pathname.startsWith('/copropietario')) {
    if (userRole !== 'COPROPIETARIO') {
      return NextResponse.redirect(new URL('/acceso-denegado', req.url))
    }
    return res
  }

  // Rutas de prospecto - solo para rol PROSPECTO
  if (pathname.startsWith('/prospecto')) {
    if (userRole !== 'PROSPECTO') {
      return NextResponse.redirect(new URL('/acceso-denegado', req.url))
    }
    return res
  }

  // Página de revisión - solo accesible para usuarios PENDIENTE
  if (pathname === '/revision') {
    if (userRole !== 'PENDIENTE') {
      console.log(`❌ Usuario ${userRole} intentando acceder a /revision - acceso denegado`)
      return NextResponse.redirect(new URL('/acceso-denegado', req.url))
    }
    return res
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}