"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToOverview = () => {
    const element = document.getElementById("overview");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax Effect */}
      {(() => {
        /* encodeURI handles spaces and other characters so CSS url(...) is valid */
        const bg = encodeURI(
          "/images/Vienda Ciudad Jardin9.webp?height=1080&width=1920"
        );
        return (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
            style={{
              backgroundImage: `url("${bg}")`,
              transform: isVisible ? "scale(1)" : "scale(1.1)",
            }}
          >
            {/* Subtle white radiant at the top for improved menu contrast */}
            <div className="absolute inset-x-0 top-0 h-100 pointer-events-none bg-gradient-to-b from-white via-20% to-transparent" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        );
      })()}

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight">
            Casa en venta en Ciudad Jardín
            <br />
            Las Palmas de Gran Canaria
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 font-light">
            La ciudad como vecina, la calma como hogar..
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="cursor-pointer px-8 py-4 bg-white text-black font-medium hover:bg-neutral-100 transition-colors"
            >
              Agendar una visita
            </button>
            <button
              onClick={scrollToOverview}
              className="cursor-pointer px-8 py-4 bg-transparent border-2 border-white text-white font-medium hover:bg-white hover:text-black transition-colors"
            >
              Explorar propiedad
            </button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToOverview}
          className={`cursor-pointer absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <ChevronDown className="h-8 w-8 text-white animate-bounce" />
        </button>
      </div>
    </section>
  );
}
