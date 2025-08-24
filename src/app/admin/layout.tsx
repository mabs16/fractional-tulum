'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Building,
  FileText,
  FileSignature,
  Calendar,
  CalendarDays,
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeSwitcher } from '@/components/ThemeSwitcher'

// Componente de navegación lateral
function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Usuarios',
      href: '/admin/users',
      icon: Users
    },
    {
      title: 'Propiedad',
      href: '/admin/propiedad',
      icon: Building
    },
    {
      title: 'Documentos',
      href: '/admin/documentos',
      icon: FileText
    },
    {
      title: 'Contratos',
      href: '/admin/contratos',
      icon: FileSignature
    },
    {
      title: 'Disponibilidad',
      href: '/admin/disponibilidad',
      icon: Calendar
    },
    {
      title: 'Citas',
      href: '/admin/citas',
      icon: CalendarDays
    }
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      {/* Header del sidebar */}
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold text-foreground">
          Panel de Admin
        </h2>
      </div>

      {/* Navegación */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="border-t p-4">
        <Link href="/" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Salir del Admin
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header principal */}
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">
              Administración
            </h1>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Panel de control administrativo
              </div>
              <ThemeSwitcher />
            </div>
          </div>
        </header>
        
        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}