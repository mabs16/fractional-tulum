'use server'

import { createSupabaseServerClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Resend } from 'resend'

export interface AvailabilityData {
  [key: string]: {
    enabled: boolean
    startTime: string
    endTime: string
  }
}

export interface AvailabilityEntry {
  id: string
  admin_profile_id: string
  day_of_week: number
  start_time: string
  end_time: string
}

/**
 * Obtiene la disponibilidad semanal del administrador actual
 */
export async function getAvailabilityAction(): Promise<AvailabilityData> {
  const supabase = await createSupabaseServerClient()
  
  // Obtener el usuario autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/auth/login')
  }

  // Obtener el perfil del usuario
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  // Obtener la disponibilidad existente
  const { data: availability, error: availabilityError } = await supabase
    .from('advisor_availability')
    .select('*')
    .eq('admin_profile_id', profile.id)

  if (availabilityError) {
    console.error('Error fetching availability:', availabilityError)
    throw new Error('Error al obtener la disponibilidad')
  }

  // Convertir los datos a formato del formulario
  const scheduleData: AvailabilityData = {
    monday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    tuesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    wednesday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    thursday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    friday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
    sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
  }

  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

  availability?.forEach((entry: AvailabilityEntry) => {
    const dayName = dayNames[entry.day_of_week]
    if (dayName && scheduleData[dayName]) {
      scheduleData[dayName] = {
        enabled: true,
        startTime: entry.start_time,
        endTime: entry.end_time
      }
    }
  })

  return scheduleData
}

/**
 * Actualiza la disponibilidad semanal del administrador
 */
export async function updateAvailabilityAction(scheduleData: AvailabilityData) {
  const supabase = await createSupabaseServerClient()
  
  // Obtener el usuario autenticado
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'Usuario no autenticado' }
  }

  // Obtener el perfil del usuario
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'ADMIN') {
    return { error: 'Acceso denegado' }
  }

  try {
    // Borrar todas las entradas existentes para este admin
    const { error: deleteError } = await supabase
      .from('advisor_availability')
      .delete()
      .eq('admin_profile_id', profile.id)

    if (deleteError) {
      console.error('Error deleting existing availability:', deleteError)
      return { error: 'Error al eliminar disponibilidad existente' }
    }

    // Preparar nuevas entradas
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const newEntries = []

    for (const [dayName, dayData] of Object.entries(scheduleData)) {
      if (dayData.enabled && dayData.startTime && dayData.endTime) {
        const dayOfWeek = dayNames.indexOf(dayName)
        if (dayOfWeek !== -1) {
          newEntries.push({
            admin_profile_id: profile.id,
            day_of_week: dayOfWeek,
            start_time: dayData.startTime,
            end_time: dayData.endTime
          })
        }
      }
    }

    // Insertar nuevas entradas si hay alguna
    if (newEntries.length > 0) {
      const { error: insertError } = await supabase
        .from('advisor_availability')
        .insert(newEntries)

      if (insertError) {
        console.error('Error inserting new availability:', insertError)
        return { error: 'Error al guardar la nueva disponibilidad' }
      }
    }

    // Revalidar la página
    revalidatePath('/admin/disponibilidad')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating availability:', error)
    return { error: 'Error interno del servidor' }
  }
}

/**
 * Obtiene los horarios disponibles para una fecha específica
 */
export async function getAvailableSlotsAction(selectedDate: Date) {
  // Asegurarnos de que la fecha esté en la zona horaria correcta (UTC para consistencia)
  const startOfDay = new Date(selectedDate.setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(selectedDate.setUTCHours(23, 59, 59, 999));
  const dayOfWeek = selectedDate.getUTCDay(); // 0=Domingo, 1=Lunes, ...

  // Debug logs
  console.log('🔍 getAvailableSlotsAction - Fecha seleccionada:', selectedDate.toISOString());
  console.log('🔍 Inicio del día:', startOfDay.toISOString());
  console.log('🔍 Fin del día:', endOfDay.toISOString());
  console.log('🔍 Día de la semana:', dayOfWeek);

  try {
    const supabase = await createSupabaseServerClient();

    // 1. Obtener la disponibilidad general del asesor para ese día de la semana
    const { data: availability, error: availabilityError } = await supabase
      .from('advisor_availability')
      .select('start_time, end_time')
      .eq('day_of_week', dayOfWeek)
      .single(); // Asumimos un solo horario por día por ahora

    if (availabilityError || !availability) {
      console.error('No se encontró disponibilidad para este día:', availabilityError);
      return { success: true, slots: [] }; // No es un error, simplemente no hay horarios
    }

    console.log('🔍 Disponibilidad encontrada:', availability);

    // 2. Obtener todas las citas ya agendadas para esa fecha
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('start_time, end_time, status')
      .gte('start_time', startOfDay.toISOString())
      .lt('start_time', endOfDay.toISOString())
      .eq('status', 'CONFIRMADA');

    if (appointmentsError) {
      throw new Error('Error al obtener las citas existentes.');
    }

    console.log('🔍 Citas encontradas para esta fecha:', appointments);

    // 3. Calcular los bloques de tiempo disponibles
    const availableSlots = [];
    const slotDuration = 60; // Duración de la cita en minutos

    const [startHour, startMinute] = availability.start_time.split(':').map(Number);
    const [endHour, endMinute] = availability.end_time.split(':').map(Number);

    const currentSlot = new Date(startOfDay);
    currentSlot.setUTCHours(startHour, startMinute);

    const endSlot = new Date(startOfDay);
    endSlot.setUTCHours(endHour, endMinute);

    while (currentSlot < endSlot) {
      const slotStartTime = new Date(currentSlot);
      const slotEndTime = new Date(slotStartTime.getTime() + slotDuration * 60000);

      // Verificar si el slot actual se superpone con una cita existente
      const isBooked = appointments.some(appt => {
        const apptStartTime = new Date(appt.start_time);
        const apptEndTime = new Date(appt.end_time);
        // Conflicto si: (InicioSlot < FinCita) y (FinSlot > InicioCita)
        return slotStartTime < apptEndTime && slotEndTime > apptStartTime;
      });

      if (!isBooked) {
        // Formatear la hora para mostrarla al usuario, ej: "10:00"
        // Usamos 'en-GB' que por defecto es formato 24h, es más robusto que 'es-MX' para esto.
        availableSlots.push(slotStartTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }));
      }
      
      // Avanzar al siguiente bloque de tiempo
      currentSlot.setMinutes(currentSlot.getMinutes() + slotDuration);
    }
    
    console.log('🔍 Slots disponibles calculados:', availableSlots);
    
    return { success: true, slots: availableSlots };

  } catch (error) {
    console.error('Error en getAvailableSlotsAction:', error);
    return { success: false, error: 'Error al calcular los horarios.' };
  }
}

/**
 * Obtiene el primer admin profile disponible
 */
export async function getFirstAdminProfileAction(): Promise<{
  success: boolean
  adminProfileId?: string
  error?: string
}> {
  try {
    const supabase = await createSupabaseServerClient()
    
    const { data: adminProfile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'ADMIN')
      .limit(1)
      .single()
    
    if (error || !adminProfile) {
      return { success: false, error: 'No se encontró un asesor disponible' }
    }
    
    return { success: true, adminProfileId: adminProfile.id }
  } catch (error) {
    console.error('Error getting admin profile:', error)
    return { success: false, error: 'Error al obtener asesor' }
  }
}

/**
 * Crea una nueva cita
 */
export async function createAppointmentAction(appointmentDetails: {
  prospectProfileId: string;
  adminProfileId: string;
  startTime: Date;
  endTime: Date;
}) {
  const supabase = await createSupabaseServerClient();

  try {
    const startTimeISO = new Date(appointmentDetails.startTime).toISOString();

    // ---- INICIO DE LA CORRECCIÓN CRÍTICA ----
    // Verificamos si ya existe una cita que se superponga con el horario solicitado.
    // La lógica busca cualquier cita cuyo período de tiempo (de start_time a end_time)
    // se cruce con el nuevo período de tiempo que se quiere agendar.
    const { data: existingAppointment, error: checkError } = await supabase
      .from('appointments')
      .select('id')
      .eq('admin_profile_id', appointmentDetails.adminProfileId)
      .lt('start_time', new Date(appointmentDetails.endTime).toISOString()) // La cita existente empieza antes de que la nueva termine
      .gt('end_time', startTimeISO) // La cita existente termina después de que la nueva empiece
      .in('status', ['CONFIRMADA'])
      .limit(1)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // Ignoramos el error "no rows found"
      console.error('Error verificando disponibilidad:', checkError);
      return { success: false, error: 'Error al verificar disponibilidad.' };
    }

    if (existingAppointment) {
      console.error('Slot ya ocupado:', existingAppointment);
      return { success: false, error: 'Este horario acaba de ser ocupado. Por favor, selecciona otro.' };
    }
    // ---- FIN DE LA CORRECCIÓN CRÍTICA ----

    // Si el slot está libre, procedemos a insertar la nueva cita
    const { data, error: insertError } = await supabase
      .from('appointments')
      .insert({
        prospect_profile_id: appointmentDetails.prospectProfileId,
        admin_profile_id: appointmentDetails.adminProfileId,
        start_time: startTimeISO,
        end_time: new Date(appointmentDetails.endTime).toISOString(),
        status: 'CONFIRMADA'
      })
      .select()
      .single();
      
    if (insertError) {
      console.error('Error de Supabase al insertar la cita:', insertError);
      return { success: false, error: 'Error de base de datos al agendar la cita.' };
    }

    // (Opcional) Enviar correos de confirmación
    revalidatePath('/admin/citas');
    return { success: true, message: '¡Cita confirmada exitosamente!' };

  } catch (error) {
    console.error('Error inesperado en createAppointmentAction:', error);
    return { success: false, error: 'Ocurrió un error inesperado en el servidor.' };
  }
}