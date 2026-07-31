/**
 * Gestor de eventos del panel admin.
 * Tarjetas de eventos con mejor jerarquía, tipografía clara y acciones organizadas.
 */

import { useState } from 'react';
import { Plus, Trash2, Edit2, Check, X, Calendar } from 'lucide-react';
import { EVENTS as seedEvents, type EventItem } from '../../data/events';

function emptyEvent(): EventItem {
  return {
    id: `new-${Date.now()}`,
    image: '/images/drinks/signature-cocktail.jpg',
    imageAlt: '',
    kicker: '',
    title: 'New Event',
    description: '',
    details: [],
    date: '',
    dateKicker: '',
    cta: 'Reserve a Spot',
    ctaHref: 'mailto:reservations@horizonsaruba.com',
  };
}

export default function EventManager() {
  const [events, setEvents] = useState<EventItem[]>(seedEvents);
  const [editingId, setEditingId] = useState<string | null>(null);

  const startEdit = (id: string) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);

  const updateEvent = (id: string, updates: Partial<EventItem>) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const updateDetails = (id: string, value: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === id ? { ...e, details: value.split('\n').filter(Boolean) } : e))
    );
  };

  const addEvent = () => {
    const newEvent = emptyEvent();
    setEvents((prev) => [newEvent, ...prev]);
    setEditingId(newEvent.id);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    if (editingId === id) setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={addEvent}
        className="admin-button admin-button-dashed w-full justify-center gap-2 py-4"
      >
        <Plus size={18} strokeWidth={1.5} />
        Add new event
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event) => {
          const isEditing = editingId === event.id;
          return (
            <article
              key={event.id}
              className="admin-card group overflow-hidden"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.imageAlt || event.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--admin-ink)]/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="rounded-xl border border-white/20 bg-[var(--admin-ink)]/60 px-3 py-2 text-center backdrop-blur-md">
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[var(--admin-accent-light)] uppercase">
                      {event.dateKicker || 'UPCOMING'}
                    </p>
                    <p className="admin-number mt-0.5 text-2xl font-bold text-white">
                      {event.date || '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      value={event.title}
                      onChange={(e) => updateEvent(event.id, { title: e.target.value })}
                      placeholder="Title"
                      className="admin-input w-full"
                    />
                    <input
                      value={event.kicker}
                      onChange={(e) => updateEvent(event.id, { kicker: e.target.value })}
                      placeholder="Kicker"
                      className="admin-input w-full"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={event.dateKicker}
                        onChange={(e) => updateEvent(event.id, { dateKicker: e.target.value })}
                        placeholder="Date kicker"
                        className="admin-input"
                      />
                      <input
                        value={event.date}
                        onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                        placeholder="Date"
                        className="admin-input"
                      />
                    </div>
                    <input
                      value={event.image}
                      onChange={(e) => updateEvent(event.id, { image: e.target.value })}
                      placeholder="Image URL"
                      className="admin-input w-full"
                    />
                    <textarea
                      value={event.description}
                      onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                      placeholder="Description"
                      rows={3}
                      className="admin-textarea admin-input w-full"
                    />
                    <textarea
                      value={event.details.join('\n')}
                      onChange={(e) => updateDetails(event.id, e.target.value)}
                      placeholder="Details (one per line)"
                      rows={3}
                      className="admin-textarea admin-input w-full"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="admin-button admin-button-secondary"
                      >
                        <X size={16} strokeWidth={1.5} /> Cancel
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="admin-button admin-button-primary"
                      >
                        <Check size={16} strokeWidth={1.5} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="admin-card-sub">{event.kicker}</p>
                    <h3 className="admin-card-header mt-1 text-2xl">{event.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--admin-muted)]">
                      {event.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {event.details.map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm font-medium text-[var(--admin-muted)]">
                          <Calendar size={16} strokeWidth={1.5} className="text-[var(--admin-accent)]" />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex items-center justify-between border-t border-[var(--admin-line)] pt-4">
                      <span className="admin-number text-sm font-bold text-[var(--admin-subtle)]">
                        {events.indexOf(event) + 1} of {events.length}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(event.id)}
                          aria-label={`Edit ${event.title}`}
                          className="rounded-lg p-2 text-[var(--admin-subtle)] transition hover:bg-[var(--admin-panel-soft)] hover:text-[var(--admin-accent)]"
                        >
                          <Edit2 size={18} strokeWidth={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEvent(event.id)}
                          aria-label={`Delete ${event.title}`}
                          className="rounded-lg p-2 text-[var(--admin-subtle)] transition hover:bg-[var(--admin-panel-soft)] hover:text-[var(--admin-cancel)]"
                        >
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <p className="admin-empty">Demo only — changes are not saved</p>
    </div>
  );
}
