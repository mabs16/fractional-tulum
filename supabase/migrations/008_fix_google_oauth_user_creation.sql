-- #############################################################################
-- ##    CORRECCIÓN: Función handle_new_user para Google OAuth                ##
-- #############################################################################

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    full_name_value TEXT;
    first_name_value TEXT;
    last_name_value TEXT;
BEGIN
    -- Intentar obtener el nombre completo de diferentes campos posibles
    full_name_value := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'display_name'
    );
    
    -- Intentar obtener first_name y last_name directamente
    first_name_value := new.raw_user_meta_data->>'first_name';
    last_name_value := new.raw_user_meta_data->>'last_name';
    
    -- Si no tenemos first_name o last_name, intentar dividir el nombre completo
    IF (first_name_value IS NULL OR first_name_value = '') AND full_name_value IS NOT NULL THEN
        -- Dividir el nombre completo en primera y última parte
        first_name_value := SPLIT_PART(full_name_value, ' ', 1);
        
        -- Si hay más de una palabra, tomar el resto como apellido
        IF ARRAY_LENGTH(STRING_TO_ARRAY(full_name_value, ' '), 1) > 1 THEN
            last_name_value := TRIM(SUBSTRING(full_name_value FROM LENGTH(first_name_value) + 2));
        END IF;
    END IF;
    
    -- Valores por defecto si aún no tenemos nombres
    IF first_name_value IS NULL OR first_name_value = '' THEN
        first_name_value := 'Usuario';
    END IF;
    
    IF last_name_value IS NULL OR last_name_value = '' THEN
        last_name_value := 'Google';
    END IF;
    
    -- Insertar el perfil con los valores procesados
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        email,
        avatar_url
    )
    VALUES (
        new.id,
        first_name_value,
        last_name_value,
        new.email,
        COALESCE(
            new.raw_user_meta_data->>'avatar_url',
            new.raw_user_meta_data->>'picture'
        )
    );
    
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentario: Esta función maneja correctamente los casos donde Google OAuth
-- no proporciona first_name/last_name separados, extrayendo la información
-- del nombre completo o usando valores por defecto seguros.