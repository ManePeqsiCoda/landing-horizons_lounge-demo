interface MenuHeroProps {
  onSelectDrinks: () => void;
  onSelectPlates: () => void;
}

/**
 * Hero dividido: DRINKS (arriba-izquierda) y PLATES (abajo-derecha).
 * En landscape la división es diagonal; en portrait es horizontal.
 * Cada área es un botón que invoca la selección de categoría.
 */
export default function MenuHero({ onSelectDrinks, onSelectPlates }: MenuHeroProps) {
  return (
    <section
      id="menu-hero"
      className="menu-snap-section relative overflow-hidden bg-night"
      aria-label="Selecciona una categoría del menú"
    >
      {/* DRINKS */}
      <button
        type="button"
        onClick={onSelectDrinks}
        aria-label="View drinks"
        className="menu-triangle drinks-area group absolute inset-0 z-10 flex items-start justify-start transition-colors duration-500 hover:bg-white/[0.03]"
      >
        <div className="pointer-events-none p-10 md:p-20 lg:p-28">
          <span className="text-contrast font-serif text-5xl font-medium tracking-[0.08em] text-white transition-all duration-500 ease-out group-hover:tracking-[0.14em] md:text-6xl lg:text-7xl">
            DRINKS
          </span>
        </div>
      </button>

      {/* PLATES */}
      <button
        type="button"
        onClick={onSelectPlates}
        aria-label="View plates"
        className="menu-triangle plates-area group absolute inset-0 z-10 flex items-end justify-end transition-colors duration-500 hover:bg-white/[0.03]"
      >
        <div className="pointer-events-none p-10 md:p-20 lg:p-28">
          <span className="text-contrast font-serif text-5xl font-medium tracking-[0.08em] text-white transition-all duration-500 ease-out group-hover:tracking-[0.14em] md:text-6xl lg:text-7xl">
            PLATES
          </span>
        </div>
      </button>

      {/* Línea divisoria */}
      <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
        <svg
          className="h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            className="divider-diagonal"
            x1="100"
            y1="0"
            x2="0"
            y2="100"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.18"
          />
          <line
            className="divider-horizontal"
            x1="0"
            y1="50"
            x2="100"
            y2="50"
            stroke="rgba(255, 255, 255, 0.22)"
            strokeWidth="0.18"
          />
        </svg>
      </div>
    </section>
  );
}
