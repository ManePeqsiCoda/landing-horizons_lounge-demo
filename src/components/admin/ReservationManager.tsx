/**
 * Gestor de reservas del panel admin.
 * Permite filtrar por fecha, evento y estado; ver detalles; cambiar estado localmente.
 */

import { useMemo, useState } from 'react';
import {
  RESERVATION_STATUS_LABELS,
  type AdminReservation,
  type ReservationStatus,
} from '../../data/adminReservations';
import { Search, Filter } from 'lucide-react';

interface ReservationManagerProps {
  reservations: AdminReservation[];
  onUpdate: (updated: AdminReservation[]) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

const STATUS_STYLES: Record<ReservationStatus, string> = {
  confirmed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
  pending: 'border-sunset-yellow/30 bg-sunset-yellow/10 text-sunset-yellow',
  cancelled: 'border-red-500/30 bg-red-500/10 text-red-400',
};

export default function ReservationManager({ reservations, onUpdate }: ReservationManagerProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | 'all'>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const events = useMemo(() => {
    const unique = Array.from(new Map(reservations.map((r) => [r.eventId, r.eventLabel])).entries());
    return [{ id: 'all', label: 'All experiences' }, ...unique.map(([id, label]) => ({ id, label }))];
  }, [reservations]);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        r.fullName.toLowerCase().includes(search.toLowerCase()) ||
        r.email.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesEvent = eventFilter === 'all' || r.eventId === eventFilter;
      return matchesSearch && matchesStatus && matchesEvent;
    });
  }, [reservations, search, statusFilter, eventFilter]);

  const updateStatus = (id: string, status: ReservationStatus) => {
    onUpdate(reservations.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const selected = reservations.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            strokeWidth={1.5}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or ID"
            className="w-full border border-neutral-800 bg-neutral-900/50 py-3 pl-11 pr-4 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-sunset-yellow"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={16} strokeWidth={1.5} className="text-neutral-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'all')}
            className="border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-sunset-yellow"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="border border-neutral-800 bg-neutral-900/50 px-4 py-3 text-sm text-white outline-none transition focus:border-sunset-yellow"
          >
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden border border-neutral-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-800 bg-neutral-900/50 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
                <tr>
                  <th className="px-5 py-3 font-medium">ID</th>
                  <th className="px-5 py-3 font-medium">Guest</th>
                  <th className="px-5 py-3 font-medium">Date / Time</th>
                  <th className="px-5 py-3 font-medium">Guests</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`cursor-pointer transition ${
                      selectedId === r.id ? 'bg-neutral-800/50' : 'hover:bg-neutral-900/30'
                    }`}
                  >
                    <td className="px-5 py-4 font-mono text-xs text-neutral-400">{r.id}</td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-white">{r.fullName}</p>
                      <p className="text-xs text-neutral-500">{r.eventLabel}</p>
                    </td>
                    <td className="px-5 py-4 text-neutral-300">
                      {formatDate(r.date)} · {r.time}
                    </td>
                    <td className="px-5 py-4 text-neutral-300">{r.guests}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-block border px-2 py-1 text-[10px] font-medium tracking-[0.1em] uppercase ${STATUS_STYLES[r.status]}`}
                      >
                        {RESERVATION_STATUS_LABELS[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-xs tracking-[0.2em] text-neutral-500 uppercase">
                      No reservations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-6 border border-neutral-800 bg-neutral-900/30 p-6">
            {selected ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
                    Reservation Details
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-white">{selected.fullName}</h3>
                  <p className="text-sm text-neutral-400">{selected.email}</p>
                  <p className="text-sm text-neutral-400">{selected.phone}</p>
                </div>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <dt className="text-neutral-500">Experience</dt>
                    <dd className="text-white">{selected.eventLabel}</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <dt className="text-neutral-500">Date</dt>
                    <dd className="text-white">{formatDate(selected.date)}</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <dt className="text-neutral-500">Time</dt>
                    <dd className="text-white">{selected.time}</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <dt className="text-neutral-500">Guests</dt>
                    <dd className="text-white">{selected.guests}</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <dt className="text-neutral-500">Deposit</dt>
                    <dd className="text-white">${selected.deposit}</dd>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <dt className="text-neutral-500">Table</dt>
                    <dd className="text-white">{selected.tableId ?? 'Not assigned'}</dd>
                  </div>
                </dl>

                {selected.notes && (
                  <div className="border-l-2 border-sunset-yellow bg-sunset-yellow/5 p-4">
                    <p className="text-[10px] font-medium tracking-[0.2em] text-sunset-yellow uppercase">
                      Notes
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-neutral-300">{selected.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {(['confirmed', 'pending', 'cancelled'] as ReservationStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateStatus(selected.id, s)}
                      className={`flex-1 border px-3 py-2 text-[10px] font-medium tracking-[0.15em] uppercase transition ${
                        selected.status === s
                          ? 'border-sunset-yellow bg-sunset-yellow text-night'
                          : 'border-neutral-700 text-neutral-400 hover:border-sunset-yellow hover:text-sunset-yellow'
                      }`}
                    >
                      {RESERVATION_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs tracking-[0.2em] text-neutral-500 uppercase">
                  Select a reservation to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
