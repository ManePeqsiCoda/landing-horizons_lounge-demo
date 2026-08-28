import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CarouselSlide } from '../data/events';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Viewport-heights of scroll required between consecutive slides */
const SCROLL_VH_PER_SLIDE = 3.25;
/** Max Ken-Burns scale as a segment completes */
const IMAGE_SCALE_MAX = 1.22;

interface EventCarouselProps {
  slides: CarouselSlide[];
}

/**
 * Full-viewport pinned gallery with long scroll segments, progress ticks,
 * and a slow image grow toward the next slide. No snap — progress is continuous.
 */
export default function EventCarousel({ slides }: EventCarouselProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const fillRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const last = Math.max(0, slides.length - 1);
  const current = slides[index] ?? slides[0];

  const paintFrame = useCallback(
    (activeIndex: number, segment: number) => {
      fillRefs.current.forEach((el, i) => {
        if (!el) return;
        let amount = 0;
        if (i < activeIndex) amount = 1;
        else if (i === activeIndex) amount = segment;
        el.style.width = `${amount * 100}%`;
      });

      imgRefs.current.forEach((img, i) => {
        if (!img) return;
        const active = i === activeIndex;
        img.style.opacity = active ? '1' : '0';
        img.style.zIndex = active ? '1' : '0';
        if (reduceMotion) {
          img.style.transform = 'scale(1)';
          return;
        }
        const scale = active ? 1 + segment * (IMAGE_SCALE_MAX - 1) : 1.06;
        img.style.transform = `scale(${scale})`;
      });
    },
    [reduceMotion],
  );

  useGSAP(
    () => {
      const root = rootRef.current;
      const pin = pinRef.current;
      if (!root || !pin || slides.length < 1) {
        stRef.current = null;
        return;
      }

      paintFrame(0, 0);
      root.setAttribute('data-carousel-active', 'false');

      if (reduceMotion || slides.length < 2) {
        paintFrame(0, 1);
        stRef.current = null;
        return;
      }

      const st = ScrollTrigger.create({
        id: 'event-carousel',
        trigger: root,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * SCROLL_VH_PER_SLIDE * last)}`,
        pin,
        scrub: 1.1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          root.setAttribute('data-carousel-active', self.isActive ? 'true' : 'false');
          document.documentElement.classList.toggle('carousel-pinned', self.isActive);
        },
        onUpdate: (self) => {
          const raw = self.progress * last;
          const nextIndex = Math.min(last, Math.floor(raw + 1e-9));
          const segment =
            nextIndex >= last ? 1 : Math.min(1, Math.max(0, raw - nextIndex));

          paintFrame(nextIndex, segment);
          setIndex((prev) => (prev === nextIndex ? prev : nextIndex));
        },
      });

      stRef.current = st;

      return () => {
        root.setAttribute('data-carousel-active', 'false');
        document.documentElement.classList.remove('carousel-pinned');
        stRef.current = null;
      };
    },
    {
      scope: rootRef,
      dependencies: [last, reduceMotion, slides.length, paintFrame],
      revertOnUpdate: true,
    },
  );

  const goTo = useCallback(
    (target: number) => {
      const next = Math.max(0, Math.min(last, target));
      if (reduceMotion || !stRef.current) {
        setIndex(next);
        paintFrame(next, next >= last ? 1 : 0);
        return;
      }
      const st = stRef.current;
      const progress = last === 0 ? 0 : next / last;
      const y = st.start + (st.end - st.start) * progress;
      window.scrollTo({ top: y, behavior: 'smooth' });
    },
    [last, reduceMotion, paintFrame],
  );

  if (!current) return null;

  return (
    <section
      id="event-carousel"
      ref={rootRef}
      className="relative bg-night"
      aria-roledescription="carousel"
      aria-label="Moments from Horizons events"
      data-carousel-active="false"
    >
      <div ref={pinRef} className="relative h-dvh w-full overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, i) => (
            <img
              key={slide.src}
              ref={(el) => {
                imgRefs.current[i] = el;
              }}
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: 'scale(1)',
                willChange: 'transform, opacity',
              }}
              decoding="async"
              fetchPriority={i === 0 ? 'high' : 'auto'}
              draggable={false}
            />
          ))}
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-night via-night/25 to-night/45"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index <= 0}
          aria-label="Previous image"
          className="absolute top-1/2 left-3 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-cream/30 bg-night/45 text-cream backdrop-blur-sm transition-colors hover:border-sunset-yellow hover:text-sunset-yellow disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow md:left-6 md:h-14 md:w-14"
        >
          <ChevronLeft size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index >= last}
          aria-label="Next image"
          className="absolute top-1/2 right-3 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center border border-cream/30 bg-night/45 text-cream backdrop-blur-sm transition-colors hover:border-sunset-yellow hover:text-sunset-yellow disabled:pointer-events-none disabled:opacity-25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow md:right-6 md:h-14 md:w-14"
        >
          <ChevronRight size={22} strokeWidth={1.5} aria-hidden="true" />
        </button>

        <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-5 px-6 pb-10 pt-24 md:flex-row md:items-end md:justify-between md:px-16 md:pb-14">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.title}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <p className="font-serif text-2xl text-cream md:text-4xl lg:text-5xl">
                {current.title}
              </p>
              <p className="mt-2 max-w-lg text-sm font-light text-cream/80 md:text-base">
                {current.caption}
              </p>
            </motion.div>
          </AnimatePresence>

          <div
            className="flex flex-wrap items-center gap-2"
            role="tablist"
            aria-label="Carousel slides"
          >
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show image ${i + 1}: ${slide.title}`}
                onClick={() => goTo(i)}
                className="relative h-1.5 w-11 overflow-hidden bg-cream/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow"
              >
                <span
                  ref={(el) => {
                    fillRefs.current[i] = el;
                  }}
                  className="absolute inset-y-0 left-0 w-0 bg-sunset-yellow"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Image {index + 1} of {slides.length}: {current.title}
        </p>
      </div>
    </section>
  );
}
