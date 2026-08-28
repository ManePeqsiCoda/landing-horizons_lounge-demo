import { RESERVE_PATH } from './contact';

export interface EventItem {
  id: string;
  image: string;
  imageAlt: string;
  kicker: string;
  title: string;
  description: string;
  details: string[];
  date: string;
  dateKicker: string;
  cta: string;
  ctaHref: string;
  /** Layout topology for scrolltelling */
  layout?: 'media-right' | 'media-left' | 'immersive';
}

export const EVENTS: EventItem[] = [
  {
    id: 'sunset-ritual',
    image: '/images/drinks/tropical-mixology.jpg',
    imageAlt:
      'Golden-hour cocktail service against the backdrop of Eagle Beach and the iconic Fofoti trees.',
    kicker: 'Daily at Dusk',
    title: 'The Sunset Ritual',
    description:
      'Every evening, the Fofoti trees catch the last light and the lounge slows into its daily rhythm. This is the moment to take the first sip of an Eagle Beach Sunset — a ritual of color, breeze, and clinking glasses shared with strangers who feel like friends by sunset.',
    details: ['Daily · 6:00 PM', 'Eagle Beach View', 'Signature Cocktails'],
    date: 'SUNSET',
    dateKicker: 'EVERY',
    cta: 'Reserve a Spot',
    ctaHref: `${RESERVE_PATH}?event=sunset-ritual`,
    layout: 'media-right',
  },
  {
    id: 'managers-cocktail-party',
    image: '/images/drinks/signature-cocktail.jpg',
    imageAlt:
      'A vibrant Hibiscus Margarita being served during golden hour, surrounded by warm social energy.',
    kicker: 'Live Music & Conversation',
    title: "Manager's Cocktail Party",
    description:
      'An open-air evening where the playlist is live, the conversation flows, and the Manager’s select cocktails move from tray to hand. It is the Social Vibe of Horizons at its brightest — smart, relaxed, and unmistakably Aruba.',
    details: ['Live Acoustic Set', 'Curated Cocktails', 'Social Vibe'],
    date: '24',
    dateKicker: 'FRIDAY',
    cta: 'Join the Party',
    ctaHref: `${RESERVE_PATH}?event=managers-cocktail-party`,
    layout: 'immersive',
  },
  {
    id: 'fajita-fridays',
    image: '/images/drinks/happy-hour.jpg',
    imageAlt:
      'Hands sharing a colorful platter of nachos and drinks during a casual weekend gathering at the lounge.',
    kicker: 'All-You-Can-Eat Weekend Kickoff',
    title: 'Fajita Fridays',
    description:
      'The week ends with sizzling platters, house margaritas, and the kind of laid-back laughter that fills the terrace. Fajita Fridays are the casual start to the weekend — generous, flavorful, and made for sharing.',
    details: ['All-You-Can-Eat Fajitas', 'Weekend Specials', 'Group Tables'],
    date: '31',
    dateKicker: 'FRIDAY',
    cta: 'Book a Table',
    ctaHref: `${RESERVE_PATH}?event=fajita-fridays`,
    layout: 'media-left',
  },
];

/**
 * High-quality Unsplash stills for the experiences gallery carousel.
 * Queried for beach sunset, tropical cocktails, live terrace energy, and shared dining.
 */
export interface CarouselSlide {
  src: string;
  alt: string;
  credit: string;
  /** Headline shown while this slide is active */
  title: string;
  /** Short line that matches what the photo shows */
  caption: string;
}

export const EVENT_CAROUSEL: CarouselSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=85',
    alt: 'Golden tropical beach and turquoise water at sunset',
    credit: 'Unsplash',
    title: 'Eagle Beach at gold hour',
    caption: 'Turquoise water, soft sand, and the last light spilling across the shore.',
  },
  {
    src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1800&q=85',
    alt: 'Cocktail with citrus garnish on a bar at dusk',
    credit: 'Unsplash',
    title: 'First pour of the evening',
    caption: 'Citrus, ice, and a glass catching the dusk — the ritual begins at the bar.',
  },
  {
    src: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=1800&q=85',
    alt: 'Palm silhouettes against a Caribbean sunset sky',
    credit: 'Unsplash',
    title: 'Palms against the sky',
    caption: 'Silhouettes of fronds holding a Caribbean sunset in place.',
  },
  {
    src: 'https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?auto=format&fit=crop&w=1800&q=85',
    alt: 'Friends toasting colorful cocktails at a lively gathering',
    credit: 'Unsplash',
    title: 'Glasses raised together',
    caption: 'Colorful cocktails meeting mid-air — the Social Vibe in one toast.',
  },
  {
    src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85',
    alt: 'Fine dining plates and wine glasses on a candlelit table',
    credit: 'Unsplash',
    title: 'A table set for nightfall',
    caption: 'Plates, wine, and candlelight — dinner when the horizon turns indigo.',
  },
  {
    src: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1800&q=85',
    alt: 'Live music performance under warm stage lights',
    credit: 'Unsplash',
    title: 'Live under warm lights',
    caption: 'A set that fills the terrace — sound, glow, and bodies leaning in.',
  },
  {
    src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1800&q=85',
    alt: 'Shared Mexican-inspired feast with tortillas and salsas',
    credit: 'Unsplash',
    title: 'Shared, sizzling, generous',
    caption: 'Tortillas, salsa, and platters made for passing down the table — Fajita Friday energy.',
  },
  {
    src: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1800&q=85',
    alt: 'Champagne flutes raised in a celebratory toast',
    credit: 'Unsplash',
    title: 'A toast to the night',
    caption: 'Champagne catching the light as the evening tips into celebration.',
  },
];
