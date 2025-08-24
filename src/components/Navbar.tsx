import Link from 'next/link';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Link href="/" className="text-muted-foreground transition-colors hover:text-foreground">
            Inicio
          </Link>
          <Link href="/propiedad-inteligente" className="text-muted-foreground transition-colors hover:text-foreground">
            Propiedad Inteligente
          </Link>
          <Link href="/nuestra-villa" className="text-muted-foreground transition-colors hover:text-foreground">
            Propiedad Alfa
          </Link>
          <Link href="/la-propuesta" className="text-muted-foreground transition-colors hover:text-foreground">
            La Propuesta
          </Link>
          <Link href="/nuestro-equipo" className="text-muted-foreground transition-colors hover:text-foreground">
            Nuestro Equipo
          </Link>
          <Link href="/faq" className="text-muted-foreground transition-colors hover:text-foreground">
            Preguntas Frecuentes
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <Link href="/acceder" className="text-muted-foreground transition-colors hover:text-foreground">
            Acceder / Registrarse
          </Link>
        </div>
      </div>
    </nav>
  );
}