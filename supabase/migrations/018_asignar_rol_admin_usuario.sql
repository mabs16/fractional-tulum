-- Migración para asignar rol ADMIN al usuario específico
-- Fecha: 2025-01-21
-- Propósito: Asignar rol ADMIN al usuario bustamantmario67@gmail.com para probar redirecciones

-- 1. Verificar el estado actual del usuario
SELECT 
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

-- 2. Actualizar el rol del usuario a ADMIN
UPDATE profiles 
SET 
    role = 'ADMIN',
    updated_at = NOW()
WHERE email = 'bustamantmario67@gmail.com';

-- 3. Verificar que el cambio se aplicó correctamente
SELECT 
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

-- 4. Verificar que no hay otros usuarios con el mismo email
SELECT COUNT(*) as total_usuarios
FROM profiles 
WHERE email = 'bustamantmario67@gmail.com';

-- 5. Mostrar todos los usuarios ADMIN para verificar
SELECT 
    p.id,
    p.email,
    p.first_name,
    p.last_name,
    p.role,
    p.created_at
FROM profiles p
WHERE p.role = 'ADMIN'
ORDER BY p.created_at DESC;

-- 6. Simular la consulta que hace el callback de autenticación
SELECT 
    p.role,
    p.email,
    p.first_name,
    p.last_name,
    CASE 
        WHEN p.role = 'ADMIN' THEN '/admin/dashboard'
        WHEN p.role = 'COPROPIETARIO' THEN '/copropietario/dashboard'
        WHEN p.role = 'PROSPECTO' THEN '/prospecto/bienvenida'
        WHEN p.role = 'PENDIENTE' THEN '/revision'
        ELSE '/revision'
    END as ruta_redireccion
FROM profiles p
WHERE p.email = 'bustamantmario67@gmail.com';

-- 7. Verificar la función getRedirectPathByRole simulada
WITH redirect_logic AS (
    SELECT 
        'ADMIN'::user_role as role, '/admin/dashboard' as path
    UNION ALL
    SELECT 'COPROPIETARIO'::user_role, '/copropietario/dashboard'
    UNION ALL
    SELECT 'PROSPECTO'::user_role, '/prospecto/bienvenida'
    UNION ALL
    SELECT 'PENDIENTE'::user_role, '/revision'
)
SELECT 
    p.email,
    p.role as usuario_rol,
    rl.path as ruta_esperada
FROM profiles p
LEFT JOIN redirect_logic rl ON p.role = rl.role
WHERE p.email = 'bustamantmario67@gmail.com';

-- 8. Mostrar resumen de cambios realizados
SELECT 
    'CAMBIO REALIZADO' as status,
    'bustamantmario67@gmail.com' as email,
    'ADMIN' as nuevo_rol,
    '/admin/dashboard' as ruta_esperada,
    NOW() as fecha_cambio;