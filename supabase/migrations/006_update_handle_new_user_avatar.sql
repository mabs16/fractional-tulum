-- #############################################################################
-- ##      ACTUALIZACIÓN DE FUNCIÓN: Capturar Avatar en Registro Social       ##
-- #############################################################################

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        user_id,
        first_name,
        last_name,
        email,
        avatar_url -- Añadimos la columna avatar_url al INSERT
    )
    VALUES (
        new.id,
        new.raw_user_meta_data->>'first_name',
        new.raw_user_meta_data->>'last_name',
        new.email,
        new.raw_user_meta_data->>'avatar_url' -- Leemos el avatar desde los metadatos del proveedor
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;