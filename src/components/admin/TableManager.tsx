/**
 * Gestor de mesas del panel admin.
 * Muestra capacidad, mesas libres/ocupadas/reservadas y filtro por número de personas.
 * Estilo Liquid Glass.
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

const STATUS_CLASSES: Record<TableStatus, string> = {
  free: 'glass-status-free',
  occupied: 'glass-status-occupied',
  reserved: 'glass-status-reserved',
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
        <div className="glass-panel p-5">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
            Total chairs
          </p>
          <p className="mt-3 font-serif text-3xl text-slate-900">{capacity.totalChairs}</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
            Chairs used
          </p>
          <p className="mt-3 font-serif text-3xl text-sunset-coral">{capacity.usedChairs}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-600">{capacity.occupiedTables} occupied + {capacity.reservedTables} reserved</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
            Free chairs
          </p>
          <p className="mt-3 font-serif text-3xl text-emerald-700">{capacity.freeChairs}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-600">Across {capacity.freeTables} tables</p>
        </div>
        <div className="glass-panel p-5">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
            Free tables
          </p>
          <p className="mt-3 font-serif text-3xl text-sunset-orange">{capacity.freeTables}</p>
          <p className="mt-1 text-[11px] font-medium text-slate-600">of {capacity.totalTables} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Users size={16} strokeWidth={1.5} className="text-slate-500" />
        <select
          value={guestFilter}
          onChange={(e) => setGuestFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="glass-select px-4 py-3 text-sm"
        >
          <option value="all">All capacities</option>
          {guestOptions.map((c) => (
            <option key={c} value={c}>
              {c} people
            </option>
          ))}
        </select>

        <Armchair size={16} strokeWidth={1.5} className="ml-2 text-slate-500" />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="glass-select px-4 py-3 text-sm"
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
            className="glass-panel group p-5 text-left transition hover:-translate-y-0.5 hover:bg-white/70"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  {TABLE_LOCATIONS[t.location]}
                </p>
                <h4 className="mt-1 font-serif text-xl text-slate-900">{t.name}</h4>
              </div>
              <span className="font-serif text-2xl text-slate-900">{t.capacity}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`glass-status ${STATUS_CLASSES[t.status]}`}>
                {TABLE_STATUS_LABELS[t.status]}
              </span>
              {t.reservationName && t.status !== 'free' && (
                <span className="truncate pl-2 text-[11px] font-medium text-slate-600">{t.reservationName}</span>
              )}
            </div>

            <p className="mt-4 text-[10px] font-semibold tracking-[0.15em] text-slate-500 uppercase">
              Click to cycle status
            </p>
          </button>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="glass-panel py-12 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">No tables match</p>
        </div>
      )}
    </div>
  );
}
