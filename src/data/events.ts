import { RESERVE_PATH } from './contact';

export interface EventItem {
  id: string;
  image: string;
  imageAlt: string;
  kicker: string;
  title: string;
  description: string;
  details: string[];
  /** The dominant line of the date badge (e.g. "31" or "SUNSET"). */
  date: string;
  /** The smaller uppercase line above the date (e.g. "FRIDAY" or "EVERY"). */
  dateKicker: string;
  cta: string;
  ctaHref: string;
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
  },
];
