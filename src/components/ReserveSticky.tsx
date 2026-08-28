import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { RESERVE_PATH } from '../data/contact';

interface ReserveStickyProps {
  /** When true, only show after leaving the hero on the home reel. */
  homeReel?: boolean;
}

/**
 * Persistent Reserve CTAs: primary → internal /reserve, secondary → OpenTable demo notice.
 */
export default function ReserveSticky({ homeReel = false }: ReserveStickyProps) {
  const [visible, setVisible] = useState(!homeReel);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!homeReel) {
      setVisible(true);
      return;
    }

    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.65);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [homeReel]);

  // Hide on the reserve page itself
  useEffect(() => {
    if (window.location.pathname.startsWith('/reserve')) {
      setVisible(false);
    }
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[70] flex justify-center p-3 md:p-4">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: 'easeOut' }}
            className="pointer-events-auto flex max-w-lg flex-wrap items-center justify-center gap-2 border border-cream/15 bg-night/90 px-3 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.4)] backdrop-blur-md md:gap-3 md:px-4"
            role="region"
            aria-label="Reservation shortcuts"
          >
            <a
              href={RESERVE_PATH}
              className="inline-flex min-h-11 items-center justify-center bg-sunset-yellow px-5 py-2.5 text-[10px] font-semibold tracking-[0.22em] text-night uppercase transition-colors hover:bg-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-night"
            >
              Reserve a table
            </a>
            <button
              type="button"
              data-opentable-demo
              aria-label="Book on OpenTable (demo notice)"
              className="inline-flex min-h-11 items-center justify-center border border-cream/40 px-4 py-2.5 text-[10px] font-semibold tracking-[0.2em] text-cream uppercase transition-colors hover:border-sunset-yellow hover:text-sunset-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-night"
            >
              OpenTable
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
