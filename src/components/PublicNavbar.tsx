'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

export function PublicNavbar() {
  const pathname = usePathname()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/propiedad-inteligente', label: 'Propiedad Inteligente' },
    { href: '/nuestra-villa', label: 'Nuestra Villa' },
    { href: '/la-propuesta', label: 'La Propuesta' },
    { href: '/nuestro-equipo', label: 'Nuestro Equipo' },
    { href: '/faq', label: 'Preguntas Frecuentes' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4">
      {/* Contenedor principal con estilos corregidos para dark mode */}
      <div className="flex h-16 w-full max-w-7xl items-center justify-between rounded-full bg-white/70 dark:bg-stone-900/70 px-6 shadow-lg backdrop-blur-md border border-brand-gold/30">
        
        {/* Logo a la izquierda */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="https://tulumfractional.b-cdn.net/Hole%20in%20One%20Fractional%20Tulum%20512%20x%20126.png" 
              alt="Fractional Tulum Logo" 
              className="h-8 w-auto md:h-12 [filter:drop-shadow(0_2px_2px_rgba(0,0,0,0.4))] dark:[filter:none]"
            />
          </Link>
        </div>

        {/* Botones de Acción para Escritorio */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeSwitcher />
          
          {/* --- NAVEGACIÓN PARA ESCRITORIO CON SHEET --- */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <span>Menú</span>
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="grid gap-6 p-6">
                <div className="flex flex-col items-start mb-6">
                   <Link href="/" onClick={() => setIsSheetOpen(false)}>
                     <img 
                       src="https://tulumfractional.b-cdn.net/Hole%20in%20One%20Fractional%20Tulum%20512%20x%20126.png" 
                       alt="Fractional Tulum Logo" 
                       className="h-16 w-auto mb-4 [filter:drop-shadow(0_2px_4px_rgba(0,0,0,0.4))] dark:[filter:none]"
                     />
                   </Link>
                 </div>
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={pathname === link.href ? 'text-lg font-semibold text-brand-gold' : 'text-lg text-muted-foreground hover:text-foreground'}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-4 border-brand-gold/50"/>
                <Button asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                  <Link href="/acceder">Acceder / Registrarse</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          {/* --- FIN NAVEGACIÓN PARA ESCRITORIO --- */}
        </div>

        {/* --- INICIO DE LA CORRECCIÓN PARA MÓVIL --- */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitcher /> {/* Botón de tema AHORA está aquí afuera */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Abrir menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              <div className="grid gap-6 p-6">
                <div className="flex flex-col items-start mb-6">
                   <Link href="/" onClick={() => setIsSheetOpen(false)}>
                     <img 
                       src="https://tulumfractional.b-cdn.net/Hole%20in%20One%20Fractional%20Tulum%20512%20x%20126.png" 
                       alt="Fractional Tulum Logo" 
                       className="h-16 w-auto mb-4 [filter:drop-shadow(0_4px_8px_rgba(0,0,0,0.3))] dark:[filter:none]"
                     />
                   </Link>
                 </div>
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    className={pathname === link.href ? 'text-lg font-semibold text-brand-gold' : 'text-lg text-muted-foreground hover:text-foreground'}
                    onClick={() => setIsSheetOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="my-4 border-brand-gold/50"/>
                <Button asChild className="w-full" onClick={() => setIsSheetOpen(false)}>
                  <Link href="/acceder">Acceder / Registrarse</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {/* --- FIN DE LA CORRECCIÓN PARA MÓVIL --- */}

      </div>
    </header>
  );
}