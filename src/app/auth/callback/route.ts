import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { type UserRole } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('🔄 Auth callback iniciado:', { code: !!code })

  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )

  if (code) {
    console.log('🔑 Intercambiando código por sesión...')
    // Intercambia el código de autorización por una sesión
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    if (exchangeError) {
      console.error('❌ Error intercambiando código:', exchangeError)
      return NextResponse.redirect(new URL('/iniciar-sesion?error=auth_error', request.url))
    }
    console.log('✅ Código intercambiado exitosamente')
  }

  // Obtener el perfil del usuario para redirección basada en rol
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    console.error('❌ Error obteniendo sesión:', sessionError)
    return NextResponse.redirect(new URL('/iniciar-sesion?error=session_error', request.url))
  }

  if (!session) {
    console.log('⚠️ No hay sesión activa')
    return NextResponse.redirect(new URL('/iniciar-sesion?error=no_session', request.url))
  }

  console.log('👤 Usuario autenticado:', { 
    userId: session.user.id, 
    email: session.user.email 
  })
  
  // Obtener el perfil del usuario
  console.log('🔍 Consultando perfil del usuario...')
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, email, first_name, last_name')
    .eq('user_id', session.user.id)
    .single()
  
  if (profileError) {
    console.error('❌ Error consultando perfil:', profileError)
    console.log('🔄 Redirigiendo a /revision por error en perfil')
    return NextResponse.redirect(new URL('/revision?error=profile_error', request.url))
  }

  if (!profile) {
    console.log('⚠️ No se encontró perfil para el usuario')
    console.log('🔄 Redirigiendo a /revision por perfil no encontrado')
    return NextResponse.redirect(new URL('/revision?error=no_profile', request.url))
  }

  console.log('📋 Perfil encontrado:', { 
    role: profile.role, 
    email: profile.email,
    name: `${profile.first_name} ${profile.last_name}` 
  })
  
  if (profile?.role) {
    const redirectPath = getRedirectPathByRole(profile.role)
    console.log('🎯 Redirigiendo según rol:', { 
      role: profile.role, 
      redirectPath 
    })
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
  
  // Fallback: redirigir a revisión si no se puede obtener el perfil
  console.log('🔄 Fallback: redirigiendo a /revision')
  return NextResponse.redirect(new URL('/revision?error=fallback', request.url))
}

// Función helper para determinar la redirección por rol
function getRedirectPathByRole(role: UserRole): string {
  switch (role) {
    case 'ADMIN':
      return '/admin/dashboard'
    case 'COPROPIETARIO':
      return '/copropietario/dashboard'
    case 'PROSPECTO':
      return '/prospecto/bienvenida'
    case 'PENDIENTE':
      return '/revision'
    default:
      return '/revision'
  }
}