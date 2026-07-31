import { useEffect, useRef, useState } from 'react';
import { drinks, plateSubcategories } from '../data/menu';
import ExpandCards from './ExpandCards';
import MenuHero from './MenuHero';
import PlateCategories from './PlateCategories';

type MenuCategory = 'drinks' | 'plates';

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const LOCK_MS = 950;

export default function MenuReel() {
  const [category, setCategory] = useState<MenuCategory | null>(null);
  const [selectedPlateSubcategory, setSelectedPlateSubcategory] = useState<string | null>(null);
  const locked = useRef(false);
  const reducedMotion = useRef(false);
  const touchStartY = useRef(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const plateSubcategory = selectedPlateSubcategory
    ? plateSubcategories.find((s) => s.id === selectedPlateSubcategory)
    : null;

  // Slides visibles según la categoría activa. Solo se renderiza el menú
  // de la selección actual, acumulando la ruta de Plates cuando aplica.
  const slideCount =
    category === null
      ? 1
      : category === 'drinks'
        ? 2
        : selectedPlateSubcategory
          ? 3
          : 2;

  const scrollToSlide = (index: number) => {
    if (index < 0 || index >= slideCount) return;
    locked.current = true;
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: reducedMotion.current ? 'auto' : 'smooth',
    });
    window.setTimeout(() => {
      locked.current = false;
    }, LOCK_MS);
  };

  // Scroll automático a la nueva slide cuando cambia la selección,
  // respetando prefers-reduced-motion.
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const target =
      category === null
        ? 0
        : category === 'drinks'
          ? 1
          : selectedPlateSubcategory
            ? 2
            : 1;
    if (target > 0) scrollToSlide(target);
  }, [category, selectedPlateSubcategory]);

  const handleSelectDrinks = () => {
    if (category === 'drinks') {
      scrollToSlide(1);
      return;
    }
    setCategory('drinks');
    setSelectedPlateSubcategory(null);
  };

  const handleSelectPlates = () => {
    if (category === 'plates') {
      scrollToSlide(1);
      return;
    }
    setCategory('plates');
    setSelectedPlateSubcategory(null);
  };

  const handleSelectPlateSubcategory = (id: string) => {
    setSelectedPlateSubcategory(id);
  };

  const go = (dir: number) => {
    if (locked.current || dir === 0) return;
    const currentSlide = Math.round(window.scrollY / window.innerHeight);
    // Desde el Hero no se permite bajar con gestos; el usuario debe hacer click.
    if (currentSlide === 0 && dir === 1) return;
    const next = Math.min(Math.max(currentSlide + dir, 0), slideCount - 1);
    if (next === currentSlide) return;
    scrollToSlide(next);
  };

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      go(Math.sign(e.deltaY));
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchStartY.current - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 40) go(Math.sign(dy));
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        go(1);
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        go(-1);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [slideCount]);

  return (
    <main id="reel-main">
      <h1 className="sr-only">Culinary & Mixology Menu</h1>

      {/* Status announcement for screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {category === null
          ? 'Select a menu category'
          : category === 'drinks'
            ? 'Showing drinks'
            : selectedPlateSubcategory
              ? `Showing ${plateSubcategory?.name ?? ''}`
              : 'Showing plate categories'}
      </div>

      <MenuHero
        onSelectDrinks={handleSelectDrinks}
        onSelectPlates={handleSelectPlates}
      />

      {category === 'drinks' && (
        <section
          id="drinks"
          className="menu-snap-section flex w-full flex-col bg-night"
          aria-label="Drinks"
        >
          <header className="shrink-0 px-4 py-5 md:px-10 md:py-7">
            <p className="font-sans text-[10px] font-medium tracking-[0.35em] text-sunset-yellow uppercase">
              Signature Cocktails
            </p>
            <h2 className="text-contrast mt-1 font-serif text-3xl text-white md:text-5xl">
              DRINKS
            </h2>
          </header>

          <div className="min-h-0 flex-1 px-4 pb-4 md:px-10 md:pb-7">
            <ExpandCards items={drinks} />
          </div>
        </section>
      )}

      {category === 'plates' && (
        <PlateCategories
          subcategories={plateSubcategories}
          selectedId={selectedPlateSubcategory}
          onSelect={handleSelectPlateSubcategory}
        />
      )}

      {category === 'plates' && plateSubcategory && (
        <section
          id="plate-items"
          className="menu-snap-section flex w-full flex-col bg-night"
          aria-label={plateSubcategory.name}
        >
          <header className="shrink-0 px-4 py-5 md:px-10 md:py-7">
            <p className="font-sans text-[10px] font-medium tracking-[0.35em] text-sunset-yellow uppercase">
              Plates
            </p>
            <h2 className="text-contrast mt-1 font-serif text-3xl text-white md:text-5xl">
              {plateSubcategory.name.toUpperCase()}
            </h2>
          </header>

          <div className="min-h-0 flex-1 px-4 pb-4 md:px-10 md:pb-7">
            <ExpandCards items={plateSubcategory.items} />
          </div>
        </section>
      )}
    </main>
  );
}

