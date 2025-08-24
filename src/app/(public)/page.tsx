'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function HomePage() {
  const mainRef = useRef(null)
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Lógica de Animaciones ---
      const sections = gsap.utils.toArray('.scroll-section');
      sections.forEach((section: any, index) => {
        // Animación para el contenido de cada sección
        gsap.fromTo(section.querySelector('.content-wrapper'),
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: section,
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
    <div ref={mainRef}>
      {/* CAPA DE CONTENIDO DESLIZABLE */}
      <div
        ref={scrollContainerRef}
        className="relative z-10 h-screen overflow-y-scroll snap-y snap-mandatory"
      >
        {/* ================================================================== */}
        {/* SECCIÓN 1: El Lujo Inteligente (Hero) */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-center text-white p-4">
          <div className="content-wrapper">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-shadow-lg">Más Allá de la Propiedad. El Lujo de la Inteligencia.</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-shadow">
              Una nueva forma de poseer un paraíso vacacional, diseñada para quienes valoran tanto su patrimonio como su tiempo.
            </p>
            <Button size="lg" className="mt-8 bg-brand-gold hover:bg-brand-gold/90 text-black font-bold">
              Explora la Oportunidad
            </Button>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <Button variant="ghost" size="icon" onClick={scrollToNextSection}>
                    <ArrowDown className="h-6 w-6 animate-bounce" />
                </Button>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 2: El Dilema del Activo de Lujo */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-white p-4">
          <div className="content-wrapper text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-12">Tener una Casa en el Paraíso No Debería Ser un Trabajo a Tiempo Completo.</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-black/30 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-serif text-brand-gold mb-2">Capital Ineficiente</h3>
                  <p>Un activo de lujo que solo disfrutas unas pocas semanas al año, con la mayor parte de tu inversión parada.</p>
                </CardContent>
              </Card>
              <Card className="bg-black/30 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-serif text-brand-gold mb-2">Carga de Gestión</h3>
                  <p>Lidiar con mantenimiento, personal y la logística a distancia te roba la tranquilidad que fuiste a buscar.</p>
                </CardContent>
              </Card>
              <Card className="bg-black/30 backdrop-blur-sm border-white/20">
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
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-white p-4">
            <div className="content-wrapper text-center max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Propiedad Real. Cero Complicaciones.</h2>
                <div className="space-y-6 text-lg">
                    <p>✅ <span className="font-bold text-brand-gold">Patrimonio Optimizado:</span> Posee un activo de lujo por una fracción de su costo. Es propiedad real, heredable y vendible, respaldada por nuestra "Sociedad de Copropiedad Dedicada".</p>
                    <p>✅ <span className="font-bold text-brand-gold">Tranquilidad Absoluta:</span> Somos los guardianes de tu inversión. Nuestro equipo de expertos se encarga de la gestión integral para que tú solo te dediques a disfrutar.</p>
                    <p>✅ <span className="font-bold text-brand-gold">Activo Autosostenible:</span> Un modelo diseñado para que la renta cubra los gastos. La casa de tus sueños no te cuesta mientras no la usas.</p>
                </div>
            </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 4: Un Destino de Clase Mundial */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-white p-4">
            <div className="content-wrapper text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">No Solo es la Casa, es el Destino: Tulum Country Club.</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg">Tu propiedad forma parte de una comunidad exclusiva con un campo de golf de clase mundial y acceso a las mejores amenidades de la Riviera Maya.</p>
                {/* --- ESPACIO PARA EL VIDEO DE TCC --- */}
                <div className="bg-black/50 aspect-video w-full max-w-3xl mx-auto mt-8 flex items-center justify-center border border-white/20 rounded-lg">
                    <p>Video de Tulum Country Club Próximamente</p>
                </div>
                <Button size="lg" variant="secondary" className="mt-8">
                    Explorar Nuestra Villa
                </Button>
            </div>
        </section>

        {/* ================================================================== */}
        {/* SECCIÓN 5: La Visión a Futuro */}
        {/* ================================================================== */}
        <section className="scroll-section h-screen w-full snap-start flex items-center justify-center text-white p-4">
            <div className="content-wrapper text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4">Tu Llave a un Mundo de Destinos.</h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg">Tu propiedad en Tulum es solo el comienzo. Es la llave de entrada a un futuro portafolio de residencias exclusivas en los destinos más deseados.</p>
            </div>
        </section>
      </div>
    </div>
  )
}
