-- #############################################################################
-- ##      FUNCIÓN DE AYUDA: Actualizar Rol de Usuario de Forma Segura        ##
-- #############################################################################

-- Eliminar la función existente si existe
DROP FUNCTION IF EXISTS public.update_user_role(UUID, TEXT);

CREATE OR REPLACE FUNCTION public.update_user_role(
    target_user_id UUID,
    new_role_text TEXT
)
RETURNS void AS $$
BEGIN
    UPDATE public.profiles
    SET role = new_role_text::public.user_role -- Aquí está la "traducción" clave
    WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario: Esta función permite actualizar el rol de un usuario
-- manejando automáticamente el casting de TEXT a user_role.
-- SECURITY DEFINER permite que la función se ejecute con los privilegios
-- del propietario de la función, bypasseando las políticas RLS.