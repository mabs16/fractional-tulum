# Fractional Tulum - Bloque 3: Creación del Esqueleto Completo de Rutas

## Descripción General

Este documento detalla la implementación del Bloque 3 del proyecto Fractional Tulum, que consiste en crear la estructura completa de carpetas y archivos para las 19 rutas de la aplicación utilizando el App Router de Next.js.

## Objetivos

- Crear una aplicación navegable pero vacía
- Implementar 19 rutas organizadas en grupos lógicos
- Cada página debe mostrar únicamente su título centrado
- Establecer la base para el desarrollo futuro

## Prerrequisitos

- Bloque 2 (Inicialización del Proyecto y Configuración del Entorno) completado al 100%
- Proyecto Next.js inicializado con App Router
- Variables de entorno configuradas
- shadcn/ui instalado y configurado

## Arquitectura de Carpetas

### Estructura Completa

```
/src/app/
│
├── (public)/                 # Grupo para las páginas públicas
│   ├── layout.tsx            
│   ├── page.tsx              # Ruta: /
│   ├── copropiedad-fraccional/
│   │   └── page.tsx          # Ruta: /copropiedad-fraccional
│   ├── propiedad-alfa/
│   │   └── page.tsx          # Ruta: /propiedad-alfa
│   ├── la-propuesta/
│   │   └── page.tsx          # Ruta: /la-propuesta
│   └── faq/
│       └── page.tsx          # Ruta: /faq
│
├── (auth)/                   # Grupo para las páginas de autenticación
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx          # Ruta: /login
│   ├── registro/
│   │   └── page.tsx          # Ruta: /registro
│   └── revision/
│       └── page.tsx          # Ruta: /revision
│
├── admin/                    # Portal de Administración
│   ├── layout.tsx            
│   ├── page.tsx              # Redirigirá a /admin/dashboard
│   ├── dashboard/
│   │   └── page.tsx          # Ruta: /admin/dashboard
│   ├── users/
│   │   └── page.tsx          # Ruta: /admin/users
│   ├── propiedad/
│   │   └── page.tsx          # Ruta: /admin/propiedad
│   ├── documentos/
│   │   └── page.tsx          # Ruta: /admin/documentos
│   └── contratos/
│       └── page.tsx          # Ruta: /admin/contratos
│
├── copropietario/            # Portal del Copropietario
│   ├── layout.tsx            
│   ├── dashboard/
│   │   └── page.tsx          # Ruta: /copropietario/dashboard
│   ├── contratos/
│   │   └── page.tsx          # Ruta: /copropietario/contratos
│   ├── documentos/
│   │   └── page.tsx          # Ruta: /copropietario/documentos
│   └── perfil/
│       └── page.tsx          # Ruta: /copropietario/perfil
│
└── prospecto/                # Portal del Prospecto
    ├── layout.tsx            
    └── bienvenida/
        └── page.tsx          # Ruta: /prospecto/bienvenida
```

## Lista de Rutas (19 total)

### Páginas Públicas (5 rutas)
1. `/` - Página de inicio
2. `/copropiedad-fraccional` - Información sobre copropiedad
3. `/propiedad-alfa` - Detalles de la propiedad
4. `/la-propuesta` - Propuesta de inversión
5. `/faq` - Preguntas frecuentes

### Páginas de Autenticación (3 rutas)
6. `/login` - Inicio de sesión
7. `/registro` - Registro de usuarios
8. `/revision` - Revisión de cuenta

### Portal de Administración (5 rutas)
9. `/admin` - Página principal (redirige a dashboard)
10. `/admin/dashboard` - Panel de administración
11. `/admin/users` - Gestión de usuarios
12. `/admin/propiedad` - Gestión de propiedades
13. `/admin/documentos` - Gestión de documentos
14. `/admin/contratos` - Gestión de contratos

### Portal del Copropietario (4 rutas)
15. `/copropietario/dashboard` - Panel del copropietario
16. `/copropietario/contratos` - Contratos del copropietario
17. `/copropietario/documentos` - Documentos del copropietario
18. `/copropietario/perfil` - Perfil del copropietario

### Portal del Prospecto (1 ruta)
19. `/prospecto/bienvenida` - Página de bienvenida para prospectos

## Contenido Mínimo de las Páginas

Cada archivo `page.tsx` debe contener un componente simple con los siguientes títulos específicos:

### Páginas Públicas
- `/` → "Fractional Tulum - Inicio"
- `/copropiedad-fraccional` → "¿Qué es Copropiedad Fraccional?"
- `/propiedad-alfa` → "Propiedad Alfa - Tulum"
- `/la-propuesta` → "La Propuesta de Inversión"
- `/faq` → "Preguntas Frecuentes"

### Páginas de Autenticación
- `/login` → "Iniciar Sesión"
- `/registro` → "Crear Cuenta"
- `/revision` → "Revisión de Cuenta"

### Portal de Administración
- `/admin` → "Panel de Administración"
- `/admin/dashboard` → "Dashboard - Administración"
- `/admin/users` → "Gestión de Usuarios"
- `/admin/propiedad` → "Gestión de Propiedades"
- `/admin/documentos` → "Gestión de Documentos"
- `/admin/contratos` → "Gestión de Contratos"

### Portal del Copropietario
- `/copropietario/dashboard` → "Mi Dashboard"
- `/copropietario/contratos` → "Mis Contratos"
- `/copropietario/documentos` → "Mis Documentos"
- `/copropietario/perfil` → "Mi Perfil"

### Portal del Prospecto
- `/prospecto/bienvenida` → "Bienvenido a Fractional Tulum"

## Configuración de Layouts

### Layout Público (`(public)/layout.tsx`)
- Incluye navegación básica (Navbar)
- Enlaces a páginas principales
- Diseño limpio y accesible

### Layout de Autenticación (`(auth)/layout.tsx`)
- Layout básico para páginas de login/registro
- Sin navegación compleja

### Layout de Administración (`admin/layout.tsx`)
- Header con identificación de administrador
- Navegación específica para admin

### Layout del Copropietario (`copropietario/layout.tsx`)
- Header personalizado para copropietarios
- Navegación del portal

### Layout del Prospecto (`prospecto/layout.tsx`)
- Layout específico para prospectos
- Diseño orientado a conversión

## Navegación Básica

El componente Navbar en el layout público debe incluir:

### Páginas Principales (lado izquierdo)
- Inicio (`/`)
- ¿Qué es Copropiedad? (`/copropiedad-fraccional`)
- Propiedad Alfa (`/propiedad-alfa`)
- La Propuesta (`/la-propuesta`)

### Enlaces de Autenticación (lado derecho)
- Iniciar Sesión (`/login`)
- Registro (`/registro`)

### Organización Visual
- Las páginas principales se muestran alineadas a la izquierda
- Los enlaces de autenticación se muestran alineados a la derecha
- Diseño responsive con espaciado adecuado

## Comandos de Implementación

```bash
# Crear estructura de carpetas
mkdir -p src/app/(public)/{copropiedad-fraccional,propiedad-alfa,la-propuesta,faq}
mkdir -p src/app/(auth)/{login,registro,revision}
mkdir -p src/app/admin/{dashboard,users,propiedad,documentos,contratos}
mkdir -p src/app/copropietario/{dashboard,contratos,documentos,perfil}
mkdir -p src/app/prospecto/bienvenida

# Crear archivos page.tsx y layout.tsx
# (Se crearán mediante herramientas de desarrollo)
```

## Comandos de Verificación

```bash
# Verificar estructura de archivos
find src/app -name "*.tsx" | sort

# Verificar errores de TypeScript
npx tsc --noEmit

# Iniciar servidor de desarrollo
npm run dev
```

## Criterios de Verificación

Esta fase estará completa cuando:

✅ **Estructura Completa**: Toda la estructura de carpetas y archivos para las 19 páginas esté creada

✅ **Navegación Funcional**: Se pueda navegar en el navegador a cada una de las 19 rutas definidas

✅ **Contenido Mínimo**: Cada página muestre únicamente su título `<h1>` correspondiente centrado

✅ **Navegación Básica**: La navegación entre las páginas públicas principales funcione

✅ **Sin Errores**: El proyecto se inicie sin errores con `npm run dev`

✅ **TypeScript**: No existan errores de tipado (`npx tsc --noEmit`)

## Exclusiones Explícitas

❌ **NO añadir** diseño ni estilos con Tailwind (más allá de lo mínimo para funcionalidad)

❌ **NO implementar** lógica de negocio (formularios, conexión a base de datos, protección de rutas)

❌ **NO añadir** contenido real (textos, imágenes, etc.)

❌ **NO crear** componentes complejos en esta fase

## Próximos Pasos

Una vez completado el Bloque 3:

1. **Bloque 4**: Implementación de autenticación con Supabase
2. **Bloque 5**: Desarrollo de componentes UI específicos
3. **Bloque 6**: Integración con base de datos
4. **Bloque 7**: Implementación de lógica de negocio

## Notas Técnicas

- Utilizar App Router de Next.js 14+
- Grupos de rutas con paréntesis `()` para organización
- Layouts anidados para diferentes secciones
- Componentes funcionales con TypeScript
- Centrado horizontal y vertical de títulos

---

**Fecha de creación**: Diciembre 2024  
**Versión**: 1.0  
**Estado**: En implementación