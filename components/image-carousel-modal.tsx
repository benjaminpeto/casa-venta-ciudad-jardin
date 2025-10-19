"use client"

import { useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image";

interface ImageCarouselModalProps {
  images: { url: string; alt: string }[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function ImageCarouselModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
}: ImageCarouselModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrevious()
      if (e.key === "ArrowRight") onNext()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose, onNext, onPrevious])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="cursor-pointer absolute top-4 right-4 md:top-8 md:right-8 z-50 text-white hover:text-neutral-300 transition-colors p-2"
        aria-label="Close gallery"
      >
        <X className="w-8 h-8" />
      </button>

      {/* Previous button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrevious()
        }}
        className="cursor-pointer absolute left-4 md:left-8 z-50 text-white hover:text-neutral-300 transition-colors p-2 disabled:opacity-30"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8 md:w-12 md:h-12" />
      </button>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="cursor-pointer absolute right-4 md:right-8 z-50 text-white hover:text-neutral-300 transition-colors p-2 disabled:opacity-30"
        aria-label="Next image"
      >
        <ChevronRight className="w-8 h-8 md:w-12 md:h-12" />
      </button>

      {/* Image container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-16"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={images[currentIndex].url || "/placeholder.svg"}
          alt={images[currentIndex].alt}
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain animate-in fade-in zoom-in-95 duration-300"
          key={currentIndex}
        />

        {/* Image counter */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm md:text-base">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Image caption */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white text-lg md:text-xl font-medium">
          {images[currentIndex].alt}
        </div>
      </div>
    </div>
  )
}
