import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Datos de las preguntas y respuestas. Fácil de actualizar en el futuro.
const faqData = [
  {
    category: "Sobre el Modelo de Propiedad Inteligente",
    questions: [
      {
        question: "¿Esto es un tiempo compartido?",
        answer: "No, en absoluto. Y esta es la diferencia fundamental. Un tiempo compartido te vende el derecho de usar un espacio. Fractional Tulum te convierte en propietario real de un activo inmobiliario. Tu fracción es un patrimonio tangible que gana plusvalía, que puedes vender cuando quieras y que puedes heredar. No es un gasto de vacaciones, es una inversión sólida."
      },
      {
        question: "¿Qué respaldo legal tengo sobre mi propiedad?",
        answer: "Tu inversión está protegida por la estructura más segura para este modelo: una 'Sociedad de Copropiedad Dedicada'. Piénsalo como una caja fuerte legal, diseñada con el único y exclusivo propósito de poseer y salvaguardar la Propiedad Alfa. Al invertir, recibes cuotas sociales notariadas que te acreditan como dueño de la entidad que posee el inmueble, dándote control y certeza total."
      },
      {
        question: "¿Qué pasa si quiero vender mi fracción en el futuro?",
        answer: "Tienes total libertad. El modelo está diseñado para una salida simple y eficiente. Al ceder tus cuotas sociales a un nuevo inversionista, la escritura principal de la propiedad no se modifica, lo que agiliza el proceso legal y reduce los costos. Tienes control total sobre tu patrimonio."
      },
      {
        question: "¿Por qué este modelo y no simplemente comprar un condo y ponerlo en Airbnb?",
        answer: "Por dos razones: tranquilidad y rendimiento optimizado. Gestionar un Airbnb es un trabajo a tiempo completo que te roba la paz que buscas. Además, nuestro modelo de operación hotelera centralizada evita la 'guerra de precios' entre vecinos, garantizando tarifas más altas, una ocupación más estable y, en definitiva, una mejor protección del valor de tu inversión a largo plazo."
      }
    ]
  },
  {
    category: "Sobre la Propiedad y la Experiencia",
    questions: [
      {
        question: "¿Quién se encarga del mantenimiento y la administración?",
        answer: "Nosotros, el equipo de 'Hole in One', actuamos como los administradores de la propiedad, garantizando su mantenimiento impecable. Para la gestión de rentas, nos asociamos con un operador hotelero experto para maximizar la ocupación y los ingresos."
      },
      {
        question: "¿Cómo se asignan los días de uso?",
        answer: "A futuro, la plataforma tendrá un sistema de reservas avanzado. Cada fracción otorga un número de noches al año que puedes reservar según las reglas de nuestro Reglamento de Gestión de Activos, que busca un balance justo para todos los copropietarios."
      },
      {
        question: "¿Qué hace única a la ubicación en Tulum Country Club?",
        answer: "No solo estás invirtiendo en una villa, estás accediendo a una de las comunidades más exclusivas y con mayor plusvalía de la Riviera Maya. Esto incluye seguridad 24/7, un campo de golf de clase mundial diseñado por Robert Trent Jones II y acceso a una infraestructura de primer nivel que garantiza el valor de tu propiedad a largo plazo."
      }
    ]
  },
  {
    category: "Sobre la Inversión y las Finanzas",
    questions: [
      {
        question: "¿Hay costos adicionales además del precio de la fracción?",
        answer: "Sí, existe una cuota de administración anual que cubre todos los gastos operativos, de mantenimiento, seguros e impuestos de la propiedad. Nuestro modelo está diseñado para que la renta generada cuando no usas la propiedad cubra la mayor parte o la totalidad de esta cuota."
      },
      {
        question: "¿Cómo funciona la transparencia financiera?",
        answer: "La transparencia es total. La 'Sociedad de Copropiedad Dedicada' está legalmente obligada a llevar una contabilidad impecable. A través de tu portal de copropietario, tendrás acceso 24/7 a todos los reportes de ingresos, gastos y ocupación, para que siempre sepas exactamente cómo está rindiendo tu inversión."
      },
      {
        question: "¿Qué es la 'visión de futuro' con la red de destinos?",
        answer: "Tu propiedad en Tulum es solo el comienzo. Nuestro plan a largo plazo es desarrollar una red de propiedades exclusivas en otros destinos de lujo. Ser uno de los primeros copropietarios te dará acceso preferencial a futuras oportunidades de intercambio y de inversión, convirtiendo tu fracción en una llave a un mundo de experiencias."
      }
    ]
  }
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-18 md:pt-20 lg:pt-22 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
      <section className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 md:mb-20">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
          Preguntas Frecuentes
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 dark:text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Resolvemos tus dudas para que tomes la mejor decisión de inversión.
        </p>
      </section>

      <section className="max-w-4xl mx-auto">
        {faqData.map((categoryItem, categoryIndex) => (
          <div 
            key={categoryItem.category} 
            className="mb-8 sm:mb-12 md:mb-16 last:mb-0 bg-white/35 dark:bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-4 sm:mb-6 md:mb-8 text-gray-900 dark:text-white text-center sm:text-left">
              {categoryItem.category}
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-2 sm:space-y-3">
              {categoryItem.questions.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`category-${categoryIndex}-item-${index}`}
                  className="border border-gray-200/70 dark:border-gray-700/70 rounded-xl overflow-hidden bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all duration-200"
                >
                  <AccordionTrigger className="text-left px-4 sm:px-6 py-4 sm:py-5 text-sm sm:text-base md:text-lg font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-200 [&[data-state=open]]:text-primary dark:[&[data-state=open]]:text-primary">
                    <span className="pr-2">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0 text-sm sm:text-base leading-relaxed text-gray-700 dark:text-gray-300 animate-in slide-in-from-top-2 duration-200">
                    <div className="pt-2 border-t border-gray-200/50 dark:border-gray-700/50">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </section>
    </div>
  );
}