/**
 * Gestor de mesas del panel admin.
 * Resumen de capacidad y tarjetas de mesas con números claros y estados identificables.
 */

import { useMemo, useState } from 'react';
import {
  getCapacitySummary,
  TABLE_LOCATIONS,
  TABLE_STATUS_LABELS,
  type Table,
  type TableStatus,
} from '../../data/tables';
import { Armchair, Users, RotateCcw } from 'lucide-react';

interface TableManagerProps {
  tables: Table[];
  onUpdate: (updated: Table[]) => void;
}

const STATUS_CLASSES: Record<TableStatus, string> = {
  free: 'admin-status-free',
  occupied: 'admin-status-occupied',
  reserved: 'admin-status-reserved',
};

const STATUS_ORDER: TableStatus[] = ['free', 'reserved', 'occupied'];

const STATUS_DOT: Record<TableStatus, string> = {
  free: 'bg-[var(--admin-confirm)]',
  occupied: 'bg-[var(--admin-cancel)]',
  reserved: 'bg-[var(--admin-pending)]',
};

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
        <div className="admin-stat-card p-5">
          <p className="admin-stat-label">Total chairs</p>
          <p className="admin-stat-value mt-3">{capacity.totalChairs}</p>
          <p className="admin-stat-sub">{capacity.totalTables} tables</p>
        </div>
        <div className="admin-stat-card p-5">
          <p className="admin-stat-label">Chairs used</p>
          <p className="admin-stat-value mt-3 text-[var(--admin-cancel)]">{capacity.usedChairs}</p>
          <p className="admin-stat-sub">
            {capacity.occupiedTables} occupied + {capacity.reservedTables} reserved
          </p>
        </div>
        <div className="admin-stat-card p-5">
          <p className="admin-stat-label">Free chairs</p>
          <p className="admin-stat-value mt-3 text-[var(--admin-confirm)]">{capacity.freeChairs}</p>
          <p className="admin-stat-sub">Across {capacity.freeTables} tables</p>
        </div>
        <div className="admin-stat-card p-5">
          <p className="admin-stat-label">Free tables</p>
          <p className="admin-stat-value mt-3 text-[var(--admin-accent)]">{capacity.freeTables}</p>
          <p className="admin-stat-sub">of {capacity.totalTables} total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Users size={18} strokeWidth={1.5} className="text-[var(--admin-subtle)]" />
        <select
          value={guestFilter}
          onChange={(e) => setGuestFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="admin-select"
        >
          <option value="all">All capacities</option>
          {guestOptions.map((c) => (
            <option key={c} value={c}>
              {c} people
            </option>
          ))}
        </select>

        <Armchair size={18} strokeWidth={1.5} className="ml-2 text-[var(--admin-subtle)]" />
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="admin-select"
        >
          <option value="all">All locations</option>
          {Object.entries(TABLE_LOCATIONS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex items-center gap-2 text-sm font-medium text-[var(--admin-subtle)]">
          <RotateCcw size={16} strokeWidth={1.5} />
          <span>Click a card to cycle status</span>
        </div>
      </div>

      {/* Table grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTables.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => cycleStatus(t.id)}
            className="admin-table-card group"
          >
            <div className="flex items-start justify-between">
              <div className="text-left">
                <p className="admin-card-sub">{TABLE_LOCATIONS[t.location]}</p>
                <h4 className="admin-card-header mt-1 text-xl">{t.name}</h4>
              </div>
              <div className="admin-table-capacity">
                {t.capacity}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className={`admin-status ${STATUS_CLASSES[t.status]}`}>
                <span className={`h-2 w-2 rounded-full ${STATUS_DOT[t.status]}`} />
                {TABLE_STATUS_LABELS[t.status]}
              </span>
              {t.reservationName && t.status !== 'free' && (
                <span className="truncate pl-2 text-sm font-medium text-[var(--admin-muted)]">
                  {t.reservationName}
                </span>
              )}
            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[var(--admin-subtle)]">
              Click to cycle status
            </p>
          </button>
        ))}
      </div>

      {filteredTables.length === 0 && (
        <div className="admin-card py-12 text-center">
          <p className="admin-empty">No tables match</p>
        </div>
      )}
    </div>
  );
}
