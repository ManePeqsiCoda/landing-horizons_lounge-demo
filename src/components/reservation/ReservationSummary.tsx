import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Sparkles } from 'lucide-react';
import type { ReservationFormData } from '../../data/reservation';
import { DEPOSIT_AMOUNT, DEPOSIT_CURRENCY } from '../../data/reservation';

interface ReservationSummaryProps {
  data: ReservationFormData;
  eventLabel: string;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

function formatDate(dateString: string): string {
  if (!dateString) return '—';
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ReservationSummary({
  data,
  eventLabel,
}: ReservationSummaryProps) {
  const isComplete = useMemo(
    () => data.fullName.trim() && data.email.trim() && data.phone.trim() && data.date,
    [data]
  );

  return (
    <div className="sticky top-6 space-y-4 lg:top-8">
      <motion.div
        layout
        className="border border-ivory/15 bg-teal-night p-6 shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={16} strokeWidth={1.5} className="text-sunflower" />
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sunflower">
            Your reservation
          </p>
        </div>

        <h3 className="mt-3 font-serif text-2xl font-bold leading-tight tracking-tight text-ivory md:text-3xl">
          {eventLabel}
        </h3>

        <dl className="mt-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <dt className="flex items-center gap-2 text-sm font-medium text-ivory/55">
              <Calendar size={16} strokeWidth={1.5} />
              Date
            </dt>
            <dd className="max-w-[60%] text-right text-sm font-semibold leading-snug text-ivory">
              {formatDate(data.date)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-sm font-medium text-ivory/55">
              <Clock size={16} strokeWidth={1.5} />
              Time
            </dt>
            <dd className="font-display text-lg font-bold text-ivory">
              {data.time || '—'}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="flex items-center gap-2 text-sm font-medium text-ivory/55">
              <Users size={16} strokeWidth={1.5} />
              Guests
            </dt>
            <dd className="font-display text-2xl font-bold text-ivory">
              {data.guests}
            </dd>
          </div>
        </dl>

        <div className="mt-6 h-px bg-ivory/10" />

        <div className="mt-5 flex items-center justify-between">
          <span className="text-sm font-medium text-ivory/65">Deposit</span>
          <span className="font-serif text-3xl font-bold text-sunflower">
            {formatCurrency(DEPOSIT_AMOUNT, DEPOSIT_CURRENCY)}
          </span>
        </div>
      </motion.div>

      <div
        className={`border border-ivory/15 p-4 transition-colors duration-300 ${
          isComplete ? 'bg-emerald-500/10' : 'bg-ivory/5'
        }`}
      >
        <p
          className={`text-xs font-medium leading-relaxed ${
            isComplete ? 'text-emerald-200' : 'text-ivory/55'
          }`}
        >
          {isComplete
            ? 'All set — authorize your deposit to confirm.'
            : 'Complete your contact details and card to secure your table.'}
        </p>
      </div>
    </div>
  );
}
