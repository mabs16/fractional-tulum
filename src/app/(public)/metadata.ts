import type { Metadata } from 'next'

const baseUrl = 'https://fractional-tulum.vercel.app'
const defaultImage = 'https://tulumfractional.b-cdn.net/og-image.jpg'

// Metadatos para la página de inicio
export const homeMetadata: Metadata = {
  title: 'Fractional Tulum | La Forma Inteligente de Ser Dueño en el Paraíso',
  description: 'Descubre la propiedad fraccional de lujo en Tulum Country Club. Invierte en un activo real, sin complicaciones y con todos los beneficios de un resort.',
  keywords: ['propiedad fraccional', 'Tulum', 'inversión inmobiliaria', 'lujo', 'Riviera Maya', 'resort', 'activo patrimonial'],
  authors: [{ name: 'Fractional Tulum' }],
  creator: 'Fractional Tulum',
  publisher: 'Fractional Tulum',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: baseUrl,
    title: 'Fractional Tulum | La Forma Inteligente de Ser Dueño en el Paraíso',
    description: 'Descubre la propiedad fraccional de lujo en Tulum Country Club. Invierte en un activo real, sin complicaciones y con todos los beneficios de un resort.',
    siteName: 'Fractional Tulum',
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Fractional Tulum - Propiedad Fraccional de Lujo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fractional Tulum | La Forma Inteligente de Ser Dueño en el Paraíso',
    description: 'Descubre la propiedad fraccional de lujo en Tulum Country Club. Invierte en un activo real, sin complicaciones y con todos los beneficios de un resort.',
    images: [defaultImage],
    creator: '@FractionalTulum',
  },
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
}

// Metadatos para la página de propiedad inteligente
export const propiedadInteligenteMetadata: Metadata = {
  title: '¿Qué es Propiedad Fraccional? | Modelo Fractional Tulum',
  description: 'Aprende la diferencia entre propiedad fraccional y tiempo compartido. Descubre cómo nuestro modelo te convierte en dueño real de un activo patrimonial en Tulum.',
  keywords: ['propiedad fraccional', 'tiempo compartido', 'diferencias', 'activo patrimonial', 'Tulum', 'inversión inteligente'],
  authors: [{ name: 'Fractional Tulum' }],
  creator: 'Fractional Tulum',
  publisher: 'Fractional Tulum',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/propiedad-inteligente',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: `${baseUrl}/propiedad-inteligente`,
    title: '¿Qué es Propiedad Fraccional? | Modelo Fractional Tulum',
    description: 'Aprende la diferencia entre propiedad fraccional y tiempo compartido. Descubre cómo nuestro modelo te convierte en dueño real de un activo patrimonial en Tulum.',
    siteName: 'Fractional Tulum',
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Propiedad Fraccional vs Tiempo Compartido - Fractional Tulum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '¿Qué es Propiedad Fraccional? | Modelo Fractional Tulum',
    description: 'Aprende la diferencia entre propiedad fraccional y tiempo compartido. Descubre cómo nuestro modelo te convierte en dueño real de un activo patrimonial en Tulum.',
    images: [defaultImage],
    creator: '@FractionalTulum',
  },
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
}

// Metadatos para la página de nuestra villa
export const nuestraVillaMetadata: Metadata = {
  title: 'Nuestra Villa en Tulum Country Club | Fractional Tulum',
  description: 'Explora la Propiedad Alfa a través de planos, renders y un recorrido virtual. Conoce las 4 suites de lujo y las amenidades de clase mundial que te esperan.',
  keywords: ['villa Tulum', 'Tulum Country Club', 'suites de lujo', 'amenidades', 'recorrido virtual', 'planos', 'renders'],
  authors: [{ name: 'Fractional Tulum' }],
  creator: 'Fractional Tulum',
  publisher: 'Fractional Tulum',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/nuestra-villa',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: `${baseUrl}/nuestra-villa`,
    title: 'Nuestra Villa en Tulum Country Club | Fractional Tulum',
    description: 'Explora la Propiedad Alfa a través de planos, renders y un recorrido virtual. Conoce las 4 suites de lujo y las amenidades de clase mundial que te esperan.',
    siteName: 'Fractional Tulum',
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Villa de Lujo en Tulum Country Club - Fractional Tulum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuestra Villa en Tulum Country Club | Fractional Tulum',
    description: 'Explora la Propiedad Alfa a través de planos, renders y un recorrido virtual. Conoce las 4 suites de lujo y las amenidades de clase mundial que te esperan.',
    images: [defaultImage],
    creator: '@FractionalTulum',
  },
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
}

// Metadatos para la página de la propuesta
export const laPropuestaMetadata: Metadata = {
  title: 'La Propuesta de Inversión | Fractional Tulum',
  description: 'Conoce los detalles de la inversión, nuestro plan de ejecución transparente y la visión a futuro. La forma más inteligente de invertir en la Riviera Maya.',
  keywords: ['inversión Tulum', 'plan de ejecución', 'Riviera Maya', 'inversión inteligente', 'propuesta financiera', 'retorno inversión'],
  authors: [{ name: 'Fractional Tulum' }],
  creator: 'Fractional Tulum',
  publisher: 'Fractional Tulum',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/la-propuesta',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: `${baseUrl}/la-propuesta`,
    title: 'La Propuesta de Inversión | Fractional Tulum',
    description: 'Conoce los detalles de la inversión, nuestro plan de ejecución transparente y la visión a futuro. La forma más inteligente de invertir en la Riviera Maya.',
    siteName: 'Fractional Tulum',
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Propuesta de Inversión - Fractional Tulum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'La Propuesta de Inversión | Fractional Tulum',
    description: 'Conoce los detalles de la inversión, nuestro plan de ejecución transparente y la visión a futuro. La forma más inteligente de invertir en la Riviera Maya.',
    images: [defaultImage],
    creator: '@FractionalTulum',
  },
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
}

// Metadatos para la página de nuestro equipo
export const nuestroEquipoMetadata: Metadata = {
  title: 'Nuestro Equipo | Expertos Detrás de Fractional Tulum',
  description: 'Conoce a los fundadores y profesionales que garantizan la solidez y humanidad de tu inversión. Un equipo de expertos en construcción, finanzas y tecnología.',
  keywords: ['equipo Fractional Tulum', 'fundadores', 'expertos construcción', 'finanzas', 'tecnología', 'profesionales'],
  authors: [{ name: 'Fractional Tulum' }],
  creator: 'Fractional Tulum',
  publisher: 'Fractional Tulum',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/nuestro-equipo',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: `${baseUrl}/nuestro-equipo`,
    title: 'Nuestro Equipo | Expertos Detrás de Fractional Tulum',
    description: 'Conoce a los fundadores y profesionales que garantizan la solidez y humanidad de tu inversión. Un equipo de expertos en construcción, finanzas y tecnología.',
    siteName: 'Fractional Tulum',
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Equipo de Expertos - Fractional Tulum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nuestro Equipo | Expertos Detrás de Fractional Tulum',
    description: 'Conoce a los fundadores y profesionales que garantizan la solidez y humanidad de tu inversión. Un equipo de expertos en construcción, finanzas y tecnología.',
    images: [defaultImage],
    creator: '@FractionalTulum',
  },
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
}

// Metadatos para la página de preguntas frecuentes
export const faqMetadata: Metadata = {
  title: 'Preguntas Frecuentes (FAQ) | Fractional Tulum',
  description: 'Encuentra respuestas a todas tus dudas sobre nuestro modelo de propiedad fraccional, el proceso de inversión, la gestión de la propiedad y sus beneficios.',
  keywords: ['FAQ Fractional Tulum', 'preguntas frecuentes', 'dudas propiedad fraccional', 'proceso inversión', 'gestión propiedad'],
  authors: [{ name: 'Fractional Tulum' }],
  creator: 'Fractional Tulum',
  publisher: 'Fractional Tulum',
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: '/preguntas-frecuentes',
  },
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: `${baseUrl}/preguntas-frecuentes`,
    title: 'Preguntas Frecuentes (FAQ) | Fractional Tulum',
    description: 'Encuentra respuestas a todas tus dudas sobre nuestro modelo de propiedad fraccional, el proceso de inversión, la gestión de la propiedad y sus beneficios.',
    siteName: 'Fractional Tulum',
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Preguntas Frecuentes - Fractional Tulum',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preguntas Frecuentes (FAQ) | Fractional Tulum',
    description: 'Encuentra respuestas a todas tus dudas sobre nuestro modelo de propiedad fraccional, el proceso de inversión, la gestión de la propiedad y sus beneficios.',
    images: [defaultImage],
    creator: '@FractionalTulum',
  },
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
}