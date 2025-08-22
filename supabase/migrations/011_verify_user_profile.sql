-- #############################################################################
-- ##    VERIFICACIÓN: Perfil del usuario específico                        ##
-- #############################################################################

-- Verificar si el usuario bustamantmario67@gmail.com tiene un perfil
SELECT 
    p.id,
    p.user_id,
    p.first_name,
    p.last_name,
    p.email,
    p.role,
    p.created_at
FROM public.profiles p
WHERE p.email = 'bustamantmario67@gmail.com';

-- Verificar si el usuario existe en auth.users
SELECT 
    id,
    email,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'bustamantmario67@gmail.com';

-- Si el usuario existe en auth.users pero no tiene perfil, crearlo manualmente
DO $$
DECLARE
    user_record RECORD;
    profile_exists BOOLEAN := FALSE;
BEGIN
    -- Verificar si el usuario existe en auth.users
    SELECT * INTO user_record
    FROM auth.users 
    WHERE email = 'bustamantmario67@gmail.com'
    LIMIT 1;
    
    IF FOUND THEN
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
                avatar_url,
                role
            )
            VALUES (
                user_record.id,
                COALESCE(
                    user_record.raw_user_meta_data->>'first_name',
                    SPLIT_PART(COALESCE(
                        user_record.raw_user_meta_data->>'full_name',
                        user_record.raw_user_meta_data->>'name',
                        'Usuario'
                    ), ' ', 1)
                ),
                COALESCE(
                    user_record.raw_user_meta_data->>'last_name',
                    CASE 
                        WHEN ARRAY_LENGTH(STRING_TO_ARRAY(COALESCE(
                            user_record.raw_user_meta_data->>'full_name',
                            user_record.raw_user_meta_data->>'name',
                            'Usuario Google'
                        ), ' '), 1) > 1 THEN
                            TRIM(SUBSTRING(COALESCE(
                                user_record.raw_user_meta_data->>'full_name',
                                user_record.raw_user_meta_data->>'name',
                                'Usuario Google'
                            ) FROM LENGTH(SPLIT_PART(COALESCE(
                                user_record.raw_user_meta_data->>'full_name',
                                user_record.raw_user_meta_data->>'name',
                                'Usuario'
                            ), ' ', 1)) + 2))
                        ELSE 'Google'
                    END
                ),
                user_record.email,
                COALESCE(
                    user_record.raw_user_meta_data->>'avatar_url',
                    user_record.raw_user_meta_data->>'picture'
                ),
                'PENDIENTE'::user_role
            );
            
            RAISE NOTICE 'Perfil creado para usuario: %', user_record.email;
        ELSE
            RAISE NOTICE 'El usuario ya tiene un perfil: %', user_record.email;
        END IF;
    ELSE
        RAISE NOTICE 'Usuario no encontrado en auth.users';
    END IF;
END $$;

-- Verificar el resultado final
SELECT 
    'Verificación final:' as status,
    p.id,
    p.user_id,
    p.first_name,
    p.last_name,
    p.email,
    p.role,
    p.created_at
FROM public.profiles p
WHERE p.email = 'bustamantmario67@gmail.com';