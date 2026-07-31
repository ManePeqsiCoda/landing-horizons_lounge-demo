/**
 * Gestor de reservas del panel admin.
 * Permite filtrar por fecha, evento y estado; ver detalles; cambiar estado localmente.
 * Estilo Liquid Glass.
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

const STATUS_CLASSES: Record<ReservationStatus, string> = {
  confirmed: 'glass-status-confirmed',
  pending: 'glass-status-pending',
  cancelled: 'glass-status-cancelled',
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
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or ID"
            className="glass-input w-full py-3 pl-11 pr-4 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={16} strokeWidth={1.5} className="text-slate-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'all')}
            className="glass-select px-4 py-3 text-sm"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="glass-select px-4 py-3 text-sm"
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
          <div className="glass-panel overflow-hidden">
            <table className="glass-table text-left text-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Date / Time</th>
                  <th>Guests</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-800">
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`glass-table-row cursor-pointer ${
                      selectedId === r.id ? 'glass-table-row-active' : ''
                    }`}
                  >
                    <td className="font-mono text-xs text-slate-500">{r.id}</td>
                    <td>
                      <p className="font-sans font-semibold text-slate-900">{r.fullName}</p>
                      <p className="text-xs text-slate-600">{r.eventLabel}</p>
                    </td>
                    <td>
                      {formatDate(r.date)} · {r.time}
                    </td>
                    <td>{r.guests}</td>
                    <td>
                      <span className={`glass-status ${STATUS_CLASSES[r.status]}`}>
                        {RESERVATION_STATUS_LABELS[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
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
          <div className="glass-panel sticky top-6 p-6">
            {selected ? (
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
                    Reservation Details
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-slate-900">{selected.fullName}</h3>
                  <p className="text-sm text-slate-600">{selected.email}</p>
                  <p className="text-sm text-slate-600">{selected.phone}</p>
                </div>

                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-white/40 pb-2">
                    <dt className="text-slate-500">Experience</dt>
                    <dd className="font-medium text-slate-900">{selected.eventLabel}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/40 pb-2">
                    <dt className="text-slate-500">Date</dt>
                    <dd className="font-medium text-slate-900">{formatDate(selected.date)}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/40 pb-2">
                    <dt className="text-slate-500">Time</dt>
                    <dd className="font-medium text-slate-900">{selected.time}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/40 pb-2">
                    <dt className="text-slate-500">Guests</dt>
                    <dd className="font-medium text-slate-900">{selected.guests}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/40 pb-2">
                    <dt className="text-slate-500">Deposit</dt>
                    <dd className="font-medium text-slate-900">${selected.deposit}</dd>
                  </div>
                  <div className="flex justify-between border-b border-white/40 pb-2">
                    <dt className="text-slate-500">Table</dt>
                    <dd className="font-medium text-slate-900">{selected.tableId ?? 'Not assigned'}</dd>
                  </div>
                </dl>

                {selected.notes && (
                  <div className="border-l-4 border-sunset-yellow bg-sunset-yellow/10 p-4">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-slate-700 uppercase">
                      Notes
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{selected.notes}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {(['confirmed', 'pending', 'cancelled'] as ReservationStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateStatus(selected.id, s)}
                      className={`flex-1 px-3 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase transition ${
                        selected.status === s
                          ? 'glass-button-primary rounded-lg'
                          : 'glass-button rounded-lg'
                      }`}
                    >
                      {RESERVATION_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
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
