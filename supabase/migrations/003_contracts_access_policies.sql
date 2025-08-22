-- ### MIGRACIÓN: POLÍTICAS DE ACCESO A CONTRATOS ###
-- Fecha: 2024
-- Descripción: Añadir políticas RLS específicas para la tabla contracts
-- que permitan a los COPROPIETARIOS ver únicamente sus propios contratos

-- ### PASO 1: HABILITAR RLS EN TABLA CONTRACTS ###
-- Habilitar RLS en la tabla de contratos si no se ha hecho
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

-- ### PASO 2: POLÍTICA PARA PROPIETARIOS ###
-- Crear la política que da permiso de lectura a los dueños del contrato
CREATE POLICY "Los propietarios pueden ver sus propios contratos."
ON public.contracts FOR SELECT
USING (
  -- La siguiente línea busca el 'user_id' en la tabla 'profiles' que corresponde
  -- al 'buyer_id' del contrato, y lo compara con el ID del usuario actual.
  auth.uid() = (SELECT user_id FROM public.profiles WHERE id = buyer_id)
);

-- ### PASO 3: POLÍTICA PARA ADMINISTRADORES ###
-- Asegurarse de que los admins todavía tengan acceso total (si esta política no existe)
CREATE POLICY "Los admins tienen acceso total a los contratos."
ON public.contracts FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN'
);

-- ### COMENTARIOS ADICIONALES ###
-- Esta migración implementa:
-- 1. RLS habilitado en la tabla contracts
-- 2. Política SELECT para COPROPIETARIOS: solo ven sus propios contratos
-- 3. Política ALL para ADMIN: acceso completo a todos los contratos
-- 
-- Seguridad implementada:
-- - Los usuarios solo pueden ver contratos donde son el buyer_id
-- - Los administradores mantienen acceso total
-- - Previene acceso no autorizado a información de contratos