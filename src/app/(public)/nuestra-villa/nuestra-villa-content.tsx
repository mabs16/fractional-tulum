"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import dynamic from "next/dynamic";

const Dialog = dynamic(() => import("@/components/ui/dialog").then(mod => mod.Dialog), { ssr: false });
const DialogContent = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogContent), { ssr: false });
const DialogHeader = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogHeader), { ssr: false });
const DialogTitle = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTitle), { ssr: false });
const DialogTrigger = dynamic(() => import("@/components/ui/dialog").then(mod => mod.DialogTrigger), { ssr: false });

const Tabs = dynamic(() => import("@/components/ui/tabs").then(mod => mod.Tabs), { ssr: false });
const TabsContent = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsContent), { ssr: false });
const TabsList = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsList), { ssr: false });
const TabsTrigger = dynamic(() => import("@/components/ui/tabs").then(mod => mod.TabsTrigger), { ssr: false });
import Image from "next/image";
import Link from "next/link";
import { BedDouble, Film, Dumbbell, Sun, Utensils, Trees, ChevronDown, Laptop, Droplet, Waves } from 'lucide-react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NuestraVillaPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  const section4Ref = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [snapEnabled, setSnapEnabled] = useState(true);

  // Lista de amenidades extraída de los planos
  const amenities = [
    { name: 'Alberca Principal', icon: <Waves /> },
    { name: 'Roof Top con Alberca', icon: <Sun /> },
    { name: 'Gimnasio Equipado', icon: <Dumbbell /> },
    { name: 'Sala de Cine Privada', icon: <Film /> },
    { name: 'Área de Coworking', icon: <Laptop /> },
    { name: 'Café y Recepción', icon: <Utensils /> },
  ];

  const scrollToNextSection = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  // Funciones para detectar scroll interno
  const hasInternalScroll = (element: HTMLDivElement | null) => {
    if (!element) return false;
    return element.scrollHeight > element.clientHeight;
  };

  const isAtScrollEnd = (element: HTMLDivElement | null) => {
    if (!element) return true;
    return element.scrollTop + element.clientHeight >= element.scrollHeight - 5;
  };

  // Función para manejar el scroll de las secciones
  const handleSectionScroll = (sectionRef: React.RefObject<HTMLDivElement | null>) => {
    if (!isMobile || !sectionRef.current) return;
    
    const section = sectionRef.current;
    const hasScroll = hasInternalScroll(section);
    const atEnd = isAtScrollEnd(section);
    
    if (hasScroll && !atEnd) {
      // Hay scroll interno y no estamos al final, deshabilitar snap
      setSnapEnabled(false);
    } else {
      // No hay scroll interno o estamos al final, habilitar snap
      setSnapEnabled(true);
    }
  };

  useEffect(() => {
    const sections: HTMLElement[] = gsap.utils.toArray('.scroll-section') as HTMLElement[];
    
    sections.forEach((section: HTMLElement, index) => {
      const content = section.querySelector('.content-wrapper');
      
      gsap.fromTo(content, 
        {
          opacity: 0,
          y: 100,
          scale: 0.9
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse",
            scroller: scrollContainerRef.current
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="bg-transparent">
      <div 
        ref={scrollContainerRef}
        className={`h-screen overflow-y-scroll ${snapEnabled ? 'snap-y snap-mandatory' : ''}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* ================================================================== */}
        {/* SECCIÓN 1: HERO Y LANZADOR DEL RECORRIDO VIRTUAL */}
        {/* ================================================================== */}
        <section className="scroll-section snap-start relative h-screen flex items-center justify-center text-center text-white">
        {/* Placeholder para un render de alta calidad de la villa */}
        <div className="relative z-10 p-4 flex flex-col items-center justify-center">
               <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 dark:text-white">Nuestra Villa en el Corazón de Tulum</h1>
               <Dialog>
                 <DialogTrigger asChild>
                   <div className="relative cursor-pointer mt-4 mb-4 w-[300px] h-[200px] md:w-[400px] md:h-[250px] lg:w-[500px] lg:h-[300px] xl:w-[600px] xl:h-[350px] group">
                     {/* GIF que abre el recorrido virtual */}
                     <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105">
                       <p className="text-gray-700 dark:text-gray-300 text-center">GIF del Recorrido Virtual Aquí</p>
                     </div>

                     <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <p className="text-white text-lg font-bold">Iniciar Recorrido Virtual</p>
                     </div>
                   </div>
                 </DialogTrigger>
                 <DialogContent className="max-w-none w-[95vw] h-[90vh] p-0">
                   <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                     <p className="text-white">Recorrido Virtual Próximamente</p>
                   </div>
                 </DialogContent>
               </Dialog>
               <h2 className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-800 dark:text-muted-foreground">
                 Un activo de clase mundial diseñado para la máxima flexibilidad y lujo.
               </h2>
               <Dialog>
                 <DialogTrigger asChild>
                   <Button className="mt-8 px-10 py-4 text-xl font-semibold rounded-full bg-brand-gold text-white hover:bg-brand-gold/90 transition-colors duration-300 shadow-2xl shadow-brand-gold/50">
                     <span style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>Iniciar Recorrido Virtual 360°</span>
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="max-w-none w-[95vw] h-[90vh] p-0">
                   <div className="w-full h-full bg-stone-900 flex items-center justify-center">
                     <p className="text-white">Recorrido Virtual Próximamente</p>
                   </div>
                 </DialogContent>
               </Dialog>
               {/* Icono de flecha de continuar */}
               <div className="mt-8">
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                   strokeWidth={1.5}
                   stroke="currentColor"
                   className="w-10 h-10 text-brand-gold animate-bounce"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                   />
                 </svg>
               </div>

            
            {/* Botón de scroll hacia abajo */}
            <button 
              onClick={scrollToNextSection}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white hover:text-brand-gold transition-colors duration-300 animate-bounce"
              aria-label="Scroll to next section"
            >
              <ChevronDown size={32} />
            </button>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 2: CARACTERÍSTICAS PRINCIPALES */}
        {/* ================================================================== */}
        <section 
          ref={section2Ref}
          className={`scroll-section snap-start bg-transparent ${
            isMobile 
              ? 'h-auto min-h-screen pt-20 pb-8 overflow-y-auto flex items-start justify-center' 
              : 'h-screen flex items-center justify-center'
          }`}
          onScroll={() => handleSectionScroll(section2Ref)}
        >
          <div className="content-wrapper container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">Características Principales</h2>
              <p className="mt-4 text-lg text-gray-700 dark:text-muted-foreground">Descubre lo que hace única a nuestra villa</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                  <CardHeader><CardTitle>4 Suites de Lujo</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">Totalmente equipadas y autosuficientes para garantizar privacidad y confort.</p></CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle>Amenidades de Resort</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">Dos albercas, cine privado, gimnasio y más, todo dentro de tu propiedad.</p></CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle>Diseño y Arquitectura</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">Espacios amplios y acabados de lujo en cada rincón.</p></CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle>Ubicación Privilegiada</CardTitle></CardHeader>
                  <CardContent><p className="text-muted-foreground">Dentro de la comunidad exclusiva de Tulum Country Club.</p></CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 3: PLANOS Y DISTRIBUCIÓN (CON TABS) */}
        {/* ================================================================== */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center bg-transparent">
          <div className="content-wrapper container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-8">Planos y Distribución</h2>
            <Tabs defaultValue="fachadas" className="w-full max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="fachadas">Fachadas</TabsTrigger>
                <TabsTrigger value="planta-baja">Planta Baja</TabsTrigger>
                <TabsTrigger value="primer-nivel">Primer Nivel</TabsTrigger>
                <TabsTrigger value="roof-top">Roof Top</TabsTrigger>
              </TabsList>
              <TabsContent value="fachadas">
                <Card className="mt-4">
                  <CardContent className="p-6">
                    <Image src="https://tulumfractional.b-cdn.net/fachadas..jpg" alt="Fachadas" width={800} height={600} layout="responsive" className="rounded-lg" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="planta-baja">
                <Card className="mt-4">
                  <CardContent className="p-6">
                    <Image src="https://tulumfractional.b-cdn.net/Planta%20Baja..jpg" alt="Planta Baja" width={800} height={600} layout="responsive" className="rounded-lg" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="primer-nivel">
                <Card className="mt-4">
                  <CardContent className="p-6">
                    <Image src="https://tulumfractional.b-cdn.net/primer%20nivel..jpg" alt="Primer Nivel" width={800} height={600} layout="responsive" className="rounded-lg" />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="roof-top">
                <Card className="mt-4">
                  <CardContent className="p-6">
                    <Image src="https://tulumfractional.b-cdn.net/Roof%20Top..jpg" alt="Roof Top" width={800} height={600} layout="responsive" className="rounded-lg" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        
        {/* ================================================================== */}
        {/* SECCIÓN 4: AMENIDADES DETALLADAS */}
        {/* ================================================================== */}
        <section 
          ref={section4Ref}
          className={`scroll-section snap-start bg-transparent dark:bg-black ${
            isMobile 
              ? 'h-auto min-h-screen pt-20 pb-8 overflow-y-auto flex items-start justify-center' 
              : 'h-screen flex items-center justify-center'
          }`}
          onScroll={() => handleSectionScroll(section4Ref)}
        >
          <div className="content-wrapper container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">Un Estilo de Vida Inigualable</h2>
            <p className="mt-2 text-gray-700 dark:text-muted-foreground">Cada amenidad está diseñada para tu máximo confort y disfrute.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {amenities.map(amenity => (
                    <div key={amenity.name} className="flex flex-col items-center text-center p-4 rounded-lg shadow-md bg-white dark:bg-black transition-colors duration-300">
                        <div className="text-brand-gold mb-2">{React.cloneElement(amenity.icon, { size: 32 })}</div>
                        <p className="font-semibold text-gray-900 dark:text-white">{amenity.name}</p>
                    </div>
                ))}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 5: LLAMADA A LA ACCIÓN FINAL */}
        {/* ================================================================== */}
        <section className="scroll-section snap-start h-screen flex items-center justify-center bg-transparent">
          <div className="content-wrapper container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white">Visualiza Tu Futuro en Fractional Tulum</h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-muted-foreground mb-8">Ahora que conoces la propiedad, entiende por qué es la decisión de inversión más inteligente.</p>
            <Button asChild size="lg" className="mt-8 px-10 py-4 text-xl font-semibold rounded-full bg-brand-gold hover:bg-brand-gold/90 text-white font-bold shadow-2xl shadow-brand-gold/50">
                <Link href="/la-propuesta"><span style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)' }}>Ver la Propuesta de Inversión</span></Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}