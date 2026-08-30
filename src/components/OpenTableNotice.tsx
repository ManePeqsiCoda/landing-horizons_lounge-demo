import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { OPENTABLE_DEMO_MESSAGE, RESERVE_PATH } from '../data/contact';

const DISMISS_MS = 6500;

/**
 * Global demo notice for OpenTable CTAs.
 * Any click on `[data-opentable-demo]` opens a toast explaining the future integration.
 */
export default function OpenTableNotice() {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const timerRef = useRef<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const dismiss = () => {
    setOpen(false);
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const show = () => {
    setOpen(true);
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(dismiss, DISMISS_MS);
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest('[data-opentable-demo]');
      if (!trigger) return;
      event.preventDefault();
      show();
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-center p-4 md:justify-end md:p-6"
      aria-live="polite"
    >
      <AnimatePresence>
        {open && (
          <motion.aside
            role="status"
            aria-label="OpenTable demo notice"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reduceMotion ? 0.15 : 0.28, ease: 'easeOut' }}
            className="pointer-events-auto max-w-sm border border-ivory/20 bg-teal-night/95 p-5 text-ivory shadow-[0_16px_48px_rgba(6,44,51,0.45)] backdrop-blur-md"
          >
            <p className="text-[13px] font-semibold tracking-[0.28em] text-sunflower uppercase">
              OpenTable — prototype
            </p>
            <p className="mt-3 font-sans text-base leading-relaxed text-ivory/90">
              {OPENTABLE_DEMO_MESSAGE}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={RESERVE_PATH}
                className="inline-flex border border-sunflower bg-sunflower px-4 py-2 text-[13px] font-semibold tracking-[0.2em] text-pine uppercase transition-colors hover:bg-transparent hover:text-sunflower focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower focus-visible:ring-offset-2 focus-visible:ring-offset-teal-night"
              >
                Reserve here instead
              </a>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={dismiss}
                className="text-[13px] font-semibold tracking-[0.2em] text-ivory/85 uppercase transition-colors hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunflower focus-visible:ring-offset-2 focus-visible:ring-offset-teal-night"
              >
                Dismiss
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
