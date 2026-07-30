/**
 * Gestor de eventos del panel admin.
 * Permite editar eventos existentes y simular la creación de nuevos.
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
        className="flex w-full items-center justify-center gap-2 border border-dashed border-neutral-700 py-4 text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase transition hover:border-sunset-yellow hover:text-sunset-yellow"
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
              className="group overflow-hidden border border-neutral-800 bg-neutral-900/30 transition hover:border-neutral-700"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.imageAlt || event.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="border border-sunset-yellow/30 bg-night/60 px-3 py-1 text-center backdrop-blur-sm">
                    <p className="text-[9px] font-medium tracking-[0.2em] text-sunset-yellow uppercase">
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
                      className="w-full border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
                    />
                    <input
                      value={event.kicker}
                      onChange={(e) => updateEvent(event.id, { kicker: e.target.value })}
                      placeholder="Kicker"
                      className="w-full border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={event.dateKicker}
                        onChange={(e) => updateEvent(event.id, { dateKicker: e.target.value })}
                        placeholder="Date kicker"
                        className="border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
                      />
                      <input
                        value={event.date}
                        onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                        placeholder="Date"
                        className="border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
                      />
                    </div>
                    <input
                      value={event.image}
                      onChange={(e) => updateEvent(event.id, { image: e.target.value })}
                      placeholder="Image URL"
                      className="w-full border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
                    />
                    <textarea
                      value={event.description}
                      onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                      placeholder="Description"
                      rows={3}
                      className="w-full resize-none border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
                    />
                    <textarea
                      value={event.details.join('\n')}
                      onChange={(e) => updateDetails(event.id, e.target.value)}
                      placeholder="Details (one per line)"
                      rows={3}
                      className="w-full resize-none border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex items-center gap-2 border border-neutral-700 px-4 py-2 text-[10px] font-medium tracking-[0.15em] text-neutral-300 uppercase transition hover:border-sunset-yellow hover:text-sunset-yellow"
                      >
                        <X size={14} strokeWidth={1.5} /> Cancel
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="flex items-center gap-2 border border-sunset-yellow bg-sunset-yellow px-4 py-2 text-[10px] font-medium tracking-[0.15em] text-night uppercase transition hover:bg-white"
                      >
                        <Check size={14} strokeWidth={1.5} /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-[10px] font-medium tracking-[0.2em] text-sunset-yellow uppercase">
                      {event.kicker}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-white">{event.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-400">
                      {event.description}
                    </p>
                    <ul className="mt-3 space-y-1">
                      {event.details.map((d, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs text-neutral-500">
                          <Calendar size={12} strokeWidth={1.5} />
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[10px] tracking-[0.15em] text-neutral-600 uppercase">
                        {events.indexOf(event) + 1} of {events.length}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEdit(event.id)}
                          aria-label={`Edit ${event.title}`}
                          className="text-neutral-500 transition hover:text-sunset-yellow"
                        >
                          <Edit2 size={16} strokeWidth={1.5} />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteEvent(event.id)}
                          aria-label={`Delete ${event.title}`}
                          className="text-neutral-500 transition hover:text-sunset-coral"
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

      <p className="text-center text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
        Demo only — changes are not saved
      </p>
    </div>
  );
}
