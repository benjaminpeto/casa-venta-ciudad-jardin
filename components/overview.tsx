"use client";

import { useEffect, useRef, useState } from "react";

export function Overview() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="overview"
      ref={sectionRef}
      className="py-20 md:py-32 px-4 bg-white"
    >
      <div className="container mx-auto max-w-4xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-black mb-8 text-center">
            Una visión de excelencia
          </h2>
          <div className="space-y-6 text-neutral-700 leading-relaxed text-lg">
            <p>
              Exclusiva vivienda unifamiliar ubicada en una de las zonas más
              prestigiosas y demandadas de Las Palmas de Gran Canaria: Ciudad
              Jardín. Con una superficie construida de 285 m² distribuidos en
              tres plantas, esta propiedad combina amplitud, confort y una
              ubicación inmejorable.
            </p>
            <p>
              En la planta principal, un elegante recibidor da paso a un amplio
              salón doble con grandes ventanales que aportan luz natural durante
              todo el día. La cocina, totalmente equipada, cuenta con zona de
              comedor, despensa y aseo de cortesía. En esta misma planta se
              encuentra un patio que rodea toda la casa, ideal para disfrutar
              del clima canario, además de un garaje privado con capacidad para
              un vehículo.
            </p>
            <p>
              La segunda planta dispone de una acogedora zona de estar,
              actualmente acondicionada como despacho y gimnasio. El dormitorio
              principal incluye un vestidor, un baño en suite con ducha y
              jacuzzi, ofreciendo un espacio íntimo y relajante. En esta planta
              se encuentran además un dormitorio individual, un dormitorio
              doble, un baño principal con doble lavabo y ducha, un armario
              empotrado adicional, y unas escaleras traseras que conectan
              directamente con la planta baja.
            </p>
            <p>
              La tercera planta ofrece dos amplios dormitorios dobles, un baño
              con ducha y dos zonas de estar adicionales, una de ellas
              actualmente utilizada como espacio musical y de relax. Desde aquí
              se accede a una gran terraza soleada, equipada con hamacas y una
              pérgola con zona de estar, perfecta para disfrutar de momentos al
              aire libre y de las suaves temperaturas durante todo el año.
            </p>
            <p>
              Situada en una calle privada con acceso exclusivo para residentes,
              esta propiedad ofrece tranquilidad y privacidad en pleno corazón
              de la ciudad. Su ubicación es verdaderamente privilegiada.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
