/**
 * Editor de menú del panel admin.
 * Permite editar drinks y plates, con vista previa tipo ExpandCards.
 * Estilo Liquid Glass.
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
        className="border-b border-white/30 px-5 py-4 transition hover:bg-white/25"
      >
        {isEditing ? (
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={item.name}
              onChange={(e) => update(item.id, { name: e.target.value })}
              placeholder="Name"
              className="glass-input px-3 py-2 text-sm"
            />
            <input
              value={item.price}
              type="number"
              onChange={(e) => update(item.id, { price: Number(e.target.value) })}
              placeholder="Price"
              className="glass-input px-3 py-2 text-sm"
            />
            <input
              value={item.image}
              onChange={(e) => update(item.id, { image: e.target.value })}
              placeholder="Image URL"
              className="glass-input px-3 py-2 text-sm md:col-span-2"
            />
            <textarea
              value={item.description}
              onChange={(e) => update(item.id, { description: e.target.value })}
              placeholder="Description"
              rows={2}
              className="glass-input resize-none px-3 py-2 text-sm md:col-span-2"
            />
            <input
              value={formatTagsInput(item.tags)}
              onChange={(e) => update(item.id, { tags: parseTagsInput(e.target.value) })}
              placeholder="Tags separated by commas"
              className="glass-input px-3 py-2 text-sm md:col-span-2"
            />
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(e) => update(item.id, { featured: e.target.checked })}
                className="h-4 w-4 accent-sunset-orange"
              />
              Featured
            </label>
            <div className="flex gap-2 md:col-span-2">
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
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-3">
                <h4 className="truncate font-serif text-lg text-slate-900">{item.name}</h4>
                <span className="font-sans text-sm font-semibold text-sunset-orange">
                  ${item.price}
                </span>
                {item.featured && (
                  <span className="rounded-full border border-sunset-orange/40 bg-sunset-orange/10 px-2 py-0.5 text-[9px] font-semibold tracking-[0.12em] text-sunset-orange uppercase">
                    Featured
                  </span>
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-300/60 bg-white/30 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-slate-600 uppercase"
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
                className="text-slate-500 transition hover:text-sunset-orange"
              >
                <Edit2 size={16} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={remove}
                aria-label={`Delete ${item.name}`}
                className="text-slate-500 transition hover:text-rose-700"
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
      <div className="flex flex-wrap items-center gap-3 border-b border-white/40 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('drinks')}
          className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition ${
            activeTab === 'drinks'
              ? 'bg-white/60 text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-white/30'
          }`}
        >
          Drinks
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('plates')}
          className={`rounded-lg px-4 py-2 text-xs font-semibold tracking-[0.12em] uppercase transition ${
            activeTab === 'plates'
              ? 'bg-white/60 text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-white/30'
          }`}
        >
          Plates
        </button>

        {activeTab === 'plates' && (
          <select
            value={selectedPlateId}
            onChange={(e) => setSelectedPlateId(e.target.value)}
            className="glass-select ml-auto px-4 py-2 text-sm"
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
          className={`ml-auto flex items-center gap-2 rounded-lg px-4 py-2 text-[10px] font-semibold tracking-[0.12em] uppercase transition lg:ml-0 ${
            showPreview
              ? 'bg-sunset-yellow text-slate-900 shadow-sm'
              : 'bg-white/40 text-slate-800 hover:bg-white/70'
          }`}
        >
          <Eye size={14} strokeWidth={1.5} />
          {showPreview ? 'Hide preview' : 'Preview cards'}
        </button>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="glass-panel p-4">
          <p className="mb-3 text-[10px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
            ExpandCards preview
          </p>
          <div className="h-[320px]">
            <ExpandCards items={previewItems} />
          </div>
        </div>
      )}

      {/* List */}
      <div className="glass-panel overflow-hidden">
        <ul>
          {activeTab === 'drinks'
            ? drinks.map((d) => renderRow(d))
            : currentPlates.map((p) => renderRow(p, selectedPlateId))}
        </ul>
      </div>

      <button
        type="button"
        onClick={activeTab === 'drinks' ? addDrink : addPlateItem}
        className="glass-button glass-button-dashed w-full justify-center gap-2 py-4 text-xs font-semibold tracking-[0.15em] text-slate-700 uppercase"
      >
        <Plus size={16} strokeWidth={1.5} />
        Add {activeTab === 'drinks' ? 'drink' : 'plate'}
      </button>

      <p className="text-center text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
        Demo only — changes are not saved
      </p>
    </div>
  );
}
