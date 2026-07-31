import { motion } from 'framer-motion';
import type { GalleryImage } from '../data/gallery';

interface GalleryWallProps {
  images: GalleryImage[];
}

/**
 * Muro de fotos full-bleed inspirado en galerías masonry de lujo.
 *
 * Diseño collage que cubre todo el viewport en desktop y tablet:
 * - Desktop: 6 columnas × 3 filas (100svh).
 * - Tablet:  3 columnas × 6 filas (100svh).
 * - Mobile:  2 columnas × 6 filas, altura natural (scroll vertical).
 *
 * Las imágenes usan object-cover para llenar cada celda sin importar
 * la orientación original (landscape/portrait mixtas).
 */
export default function GalleryWall({ images }: GalleryWallProps) {
  // El layout está optimizado para 10 imágenes. Si cambia la cantidad,
  // ajustar el array `cellSpans` y la grid de abajo.
  const cellSpans: string[] = [
    // 0 — hero image, grande
    'col-span-2 row-span-1 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-3',
    // 1
    'col-span-1 row-span-1 md:col-span-1 md:row-span-2 lg:col-span-2 lg:row-span-1',
    // 2
    'col-span-1 row-span-1 md:col-span-1 md:row-span-2 lg:col-span-2 lg:row-span-1',
    // 3–8 — celdas individuales
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    'col-span-1 row-span-1',
    // 9 — imagen ancha de cierre
    'col-span-2 row-span-1 md:col-span-2 md:row-span-1 lg:col-span-2 lg:row-span-1',
  ];

  return (
    <section
      aria-label="Gallery"
      className="relative h-screen min-h-screen w-screen overflow-hidden bg-sand"
    >
      {/* Título de sección superpuesto con máxima legibilidad */}
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
        <h1
          className="text-contrast text-7xl font-normal leading-none tracking-[0.02em] text-sunset-yellow md:text-9xl lg:text-[11rem]"
          style={{ fontFamily: "'Billa Mount', 'Brush Script MT', cursive" }}
        >
          Gallery
        </h1>
      </div>

      {/* Muro de fotos */}
      <div
        className="grid h-full w-full grid-cols-2 grid-rows-6 gap-1 md:grid-cols-3 md:grid-rows-6 lg:grid-cols-6 lg:grid-rows-3 grid-flow-dense"
      >
        {images.map((image, index) => {
          const span = cellSpans[index] ?? 'col-span-1 row-span-1';
          return (
            <motion.figure
              key={image.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: index * 0.06,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{ scale: 1.02 }}
              className={`group relative cursor-pointer overflow-hidden ${span}`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading={index < 4 ? 'eager' : 'lazy'}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Veladura sutil que aparece en hover para dar profundidad */}
              <div className="absolute inset-0 bg-terracotta/0 transition-colors duration-500 group-hover:bg-terracotta/15" />
              <figcaption className="sr-only">{image.alt}</figcaption>
            </motion.figure>
          );
        })}
      </div>
    </section>
  );
}
