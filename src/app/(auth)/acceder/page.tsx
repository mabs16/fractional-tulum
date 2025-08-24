'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthForm from '@/components/auth/AuthForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { BackgroundVideo } from '@/components/layout/BackgroundVideo'

export default function AccederPage() {
  const [authView, setAuthView] = useState<'sign_in' | 'sign_up'>('sign_in')
  const router = useRouter()

  const getSubtitle = () => {
    return authView === 'sign_in' ? 'Inicia sesión en tu cuenta' : 'Registra tu cuenta'
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Video de fondo */}
      <BackgroundVideo />
      
      {/* Botón de regresar */}
      <Button 
        variant="ghost" 
        size="icon"
        className="fixed top-4 left-4 z-50 bg-white/80 hover:bg-white/90 dark:bg-black/80 dark:hover:bg-black/90 shadow-md backdrop-blur-sm border border-white/20 dark:border-white/10"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-5 w-5 text-stone-700 dark:text-stone-300" />
        <span className="sr-only">Regresar</span>
      </Button>
      
      <Card className="w-full max-w-md border-white/20 dark:border-white/10 shadow-xl shadow-black/20 bg-white/95 dark:bg-black/90 backdrop-blur-md">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl font-bold text-center text-stone-800 dark:text-stone-200 tracking-tight">
            Bienvenido a Fractional Tulum
          </CardTitle>
          <p className="text-center text-stone-600 dark:text-stone-400 mt-2 font-medium transition-all duration-300">
            {getSubtitle()}
          </p>
        </CardHeader>
        <CardContent className="pt-0">
          <AuthForm onViewChange={setAuthView} />
        </CardContent>
      </Card>
    </div>
  )
}