/**
 * Datos mock de mesas — Horizons Lounge Aruba.
 * Solo para el panel de administración; sin persistencia real.
 */

export type TableStatus = 'free' | 'occupied' | 'reserved';
export type TableLocation = 'terrace' | 'lounge' | 'bar' | 'deck';

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  location: TableLocation;
  reservationName?: string;
}

export const TABLES: Table[] = [
  { id: 't-01', name: 'Sunset Deck 1', capacity: 2, status: 'occupied', location: 'deck', reservationName: 'María González' },
  { id: 't-02', name: 'Sunset Deck 2', capacity: 4, status: 'reserved', location: 'deck', reservationName: 'John & Sarah' },
  { id: 't-03', name: 'Sunset Deck 3', capacity: 6, status: 'free', location: 'deck' },
  { id: 't-04', name: 'Lounge 4', capacity: 4, status: 'occupied', location: 'lounge', reservationName: 'Familia De Windt' },
  { id: 't-05', name: 'Lounge 5', capacity: 2, status: 'free', location: 'lounge' },
  { id: 't-06', name: 'Lounge 6', capacity: 8, status: 'occupied', location: 'lounge', reservationName: 'Cumpleaños Rivera' },
  { id: 't-07', name: 'Bar 7', capacity: 2, status: 'occupied', location: 'bar', reservationName: 'Vanessa Bloom' },
  { id: 't-08', name: 'Bar 8', capacity: 2, status: 'free', location: 'bar' },
  { id: 't-09', name: 'Terrace 9', capacity: 4, status: 'reserved', location: 'terrace', reservationName: 'Honeymooners' },
  { id: 't-10', name: 'Terrace 10', capacity: 4, status: 'free', location: 'terrace' },
  { id: 't-11', name: 'Terrace 11', capacity: 2, status: 'occupied', location: 'terrace', reservationName: 'Duo Acoustic' },
  { id: 't-12', name: 'Terrace 12', capacity: 6, status: 'free', location: 'terrace' },
];

export const TABLE_LOCATIONS: Record<TableLocation, string> = {
  terrace: 'Terrace',
  lounge: 'Lounge',
  bar: 'Bar',
  deck: 'Sunset Deck',
};

export const TABLE_STATUS_LABELS: Record<TableStatus, string> = {
  free: 'Free',
  occupied: 'Occupied',
  reserved: 'Reserved',
};

export function getCapacitySummary(tables: Table[]) {
  const totalChairs = tables.reduce((sum, t) => sum + t.capacity, 0);
  const occupiedChairs = tables
    .filter((t) => t.status === 'occupied')
    .reduce((sum, t) => sum + t.capacity, 0);
  const reservedChairs = tables
    .filter((t) => t.status === 'reserved')
    .reduce((sum, t) => sum + t.capacity, 0);
  const usedChairs = occupiedChairs + reservedChairs;
  const freeChairs = totalChairs - usedChairs;
  const freeTables = tables.filter((t) => t.status === 'free').length;
  const occupiedTables = tables.filter((t) => t.status === 'occupied').length;
  const reservedTables = tables.filter((t) => t.status === 'reserved').length;

  return {
    totalChairs,
    usedChairs,
    freeChairs,
    totalTables: tables.length,
    freeTables,
    occupiedTables,
    reservedTables,
  };
}
