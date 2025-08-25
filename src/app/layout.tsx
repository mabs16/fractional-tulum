import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Tulum Fractional - Inversión Inmobiliaria Inteligente",
  description: "Invierte en propiedades fraccionadas en Tulum. Acceso a bienes raíces de lujo con inversión mínima y máxima rentabilidad.",
  keywords: "inversión inmobiliaria, Tulum, propiedades fraccionadas, bienes raíces, México, inversión inteligente",
  authors: [{ name: "Tulum Fractional" }],
  creator: "Tulum Fractional",
  publisher: "Tulum Fractional",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://tulumfractional.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tulum Fractional - Inversión Inmobiliaria Inteligente",
    description: "Invierte en propiedades fraccionadas en Tulum. Acceso a bienes raíces de lujo con inversión mínima y máxima rentabilidad.",
    url: "https://tulumfractional.com",
    siteName: "Tulum Fractional",
    images: [
      {
        url: "https://tulumfractional.b-cdn.net/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tulum Fractional - Inversión Inmobiliaria Inteligente",
      },
    ],
    locale: "es_MX",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tulum Fractional - Inversión Inmobiliaria Inteligente",
    description: "Invierte en propiedades fraccionadas en Tulum. Acceso a bienes raíces de lujo con inversión mínima y máxima rentabilidad.",
    images: ["https://tulumfractional.b-cdn.net/og-image.jpg"],
  },
  icons: {
    icon: [
      {
        url: "https://tulumfractional.b-cdn.net/public/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "https://tulumfractional.b-cdn.net/public/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "https://tulumfractional.b-cdn.net/public/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "https://tulumfractional.b-cdn.net/public/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "https://tulumfractional.b-cdn.net/public/android-chrome-192x192.png",
      },
      {
        rel: "android-chrome-512x512",
        url: "https://tulumfractional.b-cdn.net/public/android-chrome-512x512.png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "",
  },
};
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem("theme");
                const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
                  .matches
                  ? "dark"
                  : "light";
                const effectiveTheme = theme === "system" ? systemTheme : theme;
                if (effectiveTheme === "dark") {
                  document.documentElement.classList.add("dark");
                } else {
                  document.documentElement.classList.remove("dark");
                }
              } catch (error) {
                console.error(error);
              }
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
