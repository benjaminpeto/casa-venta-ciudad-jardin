"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageCarouselModal } from "./image-carousel-modal";

// Generate images list 1..68 using the public `/images/` path. Files are expected in `public/images/`.
const images = Array.from({ length: 68 }, (_, i) => {
  const idx = i + 1;
  return {
    url: `/images/Vienda Ciudad Jardin${idx}.webp`,
    alt: `Property image ${idx}`,
  };
});

export function Gallery() {
  const [isVisible, setIsVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // If IntersectionObserver isn't available, show content immediately.
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, root: null, rootMargin: "0px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);

      // Immediate check in case the element is already visible on mount.
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        setIsVisible(true);
        observer.disconnect();
      }
    }

    return () => observer.disconnect();
  }, []);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <section
        id="gallery"
        ref={sectionRef}
        className="py-20 md:py-32 px-4 bg-neutral-50"
      >
        <div className="container mx-auto max-w-7xl">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
          >
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-black mb-4 text-center">
              Galería
            </h2>
            <p className="text-neutral-600 text-center mb-12 md:mb-16">
              Explora los impresionantes interiores y exteriores{" "}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => openModal(index)}
                  className={`group relative overflow-hidden bg-neutral-200 aspect-square transition-all duration-700 cursor-pointer`}
                  style={{
                    transitionDelay: `${(index % 9) * 100}ms`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? "translateY(0)" : "translateY(20px)",
                  }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    fill
                    sizes={"300"}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-medium">{image.alt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ImageCarouselModal
        images={images}
        currentIndex={currentImageIndex}
        isOpen={isModalOpen}
        onClose={closeModal}
        onNext={goToNext}
        onPrevious={goToPrevious}
      />
    </>
  );
}
