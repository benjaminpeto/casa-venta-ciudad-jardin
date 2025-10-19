"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle2 } from "lucide-react"

export function Contact() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to send message")
      }

      setIsSuccess(true)
      ;(e.target as HTMLFormElement).reset()

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (err) {
      setError("Failed to send message. Please try again.")
      console.error("Contact form submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="py-20 md:py-32 px-4 bg-black">
      <div className="container mx-auto max-w-2xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 text-center">Agendar una visita</h2>
          <p className="text-neutral-400 text-center mb-12 md:mb-16">
            Contáctenos para organizar un recorrido privado por esta propiedad excepcional.
          </p>

          {isSuccess && (
            <div className="mb-8 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-400">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p>¡Gracias por su interés! Nos pondremos en contacto con usted en breve.</p>
            </div>
          )}

          {error && (
            <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white"
                placeholder="Tu nombre completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Correo electrónico <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white"
                placeholder="tu.email@ejemplo.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white"
                placeholder="+34 000 000 000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">
                Mensaje <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={6}
                className="bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white resize-none"
                placeholder="Cuéntenos sobre su interés en esta propiedad..."
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-white text-black hover:bg-neutral-100 h-12 text-base font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                "Enviar consulta"
              )}
            </Button>
          </form>

          <div className="mt-12 pt-12 border-t border-white/10 text-center text-neutral-400 text-sm">
            <p>© 2025 Luxury Estate. All rights reserved.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
