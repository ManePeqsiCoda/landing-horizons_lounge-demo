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
      <div className="border border-white/20 bg-white/10 p-5 backdrop-blur-md">
        <p className="text-xs font-semibold tracking-[0.25em] text-sunset-yellow uppercase">
          Reservation Summary
        </p>
        <h3 className="mt-2 font-serif text-2xl leading-none text-white">{eventLabel}</h3>
        <dl className="mt-5 space-y-3 text-base">
          <div className="flex justify-between">
            <dt className="text-white/60">Date</dt>
            <dd className="font-medium text-white">{formatDate(data.date)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/60">Time</dt>
            <dd className="font-medium text-white">{data.time || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/60">Guests</dt>
            <dd className="font-medium text-white">{data.guests}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-white/60">Name</dt>
            <dd className="font-medium text-white">{data.fullName || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-between border border-white/20 bg-night/60 p-5 text-white">
        <span className="text-sm font-medium tracking-wide uppercase">
          Deposit to reserve
        </span>
        <span className="font-serif text-3xl text-sunset-yellow">
          {formatCurrency(DEPOSIT_AMOUNT, DEPOSIT_CURRENCY)}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-white/50">
        This is a demo authorization only. No real charge will be processed.
      </p>
    </div>
  );
}
