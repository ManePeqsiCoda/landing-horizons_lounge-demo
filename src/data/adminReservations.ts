/**
 * Reservas de ejemplo para el panel de administración.
 * Datos en memoria, sin persistencia.
 */

export type ReservationStatus = 'confirmed' | 'pending' | 'cancelled';

export interface AdminReservation {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  eventId: string;
  eventLabel: string;
  status: ReservationStatus;
  notes: string;
  tableId?: string;
  deposit: number;
}

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  cancelled: 'Cancelled',
};

function todayISO(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().split('T')[0];
}

function addDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().split('T')[0];
}

export const ADMIN_RESERVATIONS: AdminReservation[] = [
  {
    id: 'r-1001',
    fullName: 'María González',
    email: 'maria.g@example.com',
    phone: '+297 562 3412',
    date: todayISO(),
    time: '18:00',
    guests: 2,
    eventId: 'sunset-ritual',
    eventLabel: 'The Sunset Ritual',
    status: 'confirmed',
    notes: 'Aniversario, prefieren mesa con vista al mar.',
    tableId: 't-01',
    deposit: 25,
  },
  {
    id: 'r-1002',
    fullName: 'John & Sarah Miller',
    email: 'js.miller@example.com',
    phone: '+297 593 8821',
    date: todayISO(),
    time: '19:30',
    guests: 4,
    eventId: 'managers-cocktail-party',
    eventLabel: "Manager's Cocktail Party",
    status: 'confirmed',
    notes: 'Alergia a frutos secos.',
    tableId: 't-02',
    deposit: 50,
  },
  {
    id: 'r-1003',
    fullName: 'Familia De Windt',
    email: 'dewindt@example.com',
    phone: '+297 580 1144',
    date: todayISO(),
    time: '20:00',
    guests: 4,
    eventId: 'regular-rooftop-dining',
    eventLabel: 'Regular Rooftop Dining',
    status: 'confirmed',
    notes: 'Celebración de cumpleaños; traerán pastel.',
    tableId: 't-04',
    deposit: 50,
  },
  {
    id: 'r-1004',
    fullName: 'Vanessa Bloom',
    email: 'vanessa.bloom@example.com',
    phone: '+297 555 0099',
    date: todayISO(),
    time: '18:30',
    guests: 2,
    eventId: 'fajita-fridays',
    eventLabel: 'Fajita Fridays',
    status: 'confirmed',
    notes: 'Cliente frecuente; preferencia por barra.',
    tableId: 't-07',
    deposit: 25,
  },
  {
    id: 'r-1005',
    fullName: 'Cumpleaños Rivera',
    email: 'rivera.party@example.com',
    phone: '+297 566 7788',
    date: todayISO(),
    time: '19:00',
    guests: 8,
    eventId: 'regular-rooftop-dining',
    eventLabel: 'Regular Rooftop Dining',
    status: 'confirmed',
    notes: 'Mesa grande, decoración sutil solicitada.',
    tableId: 't-06',
    deposit: 100,
  },
  {
    id: 'r-1006',
    fullName: 'Duo Acoustic',
    email: 'duo.acoustic@example.com',
    phone: '+297 577 3322',
    date: todayISO(),
    time: '20:30',
    guests: 2,
    eventId: 'live-jazz-night',
    eventLabel: 'Live Jazz Night',
    status: 'confirmed',
    notes: 'Artistas invitados; cena antes del set.',
    tableId: 't-11',
    deposit: 25,
  },
  {
    id: 'r-1007',
    fullName: 'Honeymooners Chen',
    email: 'chen.honey@example.com',
    phone: '+297 590 2233',
    date: addDays(2),
    time: '18:00',
    guests: 4,
    eventId: 'sunset-ritual',
    eventLabel: 'The Sunset Ritual',
    status: 'confirmed',
    notes: 'Luna de miel, postre de cortesía.',
    tableId: 't-09',
    deposit: 50,
  },
  {
    id: 'r-1008',
    fullName: 'Robert Kane',
    email: 'rkane@example.com',
    phone: '+297 584 6677',
    date: addDays(3),
    time: '19:00',
    guests: 6,
    eventId: 'fajita-fridays',
    eventLabel: 'Fajita Fridays',
    status: 'pending',
    notes: 'Pendiente de confirmación de depósito.',
    deposit: 0,
  },
  {
    id: 'r-1009',
    fullName: 'Sophie Laurent',
    email: 'sophie.l@example.com',
    phone: '+297 591 4455',
    date: addDays(5),
    time: '20:00',
    guests: 2,
    eventId: 'managers-cocktail-party',
    eventLabel: "Manager's Cocktail Party",
    status: 'cancelled',
    notes: 'Canceló por cambio de vuelo.',
    tableId: 't-05',
    deposit: 0,
  },
  {
    id: 'r-1010',
    fullName: 'Andrés & Camila',
    email: 'andres.camila@example.com',
    phone: '+297 588 9900',
    date: addDays(7),
    time: '18:30',
    guests: 2,
    eventId: 'sunset-ritual',
    eventLabel: 'The Sunset Ritual',
    status: 'confirmed',
    notes: 'Piden menú vegetariano.',
    deposit: 25,
  },
];
