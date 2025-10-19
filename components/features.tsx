"use client"

import { useEffect, useRef, useState } from "react"
import { Bed, Bath, Car, Maximize, Home, Sun, Sofa } from "lucide-react"

const features = [
  { icon: Bed, label: "Dormitorios", value: "5" },
  { icon: Bath, label: "Baños", value: "4" },
  { icon: Car, label: "Garaje", value: "1 coche" },
  { icon: Sun, label: "Terraza", value: "Azotea" },
  { icon: Sofa, label: "Salones", value: "4" },
  { icon: Home, label: "Superficie vivienda", value: "285 m²" },
  { icon: Maximize, label: "Superficie parcela", value: "231 m²" },
]

export function Features() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" ref={sectionRef} className="py-20 md:py-32 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-black mb-4 text-center">Características de la propiedad</h2>
          <p className="text-neutral-600 text-center mb-12 md:mb-16">
            Especificaciones excepcionales para compradores exigentes
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center text-center p-6 bg-neutral-50 hover:bg-neutral-100 transition-all duration-500 group`}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
                  }}
                >
                  <div className="mb-4 p-4 bg-white rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-black" />
                  </div>
                  <p className="text-sm text-neutral-600 mb-1">{feature.label}</p>
                  <p className="text-xl font-bold text-black">{feature.value}</p>
                </div>
              )
            })}
          </div>

          {/* Price */}
          <div className="text-center p-8 md:p-12 bg-black text-white">
            <p className="text-sm uppercase tracking-wider mb-2 text-neutral-400">Precio</p>
            <p className="font-serif text-5xl md:text-7xl font-bold">1.650.000€</p>
          </div>
        </div>
      </div>
    </section>
  )
}
