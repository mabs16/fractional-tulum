import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldX, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'

export default function AccesoDenegadoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ShieldX className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-stone-800">
              Acceso Denegado
            </CardTitle>
            <CardDescription className="text-stone-600 text-lg">
              No tienes permisos para acceder a esta página
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm text-center">
                Tu rol de usuario no tiene los permisos necesarios para ver este contenido.
                Si crees que esto es un error, contacta al administrador.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/" className="flex items-center justify-center gap-2">
                  <Home className="w-4 h-4" />
                  Ir al Inicio
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="w-full">
                <Link href="javascript:history.back()" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Volver Atrás
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}