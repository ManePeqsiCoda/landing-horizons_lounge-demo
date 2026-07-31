/**
 * Datos del menú — Horizons Lounge Aruba.
 * Imágenes: fotografía local en /public/images/plates y /public/images/gallery
 * para garantizar que carguen sin depender de servicios externos.
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
    image: '/images/gallery/06.jpg',
    items: [
      {
        id: 'tuna-tartare',
        name: 'Tuna Tartare',
        description:
          'Atún fresco cortado a mano, aguacate, pepino, ajonjolí tostado y un toque cítrico de yuzu. Ligero, fresco y elegante.',
        price: 21,
        tags: ['Raw', 'Fresh', 'Sharing'],
        image: '/images/gallery/07.jpg',
      },
      {
        id: 'crispy-calamari',
        name: 'Crispy Calamari',
        description:
          'Calamari dorado y crujiente servido con alioli de ajo asado y limón. Un clásico costero con twist caribeño.',
        price: 18,
        tags: ['Crispy', 'Seafood', 'Shareable'],
        image: '/images/plates/crispy-calamari.jpg',
      },
      {
        id: 'tropical-ceviche',
        name: 'Tropical Ceviche',
        description:
          'Pescado del día marinado en lima, leche de tigre, mango, chile serrano y cilantro. Frescura tropical en cada bocado.',
        price: 19,
        tags: ['Citrus', 'Local Fish', 'Gluten-free'],
        image: '/images/gallery/06.jpg',
      },
    ],
  },
  {
    id: 'dining',
    name: 'International & Local Fusion Dining',
    shortLabel: 'DINING',
    image: '/images/gallery/05.jpg',
    items: [
      {
        id: 'aruba-flatbread',
        name: 'Aruba Flatbread',
        description:
          'Masa fina y crujiente con queso de cabra local, tomates cherry confitados, albahaca y reducción de balsámico.',
        price: 22,
        tags: ['Flatbread', 'Vegetarian', 'Sharing'],
        image: '/images/plates/aruba-flatbread.jpg',
      },
      {
        id: 'eagle-beach-burger',
        name: 'Eagle Beach Burger',
        description:
          'Carne premium, queso cheddar maduro, cebolla caramelizada, tomate, lechuga y salsa secreta en brioche tostado.',
        price: 24,
        tags: ['Gourmet', 'Burger', 'Comfort'],
        image: '/images/plates/eagle-beach-burger.jpg',
      },
      {
        id: 'caribbean-tacos',
        name: 'Caribbean Tacos',
        description:
          'Tres tacos de pescado crocante o pollo jerk con repollo, salsa de piña picante y cilantro. Sabores de la isla.',
        price: 20,
        tags: ['Tacos', 'Spicy', 'Street Food'],
        image: '/images/plates/caribbean-tacos.jpg',
      },
      {
        id: 'loaded-nachos',
        name: 'Loaded Nachos',
        description:
          'Totopos cubiertos con queso fundido, jalapeños, frijoles, guacamole, pico de gallo y crema agria. Para compartir.',
        price: 19,
        tags: ['Nachos', 'Sharing', 'Cheesy'],
        image: '/images/gallery/05.jpg',
      },
      {
        id: 'coconut-shrimp',
        name: 'Coconut Shrimp',
        description:
          'Camarones empanizados en coco tostado, servidos con salsa de mango y chile. Crujiente, dulce y tropical.',
        price: 23,
        tags: ['Shrimp', 'Crispy', 'Tropical'],
        image: '/images/plates/coconut-shrimp.jpg',
      },
      {
        id: 'tuna-nachos',
        name: 'Tuna Nachos',
        description:
          'Wontons crujientes cubiertos con atún fresco, aguacate, salsa de sriracha-mayonesa y cebollín.',
        price: 25,
        tags: ['Tuna', 'Wonton', 'Premium'],
        image: '/images/gallery/05.jpg',
      },
      {
        id: 'pasta-aruba',
        name: 'Pasta Aruba',
        description:
          'Pasta fresca con langostinos, tomates cherry, ajo, vino blanco y un toque de chile. Elegancia mediterránea con vista al mar.',
        price: 28,
        tags: ['Pasta', 'Seafood', 'Mediterranean'],
        image: '/images/plates/pasta-aruba.jpg',
      },
      {
        id: 'fresh-island-salad',
        name: 'Fresh Island Salad',
        description:
          'Mix de hojas verdes, aguacate, mango, nueces caramelizadas, queso feta y vinagreta de maracuyá.',
        price: 17,
        tags: ['Salad', 'Fresh', 'Vegetarian'],
        image: '/images/plates/fresh-island-salad.jpg',
      },
      {
        id: 'signature-entree',
        name: 'Signature Entrée',
        description:
          'Plato insignia del chef: filete de pescado fresco en salsa de mantequilla dorada con vegetales de temporada y puré de batata.',
        price: 34,
        tags: ['Chef Favorite', 'Signature', 'Fine Dining'],
        image: '/images/plates/signature-entree.jpg',
      },
    ],
  },
  {
    id: 'culinary',
    name: 'Specialty Culinary Offerings',
    shortLabel: 'CULINARY',
    image: '/images/plates/sushi-platter.jpg',
    items: [
      {
        id: 'handcrafted-sushi',
        name: 'Handcrafted Sushi',
        description:
          'Selección de nigiri y sashimi elaborados con pescado fresco del día, arroz sazonado y wasabi natural.',
        price: 26,
        tags: ['Sushi', 'Raw', 'Artisan'],
        image: '/images/plates/handcrafted-sushi.jpg',
      },
      {
        id: 'sunset-sushi-roll',
        name: 'Sunset Sushi Roll',
        description:
          'Roll especial del horizonte con atún picante, aguacate, mango, tobiko y un toque de sriracha-mayonesa.',
        price: 24,
        tags: ['Signature Roll', 'Spicy', 'Mango'],
        image: '/images/plates/sushi-platter.jpg',
      },
      {
        id: 'vegan-poke-bowl',
        name: 'Vegan Poke Bowl',
        description:
          'Bowl vegano con quinoa, tofu marinado, edamame, aguacate, pepino, zanahoria y aderezo de sésamo.',
        price: 21,
        tags: ['Vegan', 'Healthy', 'Bowl'],
        image: '/images/gallery/07.jpg',
      },
      {
        id: 'vegetarian-tasting',
        name: 'Vegetarian Tasting',
        description:
          'Selección de cuatro preparaciones vegetarianas que celebran los vegetales locales de Aruba.',
        price: 29,
        tags: ['Vegetarian', 'Tasting', 'Local'],
        image: '/images/plates/vegetarian-tasting.jpg',
      },
      {
        id: 'gluten-free-seafood',
        name: 'Gluten-free Seafood',
        description:
          'Mariscos a la plancha con vegetales frescos, hierbas aromáticas y aceite de oliva. Sin gluten, sin concesiones.',
        price: 32,
        tags: ['Gluten-free', 'Seafood', 'Grilled'],
        image: '/images/plates/gluten-free-seafood.jpg',
      },
    ],
  },
];
