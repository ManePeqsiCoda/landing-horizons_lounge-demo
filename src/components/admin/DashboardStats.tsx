/**
 * Tarjetas de KPI del dashboard administrativo.
 * Números grandes, tabulares y de alto contraste para legibilidad rápida.
 */

import { CalendarDays, Armchair, Users, DollarSign } from 'lucide-react';
import type { AdminReservation } from '../../data/adminReservations';
import { getCapacitySummary, type Table } from '../../data/tables';

interface DashboardStatsProps {
  reservations: AdminReservation[];
  tables: Table[];
}

export default function DashboardStats({ reservations, tables }: DashboardStatsProps) {
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = reservations.filter((r) => r.date === today);
  const todayGuests = todayReservations.reduce((sum, r) => sum + r.guests, 0);
  const todayRevenue = todayReservations.reduce((sum, r) => sum + r.deposit, 0);
  const capacity = getCapacitySummary(tables);

  const cards = [
    {
      label: 'Reservations today',
      value: todayReservations.length,
      sub: `${todayReservations.filter((r) => r.status === 'confirmed').length} confirmed`,
      icon: CalendarDays,
      valueColor: 'text-[var(--admin-ink)]',
      iconColor: 'text-[var(--admin-accent)]',
    },
    {
      label: 'Guests today',
      value: todayGuests,
      sub: `${capacity.usedChairs} chairs used`,
      icon: Users,
      valueColor: 'text-[var(--admin-ink)]',
      iconColor: 'text-[var(--admin-accent-light)]',
    },
    {
      label: 'Free tables',
      value: capacity.freeTables,
      sub: `${capacity.freeChairs} free chairs`,
      icon: Armchair,
      valueColor: 'text-[var(--admin-confirm)]',
      iconColor: 'text-[var(--admin-confirm)]',
    },
    {
      label: 'Est. deposits today',
      value: `$${todayRevenue}`,
      sub: `${todayReservations.filter((r) => r.deposit > 0).length} paid deposits`,
      icon: DollarSign,
      valueColor: 'text-[var(--admin-ink)]',
      iconColor: 'text-[var(--admin-pending)]',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="admin-stat-card p-5"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="admin-stat-label">{card.label}</p>
              <p className={`admin-stat-value mt-3 ${card.valueColor}`}>{card.value}</p>
              <p className="admin-stat-sub">{card.sub}</p>
            </div>
            <card.icon size={24} strokeWidth={1.5} className={card.iconColor} />
          </div>
        </div>
      ))}
    </div>
  );
}
