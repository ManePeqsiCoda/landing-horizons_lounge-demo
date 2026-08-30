/**
 * Menu data — Horizons Lounge Aruba.
 * Images: local photography in /public/images/plates and /public/images/gallery
 * so everything loads without external services.
 */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Price in USD. */
  price: number;
  tags: string[];
  featured?: boolean;
  image: string;
}

export interface PlateSubcategory {
  id: string;
  name: string;
  /** Short label for the vertical card. */
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
      'Exclusive creations from our bar team, inspired by the palette of the Aruban sunset: bright citrus, aged rums and sparkling touches that capture the spirit of the Sunset Ritual.',
    price: 19,
    tags: ['Horizons Exclusive', 'Sunset Ritual', 'House Favorite'],
    image: '/images/drinks/signature-cocktail.jpg',
  },
  {
    id: 'tropical-mixology',
    name: 'Tropical Mixology',
    featured: true,
    description:
      'Contemporary techniques applied to island fruits — roasted pineapple, fresh coconut, passion fruit and tamarind — for a menu that smells and tastes like the Caribbean in every sip.',
    price: 18,
    tags: ['Island Fruits', 'Craft', 'Tropical'],
    image: '/images/drinks/tropical-mixology.jpg',
  },
  {
    id: 'margaritas',
    name: 'Margaritas',
    featured: true,
    description:
      'Selected tequilas and mezcals, freshly squeezed citrus and a sea-salt rim that evokes the Eagle Beach breeze. Classic, fruit-forward, or with a smoked-agave twist.',
    price: 17,
    tags: ['Tequila', 'Smoked Salt', 'Citrus Forward'],
    image: '/images/drinks/margarita.jpg',
  },
  {
    id: 'mojitos',
    name: 'Mojitos',
    featured: true,
    description:
      'Premium rum, local hierbabuena mint, lime and cane sugar over crushed ice. Refreshing, aromatic, and perfect for midday under the Aruba sun.',
    price: 16,
    tags: ['Rum', 'Mint', 'Poolside'],
    image: '/images/drinks/mojito.jpg',
  },
  {
    id: 'espresso-martinis',
    name: 'Espresso Martinis',
    featured: true,
    description:
      'The nighttime classic reinterpreted with freshly pulled Aruban espresso, premium vodka and a delicate coffee liqueur. The energy you need before dinner or the party.',
    price: 18,
    tags: ['Coffee', 'After Dinner', 'Nightcap'],
    image: '/images/drinks/espresso-martini.jpg',
  },
  {
    id: 'tropical-old-fashioneds',
    name: 'Tropical Old Fashioneds',
    featured: true,
    description:
      'Whisky infused with Caribbean spices, aromatic bitters, a touch of local honey and a flamed orange peel. Timeless elegance with a tropical soul.',
    price: 19,
    tags: ['Whisky', 'Spiced', 'Smoked'],
    image: '/images/drinks/tropical-old-fashioned.jpg',
  },
  {
    id: 'twice-daily-happy-hour',
    name: 'Twice-daily Happy Hour',
    featured: true,
    description:
      'Two moments a day to toast: sunset and late night. A selection of cocktails, wines and craft beers at special prices — because the ritual deserves an encore.',
    price: 12,
    tags: ['Sunset', 'Late Night', 'Value'],
    image: '/images/drinks/happy-hour.jpg',
  },
];

/** PLATES subcategories with their items. */
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
          'Hand-cut fresh tuna, avocado, cucumber, toasted sesame and a citrus touch of yuzu. Light, fresh and elegant.',
        price: 21,
        tags: ['Raw', 'Fresh', 'Sharing'],
        image: '/images/gallery/07.jpg',
      },
      {
        id: 'crispy-calamari',
        name: 'Crispy Calamari',
        description:
          'Golden, crispy calamari served with roasted-garlic aioli and lemon. A coastal classic with a Caribbean twist.',
        price: 18,
        tags: ['Crispy', 'Seafood', 'Shareable'],
        image: '/images/plates/crispy-calamari.jpg',
      },
      {
        id: 'tropical-ceviche',
        name: 'Tropical Ceviche',
        description:
          'Catch of the day marinated in lime, leche de tigre, mango, serrano chile and cilantro. Tropical freshness in every bite.',
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
          'Thin, crispy crust with local goat cheese, confit cherry tomatoes, basil and a balsamic reduction.',
        price: 22,
        tags: ['Flatbread', 'Vegetarian', 'Sharing'],
        image: '/images/plates/aruba-flatbread.jpg',
      },
      {
        id: 'eagle-beach-burger',
        name: 'Eagle Beach Burger',
        description:
          'Premium beef, aged cheddar, caramelized onion, tomato, lettuce and secret sauce on a toasted brioche bun.',
        price: 24,
        tags: ['Gourmet', 'Burger', 'Comfort'],
        image: '/images/plates/eagle-beach-burger.jpg',
      },
      {
        id: 'caribbean-tacos',
        name: 'Caribbean Tacos',
        description:
          'Three crispy fish or jerk chicken tacos with cabbage, spicy pineapple salsa and cilantro. Island flavors.',
        price: 20,
        tags: ['Tacos', 'Spicy', 'Street Food'],
        image: '/images/plates/caribbean-tacos.jpg',
      },
      {
        id: 'loaded-nachos',
        name: 'Loaded Nachos',
        description:
          'Tortilla chips layered with melted cheese, jalapeños, beans, guacamole, pico de gallo and sour cream. Made for sharing.',
        price: 19,
        tags: ['Nachos', 'Sharing', 'Cheesy'],
        image: '/images/gallery/05.jpg',
      },
      {
        id: 'coconut-shrimp',
        name: 'Coconut Shrimp',
        description:
          'Shrimp breaded in toasted coconut, served with a mango-chile sauce. Crispy, sweet and tropical.',
        price: 23,
        tags: ['Shrimp', 'Crispy', 'Tropical'],
        image: '/images/plates/coconut-shrimp.jpg',
      },
      {
        id: 'tuna-nachos',
        name: 'Tuna Nachos',
        description:
          'Crispy wontons topped with fresh tuna, avocado, sriracha-mayo and scallions.',
        price: 25,
        tags: ['Tuna', 'Wonton', 'Premium'],
        image: '/images/gallery/05.jpg',
      },
      {
        id: 'pasta-aruba',
        name: 'Pasta Aruba',
        description:
          'Fresh pasta with prawns, cherry tomatoes, garlic, white wine and a touch of chile. Mediterranean elegance with an ocean view.',
        price: 28,
        tags: ['Pasta', 'Seafood', 'Mediterranean'],
        image: '/images/plates/pasta-aruba.jpg',
      },
      {
        id: 'fresh-island-salad',
        name: 'Fresh Island Salad',
        description:
          'Mixed greens, avocado, mango, candied nuts, feta and a passion-fruit vinaigrette.',
        price: 17,
        tags: ['Salad', 'Fresh', 'Vegetarian'],
        image: '/images/plates/fresh-island-salad.jpg',
      },
      {
        id: 'signature-entree',
        name: 'Signature Entrée',
        description:
          "The chef's flagship dish: fresh fish fillet in golden butter sauce with seasonal vegetables and sweet-potato purée.",
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
          "A selection of nigiri and sashimi made with the day's freshest catch, seasoned rice and natural wasabi.",
        price: 26,
        tags: ['Sushi', 'Raw', 'Artisan'],
        image: '/images/plates/handcrafted-sushi.jpg',
      },
      {
        id: 'sunset-sushi-roll',
        name: 'Sunset Sushi Roll',
        description:
          "The horizon's special roll with spicy tuna, avocado, mango, tobiko and a touch of sriracha-mayo.",
        price: 24,
        tags: ['Signature Roll', 'Spicy', 'Mango'],
        image: '/images/plates/sushi-platter.jpg',
      },
      {
        id: 'vegan-poke-bowl',
        name: 'Vegan Poke Bowl',
        description:
          'Vegan bowl with quinoa, marinated tofu, edamame, avocado, cucumber, carrot and sesame dressing.',
        price: 21,
        tags: ['Vegan', 'Healthy', 'Bowl'],
        image: '/images/gallery/07.jpg',
      },
      {
        id: 'vegetarian-tasting',
        name: 'Vegetarian Tasting',
        description:
          'A selection of four vegetarian preparations celebrating Aruba’s local produce.',
        price: 29,
        tags: ['Vegetarian', 'Tasting', 'Local'],
        image: '/images/plates/vegetarian-tasting.jpg',
      },
      {
        id: 'gluten-free-seafood',
        name: 'Gluten-free Seafood',
        description:
          'Grilled seafood with fresh vegetables, aromatic herbs and olive oil. Gluten-free, no compromises.',
        price: 32,
        tags: ['Gluten-free', 'Seafood', 'Grilled'],
        image: '/images/plates/gluten-free-seafood.jpg',
      },
    ],
  },
];
