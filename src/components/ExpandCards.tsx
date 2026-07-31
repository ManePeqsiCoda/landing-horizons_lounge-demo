import { useState } from 'react';
import type { MenuItem } from '../data/menu';

interface ExpandCardsProps {
  items: MenuItem[];
  /** Índice expandido inicial. Por defecto ninguno. */
  defaultExpanded?: number | false;
}

/**
 * Carrusel de tarjetas expandibles (estilo "expand-cards").
 * - Desktop (landscape): fila horizontal, se expande con hover.
 * - Móvil (portrait): columna vertical, se expande con click/tap.
 * - Acordeón: solo una tarjeta expandida a la vez.
 */
export default function ExpandCards({ items, defaultExpanded = false }: ExpandCardsProps) {
  const [expanded, setExpanded] = useState<number | false>(defaultExpanded);
  const hasExpanded = expanded !== false;

  return (
    <div
      className="flex h-full w-full flex-col gap-1 lg:flex-row"
      onMouseLeave={() => setExpanded(false)}
    >
      {items.map((item, i) => {
        const isExpanded = expanded === i;
        const flexClass =
          !hasExpanded
            ? 'flex-1'
            : isExpanded
              ? 'flex-[6] lg:flex-[3]'
              : 'flex-[0.25] lg:flex-1';
        return (
          <article
            key={item.id}
            role="button"
            tabIndex={0}
            aria-expanded={isExpanded}
            aria-label={`${item.name} — $${item.price}`}
            className={`group relative cursor-pointer overflow-hidden rounded-none outline-none transition-all duration-500 ease-in-out focus-visible:ring-2 focus-visible:ring-sunset-yellow ${flexClass}`}
            style={{ flexBasis: 0 }}
            onMouseEnter={() => {setExpanded(i);}}
            onClick={() => setExpanded(isExpanded ? false : i)}
          >
            {/* Imagen: 100% del alto y ancho de la tarjeta */}
            <img
              src={item.image}
              alt={item.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Veladura para legibilidad del texto */}
            <div className="absolute inset-0 bg-gradient-to-t from-night/75 via-night/15 to-transparent" />

            {/* Título de tarjetas colapsadas — horizontal en móvil, vertical en desktop */}
            {!isExpanded && (
              <div className="absolute inset-0 flex items-center justify-center px-2 text-center">
                <span
                  className="text-contrast text-4xl font-normal leading-none tracking-[0.04em] text-sunset-yellow [writing-mode:horizontal-tb] md:text-5xl lg:text-5xl lg:[writing-mode:vertical-rl] lg:[transform:rotate(180deg)]"
                  style={{ fontFamily: "'Billa Mount', 'Brush Script MT', cursive" }}
                >
                  {item.name}
                </span>
              </div>
            )}

            {/* Título horizontal + info — solo tarjeta expandida */}
            <div
              className={`absolute inset-x-0 bottom-0 border-t border-white/10 bg-gradient-to-t from-night/80 via-night/50 to-transparent p-5 backdrop-blur-sm transition-all duration-500 ease-out md:p-6 ${
                isExpanded
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-4 opacity-0'
              }`}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-contrast font-serif text-xl text-white md:text-2xl">
                  {item.name}
                </h3>
                <span className="font-sans text-sm font-medium tracking-[0.2em] text-sunset-yellow">
                  ${item.price}
                </span>
              </div>

              {/* Info del producto: aparece solo al expandir */}
              <div
                className={`overflow-hidden transition-all duration-500 ease-out ${
                  isExpanded ? 'mt-3 max-h-48 opacity-100' : 'mt-0 max-h-0 opacity-0'
                }`}
              >
                <p className="text-shadow-brief font-display text-sm font-light leading-relaxed text-cream/90 md:text-base">
                  {item.description}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/30 px-3 py-1 font-sans text-[10px] font-medium tracking-[0.15em] text-white/70 uppercase"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
