/**
 * Editor de menú del panel admin.
 * Permite editar drinks y plates, con vista previa tipo ExpandCards.
 */

import { useMemo, useState } from 'react';
import { Plus, Trash2, Eye, Edit2, Check, X } from 'lucide-react';
import type { MenuItem, PlateSubcategory } from '../../data/menu';
import { drinks as seedDrinks, plateSubcategories as seedPlates } from '../../data/menu';
import ExpandCards from '../ExpandCards';

interface MenuEditorProps {
  // Sin props externas; el editor maneja su propio estado demo.
}

type MenuCategory = 'drinks' | 'plates';

function emptyMenuItem(): MenuItem {
  return {
    id: `new-${Date.now()}`,
    name: '',
    description: '',
    price: 0,
    tags: [],
    featured: false,
    image: '/images/drinks/signature-cocktail.jpg',
  };
}

function formatTagsInput(tags: string[]): string {
  return tags.join(', ');
}

function parseTagsInput(value: string): string[] {
  return value
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export default function MenuEditor(_props: MenuEditorProps) {
  const [activeTab, setActiveTab] = useState<MenuCategory>('drinks');
  const [drinks, setDrinks] = useState<MenuItem[]>(seedDrinks);
  const [plates, setPlates] = useState<PlateSubcategory[]>(seedPlates);
  const [selectedPlateId, setSelectedPlateId] = useState<string>(seedPlates[0].id);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const currentPlates = useMemo(
    () => plates.find((p) => p.id === selectedPlateId)?.items ?? [],
    [plates, selectedPlateId]
  );

  const previewItems = useMemo(() => {
    return activeTab === 'drinks' ? drinks : currentPlates;
  }, [activeTab, drinks, currentPlates]);

  const startEdit = (id: string) => setEditingId(id);
  const cancelEdit = () => setEditingId(null);

  const updateDrink = (id: string, updates: Partial<MenuItem>) => {
    setDrinks((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const updatePlateItem = (plateId: string, itemId: string, updates: Partial<MenuItem>) => {
    setPlates((prev) =>
      prev.map((p) =>
        p.id === plateId
          ? { ...p, items: p.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)) }
          : p
      )
    );
  };

  const addDrink = () => {
    const newItem = { ...emptyMenuItem(), id: `drink-${Date.now()}`, name: 'New Drink' };
    setDrinks((prev) => [...prev, newItem]);
    setEditingId(newItem.id);
  };

  const addPlateItem = () => {
    const newItem = { ...emptyMenuItem(), id: `plate-${Date.now()}`, name: 'New Plate' };
    setPlates((prev) =>
      prev.map((p) => (p.id === selectedPlateId ? { ...p, items: [...p.items, newItem] } : p))
    );
    setEditingId(newItem.id);
  };

  const deleteDrink = (id: string) => {
    setDrinks((prev) => prev.filter((d) => d.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const deletePlateItem = (plateId: string, itemId: string) => {
    setPlates((prev) =>
      prev.map((p) => (p.id === plateId ? { ...p, items: p.items.filter((i) => i.id !== itemId) } : p))
    );
    if (editingId === itemId) setEditingId(null);
  };

  const renderRow = (item: MenuItem, plateId?: string) => {
    const isEditing = editingId === item.id;
    const update = plateId ? updatePlateItem : updateDrink;
    const remove = plateId
      ? () => deletePlateItem(plateId, item.id)
      : () => deleteDrink(item.id);

    return (
      <li
        key={item.id}
        className="border-b border-neutral-800 px-5 py-4 transition hover:bg-neutral-900/20"
      >
        {isEditing ? (
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="Name"
              className="border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
            />
            <input
              value={item.price}
              type="number"
              onChange={(e) => update(item.id, { price: Number(e.target.value) })}
              placeholder="Price"
              className="border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow"
            />
            <input
              value={item.image}
              onChange={(e) => update(item.id, { image: e.target.value })}
              placeholder="Image URL"
              className="border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow md:col-span-2"
            />
            <textarea
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="Description"
              rows={2}
              className="resize-none border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow md:col-span-2"
            />
            <input
              value={formatTagsInput(item.tags)}
              onChange={(e) => update(item.id, { tags: parseTagsInput(e.target.value) })}
              placeholder="Tags separated by commas"
              className="border border-neutral-700 bg-neutral-900/50 px-3 py-2 text-sm text-white outline-none focus:border-sunset-yellow md:col-span-2"
            />
            <label className="flex items-center gap-2 text-sm text-neutral-300 md:col-span-2">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(e) => update(item.id, { featured: e.target.checked })}
                className="h-4 w-4 accent-sunset-yellow"
              />
              Featured
            </label>
            <div className="flex gap-2 md:col-span-2">
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
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <h4 className="truncate font-serif text-lg text-white">{item.name}</h4>
                <span className="font-sans text-sm font-medium text-sunset-yellow">
                  ${item.price}
                </span>
                {item.featured && (
                  <span className="border border-sunset-yellow/30 px-2 py-0.5 text-[9px] tracking-[0.15em] text-sunset-yellow uppercase">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-neutral-400">
                {item.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] tracking-[0.1em] text-neutral-500 uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startEdit(item.id)}
                aria-label={`Edit ${item.name}`}
                className="text-neutral-500 transition hover:text-sunset-yellow"
              >
                <Edit2 size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={remove}
                aria-label={`Delete ${item.name}`}
                className="text-neutral-500 transition hover:text-sunset-coral"
              >
                <Trash2 size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-3 border-b border-neutral-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('drinks')}
          className={`px-4 py-2 text-xs font-medium tracking-[0.2em] uppercase transition ${
            activeTab === 'drinks'
              ? 'border-b-2 border-sunset-yellow text-sunset-yellow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Drinks
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('plates')}
          className={`px-4 py-2 text-xs font-medium tracking-[0.2em] uppercase transition ${
            activeTab === 'plates'
              ? 'border-b-2 border-sunset-yellow text-sunset-yellow'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Plates
        </button>

        {activeTab === 'plates' && (
          <select
            value={selectedPlateId}
            onChange={(e) => setSelectedPlateId(e.target.value)}
            className="ml-auto border border-neutral-800 bg-neutral-900/50 px-4 py-2 text-sm text-white outline-none transition focus:border-sunset-yellow"
          >
            {plates.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        <button
          type="button"
          onClick={() => setShowPreview((s) => !s)}
          className={`ml-auto flex items-center gap-2 border px-4 py-2 text-[10px] font-medium tracking-[0.15em] uppercase transition lg:ml-0 ${
            showPreview
              ? 'border-sunset-yellow bg-sunset-yellow text-night'
              : 'border-neutral-700 text-neutral-300 hover:border-sunset-yellow hover:text-sunset-yellow'
          }`}
        >
          <Eye size={14} strokeWidth={1.5} />
          {showPreview ? 'Hide preview' : 'Preview cards'}
        </button>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="border border-neutral-800 bg-neutral-900/20 p-4">
          <p className="mb-3 text-[10px] font-medium tracking-[0.2em] text-neutral-500 uppercase">
            ExpandCards preview
          </p>
          <div className="h-[320px]">
            <ExpandCards items={previewItems} />
          </div>
        </div>
      )}

      {/* List */}
      <div className="overflow-hidden border border-neutral-800">
        <ul>
          {activeTab === 'drinks'
            ? drinks.map((d) => renderRow(d))
            : currentPlates.map((p) => renderRow(p, selectedPlateId))}
        </ul>
      </div>

      <button
        type="button"
        onClick={activeTab === 'drinks' ? addDrink : addPlateItem}
        className="flex w-full items-center justify-center gap-2 border border-dashed border-neutral-700 py-4 text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase transition hover:border-sunset-yellow hover:text-sunset-yellow"
      >
        <Plus size={16} strokeWidth={1.5} />
        Add {activeTab === 'drinks' ? 'drink' : 'plate'}
      </button>

      <p className="text-center text-[10px] tracking-[0.25em] text-neutral-600 uppercase">
        Demo only — changes are not saved
      </p>
    </div>
  );
}
