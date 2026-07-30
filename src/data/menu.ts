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

export interface PlateSubcategory {
  id: string;
  name: string;
  /** Etiqueta corta para la tarjeta vertical. */
  shortLabel: string;
  image: string;
  items: MenuItem[];
}

export const drinks: MenuItem[] = [
  {
    id: 'signature-cocktails',
    name: 'Signature Cocktails',
    featured: true,
    description:
      'Creaciones exclusivas de nuestro bar team, inspiradas en la paleta del atardecer arubiano: cítricos brillantes, rones añejos y toques efervescentes que capturan el espíritu del Sunset Ritual.',
    price: 19,
    tags: ['Horizons Exclusive', 'Sunset Ritual', 'House Favorite'],
    image: '/images/drinks/signature-cocktail.jpg',
  },
  {
    id: 'tropical-mixology',
    name: 'Tropical Mixology',
    featured: true,
    description:
      'Técnicas contemporáneas aplicadas a frutas de la isla — piña asada, coco fresco, maracuyá y tamarindo — para una carta que huele y sabe a Caribe en cada sorbo.',
    price: 18,
    tags: ['Island Fruits', 'Craft', 'Tropical'],
    image: '/images/drinks/tropical-mixology.jpg',
  },
  {
    id: 'margaritas',
    name: 'Margaritas',
    featured: true,
    description:
      'Tequilas y mezcales seleccionados, cítricos exprimidos al momento y un borde de sal de mar que evoca la brisa de Eagle Beach. Clásicas, de fruta o con un twist de agave ahumado.',
    price: 17,
    tags: ['Tequila', 'Smoked Salt', 'Citrus Forward'],
    image: '/images/drinks/margarita.jpg',
  },
  {
    id: 'mojitos',
    name: 'Mojitos',
    featured: true,
    description:
      'Ron premium, hierbabuena local, lima y azúcar de caña sobre hielo triturado. Refrescantes, aromáticos y perfectos para el mediodía bajo el sol de Aruba.',
    price: 16,
    tags: ['Rum', 'Mint', 'Poolside'],
    image: '/images/drinks/mojito.jpg',
  },
  {
    id: 'espresso-martinis',
    name: 'Espresso Martinis',
    featured: true,
    description:
      'El clásico nocturno reinterpretado con espresso arubano recién preparado, vodka premium y un delicado licor de café. La energía que necesitas antes de la cena o la fiesta.',
    price: 18,
    tags: ['Coffee', 'After Dinner', 'Nightcap'],
    image: '/images/drinks/espresso-martini.jpg',
  },
  {
    id: 'tropical-old-fashioneds',
    name: 'Tropical Old Fashioneds',
    featured: true,
    description:
      'Whisky infusionado con especias caribeñas, bitter aromático, un toque de miel local y cáscara de naranja flameada. Elegancia atemporal con alma tropical.',
    price: 19,
    tags: ['Whisky', 'Spiced', 'Smoked'],
    image: '/images/drinks/tropical-old-fashioned.jpg',
  },
  {
    id: 'twice-daily-happy-hour',
    name: 'Twice-daily Happy Hour',
    featured: true,
    description:
      'Dos momentos al día para brindar: atardecer y media noche. Selección de cócteles, vinos y cervezas artesanales a precios especiales, porque el ritual debe repetirse.',
    price: 12,
    tags: ['Sunset', 'Late Night', 'Value'],
    image: '/images/drinks/happy-hour.jpg',
  },
];

/** Subcategorías de PLATES con sus respectivos ítems. */
export const plateSubcategories: PlateSubcategory[] = [
  {
    id: 'entries',
    name: 'Entries',
    shortLabel: 'ENTRIES',
    image:
      'https://images.unsplash.com/photo-1541014741259-de529411b62a?q=80&w=900&auto=format&fit=crop',
    items: [
      {
        id: 'tuna-tartare',
        name: 'Tuna Tartare',
        description:
          'Atún fresco cortado a mano, aguacate, pepino, ajonjolí tostado y un toque cítrico de yuzu. Ligero, fresco y elegante.',
        price: 21,
        tags: ['Raw', 'Fresh', 'Sharing'],
        image:
          'https://images.unsplash.com/photo-1541014741259-de529411b62a?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'crispy-calamari',
        name: 'Crispy Calamari',
        description:
          'Calamari dorado y crujiente servido con alioli de ajo asado y limón. Un clásico costero con twist caribeño.',
        price: 18,
        tags: ['Crispy', 'Seafood', 'Shareable'],
        image:
          'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'tropical-ceviche',
        name: 'Tropical Ceviche',
        description:
          'Pescado del día marinado en lima, leche de tigre, mango, chile serrano y cilantro. Frescura tropical en cada bocado.',
        price: 19,
        tags: ['Citrus', 'Local Fish', 'Gluten-free'],
        image:
          'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=900&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'dining',
    name: 'International & Local Fusion Dining',
    shortLabel: 'DINING',
    image:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=900&auto=format&fit=crop',
    items: [
      {
        id: 'aruba-flatbread',
        name: 'Aruba Flatbread',
        description:
          'Masa fina y crujiente con queso de cabra local, tomates cherry confitados, albahaca y reducción de balsámico.',
        price: 22,
        tags: ['Flatbread', 'Vegetarian', 'Sharing'],
        image:
          'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'eagle-beach-burger',
        name: 'Eagle Beach Burger',
        description:
          'Carne premium, queso cheddar maduro, cebolla caramelizada, tomate, lechuga y salsa secreta en brioche tostado.',
        price: 24,
        tags: ['Gourmet', 'Burger', 'Comfort'],
        image:
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'caribbean-tacos',
        name: 'Caribbean Tacos',
        description:
          'Tres tacos de pescado crocante o pollo jerk con repollo, salsa de piña picante y cilantro. Sabores de la isla.',
        price: 20,
        tags: ['Tacos', 'Spicy', 'Street Food'],
        image:
          'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'loaded-nachos',
        name: 'Loaded Nachos',
        description:
          'Totopos cubiertos con queso fundido, jalapeños, frijoles, guacamole, pico de gallo y crema agria. Para compartir.',
        price: 19,
        tags: ['Nachos', 'Sharing', 'Cheesy'],
        image:
          'https://images.unsplash.com/photo-1513456852971-4a88b2e2f7fa?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'coconut-shrimp',
        name: 'Coconut Shrimp',
        description:
          'Camarones empanizados en coco tostado, servidos con salsa de mango y chile. Crujiente, dulce y tropical.',
        price: 23,
        tags: ['Shrimp', 'Crispy', 'Tropical'],
        image:
          'https://images.unsplash.com/photo-1559054663-e8d23213f55c?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'tuna-nachos',
        name: 'Tuna Nachos',
        description:
          'Wontons crujientes cubiertos con atún fresco, aguacate, salsa de sriracha-mayonesa y cebollín.',
        price: 25,
        tags: ['Tuna', 'Wonton', 'Premium'],
        image:
          'https://images.unsplash.com/photo-1541014741259-de529411b62a?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'pasta-aruba',
        name: 'Pasta Aruba',
        description:
          'Pasta fresca con langostinos, tomates cherry, ajo, vino blanco y un toque de chile. Elegancia mediterránea con vista al mar.',
        price: 28,
        tags: ['Pasta', 'Seafood', 'Mediterranean'],
        image:
          'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'fresh-island-salad',
        name: 'Fresh Island Salad',
        description:
          'Mix de hojas verdes, aguacate, mango, nueces caramelizadas, queso feta y vinagreta de maracuyá.',
        price: 17,
        tags: ['Salad', 'Fresh', 'Vegetarian'],
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'signature-entree',
        name: 'Signature Entrée',
        description:
          'Plato insignia del chef: filete de pescado fresco en salsa de mantequilla dorada con vegetales de temporada y puré de batata.',
        price: 34,
        tags: ['Chef Favorite', 'Signature', 'Fine Dining'],
        image:
          'https://images.unsplash.com/photo-1467003909585-2f8a7270028d?q=80&w=900&auto=format&fit=crop',
      },
    ],
  },
  {
    id: 'culinary',
    name: 'Specialty Culinary Offerings',
    shortLabel: 'CULINARY',
    image:
      'https://images.unsplash.com/photo-1579871494447-9811cf80d488?q=80&w=900&auto=format&fit=crop',
    items: [
      {
        id: 'handcrafted-sushi',
        name: 'Handcrafted Sushi',
        description:
          'Selección de nigiri y sashimi elaborados con pescado fresco del día, arroz sazonado y wasabi natural.',
        price: 26,
        tags: ['Sushi', 'Raw', 'Artisan'],
        image:
          'https://images.unsplash.com/photo-1579871494447-9811cf80d488?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'sunset-sushi-roll',
        name: 'Sunset Sushi Roll',
        description:
          'Roll especial del horizonte con atún picante, aguacate, mango, tobiko y un toque de sriracha-mayonesa.',
        price: 24,
        tags: ['Signature Roll', 'Spicy', 'Mango'],
        image:
          'https://images.unsplash.com/photo-1553621042-f6e1472451cf?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'vegan-poke-bowl',
        name: 'Vegan Poke Bowl',
        description:
          'Bowl vegano con quinoa, tofu marinado, edamame, aguacate, pepino, zanahoria y aderezo de sésamo.',
        price: 21,
        tags: ['Vegan', 'Healthy', 'Bowl'],
        image:
          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'vegetarian-tasting',
        name: 'Vegetarian Tasting',
        description:
          'Selección de cuatro preparaciones vegetarianas que celebran los vegetales locales de Aruba.',
        price: 29,
        tags: ['Vegetarian', 'Tasting', 'Local'],
        image:
          'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=900&auto=format&fit=crop',
      },
      {
        id: 'gluten-free-seafood',
        name: 'Gluten-free Seafood',
        description:
          'Mariscos a la plancha con vegetales frescos, hierbas aromáticas y aceite de oliva. Sin gluten, sin concesiones.',
        price: 32,
        tags: ['Gluten-free', 'Seafood', 'Grilled'],
        image:
          'https://images.unsplash.com/photo-1534939561126-855b8675edd7?q=80&w=900&auto=format&fit=crop',
      },
    ],
  },
];
