'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Briefcase, Calendar, Rocket, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsMobile } from '@/hooks/useIsMobile'

gsap.registerPlugin(ScrollTrigger)

export default function LaPropuestaPage() {
  const mainRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const section1Ref = useRef<HTMLDivElement>(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [currentSection, setCurrentSection] = useState(0)
  const isMobile = useIsMobile()

  // Función para detectar si una sección tiene scroll interno disponible
  const hasInternalScroll = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    if (!sectionRef.current) return false
    const element = sectionRef.current
    return element.scrollHeight > element.clientHeight
  }

  // Función para detectar si se llegó al final del scroll interno
  const isAtScrollEnd = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    if (!sectionRef.current) return true
    const element = sectionRef.current
    return element.scrollTop + element.clientHeight >= element.scrollHeight - 10 // 10px de tolerancia
  }

  // Función para manejar el scroll del contenedor principal
  const handleContainerScroll = () => {
    if (!isMobile) return
    
    const container = scrollContainerRef.current as HTMLDivElement | null
    if (!container) return

    const scrollTop = container.scrollTop
    const sectionHeight = window.innerHeight
    const currentSectionIndex = Math.round(scrollTop / sectionHeight)
    
    setCurrentSection(currentSectionIndex)

    // Solo aplicar lógica especial para secciones 1, 2 y 3 (índices 0, 1 y 2)
    if (currentSectionIndex === 0 || currentSectionIndex === 1 || currentSectionIndex === 2) {
      const sectionRef = currentSectionIndex === 0 ? section1Ref : currentSectionIndex === 1 ? section2Ref : section3Ref
      
      if (hasInternalScroll(sectionRef)) {
        // Si la sección tiene scroll interno y no estamos al final, deshabilitar snap
        if (!isAtScrollEnd(sectionRef)) {
          setSnapEnabled(false)
        } else {
          setSnapEnabled(true)
        }
      } else {
        setSnapEnabled(true)
      }
    } else {
      setSnapEnabled(true)
    }
  }

  // Función para manejar el scroll interno de las secciones
  const handleSectionScroll = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    if (!isMobile) return
    
    if (isAtScrollEnd(sectionRef)) {
      setSnapEnabled(true)
    } else {
      setSnapEnabled(false)
    }
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray('.scroll-section');
      sections.forEach((section: unknown, index) => {
        const sectionElement = section as Element;
        gsap.fromTo(sectionElement.querySelector('.content-wrapper'),
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: sectionElement,
              scroller: scrollContainerRef.current,
              start: 'top 60%',
              end: 'bottom 40%',
              toggleActions: 'play reverse play reverse',
            }
          }
        );
      });
    }, mainRef);

    return () => ctx.revert();
  }, [])

  const scrollToNextSection = () => {
    const container = scrollContainerRef.current as HTMLDivElement | null;
    if (container) {
      container.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  }

  const valueProps = [
    {
      title: "Patrimonio Real y Disfrute Exclusivo",
      description: "Adquieres un activo tangible que se revaloriza, puedes heredar y disfrutar con los tuyos.",
      icon: <Briefcase className="h-8 w-8 text-brand-gold" />
    },
    {
      title: "Activo Inteligente y Autosostenible",
      description: "El modelo está diseñado para que la renta de la propiedad cubra los gastos de mantenimiento. Tu propiedad se cuida sola.",
      icon: <CheckCircle className="h-8 w-8 text-brand-gold" />
    },
    {
      title: "Transparencia Total",
      description: "A través de un portal para copropietarios, tendrás acceso 24/7 a todos los documentos, reportes y calendarios.",
      icon: <Briefcase className="h-8 w-8 text-brand-gold" />
    },
    {
      title: "Un Portafolio de Destinos",
      description: "Tu propiedad es la llave de entrada a una futura red de residencias de lujo.",
      icon: <Rocket className="h-8 w-8 text-brand-gold" />
    }
  ];

  const timelineSteps = [
    { date: "30 de septiembre de 2025", event: "Fase 1: Estructura Legal y de Negocio definida." },
    { date: "15 de octubre de 2025", event: "Fase 2: Firma de contrato del primer lote." },
    { date: "15 de diciembre de 2025", event: "Fase 3: Venta Finalizada de Fracciones del primer inmueble." },
    { date: "15 de agosto de 2026", event: "Fase 4: Finalización de la construcción." },
    { date: "31 de agosto de 2026", event: "Fase 5: Entrega y puesta de Operación." }
  ];



  return (
    <div ref={mainRef} className="h-screen w-screen">
      <div 
        ref={scrollContainerRef}
        className={`h-full w-full z-10 overflow-y-scroll ${snapEnabled ? 'snap-y snap-mandatory' : ''}`}
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
        onScroll={handleContainerScroll}
      >
      
        {/* ================================================================== */}
        {/* SECCIÓN 1: La Propuesta de Valor Real */}
        {/* ================================================================== */}
        <section 
          ref={section1Ref}
          className={`scroll-section h-screen w-full snap-start flex ${isMobile ? 'items-start justify-center pt-20 pb-36 overflow-y-auto' : 'items-center justify-center'} text-black dark:text-white p-4`}
          onScroll={() => handleSectionScroll(section1Ref)}
        >
          <div className="content-wrapper text-center px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-serif font-bold">
                Una Inversión, Cuatro Pilares de Valor
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                No solo compras una propiedad, compras inteligencia financiera, tranquilidad y acceso a un portafolio exclusivo.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-12 text-left">
                {valueProps.map((prop) => (
                  <Card key={prop.title} className="bg-white/35 dark:bg-black/30 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center gap-4">
                      {prop.icon}
                      <CardTitle>{prop.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{prop.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <button 
              onClick={scrollToNextSection}
              className="scroll-indicator mt-12 mx-auto block text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 2: Nuestro Plan de Ejecución */}
        {/* ================================================================== */}
        <section 
          ref={section2Ref}
          className={`scroll-section h-screen w-full snap-start flex ${isMobile ? 'items-start justify-center pt-20 pb-36 overflow-y-auto' : 'items-center justify-center'} text-black dark:text-white p-4`}
          onScroll={() => handleSectionScroll(section2Ref)}
        >
          <div className="content-wrapper text-center px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-900 dark:text-white">Nuestro Plan de Ejecución</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Creemos en la transparencia total. Este es nuestro cronograma.
              </p>
              <div className="mt-12 space-y-8 relative">
                {/* Línea vertical de la línea de tiempo - Desktop */}
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-1 bg-brand-gold/40 dark:bg-border hidden md:block"></div>
                
                {/* Línea vertical de la línea de tiempo - Mobile */}
                <div className="absolute left-6 top-0 h-full w-1 bg-brand-gold/50 md:hidden"></div>
                
                {timelineSteps.map((step, index) => (
                  <div key={index}>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-8">
                      {/* Layout para móvil */}
                      <div className="flex md:hidden w-full">
                        <div className="relative flex-shrink-0 mr-6">
                          <div className="bg-brand-gold h-4 w-4 rounded-full relative z-10 shadow-lg dark:shadow-none"></div>
                        </div>
                        <div className="flex-1 pb-4 bg-white/35 dark:bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                          <h3 className="font-bold text-base text-brand-gold mb-2">{step.date}</h3>
                          <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{step.event}</p>
                        </div>
                      </div>
                      
                      {/* Layout para desktop */}
                      <div className="hidden md:flex md:w-5/12 text-right">
                        <div className="bg-white/35 dark:bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg w-full">
                          <h3 className="font-bold text-lg text-brand-gold drop-shadow-md">{step.date}</h3>
                        </div>
                      </div>
                      <div className="relative bg-brand-gold h-4 w-4 rounded-full hidden md:block z-10 shadow-lg dark:shadow-none"></div>
                      <div className="hidden md:flex md:w-5/12 text-left">
                        <div className="bg-white/35 dark:bg-black/30 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg w-full">
                          <p className="font-semibold text-lg">{step.event}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Flecha direccional para móvil - solo entre pasos, no después del último */}
                    {index < timelineSteps.length - 1 && (
                      <div className="flex md:hidden justify-start ml-6 mb-4">
                        <ChevronDown className="h-8 w-8 text-brand-gold animate-pulse drop-shadow-lg dark:drop-shadow-none" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <button 
              onClick={scrollToNextSection}
              className="scroll-indicator mt-12 mx-auto block text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 3: Tu Centro de Control Propietario */}
        {/* ================================================================== */}
        <section 
          ref={section3Ref}
          className={`scroll-section h-screen w-full snap-start flex ${isMobile ? 'items-start justify-center pt-20 overflow-y-auto' : 'items-center justify-center'} text-black dark:text-white p-4`}
          onScroll={() => handleSectionScroll(section3Ref)}
        >
          <div className="content-wrapper text-center px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-gray-900 dark:text-white">Gestión Total. Tranquilidad Absoluta.</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Tu inversión está respaldada por una plataforma tecnológica de primer nivel que te da control y transparencia 24/7.
              </p>
              <Card className="text-left overflow-hidden">
                  <div className="grid md:grid-cols-2">
                      <div className="p-8">
                          <h3 className="text-2xl font-bold font-serif mb-4 text-gray-900 dark:text-white">Tu Portal de Propietario</h3>
                          <ul className="space-y-3">
                              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" /><span>Accede a tu Bóveda con todos los documentos y contratos.</span></li>
                              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" /><span>A futuro, reserva tus estancias y gestiona tus activos.</span></li>
                              <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" /><span>Recibe comunicados y notificaciones importantes del equipo.</span></li>
                          </ul>
                      </div>
                      <div className="bg-stone-100 dark:bg-stone-800 flex items-center justify-center p-8">
                          {/* Placeholder para un GIF o imagen del dashboard */}
                          <p className="text-muted-foreground">Mockup del Dashboard Próximamente</p>
                      </div>
                  </div>
              </Card>
            </div>
            <button 
              onClick={scrollToNextSection}
              className="scroll-indicator mt-12 mx-auto block text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 5: LLAMADA A LA ACCIÓN FINAL */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
          <div className="content-wrapper text-center px-4 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Conoce al Equipo Detrás del Proyecto</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Un equipo de expertos en desarrollo inmobiliario, finanzas y hospitalidad, comprometidos con tu éxito.
            </p>
            <Button asChild size="lg" className="mt-8 px-10 py-4 text-xl font-semibold rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white font-bold shadow-2xl shadow-brand-gold/50">
              <Link href="/nuestro-equipo"><span style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>Conoce al Equipo Detrás del Proyecto</span></Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}