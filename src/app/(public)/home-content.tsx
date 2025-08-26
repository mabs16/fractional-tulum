'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowDown } from 'lucide-react'
import { useIsMobile } from '@/hooks/useIsMobile'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const mainRef = useRef(null)
  const scrollContainerRef = useRef(null)
  const section2Ref = useRef<HTMLDivElement>(null)
  const section3Ref = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [snapEnabled, setSnapEnabled] = useState(true)
  const [currentSection, setCurrentSection] = useState(0)

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

    // Solo aplicar lógica especial para secciones 2 y 3 (índices 1 y 2)
    if (currentSectionIndex === 1 || currentSectionIndex === 2) {
      const sectionRef = currentSectionIndex === 1 ? section2Ref : section3Ref
      
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
        className={`h-full w-full z-10 overflow-y-scroll ${
          snapEnabled ? 'snap-y snap-mandatory' : ''
        }`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onScroll={handleContainerScroll}
      >
        {/* ================================================================== */}
        {/* SECCIÓN 1: El Lujo Inteligente (Hero) */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-center text-black dark:text-white p-4">
          <div className="content-wrapper">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-shadow-lg mb-8">Más Allá de la Propiedad. El Lujo de la Inteligencia.</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Una nueva forma de poseer un paraíso vacacional, diseñada para quienes
              valoran tanto su patrimonio como su tiempo.
            </p>
            <Button 
              size="lg" 
              className="px-16 py-6 text-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-8 hover:brightness-90"
              style={{
                background: 'linear-gradient(to right, #B89E63, #A08B56)'
              }}
              onClick={scrollToNextSection}
            >
              <span style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Explora la Oportunidad</span>
            </Button>
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
        {/* SECCIÓN 2: El Dilema del Activo de Lujo */}
        {/* ================================================================== */}
        <section 
          ref={section2Ref}
          className={`scroll-section h-screen w-full snap-start flex text-black dark:text-white p-4 pb-36 sm:pb-0 ${
            isMobile ? 'items-start justify-center pt-20 overflow-y-auto' : 'items-center justify-center'
          }`} 
          onScroll={() => handleSectionScroll(section2Ref)}
        >
          <div className="content-wrapper text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12 flex flex-wrap justify-center">Tener una Casa en el Paraíso<span className="md:w-full"> No debería ser un trabajo a tiempo completo.</span></h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-white/35 dark:bg-black/30 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-serif text-brand-gold mb-2">Capital Ineficiente</h3>
                  <p>Un activo de lujo que solo disfrutas unas pocas semanas al año, con la mayor parte de tu inversión parada.</p>
                </CardContent>
              </Card>
              <Card className="bg-white/35 dark:bg-black/30 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-serif text-brand-gold mb-2">Carga de Gestión</h3>
                  <p>Lidiar con mantenimiento, personal y la logística a distancia te roba la tranquilidad que fuiste a buscar.</p>
                </CardContent>
              </Card>
              <Card className="bg-white/35 dark:bg-black/30 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-serif text-brand-gold mb-2">Falta de Flexibilidad</h3>
                  <p>Tu patrimonio está atado a un solo lugar, limitando tus experiencias futuras.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 3: La Solución Fractional Tulum */}
        {/* ================================================================== */}
        <section 
          ref={section3Ref}
          className={`scroll-section h-screen w-full snap-start flex text-black dark:text-white p-4 pb-24 sm:pb-0 ${
            isMobile ? 'items-start justify-center pt-20 overflow-y-auto' : 'items-center justify-center'
          }`} 
          onScroll={() => handleSectionScroll(section3Ref)}
        >
            <div className="content-wrapper text-center max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">
                    Propiedad Real.<br/>
                    Cero Complicaciones.
                </h2>
                <div className="space-y-6 text-lg">
                    <div>
                        <p className="font-bold text-brand-gold mb-2">✅ Patrimonio Optimizado:</p>
                        <p>Posee un activo de lujo por una fracción de su costo. Es propiedad real, heredable y vendible, respaldada por nuestra &quot;Sociedad de Copropiedad Dedicada&quot;.</p>
                    </div>
                    <div>
                        <p className="font-bold text-brand-gold mb-2">✅ Tranquilidad Absoluta:</p>
                        <p>Somos los guardianes de tu inversión. Nuestro equipo de expertos se encarga de la gestión integral para que tú solo te dediques a disfrutar.</p>
                    </div>
                    <div>
                        <p className="font-bold text-brand-gold mb-2">✅ Activo Autosostenible:</p>
                        <p>Un modelo diseñado para que la renta cubra los gastos. La casa de tus sueños no te cuesta mientras no la usas.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 4: Un Destino de Clase Mundial */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
            <div className="content-wrapper text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">No Solo es la Casa, es el Destino: Tulum Country Club.</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg">Tu propiedad forma parte de una comunidad exclusiva con un campo de golf de clase mundial y acceso a las mejores amenidades de la Riviera Maya.</p>
                {/* --- ESPACIO PARA EL VIDEO DE TCC --- */}
                <div className="bg-white/35 dark:bg-black/30 backdrop-blur-sm  aspect-video w-full max-w-3xl mx-auto mt-8 flex items-center justify-center border border-white/20 rounded-lg">
                    <p>Video de Tulum Country Club Próximamente</p>
                </div>
                {/* <Button size="lg" variant="secondary" className="mt-8">
                    Explorar Nuestra Villa
                </Button> */}
            </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 5: La Visión a Futuro */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-black dark:text-white p-4">
            <div className="content-wrapper text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 drop-shadow-lg drop-shadow-black/50">Tu Llave a un Mundo de Destinos.</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg">Tu propiedad en Tulum es solo el comienzo. Es la llave de entrada a un futuro portafolio de residencias exclusivas en los destinos más deseados.</p>
                <Button 
                  size="lg" 
                  className="px-16 py-6 text-2xl font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mt-8 hover:brightness-90"
                  style={{
                    background: 'linear-gradient(to right, #B89E63, #A08B56)'
                  }}
                  onClick={() => window.location.href = '/propiedad-inteligente'}
                >
                  <span style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>La Propiedad Inteligente</span>
                </Button>
            </div>
        </section>
      </div>
    </div>
  )
}
