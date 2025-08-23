'use client'
import { useState } from 'react'
import AuthForm from '@/components/auth/AuthForm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AccederPage() {
  const [authView, setAuthView] = useState<'sign_in' | 'sign_up'>('sign_in')

  const getSubtitle = () => {
    return authView === 'sign_in' ? 'Inicia sesión en tu cuenta' : 'Registra tu cuenta'
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-stone-50 to-stone-100">
      <Card className="w-full max-w-md border-stone-300 shadow-xl shadow-stone-200/50 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-2xl font-bold text-center text-stone-800 tracking-tight">
            Bienvenido a Fractional Tulum
          </CardTitle>
          <p className="text-center text-stone-600 mt-2 font-medium transition-all duration-300">
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