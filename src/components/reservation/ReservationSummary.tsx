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
    <div className="space-y-4">
      <div className="rounded-xl border border-white/40 bg-white/60 p-4 backdrop-blur-sm">
        <p className="text-[10px] font-semibold tracking-[0.25em] text-sunset-orange uppercase">
          Reservation Summary
        </p>
        <h3 className="mt-1 font-serif text-2xl text-night">{eventLabel}</h3>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-500">Date</dt>
            <dd className="font-medium text-night">{formatDate(data.date)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Time</dt>
            <dd className="font-medium text-night">{data.time || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Guests</dt>
            <dd className="font-medium text-night">{data.guests}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-500">Name</dt>
            <dd className="font-medium text-night">{data.fullName || '—'}</dd>
          </div>
        </dl>
      </div>

      <div className="flex items-center justify-between rounded-xl bg-night p-4 text-white">
        <span className="text-xs font-medium tracking-wide uppercase">
          Deposit to reserve
        </span>
        <span className="font-serif text-2xl text-sunset-yellow">
          {formatCurrency(DEPOSIT_AMOUNT, DEPOSIT_CURRENCY)}
        </span>
      </div>

      <p className="text-[10px] leading-relaxed text-neutral-500">
        This is a demo authorization only. No real charge will be processed.
      </p>
    </div>
  );
}
