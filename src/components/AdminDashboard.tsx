/**
 * Panel de administración de Horizons Lounge Aruba.
 * Estilo Liquid Glass sobre fondo de agua de mar cenital.
 * Mock-up con navegación lateral. Sin persistencia real.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Armchair,
  UtensilsCrossed,
  PartyPopper,
  LogOut,
} from 'lucide-react';
import DashboardStats from './admin/DashboardStats';
import ReservationManager from './admin/ReservationManager';
import TableManager from './admin/TableManager';
import MenuEditor from './admin/MenuEditor';
import EventManager from './admin/EventManager';
import { ADMIN_RESERVATIONS, type AdminReservation } from '../data/adminReservations';
import { TABLES, type Table } from '../data/tables';

type Section = 'dashboard' | 'reservations' | 'tables' | 'menu' | 'events';

interface NavItem {
  id: Section;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  { id: 'tables', label: 'Tables', icon: Armchair },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'events', label: 'Events', icon: PartyPopper },
];

const SECTION_TITLES: Record<Section, string> = {
  dashboard: 'Overview',
  reservations: 'Reservations',
  tables: 'Tables & Capacity',
  menu: 'Menu Editor',
  events: 'Events',
};

export default function AdminDashboard() {
  const [active, setActive] = useState<Section>('dashboard');
  const [reservations, setReservations] = useState<AdminReservation[]>(ADMIN_RESERVATIONS);
  const [tables, setTables] = useState<Table[]>(TABLES);

  const renderSection = () => {
    switch (active) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <DashboardStats reservations={reservations} tables={tables} />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="glass-panel p-6">
                <h3 className="font-serif text-xl text-slate-900">Today's reservations</h3>
                <ul className="mt-4 space-y-3">
                  {reservations
                    .filter((r) => r.date === new Date().toISOString().split('T')[0])
                    .slice(0, 5)
                    .map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between border-b border-white/30 pb-3 text-sm"
                      >
                        <div>
                          <p className="font-sans font-semibold text-slate-900">{r.fullName}</p>
                          <p className="text-xs text-slate-600">{r.eventLabel}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-800">{r.time}</p>
                          <p className="text-xs text-slate-600">{r.guests} guests</p>
                        </div>
                      </li>
                    ))}
                  {reservations.filter((r) => r.date === new Date().toISOString().split('T')[0])
                    .length === 0 && (
                    <li className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
                      No reservations today
                    </li>
                  )}
                </ul>
              </div>
              <div className="glass-panel p-6">
                <h3 className="font-serif text-xl text-slate-900">Capacity snapshot</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Used</p>
                    <p className="mt-1 font-serif text-2xl text-sunset-coral">
                      {tables
                        .filter((t) => t.status !== 'free')
                        .reduce((sum, t) => sum + t.capacity, 0)}
                    </p>
                  </div>
                  <div className="glass-panel p-4 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Free</p>
                    <p className="mt-1 font-serif text-2xl text-emerald-600">
                      {tables
                        .filter((t) => t.status === 'free')
                        .reduce((sum, t) => sum + t.capacity, 0)}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-center text-[10px] font-semibold tracking-[0.25em] text-slate-500 uppercase">
                  {tables.filter((t) => t.status === 'free').length} tables available now
                </p>
              </div>
            </div>
          </div>
        );
      case 'reservations':
        return <ReservationManager reservations={reservations} onUpdate={setReservations} />;
      case 'tables':
        return <TableManager tables={tables} onUpdate={setTables} />;
      case 'menu':
        return <MenuEditor />;
      case 'events':
        return <EventManager />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 lg:flex-row">
      {/* Sidebar */}
      <aside className="glass-panel-light flex shrink-0 flex-col lg:w-72">
        <div className="p-6">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-slate-500 uppercase">
            Horizons Lounge
          </p>
          <p className="mt-1 font-serif text-2xl text-slate-900">Admin</p>
        </div>
        <nav className="flex flex-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
          {NAV.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`shrink-0 rounded-lg lg:rounded-none ${
                  isActive ? 'glass-nav-item-active' : 'glass-nav-item'
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">{label}</span>
              </button>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-white/30 p-4 lg:block">
          <a
            href="/"
            className="glass-nav-item text-slate-600 hover:text-slate-900"
          >
            <LogOut size={16} strokeWidth={1.5} />
            <span className="text-[11px] font-semibold tracking-[0.12em] uppercase">Back to site</span>
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="glass-panel-light flex-1 p-6 lg:p-10">
        <header className="mb-8">
          <h2 className="font-serif text-3xl text-slate-900 md:text-4xl">{SECTION_TITLES[active]}</h2>
          <p className="mt-2 text-sm font-medium text-slate-600">
            Demo dashboard — all changes are local and will reset on reload.
          </p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
