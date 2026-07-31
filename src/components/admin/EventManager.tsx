/**
 * Gestor de eventos del panel admin.
 * Permite editar eventos existentes y simular la creación de nuevos.
 * Estilo Liquid Glass.
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
        className="glass-button glass-button-dashed w-full justify-center gap-2 py-4 text-xs font-semibold tracking-[0.15em] text-slate-700 uppercase"
      >
        <Plus size={16} strokeWidth={1.5} />
        Add new event
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        {events.map((event) => {
          const isEditing = editingId === event.id;
          return (
            <article
              key={event.id}
              className="glass-panel group overflow-hidden transition hover:-translate-y-0.5 hover:bg-white/70"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.imageAlt || event.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="rounded-lg border border-white/30 bg-slate-900/50 px-3 py-1 text-center backdrop-blur-md">
                    <p className="text-[9px] font-semibold tracking-[0.2em] text-sunset-yellow uppercase">
                      {event.dateKicker || 'UPCOMING'}
                    </p>
                    <p className="font-serif text-xl text-white">{event.date || '—'}</p>
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
                      className="glass-input w-full px-3 py-2 text-sm"
                    />
                    <input
                      value={event.kicker}
                      onChange={(e) => updateEvent(event.id, { kicker: e.target.value })}
                      placeholder="Kicker"
                      className="glass-input w-full px-3 py-2 text-sm"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={event.dateKicker}
                        onChange={(e) => updateEvent(event.id, { dateKicker: e.target.value })}
                        placeholder="Date kicker"
                        className="glass-input px-3 py-2 text-sm"
                      />
                      <input
                        value={event.date}
                        onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                        placeholder="Date"
                        className="glass-input px-3 py-2 text-sm"
                      />
                    </div>
                    <input
                      value={event.image}
                      onChange={(e) => updateEvent(event.id, { image: e.target.value })}
                      placeholder="Image URL"
                      className="glass-input w-full px-3 py-2 text-sm"
                    />
                    <textarea
                      value={event.description}
                      onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                      placeholder="Description"
                      rows={3}
                      className="glass-input w-full resize-none px-3 py-2 text-sm"
                    />
                    <textarea
                      value={event.details.join('\n')}
                      onChange={(e) => updateDetails(event.id, e.target.value)}
                      placeholder="Details (one per line)"
                      rows={3}
                      className="glass-input w-full resize-none px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="glass-button px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase"
                      >
                        <X size={14} strokeWidth={1.5} /> Cancel
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="glass-button-primary px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase"
                      >
                        <Check size={14} strokeWidth={1.5} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-sunset-orange uppercase">
                      {event.kicker}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-slate-900">{event.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                      {event.description}
                    </p>
                    <ul className="mt-3 space-y-1">
                      {event.details.map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                          <Calendar size={12} strokeWidth={1.5} />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.15em] text-slate-500 uppercase">
                        {events.indexOf(event) + 1} of {events.length}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(event.id)}
                          aria-label={`Edit ${event.title}`}
                          className="text-slate-500 transition hover:text-sunset-orange"
                        >
                          <Edit2 size={16} strokeWidth={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEvent(event.id)}
                          aria-label={`Delete ${event.title}`}
                          className="text-slate-500 transition hover:text-rose-700"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
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

      <p className="text-center text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
        Demo only — changes are not saved
      </p>
    </div>
  );
}
