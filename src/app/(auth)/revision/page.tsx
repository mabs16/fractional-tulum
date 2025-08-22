import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, AlertCircle } from 'lucide-react'

export default function RevisionPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Cuenta en Revisión
            </CardTitle>
            <CardDescription className="text-base text-gray-600">
              Tu solicitud de acceso está siendo revisada por nuestro equipo. Te notificaremos por correo electrónico una vez que tu cuenta haya sido aprobada.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
              Tiempo estimado: 24-48 horas hábiles
            </Badge>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Mientras tanto, puedes cerrar esta ventana. Te contactaremos pronto.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}