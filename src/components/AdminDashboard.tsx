/**
 * Panel de administración completo de Horizons Lounge Aruba.
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
              <div className="border border-neutral-800 bg-neutral-900/30 p-6">
                <h3 className="font-serif text-xl text-white">Today's reservations</h3>
                <ul className="mt-4 space-y-3">
                  {reservations
                    .filter((r) => r.date === new Date().toISOString().split('T')[0])
                    .slice(0, 5)
                    .map((r) => (
                      <li
                        key={r.id}
                        className="flex items-center justify-between border-b border-neutral-800 pb-3 text-sm"
                      >
                        <div>
                          <p className="font-medium text-white">{r.fullName}</p>
                          <p className="text-xs text-neutral-500">{r.eventLabel}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-neutral-300">{r.time}</p>
                          <p className="text-xs text-neutral-500">{r.guests} guests</p>
                        </div>
                      </li>
                    ))}
                  {reservations.filter((r) => r.date === new Date().toISOString().split('T')[0])
                    .length === 0 && (
                    <li className="text-xs tracking-[0.2em] text-neutral-500 uppercase">
                      No reservations today
                    </li>
                  )}
                </ul>
              </div>
              <div className="border border-neutral-800 bg-neutral-900/30 p-6">
                <h3 className="font-serif text-xl text-white">Capacity snapshot</h3>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="border border-neutral-800 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Used</p>
                    <p className="mt-1 font-serif text-2xl text-sunset-coral">
                      {tables
                        .filter((t) => t.status !== 'free')
                        .reduce((sum, t) => sum + t.capacity, 0)}
                    </p>
                  </div>
                  <div className="border border-neutral-800 p-4 text-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Free</p>
                    <p className="mt-1 font-serif text-2xl text-emerald-400">
                      {tables
                        .filter((t) => t.status === 'free')
                        .reduce((sum, t) => sum + t.capacity, 0)}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-center text-[10px] tracking-[0.25em] text-neutral-500 uppercase">
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
    <div className="flex min-h-[calc(100vh-8rem)] flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="border-b border-neutral-800 lg:w-64 lg:border-b-0 lg:border-r lg:bg-neutral-900/20">
        <div className="p-6">
          <p className="text-[10px] font-medium tracking-[0.35em] text-sunset-yellow uppercase">
            Horizons Lounge
          </p>
          <p className="mt-1 font-serif text-lg text-white">Admin</p>
        </div>
        <nav className="flex overflow-x-auto px-3 pb-2 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0">
          {NAV.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`flex shrink-0 items-center gap-3 px-6 py-4 text-left text-xs font-medium tracking-[0.15em] uppercase transition lg:w-full ${
                  isActive
                    ? 'border-b-2 border-sunset-yellow text-sunset-yellow lg:border-b-0 lg:border-l-2 lg:bg-sunset-yellow/5'
                    : 'border-b-2 border-transparent text-neutral-400 hover:text-white lg:border-l-2 lg:border-transparent lg:hover:bg-neutral-900/30'
                }`}
              >
                <Icon size={18} strokeWidth={1.5} />
                {label}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-neutral-800 p-6 lg:block">
          <a
            href="/"
            className="flex items-center gap-2 text-xs font-light tracking-[0.2em] text-neutral-400 uppercase transition hover:text-sunset-yellow"
          >
            <LogOut size={16} strokeWidth={1.5} />
            Back to site
          </a>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 lg:p-10">
        <header className="mb-8">
          <h2 className="font-serif text-3xl text-white md:text-4xl">{SECTION_TITLES[active]}</h2>
          <p className="mt-2 text-sm text-neutral-500">
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
