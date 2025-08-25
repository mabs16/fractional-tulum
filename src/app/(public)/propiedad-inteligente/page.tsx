'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Shield, SlidersHorizontal, ArrowDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function PropiedadInteligentePage() {
  const mainRef = useRef(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Lógica de Animaciones ---
      const sections = gsap.utils.toArray('.scroll-section');
      sections.forEach((section: unknown, index) => {
        const sectionElement = section as Element;
        // Animación para el contenido de cada sección
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

  return (
    <div ref={mainRef} className="h-screen w-screen">
      {/* CAPA DE CONTENIDO DESLIZABLE */}
      <div
        ref={scrollContainerRef}
        className="h-full w-full z-10 overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* ================================================================== */}
        {/* SECCIÓN 1: El Manifiesto */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
          <div className="content-wrapper text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-8">
              Propiedad Real vs. Gasto Vacacional: La Diferencia Definitiva.
            </h1>
            <p className="mt-6 text-lg text-gray-700 dark:text-muted-foreground mb-12">
              En Fractional Tulum no compras un derecho de uso, adquieres un activo real. Un patrimonio tangible que se revaloriza, que puedes heredar y que puedes vender. No estás pagando por unas vacaciones, estás invirtiendo en tu futuro.
            </p>

            {/* Tabla Comparativa */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 border rounded-lg overflow-hidden">
                <div className="p-6 bg-white dark:bg-stone-800">
                  <h3 className="text-xl font-bold font-serif text-brand-gold mb-4">Fractional Tulum</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span><strong>Activo:</strong> Patrimonio Real y Tangible.</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span><strong>Legalidad:</strong> Título de Propiedad vía Sociedad Dedicada.</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span><strong>Valor a Futuro:</strong> Plusvalía y Potencial de Venta.</span></li>
                    <li className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-1" /><span><strong>Herencia:</strong> Sí, es un activo heredable.</span></li>
                  </ul>
                </div>
                <div className="p-6 bg-gray-50 dark:bg-gray-900">
                  <h3 className="text-xl font-bold font-serif text-gray-600 dark:text-muted-foreground mb-4">Tiempo Compartido Tradicional</h3>
                  <ul className="space-y-3 text-left">
                    <li className="flex items-start"><span className="text-red-500 mr-2 mt-1 font-bold">X</span><span><strong>Activo:</strong> Gasto de Uso Prepagado.</span></li>
                    <li className="flex items-start"><span className="text-red-500 mr-2 mt-1 font-bold">X</span><span><strong>Legalidad:</strong> Contrato de Uso limitado en tiempo.</span></li>
                    <li className="flex items-start"><span className="text-red-500 mr-2 mt-1 font-bold">X</span><span><strong>Valor a Futuro:</strong> Sin valor de reventa significativo.</span></li>
                    <li className="flex items-start"><span className="text-red-500 mr-2 mt-1 font-bold">X</span><span><strong>Herencia:</strong> Generalmente no es un activo heredable.</span></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-center">
               <div className="animate-bounce">
                 <Button variant="ghost" size="lg" onClick={scrollToNextSection}>
                     <ArrowDown className="h-16 w-16 animate-bounce" />
                 </Button>
               </div>
             </div>
           </div>
         </section>

        {/* ================================================================== */}
        {/* SECCIÓN 2: La Arquitectura de tu Tranquilidad */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
          <div className="content-wrapper text-center max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-gray-900 dark:text-white">La Estructura de tu Inversión: Sólida y Transparente</h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
                <Card className="bg-white/90 dark:bg-black/30 backdrop-blur-sm border-gray-200 dark:border-white/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Shield className="text-brand-gold"/>Sociedad de Copropiedad Dedicada</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 dark:text-muted-foreground">Tu inversión está protegida en una &quot;caja fuerte&quot; legal a la medida. Constituimos una sociedad con un único propósito: poseer y salvaguardar la Propiedad Alfa. No hace nada más. Es la máxima garantía de que tu activo está seguro.</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/90 dark:bg-black/30 backdrop-blur-sm border-gray-200 dark:border-white/20">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><SlidersHorizontal className="text-brand-gold"/>Operación Hotelera Inteligente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 dark:text-muted-foreground">Operamos como un hotel boutique de lujo, no como un conjunto de Airbnbs. Todos los ingresos y gastos se gestionan en un pool centralizado, lo que garantiza un mantenimiento impecable y tarifas optimizadas, sin que tú tengas que mover un dedo.</p>
                    </CardContent>
                </Card>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 3: El Video Explicativo */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
          <div className="content-wrapper text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-gray-900 dark:text-white">La Propiedad Inteligente, en 90 Segundos</h2>
            <div className="bg-gray-100 dark:bg-black/50 aspect-video w-full max-w-4xl mx-auto flex items-center justify-center border border-gray-300 dark:border-white/20 rounded-lg">
                <p className="text-gray-600 dark:text-muted-foreground">Video Explicativo Próximamente</p>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 4: La Decisión Brillante (Cierre) */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
          <div className="content-wrapper text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-gray-900 dark:text-white">Inteligencia Financiera. Disfrute Absoluto.</h2>
            <p className="mt-4 text-lg text-gray-700 dark:text-muted-foreground mb-8">La combinación perfecta de un activo patrimonial y una experiencia de lujo sin complicaciones.</p>
            <Button 
              size="lg" 
              className="px-16 py-6 text-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:brightness-90"
              style={{
                background: 'linear-gradient(to right, #B89E63, #A08B56)'
              }}
            >
                Explorar Nuestra Villa
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}