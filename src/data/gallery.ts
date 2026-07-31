/**
 * Galería de imágenes — Horizons Lounge Aruba.
 * Las fotografías están ubicadas en /public/images/gallery/ y se resuelven como
 * rutas absolutas en el navegador.
 */

export interface GalleryImage {
  id: string;
  /** Ruta relativa a /public/ (se resuelve como URL absoluta en el navegador). */
  src: string;
  /** Texto alternativo descriptivo para accesibilidad y SEO. */
  alt: string;
  /** Categoría temática para futuros filtros. */
  category: 'sunset' | 'food' | 'drinks' | 'vibe' | 'beach';
}

export const galleryImages: GalleryImage[] = [
  {
    id: 'gal-01',
    src: '/images/gallery/01.jpg',
    alt: 'Layered tropical cocktail served at the beach bar with Eagle Beach in the background',
    category: 'drinks',
  },
  {
    id: 'gal-02',
    src: '/images/gallery/02.jpg',
    alt: 'Hand raising a red signature cocktail over a plate of appetizers and Horizons branding',
    category: 'drinks',
  },
  {
    id: 'gal-03',
    src: '/images/gallery/03.jpg',
    alt: 'Couple enjoying the sunset lounge atmosphere at golden hour',
    category: 'sunset',
  },
  {
    id: 'gal-04',
    src: '/images/gallery/04.jpg',
    alt: 'Guests toasting cocktails while a saxophone player performs at sunset',
    category: 'vibe',
  },
  {
    id: 'gal-05',
    src: '/images/gallery/05.jpg',
    alt: 'Loaded nachos platter served at Horizons Lounge',
    category: 'food',
  },
  {
    id: 'gal-06',
    src: '/images/gallery/06.jpg',
    alt: 'Overhead view of a colorful Caribbean food spread on the table',
    category: 'food',
  },
  {
    id: 'gal-07',
    src: '/images/gallery/07.jpg',
    alt: 'Sushi and dumplings platter crafted by the Horizons culinary team',
    category: 'food',
  },
  {
    id: 'gal-08',
    src: '/images/gallery/08.jpg',
    alt: 'Two pink sparkling cocktails being raised for a sunset toast',
    category: 'drinks',
  },
  {
    id: 'gal-09',
    src: '/images/gallery/09.jpg',
    alt: 'Vibrant carnival dancers in colorful costumes under the Aruba sky',
    category: 'vibe',
  },
  {
    id: 'gal-10',
    src: '/images/gallery/10.jpg',
    alt: 'Group of friends toasting with colorful cocktails on the Horizons balcony',
    category: 'vibe',
  },
];

/** Número esperado de imágenes para el layout collage full-bleed. */
export const GALLERY_IMAGE_COUNT = galleryImages.length;
