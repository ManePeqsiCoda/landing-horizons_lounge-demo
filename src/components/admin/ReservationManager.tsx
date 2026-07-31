/**
 * Gestor de reservas del panel admin.
 * Tabla más legible, detalles con mejor jerarquía y números claros.
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
  confirmed: 'admin-status-confirmed',
  pending: 'admin-status-pending',
  cancelled: 'admin-status-cancelled',
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
            size={18}
            strokeWidth={1.5}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-subtle)]"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or ID"
            className="admin-input w-full py-3 pl-11 pr-4"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={18} strokeWidth={1.5} className="text-[var(--admin-subtle)]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReservationStatus | 'all')}
            className="admin-select"
          >
            <option value="all">All statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="admin-select"
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
          <div className="admin-card overflow-hidden">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Guest</th>
                  <th>Date / Time</th>
                  <th className="text-right">Guests</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`cursor-pointer ${selectedId === r.id ? 'admin-row-active' : ''}`}
                  >
                    <td>
                      <span className="admin-number text-sm font-semibold text-[var(--admin-subtle)]">
                        {r.id}
                      </span>
                    </td>
                    <td>
                      <p className="admin-primary-text">{r.fullName}</p>
                      <p className="admin-secondary-text">{r.eventLabel}</p>
                    </td>
                    <td>
                      <span className="text-sm font-semibold text-[var(--admin-ink)]">
                        {formatDate(r.date)}
                      </span>
                      <span className="mx-2 text-[var(--admin-subtle)]">·</span>
                      <span className="admin-number text-sm font-semibold text-[var(--admin-ink)]">
                        {r.time}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="admin-number text-lg font-bold text-[var(--admin-ink)]">
                        {r.guests}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status ${STATUS_CLASSES[r.status]}`}>
                        {RESERVATION_STATUS_LABELS[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="admin-empty">
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
          <div className="admin-card sticky top-6 p-6">
            {selected ? (
              <div className="space-y-5">
                <div>
                  <p className="admin-card-sub">Reservation Details</p>
                  <h3 className="admin-card-header mt-1 text-2xl">{selected.fullName}</h3>
                  <p className="admin-secondary-text mt-1">{selected.email}</p>
                  <p className="admin-secondary-text">{selected.phone}</p>
                </div>

                <dl className="admin-dl">
                  <div className="admin-dl-row">
                    <dt className="admin-dl-term">Experience</dt>
                    <dd className="admin-dl-value">{selected.eventLabel}</dd>
                  </div>
                  <div className="admin-dl-row">
                    <dt className="admin-dl-term">Date</dt>
                    <dd className="admin-dl-value">{formatDate(selected.date)}</dd>
                  </div>
                  <div className="admin-dl-row">
                    <dt className="admin-dl-term">Time</dt>
                    <dd className="admin-dl-value admin-number">{selected.time}</dd>
                  </div>
                  <div className="admin-dl-row">
                    <dt className="admin-dl-term">Guests</dt>
                    <dd className="admin-dl-value admin-number text-lg font-bold">{selected.guests}</dd>
                  </div>
                  <div className="admin-dl-row">
                    <dt className="admin-dl-term">Deposit</dt>
                    <dd className="admin-dl-value admin-number text-lg font-bold">
                      ${selected.deposit}
                    </dd>
                  </div>
                  <div className="admin-dl-row">
                    <dt className="admin-dl-term">Table</dt>
                    <dd className="admin-dl-value admin-number">
                      {selected.tableId ?? 'Not assigned'}
                    </dd>
                  </div>
                </dl>

                {selected.notes && (
                  <div className="rounded-xl border border-[var(--admin-line)] bg-[var(--admin-panel-soft)] p-4">
                    <p className="admin-card-sub">Notes</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--admin-ink)]">
                      {selected.notes}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  {(['confirmed', 'pending', 'cancelled'] as ReservationStatus[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateStatus(selected.id, s)}
                      className={`admin-button flex-1 rounded-lg text-xs font-semibold uppercase tracking-wide ${
                        selected.status === s
                          ? 'admin-button-primary'
                          : 'admin-button-secondary'
                      }`}
                    >
                      {RESERVATION_STATUS_LABELS[s]}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="admin-empty">
                Select a reservation to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
