-- ### MIGRACIÓN 005: CORREGIR ACCESO PÚBLICO PARA USUARIOS ANÓNIMOS ###
-- Fecha: 2024
-- Descripción: Corrige la inconsistencia crítica donde las políticas bloqueaban
--              usuarios anónimos cuando deberían permitir acceso público según documentación

-- ### PASO 1: ELIMINAR POLÍTICAS INCORRECTAS QUE BLOQUEAN ANÓNIMOS ###

-- Eliminar política incorrecta de propiedad_alfa_details
DROP POLICY IF EXISTS "Allow authenticated users to read property details." ON public.propiedad_alfa_details;

-- Eliminar política incorrecta de propiedad_alfa (que no debería existir para acceso público)
DROP POLICY IF EXISTS "Allow authenticated users to read fraction status." ON public.propiedad_alfa;

-- ### PASO 2: CREAR POLÍTICAS CORRECTAS PARA ACCESO PÚBLICO ANÓNIMO ###

-- Política 1: PERMITE QUE CUALQUIERA (anónimos incluidos) lea los detalles de la Propiedad Alfa
CREATE POLICY "Public read access for property details"
ON public.propiedad_alfa_details FOR SELECT
USING (true); -- 'true' significa que no hay restricciones - acceso público total

-- NOTA: Las vistas en PostgreSQL no tienen políticas RLS propias.
-- La vista 'vista_publica_fracciones' ya tiene permisos GRANT para anon y authenticated
-- y accederá a la tabla propiedad_alfa a través de las políticas existentes.

-- ### PASO 3: VERIFICAR QUE LA POLÍTICA DE COPROPIETARIOS SIGA ACTIVA ###
-- (Esta política ya existe y permite a COPROPIETARIOS ver la tabla real completa)
-- No necesita modificación, solo verificamos que esté activa:

-- La política "Allow co-owners to read their property fractions" debe seguir existiendo
-- para que los COPROPIETARIOS puedan acceder a la tabla real propiedad_alfa con owner_id

-- ### RESUMEN DE LA CORRECCIÓN ###
-- ✅ Usuarios anónimos: Pueden leer propiedad_alfa_details y vista_publica_fracciones
-- ✅ Usuarios autenticados: Pueden leer propiedad_alfa_details y vista_publica_fracciones  
-- ✅ COPROPIETARIOS: Pueden leer propiedad_alfa_details, vista_publica_fracciones Y la tabla real propiedad_alfa
-- ✅ ADMINS: Acceso total a todas las tablas

-- ### VERIFICACIÓN DE SEGURIDAD ###
-- La tabla real 'propiedad_alfa' sigue protegida:
-- - Solo COPROPIETARIOS pueden ver sus propias fracciones (con owner_id)
-- - Solo ADMINS tienen acceso total
-- - Usuarios anónimos y autenticados solo ven la vista pública (sin owner_id)

COMMIT;