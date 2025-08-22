'use server'

import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export interface PasswordResetResult {
  success: boolean
  error?: string
  message?: string
}

// Server Action para solicitar reset de contraseña
export async function resetPasswordAction(formData: FormData): Promise<PasswordResetResult> {
  const email = formData.get('email') as string

  if (!email) {
    return {
      success: false,
      error: 'El correo electrónico es requerido'
    }
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      success: false,
      error: 'Por favor ingresa un correo electrónico válido'
    }
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/actualizar-contrasena`
    })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    return {
      success: true,
      message: 'Instrucciones enviadas a tu correo'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

// Server Action para actualizar contraseña
export async function updatePasswordAction(formData: FormData): Promise<PasswordResetResult> {
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!password || !confirmPassword) {
    return {
      success: false,
      error: 'Todos los campos son requeridos'
    }
  }

  // Validar longitud mínima de contraseña
  if (password.length < 8) {
    return {
      success: false,
      error: 'La contraseña debe tener al menos 8 caracteres'
    }
  }

  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return {
      success: false,
      error: 'Las contraseñas no coinciden'
    }
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      return {
        success: false,
        error: error.message
      }
    }

    // Redirigir a login con mensaje de éxito
    redirect('/login?message=password-updated')
  } catch (error) {
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}