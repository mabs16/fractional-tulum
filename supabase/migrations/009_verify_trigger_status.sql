-- #############################################################################
-- ##    VERIFICACIÓN: Estado del trigger handle_new_user                    ##
-- #############################################################################

-- Verificar si el trigger existe y está activo
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing,
    action_orientation
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Verificar la función handle_new_user
SELECT 
    routine_name,
    routine_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Si el trigger no existe, crearlo
DO $$
BEGIN
    -- Verificar si el trigger existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.triggers 
        WHERE trigger_name = 'on_auth_user_created'
    ) THEN
        -- Crear el trigger
        CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        
        RAISE NOTICE 'Trigger on_auth_user_created creado exitosamente';
    ELSE
        RAISE NOTICE 'Trigger on_auth_user_created ya existe';
    END IF;
END $$;

-- Verificar permisos de la función
SELECT 
    grantee,
    privilege_type
FROM information_schema.routine_privileges 
WHERE routine_name = 'handle_new_user';