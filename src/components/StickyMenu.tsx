import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';

interface NavLink {
  label: string;
  href: string;
  accent?: boolean;
}

const LINKS: NavLink[] = [
  { label: 'HOME', href: '#hero' },
  { label: 'CULINARY & MIXOLOGY', href: '#culinary' },
  { label: 'EXPERIENCES', href: '#events' },
  { label: 'RESERVE WITH US', href: '#connect', accent: true },
  { label: 'CONTACT', href: '#footer' },
];

/**
 * Zara-style sticky navigation.
 * Hidden during the Hero frame; fades in after the first 100vh.
 * No background, large serif type, aggressive text-shadow contrast.
 */
export default function StickyMenu() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          visible ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-4 opacity-0'
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-5 md:px-12">
          <a
            href="#hero"
            className="text-contrast font-serif text-xl tracking-[0.25em] text-white md:text-2xl"
          >
            HORIZONS
          </a>

          {/* Desktop */}
          <ul className="hidden items-center gap-10 md:flex">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className={`nav-link text-contrast font-serif text-lg tracking-wider ${
                    link.accent ? 'text-sunset-yellow' : 'text-white'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile trigger */}
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="text-contrast text-white md:hidden"
          >
            <Menu size={28} strokeWidth={1.5} />
          </button>
        </nav>
      </header>

      {/* Mobile curtain menu */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col bg-night/95 backdrop-blur-sm transition-opacity duration-500 md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="flex justify-end px-6 py-5">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="text-white"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
        </div>
        <ul className="flex flex-1 flex-col items-center justify-center gap-10">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-serif text-4xl tracking-wider ${
                  link.accent ? 'text-sunset-yellow' : 'text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
