'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthFormProps {
  onViewChange?: (view: 'sign_in' | 'sign_up') => void
}

export default function AuthForm({ onViewChange }: AuthFormProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    console.log('🔧 [AUTH FORM] Configurando listeners de autenticación')
    
    // Verificar estado inicial de autenticación
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('❌ [AUTH FORM] Error al obtener sesión inicial:', error)
      } else if (session) {
        console.log('✅ [AUTH FORM] Sesión inicial encontrada:', session.user.email)
      } else {
        console.log('ℹ️ [AUTH FORM] No hay sesión inicial')
      }
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 [AUTH FORM] Evento de autenticación:', event)
      console.log('👤 [AUTH FORM] Datos de sesión:', {
        user_id: session?.user?.id,
        email: session?.user?.email,
        email_confirmed: session?.user?.email_confirmed_at,
        created_at: session?.user?.created_at
      })
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ [AUTH FORM] Usuario autenticado exitosamente')
        console.log('🔍 [AUTH FORM] Verificando estado del usuario...')
        
        // Verificar si el usuario necesita confirmar su email
        if (!session.user.email_confirmed_at) {
          console.log('📧 [AUTH FORM] Email no confirmado, redirigiendo a página de verificación')
          router.push('/verificar-correo')
          return
        }
        
        // Redireccionar al dashboard según el rol del usuario
        try {
          console.log('📊 [AUTH FORM] Consultando perfil del usuario:', session.user.id)
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
          
          console.log('📋 [AUTH FORM] Resultado de consulta de perfil:', { profile, error })
          
          if (profile?.role === 'ADMIN') {
            console.log('👑 [AUTH FORM] Redirigiendo a dashboard de admin')
            router.push('/admin')
          } else if (profile?.role === 'COPROPIETARIO') {
            console.log('🏠 [AUTH FORM] Redirigiendo a dashboard de copropietario')
            router.push('/copropietario')
          } else if (profile?.role === 'PROSPECTO') {
            console.log('🎯 [AUTH FORM] Redirigiendo a bienvenida de prospecto')
            router.push('/prospecto/bienvenida')
          } else {
            console.log('👤 [AUTH FORM] Sin rol definido o pendiente, redirigiendo a revisión')
            router.push('/revision')
          }
        } catch (error) {
          console.error('❌ [AUTH FORM] Error inesperado al obtener perfil:', error)
          console.error('🔍 [AUTH FORM] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available')
          router.push('/revision')
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🚪 [AUTH FORM] Usuario cerró sesión')
        router.push('/acceder')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 [AUTH FORM] Token renovado')
      }
    })
    
    // Detectar cambios en la vista del Auth component
    const detectViewChange = () => {
      // Detectar SOLO por el botón principal para evitar conflictos
      const buttons = document.querySelectorAll('button[type="submit"]')
      buttons.forEach(button => {
        const buttonText = button.textContent?.toLowerCase() || ''
        
        if (buttonText.includes('crear cuenta')) {
          console.log('Detectado modo REGISTRO por botón "Crear Cuenta"')
          onViewChange?.('sign_up')
        } else if (buttonText.includes('iniciar sesión')) {
          console.log('Detectado modo LOGIN por botón "Iniciar Sesión"')
          onViewChange?.('sign_in')
        }
      })
      
      // Agregar listeners a los links para detectar cambios cuando se haga clic
      const links = document.querySelectorAll('a')
      links.forEach(link => {
        const linkText = link.textContent?.toLowerCase() || ''
        
        // Remover listeners previos para evitar duplicados
        link.removeEventListener('click', handleLinkClick)
        
        if (linkText.includes('regístrate') || linkText.includes('registrate')) {
          link.addEventListener('click', handleLinkClick)
        } else if (linkText.includes('inicia sesión') || linkText.includes('ya tienes')) {
          link.addEventListener('click', handleLinkClick)
        }
      })
    }
    
    const handleLinkClick = () => {
      // Detectar el nuevo modo después del clic
      setTimeout(() => {
        detectViewChange()
      }, 200)
    }

    // Detectar cuando el componente Auth se ha renderizado
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        detectViewChange()
      })
    })

    // Observar cambios en todo el documento
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      characterData: true 
    })

    // Ejecutar detección inicial después de un breve delay
    setTimeout(detectViewChange, 500)

    // Cleanup
    return () => {
      observer.disconnect()
      subscription.unsubscribe()
    }
  }, [onViewChange])

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: 'rgb(87 83 78)', // stone-600
              brandAccent: 'rgb(68 64 60)', // stone-700
              brandButtonText: 'white',
              defaultButtonBackground: 'rgb(245 245 244)', // stone-100
              defaultButtonBackgroundHover: 'rgb(231 229 228)', // stone-200
              defaultButtonBorder: 'rgb(168 162 158)', // stone-400
              defaultButtonText: 'rgb(87 83 78)', // stone-600
              dividerBackground: 'rgb(214 211 209)', // stone-300
              inputBackground: 'rgb(250 250 249)', // stone-50
              inputBorder: 'rgb(214 211 209)', // stone-300
              inputBorderHover: 'rgb(168 162 158)', // stone-400
              inputBorderFocus: 'rgb(87 83 78)', // stone-600
              inputText: 'rgb(41 37 36)', // stone-800
              inputLabelText: 'rgb(68 64 60)', // stone-700
              inputPlaceholder: 'rgb(120 113 108)', // stone-500
              messageText: 'rgb(68 64 60)', // stone-700
              messageTextDanger: 'rgb(185 28 28)', // red-700
              anchorTextColor: 'rgb(87 83 78)', // stone-600
              anchorTextHoverColor: 'rgb(68 64 60)', // stone-700
            },
            space: {
              spaceSmall: '4px',
              spaceMedium: '8px',
              spaceLarge: '16px',
              labelBottomMargin: '8px',
              anchorBottomMargin: '4px',
              emailInputSpacing: '4px',
              socialAuthSpacing: '4px',
              buttonPadding: '10px 15px',
              inputPadding: '10px 15px',
            },
            fontSizes: {
              baseBodySize: '14px',
              baseInputSize: '14px',
              baseLabelSize: '14px',
              baseButtonSize: '14px',
            },
            fonts: {
              bodyFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
              buttonFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
              inputFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
              labelFontFamily: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
            },
            borderWidths: {
              buttonBorderWidth: '1px',
              inputBorderWidth: '1px',
            },
            radii: {
              borderRadiusButton: '6px',
              buttonBorderRadius: '6px',
              inputBorderRadius: '6px',
            },
          },
        },
        className: {
          anchor: 'text-stone-600 hover:text-stone-700 transition-colors duration-200',
          button: 'transition-all duration-200 hover:shadow-md',
          container: 'space-y-4',
          divider: 'my-4',
          input: 'transition-all duration-200 focus:ring-2 focus:ring-stone-600/20',
          label: 'font-medium text-stone-700',
          loader: 'text-stone-600',
          message: 'text-sm',
        },
      }}
      theme="light"
      showLinks={true}
      providers={['google', 'apple']}
      redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
      localization={{
        variables: {
          sign_in: {
            email_label: 'Correo Electrónico',
            password_label: 'Contraseña',
            button_label: 'Iniciar Sesión',
            loading_button_label: 'Iniciando sesión...',
            social_provider_text: 'Continuar con {{provider}}',
            link_text: '¿Ya tienes una cuenta? Inicia sesión',
          },
          sign_up: {
            email_label: 'Correo Electrónico',
            password_label: 'Contraseña',
            button_label: 'Crear Cuenta',
            loading_button_label: 'Creando cuenta...',
            social_provider_text: 'Continuar con {{provider}}',
            link_text: '¿Aún no tienes cuenta? Regístrate',
          },
          forgotten_password: {
            email_label: 'Correo Electrónico',
            button_label: 'Enviar enlace de recuperación',
            loading_button_label: 'Enviando enlace...',
            link_text: '¿Olvidaste tu contraseña?',
          },

        },
      }}
    />
  )
}