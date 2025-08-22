-- #############################################################################
-- ##    VERIFICACIÓN: Políticas RLS de la tabla profiles                   ##
-- #############################################################################

-- Verificar políticas RLS existentes en la tabla profiles
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Verificar permisos de tabla para roles anon y authenticated
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee;

-- Asegurar que el rol authenticated tenga permisos de SELECT
GRANT SELECT ON public.profiles TO authenticated;

-- Crear política para permitir que los usuarios autenticados lean todos los perfiles
-- (necesario para el middleware que verifica roles)
DROP POLICY IF EXISTS "Allow authenticated users to read all profiles" ON public.profiles;

CREATE POLICY "Allow authenticated users to read all profiles"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (true);

-- Mantener la política existente para que los usuarios puedan ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Política para que los usuarios puedan actualizar su propio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Verificar que RLS esté habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';