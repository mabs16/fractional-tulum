-- ### HABILITAR RLS EN LAS NUEVAS TABLAS ###
ALTER TABLE public.advisor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- ### POLÍTICAS PARA `advisor_availability` ###

-- Política 1: Cualquier usuario autenticado puede LEER la disponibilidad de los asesores.
-- (Necesario para que los prospectos puedan ver los horarios disponibles).
CREATE POLICY "Allow authenticated users to read availability"
ON public.advisor_availability FOR SELECT
USING (auth.role() = 'authenticated');

-- Política 2: Los administradores solo pueden crear/modificar SU PROPIA disponibilidad.
CREATE POLICY "Admins can manage their own availability"
ON public.advisor_availability FOR ALL -- (INSERT, UPDATE, DELETE)
USING (
    (SELECT role FROM public.profiles WHERE id = admin_profile_id) = 'ADMIN'
    AND auth.uid() = (SELECT user_id FROM public.profiles WHERE id = admin_profile_id)
);

-- ### POLÍTICAS PARA `appointments` ###

-- Política 1: Los usuarios pueden ver las citas en las que participan (ya sea como prospecto o como admin).
CREATE POLICY "Users can view their own appointments"
ON public.appointments FOR SELECT
USING (
    auth.uid() = (SELECT user_id FROM public.profiles WHERE id = prospect_profile_id)
    OR auth.uid() = (SELECT user_id FROM public.profiles WHERE id = admin_profile_id)
);

-- Política 2: Cualquier usuario autenticado puede crear (INSERT) una nueva cita.
CREATE POLICY "Authenticated users can create appointments"
ON public.appointments FOR INSERT
WITH CHECK (auth.role() = 'authenticated');