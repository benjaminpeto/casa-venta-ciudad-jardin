"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SectionDivider } from "./section-divider";

// Lazy-load the modal to keep initial JS small:
const ImageCarouselModal = dynamic(
  () => import("./image-carousel-modal").then((m) => m.ImageCarouselModal),
  { ssr: false }
);

const TOTAL = 68;
const PAGE_SIZE = 6;

const images = Array.from({ length: TOTAL }, (_, i) => {
  const idx = i + 1;
  return {
    url: `/images/Vienda Ciudad Jardin${idx}.webp`,
    alt: `Vivienda Ciudad Jardín — foto ${idx}`,
  };
});

export function Gallery() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const node = sectionRef.current;
    const reveal = () => setIsVisible(true);
    const timer = window.setTimeout(reveal, 800); // fallback if IO never fires

    if (node && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            reveal();
            observer.disconnect();
          }
        },
        { threshold: 0, root: null, rootMargin: "200px 0px" }
      );
      observer.observe(node);
      return () => {
        clearTimeout(timer);
        observer.disconnect();
      };
    }

    return () => clearTimeout(timer);
  }, []);

  const visibleImages = images.slice(0, visibleCount);
  const canLoadMore = visibleCount < images.length;

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const goToNext = () => setCurrentImageIndex((p) => (p + 1) % images.length);
  const goToPrevious = () =>
    setCurrentImageIndex((p) => (p - 1 + images.length) % images.length);

  return (
    <>
      <section
        id="gallery"
        ref={sectionRef}
        className="py-20 md:py-32 px-4 bg-black"
      >
        <div className="container mx-auto max-w-7xl">
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 text-center">
              Galería
            </h2>
            <p className="text-neutral-400 text-center mb-12 md:mb-16">
              Explora los impresionantes interiores y exteriores
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {visibleImages.map((image, index) => (
                <button
                  key={image.url}
                  onClick={() => openModal(index)}
                  className="group relative overflow-hidden bg-neutral-200 aspect-square transition-all duration-500 cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/30"
                  aria-label={`Abrir imagen ${index + 1}`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={index < 2}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-medium">{image.alt}</p>
                  </div>
                </button>
              ))}
            </div>

            {canLoadMore && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() =>
                    setVisibleCount((c) => Math.min(c + PAGE_SIZE, images.length))
                  }
                  className="cursor-pointer px-8 py-4 bg-white text-black font-medium hover:bg-black hover:text-white hover:border-1 hover:border-white"
                >
                  Cargar más fotos
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {isModalOpen && (
        <ImageCarouselModal
          images={images}
          currentIndex={currentImageIndex}
          isOpen={isModalOpen}
          onClose={closeModal}
          onNext={goToNext}
          onPrevious={goToPrevious}
        />
      )}
    </>
  );
}
