-- #############################################################################
-- ##    CORRECCIÓN: Asignar rol ADMIN al usuario específico                 ##
-- #############################################################################

-- Primero verificar el estado actual del usuario
DO $$
DECLARE
    user_exists BOOLEAN := FALSE;
    profile_exists BOOLEAN := FALSE;
    current_role TEXT;
    user_auth_id UUID;
BEGIN
    -- Verificar si el usuario existe en auth.users
    SELECT EXISTS(
        SELECT 1 FROM auth.users 
        WHERE email = 'bustamantmario67@gmail.com'
    ) INTO user_exists;
    
    IF user_exists THEN
        -- Obtener el ID del usuario de auth.users
        SELECT id INTO user_auth_id 
        FROM auth.users 
        WHERE email = 'bustamantmario67@gmail.com';
        
        RAISE NOTICE 'Usuario encontrado en auth.users con ID: %', user_auth_id;
        
        -- Verificar si tiene perfil en profiles
        SELECT EXISTS(
            SELECT 1 FROM public.profiles 
            WHERE user_id = user_auth_id
        ) INTO profile_exists;
        
        IF profile_exists THEN
            -- Obtener el rol actual
            SELECT role