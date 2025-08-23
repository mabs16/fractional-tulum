'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import type { EmailOtpType } from '@supabase/supabase-js'
import type { UserRole, Profile } from '@/lib/supabase'

// Extender los tipos existentes para incluir los roles específicos del callback
type CallbackUserRole = UserRole | 'PROPIETARIO' | 'INQUILINO' | 'REVISION'

interface CallbackProfile extends Omit<Profile, 'role'> {
  role: CallbackUserRole
}

function getRedirectPathByRole(role: CallbackUserRole): string {
  const roleRedirects: Record<CallbackUserRole, string> = {
    ADMIN: '/admin',
    COPROPIETARIO: '/copropietario',
    PROSPECTO: '/prospecto', 
    PENDIENTE: '/revision',
    PROPIETARIO: '/propietario',
    INQUILINO: '/inquilino',
    REVISION: '/revision'
  }
  return roleRedirects[role] || '/revision'
}

export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 [AUTH CALLBACK CLIENT] Iniciando procesamiento del callback')
        console.log('🌐 [AUTH CALLBACK CLIENT] URL completa:', window.location.href)
        console.log('🔗 [AUTH CALLBACK CLIENT] Hash:', window.location.hash)
        console.log('❓ [AUTH CALLBACK CLIENT] Search params:', window.location.search)
        
        // Primero intentar obtener tokens del fragmento de URL (OAuth flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const expiresAt = hashParams.get('expires_at')
        const tokenType = hashParams.get('token_type')
        
        // Luego verificar parámetros de consulta (Email verification flow)
        const searchParams = new URLSearchParams(window.location.search)
        const verificationToken = searchParams.get('token')
        const verificationType = searchParams.get('type')
        
        console.log('🔍 [AUTH CALLBACK CLIENT] Tokens del fragmento (OAuth):', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          expiresAt,
          tokenType
        })
        
        console.log('📧 [AUTH CALLBACK CLIENT] Parámetros de verificación (Email):', {
          hasVerificationToken: !!verificationToken,
          verificationType,
          fullToken: verificationToken?.substring(0, 20) + '...'
        })

        // Flujo 1: OAuth con tokens en el fragmento
        if (accessToken && refreshToken) {
          console.log('🔐 [AUTH CALLBACK CLIENT] Procesando flujo OAuth - Estableciendo sesión con tokens')
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (sessionError) {
            console.error('❌ [AUTH CALLBACK CLIENT] Error al establecer sesión OAuth:', sessionError)
            setStatus('error')
            setMessage('Error al establecer la sesión OAuth')
            setTimeout(() => router.push('/login?error=oauth_session_error'), 2000)
            return
          }

          if (!sessionData.session) {
            console.error('❌ [AUTH CALLBACK CLIENT] No se pudo crear la sesión OAuth')
            setStatus('error')
            setMessage('No se pudo crear la sesión OAuth')
            setTimeout(() => router.push('/login?error=oauth_no_session'), 2000)
            return
          }

          console.log('✅ [AUTH CALLBACK CLIENT] Sesión OAuth establecida correctamente:', {
            userId: sessionData.session.user.id,
            email: sessionData.session.user.email,
            expiresAt: sessionData.session.expires_at
          })
          
          await handleSuccessfulAuth(sessionData.session.user.id)
          return
        }
        
        // Flujo 2: Verificación de email con token
        if (verificationToken && verificationType) {
          console.log('📧 [AUTH CALLBACK CLIENT] Procesando flujo de verificación de email')
          
          const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: verificationToken,
            type: verificationType as EmailOtpType
          })
          
          if (verifyError) {
            console.error('❌ [AUTH CALLBACK CLIENT] Error al verificar email:', verifyError)
            setStatus('error')
            setMessage('Error al verificar el email')
            setTimeout(() => router.push('/login?error=email_verification_error'), 2000)
            return
          }
          
          if (!verifyData.session) {
            console.error('❌ [AUTH CALLBACK CLIENT] No se pudo crear la sesión después de verificar email')
            setStatus('error')
            setMessage('No se pudo crear la sesión después de verificar el email')
            setTimeout(() => router.push('/login?error=email_no_session'), 2000)
            return
          }
          
          console.log('✅ [AUTH CALLBACK CLIENT] Email verificado y sesión establecida:', {
            userId: verifyData.session.user.id,
            email: verifyData.session.user.email,
            expiresAt: verifyData.session.expires_at
          })
          
          await handleSuccessfulAuth(verifyData.session.user.id)
          return
        }
        
        // Si no hay tokens de ningún tipo
        console.error('❌ [AUTH CALLBACK CLIENT] No se encontraron tokens válidos')
        setStatus('error')
        setMessage('No se encontraron tokens de autenticación válidos')
        setTimeout(() => router.push('/login?error=no_tokens'), 2000)
        return
        
      } catch (error) {
        console.error('💥 [AUTH CALLBACK CLIENT] Error inesperado:', error)
        setStatus('error')
        setMessage('Error inesperado durante la autenticación')
        setTimeout(() => router.push('/login?error=unexpected'), 2000)
      }
    }
    
    const handleSuccessfulAuth = async (userId: string) => {
      try {

        // Obtener el perfil del usuario
        console.log('👤 [AUTH CALLBACK CLIENT] Obteniendo perfil del usuario')
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (profileError) {
          console.error('❌ [AUTH CALLBACK CLIENT] Error al obtener perfil:', profileError)
          setStatus('error')
          setMessage('Error al obtener el perfil del usuario')
          setTimeout(() => router.push('/revision?error=profile_error'), 2000)
          return
        }

        if (!profile) {
          console.warn('⚠️ [AUTH CALLBACK CLIENT] No se encontró perfil, redirigiendo a revisión')
          setStatus('success')
          setMessage('Perfil en revisión')
          setTimeout(() => router.push('/revision?reason=no_profile'), 2000)
          return
        }

        console.log('✅ [AUTH CALLBACK CLIENT] Perfil obtenido:', {
          id: profile.id,
          email: profile.email,
          role: profile.role,
          firstName: profile.first_name,
          lastName: profile.last_name
        })

        // Determinar la ruta de redirección basada en el rol
        const redirectPath = getRedirectPathByRole(profile.role)
        console.log('🎯 [AUTH CALLBACK CLIENT] Redirigiendo a:', redirectPath)
        
        setStatus('success')
        const displayName = profile.first_name && profile.last_name 
          ? `${profile.first_name} ${profile.last_name}` 
          : profile.email
        setMessage(`Bienvenido, ${displayName}. Redirigiendo...`)
        
        // Limpiar el fragmento de la URL antes de redireccionar
        window.history.replaceState({}, document.title, window.location.pathname)
        
        setTimeout(() => router.push(redirectPath), 1500)

      } catch (error) {
        console.error('💥 [AUTH CALLBACK CLIENT] Error inesperado en handleSuccessfulAuth:', error)
        setStatus('error')
        setMessage('Error inesperado durante la autenticación')
        setTimeout(() => router.push('/login?error=unexpected'), 2000)
      }
    }

    handleAuthCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Procesando autenticación...
              </h2>
              <p className="text-gray-600">
                Por favor espera mientras verificamos tu sesión.
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                ¡Autenticación exitosa!
              </h2>
              <p className="text-green-700">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-red-900 mb-2">
                Error de autenticación
              </h2>
              <p className="text-red-700 mb-4">{message}</p>
              <p className="text-sm text-gray-600">
                Serás redirigido automáticamente...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}