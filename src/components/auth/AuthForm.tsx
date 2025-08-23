'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect } from 'react'

interface AuthFormProps {
  onViewChange?: (view: 'sign_in' | 'sign_up') => void
}

export default function AuthForm({ onViewChange }: AuthFormProps) {
  const supabase = createClientComponentClient()

  useEffect(() => {
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