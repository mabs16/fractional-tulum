'use client';

import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { getAvailableSlotsAction, createAppointmentAction, getFirstAdminProfileAction } from '@/app/actions/availability';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AppointmentSchedulerProps {
  onAppointmentCreated?: () => void;
}

export function AppointmentScheduler({ onAppointmentCreated }: AppointmentSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isCreatingAppointment, setIsCreatingAppointment] = useState(false);
  const [prospectProfileId, setProspectProfileId] = useState<string | null>(null);

  useEffect(() => {
    // Obtener el perfil del usuario al cargar el componente
    const getProspectProfile = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (profile) {
          setProspectProfileId(profile.id);
        }
      }
    };
    
    getProspectProfile();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(selectedDate);
    } else {
      setAvailableSlots([]);
      setSelectedSlot(null);
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async (date: Date) => {
    setIsLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedSlot(null);
    const result = await getAvailableSlotsAction(date);
    if (result.success) {
      setAvailableSlots(result.slots || []);
    } else {
      toast.error(result.error || 'Hubo un problema al obtener los horarios disponibles.');
    }
    setIsLoadingSlots(false);
  };

  const handleCreateAppointment = async () => {
    console.log('🚀 INICIANDO PROCESO DE AGENDAMIENTO');
    
    // Verificar que tenemos todos los datos necesarios
    if (!selectedDate || !selectedSlot || !prospectProfileId) {
      console.log('❌ Faltan datos: fecha, slot o prospectProfileId');
      toast.error('Por favor, selecciona una fecha y un horario.');
      return;
    }

    console.log('📅 Fecha seleccionada:', selectedDate);
    console.log('⏰ Slot seleccionado:', selectedSlot);
    console.log('👤 Prospect Profile ID:', prospectProfileId);

    setIsCreatingAppointment(true);
    
    const [hour, minute] = selectedSlot.split(':').map(Number);

    // Creamos una nueva fecha para no modificar el estado original
    const appointmentDateTime = new Date(selectedDate.toISOString());
    appointmentDateTime.setUTCHours(hour, minute, 0, 0);

    // Verificación final para evitar enviar una fecha inválida
    if (isNaN(appointmentDateTime.getTime())) {
      console.error('❌ Error: Se intentó crear una cita con una fecha inválida.');
      toast.error('Error: Fecha inválida. Por favor, selecciona otra fecha y horario.');
      setIsCreatingAppointment(false);
      return;
    }

    console.log('🕐 Fecha y hora de la cita:', appointmentDateTime);

    // Obtener el primer admin disponible
    console.log('👤 Obteniendo admin disponible...');
    const adminResult = await getFirstAdminProfileAction();
    console.log('👤 Resultado admin:', adminResult);
    
    if (!adminResult.success || !adminResult.adminProfileId) {
      console.log('❌ No hay admin disponible');
      toast.error(adminResult.error || 'No hay asesores disponibles');
      setIsCreatingAppointment(false);
      return;
    }
    
    const appointmentData = {
      prospectProfileId: prospectProfileId,
      adminProfileId: adminResult.adminProfileId,
      startTime: appointmentDateTime,
      endTime: new Date(appointmentDateTime.getTime() + 60 * 60000) // 1 hora después
    };
    
    console.log('📝 Datos de la cita a crear:', appointmentData);
    console.log('🔄 Llamando a createAppointmentAction...');
    
    const result = await createAppointmentAction(appointmentData);
    
    console.log('✅ Resultado de createAppointmentAction:', result);

    if (result.success) {
      console.log('🎉 Cita creada exitosamente!');
      toast.success('Tu cita ha sido confirmada exitosamente!');
      setSelectedDate(undefined);
      setSelectedSlot(null);
      setAvailableSlots([]);
      onAppointmentCreated?.();
    } else {
      console.log('❌ Error al crear la cita:', result);
      toast.error('error' in result ? result.error : 'No se pudo agendar la cita. Intenta de nuevo.');
    }
    setIsCreatingAppointment(false);
  };

  return (
    <div className="flex flex-col md:flex-row md:gap-8">
      {/* Sección 1: El Calendario */}
      <div className="md:w-1/2">
        <h2 className="text-lg font-semibold mb-4">Selecciona una fecha</h2>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border shadow w-full"
          disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6} // Deshabilita fines de semana y días pasados
        />
      </div>

      {/* Sección 2: Los Horarios Disponibles */}
      <div className="md:w-1/2 mt-8 md:mt-0">
        <h2 className="text-lg font-semibold mb-4">Horarios disponibles</h2>
        {isLoadingSlots ? (
          <div className="grid grid-cols-3 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : availableSlots.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {availableSlots.map((slot) => (
              <Button
                key={slot}
                variant={selectedSlot === slot ? 'default' : 'outline'}
                onClick={() => setSelectedSlot(slot)}
                className="w-full"
              >
                {slot}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Selecciona una fecha para ver los horarios disponibles.</p>
        )}

        <Button
          onClick={handleCreateAppointment}
          disabled={!selectedSlot || isCreatingAppointment}
          className="mt-6 w-full"
        >
          {isCreatingAppointment ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Agendando...</>
          ) : (
            'Agendar Cita'
          )}
        </Button>
      </div>
    </div>
  );
}