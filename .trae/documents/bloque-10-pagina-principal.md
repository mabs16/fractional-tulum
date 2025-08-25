# Bloque 10 - Documentación Técnica: Página Principal de Fractional Tulum

## 1. Descripción General

La página principal de Fractional Tulum es una landing page moderna y sofisticada que presenta la propuesta de valor de la plataforma de inversión inmobiliaria fraccionada. La página está diseñada con un enfoque premium, utilizando videos de fondo dinámicos, animaciones GSAP fluidas y un sistema de temas claro/oscuro.

**Archivo principal:** `src/app/(public)/page.tsx`

## 2. Estructura de las 5 Secciones Principales

### 2.1 Sección Hero: "Más Allá de la Propiedad. El Lujo de la Inteligencia."

**Propósito:** Captar la atención inmediata del usuario con una propuesta de valor impactante.

**Elementos principales:**
- Título principal con gradiente dorado: "Más Allá de la Propiedad."
- Subtítulo: "El Lujo de la Inteligencia."
- Párrafo descriptivo sobre inversión inmobiliaria inteligente
- Botón CTA principal con color dorado Prestigio (#B89E63)
- Flecha de scroll animada con tamaño `lg`
- Video de fondo dinámico que cambia según el tema y dispositivo

**Características técnicas:**
- Altura completa de viewport (`min-h-screen`)
- Centrado vertical y horizontal
- Texto con sombras para mejorar legibilidad sobre video
- Animaciones GSAP de entrada

### 2.2 Sección Problema: "El Dilema del Activo de Lujo"

**Propósito:** Identificar y presentar los problemas que enfrentan los inversores tradicionales.

**Elementos principales:**
- Título de sección con gradiente dorado
- Descripción del problema de inversión inmobiliaria tradicional
- Grid de 3 tarjetas (Card components) con problemas específicos:
  - **Barrera de Entrada:** Capital inicial elevado
  - **Gestión Compleja:** Mantenimiento y administración
  - **Liquidez Limitada:** Dificultad para vender

**Características técnicas:**
- Layout responsivo con grid CSS
- Componentes Card reutilizables
- Iconografía consistente
- Animaciones de entrada escalonadas

### 2.3 Sección Solución: "Propiedad Real. Cero Complicaciones."

**Propósito:** Presentar la solución de Fractional Tulum con beneficios claros.

**Elementos principales:**
- Título dividido en dos líneas:
  - "Propiedad Real."
  - "Cero Complicaciones."
- Tres puntos de beneficio con saltos de línea específicos:
  - **"Patrimonio Optimizado"** (línea separada)
    - Descripción: "Accede a propiedades de lujo con una fracción del capital tradicional."
  - **"Tranquilidad Absoluta"** (línea separada)
    - Descripción: "Nosotros nos encargamos de todo: mantenimiento, gestión y optimización."
  - **"Activo Autosostenible"** (línea separada)
    - Descripción: "Tu inversión genera ingresos pasivos mientras se revaloriza en el tiempo."

**Características técnicas:**
- Estructura semántica con elementos HTML apropiados
- Separación visual clara entre título y beneficios
- Tipografía jerárquica para mejorar legibilidad
- Espaciado consistente entre elementos

### 2.4 Sección Destino: "Un Destino de Clase Mundial - Tulum Country Club"

**Propósito:** Destacar la ubicación premium y las características del desarrollo.

**Elementos principales:**
- Título de sección con énfasis en "Tulum Country Club"
- Descripción del destino y sus atractivos
- Grid de características del desarrollo
- Imágenes o elementos visuales del proyecto

**Características técnicas:**
- Layout adaptativo para diferentes tamaños de pantalla
- Integración con sistema de imágenes optimizadas
- Animaciones de parallax sutiles

### 2.5 Sección Visión: "Tu Llave a un Mundo de Destinos"

**Propósito:** Expandir la visión hacia futuras oportunidades de inversión.

**Elementos principales:**
- Título inspiracional sobre expansión global
- Descripción de la visión a largo plazo
- Call-to-action secundario
- Elementos visuales que sugieren crecimiento y expansión

**Características técnicas:**
- Diseño que sugiere continuidad y crecimiento
- Integración con elementos de navegación
- Preparación para futuras expansiones de contenido

## 3. Componentes Utilizados

### 3.1 BackgroundVideo Component

**Ubicación:** `src/components/layout/BackgroundVideo.tsx`

**Funcionalidades:**
- **Video dinámico:** Cambia según tema (claro/oscuro) y dispositivo (móvil/escritorio)
- **Fuentes de video:**
  - Desktop Light: `https://vz-fd0addf5-731.b-cdn.net/06b7529e-a84c-42df-8f4a-9e5dd649499a/playlist.m3u8`
  - Desktop Dark: `https://vz-fd0addf5-731.b-cdn.net/a0be1ccb-53a8-4a6e-942b-7e00a789d9fa/playlist.m3u8`
  - Mobile Light: `https://vz-fd0addf5-731.b-cdn.net/418f14b3-3071-40e3-ad8c-b199b8a9ee53/playlist.m3u8`
  - Mobile Dark: `https://vz-fd0addf5-731.b-cdn.net/3e2475ff-066c-472f-b57d-3a32ade62b98/playlist.m3u8`
- **Tecnología HLS:** Utiliza HLS.js para streaming adaptativo
- **Transiciones suaves:** Sistema de doble video para cambios sin cortes
- **Prevención de hidratación:** Estado `mounted` para evitar inconsistencias SSR/cliente
- **Overlay de legibilidad:** Capa semitransparente para mejorar contraste del texto

**Características técnicas:**
- Detección automática de dispositivo móvil
- Soporte nativo para Safari/iOS
- Gestión de memoria con cleanup de instancias HLS
- Responsive design con breakpoint en 768px

### 3.2 Button Component

**Ubicación:** `src/components/ui/button.tsx`

**Variantes utilizadas:**
- **Default:** Botón principal con colores del tema
- **Outline:** Botones secundarios con borde
- **Ghost:** Botones de navegación sutiles

**Tamaños utilizados:**
- **lg:** Botón CTA principal y flecha de scroll
- **default:** Botones estándar
- **icon:** Botones de iconos (corregido de `icon` a `lg` para la flecha)

**Personalización:**
- Color dorado Prestigio (#B89E63) para CTA principal
- Efectos de hover y focus personalizados
- Sombras y transiciones suaves

### 3.3 Card Component

**Ubicación:** `src/components/ui/card.tsx`

**Subcomponentes utilizados:**
- **Card:** Contenedor principal
- **CardHeader:** Encabezado con título
- **CardContent:** Contenido principal
- **CardTitle:** Títulos de tarjetas
- **CardDescription:** Descripciones

**Aplicación en la página:**
- Tarjetas de problemas en la sección 2
- Tarjetas de beneficios en la sección 3
- Elementos informativos en secciones 4 y 5

## 4. Animaciones GSAP Implementadas

### 4.1 Configuración Base

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

### 4.2 Animaciones por Sección

**Sección Hero:**
- Fade in del título principal con delay escalonado
- Animación de entrada del botón CTA con efecto de escala
- Animación continua de la flecha de scroll (bounce)

**Secciones de Contenido:**
- Animaciones activadas por ScrollTrigger
- Fade in + slide up para títulos
- Animaciones escalonadas para grids de tarjetas
- Parallax sutil para elementos de fondo

**Efectos Interactivos:**
- Hover effects en botones y tarjetas
- Smooth scroll entre secciones
- Animaciones de transición de tema

### 4.3 Performance y Optimización

- Uso de `will-change` para elementos animados
- Animaciones basadas en transform y opacity
- Cleanup automático de ScrollTriggers
- Reducción de animaciones en dispositivos de baja potencia

## 5. Funcionalidades de Scroll y Navegación

### 5.1 Smooth Scroll

- Implementación nativa con `scroll-behavior: smooth`
- Navegación entre secciones con anchors
- Flecha de scroll animada que dirige a la siguiente sección

### 5.2 ScrollTrigger Integration

- Activación de animaciones basada en viewport
- Indicadores de progreso de scroll
- Lazy loading de contenido pesado

### 5.3 Navegación Interna

- Enlaces internos a secciones específicas
- Botones CTA que dirigen a formularios o páginas de registro
- Breadcrumbs implícitos a través del scroll

## 6. Responsive Design y Adaptaciones Móviles

### 6.1 Breakpoints Principales

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### 6.2 Adaptaciones por Dispositivo

**Mobile (< 768px):**
- Videos optimizados para móvil
- Grid de 1 columna para tarjetas
- Tipografía reducida y espaciado ajustado
- Botones con área de toque ampliada
- Navegación simplificada

**Tablet (768px - 1024px):**
- Grid de 2 columnas para tarjetas
- Tipografía intermedia
- Videos de escritorio con calidad ajustada

**Desktop (> 1024px):**
- Grid de 3 columnas para tarjetas
- Tipografía completa
- Videos de alta calidad
- Efectos de hover avanzados

### 6.3 Optimizaciones de Performance

- Lazy loading de videos según dispositivo
- Imágenes responsive con srcset
- Reducción de animaciones en móviles
- Compresión de assets por breakpoint

## 7. Integración con Sistema de Temas (Claro/Oscuro)

### 7.1 Implementación Técnica

```typescript
import { useTheme } from 'next-themes'

const { theme } = useTheme()
```

### 7.2 Elementos Afectados por el Tema

**Videos de Fondo:**
- Tema claro: Videos con tonalidades más brillantes
- Tema oscuro: Videos con tonalidades más profundas

**Colores de Texto:**
- Tema claro: Texto oscuro sobre fondos claros
- Tema oscuro: Texto claro sobre fondos oscuros

**Overlays y Sombras:**
- Tema claro: `bg-black/30`
- Tema oscuro: `bg-black/50`

**Componentes UI:**
- Botones adaptan colores según tema
- Tarjetas cambian background y bordes
- Iconos ajustan colores automáticamente

### 7.3 Transiciones de Tema

- Animaciones suaves entre temas
- Persistencia de preferencia del usuario
- Detección automática de preferencia del sistema

## 8. Colores y Estilos Específicos

### 8.1 Paleta de Colores Principal

**Dorado Prestigio:** `#B89E63`
- Uso: Botones CTA principales, acentos premium
- Variaciones: Hover states con tonalidades más oscuras

**Gradientes Dorados:**
```css
/* Títulos principales */
bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600

/* Botones CTA */
bg-[#B89E63] hover:bg-[#A08A56]
```

### 8.2 Tipografía

**Jerarquía de Títulos:**
- H1: `text-5xl md:text-7xl font-bold`
- H2: `text-4xl md:text-6xl font-bold`
- H3: `text-2xl md:text-4xl font-semibold`

**Texto de Cuerpo:**
- Párrafos: `text-lg md:text-xl`
- Descripciones: `text-base md:text-lg`

### 8.3 Espaciado y Layout

**Secciones:**
- Padding vertical: `py-20 md:py-32`
- Padding horizontal: `px-4 md:px-8`

**Elementos:**
- Separación entre elementos: `mb-8`, `mt-12`
- Grid gaps: `gap-8 md:gap-12`

### 8.4 Efectos Visuales

**Sombras:**
- Texto sobre video: `text-shadow-lg`
- Tarjetas: `shadow-lg hover:shadow-xl`
- Botones: `shadow-md hover:shadow-lg`

**Transiciones:**
- Duración estándar: `transition-all duration-300`
- Hover effects: `transform hover:scale-105`

## 9. Consideraciones de Performance

### 9.1 Optimización de Videos

- Uso de HLS para streaming adaptativo
- Preload de videos según conexión
- Fallbacks para navegadores sin soporte HLS

### 9.2 Lazy Loading

- Carga diferida de secciones no visibles
- Optimización de imágenes con Next.js Image
- Reducción de bundle size con code splitting

### 9.3 SEO y Accesibilidad

- Estructura semántica HTML5
- Alt texts para elementos visuales
- Contraste adecuado en todos los temas
- Navegación por teclado funcional

## 10. Estructura de Archivos Relacionados

```
src/
├── app/(public)/
│   └── page.tsx                 # Página principal
├── components/
│   ├── layout/
│   │   └── BackgroundVideo.tsx  # Video de fondo dinámico
│   └── ui/
│       ├── button.tsx           # Componente Button
│       └── card.tsx             # Componente Card
├── lib/
│   └── utils.ts                 # Utilidades (cn function)
└── styles/
    └── globals.css              # Estilos globales y Tailwind
```

## 11. Próximos Pasos y Mejoras

### 11.1 Optimizaciones Pendientes

- Implementar Service Worker para cache de videos
- Añadir métricas de performance
- Optimizar animaciones para dispositivos de baja potencia

### 11.2 Funcionalidades Futuras

- Integración con CMS para contenido dinámico
- A/B testing para diferentes versiones de CTA
- Analytics avanzados de interacción de usuario

### 11.3 Mantenimiento

- Monitoreo de performance de videos
- Actualización regular de dependencias
- Testing cross-browser continuo

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0
**Responsable técnico:** Equipo de Desarrollo Fractional Tulum