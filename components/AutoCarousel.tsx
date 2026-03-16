"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Slide {
  src: string;
  alt?: string;
}

interface AutoCarouselProps {
  images: Slide[];
  interval?: number; // ms
  showArrows?: boolean;
  className?: string;
}

export default function AutoCarousel({
  images,
  interval = 4000,
  showArrows = true,
  className = "",
}: AutoCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [paused, images.length, interval]);

  function go(i: number) {
    setIndex((i + images.length) % images.length);
  }
  function next() {
    setIndex((i) => (i + 1) % images.length);
  }
  function prev() {
    setIndex((i) => (i - 1 + images.length) % images.length);
  }

  return (
    <div
      className={`carousel relative overflow-hidden rounded-xl ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="carousel-track flex transition-transform"
        style={{ width: `${images.length * 100}%`, transform: `translateX(-${index * (100 / images.length)}%)` }}
      >
        {images.map((img, i) => (
          <div key={i} className="carousel-slide relative flex-shrink-0" style={{ width: `${100 / images.length}%`, height: 380 }}>
            <Image src={img.src} alt={img.alt || `slide-${i}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="carousel-dots absolute left-1/2 transform -translate-x-1/2 bottom-4 flex gap-2 z-20">
        {images.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            className={`carousel-dot w-3 h-3 rounded-full transition-all ${i === index ? "dot-active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      {/* Arrows */}
      {showArrows && images.length > 1 && (
        <>
          <button aria-label="Previous slide" className="carousel-arrow left-3" onClick={prev}>
            ‹
          </button>
          <button aria-label="Next slide" className="carousel-arrow right-3" onClick={next}>
            ›
          </button>
        </>
      )}
    </div>
  );
}