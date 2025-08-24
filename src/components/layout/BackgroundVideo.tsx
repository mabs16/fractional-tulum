'use client'

import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import Hls from 'hls.js'

const videoSources = {
  desktop: {
    light: 'https://vz-fd0addf5-731.b-cdn.net/06b7529e-a84c-42df-8f4a-9e5dd649499a/playlist.m3u8',
    dark: 'https://vz-fd0addf5-731.b-cdn.net/a0be1ccb-53a8-4a6e-942b-7e00a789d9fa/playlist.m3u8',
  },
  mobile: {
    light: 'https://vz-fd0addf5-731.b-cdn.net/418f14b3-3071-40e3-ad8c-b199b8a9ee53/playlist.m3u8',
    dark: 'https://vz-fd0addf5-731.b-cdn.net/3e2475ff-066c-472f-b57d-3a32ade62b98/playlist.m3u8',
  },
}

export function BackgroundVideo() {
  const { theme } = useTheme()
  const video1Ref = useRef<HTMLVideoElement>(null)
  const video2Ref = useRef<HTMLVideoElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentVideo, setCurrentVideo] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Seleccionar el video apropiado según el dispositivo y tema
  const videoSrc = isMobile 
    ? (theme === 'dark' ? videoSources.mobile.dark : videoSources.mobile.light)
    : (theme === 'dark' ? videoSources.desktop.dark : videoSources.desktop.light)

  // Función para cargar video con HLS
  const loadVideo = (video: HTMLVideoElement, src: string) => {
    if (Hls.isSupported()) {
      const hls = new Hls()
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play()
      })
      return hls
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Soporte nativo en Safari/iOS
      video.src = src
      video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    }
    return null
  }

  // Efecto para manejar transiciones suaves entre videos
  useEffect(() => {
    const video1 = video1Ref.current
    const video2 = video2Ref.current
    if (!video1 || !video2) return

    // Si es la primera carga, cargar el video inicial
    if (!isTransitioning && currentVideo === 1) {
      loadVideo(video1, videoSrc)
      return
    }

    // Iniciar transición
    setIsTransitioning(true)
    
    // Determinar qué video usar para la transición
    const nextVideo = currentVideo === 1 ? video2 : video1
    const currentVideoElement = currentVideo === 1 ? video1 : video2
    
    // Cargar el nuevo video en el elemento inactivo
    const hls = loadVideo(nextVideo, videoSrc)
    
    // Esperar a que el nuevo video esté listo y hacer la transición
    const handleCanPlay = () => {
      // Fade out del video actual y fade in del nuevo
      setTimeout(() => {
        setCurrentVideo(currentVideo === 1 ? 2 : 1)
        setIsTransitioning(false)
      }, 500) // Duración de la transición
    }
    
    nextVideo.addEventListener('canplay', handleCanPlay, { once: true })
    
    return () => {
      nextVideo.removeEventListener('canplay', handleCanPlay)
      if (hls) {
        hls.destroy()
      }
    }
  }, [videoSrc, theme, isMobile])

  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 overflow-hidden bg-white dark:bg-black">
      {/* Video 1 */}
      <video
        ref={video1Ref}
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          currentVideo === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={videoSrc} type="application/vnd.apple.mpegurl" />
      </video>
      
      {/* Video 2 */}
      <video
        ref={video2Ref}
        loop
        muted
        playsInline
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          currentVideo === 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <source src={videoSrc} type="application/vnd.apple.mpegurl" />
      </video>
      
      {/* Capa de overlay para oscurecer/aclarar y mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
    </div>
  )
}