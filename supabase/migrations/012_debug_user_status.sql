-- #############################################################################
-- ##    DEBUG: Verificación completa del estado del usuario                ##
-- #############################################################################

-- 1. Verificar si el usuario existe en auth.users
SELECT 
    'Usuario en auth.users:' as check_type,
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'bustamantmario67@gmail.com';

-- 2. Verificar si el usuario tiene perfil en profiles
SELECT 
    'Perfil en profiles:' as check_type,
    id,
    user_id,
    first_name,
    last_name,
    email,
    role,
    created_at
FROM public.profiles 
WHERE email = 'bustamantmario67@gmail.com';

-- 3. Verificar el trigger on_auth_user_created
SELECT 
    'Trigger status:' as check_type,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 4. Verificar políticas RLS en profiles
SELECT 
    'Políticas RLS:' as check_type,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- 5. Verificar permisos de tabla
SELECT 
    'Permisos de tabla:' as check_type,
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND table_name = 'profiles' 
    AND grantee IN ('anon', 'authenticated')
ORDER BY grantee;

-- 6. Verificar RLS habilitado
SELECT 
    'RLS status:' as check_type,
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';