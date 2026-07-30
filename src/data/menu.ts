/**
 * Datos del menú — Horizons Lounge Aruba.
 * Imágenes: placeholders de Unsplash hasta que llegue la fotografía real.
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Precio en USD. */
  price: number;
  tags: string[];
  featured?: boolean;
  image: string;
}

export const drinks: MenuItem[] = [
  {
    id: 'eagle-beach-sunset',
    name: 'Eagle Beach Sunset',
    featured: true,
    description:
      'Mezcla refrescante y sofisticada de vodka, St. Germain, Aperol y un toque efervescente de Prosecco.',
    price: 18,
    tags: ['Signature', 'Cocktail', 'Instagrameable'],
    image:
      'https://images.unsplash.com/photo-1536935338788-846bb9981813?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'fofoti',
    name: 'Fofoti',
    featured: true,
    description:
      'Ron especiado infusionado con delicada esencia de rosas, inspirado en la flora local.',
    price: 17,
    tags: ['Signature', 'Local Identity'],
    image:
      'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'horizons-colada',
    name: 'Horizons Colada',
    featured: true,
    description:
      'Clásica Piña Colada elevada con un flotante de Ron Myers oscuro y notas de coco tostado.',
    price: 16,
    tags: ['Signature', 'Tropical'],
    image:
      'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=900&auto=format&fit=crop',
  },
  {
    id: 'hibiscus-margarita',
    name: 'Hibiscus Margarita',
    featured: true,
    description:
      'Tequila premium, licor de naranja y infusión de flor de Jamaica, decorado con una flor comestible.',
    price: 18,
    tags: ['Signature', 'Instagrameable'],
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=900&auto=format&fit=crop',
  },
];
