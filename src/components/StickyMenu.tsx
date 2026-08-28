import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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

function getLinks(isHome: boolean): NavLink[] {
  return [
    { label: 'Home', href: isHome ? '#hero' : '/' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Menu', href: '/menu' },
    { label: 'Experiences', href: '/experiences' },
    { label: 'Reserve with us', href: RESERVE_PATH, accent: true },
    { label: 'Contact', href: isHome ? '#footer' : '/#footer' },
  ];
}

/**
 * Conventional top navbar — visible at page top and on scroll-up; hides on scroll-down.
 * All primary links sit in the bar (no hamburger / side panel).
 */
export default function StickyMenu({ pathname: propPathname }: StickyMenuProps) {
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
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
    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      const current = window.scrollY;
      const delta = current - lastScrollY.current;
      const nearTop = current < 32;
      const scrollingUp = delta < -4;
      const scrollingDown = delta > 6;

      setScrolled(current > 16);

      if (nearTop) {
        setVisible(true);
      } else if (scrollingDown) {
        setVisible(false);
      } else if (scrollingUp) {
        setVisible(true);
      }

      lastScrollY.current = current;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      role="banner"
      aria-hidden={!visible}
      initial={false}
      animate={{
        y: visible ? 0 : '-110%',
        opacity: visible ? 1 : 0,
      }}
      transition={
        reduceMotion
          ? { duration: 0.15 }
          : { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      }
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? 'border-cream/15 bg-night/92 shadow-[0_8px_32px_rgba(0,0,0,0.35)]'
          : 'border-transparent bg-gradient-to-b from-night/70 to-transparent'
      }`}
      style={
        scrolled
          ? {
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
              backdropFilter: 'blur(14px) saturate(140%)',
            }
          : undefined
      }
    >
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-4 md:h-[4.25rem] md:gap-8 md:px-8 lg:px-12">
        <a
          href={isHome ? '#hero' : '/'}
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-night"
          aria-label="Horizons Lounge home"
        >
          <HorizonsLogo className="w-28 md:w-36" />
        </a>

        <nav
          aria-label="Primary"
          className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="flex items-center justify-end gap-1 whitespace-nowrap md:gap-0.5 lg:gap-1">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`inline-flex px-2.5 py-2 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sunset-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-night md:px-3 md:text-[11px] lg:px-3.5 ${
                    link.accent
                      ? 'text-sunset-yellow hover:text-cream'
                      : 'text-cream/85 hover:text-cream'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </motion.header>
  );
}
