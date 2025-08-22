-- Corregir recursión infinita en políticas RLS

-- Eliminar las políticas problemáticas que causan recursión
DROP POLICY IF EXISTS "Admins have full access to everything." ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access to property details." ON public.propiedad_alfa_details;
DROP POLICY IF EXISTS "Admins have full access to fractions." ON public.propiedad_alfa;
DROP POLICY IF EXISTS "Admins have full access to documents." ON public.documents;
DROP POLICY IF EXISTS "Admins have full access to contracts." ON public.contracts;
DROP POLICY IF EXISTS "Users can view their own documents." ON public.documents;

-- Crear políticas más simples sin recursión
-- Para profiles: permitir a los usuarios ver y actualizar su propio perfil
-- Los admins tendrán acceso a través de service_role, no a través de políticas RLS

-- Política simple para documentos sin recursión
CREATE POLICY "Users can view their own documents."
ON public.documents FOR SELECT
USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- Permitir a usuarios autenticados insertar en profiles (para el trigger)
CREATE POLICY "Allow authenticated users to insert profiles."
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);