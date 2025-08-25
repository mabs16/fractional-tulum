-- #############################################################################
-- ##    CREACIÓN MANUAL DE PERFIL: Usuario admin@prueba.com                ##
-- #############################################################################
-- Fecha: 2025-01-21
-- Propósito: Crear manualmente el perfil para el usuario que está intentando
--           hacer login, ya que el trigger automático está deshabilitado

-- 1. Verificar si el usuario existe en auth.users
DO $$
DECLARE
    user_record RECORD;
    profile_exists BOOLEAN;
BEGIN
    -- Buscar el usuario en auth.users
    SELECT * INTO user_record 
    FROM auth.users 
    WHERE email = 'admin@prueba.com'
    LIMIT 1;
    
    IF user_record.id IS NOT NULL THEN
        -- Verificar si ya tiene perfil
        SELECT EXISTS(
            SELECT 1 FROM public.profiles 
            WHERE user_id = user_record.id
        ) INTO profile_exists;
        
        IF NOT profile_exists THEN
            -- Crear el perfil manualmente
            INSERT INTO public.profiles (
                user_id,
                first_name,
                last_name,
                email,
                role,
                avatar_url
            )
            VALUES (
                user_record.id,
                COALESCE(
                    user_record.raw_user_meta_data->>'first_name',
                    'Admin'
                ),
                COALESCE(
                    user_record.raw_user_meta_data->>'last_name',
                    'Usuario'
                ),
                user_record.email,
                'admin'::public.user_role,
                user_record.raw_user_meta_data->>'avatar_url'
            );
            
            RAISE NOTICE 'Perfil creado para usuario: %', user_record.email;
        ELSE
            RAISE NOTICE 'El usuario % ya tiene perfil', user_record.email;
        END IF;
    ELSE
        RAISE NOTICE 'Usuario admin@prueba.com no encontrado en auth.users';
    END IF;
END $$;

-- 2. Verificar el resultado
SELECT 
    p.id,
    p.user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.role,
    p.created_at,
    au.email as auth_email,
    au.created_at as auth_created_at
FROM public.profiles p
JOIN auth.users au ON p.user_id = au.id
WHERE p.email = 'admin@prueba.com'
OR au.email = 'admin@prueba.com';

-- 3. También crear perfil para cualquier otro usuario existente sin perfil
DO $$
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN 
        SELECT au.* 
        FROM auth.users au
        LEFT JOIN public.profiles p ON au.id = p.user_id
        WHERE p.id IS NULL
        LIMIT 5  -- Limitar a 5 usuarios para evitar sobrecarga
    LOOP
        INSERT INTO public.profiles (
            user_id,
            first_name,
            last_name,
            email,
            role,
            avatar_url
        )
        VALUES (
            user_record.id,
            COALESCE(
                user_record.raw_user_meta_data->>'first_name',
                'Usuario'
            ),
            COALESCE(
                user_record.raw_user_meta_data->>'last_name',
                'Nuevo'
            ),
            user_record.email,
            'client'::public.user_role,  -- Rol por defecto
            user_record.raw_user_meta_data->>'avatar_url'
        );
        
        RAISE NOTICE 'Perfil creado para usuario existente: %', user_record.email;
    END LOOP;
END $$;