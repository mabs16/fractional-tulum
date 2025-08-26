'use client'

import { Facebook, Instagram, Linkedin, Phone, Globe } from 'lucide-react'
import React, { useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Briefcase, Calendar, Rocket, ChevronDown, ArrowRight} from 'lucide-react';
import Link from 'next/link';
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsMobile } from '@/hooks/useIsMobile'

gsap.registerPlugin(ScrollTrigger)

export default function NuestroEquipoPage() {
  const mainRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()


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
              scroller: mainRef.current,
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

  const scrollToNextSection = useCallback(() => {
    if (mainRef.current) {
      const sections = Array.from(mainRef.current.children).filter(child =>
        child.classList.contains('scroll-section')
      );
      const currentScrollTop = mainRef.current.scrollTop;
      let nextSectionTop = -1;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        if (section.offsetTop > currentScrollTop) {
          nextSectionTop = section.offsetTop;
          break;
        }
      }

      if (nextSectionTop !== -1) {
        mainRef.current.scrollTo({
          top: nextSectionTop,
          behavior: 'smooth',
        });
      }
    }
  }, []);

  return (
    <div ref={mainRef} className="h-screen w-screen overflow-hidden h-full w-full z-10 overflow-y-scroll snap-y snap-mandatory">
      
      {/* ================================================================== */}
      {/* ================================================================== */}
      {/* SECCIÓN 1: Manifiesto del Equipo */}
      {/* ================================================================== */}
      <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4 relative">
          <div className="content-wrapper text-center px-4 w-full">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">
          Los Expertos Detrás de Tu Inversión
        </h1>
        <p className="mt-6 text-lg text-muted-foreground">
          Fractional Tulum nace de la unión de profesionales apasionados, cada uno líder en su campo. No somos una corporación sin rostro; somos el equipo que personalmente garantiza la solidez y la humanidad de tu patrimonio.
        </p>
        <div className="mt-16 bg-white/35 dark:bg-black/30 backdrop-blur-sm aspect-video w-full max-w-4xl mx-auto flex items-center justify-center border rounded-lg">
          <p className="text-muted-foreground">Foto o Video del Equipo Próximamente</p>
        </div>
          </div>
          <button 
              onClick={scrollToNextSection}
              className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-8 md:top-1/2 md:-translate-y-1/2 text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
      </section>

      

      {/* ================================================================== */}
      {/* ================================================================== */}
      {/* SECCIÓN 2: Luis Ángel Rosas */}
      {/* ================================================================== */}
      <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4 relative">
          <div className="content-wrapper text-center px-4 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className={`${isMobile ? 'aspect-[4/3.4]' : 'aspect-square'} bg-white/35 dark:bg-black/30 backdrop-blur-sm w-full flex items-center justify-center border rounded-lg`}>
                <p className="text-muted-foreground">Foto o Videode Luis Ángel</p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Luis Ángel Rosas</h2>
            <p className="text-brand-gold font-semibold mt-1">El Biker Inmobiliario - Visión Comercial</p>
            <p className="mt-4 text-muted-foreground">Con más de 3 años de experiencia en el sector y una comunidad de miles de seguidores, Luis es el motor comercial del proyecto, conectando nuestra visión con los inversionistas correctos.</p>
            <div className="mt-6 flex justify-center md:justify-start items-center gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Phone className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Globe className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
          </div>
          <button 
              onClick={scrollToNextSection}
              className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-8 md:top-1/2 md:-translate-y-1/2 text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
      </section>

      

      {/* ================================================================== */}
      {/* ================================================================== */}
      {/* SECCIÓN 3: Lalo Tager */}
      {/* ================================================================== */}
      <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4 relative">
          <div className="content-wrapper text-center px-4 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-1 md:order-2">
            <div className={`${isMobile ? 'aspect-[4/3.4]' : 'aspect-square'} bg-white/35 dark:bg-black/30 backdrop-blur-sm w-full flex items-center justify-center border rounded-lg`}>
                <p className="text-muted-foreground">Foto o Video de Lalo</p>
            </div>
          </div>
          <div className="order-2 md:order-1 text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Lalo Tager</h2>
            <p className="text-brand-gold font-semibold mt-1">Constructor - La Solidez del Proyecto</p>
            <p className="mt-4 text-muted-foreground">Lalo aporta décadas de experiencia en la construcción de proyectos residenciales. Su obsesión por la calidad de los materiales y la ejecución impecable es la garantía de que tu inversión está construida para durar.</p>
            <div className="mt-6 flex justify-center md:justify-start items-center gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Phone className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Globe className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
          </div>
          <button 
              onClick={scrollToNextSection}
              className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-8 md:top-1/2 md:-translate-y-1/2 text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
      </section>

      

      {/* ================================================================== */}
      {/* ================================================================== */}
      {/* SECCIÓN 4: Erick Tager */}
      {/* ================================================================== */}
      <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4 relative">
          <div className="content-wrapper text-center px-4 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className={`${isMobile ? 'aspect-[4/3.4]' : 'aspect-square'} bg-white/35 dark:bg-black/30 backdrop-blur-sm w-full flex items-center justify-center border rounded-lg`}>
                <p className="text-muted-foreground">Foto o Video de Erick</p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Erick Tager</h2>
            <p className="text-brand-gold font-semibold mt-1">Arquitecto - El Diseño del Paraíso</p>
            <p className="mt-4 text-muted-foreground">Erick es la mente creativa detrás de la arquitectura de la Propiedad Alfa. Su visión combina el lujo moderno con la esencia orgánica de Tulum, creando espacios que son tanto un hogar como una obra de arte.</p>
            <div className="mt-6 flex justify-center md:justify-start items-center gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Phone className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Globe className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
          </div>
          <button 
              onClick={scrollToNextSection}
              className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-8 md:top-1/2 md:-translate-y-1/2 text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
      </section>

      

      {/* ================================================================== */}
      {/* ================================================================== */}
      {/* SECCIÓN 5: Alejandro Nevarez */}
      {/* ================================================================== */}
      <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4 relative">
          <div className="content-wrapper text-center px-4 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="order-1 md:order-2">
            <div className={`${isMobile ? 'aspect-[4/3.4]' : 'aspect-square'} bg-white/35 dark:bg-black/30 backdrop-blur-sm w-full flex items-center justify-center border rounded-lg`}>
                <p className="text-muted-foreground">Foto o Videode Alejandro</p>
            </div>
          </div>
          <div className="order-2 md:order-1 text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Alejandro Nevarez</h2>
            <p className="text-brand-gold font-semibold mt-1">Visualización 3D - La Experiencia Inmersiva</p>
            <p className="mt-4 text-muted-foreground">Alejandro es nuestro experto en hacer tangible lo intangible. Él crea los recorridos virtuales que te permiten caminar por tu futura propiedad antes de que se coloque el primer ladrillo.</p>
            <div className="mt-6 flex justify-center md:justify-start items-center gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Phone className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Globe className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
          </div>
          <button 
              onClick={scrollToNextSection}
              className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-8 md:top-1/2 md:-translate-y-1/2 text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
      </section>

      

      {/* ================================================================== */}
      {/* ================================================================== */}
      {/* SECCIÓN 6: Mario Bustamante */}
      {/* ================================================================== */}
      <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4 relative">
          <div className="content-wrapper text-center px-4 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <div className={`${isMobile ? 'aspect-[4/3.4]' : 'aspect-square'} bg-white/35 dark:bg-black/30 backdrop-blur-sm w-full flex items-center justify-center border rounded-lg`}>
                <p className="text-muted-foreground">Foto o Video de Mario</p>
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">Mario Bustamante</h2>
            <p className="text-brand-gold font-semibold mt-1">Tecnología - La Plataforma de tu Inversión</p>
            <p className="mt-4 text-muted-foreground">Como desarrollador de la plataforma, Mario se encarga de que la experiencia del copropietario sea tan sólida y transparente como la inversión misma, creando las herramientas para tu tranquilidad.</p>
            <div className="mt-6 flex justify-center md:justify-start items-center gap-4">
                <Link href="#" className="text-muted-foreground hover:text-primary"><Facebook className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Instagram className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Phone className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Linkedin className="h-6 w-6" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary"><Globe className="h-6 w-6" /></Link>
            </div>
          </div>
        </div>
          </div>
          <button 
              onClick={scrollToNextSection}
              className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0 md:right-8 md:top-1/2 md:-translate-y-1/2 text-brand-gold hover:text-brand-gold/80 transition-colors"
            >
              <ChevronDown size={32} />
            </button>
      </section>

      {/* ================================================================== */}
      {/* ================================================================== */}
      {/* SECCIÓN CTA: Preguntas Frecuentes */}
      {/* ================================================================== */}
      <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4 relative">
        <div className="content-wrapper text-center px-4 w-full max-w-4xl">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 dark:text-white mb-6">
              ¿Tienes más preguntas?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Nuestro equipo está aquí para resolver todas tus dudas sobre la copropiedad fraccionada y ayudarte a tomar la mejor decisión de inversión.
            </p>
            <Link 
              href="/preguntas-frecuentes"
              className="inline-flex items-center gap-2 bg-brand-gold hover:bg-brand-gold/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Ver Preguntas Frecuentes
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}