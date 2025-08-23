-- Migración para revisar políticas RLS y estado del trigger
-- Fecha: 2025-01-21
-- Propósito: Diagnosticar políticas RLS de la tabla profiles y verificar trigger

-- 1. Verificar si RLS está habilitado en la tabla profiles
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'profiles' AND schemaname = 'public';

-- 2. Listar todas las políticas RLS de la tabla profiles
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
WHERE tablename = 'profiles' AND schemaname = 'public'
ORDER BY policyname;

-- 3. Verificar permisos de tabla para roles anon y authenticated
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
    AND table_name = 'profiles'
    AND grantee IN ('anon', 'authenticated')
ORDER BY grantee, privilege_type;

-- 4. Verificar el estado del trigger on_auth_user_created
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing,
    action_orientation
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created'
ORDER BY trigger_name;

-- 5. Verificar la función handle_new_user
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user' 
    AND routine_schema = 'public';

-- 6. Consultar usuarios específicos para verificar datos
SELECT 
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.role,
    p.created_at,
    p.updated_at,
    au.email as auth_email,
    au.created_at as auth_created_at
FROM profiles p
LEFT JOIN auth.users au ON p.user_id = au.id
WHERE p.email ILIKE '%bustamant%' OR au.email ILIKE '%bustamant%'
ORDER BY p.created_at DESC;

-- 7. Verificar si hay usuarios en auth.users sin perfil en profiles
SELECT 
    au.id,
    au.email,
    au.created_at as auth_created,
    p.id as profile_id,
    p.role
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.user_id
WHERE p.id IS NULL
ORDER BY au.created_at DESC
LIMIT 10;

-- 8. Contar total de usuarios por rol
SELECT 
    role,
    COUNT(*) as total_usuarios
FROM profiles 
GROUP BY role
ORDER BY total_usuarios DESC;

-- 9. Verificar usuarios creados recientemente (últimas 24 horas)
SELECT 
    p.email,
    p.role,
    p.created_at,
    au.created_at as auth_created_at,
    (p.created_at - au.created_at) as tiempo_diferencia
FROM profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE p.created_at > NOW() - INTERVAL '24 hours'
ORDER BY p.created_at DESC;

-- 10. Verificar la configuración de la función handle_new_user
SELECT prosrc as function_body
FROM pg_proc 
WHERE proname = 'handle_new_user';