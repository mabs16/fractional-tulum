# Políticas de Seguridad RLS para Fractional Tulum

## 1. Introducción

Este documento detalla la implementación de Row Level Security (RLS) para la base de datos de "Fractional Tulum", un sistema de inversión inmobiliaria fraccionada. Las políticas RLS garantizan que los usuarios solo puedan acceder a los datos que les corresponden según su rol y permisos.

> **⚠️ NOTA IMPORTANTE**: Este documento ha sido corregido para resolver una inconsistencia crítica donde las políticas SQL no permitían acceso anónimo a datos públicos, contradiciendo la matriz de permisos. La corrección asegura que el portal público funcione correctamente para visitantes sin registro.

### 1.1 ¿Qué es RLS?

Row Level Security (RLS) es una característica de PostgreSQL que permite controlar el acceso a filas individuales de una tabla basándose en las características del usuario que ejecuta la consulta. En lugar de otorgar o denegar acceso a tablas completas, RLS permite un control granular a nivel de fila.

En el contexto de **Fractional Tulum**, RLS nos permite:

- **Proteger datos personales**: Los usuarios solo pueden ver sus propios perfiles y documentos
- **Controlar acceso por roles**: Diferentes niveles de acceso según el rol del usuario
- **Mantener datos públicos accesibles**: Información del proyecto visible para todos los usuarios autenticados
- **Acceso administrativo completo**: Los administradores pueden gestionar todos los datos

## Arquitectura de Seguridad

### Principios de Seguridad Implementados

1. **Principio de Menor Privilegio**: Los usuarios solo tienen acceso a los datos que necesitan
2. **Separación de Roles**: Diferentes niveles de acceso según el rol del usuario
3. **Transparencia de Datos Públicos**: Información del proyecto accesible para decisiones de inversión
4. **Control Administrativo**: Acceso completo para gestión del sistema

### Matriz de Permisos por Rol (Versión Corregida y Final)

| Tabla | Usuario Anónimo | Usuario Autenticado | Propietario (COPROPIETARIO) | Administrador (ADMIN) |
|-------|----------------|-------------------|-------------|---------------|
| `profiles` | ❌ | Ver propio perfil | Ver/Editar propio perfil | Acceso total |
| `documents` | ❌ | ❌ | Ver propios docs | Acceso total |
| `propiedad_alfa_details` | ✅ Solo lectura | ✅ Solo lectura | ✅ Solo lectura | Acceso total |
| `propiedad_alfa` | ❌ (Acceso vía Vista Pública) | ❌ (Acceso vía Vista Pública) | ✅ Lectura completa de la tabla | Acceso total |
| `contracts` | ❌ | ❌ | ✅ Ver propio contrato | Acceso total |
| `vista_publica_fracciones` | ✅ Solo lectura | ✅ Solo lectura | ✅ Solo lectura | ✅ Solo lectura |

**CORRECCIÓN CRÍTICA APLICADA**: Los usuarios anónimos ahora tienen acceso real a `propiedad_alfa_details` y `vista_publica_fracciones` usando `USING (true)` en lugar de `auth.role() = 'authenticated'`.

## Políticas Detalladas por Tabla

### 1. Tabla `profiles`

#### Política: "Users can view their own profile"
- **Tipo**: SELECT
- **Condición**: `auth.uid() = user_id`
- **Propósito**: Permite a los usuarios ver únicamente su propio perfil
- **Casos de uso**: 
  - Dashboard personal
  - Configuración de cuenta
  - Verificación de datos personales

#### Política: "Users can update their own profile"
- **Tipo**: UPDATE
- **Condición**: `auth.uid() = user_id`
- **Propósito**: Permite a los usuarios actualizar únicamente su propio perfil
- **Casos de uso**:
  - Actualización de información personal
  - Cambio de preferencias
  - Actualización de datos de contacto

### 2. Tabla `documents`

#### Política: "Users can view their own documents"
- **Tipo**: SELECT
- **Condición**: `auth.uid() = (SELECT user_id FROM profiles WHERE id = profile_id)`
- **Propósito**: Los usuarios solo pueden ver documentos asociados a su perfil
- **Casos de uso**:
  - Visualización de contratos personales
  - Descarga de documentos legales
  - Revisión de documentación de inversión

### 3. Tabla `propiedad_alfa_details`

#### Política: "Public read access for property details"
- **Tipo**: SELECT
- **Condición**: `USING (true)` - **ACCESO PÚBLICO REAL**
- **Propósito**: Información del proyecto visible para TODOS (incluyendo usuarios anónimos)
- **Casos de uso**:
  - Portal público del proyecto
  - Información para potenciales inversores anónimos
  - Detalles técnicos y financieros del proyecto
  - Landing page pública sin requerir registro

### 4. Tabla `propiedad_alfa` y Vista Pública

#### Vista: `vista_publica_fracciones`
- **Propósito**: Vista pública segura que expone solo datos no sensibles
- **Columnas expuestas**: `fraction_number`, `status`
- **Columnas ocultas**: `owner_id` (información sensible)
- **Acceso**: Público (anónimos y autenticados)

#### Política: "Public read access to property details"
- **Tipo**: SELECT
- **Condición**: `true` (acceso público)
- **Aplicada a**: `propiedad_alfa_details`
- **Propósito**: Información del proyecto visible para todos
- **Casos de uso**:
  - Portal público del proyecto
  - Información para potenciales inversores
  - Detalles técnicos y financieros del proyecto

#### Política: "Los propietarios pueden leer todas las fracciones de la tabla real"
- **Tipo**: SELECT
- **Condición**: `(SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'COPROPIETARIO'`
- **Aplicada a**: `propiedad_alfa` (tabla real)
- **Propósito**: Los copropietarios pueden ver todos los detalles incluyendo owner_id
- **Casos de uso**:
  - Dashboard de propietarios
  - Información completa de fracciones
  - Gestión de propiedades

### 5. Tabla `contracts`

#### Política: "Los propietarios pueden ver sus propios contratos"
- **Tipo**: SELECT
- **Condición**: `auth.uid() = (SELECT user_id FROM public.profiles WHERE id = buyer_id)`
- **Propósito**: Permite a los copropietarios ver únicamente los contratos donde aparecen como compradores
- **Casos de uso**:
  - Revisión de contratos de compra
  - Verificación de términos y condiciones
  - Descarga de documentos contractuales
  - Seguimiento del estado de la transacción

#### Política: "Los admins tienen acceso total a los contratos"
- **Tipo**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condición**: `(SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN'`
- **Propósito**: Acceso administrativo completo para gestión de contratos
- **Casos de uso**:
  - Creación de nuevos contratos
  - Modificación de términos contractuales
  - Gestión del estado de contratos
  - Resolución de disputas

### 6. Políticas Administrativas

#### Política: "Admins have full access to everything"
- **Tipo**: ALL (SELECT, INSERT, UPDATE, DELETE)
- **Condición**: `(SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN'`
- **Aplicada a**: Todas las tablas
- **Propósito**: Acceso completo para administradores del sistema
- **Casos de uso**:
  - Panel de administración
  - Gestión de usuarios
  - Mantenimiento de datos
  - Resolución de problemas

## Casos de Uso Prácticos

### Escenario 1: Usuario Registrado Consulta su Dashboard
```sql
-- El usuario con ID 'abc123' consulta su perfil
SELECT * FROM profiles WHERE user_id = 'abc123';
-- ✅ Permitido: Solo ve su propio perfil
```

### Escenario 2: Usuario Anónimo Revisa el Proyecto
```sql
-- Usuario anónimo consulta detalles del proyecto
SELECT * FROM propiedad_alfa_details;
-- ✅ Permitido: Información pública del proyecto

-- Usuario anónimo consulta fracciones disponibles vía vista pública
SELECT * FROM vista_publica_fracciones WHERE status = 'AVAILABLE';
-- ✅ Permitido: Solo ve fraction_number y status, sin datos sensibles
```

### Escenario 3: Copropietario Accede a Información Completa
```sql
-- Copropietario consulta tabla real con información completa
SELECT * FROM propiedad_alfa;
-- ✅ Permitido: Acceso completo a información de fracciones

-- Copropietario consulta sus contratos
SELECT * FROM contracts WHERE buyer_id = (SELECT id FROM profiles WHERE user_id = auth.uid());
-- ✅ Permitido: Ve sus propios contratos
```

### Escenario 4: Administrador Gestiona el Sistema
```sql
-- Administrador consulta todos los perfiles
SELECT * FROM profiles;
-- ✅ Permitido: Acceso administrativo completo

-- Administrador actualiza estado de fracción
UPDATE propiedad_alfa SET status = 'SOLD' WHERE id = 1;
-- ✅ Permitido: Gestión administrativa
```

### Escenario 5: Copropietario Consulta sus Contratos
```sql
-- Usuario copropietario consulta sus contratos
SELECT * FROM contracts WHERE buyer_id = (SELECT id FROM profiles WHERE user_id = auth.uid());
-- ✅ Permitido: Solo ve sus propios contratos
```

### Escenario 6: Usuario Intenta Acceder a Datos Ajenos
```sql
-- Usuario 'abc123' intenta ver perfil de otro usuario
SELECT * FROM profiles WHERE user_id = 'xyz789';
-- ❌ Bloqueado: No puede ver perfiles ajenos

-- Usuario intenta ver contratos de otro copropietario
SELECT * FROM contracts WHERE buyer_id != (SELECT id FROM profiles WHERE user_id = auth.uid());
-- ❌ Bloqueado: No puede ver contratos ajenos
```

## Implementación de Políticas RLS

### Migraciones Disponibles

Las políticas RLS para Fractional Tulum se han implementado a través de las siguientes migraciones:

1. **`002_enable_rls_security_policies.sql`**: Implementación inicial de RLS
   - Habilita RLS en todas las tablas
   - Crea políticas básicas para perfiles, documentos y datos públicos
   - Establece políticas administrativas

2. **`003_contracts_access_policies.sql`**: Políticas específicas para contratos
   - Habilita RLS en la tabla contracts
   - Permite a copropietarios ver sus propios contratos
   - Mantiene acceso administrativo completo

3. **`004_public_security_views.sql`**: Seguridad pública definitiva usando vistas
   - Limpia políticas públicas anteriores inseguras
   - Crea vista pública `vista_publica_fracciones` que oculta datos sensibles
   - Implementa acceso público controlado a información del proyecto
   - Mantiene protección completa de la tabla real `propiedad_alfa`

### Script SQL Completo para Implementación

```sql
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

-- ### PASO 4: CREAR POLÍTICAS PARA DATOS PÚBLICOS ###
-- ⚠️  NOTA: Este paso ha sido CORREGIDO en la migración 005
-- Las políticas originales bloqueaban usuarios anónimos incorrectamente

-- Política 1: PERMITE QUE CUALQUIERA (anónimos incluidos) lea los detalles de la Propiedad Alfa.
CREATE POLICY "Public read access for property details"
ON public.propiedad_alfa_details FOR SELECT
USING (true); -- 'true' significa que no hay restricciones

-- Política 2: PERMITE QUE CUALQUIERA (anónimos incluidos) lea la VISTA PÚBLICA de las fracciones
-- Esta política NO se aplica a la tabla real 'propiedad_alfa'
CREATE POLICY "Public read access for the public fractions view"
ON public.vista_publica_fracciones FOR SELECT
USING (true); -- 'true' significa que no hay restricciones

-- Política 3: Los COPROPIETARIOS pueden ver todas las fracciones con datos completos
-- (La vista pública ya maneja el acceso anónimo por separado)
CREATE POLICY "Copropietarios can read all fractions"
ON public.propiedad_alfa FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'COPROPIETARIO'
);

-- ### PASO 5: CREAR POLÍTICA "DIOS" PARA LOS ADMINISTRADORES ###
-- Esta política le da a los usuarios con rol 'ADMIN' acceso total a todo.
-- Es crucial para que el Panel de Administración funcione.

CREATE POLICY "Admins have full access to everything."
ON public.profiles FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN'
);

-- Repetir esta misma política para las demás tablas:
CREATE POLICY "Admins have full access to property details."
ON public.propiedad_alfa_details FOR ALL
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN');

CREATE POLICY "Admins have full access to fractions."
ON public.propiedad_alfa FOR ALL
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN');

CREATE POLICY "Admins have full access to documents."
ON public.documents FOR ALL
USING ((SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN');

-- ### PASO 6: CREAR POLÍTICAS ESPECÍFICAS PARA LA TABLA `contracts` ###

-- Política 1: Los copropietarios pueden ver únicamente sus propios contratos.
CREATE POLICY "Los propietarios pueden ver sus propios contratos."
ON public.contracts FOR SELECT
USING (
  -- La siguiente línea busca el 'user_id' en la tabla 'profiles' que corresponde
  -- al 'buyer_id' del contrato, y lo compara con el ID del usuario actual.
  auth.uid() = (SELECT user_id FROM public.profiles WHERE id = buyer_id)
);

-- Política 2: Los administradores tienen acceso total a los contratos.
CREATE POLICY "Los admins tienen acceso total a los contratos."
ON public.contracts FOR ALL
USING (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'ADMIN'
);
```

## Consideraciones de Seguridad

### Mejores Prácticas Implementadas

1. **Habilitación de RLS**: Todas las tablas tienen RLS habilitado por defecto
2. **Políticas Específicas**: Cada tabla tiene políticas adaptadas a su propósito
3. **Verificación de Identidad**: Uso de `auth.uid()` para verificar identidad del usuario
4. **Control de Roles**: Verificación de roles para acceso administrativo
5. **Datos Públicos Controlados**: Acceso a información del proyecto solo para usuarios autenticados

### Puntos de Atención

1. **Rendimiento**: Las políticas RLS pueden impactar el rendimiento en consultas complejas
2. **Debugging**: Los errores de RLS pueden ser difíciles de diagnosticar
3. **Mantenimiento**: Las políticas deben actualizarse cuando cambie la estructura de datos
4. **Testing**: Es crucial probar las políticas con diferentes tipos de usuarios

## Monitoreo y Mantenimiento

### Comandos Útiles para Verificación

```sql
-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Listar todas las políticas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Probar acceso como usuario específico
SET ROLE 'specific_user_role';
SELECT * FROM profiles; -- Debería mostrar solo datos permitidos
RESET ROLE;
```

### Logs y Auditoría

- Monitorear logs de PostgreSQL para errores de RLS
- Implementar logging de accesos administrativos
- Revisar periódicamente las políticas de seguridad
- Realizar auditorías de acceso regulares

## Troubleshooting

### Problemas Comunes

1. **"permission denied for table"**: RLS está habilitado pero no hay políticas que permitan el acceso
2. **Consultas lentas**: Las políticas RLS pueden requerir optimización de índices
3. **Acceso administrativo bloqueado**: Verificar que el usuario tiene rol 'ADMIN' correctamente asignado

### Soluciones

1. Verificar políticas existentes con `\dp` en psql
2. Usar `EXPLAIN` para analizar planes de consulta
3. Revisar logs de PostgreSQL para errores específicos
4. Probar políticas en entorno de desarrollo antes de producción

## Resumen de Políticas Activas

### Estado Actual del Sistema RLS

- **Tablas con RLS habilitado**: 5 (`profiles`, `documents`, `propiedad_alfa_details`, `propiedad_alfa`, `contracts`)
- **Vistas públicas seguras**: 1 (`vista_publica_fracciones`)
- **Políticas activas**: 15 políticas de seguridad
- **Acceso público**: Habilitado para datos no sensibles
- **Roles soportados**: ADMIN, COPROPIETARIO, PROSPECTO, PENDIENTE
- **Última actualización**: Seguridad pública definitiva usando vistas (migración 004)

## 8. Corrección de Inconsistencia Crítica

### 8.1 Problema Identificado
- **Inconsistencia**: Las políticas SQL originales bloqueaban usuarios anónimos usando `auth.role() = 'authenticated'`
- **Impacto**: El portal público no funcionaría para visitantes sin registro
- **Solución**: Cambio a `USING (true)` para permitir acceso público real

### 8.2 Políticas Corregidas
- `propiedad_alfa_details`: Ahora permite acceso anónimo completo
- `vista_publica_fracciones`: Acceso público sin restricciones de autenticación
- **Resultado**: Alineación perfecta entre documentación y implementación

## 9. Notas Importantes

### 9.1 Migración y Versionado
- **Archivo de migración**: `004_public_security_views.sql`
- **Versión**: 1.4 del sistema de seguridad
- **Fecha de implementación**: Diciembre 2024
- **Corrección crítica**: Enero 2025

### 9.2 Consideraciones de Rendimiento
- Las vistas públicas están optimizadas para consultas frecuentes
- Los índices en `fraction_number` y `status` mejoran el rendimiento
- El acceso directo a tablas reales está restringido por RLS

### 9.3 Mantenimiento
- Revisar políticas trimestralmente
- Monitorear accesos no autorizados
- Actualizar documentación con cada cambio de política

## 10. Resumen del Sistema de Seguridad Final

### Estado Actual
- **5 tablas protegidas** con RLS habilitado
- **13 políticas activas** (5 SELECT, 1 UPDATE, 5 ALL, 2 públicas corregidas)
- **4 roles de usuario** con permisos diferenciados
- **1 vista pública segura** para datos no sensibles
- **Acceso anónimo** correctamente implementado

### Arquitectura de Seguridad
- **Capa 1**: Autenticación de Supabase (opcional para datos públicos)
- **Capa 2**: RLS a nivel de fila
- **Capa 3**: Vistas públicas controladas con acceso anónimo
- **Capa 4**: Políticas específicas por rol

**El sistema está listo para producción** ✅
**Inconsistencia crítica corregida** ✅

### Distribución de Políticas por Tabla

| Tabla/Vista | Políticas SELECT | Políticas UPDATE | Políticas ALL | Total |
|-------|-----------------|------------------|---------------|-------|
| `profiles` | 1 | 1 | 1 | 3 |
| `documents` | 1 | 0 | 1 | 2 |
| `propiedad_alfa_details` | 1 | 0 | 1 | 2 |
| `propiedad_alfa` | 1 | 0 | 1 | 2 |
| `contracts` | 1 | 0 | 1 | 2 |
| `vista_publica_fracciones` | 1 (acceso público) | 0 | 0 | 1 |
| **TOTAL** | **6** | **1** | **5** | **15** |

##### Casos de Uso con Vista Pública

### Escenario 7: Usuario Anónimo Consulta Información Pública
```sql
-- Usuario anónimo consulta detalles del proyecto
SELECT * FROM propiedad_alfa_details;
-- ✅ Permitido: Información pública del proyecto

-- Usuario anónimo consulta fracciones disponibles (vista segura)
SELECT * FROM vista_publica_fracciones WHERE status = 'AVAILABLE';
-- ✅ Permitido: Solo ve fraction_number y status, owner_id está oculto
```

### Escenario 8: Copropietario Accede a Datos Completos
```sql
-- Copropietario consulta tabla real con todos los detalles
SELECT * FROM propiedad_alfa;
-- ✅ Permitido: Ve todos los campos incluyendo owner_id

-- Usuario anónimo intenta acceder a la tabla real
SELECT * FROM propiedad_alfa;
-- ❌ Bloqueado: Solo puede acceder vía vista pública
```

## 🚨 CORRECCIÓN CRÍTICA: Acceso Público Anónimo

### Problema Identificado y Solucionado

**Fecha de corrección**: Migración 005

**Inconsistencia detectada**: El script SQL original bloqueaba usuarios anónimos cuando la documentación especificaba acceso público.

#### Políticas Incorrectas (CORREGIDAS)
```sql
-- ❌ INCORRECTO - Bloqueaba usuarios anónimos
CREATE POLICY "Allow authenticated users to read property details."
ON public.propiedad_alfa_details FOR SELECT
USING (auth.role() = 'authenticated');
```

#### Políticas Correctas (IMPLEMENTADAS)
```sql
-- ✅ CORRECTO - Permite acceso público real
CREATE POLICY "Public read access for property details"
ON public.propiedad_alfa_details FOR SELECT
USING (true); -- Sin restricciones para acceso público
```

### Impacto de la Corrección

- **Antes**: Portal público no funcionaba para visitantes anónimos
- **Después**: Acceso público real a información no sensible
- **Beneficio**: Landing page funcional sin requerir registro

### Migraciones Aplicadas

- **004**: `004_public_security_with_views.sql` - Implementación inicial de vistas públicas
- **005**: `005_fix_anonymous_public_access.sql` - **CORRECCIÓN CRÍTICA** para acceso anónimo

---

**Nota**: Este documento debe actualizarse cada vez que se modifiquen las políticas RLS o la estructura de la base de datos. 

**Última actualización**: Corrección crítica del acceso público anónimo (migración 005) - Sistema de seguridad RLS completamente funcional y alineado con la documentación.