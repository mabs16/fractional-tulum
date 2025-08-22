-- #############################################################################
-- ##    DIAGNÓSTICO: Simulación del proceso de login para usuario ADMIN    ##
-- #############################################################################

-- 1. Verificar el usuario en auth.users
SELECT 
    'PASO 1: Usuario en auth.users' as paso,
    id as user_id,
    email,
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'bustamantmario67@gmail.com';

-- 2. Verificar el perfil en public.profiles (lo que hace el callback)
SELECT 
    'PASO 2: Perfil en public.profiles' as paso,
    id,
    user_id,
    email,
    role,
    first_name,
    last_name,
    created_at
FROM public.profiles 
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'bustamantmario67@gmail.com'
);

-- 3. Simular exactamente la consulta del callback
SELECT 
    'PASO 3: Consulta exacta del callback' as paso,
    role,
    CASE 
        WHEN role = 'ADMIN' THEN '/admin/dashboard'
        WHEN role = 'COPROPIETARIO' THEN '/copropietario/dashboard'
        WHEN role = 'PROSPECTO' THEN '/prospecto/bienvenida'
        WHEN role = 'PENDIENTE' THEN '/revision'
        ELSE '/revision (fallback)'
    END as redireccion_esperada
FROM public.profiles 
WHERE user_id = (
    SELECT id FROM auth.users WHERE email = 'bustamantmario67@gmail.com'
);

-- 4. Verificar políticas RLS que podrían afectar la consulta
SELECT 
    'PASO 4: Políticas RLS activas' as paso,
    policyname,
    cmd,
    roles,
    qual
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- 5. Verificar permisos de tabla
SELECT 
    'PASO 5: Permisos de tabla' as paso,
    grantee,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- 6. Verificar si RLS está habilitado
SELECT 
    'PASO 6: Estado RLS' as paso,
    schemaname,
    tablename,
    rowsecurity as rls_habilitado
FROM pg_tables 
WHERE tablename = 'profiles';

-- 7. Probar consulta como usuario autenticado (simulación)
SELECT 
    'PASO 7: Diagnóstico final' as paso,
    'Si el callback no encuentra el perfil o rol, redirige a /revision como fallback' as nota,
    'Verificar que las políticas RLS permitan la lectura del perfil' as recomendacion;

-- Mostrar resumen del diagnóstico
SELECT 
    'RESUMEN DEL DIAGNÓSTICO' as titulo,
    'El usuario debería tener rol ADMIN y ser redirigido a /admin/dashboard' as expectativa,
    'Si se redirige a /revision, hay un problema en el callback o las políticas RLS' as problema_posible;