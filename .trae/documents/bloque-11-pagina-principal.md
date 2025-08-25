# Bloque 11 - Documentación Técnica: Páginas Públicas de Fractional Tulum

## 1. Descripción General

Las páginas públicas de Fractional Tulum constituyen el ecosistema de marketing y presentación de la plataforma de inversión inmobiliaria fraccionada. Estas páginas están diseñadas con un enfoque premium, utilizando videos de fondo dinámicos, animaciones GSAP fluidas, sistema de temas claro/oscuro y una arquitectura SEO optimizada.

**Estructura de rutas públicas:** `src/app/(public)/`

## 2. Arquitectura de Páginas Públicas

### 2.1 Layout Público Base

**Archivo:** `src/app/(public)/layout.tsx`

**Componentes principales:**
- `PublicNavbar`: Navegación principal con logo, menú y selector de tema
- `BackgroundVideo`: Video de fondo dinámico que se adapta al tema y dispositivo
- Footer con información corporativa y enlaces legales

**Características técnicas:**
- Sistema de temas integrado con `next-themes`
- Navegación responsive con menú hamburguesa en móvil
- Video de fondo optimizado para diferentes dispositivos
- SEO optimizado con metadatos dinámicos

### 2.2 Estructura de Navegación

**Menú principal:**
1. **Inicio** (`/`) - Página principal con propuesta de valor
2. **Propiedad Inteligente** (`/propiedad-inteligente`) - Concepto de inversión
3. **Nuestra Villa** (`/nuestra-villa`) - Detalles del proyecto
4. **La Propuesta** (`/la-propuesta`) - Modelo de negocio
5. **Nuestro Equipo** (`/nuestro-equipo`) - Equipo directivo
6. **Preguntas Frecuentes** (`/preguntas-frecuentes`) - FAQ

**Elementos de navegación:**
- Logo con enlace a inicio
- Menú horizontal en desktop
- Menú hamburguesa en móvil
- Selector de tema (claro/oscuro)
- Botón CTA "Acceder" para registro/login

## 3. Página Principal (/)

**Archivo:** `src/app/(public)/page.tsx`

### 3.1 Estructura de Secciones

#### Sección Hero: "Más Allá de la Propiedad. El Lujo de la Inteligencia."

**Propósito:** Captar atención inmediata con propuesta de valor impactante.

**Elementos principales:**
- Título principal con gradiente dorado: "Más Allá de la Propiedad."
- Subtítulo: "El Lujo de la Inteligencia."
- Párrafo descriptivo sobre inversión inmobiliaria inteligente
- Botón CTA principal con color dorado Prestigio (#B89E63)
- Flecha de scroll animada
- Video de fondo dinámico

**Características técnicas:**
- Altura completa de viewport (`min-h-screen`)
- Centrado vertical y horizontal
- Texto con sombras para legibilidad sobre video
- Animaciones GSAP de entrada

#### Sección Problema: "El Dilema del Activo de Lujo"

**Propósito:** Identificar problemas de inversión inmobiliaria tradicional.

**Elementos principales:**
- Título con gradiente dorado
- Grid de 3 tarjetas con problemas específicos:
  - **Barrera de Entrada:** Capital inicial elevado
  - **Gestión Compleja:** Mantenimiento y administración
  - **Liquidez Limitada:** Dificultad para vender

#### Sección Solución: "Propiedad Real. Cero Complicaciones."

**Propósito:** Presentar la solución con beneficios claros.

**Beneficios principales:**
- **Patrimonio Optimizado:** Acceso con fracción del capital
- **Tranquilidad Absoluta:** Gestión integral incluida
- **Activo Autosostenible:** Ingresos pasivos y revalorización

#### Sección Destino: "Un Destino de Clase Mundial - Tulum Country Club"

**Propósito:** Destacar ubicación premium y características del desarrollo.

#### Sección Visión: "Tu Llave a un Mundo de Destinos"

**Propósito:** Expandir visión hacia futuras oportunidades.

### 3.2 Metadatos SEO

```typescript
export const metadata: Metadata = {
  title: "Fractional Tulum - Inversión Inmobiliaria Inteligente",
  description: "Invierte en propiedades de lujo en Tulum con una fracción del capital. Patrimonio optimizado, gestión integral y activos autosostenibles.",
  openGraph: {
    title: "Fractional Tulum - El Lujo de la Inteligencia",
    description: "Más allá de la propiedad tradicional. Descubre la inversión inmobiliaria fraccionada en Tulum.",
    images: ["https://tulumfractional.b-cdn.net/og-image.jpg"]
  }
}
```

## 4. Página Propiedad Inteligente (/propiedad-inteligente)

**Archivo:** `src/app/(public)/propiedad-inteligente/page.tsx`

### 4.1 Estructura de Contenido

**Sección Hero:**
- Título: "Propiedad Inteligente"
- Subtítulo explicativo del concepto
- Video de fondo específico para esta página

**Secciones principales:**
1. **Concepto de Inversión Fraccionada**
   - Explicación detallada del modelo
   - Beneficios vs inversión tradicional
   - Casos de uso y ejemplos

2. **Tecnología y Transparencia**
   - Plataforma digital
   - Reportes en tiempo real
   - Blockchain y tokenización

3. **Rentabilidad y Proyecciones**
   - Modelos de retorno
   - Proyecciones de crecimiento
   - Comparativas de mercado

### 4.2 Componentes Específicos

- **InvestmentCalculator:** Calculadora interactiva de inversión
- **ComparisonTable:** Tabla comparativa de modelos de inversión
- **ROIChart:** Gráficos de retorno de inversión
- **TestimonialCards:** Testimonios de inversionistas

### 4.3 Metadatos SEO

```typescript
export const metadata: Metadata = {
  title: "Propiedad Inteligente - Inversión Fraccionada en Tulum",
  description: "Descubre el concepto de propiedad inteligente. Inversión inmobiliaria fraccionada con tecnología blockchain y transparencia total.",
  keywords: ["propiedad inteligente", "inversión fraccionada", "blockchain inmobiliario", "Tulum"]
}
```

## 5. Página Nuestra Villa (/nuestra-villa)

**Archivo:** `src/app/(public)/nuestra-villa/page.tsx`

### 5.1 Estructura de Contenido

**Sección Hero:**
- Título: "Nuestra Villa"
- Galería de imágenes principal
- Video tour virtual

**Secciones principales:**
1. **Especificaciones de la Propiedad**
   - Metraje y distribución
   - Acabados y materiales premium
   - Amenidades incluidas

2. **Ubicación y Entorno**
   - Mapa interactivo
   - Puntos de interés cercanos
   - Accesibilidad y transporte

3. **Galería Multimedia**
   - Galería de fotos profesionales
   - Videos 360°
   - Planos arquitectónicos

### 5.2 Componentes Específicos

- **ImageGallery:** Galería de imágenes con lightbox
- **VirtualTour:** Tour virtual 360°
- **InteractiveMap:** Mapa con puntos de interés
- **FloorPlans:** Visualizador de planos
- **AmenitiesList:** Lista interactiva de amenidades

### 5.3 Metadatos SEO

```typescript
export const metadata: Metadata = {
  title: "Nuestra Villa - Lujo y Exclusividad en Tulum Country Club",
  description: "Conoce nuestra villa de lujo en Tulum Country Club. Especificaciones premium, ubicación privilegiada y amenidades de clase mundial.",
  keywords: ["villa Tulum", "Tulum Country Club", "propiedad lujo", "inversión inmobiliaria"]
}
```

## 6. Página La Propuesta (/la-propuesta)

**Archivo:** `src/app/(public)/la-propuesta/page.tsx`

### 6.1 Estructura de Contenido

**Sección Hero:**
- Título: "La Propuesta"
- Subtítulo sobre modelo de negocio innovador

**Secciones principales:**
1. **Modelo de Negocio**
   - Estructura de la inversión
   - Participación fraccionada
   - Derechos y beneficios

2. **Proceso de Inversión**
   - Pasos para invertir
   - Documentación requerida
   - Timeline del proceso

3. **Gestión y Administración**
   - Servicios incluidos
   - Equipo de gestión
   - Reportes y transparencia

4. **Rentabilidad y Salida**
   - Modelos de retorno
   - Opciones de salida
   - Mercado secundario

### 6.2 Componentes Específicos

- **BusinessModelDiagram:** Diagrama del modelo de negocio
- **InvestmentProcess:** Flujo del proceso de inversión
- **ReturnsCalculator:** Calculadora de retornos
- **DocumentationList:** Lista de documentos requeridos

### 6.3 Metadatos SEO

```typescript
export const metadata: Metadata = {
  title: "La Propuesta - Modelo de Inversión Fraccionada Innovador",
  description: "Conoce nuestro modelo de negocio innovador. Inversión fraccionada con gestión integral y retornos atractivos en Tulum.",
  keywords: ["modelo negocio", "inversión fraccionada", "retornos inmobiliarios", "Tulum"]
}
```

## 7. Página Nuestro Equipo (/nuestro-equipo)

**Archivo:** `src/app/(public)/nuestro-equipo/page.tsx`

### 7.1 Estructura de Contenido

**Sección Hero:**
- Título: "Nuestro Equipo"
- Subtítulo sobre experiencia y expertise

**Secciones principales:**
1. **Equipo Directivo**
   - CEO y fundadores
   - Biografías profesionales
   - Experiencia relevante

2. **Equipo de Gestión**
   - Gerentes de proyecto
   - Especialistas en inversiones
   - Equipo de operaciones

3. **Asesores y Consultores**
   - Board de asesores
   - Consultores especializados
   - Partners estratégicos

### 7.2 Componentes Específicos

- **TeamMemberCard:** Tarjetas de miembros del equipo
- **BiographyModal:** Modal con biografía detallada
- **ExperienceTimeline:** Timeline de experiencia
- **LinkedInIntegration:** Enlaces a perfiles profesionales

### 7.3 Metadatos SEO

```typescript
export const metadata: Metadata = {
  title: "Nuestro Equipo - Expertos en Inversión Inmobiliaria",
  description: "Conoce al equipo de expertos detrás de Fractional Tulum. Profesionales con amplia experiencia en inversiones inmobiliarias y gestión de activos.",
  keywords: ["equipo Fractional Tulum", "expertos inmobiliarios", "gestión activos", "inversiones"]
}
```

## 8. Página Preguntas Frecuentes (/preguntas-frecuentes)

**Archivo:** `src/app/(public)/preguntas-frecuentes/page.tsx`

### 8.1 Estructura de Contenido

**Sección Hero:**
- Título: "Preguntas Frecuentes"
- Subtítulo sobre resolución de dudas

**Categorías de FAQ:**
1. **Inversión y Rentabilidad**
   - Monto mínimo de inversión
   - Proyecciones de retorno
   - Riesgos asociados

2. **Proceso y Documentación**
   - Pasos para invertir
   - Documentos requeridos
   - Tiempos de proceso

3. **Gestión y Administración**
   - Servicios incluidos
   - Reportes y comunicación
   - Mantenimiento de la propiedad

4. **Aspectos Legales**
   - Estructura legal
   - Derechos del inversionista
   - Regulaciones aplicables

5. **Tecnología y Plataforma**
   - Uso de la plataforma
   - Seguridad de datos
   - Soporte técnico

### 8.2 Componentes Específicos

- **FAQAccordion:** Acordeón con preguntas y respuestas
- **CategoryFilter:** Filtro por categorías
- **SearchFAQ:** Buscador de preguntas
- **ContactSupport:** Formulario de contacto para dudas adicionales

### 8.3 Metadatos SEO

```typescript
export const metadata: Metadata = {
  title: "Preguntas Frecuentes - Fractional Tulum",
  description: "Encuentra respuestas a las preguntas más frecuentes sobre inversión fraccionada en Tulum. Proceso, rentabilidad, gestión y más.",
  keywords: ["FAQ Fractional Tulum", "preguntas inversión", "dudas inmobiliarias", "Tulum"]
}
```

## 9. Componentes Compartidos

### 9.1 BackgroundVideo Component

**Ubicación:** `src/components/layout/BackgroundVideo.tsx`

**Funcionalidades:**
- Video dinámico según tema (claro/oscuro) y dispositivo (móvil/escritorio)
- Fuentes de video optimizadas:
  - Desktop Light: `https://vz-fd0addf5-731.b-cdn.net/06b7529e-a84c-42df-8f4a-9e5dd649499a/playlist.m3u8`
  - Desktop Dark: `https://vz-fd0addf5-731.b-cdn.net/a0be1ccb-53a8-4a6e-942b-7e00a789d9fa/playlist.m3u8`
  - Mobile Light: `https://vz-fd0addf5-731.b-cdn.net/418f14b3-3071-40e3-ad8c-b199b8a9ee53/playlist.m3u8`
  - Mobile Dark: `https://vz-fd0addf5-731.b-cdn.net/3e2475ff-066c-472f-b57d-3a32ade62b98/playlist.m3u8`

**Características técnicas:**
- Tecnología HLS con HLS.js para streaming adaptativo
- Transiciones suaves con sistema de doble video
- Detección automática de dispositivo móvil
- Soporte nativo para Safari/iOS
- Gestión de memoria con cleanup de instancias HLS

### 9.2 PublicNavbar Component

**Ubicación:** `src/components/PublicNavbar.tsx`

**Funcionalidades:**
- Navegación responsive con menú hamburguesa
- Logo con enlace a inicio
- Menú de navegación principal
- Selector de tema integrado
- Botón CTA "Acceder"

**Características técnicas:**
- Estado de menú móvil con animaciones
- Detección de ruta activa
- Integración con `next-themes`
- Sticky navigation en scroll

### 9.3 ThemeSwitcher Component

**Ubicación:** `src/components/ThemeSwitcher.tsx`

**Funcionalidades:**
- Alternancia entre tema claro y oscuro
- Iconos animados (sol/luna)
- Persistencia de preferencia

**Características técnicas:**
- Integración con `next-themes`
- Animaciones CSS para transiciones
- Prevención de flash de contenido sin estilo

## 10. Sistema de Temas y Estilos

### 10.1 Configuración de Temas

**Archivo:** `src/app/layout.tsx`

```typescript
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
```

**Script de inicialización:**
- Detección de tema del sistema
- Aplicación inmediata de clase `dark`
- Prevención de FOUC (Flash of Unstyled Content)

### 10.2 Paleta de Colores

**Dorado Prestigio:** `#B89E63`
- Botones CTA principales
- Acentos premium
- Hover states: `#A08A56`

**Gradientes:**
```css
/* Títulos principales */
bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600

/* Elementos de acento */
bg-gradient-to-br from-amber-400 to-amber-600
```

### 10.3 Tipografía

**Fuentes:**
- Geist Sans (variable): Texto principal
- Geist Mono (variable): Código y elementos técnicos

**Jerarquía:**
- H1: `text-5xl md:text-7xl font-bold`
- H2: `text-4xl md:text-6xl font-bold`
- H3: `text-2xl md:text-4xl font-semibold`
- Párrafos: `text-lg md:text-xl`

## 11. Animaciones GSAP

### 11.1 Configuración Base

```typescript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
```

### 11.2 Tipos de Animaciones

**Animaciones de Entrada:**
- Fade in con slide up para títulos
- Animaciones escalonadas para grids
- Efectos de escala para botones

**Animaciones de Scroll:**
- ScrollTrigger para activación por viewport
- Parallax sutil para elementos de fondo
- Indicadores de progreso

**Animaciones Interactivas:**
- Hover effects en botones y tarjetas
- Transiciones de tema
- Smooth scroll entre secciones

### 11.3 Optimización de Performance

- Uso de `transform` y `opacity` para animaciones
- `will-change` para elementos animados
- Cleanup automático de ScrollTriggers
- Reducción en dispositivos de baja potencia

## 12. Responsive Design

### 12.1 Breakpoints

- **Mobile:** < 768px
- **Tablet:** 768px - 1024px
- **Desktop:** > 1024px

### 12.2 Adaptaciones por Dispositivo

**Mobile:**
- Videos optimizados para móvil
- Grid de 1 columna
- Tipografía reducida
- Navegación hamburguesa
- Botones con área de toque ampliada

**Tablet:**
- Grid de 2 columnas
- Tipografía intermedia
- Videos de escritorio con calidad ajustada

**Desktop:**
- Grid de 3 columnas
- Tipografía completa
- Videos de alta calidad
- Efectos de hover avanzados

## 13. SEO y Metadatos

### 13.1 Configuración Global

**Archivo:** `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: {
    default: "Fractional Tulum - Inversión Inmobiliaria Inteligente",
    template: "%s | Fractional Tulum"
  },
  description: "Plataforma de inversión inmobiliaria fraccionada en Tulum. Accede a propiedades de lujo con una fracción del capital tradicional.",
  keywords: ["inversión inmobiliaria", "Tulum", "propiedad fraccionada", "bienes raíces"],
  authors: [{ name: "Fractional Tulum" }],
  creator: "Fractional Tulum",
  publisher: "Fractional Tulum",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: "https://fractional-tulum.com",
    siteName: "Fractional Tulum",
    images: [{
      url: "https://tulumfractional.b-cdn.net/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Fractional Tulum - Inversión Inmobiliaria Inteligente"
    }]
  },
  twitter: {
    card: "summary_large_image",
    site: "@FractionalTulum",
    creator: "@FractionalTulum"
  },
  icons: {
    icon: [
      { url: "https://tulumfractional.b-cdn.net/public/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "https://tulumfractional.b-cdn.net/public/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "https://tulumfractional.b-cdn.net/public/favicon.ico", sizes: "32x32" }
    ],
    apple: [{ url: "https://tulumfractional.b-cdn.net/public/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "android-chrome-192x192", url: "https://tulumfractional.b-cdn.net/public/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "https://tulumfractional.b-cdn.net/public/android-chrome-512x512.png" }
    ]
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-site-verification-code"
  }
}
```

### 13.2 Metadatos por Página

Cada página incluye metadatos específicos optimizados para:
- Título único y descriptivo
- Meta description relevante
- Keywords específicas
- Open Graph tags
- Twitter Cards
- Canonical URLs

### 13.3 Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Fractional Tulum",
  "url": "https://fractional-tulum.com",
  "logo": "https://tulumfractional.b-cdn.net/logo.png",
  "description": "Plataforma de inversión inmobiliaria fraccionada en Tulum",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "MX",
    "addressRegion": "Quintana Roo",
    "addressLocality": "Tulum"
  }
}
```

## 14. Performance y Optimización

### 14.1 Optimización de Videos

- Streaming HLS adaptativo
- Preload según conexión y dispositivo
- Fallbacks para navegadores sin soporte
- Compresión optimizada por calidad de red

### 14.2 Optimización de Imágenes

- Next.js Image component con lazy loading
- Formatos WebP y AVIF cuando sea posible
- Responsive images con srcset
- CDN optimizado (B-CDN)

### 14.3 Code Splitting y Bundle Optimization

- Lazy loading de componentes no críticos
- Dynamic imports para funcionalidades específicas
- Tree shaking automático
- Minimización de dependencias

### 14.4 Core Web Vitals

**Métricas objetivo:**
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1

**Estrategias de optimización:**
- Preload de recursos críticos
- Optimización de fonts con font-display: swap
- Minimización de layout shifts
- Service Worker para cache estratégico

## 15. Accesibilidad (a11y)

### 15.1 Estándares WCAG 2.1

**Nivel AA compliance:**
- Contraste de colores adecuado (4.5:1 mínimo)
- Navegación por teclado funcional
- Screen reader compatibility
- Alt texts descriptivos para imágenes

### 15.2 Implementaciones Específicas

- Semantic HTML5 structure
- ARIA labels y roles apropiados
- Focus management en modales y navegación
- Skip links para navegación rápida
- Reduced motion support

### 15.3 Testing de Accesibilidad

- Automated testing con axe-core
- Manual testing con screen readers
- Keyboard navigation testing
- Color contrast validation

## 16. Estructura de Archivos

```
src/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx                    # Layout público base
│   │   ├── page.tsx                      # Página principal
│   │   ├── propiedad-inteligente/
│   │   │   └── page.tsx                  # Página propiedad inteligente
│   │   ├── nuestra-villa/
│   │   │   └── page.tsx                  # Página nuestra villa
│   │   ├── la-propuesta/
│   │   │   └── page.tsx                  # Página la propuesta
│   │   ├── nuestro-equipo/
│   │   │   └── page.tsx                  # Página nuestro equipo
│   │   └── preguntas-frecuentes/
│   │       └── page.tsx                  # Página FAQ
│   ├── globals.css                       # Estilos globales
│   ├── layout.tsx                        # Layout raíz
│   └── metadata.ts                       # Metadatos compartidos
├── components/
│   ├── layout/
│   │   ├── BackgroundVideo.tsx           # Video de fondo dinámico
│   │   └── Footer.tsx                    # Footer público
│   ├── PublicNavbar.tsx                  # Navegación pública
│   ├── ThemeSwitcher.tsx                 # Selector de tema
│   └── ui/                               # Componentes UI base
│       ├── button.tsx
│       ├── card.tsx
│       └── ...
└── lib/
    ├── utils.ts                          # Utilidades generales
    └── constants.ts                      # Constantes de la aplicación
```

## 17. Próximos Pasos y Roadmap

### 17.1 Optimizaciones Pendientes

**Q1 2025:**
- Implementación de Service Worker para cache avanzado
- A/B testing para optimización de conversión
- Analytics avanzados con heat mapping
- Optimización de Core Web Vitals

**Q2 2025:**
- Integración con CMS headless para contenido dinámico
- Personalización basada en geolocalización
- Chatbot con IA para atención al cliente
- Progressive Web App (PWA) capabilities

### 17.2 Funcionalidades Futuras

- Calculadora de inversión avanzada con simulaciones
- Tour virtual 3D de propiedades
- Integración con plataformas de pago
- Dashboard de inversionista en tiempo real
- Marketplace secundario para fracciones

### 17.3 Mantenimiento y Monitoreo

**Monitoreo continuo:**
- Performance monitoring con Real User Monitoring (RUM)
- Error tracking con Sentry
- SEO monitoring con herramientas especializadas
- Security scanning automatizado

**Actualizaciones regulares:**
- Dependencias de seguridad
- Optimizaciones de performance
- Contenido y metadatos SEO
- Testing cross-browser

---

**Última actualización:** Enero 2025  
**Versión:** 2.0  
**Responsable técnico:** Equipo de Desarrollo Fractional Tulum  
**Próxima revisión:** Marzo 2025