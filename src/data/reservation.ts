export const RESERVATION_EMAIL = 'reservations@horizonsaruba.com';
export const DEPOSIT_AMOUNT = 25;
export const DEPOSIT_CURRENCY = 'USD';

export interface ReservationEvent {
  id: string;
  label: string;
}

export const RESERVATION_EVENTS: ReservationEvent[] = [
  { id: 'sunset-ritual', label: 'The Sunset Ritual' },
  { id: 'managers-cocktail-party', label: "Manager's Cocktail Party" },
  { id: 'fajita-fridays', label: 'Fajita Fridays' },
  { id: 'rooftop-dining', label: 'Regular Rooftop Dining' },
];

export const TIME_SLOTS = [
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
];

export const MIN_GUESTS = 1;
export const MAX_GUESTS = 12;

export interface ReservationFormData {
  eventId: string;
  date: string;
  time: string;
  guests: number;
  fullName: string;
  email: string;
  phone: string;
  notes: string;
}

export const STRIPE_PUBLISHABLE_KEY_ENV = 'PUBLIC_STRIPE_PUBLISHABLE_KEY';
