# Fractional Tulum - Bloque 4: Implementación del Flujo de Autenticación

## 1. Misión del Bloque

**Objetivo Principal:** Transformar las páginas vacías de autenticación en un sistema completamente funcional y profesional que permita el registro de nuevos usuarios, gestione su estado PENDIENTE y autentique a usuarios existentes, redirigiéndolos a su portal correcto según su rol.

**Alcance:** Construcción de la interfaz de usuario (UI) y la lógica de backend para las páginas de Registro (`/registro`), Login (`/login`) y Revisión (`/revision`).

## 2. Prerrequisitos

* ✅ **Bloque 3 completado al 100%:** Creación del Esqueleto Completo de Rutas

* ✅ **Base de datos configurada:** Estructura de Supabase con tablas y triggers

* ✅ **Componentes shadcn/ui instalados:** Card, Input, Label, Button, Badge

* ✅ **Configuración de Supabase:** Cliente configurado en el proyecto

## 3. Tareas Detalladas

### TAREA 4.1: Construcción de la UI de Registro (/registro)

**Archivo objetivo:** `/src/app/(auth)/registro/page.tsx`

#### Especificaciones de UI:

* **Framework de componentes:** shadcn/ui

* **Componentes requeridos:** Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Button

* **Layout:** Formulario centrado en la página

#### Campos del formulario:

1. **Nombre(s)** - Input text requerido
2. **Apellido(s)** - Input text requerido
3. **Correo Electrónico** - Input email requerido
4. **Contraseña** - Input password requerido

#### Botones sociales:

* **"Continuar con Google"** - Con ícono de Google

* **"Continuar con Apple"** - Con ícono de Apple

#### Elementos UX:

* **CardDescription:** "Solicita acceso a la plataforma de inversión."

* **CardFooter:** Enlace "¿Ya tienes una cuenta? Inicia sesión aquí" → `/login`

### TAREA 4.2: Implementación de la Lógica de Registro

**Tecnología:** Server Actions de Next.js

#### Lógica para Registro Manual:

```typescript
// Flujo de registro manual
1. Validar campos del formulario
2. Llamar a supabase.auth.signUp()
3. Pasar first_name y last_name en el objeto data de options
4. El trigger handle_new_user creará el perfil con rol PENDIENTE
5. Redirigir a /revision tras registro exitoso
```

#### Lógica para Registro Social:

```typescript
// Flujo de registro social
1. Invocar supabase.auth.signInWithOAuth() con proveedor (google/apple)
2. El trigger handle_new_user procesará los metadatos sociales
3. Crear perfil con rol PENDIENTE automáticamente
4. Redirigir a /revision al finalizar
```

### TAREA 4.3: Construcción de la UI de Login (/login)

**Archivo objetivo:** `/src/app/(auth)/login/page.tsx`

#### Especificaciones de UI:

* **Diseño:** Similar al formulario de registro

* **Componentes:** Mismos componentes shadcn/ui

#### Campos del formulario:

1. **Correo Electrónico** - Input email requerido
2. **Contraseña** - Input password requerido

#### Botones sociales:

* **"Continuar con Google"** - Con ícono de Google

* **"Continuar con Apple"** - Con ícono de Apple

#### Elementos UX:

* **Enlace:** "¿Olvidaste tu contraseña?"

* **CardFooter:** Enlace "¿Aún no tienes cuenta? Regístrate aquí" → `/registro`

### TAREA 4.4: Implementación de la Lógica de Login

**Tecnología:** Server Actions de Next.js

#### Flujo de autenticación:

```typescript
// Proceso de login
1. Llamar a supabase.auth.signInWithPassword() o signInWithOAuth()
2. Si autenticación exitosa → consultar tabla profiles para obtener role
3. Implementar lógica de redirección basada en rol:
   - ADMIN → /admin/dashboard
   - COPROPIETARIO → /copropietario/dashboard
   - PROSPECTO → /prospecto/bienvenida
   - PENDIENTE → /revision
4. Si falla → mostrar mensaje de error en formulario
```

#### Sistema de redirección por roles:

| Rol           | Destino                    | Descripción              |
| ------------- | -------------------------- | ------------------------ |
| ADMIN         | `/admin/dashboard`         | Panel de administración  |
| COPROPIETARIO | `/copropietario/dashboard` | Portal del copropietario |
| PROSPECTO     | `/prospecto/bienvenida`    | Área de prospecto        |
| PENDIENTE     | `/revision`                | Página de espera         |

### TAREA 4.5: Diseño de la Página de Revisión (/revision)

**Archivo objetivo:** `/src/app/(auth)/revision/page.tsx`

#### Especificaciones de UI:

* **Reemplazar:** `<h1>` simple por componente `<Card />` centrado

* **Componentes:** Card, CardHeader, CardTitle, CardContent, Badge

#### Contenido de la tarjeta:

1. **Ícono:** Advertencia o espera
2. **Título:** "Cuenta en Revisión"
3. **Texto explicativo:** "Tu solicitud de acceso está siendo revisada por nuestro equipo. Te notificaremos por correo electrónico una vez que tu cuenta haya sido aprobada."
4. **Badge:** "Tiempo estimado: 24-48 horas hábiles"

## 4. Flujos de Autenticación

### Flujo de Registro Manual:

```mermaid
graph TD
    A[Usuario en /registro] --> B[Completa formulario]
    B --> C[Submit formulario]
    C --> D[Server Action: signUp()]
    D --> E[Trigger: handle_new_user]
    E --> F[Crear perfil con rol PENDIENTE]
    F --> G[Redirigir a /revision]
```

### Flujo de Registro Social:

```mermaid
graph TD
    A[Usuario en /registro] --> B[Click botón social]
    B --> C[signInWithOAuth()]
    C --> D[Autenticación con proveedor]
    D --> E[Trigger: handle_new_user]
    E --> F[Crear perfil con metadatos sociales]
    F --> G[Rol PENDIENTE asignado]
    G --> H[Redirigir a /revision]
```

### Flujo de Login:

```mermaid
graph TD
    A[Usuario en /login] --> B[Ingresa credenciales]
    B --> C[Server Action: signIn()]
    C --> D[Autenticación exitosa?]
    D -->|Sí| E[Consultar tabla profiles]
    D -->|No| F[Mostrar error]
    E --> G[Obtener rol del usuario]
    G --> H{Evaluar rol}
    H -->|ADMIN| I[/admin/dashboard]
    H -->|COPROPIETARIO| J[/copropietario/dashboard]
    H -->|PROSPECTO| K[/prospecto/bienvenida]
    H -->|PENDIENTE| L[/revision]
```

## 5. Especificaciones Técnicas

### Componentes requeridos:

```bash
# Componentes shadcn/ui necesarios
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add button
npx shadcn@latest add badge
```

### Server Actions estructura:

```typescript
// /src/app/actions/auth.ts
export async function registerUser(formData: FormData)
export async function loginUser(formData: FormData)
export async function socialAuth(provider: 'google' | 'apple')
```

### Configuración de Supabase:

```typescript
// Configuración de OAuth providers
const supabase = createClient()

// Registro manual
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      first_name,
      last_name
    }
  }
})

// Login social
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google' // o 'apple'
})
```

## 6. Criterios de Verificación

Esta fase estará **100% completa** cuando se cumplan todos estos criterios:

### ✅ Registro Manual:

* [ ] Un nuevo usuario puede registrarse exitosamente en `/registro`

* [ ] El usuario es redirigido automáticamente a `/revision`

* [ ] Su perfil se crea en la tabla `profiles` de Supabase

* [ ] El rol asignado es `PENDIENTE`

* [ ] Los campos `first_name` y `last_name` se guardan correctamente

### ✅ Registro Social:

* [ ] Los botones de Google y Apple funcionan correctamente

* [ ] El flujo OAuth se completa sin errores

* [ ] El perfil se crea automáticamente con metadatos sociales

* [ ] El usuario es redirigido a `/revision`

* [ ] El `avatar_url` se captura desde el proveedor social

### ✅ Login y Redirección:

* [ ] Un usuario con rol `PENDIENTE` es redirigido a `/revision`

* [ ] Un usuario con rol `COPROPIETARIO` es redirigido a `/copropietario/dashboard`

* [ ] Un usuario con rol `ADMIN` es redirigido a `/admin/dashboard`

* [ ] Un usuario con rol `PROSPECTO` es redirigido a `/prospecto/bienvenida`

* [ ] Los errores de autenticación se muestran claramente

### ✅ Página de Revisión:

* [ ] La página `/revision` muestra el diseño correcto

* [ ] Incluye ícono, título, descripción y badge de tiempo

* [ ] El diseño es responsive y profesional

### ✅ Validaciones Técnicas:

* [ ] No hay errores de TypeScript (`npx tsc --noEmit`)

* [ ] El servidor de desarrollo funciona sin errores

* [ ] Todos los enlaces de navegación funcionan correctamente

* [ ] Los formularios manejan errores de validación

## 7. Comandos de Verificación

```powershell
# Verificar errores de tipado
npx tsc --noEmit

# Verificar que el servidor funciona
npm run dev

# Probar rutas de autenticación
# Navegar a: http://localhost:3000/registro
# Navegar a: http://localhost:3000/login
# Navegar a: http://localhost:3000/revision
```

## 8. Estructura de Archivos Resultante

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx          # ✅ UI + lógica de login
│   │   ├── registro/
│   │   │   └── page.tsx          # ✅ UI + lógica de registro
│   │   └── revision/
│   │       └── page.tsx          # ✅ Página de espera
│   └── actions/
│       └── auth.ts               # ✅ Server Actions
└── components/
    └── ui/                       # ✅ Componentes shadcn/ui
```

## 9. Próximos Pasos

Una vez completado el Bloque 4, el proyecto estará listo para:

* **Bloque 5:** Implementación de dashboards específicos por rol

* **Bloque 6:** Sistema de gestión de propiedades

* **Bloque 7:** Funcionalidades de inversión y contratos

***

**Estado del Bloque 4:** 🔄 Pendiente de implementación\
**Prerrequisitos:** ✅ Bloque 3 completado\
**Estimación:** 4-6 horas de desarrollo\
**Prioridad:** Alta - Funcionalidad crítica del sistema
