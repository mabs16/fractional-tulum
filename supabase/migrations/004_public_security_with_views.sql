-- #############################################################################
-- ##      SCRIPT DE SEGURIDAD PÚBLICA DEFINITIVO USANDO VISTAS               ##
-- #############################################################################

-- ### PASO 1: LIMPIAR POLÍTICAS PÚBLICAS ANTERIORES (SI EXISTEN) ###
-- Esto asegura que no queden reglas de acceso inseguras en las tablas base.

DROP POLICY IF EXISTS "Cualquier persona puede leer los detalles de la Propiedad Alfa." ON public.propiedad_alfa_details;
DROP POLICY IF EXISTS "Cualquier persona puede ver el estado de las fracciones." ON public.propiedad_alfa;


-- ### PASO 2: CREAR UNA VISTA PÚBLICA Y SEGURA PARA LAS FRACCIONES ###
-- Esta vista es una tabla virtual que solo muestra las columnas no sensibles
-- de la tabla `propiedad_alfa`. Notablemente, OCULTA la columna `owner_id`.

CREATE OR REPLACE VIEW public.vista_publica_fracciones AS
SELECT
    fraction_number,
    status
FROM
    public.propiedad_alfa;

-- Otorgar permisos de SELECT en la vista a roles públicos
GRANT SELECT ON public.vista_publica_fracciones TO anon;
GRANT SELECT ON public.vista_publica_fracciones TO authenticated;


-- ### PASO 3: CREAR POLÍTICAS DE ACCESO PÚBLICO (SOLO LECTURA) ###

-- Política 1: Permitir que CUALQUIERA (incluyendo anónimos) lea los detalles de la propiedad.
CREATE POLICY "Public read access to property details"
ON public.propiedad_alfa_details
FOR SELECT USING (true);


-- ### PASO 4: ASEGURAR QUE LA TABLA REAL `propiedad_alfa` SIGUE PROTEGIDA ###
-- Creamos una política para los copropietarios, para que puedan ver todos los detalles
-- de su fracción, incluyendo su ID de propietario en la tabla real.
CREATE POLICY "Los propietarios pueden leer todas las fracciones de la tabla real."
ON public.propiedad_alfa
FOR SELECT USING (
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'COPROPIETARIO'
);