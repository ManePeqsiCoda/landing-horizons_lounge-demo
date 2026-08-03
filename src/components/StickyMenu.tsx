import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import HorizonsLogo from './HorizonsLogo';

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
  // Keep the legacy reel target in sync so the home page still behaves exactly as before.
  document.getElementById(REEL_MAIN_ID)?.classList.toggle('menu-blur', on);
}

function getLinks(isHome: boolean): NavLink[] {
  return [
    { label: 'HOME', href: isHome ? '#hero' : '/' },
    { label: 'GALLERY', href: '/gallery' },
    { label: 'CULINARY & MIXOLOGY', href: '/menu' },
    { label: 'EXPERIENCES', href: '/experiences' },
    { label: 'RESERVE WITH US', href: '/reserve', accent: true },
    { label: 'CONTACT', href: isHome ? '#footer' : '/#footer' },
  ];
}

/**
 * Zara-style navigation.
 * - Desktop: brand mark + vertical column at the right edge. Revealed when
 *   scrolling up. While scrolling down, a hamburger button stays visible
 *   instead of hiding the menu entirely.
 * - Mobile: hamburger button (large hit area) opens a full-screen curtain.
 */
export default function StickyMenu({ pathname: propPathname }: StickyMenuProps) {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pathname, setPathname] = useState(propPathname ?? '/');
  const lastScrollY = useRef(0);

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
      setVisible(current < lastScrollY.current);
      lastScrollY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const desktopVisible = 'md:translate-y-0 md:opacity-100';
  const brandHidden = 'md:-translate-y-28 md:opacity-0 md:pointer-events-none';
  const navHidden = 'md:-translate-y-full md:opacity-0 md:pointer-events-none';

  return (
    <>
      {/* Brand mark (top-left) */}
      <a
        href={isHome ? '#hero' : '/'}
        className={`text-contrast fixed left-6 top-5 z-50 w-32 transition-transform duration-500 ease-out md:left-12 md:w-40 ${
          visible ? desktopVisible : brandHidden
        }`}
        aria-label="Go to home"
      >
        <HorizonsLogo className="w-full" />
      </a>

      {/* Right-side vertical menu (desktop) */}
      <nav
        aria-label="Primary"
        onMouseEnter={() => setPageBlur(true)}
        onMouseLeave={() => setPageBlur(false)}
        className={`fixed right-6 top-20 z-50 hidden transition-transform duration-500 ease-out md:right-12 md:block lg:top-24 ${
          visible ? desktopVisible : navHidden
        }`}
      >
        <ul className="flex flex-col items-end gap-4 lg:gap-5">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className={`nav-link text-contrast font-serif text-xl tracking-wider lg:text-2xl ${
                  link.accent ? 'text-sunset-yellow' : 'text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menu trigger — always on mobile, appears on desktop while scrolling down */}
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className={`text-contrast fixed right-4 top-4 z-50 flex cursor-pointer items-center gap-2 rounded-full bg-night/60 px-4 py-2 text-white backdrop-blur-sm touch-manipulation transition-transform duration-500 ease-out md:right-12 ${
          visible ? 'md:-translate-y-24 md:opacity-0 md:pointer-events-none' : ''
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
            className="fixed inset-0 z-[60] flex flex-col bg-night"
          >
            <div className="flex justify-end px-4 py-4">
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-night/60 px-4 py-2 text-white backdrop-blur-sm touch-manipulation"
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
                    className={`font-serif text-3xl tracking-wider ${
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
