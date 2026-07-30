/**
 * Tarjetas de KPI del dashboard administrativo.
 * Datos calculados a partir de reservas y mesas mock.
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
      accent: 'text-sunset-yellow',
    },
    {
      label: 'Guests today',
      value: todayGuests,
      sub: `${capacity.usedChairs} chairs used`,
      icon: Users,
      accent: 'text-sunset-orange',
    },
    {
      label: 'Free tables',
      value: capacity.freeTables,
      sub: `${capacity.freeChairs} free chairs`,
      icon: Armchair,
      accent: 'text-sunset-coral',
    },
    {
      label: 'Est. deposits today',
      value: `$${todayRevenue}`,
      sub: `${todayReservations.filter((r) => r.deposit > 0).length} paid deposits`,
      icon: DollarSign,
      accent: 'text-white',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group border border-neutral-800 bg-neutral-900/50 p-5 transition-colors hover:border-neutral-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-medium tracking-[0.25em] text-neutral-500 uppercase">
                {card.label}
              </p>
              <p className={`mt-3 font-serif text-3xl ${card.accent}`}>{card.value}</p>
              <p className="mt-1 text-[11px] tracking-[0.1em] text-neutral-400">{card.sub}</p>
            </div>
            <card.icon size={20} strokeWidth={1.5} className="text-neutral-600" />
          </div>
        </div>
      ))}
    </div>
  );
}
