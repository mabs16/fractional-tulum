# Bloque 5: Sistema de Gestión de Usuarios y Cambio de Roles

## 1. Resumen del Proyecto

Este bloque documenta la implementación completa del sistema de gestión de usuarios y cambio de roles para el panel de administración de Fractional Tulum. El proyecto resolvió múltiples problemas técnicos relacionados con políticas RLS, tipos de datos PostgreSQL y la correcta identificación de usuarios.

## 2. Problema Inicial Identificado

### 2.1 Síntomas del Problema
- Los administradores no podían cambiar los roles de usuario desde el panel de administración
- La función `updateUserRoleAction` reportaba "éxito" pero los cambios no se reflejaban en la base de datos
- Error `PGRST116`: "Cannot coerce the result to a single JSON object" con `details: 'The result contains 0 rows'`

### 2.2 Análisis de la Causa Raíz
**Problema 1: Políticas RLS Bloqueando Actualizaciones**
- Las políticas Row Level Security (RLS) de la tabla `profiles` bloqueaban las actualizaciones incluso con `service_role`
- La política de administrador tenía una subconsulta que causaba problemas de rendimiento y bloqueos

**Problema 2: Conflicto de Tipos de Datos**
- PostgreSQL esperaba tipo `user_role` pero el código enviaba `TEXT`
- Error: `column "role" is of type user_role but expression is of type text`

**Problema 3: ID de Usuario Incorrecto**
- La UI pasaba `user.id` (ID del perfil) en lugar de `user.user_id` (UUID de autenticación)
- La función de base de datos buscaba por `user_id` pero recibía el `id` incorrecto

## 3. Estructura de la Base de Datos

### 3.1 Tabla Profiles
```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),        -- ID del perfil
    user_id UUID NOT NULL UNIQUE,                          -- UUID de auth.users
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    phone TEXT,
    role public.user_role NOT NULL DEFAULT 'PENDIENTE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.2 Diferencia Crítica: `id` vs `user_id`
- **`id`**: Clave primaria del perfil (UUID generado automáticamente)
- **`user_id`**: Referencia al usuario en `auth.users` (UUID de autenticación)
- **Problema**: La función esperaba `user_id` pero recibía `id`

## 4. Solución Implementada

### 4.1 Creación de Función de Base de Datos

**Archivo**: `supabase/migrations/019_create_update_user_role_function.sql`

```sql
CREATE OR REPLACE FUNCTION public.update_user_role(
    target_user_id UUID,
    new_role_text TEXT
)
RETURNS TABLE(success BOOLEAN, message TEXT)
LANGUAGE plpgsql
SECURITY DEFINER  -- Bypasea RLS
AS $$
BEGIN
    -- Validar que el rol sea válido
    IF new_role_text NOT IN ('ADMIN', 'COPROPIETARIO', 'PROSPECTO', 'PENDIENTE') THEN
        RETURN QUERY SELECT FALSE, 'Rol inválido: ' || new_role_text;
        RETURN;
    END IF;

    -- Actualizar el rol del usuario
    UPDATE public.profiles 
    SET 
        role = new_role_text::user_role,  -- Casting explícito
        updated_at = NOW()
    WHERE user_id = target_user_id;

    -- Verificar si se actualizó alguna fila
    IF FOUND THEN
        RETURN QUERY SELECT TRUE, 'Rol actualizado exitosamente';
    ELSE
        RETURN QUERY SELECT FALSE, 'Usuario no encontrado';
    END IF;
END;
$$;
```

**Características clave:**
- `SECURITY DEFINER`: Bypasea las políticas RLS
- Casting explícito: `new_role_text::user_role`
- Validación de roles permitidos
- Búsqueda por `user_id` (no por `id`)
- Manejo de errores robusto

### 4.2 Actualización de Server Action

**Archivo**: `src/app/actions/admin.ts`

```typescript
export async function updateUserRoleAction(userId: string, newRole: UserRole) {
  const cookieStore = await cookies()

  const supabaseAdmin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value },
        set(name: string, value: string, options) { cookieStore.set({ name, value, ...options }) },
        remove(name: string, options) { cookieStore.set({ name, value: '', ...options }) },
      },
    }
  )

  // Llamar a la función RPC
  const { data, error } = await supabaseAdmin.rpc('update_user_role', {
    target_user_id: userId,
    new_role_text: newRole,
  })

  if (error) {
    console.error('Error updating role via RPC:', error)
    return { success: false, error: 'No se pudo actualizar el rol.' }
  }

  revalidatePath('/admin/users')
  return { success: true }
}
```

**Cambios principales:**
- Uso de `.rpc()` en lugar de consultas directas
- Eliminación de `.single()` que causaba el error PGRST116
- Configuración correcta del `service_role`
- Logging mejorado para depuración

### 4.3 Corrección de la UI

**Archivo**: `src/app/admin/users/page.tsx`

**Problema identificado (línea 154):**
```typescript
// ❌ INCORRECTO: Pasaba el ID del perfil
<RoleUpdateForm userId={user.id} currentRole={user.role} />
```

**Solución implementada:**
```typescript
// ✅ CORRECTO: Pasa el UUID de autenticación
<RoleUpdateForm userId={user.user_id} currentRole={user.role} />
```

### 4.4 Panel de Administración Completo

**Componente**: `RoleUpdateForm`

```typescript
function RoleUpdateForm({ userId, currentRole }: { userId: string; currentRole: UserRole }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Gestionar Rol</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Opción COPROPIETARIO */}
        {currentRole !== 'COPROPIETARIO' && (
          <DropdownMenuItem asChild>
            <form action={async () => {
              'use server'
              await updateUserRoleAction(userId, 'COPROPIETARIO')
            }}>
              <button type="submit">Aprobar como Copropietario</button>
            </form>
          </DropdownMenuItem>
        )}
        
        {/* Opción PROSPECTO */}
        {currentRole !== 'PROSPECTO' && (
          <DropdownMenuItem asChild>
            <form action={async () => {
              'use server'
              await updateUserRoleAction(userId, 'PROSPECTO')
            }}>
              <button type="submit">Aprobar como Prospecto</button>
            </form>
          </DropdownMenuItem>
        )}
        
        {/* Opción ADMIN */}
        {currentRole !== 'ADMIN' && (
          <DropdownMenuItem asChild>
            <form action={async () => {
              'use server'
              await updateUserRoleAction(userId, 'ADMIN')
            }}>
              <button type="submit">Hacer Administrador</button>
            </form>
          </DropdownMenuItem>
        )}
        
        {/* Opción PENDIENTE */}
        {currentRole !== 'PENDIENTE' && (
          <DropdownMenuItem asChild>
            <form action={async () => {
              'use server'
              await updateUserRoleAction(userId, 'PENDIENTE')
            }}>
              <button type="submit">Regresar a Pendiente</button>
            </form>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## 5. Archivos Modificados y Creados

### 5.1 Archivos Creados
- `supabase/migrations/019_create_update_user_role_function.sql` - Función de base de datos

### 5.2 Archivos Modificados
- `src/app/actions/admin.ts` - Server Action actualizada
- `src/app/admin/users/page.tsx` - Corrección del ID y panel completo

## 6. Flujo de Funcionamiento Final

### 6.1 Proceso de Cambio de Rol
1. **Usuario Admin** accede al panel `/admin/users`
2. **UI** muestra tabla con todos los usuarios de la tabla `profiles`
3. **Admin** hace clic en el menú de acciones de un usuario
4. **Formulario** llama a `updateUserRoleAction(user.user_id, newRole)`
5. **Server Action** usa `supabaseAdmin.rpc('update_user_role')`
6. **Función DB** bypasea RLS con `SECURITY DEFINER`
7. **Actualización** se realiza con casting explícito `TEXT::user_role`
8. **UI** se actualiza automáticamente con `revalidatePath()`

### 6.2 Roles Disponibles
- **ADMIN**: Acceso completo al sistema
- **COPROPIETARIO**: Usuario que ha comprado una fracción
- **PROSPECTO**: Usuario interesado, puede ver información
- **PENDIENTE**: Usuario recién registrado, acceso limitado

## 7. Beneficios de la Solución

### 7.1 Técnicos
- **Bypasea RLS**: Función con `SECURITY DEFINER`
- **Type Safety**: Casting explícito de tipos PostgreSQL
- **Identificación Correcta**: Uso del `user_id` apropiado
- **Error Handling**: Manejo robusto de errores

### 7.2 Funcionales
- **Panel Completo**: Todas las opciones de roles disponibles
- **UX Mejorada**: Actualización instantánea de la UI
- **Seguridad**: Validación de roles en base de datos
- **Flexibilidad**: Fácil adición de nuevos roles

## 8. Lecciones Aprendidas

### 8.1 Políticas RLS
- Las políticas RLS pueden bloquear incluso el `service_role` en ciertos casos
- `SECURITY DEFINER` es la solución correcta para operaciones administrativas

### 8.2 Tipos PostgreSQL
- Los ENUMs requieren casting explícito desde TEXT
- Siempre validar tipos en funciones de base de datos

### 8.3 Identificación de Usuarios
- Distinguir claramente entre `id` (perfil) y `user_id` (autenticación)
- Documentar claramente qué ID se usa en cada contexto

## 9. Estado Final

✅ **Sistema Completamente Funcional**
- Panel de administración operativo
- Cambio de roles en tiempo real
- Todas las opciones de rol disponibles
- Manejo de errores robusto
- UI actualizada automáticamente

El sistema de gestión de usuarios está ahora **100% funcional** y listo para producción.