/**
 * Editor de menú del panel admin.
 * Interfaz clara con tipografía legible y precios prominentes.
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
    const update = (updates: Partial<MenuItem>) => {
      if (plateId) updatePlateItem(plateId, item.id, updates);
      else updateDrink(item.id, updates);
    };
    const remove = plateId
      ? () => deletePlateItem(plateId, item.id)
      : () => deleteDrink(item.id);

    return (
      <li
        key={item.id}
        className="border-b border-[var(--admin-line)] px-5 py-5 transition last:border-b-0 hover:bg-[var(--admin-panel-soft)]"
      >
        {isEditing ? (
          <div className="grid gap-4 md:grid-cols-2">
            <input
              value={item.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Name"
              className="admin-input"
            />
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-subtle)]">
                $
              </span>
              <input
                value={item.price}
                type="number"
                onChange={(e) => update({ price: Number(e.target.value) })}
                placeholder="Price"
                className="admin-input w-full pl-8"
              />
            </div>
            <input
              value={item.image}
              onChange={(e) => update({ image: e.target.value })}
              placeholder="Image URL"
              className="admin-input md:col-span-2"
            />
            <textarea
              value={item.description}
              onChange={(e) => update({ description: e.target.value })}
              placeholder="Description"
              rows={2}
              className="admin-textarea admin-input md:col-span-2"
            />
            <input
              value={formatTagsInput(item.tags)}
              onChange={(e) => update({ tags: parseTagsInput(e.target.value) })}
              placeholder="Tags separated by commas"
              className="admin-input md:col-span-2"
            />
            <label className="flex items-center gap-3 text-sm font-semibold text-[var(--admin-muted)] md:col-span-2">
              <input
                type="checkbox"
                checked={item.featured}
                onChange={(e) => update({ featured: e.target.checked })}
                className="admin-checkbox"
              />
              Featured
            </label>
            <div className="flex gap-2 md:col-span-2">
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
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-3">
                <h4 className="text-lg font-semibold tracking-tight text-[var(--admin-ink)]">
                  {item.name}
                </h4>
                <span className="admin-number text-lg font-bold text-[var(--admin-accent)]">
                  ${item.price}
                </span>
                {item.featured && (
                  <span className="admin-tag admin-tag-accent">Featured</span>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-[var(--admin-muted)]">
                {item.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag} className="admin-tag">
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
                className="rounded-lg p-2 text-[var(--admin-subtle)] transition hover:bg-[var(--admin-panel-soft)] hover:text-[var(--admin-accent)]"
              >
                <Edit2 size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={remove}
                aria-label={`Delete ${item.name}`}
                className="rounded-lg p-2 text-[var(--admin-subtle)] transition hover:bg-[var(--admin-panel-soft)] hover:text-[var(--admin-cancel)]"
              >
                <Trash2 size={18} strokeWidth={1.5} />
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
      <div className="flex flex-wrap items-center gap-3 border-b border-[var(--admin-line)] pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('drinks')}
          className={`admin-tab ${activeTab === 'drinks' ? 'admin-tab-active' : ''}`}
        >
          Drinks
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('plates')}
          className={`admin-tab ${activeTab === 'plates' ? 'admin-tab-active' : ''}`}
        >
          Plates
        </button>

        {activeTab === 'plates' && (
          <select
            value={selectedPlateId}
            onChange={(e) => setSelectedPlateId(e.target.value)}
            className="admin-select ml-2"
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
          className={`admin-button ml-auto gap-2 ${
            showPreview ? 'admin-button-primary' : 'admin-button-secondary'
          }`}
        >
          <Eye size={16} strokeWidth={1.5} />
          {showPreview ? 'Hide preview' : 'Preview cards'}
        </button>
      </div>

      {/* Preview */}
      {showPreview && (
        <div className="admin-card p-4">
          <p className="admin-card-sub">ExpandCards preview</p>
          <div className="mt-3 h-[320px]">
            <ExpandCards items={previewItems} />
          </div>
        </div>
      )}

      {/* List */}
      <div className="admin-card overflow-hidden">
        <ul>
          {activeTab === 'drinks'
            ? drinks.map((d) => renderRow(d))
            : currentPlates.map((p) => renderRow(p, selectedPlateId))}
        </ul>
      </div>

      <button
        type="button"
        onClick={activeTab === 'drinks' ? addDrink : addPlateItem}
        className="admin-button admin-button-dashed w-full justify-center gap-2 py-4"
      >
        <Plus size={18} strokeWidth={1.5} />
        Add {activeTab === 'drinks' ? 'drink' : 'plate'}
      </button>

      <p className="admin-empty">Demo only — changes are not saved</p>
    </div>
  );
}
