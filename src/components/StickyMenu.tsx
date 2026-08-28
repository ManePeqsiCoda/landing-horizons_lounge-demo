import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import HorizonsLogo from './HorizonsLogo';
import { RESERVE_PATH } from '../data/contact';

interface NavLink {
  label: string;
  href: string;
  accent?: boolean;
}

interface StickyMenuProps {
  pathname?: string;
}

const REEL_MAIN_ID = 'reel-main';

/** Blurs / restores the main content sitting behind the menu on any page. */
function setPageBlur(on: boolean) {
  document.body.classList.toggle('menu-blur', on);
  document.getElementById(REEL_MAIN_ID)?.classList.toggle('menu-blur', on);
  document.getElementById('home-main')?.classList.toggle('menu-blur', on);
}

function getLinks(isHome: boolean): NavLink[] {
  return [
    { label: 'HOME', href: isHome ? '#hero' : '/' },
    { label: 'GALLERY', href: '/gallery' },
    { label: 'CULINARY & MIXOLOGY', href: '/menu' },
    { label: 'EXPERIENCES', href: '/experiences' },
    { label: 'RESERVE WITH US', href: RESERVE_PATH, accent: true },
    { label: 'CONTACT', href: isHome ? '#footer' : '/#footer' },
  ];
}

/**
 * Zara-style navigation.
 * - Desktop: glass panel + vertical links. Revealed on scroll up; animated exit on scroll down.
 * - Mobile: hamburger opens a full-screen curtain.
 */
export default function StickyMenu({ pathname: propPathname }: StickyMenuProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pathname, setPathname] = useState(propPathname ?? '/');
  const lastScrollY = useRef(0);
  const reduceMotion = useReducedMotion();

  const isHome = pathname === '/' || pathname === '/index.html';
  const LINKS = getLinks(isHome);

  useEffect(() => {
    if (propPathname === undefined) {
      setPathname(window.location.pathname);
    }
  }, [propPathname]);

  useEffect(() => {
    setPageBlur(open);
    return () => setPageBlur(false);
  }, [open]);

  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      const scrollingUp = current < lastScrollY.current;
      // Keep hidden near the very top of the page (hero / brand-first).
      setVisible(scrollingUp && current > 48);
      lastScrollY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, y: -28, filter: 'blur(6px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        exit: { opacity: 0, y: -36, filter: 'blur(8px)' },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
      };

  const brandMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 },
      }
    : {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -24 },
        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
      };

  return (
    <>
      {/* Brand mark (top-left) — mirrors nav reveal */}
      <AnimatePresence>
        {visible && (
          <motion.a
            key="brand"
            href={isHome ? '#hero' : '/'}
            className="text-contrast fixed left-6 top-5 z-50 hidden w-32 md:left-12 md:block md:w-40"
            aria-label="Go to home"
            {...brandMotion}
          >
            <HorizonsLogo className="w-full" />
          </motion.a>
        )}
      </AnimatePresence>

      {/* Right-side vertical menu (desktop) — glass panel */}
      <AnimatePresence>
        {visible && (
          <motion.nav
            key="desktop-nav"
            aria-label="Primary"
            onMouseEnter={() => setPageBlur(true)}
            onMouseLeave={() => setPageBlur(false)}
            className="fixed right-6 top-20 z-50 hidden md:right-12 md:block lg:top-24"
            {...navMotion}
          >
            <ul
              className="flex flex-col items-end gap-4 border border-cream/15 bg-night/55 px-5 py-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:gap-5 lg:px-6 lg:py-7"
              style={{
                WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                backdropFilter: 'blur(20px) saturate(140%)',
              }}
            >
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className={`nav-link text-contrast font-serif text-xl tracking-wider focus-visible:outline-none lg:text-2xl ${
                      link.accent ? 'text-sunset-yellow' : 'text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>

      {/* Menu trigger — mobile always; desktop when nav is hidden */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`text-contrast fixed right-4 top-4 z-50 flex cursor-pointer items-center gap-2 rounded-full border border-cream/15 bg-night/55 px-4 py-2 text-white shadow-[0_8px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl touch-manipulation transition-all duration-400 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-night md:right-12 ${
          visible
            ? 'md:pointer-events-none md:-translate-y-6 md:opacity-0'
            : 'md:translate-y-0 md:opacity-100'
        }`}
      >
        <span className="text-[10px] font-medium tracking-[0.25em] uppercase">
          Menu
        </span>
        <Menu size={22} strokeWidth={1.5} />
      </button>

      {/* Mobile curtain menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[60] flex flex-col bg-night/92 backdrop-blur-2xl"
          >
            <div className="flex justify-end px-4 py-4">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-center gap-2 rounded-full border border-cream/15 bg-night/55 px-4 py-2 text-white backdrop-blur-xl touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-night"
              >
                <span className="text-[10px] font-medium tracking-[0.25em] uppercase">
                  Close
                </span>
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>
            <ul className="flex flex-1 flex-col items-center justify-center gap-8 px-6 pb-12">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`font-serif text-3xl tracking-wider focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow focus-visible:ring-offset-4 focus-visible:ring-offset-night ${
                      link.accent ? 'text-sunset-yellow' : 'text-white'
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
