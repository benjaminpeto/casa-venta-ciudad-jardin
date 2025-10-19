"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export function VideoTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

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

  const togglePlay = async () => {
    const vid = videoRef.current;
    if (!vid) return;

    try {
      console.debug("togglePlay: currentState:", {
        paused: vid.paused,
        ended: vid.ended,
        readyState: vid.readyState,
      });
      if (vid.paused || vid.ended) {
        const p = vid.play();
        // play() returns a promise which may reject — await and log any error
        await p;
        // onPlay handler will update state
      } else {
        vid.pause();
        // onPause handler will update state
      }
    } catch (err) {
      // Play can fail (autoplay policy, decoding issue, etc.) — log full error
      console.error("Video play failed:", err);
      // also, if the video element has a media error, log it
      console.error("MediaError:", videoRef.current?.error);
    }
  };

  const handlePlay = () => {
    // If the overlay button currently has focus, blur it before hiding the overlay
    try {
      buttonRef.current?.blur();
    } catch {
      /* ignore */
    }
    setIsPlaying(true);
  };

  const handleVideoError = (
    e: React.SyntheticEvent<HTMLVideoElement, Event>
  ) => {
    console.error("<video> element error event:", e, videoRef.current?.error);
    // keep overlay visible so user can try again
    setIsPlaying(false);
  };

  const handleCanPlay = () => {
    console.debug("video can play; readyState:", videoRef.current?.readyState);
  };

  const handleLoadedMetadata = () => {
    console.debug(
      "video loaded metadata; duration:",
      videoRef.current?.duration
    );
  };

  const handlePause = () => {
    setIsPlaying(false);
    // restore focus to the overlay button so keyboard users can easily resume
    try {
      buttonRef.current?.focus();
    } catch {
      /* ignore */
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    try {
      buttonRef.current?.focus();
    } catch {
      /* ignore */
    }
  };

  return (
    <section
      id="video"
      ref={sectionRef}
      className="py-20 md:py-32 px-4 bg-black"
    >
      <div className="container mx-auto max-w-6xl">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 text-center">
            Recorrido en vídeo
          </h2>
          <p className="text-neutral-400 text-center mb-12 md:mb-16">
            Realice un recorrido virtual por esta propiedad excepcional{" "}
          </p>

          <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden group">
            {/* Video element with ref and event handlers */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
              onPlay={handlePlay}
              onPause={handlePause}
              onEnded={handleEnded}
              onError={handleVideoError}
              onCanPlay={handleCanPlay}
              onLoadedMetadata={handleLoadedMetadata}
            >
              <source
                src="/video/vivienda-ciudad-jardin.webm"
                type='video/webm; codecs="vp9, opus"'
              />
              Your browser does not support the video tag.
            </video>

            {/* Play/Pause button overlay — clickable and accessible */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
              aria-hidden={isPlaying}
            >
              {/* semi-transparent backdrop */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />

              <button
                type="button"
                onClick={togglePlay}
                ref={buttonRef}
                className="relative z-10 w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
                aria-label={isPlaying ? "Pausar vídeo" : "Reproducir vídeo"}
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-black" />
                ) : (
                  <Play className="h-8 w-8 text-black ml-1" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
