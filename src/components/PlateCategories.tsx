import type { PlateSubcategory } from '../data/menu';

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

interface PlateCategoriesProps {
  subcategories: PlateSubcategory[];
  selectedId?: string | null;
  onSelect: (id: string) => void;
}

/**
 * Selector de subcategorías de PLATES.
 * Tres paneles verticales de igual ancho, imagen de fondo a pantalla completa
 * y etiqueta grande alineada a la derecha en la parte inferior.
 */
export default function PlateCategories({
  subcategories,
  selectedId,
  onSelect,
}: PlateCategoriesProps) {
  return (
    <section
      id="plate-categories"
      className="menu-snap-section flex w-full flex-col bg-night"
      aria-label="Select a plate subcategory"
    >
      <header className="shrink-0 px-4 py-5 md:px-10 md:py-7">
        <p className="font-sans text-[10px] font-medium tracking-[0.35em] text-sunset-yellow uppercase">
          Culinary Selection
        </p>
        <h2 className="text-contrast mt-1 font-serif text-3xl text-white md:text-5xl">
          PLATES
        </h2>
      </header>

      <div className="flex min-h-0 flex-1 gap-1 px-4 pb-4 md:px-10 md:pb-7">
        {subcategories.map((sub) => {
          const isSelected = selectedId === sub.id;
          return (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelect(sub.id)}
              aria-label={`Ver ${sub.name}`}
              aria-pressed={isSelected}
              className={`group relative flex-1 cursor-pointer overflow-hidden outline-none transition-opacity duration-500 focus-visible:ring-2 focus-visible:ring-sunset-yellow ${
                isSelected ? 'ring-1 ring-inset ring-sunset-yellow' : ''
              }`}
            >
            <img
              src={sub.image}
              alt={sub.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Veladura para legibilidad */}
            <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/20 to-transparent" />

            {/* Etiqueta grande, alineada a la derecha abajo */}
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-end p-5 md:p-7 lg:p-10">
              <span
                className="text-contrast text-right text-3xl font-normal leading-none tracking-[0.02em] text-sunset-yellow transition-all duration-500 ease-out group-hover:scale-105 md:text-4xl lg:text-5xl"
                style={{ fontFamily: "'Billa Mount', 'Brush Script MT', cursive" }}
              >
                {toTitleCase(sub.shortLabel)}
              </span>
            </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
