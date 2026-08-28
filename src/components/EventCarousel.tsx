import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import type { CarouselSlide } from '../data/events';

interface EventCarouselProps {
  slides: CarouselSlide[];
  /** Autoplay interval in ms */
  intervalMs?: number;
}

/**
 * Auto-advancing event atmosphere carousel.
 * Pauses on hover/focus; reduced-motion shows a static crossfade-free frame.
 */
export default function EventCarousel({
  slides,
  intervalMs = 4500,
}: EventCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || paused || slides.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs, paused, reduceMotion, slides.length]);

  const current = slides[index];

  return (
    <section
      className="relative overflow-hidden bg-night"
      aria-roledescription="carousel"
      aria-label="Moments from Horizons events"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
    >
      <div className="relative aspect-[16/10] w-full md:aspect-[21/9] md:min-h-[56vh]">
        <AnimatePresence mode="wait">
          <motion.img
            key={current.src}
            src={current.src}
            alt={current.alt}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
            transition={{ duration: reduceMotion ? 0.2 : 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </AnimatePresence>
        <div
          className="absolute inset-0 bg-gradient-to-t from-night via-night/20 to-night/40"
          aria-hidden="true"
        />
        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-4 px-6 py-8 md:flex-row md:items-end md:justify-between md:px-12 md:py-10">
          <div>
            <p className="font-serif text-2xl text-cream md:text-4xl">The night unfolds</p>
            <p className="mt-2 max-w-md text-sm font-light text-cream/75 md:text-base">
              Sunsets, shared tables, live sets — a living album of Eagle Beach evenings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Carousel slides">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show image ${i + 1}: ${slide.alt}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow ${
                  i === index
                    ? 'w-10 bg-sunset-yellow'
                    : 'w-4 bg-cream/35 hover:bg-cream/60'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
