import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Datos de las preguntas y respuestas. Fácil de actualizar en el futuro.
const faqData = [
  {
    category: "Sobre el Modelo de Propiedad",
    questions: [
      {
        question: "¿Esto es un tiempo compartido?",
        answer: "No. Es fundamental entender la diferencia. En un tiempo compartido compras el derecho de usar una propiedad. En Fractional Tulum, te conviertes en dueño legal de un porcentaje real del inmueble a través de una Sociedad de Copropiedad Dedicada. Tu fracción es un activo que gana plusvalía, puedes vender y heredar."
      },
      {
        question: "¿Qué respaldo legal tengo sobre mi propiedad?",
        answer: "Tu inversión está protegida a través de una 'Sociedad de Copropiedad Dedicada', una entidad legal cuyo único propósito es poseer y salvaguardar la Propiedad Alfa. Recibes cuotas sociales que te acreditan como dueño de un porcentaje de esta sociedad y, por ende, del inmueble."
      },
      {
        question: "¿Qué pasa si quiero vender mi fracción en el futuro?",
        answer: "Tienes total libertad para vender tu fracción cuando lo desees. El proceso es una cesión de tus cuotas sociales a un nuevo inversionista. Al no tener que modificar la escritura principal del inmueble, el proceso es más ágil y eficiente."
      }
    ]
  },
  {
    category: "Sobre la Propiedad y su Uso",
    questions: [
      {
        question: "¿Quién se encarga del mantenimiento y la administración?",
        answer: "Nosotros, el equipo de 'Hole in One', actuamos como los administradores de la propiedad, garantizando su mantenimiento impecable. Para la gestión de rentas, nos asociamos con un operador hotelero experto para maximizar la ocupación y los ingresos."
      },
      {
        question: "¿Cómo se asignan los días de uso?",
        answer: "A futuro, la plataforma tendrá un sistema de reservas avanzado. Cada fracción otorga un número de noches al año que puedes reservar según las reglas de nuestro Reglamento de Gestión de Activos, que busca un balance justo para todos los copropietarios."
      }
    ]
  },
  {
    category: "Sobre la Inversión",
    questions: [
      {
        question: "¿Hay costos adicionales además del precio de la fracción?",
        answer: "Sí, existe una cuota de administración anual que cubre todos los gastos operativos, de mantenimiento, seguros e impuestos de la propiedad. Nuestro modelo está diseñado para que la renta generada cuando no usas la propiedad cubra la mayor parte o la totalidad de esta cuota."
      }
    ]
  }
];

export default function FaqPage() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <section className="text-center max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold">
          Preguntas Frecuentes
        </h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-muted-foreground">
          Resolvemos tus dudas para que tomes la mejor decisión de inversión.
        </p>
      </section>

      <section className="mt-16 max-w-3xl mx-auto">
        {faqData.map((categoryItem) => (
          <div key={categoryItem.category} className="mb-12">
            <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900 dark:text-white">{categoryItem.category}</h2>
            <Accordion type="single" collapsible className="w-full">
              {categoryItem.questions.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-gray-700 dark:text-muted-foreground">
                    {item.answer}
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