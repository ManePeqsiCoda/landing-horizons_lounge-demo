/**
 * Galería de imágenes — Horizons Lounge Aruba.
 * Las fotografías deben ubicarse en /public../../public/images/gallery/ y nombrarse según el campo `src`.
 * Reemplaza los placeholders por los archivos reales que compartas en el chat.
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
    src: '../../public/images/gallery/01.jpg',
    alt: 'Sunset ritual over Eagle Beach with the iconic Fofoti tree silhouette',
    category: 'sunset',
  },
  {
    id: 'gal-02',
    src: '../../public/images/gallery/02.jpg',
    alt: 'Signature cocktail served against the Aruba sunset horizon',
    category: 'drinks',
  },
  {
    id: 'gal-03',
    src: '../../public/images/gallery/03.jpg',
    alt: 'Fresh sushi platter crafted by the Horizons culinary team',
    category: 'food',
  },
  {
    id: 'gal-04',
    src: '../../public/images/gallery/04.jpg',
    alt: 'Guests enjoying the lounge atmosphere at golden hour',
    category: 'vibe',
  },
  {
    id: 'gal-05',
    src: '../../public/images/gallery/05.jpg',
    alt: 'Close-up of a tropical mixology creation with island fruits',
    category: 'drinks',
  },
  {
    id: 'gal-06',
    src: '../../public/images/gallery/06.jpg',
    alt: 'Palm frames and ocean view from the Horizons terrace',
    category: 'beach',
  },
  {
    id: 'gal-07',
    src: '../../public/images/gallery/07.jpg',
    alt: 'Live music performance under the Aruba night sky',
    category: 'vibe',
  },
  {
    id: 'gal-08',
    src: '../../public/images/gallery/08.jpg',
    alt: 'Chef plating a Caribbean-inspired dish at sunset',
    category: 'food',
  },
  {
    id: 'gal-09',
    src: '../../public/images/gallery/09.jpg',
    alt: 'Soft candlelight and ocean breeze on the outdoor deck',
    category: 'vibe',
  },
  {
    id: 'gal-10',
    src: '../../public/images/gallery/10.jpg',
    alt: 'Colorful Aruba sky reflected on the calm Caribbean Sea',
    category: 'sunset',
  },
];

/** Número esperado de imágenes para el layout collage full-bleed. */
export const GALLERY_IMAGE_COUNT = galleryImages.length;
