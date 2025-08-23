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
  LogOut
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    }
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      {/* Header del sidebar */}
      <div className="flex h-16 items-center border-b px-6">
        <h2 className="text-lg font-semibold text-gray-900">
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
                'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <AdminSidebar />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header principal */}
        <header className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              Administración
            </h1>
            <div className="text-sm text-gray-500">
              Panel de control administrativo
            </div>
          </div>
        </header>
        
        {/* Área de contenido */}
        <main className="flex-1 overflow-y-auto bg-white">
          {children}
        </main>
      </div>
    </div>
  )
}