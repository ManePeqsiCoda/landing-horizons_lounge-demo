import { useState } from 'react';
import {
  Armchair,
  CalendarDays,
  UtensilsCrossed,
  Plus,
  Trash2,
} from 'lucide-react';

type Category = 'tables' | 'events' | 'dishes';

const TABS: { id: Category; label: string; icon: typeof Armchair }[] = [
  { id: 'tables', label: 'Tables', icon: Armchair },
  { id: 'events', label: 'Events', icon: CalendarDays },
  { id: 'dishes', label: 'Dishes', icon: UtensilsCrossed },
];

const SEED: Record<Category, string[]> = {
  tables: ['Sunset Deck 1', 'Sunset Deck 2', 'Lounge 3', 'Bar 4'],
  events: ["Manager's Cocktail Party", 'Live Jazz Night', 'Sunset Sessions DJ'],
  dishes: ['Eagle Beach Sunset', 'Hibiscus Margarita', 'Sushi Omakase', 'Plant-Based Tiradito'],
};

/**
 * /admin mock-up. Fully client-side state, no persistence.
 * Add / remove buttons work locally for demo purposes.
 */
export default function AdminDashboard() {
  const [active, setActive] = useState<Category>('tables');
  const [items, setItems] = useState<Record<Category, string[]>>(SEED);
  const [draft, setDraft] = useState('');

  const addItem = () => {
    const name = draft.trim();
    if (!name) return;
    setItems((prev) => ({ ...prev, [active]: [...prev[active], name] }));
    setDraft('');
  };

  const removeItem = (index: number) => {
    setItems((prev) => ({
      ...prev,
      [active]: prev[active].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-6">
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-3">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActive(id)}
            className={`flex items-center justify-center gap-2 border px-4 py-4 text-xs font-medium tracking-[0.25em] uppercase transition-colors ${
              active === id
                ? 'border-sunset-yellow bg-sunset-yellow text-night'
                : 'border-neutral-700 text-neutral-300 hover:border-sunset-yellow hover:text-sunset-yellow'
            }`}
          >
            <Icon size={16} strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </div>

      {/* Add */}
      <div className="mt-8 flex gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
          placeholder={'New ' + active.slice(0, -1) + ' name'}
          className="flex-1 border border-neutral-700 bg-transparent px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-sunset-yellow"
        />
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-2 border border-sunset-yellow px-6 py-3 text-xs font-medium tracking-[0.25em] text-sunset-yellow uppercase transition-colors hover:bg-sunset-yellow hover:text-night"
        >
          <Plus size={16} strokeWidth={1.5} />
          Add
        </button>
      </div>

      {/* List */}
      <ul className="mt-8 divide-y divide-neutral-800 border border-neutral-800">
        {items[active].map((item, index) => (
          <li
            key={item + index}
            className="flex items-center justify-between px-5 py-4"
          >
            <span className="text-sm font-light tracking-[0.15em] text-neutral-200">
              {item}
            </span>
            <button
              type="button"
              aria-label={'Remove ' + item}
              onClick={() => removeItem(index)}
              className="text-neutral-500 transition-colors hover:text-sunset-coral"
            >
              <Trash2 size={16} strokeWidth={1.5} />
            </button>
          </li>
        ))}
        {items[active].length === 0 && (
          <li className="px-5 py-8 text-center text-xs tracking-[0.25em] text-neutral-500 uppercase">
            No items yet
          </li>
        )}
      </ul>

      <p className="mt-6 text-center text-[10px] tracking-[0.3em] text-neutral-600 uppercase">
        Demo only — changes are not saved
      </p>
    </div>
  );
}
