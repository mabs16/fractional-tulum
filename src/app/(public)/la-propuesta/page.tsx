'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Briefcase, Calendar, Rocket, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function LaPropuestaPage() {
  const mainRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
        className="h-full w-full z-10 overflow-y-scroll snap-y snap-mandatory"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
      
        {/* ================================================================== */}
        {/* SECCIÓN 1: La Propuesta de Valor Real */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
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
                  <Card key={prop.title}>
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
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
          <div className="content-wrapper text-center px-4 w-full">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-gray-900 dark:text-white">Nuestro Plan de Ejecución</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                Creemos en la transparencia total. Este es nuestro cronograma, alineado con nuestro SOW.
              </p>
              <div className="mt-12 space-y-8 relative">
                {/* Línea vertical de la línea de tiempo */}
                <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-border hidden md:block"></div>
                
                {timelineSteps.map((step, index) => (
                  <div key={index} className="flex flex-col md:flex-row items-center justify-center gap-8">
                    <div className="md:w-5/12 text-right">
                      <h3 className="font-bold text-lg text-brand-gold drop-shadow-md">{step.date}</h3>
                    </div>
                    <div className="relative bg-brand-gold h-4 w-4 rounded-full hidden md:block"></div>
                    <div className="md:w-5/12 text-left">
                      <p className="font-semibold text-lg">{step.event}</p>
                    </div>
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
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
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
        {/* SECCIÓN 4: Llamada a la Acción Final */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
          <div className="content-wrapper text-center px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif font-bold">Estás a un Paso de la Propiedad Inteligente</h2>
              <Button asChild size="lg" className="mt-8 bg-brand-gold hover:bg-brand-gold/90 text-white font-bold">
                  <Link href="/nuestro-equipo">Conoce al Equipo Detrás del Proyecto</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}