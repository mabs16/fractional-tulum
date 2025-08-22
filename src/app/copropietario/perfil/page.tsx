'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateEmailAction } from '@/app/actions/email-update'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

export default function CopropietarioPerfilPage() {
  const [user, setUser] = useState<User | null>(null)
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Obtener información del usuario actual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()
  }, [])

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const formData = new FormData()
    formData.append('email', newEmail)

    try {
      const result = await updateEmailAction(formData)
      
      if (result.success) {
        setMessage(result.message || 'Correo actualizado exitosamente')
        setNewEmail('')
      } else {
        setError(result.error || 'Error al actualizar el correo')
      }
    } catch (error) {
      setError('Error interno del servidor')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-stone-600">Cargando perfil...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Información del Perfil */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Mi Perfil</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-stone-700">Correo Electrónico Actual</label>
              <p className="text-lg text-stone-900 mt-1">{user.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">ID de Usuario</label>
              <p className="text-sm text-stone-600 mt-1 font-mono">{user.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700">Última Conexión</label>
              <p className="text-sm text-stone-600 mt-1">
                {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('es-ES') : 'No disponible'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cambiar Correo Electrónico */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Cambiar Correo Electrónico</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailUpdate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stone-700">
                  Nueva dirección de correo
                </label>
                <Input
                  type="email"
                  placeholder="nuevo@correo.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="w-full"
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              {message && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                  {message}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading || !newEmail}
              >
                {loading ? 'Actualizando...' : 'Actualizar Correo'}
              </Button>
            </form>
            
            <div className="mt-4 text-xs text-stone-500">
              <p>Se enviará un enlace de confirmación a tu nueva dirección de correo.</p>
              <p>Deberás confirmar el cambio desde tu nuevo correo para que sea efectivo.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}