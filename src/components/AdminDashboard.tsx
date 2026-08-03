/**
 * Panel de administración de Horizons Lounge Aruba.
 * Editorial ledger — tipografía clara, números legibles, navegación refinada.
 * Mock-up. Sin persistencia real.
 */

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  Armchair,
  UtensilsCrossed,
  PartyPopper,
  LogOut,
} from 'lucide-react';
import AdminLogin from './admin/AdminLogin';
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
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'reservations', label: 'Reservations', icon: CalendarDays },
  { id: 'tables', label: 'Tables', icon: Armchair },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed },
  { id: 'events', label: 'Events', icon: PartyPopper },
];

const SECTION_TITLES: Record<Section, string> = {
  dashboard: 'Dashboard',
  reservations: 'Reservations',
  tables: 'Tables & Capacity',
  menu: 'Menu Editor',
  events: 'Events',
};

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState<Section>('dashboard');
  const [reservations, setReservations] = useState<AdminReservation[]>(ADMIN_RESERVATIONS);
  const [tables, setTables] = useState<Table[]>(TABLES);

  const todayISO = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter((r) => r.date === todayISO);

  const navBadges = useMemo(
    () => ({
      dashboard: undefined,
      reservations: reservations.length,
      tables: tables.filter((t) => t.status === 'free').length,
      menu: undefined,
      events: undefined,
    }),
    [reservations, tables]
  );

  const renderSection = () => {
    switch (active) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats reservations={reservations} tables={tables} />
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="admin-card p-6">
                <p className="admin-card-sub">Today&apos;s reservations</p>
                <h3 className="admin-card-header mt-1">On the books</h3>
                <ul className="mt-5 space-y-3">
                  {todayReservations.slice(0, 5).map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center justify-between border-b border-[var(--admin-line)] pb-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="admin-primary-text truncate">{r.fullName}</p>
                        <p className="admin-secondary-text">{r.eventLabel}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <p className="admin-number text-base font-bold">{r.time}</p>
                        <p className="admin-muted-text">{r.guests} guests</p>
                      </div>
                    </li>
                  ))}
                  {todayReservations.length === 0 && (
                    <li className="admin-empty">No reservations today</li>
                  )}
                </ul>
              </div>
              <div className="admin-card p-6">
                <p className="admin-card-sub">Capacity snapshot</p>
                <h3 className="admin-card-header mt-1">Right now</h3>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="admin-stat-card p-4 text-center">
                    <p className="admin-stat-label">Used</p>
                    <p className="admin-stat-value mt-2 text-[var(--admin-cancel)]">
                      {tables.filter((t) => t.status !== 'free').reduce((sum, t) => sum + t.capacity, 0)}
                    </p>
                    <p className="admin-stat-sub">chairs</p>
                  </div>
                  <div className="admin-stat-card p-4 text-center">
                    <p className="admin-stat-label">Free</p>
                    <p className="admin-stat-value mt-2 text-[var(--admin-confirm)]">
                      {tables.filter((t) => t.status === 'free').reduce((sum, t) => sum + t.capacity, 0)}
                    </p>
                    <p className="admin-stat-sub">chairs</p>
                  </div>
                </div>
                <p className="mt-5 text-center text-sm font-semibold text-[var(--admin-muted)]">
                  <span className="admin-number text-lg font-bold text-[var(--admin-ink)]">
                    {tables.filter((t) => t.status === 'free').length}
                  </span>{' '}
                  tables available now
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
    <div className="admin-dashboard-root flex min-h-screen flex-col gap-4 p-4 lg:flex-row lg:p-6">
      {/* Sidebar */}
      <aside className="admin-sidebar flex shrink-0 flex-col lg:w-72">
        <div className="flex items-start justify-between gap-4 p-6">
          <div>
            <p className="admin-sidebar-kicker">Horizons Lounge Aruba</p>
            <p className="admin-sidebar-brand mt-1">Admin</p>
            <p className="mt-2 text-sm font-medium leading-snug text-[var(--admin-muted)]">
              The Sunset Ritual dashboard
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAuthed(false)}
            aria-label="Log out"
            className="rounded-lg p-2 text-[var(--admin-subtle)] transition hover:bg-[var(--admin-panel-soft)] hover:text-[var(--admin-accent)] lg:hidden"
          >
            <LogOut size={18} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-1 gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-4 lg:pb-4">
          {NAV.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setActive(id)}
                className={`admin-nav-item ${isActive ? 'admin-nav-item-active' : ''}`}
              >
                <Icon size={20} strokeWidth={1.5} />
                <span>{label}</span>
                {navBadges[id] !== undefined && (
                  <span className="admin-nav-badge">{navBadges[id]}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto hidden border-t border-[var(--admin-line)] p-4 lg:block">
          <a href="/" className="admin-nav-item">
            <LogOut size={18} strokeWidth={1.5} />
            <span>Back to site</span>
          </a>
          <button
            type="button"
            onClick={() => setAuthed(false)}
            className="admin-nav-item text-left"
          >
            <LogOut size={18} strokeWidth={1.5} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main-panel min-w-0 flex-1 p-6 lg:p-10">
        <header className="mb-8">
          <p className="admin-card-sub">{NAV.find((n) => n.id === active)?.label}</p>
          <h1 className="admin-section-title mt-1">{SECTION_TITLES[active]}</h1>
          <p className="admin-section-sub mt-2">
            Demo dashboard — all changes are local and reset on reload.
          </p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {!authed && <AdminLogin onSuccess={() => setAuthed(true)} />}
    </div>
  );
}
