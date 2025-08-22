-- #############################################################################
-- ##      SCRIPT DE SEGURIDAD INICIAL (RLS) PARA "FRACTIONAL TULUM"          ##
-- #############################################################################

-- ### PASO 1: HABILITAR RLS EN CADA TABLA ###
-- Esto "cierra la puerta" de cada tabla. A partir de ahora, nadie puede
-- acceder a menos que una política explícita se lo permita.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propiedad_alfa_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propiedad_alfa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- ### PASO 2: CREAR POLÍTICAS PARA LA TABLA `profiles` ###

-- Política 1: Los usuarios pueden ver su propio perfil.
CREATE POLICY "Users can view their own profile."
ON public.profiles FOR SELECT
USING (auth.uid() = user_id);

-- Política 2: Los usuarios pueden actualizar su propio perfil.
CREATE POLICY "Users can update their own profile."
ON public.profiles FOR UPDATE
USING (auth.uid() = user_id);

-- ### PASO 3: CREAR POLÍTICAS PARA LA TABLA `documents` ###

-- Política 1: Los usuarios pueden ver los documentos que les pertenecen.
CREATE POLICY "Users can view their own documents."
ON public.documents FOR SELECT
USING (auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id));

-- ### PASO 4: CREAR POLÍTICAS PARA DATOS PÚBLICOS O DE ROLES ESPECÍFICOS ###

-- Política 1: CUALQUIER usuario autenticado puede ver los detalles de la Propiedad Alfa.
-- Esto es necesario para que el portal público pueda mostrar la información del proyecto.
CREATE POLICY "Allow authenticated users to read property details."
ON public.propiedad_alfa_details FOR SELECT
USING (auth.role() = 'authenticated');

-- Política 2: CUALQUIER usuario autenticado puede ver el estado de las fracciones.
CREATE POLICY "Allow authenticated users to read fraction status."
ON public.propiedad_alfa FOR SELECT
USING (auth.role() = 'authenticated');

-- ### PASO 5: CREAR POLÍTICA "DIOS" PARA LOS ADMINISTRADORES ###
-- Esta política le da a los usuarios con rol 'ADMIN' acceso total a todo.
-- Es crucial para que el Panel de Administración funcione.

CREATE POLICY "Admins have full access to everything."
ON public.profiles FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN'
);

-- Repetir esta misma política para las demás tablas:
-- propiedad_alfa_details, propiedad_alfa, documents, contracts
CREATE POLICY "Admins have full access to property details."
ON public.propiedad_alfa_details FOR ALL
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN');

CREATE POLICY "Admins have full access to fractions."
ON public.propiedad_alfa FOR ALL
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN');

CREATE POLICY "Admins have full access to documents."
ON public.documents FOR ALL
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN');

CREATE POLICY "Admins have full access to contracts."
ON public.contracts FOR ALL
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN');

-- ### VERIFICACIÓN FINAL ###
-- Comentarios para verificar que todo se aplicó correctamente:

-- Para verificar que RLS está habilitado:
-- SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Para listar todas las políticas creadas:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual FROM pg_policies WHERE schemaname = 'public';

-- ### NOTAS IMPORTANTES ###
-- 1. Este script debe ejecutarse después de crear la estructura inicial de la base de datos
-- 2. Las políticas RLS protegen los datos a nivel de fila según el usuario autenticado
-- 3. Los administradores (role = 'ADMIN') tienen acceso completo a todas las tablas
-- 4. Los usuarios regulares solo pueden ver/editar sus propios datos
-- 5. Los datos del proyecto (propiedad_alfa_details y propiedad_alfa) son públicos para usuarios autenticados