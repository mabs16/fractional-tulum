'use server'

import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export async function updateEmailAction(formData: FormData) {
  const newEmail = formData.get('email') as string

  // Validaciones básicas
  if (!newEmail) {
    return {
      success: false,
      error: 'El correo electrónico es requerido'
    }
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newEmail)) {
    return {
      success: false,
      error: 'Por favor ingresa un correo electrónico válido'
    }
  }

  try {
    // Actualizar el email del usuario
    const { error } = await supabase.auth.updateUser({
      email: newEmail
    })

    if (error) {
      console.error('Error updating email:', error)
      return {
        success: false,
        error: error.message || 'Error al actualizar el correo electrónico'
      }
    }

    return {
      success: true,
      message: 'Hemos enviado un enlace de confirmación a tu nueva dirección de correo.'
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}