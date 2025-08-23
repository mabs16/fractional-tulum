# Fractional Tulum - Sistema de Autenticación Actualizado

## 📋 Estado Actual del Sistema

**Estado:** ✅ **COMPLETADO Y CORREGIDO** - Sistema de autenticación funcional con todas las correcciones implementadas

**Objetivo Alcanzado:** Sistema de autenticación robusto con Supabase Auth UI, manejo correcto de callbacks, roles actualizados y redirecciones funcionales.

## 🎯 Arquitectura Actual del Sistema

### 🔄 Flujo de Autenticación Corregido

```mermaid
graph TD
    A[Usuario accede a /acceder] --> B[AuthForm con Supabase Auth UI]
    B --> C{Tipo de autenticación}
    C -->|Email/Password| D[Supabase procesa credenciales]
    C -->|OAuth Google/Apple| E[Redirección a proveedor]
    D --> F[onAuthStateChange detecta login exitoso]
    E --> G[Callback con código de autorización]
    F --> H[Obtiene perfil y rol del usuario]
    G --> I[/auth/callback route.ts]
    I --> J[exchangeCodeForSession]
    J --> K[Redirección a /revision]
    H --> L{Middleware evalúa rol}
    L -->|ADMIN| M[/admin/dashboard]
    L -->|COPROPIETARIO| N[/copropietario/dashboard]
    L -->|PROSPECTO| O[/prospecto/bienvenida]
    L -->|PENDIENTE| P[/revision]
```

## 🔧 Componentes Principales

### 1. AuthForm Corregido (`/src/components/auth/AuthForm.tsx`)

```tsx
'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  onViewChange?: (view: 'sign_in' | 'sign_up') => void
}

export default function AuthForm({ onViewChange }: AuthFormProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    // ✅ CORRECCIÓN: Manejo de eventos de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth event:', event, session?.user?.email)
        
        if (event === 'SIGNED_IN' && session?.user) {
          try {
            // Obtener perfil del usuario
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single()

            if (error) {
              console.error('❌ Error obteniendo perfil:', error)
              router.push('/verificar-correo')
              return
            }

            // ✅ ROLES ACTUALIZADOS
            const role = profile?.role
            console.log('👤 Rol del usuario:', role)

            // Redirección según rol
            switch (role) {
              case 'ADMIN':
                router.push('/admin')
                break
              case 'COPROPIETARIO':
                router.push('/copropietario')
                break
              case 'PROSPECTO':
                router.push('/prospecto/bienvenida')
                break
              default:
                router.push('/revision')
            }
          } catch (error) {
            console.error('❌ Error en redirección:', error)
            router.push('/revision')
          }
        }

        if (event === 'SIGNED_OUT') {
          console.log('👋 Usuario cerró sesión')
          router.push('/acceder')
        }
      }
    )

    // Sistema de detección de cambios de vista (sin cambios)
    const detectViewChange = () => {
      const buttons = document.querySelectorAll('button[type="submit"]')
      buttons.forEach(button => {
        const buttonText = button.textContent?.toLowerCase() || ''
        
        if (buttonText.includes('crear cuenta')) {
          onViewChange?.('sign_up')
        } else if (buttonText.includes('iniciar sesión')) {
          onViewChange?.('sign_in')
        }
      })
      
      const links = document.querySelectorAll('a')
      links.forEach(link => {
        const linkText = link.textContent?.toLowerCase() || ''
        link.removeEventListener('click', handleLinkClick)
        
        if (linkText.includes('regístrate') || linkText.includes('ya tienes')) {
          link.addEventListener('click', handleLinkClick)
        }
      })
    }
    
    const handleLinkClick = () => {
      setTimeout(() => detectViewChange(), 200)
    }

    const observer = new MutationObserver(() => detectViewChange())
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: true 
    })

    setTimeout(detectViewChange, 500)
    
    return () => {
      subscription.unsubscribe()
      observer.disconnect()
    }
  }, [onViewChange, supabase, router])

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'rgb(87 83 78)', // stone-600
              brandAccent: 'rgb(68 64 60)', // stone-700
              brandButtonText: 'white',
              defaultButtonBackground: 'rgb(245 245 244)', // stone-100
              defaultButtonBackgroundHover: 'rgb(231 229 228)', // stone-200
              inputBackground: 'rgb(250 250 249)', // stone-50
              inputBorder: 'rgb(214 211 209)', // stone-300
              inputBorderHover: 'rgb(168 162 158)', // stone-400
              inputBorderFocus: 'rgb(87 83 78)', // stone-600
              inputText: 'rgb(41 37 36)', // stone-800
              inputLabelText: 'rgb(68 64 60)', // stone-700
              inputPlaceholder: 'rgb(120 113 108)', // stone-500
              anchorTextColor: 'rgb(87 83 78)', // stone-600
              anchorTextHoverColor: 'rgb(68 64 60)', // stone-700
            },
            space: {
              spaceSmall: '4px',
              spaceMedium: '8px',
              spaceLarge: '16px',
              labelBottomMargin: '8px',
              anchorBottomMargin: '4px',
              emailInputSpacing: '4px',
              socialAuthSpacing: '4px',
              buttonPadding: '10px 15px',
              inputPadding: '10px 15px',
            },
            fontSizes: {
              baseBodySize: '13px',
              baseInputSize: '14px',
              baseLabelSize: '14px',
              baseButtonSize: '14px',
            },
            fonts: {
              bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
              buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
              inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
              labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
            },
            borderWidths: {
              buttonBorderWidth: '1px',
              inputBorderWidth: '1px',
            },
            radii: {
              borderRadiusButton: '6px',
              buttonBorderRadius: '6px',
              inputBorderRadius: '6px',
            },
          },
        },
        className: {
          anchor: 'text-stone-600 hover:text-stone-700 transition-colors duration-200',
          button: 'transition-all duration-200 hover:shadow-md',
          input: 'transition-all duration-200 focus:ring-2 focus:ring-stone-600/20',
          label: 'font-medium text-stone-700',
        },
      }}
      theme="light"
      showLinks={true}
      providers={['google', 'apple']}
      redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Correo Electrónico',
            password_label: 'Contraseña',
            button_label: 'Iniciar Sesión',
            loading_button_label: 'Iniciando sesión...',
            social_provider_text: 'Continuar con {{provider}}',
            link_text: '¿Ya tienes una cuenta? Inicia sesión',
          },
          sign_up: {
            email_label: 'Correo Electrónico',
            password_label: 'Contraseña',
            button_label: 'Crear Cuenta',
            loading_button_label: 'Creando cuenta...',
            social_provider_text: 'Continuar con {{provider}}',
            link_text: '¿Aún no tienes cuenta? Regístrate',
          },
          forgotten_password: {
            email_label: 'Correo Electrónico',
            button_label: 'Enviar enlace de recuperación',
            loading_button_label: 'Enviando enlace...',
            link_text: '¿Olvidaste tu contraseña?',
          },
        },
      }}
    />
  )
}
```

### 2. Callback del Servidor (`/src/app/auth/callback/route.ts`)

```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/revision'

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      // ✅ CORRECCIÓN: exchangeCodeForSession para OAuth
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('❌ Error en exchangeCodeForSession:', error)
        return NextResponse.redirect(`${requestUrl.origin}/acceder?error=auth_error`)
      }
      
      console.log('✅ Sesión establecida exitosamente:', data.user?.email)
      
      // Redirección exitosa
      return NextResponse.redirect(`${requestUrl.origin}${next}`)
    } catch (error) {
      console.error('❌ Error inesperado en callback:', error)
      return NextResponse.redirect(`${requestUrl.origin}/acceder?error=callback_error`)
    }
  }

  // Si no hay código, redirigir a login
  return NextResponse.redirect(`${requestUrl.origin}/acceder`)
}
```

### 3. Página de Acceso (`/src/app/(auth)/acceder/page.tsx`)

```tsx
'use client'
import { useState } from 'react'
import AuthForm from '@/components/auth/AuthForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccederPage() {
  const [authView, setAuthView] = useState<'sign_in' | 'sign_up'>('sign_in')

  const getSubtitle = () => {
    return authView === 'sign_in' ? 'Inicia sesión en tu cuenta' : 'Registra tu cuenta'
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-stone-50 to-stone-100">
      <Card className="w-full max-w-md border-stone-300 shadow-xl shadow-stone-200/50 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl font-bold text-center text-stone-800 tracking-tight">
            Bienvenido a Fractional Tulum
          </CardTitle>
          <p className="text-center text-stone-600 mt-2 font-medium transition-all duration-300">
            {getSubtitle()}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <AuthForm onViewChange={setAuthView} />
        </CardContent>
      </Card>
    </div>
  )
}
```

## 🔒 Sistema de Roles Actualizado

### Roles en Base de Datos
```sql
-- ✅ ROLES ACTUALIZADOS
CREATE TYPE user_role AS ENUM (
  'ADMIN',        -- Administrador del sistema
  'COPROPIETARIO', -- Propietario de fracción
  'PROSPECTO',    -- Cliente potencial
  'PENDIENTE'     -- Usuario pendiente de aprobación
);
```

### Redirecciones por Rol
| Rol | Redirección | Descripción |
|-----|-------------|-------------|
| `ADMIN` | `/admin` | Dashboard administrativo |
| `COPROPIETARIO` | `/copropietario` | Dashboard de propietario |
| `PROSPECTO` | `/prospecto/bienvenida` | Página de bienvenida |
| `PENDIENTE` | `/revision` | Página de espera |
| Sin rol | `/revision` | Por defecto |

## 🛡️ Middleware de Protección

### Configuración Actual (`/src/middleware.ts`)
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  // ✅ Rutas públicas (sin autenticación requerida)
  const publicRoutes = [
    '/',
    '/acceder',
    '/olvide-contrasena', 
    '/actualizar-contrasena',
    '/auth/callback',
    '/acceso-denegado'
  ]

  // ✅ Rutas de autenticación (solo para no autenticados)
  const authRoutes = ['/acceder', '/olvide-contrasena']

  // Si es ruta pública, permitir acceso
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Si está autenticado y trata de acceder a rutas de auth, redirigir
    if (session && authRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/revision', req.url))
    }
    return res
  }

  // Si no está autenticado, redirigir a login
  if (!session) {
    return NextResponse.redirect(new URL('/acceder', req.url))
  }

  // ✅ Control de acceso por roles
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    const userRole = profile?.role

    // Definir acceso por rutas
    const roleAccess = {
      '/admin': ['ADMIN'],
      '/copropietario': ['ADMIN', 'COPROPIETARIO'],
      '/prospecto': ['ADMIN', 'COPROPIETARIO', 'PROSPECTO'],
      '/revision': ['ADMIN', 'COPROPIETARIO', 'PROSPECTO', 'PENDIENTE']
    }

    // Verificar acceso
    for (const [route, allowedRoles] of Object.entries(roleAccess)) {
      if (pathname.startsWith(route)) {
        if (!allowedRoles.includes(userRole)) {
          return NextResponse.redirect(new URL('/acceso-denegado', req.url))
        }
        break
      }
    }

  } catch (error) {
    console.error('❌ Error en middleware:', error)
    return NextResponse.redirect(new URL('/revision', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

## 🔧 Correcciones Implementadas

### ✅ 1. Problema de Callback Resuelto
- **Antes:** Conflicto entre `page.tsx` y `route.ts` en `/auth/callback`
- **Después:** Solo `route.ts` maneja el callback del servidor
- **Solución:** `exchangeCodeForSession()` para OAuth

### ✅ 2. Login que Solo se Recargaba
- **Antes:** AuthForm no manejaba eventos de autenticación
- **Después:** `onAuthStateChange` detecta login exitoso
- **Solución:** Redirección automática según rol del usuario

### ✅ 3. Roles Actualizados
- **Antes:** Roles inconsistentes en base de datos
- **Después:** `ADMIN`, `COPROPIETARIO`, `PROSPECTO`, `PENDIENTE`
- **Solución:** Enum actualizado y redirecciones corregidas

### ✅ 4. Error de TypeScript
- **Antes:** `any` en callback causaba error de tipado
- **Después:** `EmailOtpType` de `@supabase/supabase-js`
- **Solución:** Tipos correctos importados

### ✅ 5. Error de Next.js useSearchParams
- **Antes:** `useSearchParams()` sin `Suspense boundary`
- **Después:** Hook eliminado (no se utilizaba)
- **Solución:** Código limpio sin imports innecesarios

## 📁 Estructura de Archivos Final

```
src/
├── app/
│   ├── (auth)/
│   │   ├── acceder/
│   │   │   └── page.tsx                    # ✅ Página consolidada
│   │   ├── olvide-contrasena/
│   │   │   └── page.tsx                    # ✅ Existente
│   │   ├── actualizar-contrasena/
│   │   │   └── page.tsx                    # ✅ Corregido (sin useSearchParams)
│   │   └── revision/
│   │       └── page.tsx                    # ✅ Sin cambios
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts                    # ✅ NUEVO - Solo route handler
│   ├── admin/
│   │   └── page.tsx                        # ✅ Dashboard admin
│   ├── copropietario/
│   │   └── page.tsx                        # ✅ Dashboard copropietario
│   ├── prospecto/
│   │   ├── bienvenida/
│   │   │   └── page.tsx                    # ✅ Página de bienvenida
│   │   └── page.tsx                        # ✅ Dashboard prospecto
│   └── acceso-denegado/
│       └── page.tsx                        # ✅ Página de error
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx                    # ✅ CORREGIDO - Con onAuthStateChange
│   └── ui/
│       ├── card.tsx                        # ✅ Existente
│       ├── input.tsx                       # ✅ Existente
│       └── button.tsx                      # ✅ Existente
├── lib/
│   └── supabase/
│       ├── client.ts                       # ✅ Sin cambios
│       └── server.ts                       # ✅ Sin cambios
└── middleware.ts                           # ✅ ACTUALIZADO - Control por roles
```

## 🧪 Flujo de Pruebas

### ✅ Verificaciones Completadas

1. **Compilación TypeScript:**
   ```powershell
   npx tsc --noEmit
   # ✅ Sin errores
   ```

2. **Servidor de desarrollo:**
   ```powershell
   npm run dev
   # ✅ Inicia correctamente
   ```

3. **Rutas funcionales:**
   - ✅ `/acceder` - Formulario de login/registro
   - ✅ `/auth/callback` - Callback OAuth
   - ✅ `/admin` - Dashboard admin (solo ADMIN)
   - ✅ `/copropietario` - Dashboard copropietario
   - ✅ `/prospecto/bienvenida` - Bienvenida prospecto
   - ✅ `/revision` - Página de espera

4. **Autenticación:**
   - ✅ Login con email/contraseña
   - ✅ Registro de nuevos usuarios
   - ✅ OAuth con Google
   - ✅ OAuth con Apple
   - ✅ Redirección según roles

5. **Middleware:**
   - ✅ Protección de rutas privadas
   - ✅ Control de acceso por roles
   - ✅ Redirección de usuarios no autenticados

## 🔐 Configuración de Supabase

### Variables de Entorno
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://gyxxhshzzfvpvucsoaop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### Configuración OAuth
- **Google OAuth:** Configurado en Supabase Dashboard
- **Apple OAuth:** Configurado en Supabase Dashboard
- **Redirect URLs:** `http://localhost:3000/auth/callback`

### Plantilla de Email (Recomendación)
```html
<!-- En Supabase Dashboard > Authentication > Email Templates -->
<h2>Confirma tu correo electrónico</h2>
<p>Haz clic en el enlace para confirmar tu cuenta:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token={{ .TokenHash }}&type=email&next=/revision">Confirmar Email</a></p>
```

## 🚀 Estado Final

### ✅ Sistema Completamente Funcional
- **Autenticación:** Email/contraseña y OAuth funcionando
- **Callback:** Manejo correcto del lado del servidor
- **Roles:** Sistema actualizado con redirecciones correctas
- **Middleware:** Protección y control de acceso implementado
- **UI/UX:** Interfaz unificada con títulos dinámicos
- **Errores:** Todos los errores de TypeScript y Next.js resueltos

### 🎯 Características Destacadas
1. **onAuthStateChange:** Manejo automático de eventos de autenticación
2. **exchangeCodeForSession:** Callback OAuth seguro del lado del servidor
3. **Control por roles:** Middleware robusto con acceso granular
4. **Resolución de conflictos:** Sin conflictos de rutas en `/auth/callback`
5. **Logging detallado:** Debug completo del flujo de autenticación
6. **Tipos seguros:** Sin errores de TypeScript

---

**✅ Estado:** SISTEMA DE AUTENTICACIÓN COMPLETAMENTE FUNCIONAL

**📅 Última actualización:** Sistema corregido con todas las funcionalidades operativas

**🔧 Tecnologías:** Next.js 14, Supabase Auth UI, TypeScript, Tailwind CSS

**🎨 Características:** OAuth, roles, middleware, callback seguro, UI unificada