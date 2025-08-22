'use server'

import { redirect } from 'next/navigation'
import { supabase, getUserProfile, type UserRole } from '@/lib/supabase'
import { revalidatePath } from 'next/cache'

export interface AuthResult {
  success: boolean
  error?: string
  redirectTo?: string
}

// Función helper para logging de errores
function logError(action: string, error: any, context?: any) {
  console.error(`[AUTH_ERROR] ${action}:`, {
    error: error?.message || error,
    context,
    timestamp: new Date().toISOString()
  })
}

// Server Action para registro manual
export async function signUpAction(formData: FormData): Promise<AuthResult> {
  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validación de campos requeridos
  if (!firstName || !lastName || !email || !password) {
    logError('signUpAction', 'Missing required fields', { firstName: !!firstName, lastName: !!lastName, email: !!email, password: !!password })
    return {
      success: false,
      error: 'Todos los campos son requeridos'
    }
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Por favor ingresa un email válido'
    }
  }

  // Validación de contraseña
  if (password.length < 6) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 6 caracteres'
    }
  }

  try {
    const origin = process.env.NEXT_PUBLIC_SITE_URL;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
        data: {
          first_name: firstName,
          last_name: lastName
        }
      }
    })

    if (error) {
      logError('signUpAction', error, { email })
      
      // Manejo específico de errores de Supabase
      if (error.message.includes('User already registered')) {
        return {
          success: false,
          error: 'Ya existe una cuenta con este email'
        }
      }
      
      if (error.message.includes('Password should be at least')) {
        return {
          success: false,
          error: 'La contraseña no cumple con los requisitos mínimos'
        }
      }
      
      return {
        success: false,
        error: 'Error al crear la cuenta. Intenta nuevamente.'
      }
    }

    if (data.user) {
      console.log(`[AUTH_SUCCESS] User registered: ${data.user.id}`)
    }

    return {
      success: true,
      redirectTo: '/verificar-correo'
    }
  } catch (error) {
    logError('signUpAction', error, { email })
    return {
      success: false,
      error: 'Error interno del servidor. Por favor intenta más tarde.'
    }
  }
}

// Server Action para login manual
export async function signInAction(formData: FormData): Promise<AuthResult> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    logError('signInAction', 'Missing credentials', { email: !!email, password: !!password })
    return {
      success: false,
      error: 'Email y contraseña son requeridos'
    }
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      logError('signInAction', error, { email })
      
      // Manejo específico de errores de autenticación
      if (error.message.includes('Invalid login credentials')) {
        return {
          success: false,
          error: 'Email o contraseña incorrectos'
        }
      }
      
      if (error.message.includes('Email not confirmed')) {
        return {
          success: false,
          error: 'Por favor confirma tu email antes de iniciar sesión'
        }
      }
      
      return {
        success: false,
        error: 'Error al iniciar sesión. Verifica tus credenciales.'
      }
    }

    if (data.user) {
      try {
        // Obtener el perfil del usuario para determinar la redirección
        const profile = await getUserProfile(data.user.id)
        
        if (!profile) {
          logError('signInAction', 'Profile not found', { userId: data.user.id })
          return {
            success: false,
            error: 'Error al obtener el perfil del usuario. Contacta al soporte.'
          }
        }

        console.log(`[AUTH_SUCCESS] User signed in: ${data.user.id}, role: ${profile.role}`)
        
        // Redirección basada en el rol
        const redirectPath = getRedirectPathByRole(profile.role)
        redirect(redirectPath)
      } catch (profileError: any) {
        // Si es una redirección de Next.js, permitir que continúe
        if (profileError?.message === 'NEXT_REDIRECT') {
          throw profileError
        }
        
        logError('signInAction', profileError, { userId: data.user.id })
        return {
          success: false,
          error: 'Error al cargar el perfil del usuario'
        }
      }
    }

    return {
      success: true
    }
  } catch (error: any) {
    // Si es una redirección de Next.js, permitir que continúe
    if (error?.message === 'NEXT_REDIRECT') {
      throw error
    }
    
    logError('signInAction', error, { email })
    return {
      success: false,
      error: 'Error interno del servidor. Por favor intenta más tarde.'
    }
  }
}

// Server Action para registro/login social
export async function signInWithOAuthAction(provider: 'google' | 'apple') {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
      }
    })

    if (error) {
      throw error
    }

    if (data.url) {
      redirect(data.url)
    }
  } catch (error: any) {
    // Si es una redirección de Next.js, permitir que continúe
    if (error?.message === 'NEXT_REDIRECT') {
      throw error
    }
    
    console.error('OAuth error:', error)
    throw new Error('Error en la autenticación social')
  }
}

// Server Action para cerrar sesión
export async function signOutAction() {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      throw error
    }

    revalidatePath('/', 'layout')
    redirect('/login')
  } catch (error) {
    console.error('Sign out error:', error)
    throw new Error('Error al cerrar sesión')
  }
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