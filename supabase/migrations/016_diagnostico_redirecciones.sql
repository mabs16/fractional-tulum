-- Migración de diagnóstico para revisar el sistema de redirecciones
-- Esta migración NO modifica datos, solo consulta para diagnóstico

-- 1. Verificar todos los usuarios y sus roles
SELECT 
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
ORDER BY p.created_at DESC;

-- 2. Verificar específicamente el usuario bustamantmario67@gmail.com
SELECT 
    'Usuario específico: bustamantmario67@gmail.com' as consulta,
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.role,
    p.created_at,
    p.updated_at
FROM profiles p
WHERE p.email = 'bustamantmario67@gmail.com';

-- 3. Verificar si hay usuarios duplicados por email
SELECT 
    email,
    COUNT(*) as cantidad_perfiles
FROM profiles
GROUP BY email
HAVING COUNT(*) > 1;

-- 4. Verificar las políticas RLS actuales
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

-- 5. Verificar permisos de la tabla profiles
SELECT 
    grantee,
    table_name,
    privilege_type
FROM information_schema.role_table_grants 
WHERE table_schema = 'public' 
AND table_name = 'profiles'
AND grantee IN ('anon', 'authenticated')
ORDER BY table_name, grantee;

-- 6. Simular la consulta que hace el callback
-- Esta es la misma consulta que se ejecuta en /auth/callback/route.ts
SELECT 
    'Simulación consulta callback' as tipo_consulta,
    role, 
    email, 
    first_name, 
    last_name
FROM profiles 
WHERE email = 'bustamantmario67@gmail.com'
LIMIT 1;

-- 7. Verificar si el trigger está activo
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    trigger_schema,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users' 
AND trigger_schema = 'auth';

-- 8. Mostrar la lógica de redirección esperada
SELECT 
    role,
    CASE 
        WHEN role = 'ADMIN' THEN '/admin/dashboard'
        WHEN role = 'COPROPIETARIO' THEN '/copropietario/dashboard'
        WHEN role = 'PROSPECTO' THEN '/prospecto/bienvenida'
        WHEN role = 'PENDIENTE' THEN '/revision'
        ELSE '/revision (fallback)'
    END as ruta_esperada
FROM (
    SELECT DISTINCT role FROM profiles
    UNION ALL
    SELECT 'ADMIN' as role
    UNION ALL
    SELECT 'COPROPIETARIO' as role
    UNION ALL
    SELECT 'PROSPECTO' as role
    UNION ALL
    SELECT 'PENDIENTE' as role
) roles_disponibles
ORDER BY 
    CASE role
        WHEN 'ADMIN' THEN 1
        WHEN 'COPROPIETARIO' THEN 2
        WHEN 'PROSPECTO' THEN 3
        WHEN 'PENDIENTE' THEN 4
        ELSE 5
    END;