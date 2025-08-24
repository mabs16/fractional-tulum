'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type AppointmentStatus = 'CONFIRMADA' | 'CANCELADA' | 'COMPLETADA'

export interface Appointment {
  id: string
  prospect_profile_id: string
  admin_profile_id: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  created_at: string
  prospect_profile: {
    first_name: string
    last_name: string
    full_name: string // Campo calculado para compatibilidad
    email: string
    phone?: string
  }
  admin_profile: {
    first_name: string
    last_name: string
    full_name: string // Campo calculado para compatibilidad
    email: string
  }
}

export async function getAppointmentsAction(): Promise<{
  success: boolean
  appointments?: Appointment[]
  error?: string
}> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verificar que el usuario esté autenticado y sea admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/auth/login')
    }

    // Verificar rol de admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile?.role !== 'ADMIN') {
      redirect('/acceso-denegado')
    }

    // Obtener todas las citas con información de perfiles
    const { data: appointments, error } = await supabase
      .from('appointments')
      .select(`
        id,
        prospect_profile_id,
        admin_profile_id,
        start_time,
        end_time,
        status,
        created_at,
        prospect_profile:prospect_profile_id(
          first_name,
          last_name,
          email,
          phone
        ),
        admin_profile:admin_profile_id(
          first_name,
          last_name,
          email
        )
      `)
      .order('start_time', { ascending: false })

    if (error) {
      console.error('Error fetching appointments:', error)
      return {
        success: false,
        error: 'Error al obtener las citas'
      }
    }

    // Transformar los datos para que coincidan con la interfaz
    const transformedAppointments: Appointment[] = appointments?.map(apt => {
      const prospectProfile = Array.isArray(apt.prospect_profile) ? apt.prospect_profile[0] : apt.prospect_profile
      const adminProfile = Array.isArray(apt.admin_profile) ? apt.admin_profile[0] : apt.admin_profile
      
      return {
        ...apt,
        prospect_profile: {
          ...prospectProfile,
          full_name: `${prospectProfile?.first_name || ''} ${prospectProfile?.last_name || ''}`.trim()
        },
        admin_profile: {
          ...adminProfile,
          full_name: `${adminProfile?.first_name || ''} ${adminProfile?.last_name || ''}`.trim()
        }
      }
    }) || []

    return {
      success: true,
      appointments: transformedAppointments
    }
  } catch (error) {
    console.error('Error in getAppointmentsAction:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  newStatus: AppointmentStatus
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verificar que el usuario esté autenticado y sea admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/auth/login')
    }

    // Verificar rol de admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile?.role !== 'ADMIN') {
      redirect('/acceso-denegado')
    }

    // Actualizar el estado de la cita
    const { error } = await supabase
      .from('appointments')
      .update({ status: newStatus })
      .eq('id', appointmentId)

    if (error) {
      console.error('Error updating appointment status:', error)
      return {
        success: false,
        error: 'Error al actualizar el estado de la cita'
      }
    }

    // Revalidar la página para mostrar los cambios
    revalidatePath('/admin/citas')

    return {
      success: true
    }
  } catch (error) {
    console.error('Error in updateAppointmentStatusAction:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}

export async function deleteAppointmentAction(
  appointmentId: string
): Promise<{
  success: boolean
  error?: string
}> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Verificar que el usuario esté autenticado y sea admin
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      redirect('/auth/login')
    }

    // Verificar rol de admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (profile?.role !== 'ADMIN') {
      redirect('/acceso-denegado')
    }

    // Eliminar la cita
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', appointmentId)

    if (error) {
      console.error('Error deleting appointment:', error)
      return {
        success: false,
        error: 'Error al eliminar la cita'
      }
    }

    // Revalidar la página para mostrar los cambios
    revalidatePath('/admin/citas')

    return {
      success: true
    }
  } catch (error) {
    console.error('Error in deleteAppointmentAction:', error)
    return {
      success: false,
      error: 'Error interno del servidor'
    }
  }
}