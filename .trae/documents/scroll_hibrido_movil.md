# Implementación de Scroll Híbrido en Móviles

Este documento detalla la implementación de una solución de scroll híbrido para secciones de página que contienen contenido extenso en dispositivos móviles. El objetivo es permitir el scroll interno dentro de la sección antes de pasar a la siguiente sección, manteniendo la experiencia de snap-scroll en desktop.

## Problema Original

En dispositivos móviles, las secciones con contenido que excede la altura de la pantalla se recortaban debido al `snap-scroll` global, impidiendo al usuario ver todo el contenido de la sección.

## Solución Propuesta

La solución consiste en:

1. **Detectar dispositivos móviles**: Utilizar un hook personalizado para identificar si el usuario está en un dispositivo móvil.
2. **Alinear contenido en móviles**: En las secciones afectadas (e.g., Sección 2 y Sección 3), alinear el contenido desde la parte superior de la pantalla (después del navbar) en móviles, en lugar de centrarlo verticalmente.
3. **Permitir scroll interno**: Habilitar el scroll vertical dentro de la sección cuando el contenido excede la altura de la pantalla.
4. **Controlar** **`snap-scroll`** **dinámicamente**: Deshabilitar temporalmente el `snap-scroll` global mientras el usuario está scrolleando dentro de una sección con overflow, y re-habilitarlo solo cuando se llega al final del contenido de esa sección, para permitir el paso a la siguiente.

## Pasos de Implementación

### 1. Crear un Hook `useIsMobile.ts`

Este hook detecta si el dispositivo es móvil basándose en el ancho de la ventana. Se encuentra en `src/hooks/useIsMobile.ts`.

```typescript:/src/hooks/useIsMobile.ts
import { useState, useEffect } from 'react';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Define tu breakpoint para móvil
    };

    if (typeof window !== 'undefined') {
      handleResize(); // Establecer el estado inicial
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return isMobile;
};

export default useIsMobile;
```

### 2. Modificar `page.tsx` para el Scroll Híbrido

En `src/app/(public)/page.tsx`, se importará el hook `useIsMobile` y se aplicarán clases CSS condicionalmente a las secciones afectadas (en este caso, la Sección 2 y la Sección 3).

La lógica principal implica:

* Usar `isMobile` para aplicar `pt-20` (para compensar el navbar) y `overflow-y-auto` en móviles.

* Mantener el centrado vertical (`items-center`) en desktop.

* Ajustar el `snap-scroll` para que solo se active entre secciones cuando el scroll interno de la sección actual ha llegado a su límite.

```typescript:/src/app/(public)/page.tsx
// ... otras importaciones
import useIsMobile from '@/hooks/useIsMobile';

export default function Home() {
  const isMobile = useIsMobile();

  // ... otras definiciones de secciones y animaciones

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <div className="h-full snap-y snap-mandatory overflow-y-scroll scroll-smooth">
        {/* Sección 1 */}
        <section
          id="section1"
          className="relative h-screen w-screen flex items-center justify-center snap-center bg-gray-100"
        >
          {/* Contenido de la Sección 1 */}
        </section>

        {/* Sección 2 */}
        <section
          id="section2"
          className={`relative h-screen w-screen flex justify-center snap-center bg-gray-200
            ${isMobile ? 'pt-20 overflow-y-auto items-start' : 'items-center'}`}
        >
          <div className="p-8 max-w-3xl text-center">
            <h2 className="text-4xl font-bold mb-4">Sección 2: Contenido Extenso</h2>
            <p className="text-lg mb-4">Este es un ejemplo de contenido que podría ser más largo y requerir scroll en dispositivos móviles. La idea es que el usuario pueda leer todo el texto sin que se recorte.</p>
            <p className="text-lg mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p className="text-lg">Más contenido para asegurar que haya suficiente texto para probar el scroll interno en móviles. Asegúrate de que esta sección tenga suficiente altura para que el `overflow-y-auto` sea efectivo.</p>
          </div>
        </section>

        {/* Sección 3 */}
        <section
          id="section3"
          className={`relative h-screen w-screen flex justify-center snap-center bg-gray-300
            ${isMobile ? 'pt-20 overflow-y-auto items-start' : 'items-center'}`}
        >
          <div className="p-8 max-w-3xl text-center">
            <h2 className="text-4xl font-bold mb-4">Sección 3: Otra Sección Larga</h2>
            <p className="text-lg mb-4">Similar a la sección anterior, esta sección también puede contener una gran cantidad de información que necesita ser scrolleada en pantallas pequeñas.</p>
            <p className="text-lg mb-4">Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.</p>
            <p className="text-lg">Continuación del contenido para verificar el comportamiento del scroll. Es crucial que el `snap-scroll` no impida el acceso a esta parte del texto.</p>
          </div>
        </section>

        {/* Sección 4 */}
        <section
          id="section4"
          className="relative h-screen w-screen flex items-center justify-center snap-center bg-gray-400"
        >
          {/* Contenido de la Sección 4 */}
        </section>
      </div>
    </main>
  );
}
```

### Consideraciones Adicionales

* **GSAP + ScrollTrigger**: La implementación de este scroll híbrido es compatible con animaciones GSAP y ScrollTrigger. Las animaciones se activarán cuando la sección entre en el viewport, y el scroll interno no debería interferir con su activación.

* **Breakpoint**: El breakpoint para `isMobile` (768px en el ejemplo) puede ajustarse según las necesidades del diseño.

* **`pt-20`**: El valor de `pt-20` (padding-top) debe ajustarse para que el contenido comience justo después de la barra de navegación en móviles. Si el navbar tiene una altura diferente, este valor deberá modificarse.

* **Control de** **`snap-scroll`**: La solución actual utiliza `overflow-y-auto` y `items-start` en móviles para permitir el scroll interno. El desafío de que el `snap-scroll` global interfiera con el scroll interno se aborda mediante la detección del final del scroll de la sección. Esto requiere una lógica más avanzada que monitoree el `scrollTop` y `scrollHeight` de la sección para deshabilitar/habilitar el `snap-scroll` del contenedor principal dinámicamente. Esto se puede lograr con `useEffect` y `useRef` para las secciones, y manipulando las clases de Tailwind CSS o las propiedades de estilo directamente.

