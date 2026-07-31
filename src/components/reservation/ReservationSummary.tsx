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
  return (
    <div className="sticky top-6 space-y-4 lg:top-8">
      <div className="border border-warm-charcoal/10 bg-white/60 p-5 backdrop-blur-md">
        <p className="text-xs font-semibold tracking-[0.2em] text-terracotta uppercase">
          Reservation Summary
        </p>
        <h3 className="mt-2 font-display text-2xl font-semibold leading-none tracking-tight text-warm-charcoal">{eventLabel}</h3>
        <dl className="mt-5 space-y-3 text-base">
          <div className="flex justify-between">
            <dt className="text-warm-charcoal/60">Date</dt>
            <dd className="font-medium text-warm-charcoal">{formatDate(data.date)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-warm-charcoal/60">Time</dt>
            <dd className="font-medium text-warm-charcoal">{data.time || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-warm-charcoal/60">Guests</dt>
            <dd className="font-medium text-warm-charcoal">{data.guests}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-warm-charcoal/60">Name</dt>
            <dd className="font-medium text-warm-charcoal">{data.fullName || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-between border border-warm-charcoal/10 bg-sand/70 p-5 text-warm-charcoal">
        <span className="text-sm font-semibold tracking-wide uppercase">
          Deposit to reserve
        </span>
        <span className="font-display text-3xl font-semibold tracking-tight text-terracotta">
          {formatCurrency(DEPOSIT_AMOUNT, DEPOSIT_CURRENCY)}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-warm-charcoal/50">
        This is a demo authorization only. No real charge will be processed.
      </p>
    </div>
  );
}
