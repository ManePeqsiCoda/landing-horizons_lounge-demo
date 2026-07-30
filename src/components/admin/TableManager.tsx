/**
 * Gestor de mesas del panel admin.
 * Muestra capacidad, mesas libres/ocupadas/reservadas y filtro por número de personas.
 */

import { useMemo, useState } from 'react';
import {
  getCapacitySummary,
  TABLE_LOCATIONS,
  TABLE_STATUS_LABELS,
  type Table,
  type TableStatus,
} from '../../data/tables';
import { Armchair, Users } from 'lucide-react';

interface TableManagerProps {
  tables: Table[];
  onUpdate: (updated: Table[]) => void;
}

const STATUS_STYLES: Record<TableStatus, string> = {
  free: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  occupied: 'border-red-500/30 bg-red-500/10 text-red-400',
  reserved: 'border-sunset-yellow/30 bg-sunset-yellow/10 text-sunset-yellow',
};

const STATUS_ORDER: TableStatus[] = ['free', 'reserved', 'occupied'];

export default function TableManager({ tables, onUpdate }: TableManagerProps) {
  const [guestFilter, setGuestFilter] = useState<number | 'all'>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');

  const capacity = useMemo(() => getCapacitySummary(tables), [tables]);

  const filteredTables = useMemo(() => {
    return tables.filter((t) => {
      const matchesGuests = guestFilter === 'all' || t.capacity === guestFilter;
      const matchesLocation = locationFilter === 'all' || t.location === locationFilter;
      return matchesGuests && matchesLocation;
    });
  }, [tables, guestFilter, locationFilter]);

  const cycleStatus = (id: string) => {
    onUpdate(
      tables.map((t) => {
        if (t.id !== id) return t;
        const nextIndex = (STATUS_ORDER.indexOf(t.status) + 1) % STATUS_ORDER.length;
        return { ...t, status: STATUS_ORDER[nextIndex] };
      })
    );
  };

  const guestOptions = useMemo(() => {
    const capacities = Array.from(new Set(tables.map((t) => t.capacity))).sort((a, b) => a - b);
    return capacities;
  }, [tables]);

  return (
    <div className="space-y-6">
      {/* Capacity summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-neutral-800 bg-neutral-900/50 p-5">
          <p className="text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
            Total chairs
          </p>
          <p className="mt-3 font-serif text-3xl text-white">{capacity.totalChairs}</p>
        </div>
        <div className="border border-neutral-800 bg-neutral-900/50 p-5">
          <p className="text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
            Chairs used
          </p>
          <p className="mt-3 font-serif text-3xl text-sunset-coral">{capacity.usedChairs}</p>
          <p className="mt-1 text-[11px] text-neutral-400">{capacity.occupiedTables} occupied + {capacity.reservedTables} reserved</p>
        </div>
        <div className="border border-neutral-800 bg-neutral-900/50 p-5">
          <p className="text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
            Free chairs
          </p>
          <p className="mt-3 font-serif text-3xl text-emerald-400">{capacity.freeChairs}</p>
          <p className="mt-1 text-[11px] text-neutral-400">Across {capacity.freeTables} tables</p>
        </div>
        <div className="border border-neutral-800 bg-neutral-900/50 p-5">
          <p className="text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
            Free tables
          </p>
          <p className="mt-3 font-serif text-3xl text-sunset-yellow">{capacity.freeTables}</p>
          <p className="mt-1 text-[11px] text-neutral-400">of {capacity.totalTables} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Users size={16} strokeWidth={1.5} className="text-neutral-500" />
        <select
          value={guestFilter}
          onChange={(e) => setGuestFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-sunset-yellow"
        >
          <option value="all">All capacities</option>
          {guestOptions.map((c) => (
            <option key={c} value={c}>
              {c} people
            </option>
          ))}
        </select>

        <Armchair size={16} strokeWidth={1.5} className="ml-2 text-neutral-500" />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-sunset-yellow"
        >
          <option value="all">All locations</option>
          {Object.entries(TABLE_LOCATIONS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Table grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTables.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => cycleStatus(t.id)}
            className="group relative border border-neutral-800 bg-neutral-900/30 p-5 text-left transition hover:border-neutral-700"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-medium tracking-[0.2em] text-neutral-500 uppercase">
                  {TABLE_LOCATIONS[t.location]}
                </p>
                <h4 className="mt-1 font-serif text-xl text-white">{t.name}</h4>
              </div>
              <span className="font-serif text-2xl text-white">{t.capacity}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span
                className={`border px-2 py-1 text-[10px] font-medium tracking-[0.1em] uppercase ${STATUS_STYLES[t.status]}`}
              >
                {TABLE_STATUS_LABELS[t.status]}
              </span>
              {t.reservationName && t.status !== 'free' && (
                <span className="truncate pl-2 text-[11px] text-neutral-400">{t.reservationName}</span>
              )}
            </div>

            <p className="mt-4 text-[10px] tracking-[0.15em] text-neutral-600 uppercase">
              Click to cycle status
            </p>
          </button>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="border border-neutral-800 py-12 text-center">
          <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase">No tables match</p>
        </div>
      )}
    </div>
  );
}
