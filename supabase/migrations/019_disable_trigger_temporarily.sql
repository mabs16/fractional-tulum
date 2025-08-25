-- #############################################################################
-- ##    SOLUCIÓN TEMPORAL: Deshabilitar trigger problemático                ##
-- #############################################################################
-- Fecha: 2025-01-21
-- Propósito: Deshabilitar temporalmente el trigger on_auth_user_created
--           que está causando error 500 en la autenticación

-- 1. Deshabilitar el trigger temporalmente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Crear una función de diagnóstico para identificar el problema
CREATE OR REPLACE FUNCTION public.diagnose_handle_new_user_error()
RETURNS TABLE(
    error_type TEXT,
    error_detail TEXT,
    suggestion TEXT
) AS $$
BEGIN
    -- Verificar si la tabla profiles existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        RETURN QUERY SELECT 
            'MISSING_TABLE'::TEXT,
            'La tabla public.profiles no existe'::TEXT,
            'Crear la tabla profiles antes de habilitar el trigger'::TEXT;
        RETURN;
    END IF;
    
    -- Verificar si las columnas necesarias existen
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'user_id' AND table_schema = 'public') THEN
        RETURN QUERY SELECT 
            'MISSING_COLUMN'::TEXT,
            'La columna user_id no existe en profiles'::TEXT,
            'Agregar la columna user_id a la tabla profiles'::TEXT;
        RETURN;
    END IF;
    
    -- Verificar permisos RLS
    IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'profiles' AND rowsecurity = true AND schemaname = 'public') THEN
        -- Verificar si hay políticas que permitan INSERT
        IF NOT EXISTS (
            SELECT 1 FROM pg_policies 
            WHERE tablename = 'profiles' 
            AND schemaname = 'public' 
            AND cmd = 'INSERT'
        ) THEN
            RETURN QUERY SELECT 
                'RLS_POLICY_MISSING'::TEXT,
                'No hay políticas RLS que permitan INSERT en profiles'::TEXT,
                'Crear política RLS para permitir INSERT durante la creación de usuario'::TEXT;
            RETURN;
        END IF;
    END IF;
    
    -- Si llegamos aquí, no hay errores obvios
    RETURN QUERY SELECT 
        'NO_OBVIOUS_ERROR'::TEXT,
        'No se encontraron errores obvios en la configuración'::TEXT,
        'El problema podría estar en la lógica de la función handle_new_user'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ejecutar diagnóstico
SELECT * FROM public.diagnose_handle_new_user_error();

-- 4. Comentario explicativo
-- IMPORTANTE: Este trigger se ha deshabilitado temporalmente para permitir
-- el login de usuarios. Los nuevos usuarios NO tendrán perfiles creados
-- automáticamente hasta que se resuelva el problema y se rehabilite el trigger.
-- 
-- Para rehabilitar el trigger después de resolver el problema:
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- IMPORTANTE: 
-- - Trigger on_auth_user_created deshabilitado temporalmente
-- - Los usuarios existentes pueden hacer login normalmente
-- - Los nuevos usuarios necesitarán perfiles creados manualmente