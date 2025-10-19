"use client"

import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

export function Location() {
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
    <section id="location" ref={sectionRef} className="py-20 md:py-32 px-4 bg-neutral-50">
      <div className="container mx-auto max-w-6xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-black mb-4 text-center">Ubicación Privilegiada</h2>
          <p className="text-neutral-600 text-center mb-12 md:mb-16">
Situada en una calle privada con acceso exclusivo para residentes, esta propiedad ofrece tranquilidad y privacidad en pleno corazón de la ciudad. Su ubicación es verdaderamente privilegiada:
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-black mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Dirección</h3>
                  <p className="text-neutral-600">
                    Las Palmas de Gran Canaria
                    <br />
                    Ciudad Jardín
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-6">
                <h3 className="font-bold text-lg mb-4">Nearby Amenities</h3>
                <div className="space-y-2 text-neutral-600">
                  <p>• A solo 10 minutos a pie de El Corte Inglés (zona Mesa y López)</p>
                  <p>• A 15 minutos caminando de la Playa de Las Canteras</p>
                  <p>• A 3 minutos de la Playa de Las Alcaravaneras</p>
                  <p>• Y a tan solo 1 minuto de supermercados, cafeterías y servicios locales</p>
                  <p>• Aeropuerto - 20 min con coche</p>
                </div>
              </div>
            </div>

            <div className="h-[400px] md:h-full min-h-[400px] bg-neutral-200 rounded-lg overflow-hidden">
              {/* Google Maps Embed - User needs to replace with actual location */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3417.403376686579!2d-15.431720130063123!3d28.127655012796037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sen!2ses!4v1760890468189!5m2!1sen!2ses"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Property Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
