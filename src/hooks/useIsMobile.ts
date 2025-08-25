'use client'
import { useState, useEffect } from 'react'

export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint)
    }

    // Verificar al montar el componente
    checkIsMobile()

    // Agregar listener para cambios de tamaño
    window.addEventListener('resize', checkIsMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [breakpoint])

  return isMobile
}