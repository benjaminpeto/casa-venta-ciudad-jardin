"use client"

import { useState, useEffect } from "react"
import { Hero } from "@/components/hero"
import { Overview } from "@/components/overview"
import { Gallery } from "@/components/gallery"
import { VideoTour } from "@/components/video-tour"
import { Features } from "@/components/features"
import { Location } from "@/components/location"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { SectionDivider } from "@/components/section-divider"

export default function LuxuryHousePage() {
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "overview", "features", "video", "gallery", "location", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="bg-white">
      <Navigation activeSection={activeSection} />
      <Hero />
      <Overview />
  <SectionDivider />
      <Features />
      <VideoTour />
      <Gallery />
      <Location />
      <Contact />
    </main>
  )
}
