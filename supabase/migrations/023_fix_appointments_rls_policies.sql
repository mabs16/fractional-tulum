-- Migración para corregir políticas RLS de la tabla appointments
-- Fecha: 2025-01-21
-- Propósito: Permitir que los administradores vean todas las citas y los prospectos solo vean las suyas

-- Eliminar la política actual que es muy restrictiva
DROP POLICY IF EXISTS "Users can view their own appointments" ON public.appointments;

-- Crear nueva política para que los administradores puedan ver TODAS las citas
CREATE POLICY "Admins can view all appointments"
ON public.appointments FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
);

-- Crear política para que los prospectos solo vean sus propias citas
CREATE POLICY "Prospects can view their own appointments"
ON public.appointments FOR SELECT
USING (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = prospect_profile_id)
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'PROSPECTO'
    )
);

-- Política para que los administradores puedan actualizar cualquier cita
CREATE POLICY "Admins can update all appointments"
ON public.appointments FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
);

-- Política para que los administradores puedan eliminar cualquier cita
CREATE POLICY "Admins can delete all appointments"
ON public.appointments FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.user_id = auth.uid() 
        AND profiles.role = 'ADMIN'
    )
);

-- Verificar las políticas creadas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'appointments'
ORDER BY policyname;