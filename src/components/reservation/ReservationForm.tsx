import { useEffect, useMemo, useState } from 'react';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';
import {
  DEPOSIT_AMOUNT,
  DEPOSIT_CURRENCY,
  MAX_GUESTS,
  MIN_GUESTS,
  RESERVATION_EMAIL,
  RESERVATION_EVENTS,
  STRIPE_PUBLISHABLE_KEY_ENV,
  TIME_SLOTS,
  type ReservationFormData,
} from '../../data/reservation';
import ReservationSummary from './ReservationSummary';

interface ReservationFormProps {
  stripePublishableKey: string;
}

const cardOptions: StripeCardElementOptions = {
  style: {
    base: {
      fontSize: '17px',
      color: '#2b2420',
      fontFamily: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
      '::placeholder': {
        color: 'rgba(43, 36, 32, 0.45)',
      },
    },
    invalid: {
      color: '#c75b39',
    },
  },
};

function todayInputValue(): string {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60_000);
  return local.toISOString().split('T')[0];
}

function buildMailto(data: ReservationFormData, paymentMethodId: string): string {
  const eventLabel =
    RESERVATION_EVENTS.find((e) => e.id === data.eventId)?.label ?? data.eventId;
  const body = `Dear Horizons Lounge team,

I would like to request a reservation with the following details:

Experience: ${eventLabel}
Date: ${data.date}
Time: ${data.time}
Guests: ${data.guests}

Full Name: ${data.fullName}
Email: ${data.email}
Phone: ${data.phone}

Notes:
${data.notes || 'None'}

---
Demo deposit: $${DEPOSIT_AMOUNT} ${DEPOSIT_CURRENCY}
Demo Stripe PaymentMethod ID: ${paymentMethodId}

Please confirm my reservation.

Best regards,
${data.fullName}`;

  return `mailto:${RESERVATION_EMAIL}?subject=${encodeURIComponent(
    `Reservation Request - ${eventLabel}`
  )}&body=${encodeURIComponent(body)}`;
}

function StripeCardSection() {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return (
      <div className="border border-terracotta/30 bg-terracotta/10 p-4 text-sm text-terracotta">
        Stripe is loading or the publishable key is missing. Add your{' '}
        {STRIPE_PUBLISHABLE_KEY_ENV} to test the card form.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor="card-element"
        className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
      >
        Card Details
      </label>
      <div className="border border-warm-charcoal/15 bg-white/60 px-4 py-3.5 transition focus-within:border-sunset-orange focus-within:bg-white">
        <CardElement id="card-element" options={cardOptions} />
      </div>
      <p className="text-xs text-warm-charcoal/50">
        Demo mode — use 4242 4242 4242 4242, any future date, any CVC.
      </p>
    </div>
  );
}

function InnerForm({
  stripePublishableKey,
}: {
  stripePublishableKey: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [form, setForm] = useState<ReservationFormData>({
    eventId: RESERVATION_EVENTS[0].id,
    date: todayInputValue(),
    time: '18:00',
    guests: 2,
    fullName: '',
    email: '',
    phone: '',
    notes: '',
  });

  const selectedEvent =
    RESERVATION_EVENTS.find((e) => e.id === form.eventId) ?? RESERVATION_EVENTS[0];

  useEffect(() => {
    const eventParam = new URLSearchParams(window.location.search).get('event');
    if (eventParam && RESERVATION_EVENTS.some((e) => e.id === eventParam)) {
      setForm((prev) => ({ ...prev, eventId: eventParam }));
    }
  }, []);

  useEffect(() => {
    if (status === 'success' && paymentMethodId) {
      const mailto = buildMailto(form, paymentMethodId);
      const timer = window.setTimeout(() => {
        window.location.href = mailto;
      }, 900);
      return () => window.clearTimeout(timer);
    }
  }, [status, paymentMethodId, form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'guests' ? Math.max(MIN_GUESTS, Math.min(MAX_GUESTS, Number(value))) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      setErrorMessage('Please complete your contact information.');
      setStatus('error');
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage(
        `Stripe is not ready. Make sure you have set a valid ${STRIPE_PUBLISHABLE_KEY_ENV}.`
      );
      setStatus('error');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card element not found. Please try again.');
      setStatus('error');
      return;
    }

    setStatus('processing');

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: form.fullName,
        email: form.email,
        phone: form.phone,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? 'Your card details could not be verified.');
      setStatus('error');
      return;
    }

    setPaymentMethodId(paymentMethod.id);
    setStatus('success');
  };

  if (status === 'success' && paymentMethodId) {
    const mailto = buildMailto(form, paymentMethodId);
    return (
      <div className="border border-warm-charcoal/10 bg-white/70 p-8 text-center shadow-2xl backdrop-blur-md">
        <div className="mx-auto flex h-16 w-16 items-center justify-center bg-sunset-yellow/25">
          <svg
            className="h-8 w-8 text-terracotta"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight text-warm-charcoal">Reservation Ready</h2>
        <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-warm-charcoal/70">
          Your demo deposit of <strong className="text-terracotta">${DEPOSIT_AMOUNT} {DEPOSIT_CURRENCY}</strong> has been
          authorized. We are preparing your request to send to Horizons Lounge.
        </p>
        <a
          href={mailto}
          className="mt-6 inline-flex items-center gap-2 bg-sunset-yellow px-8 py-3.5 text-sm font-semibold tracking-[0.15em] text-warm-charcoal uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg"
        >
          Send request via email
        </a>
        <p className="mt-4 text-xs text-warm-charcoal/50">
          If your email client did not open automatically, click the button above.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-7" noValidate>
      {/* Main fields + payment */}
      <div className="space-y-4 lg:col-span-2">
        <div className="grid grid-cols-1 gap-x-5 gap-y-3 md:grid-cols-2">
          {/* Experience */}
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="eventId"
              className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
            >
              Experience
            </label>
            <select
              id="eventId"
              name="eventId"
              value={form.eventId}
              onChange={handleChange}
              className="form-glass-light w-full appearance-none px-4 py-3.5 text-base"
            >
              {RESERVATION_EVENTS.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label
              htmlFor="date"
              className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
            >
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              min={todayInputValue()}
              value={form.date}
              onChange={handleChange}
              required
              className="form-glass-light w-full px-4 py-3.5 text-base"
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label
              htmlFor="time"
              className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
            >
              Time
            </label>
            <select
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="form-glass-light w-full appearance-none px-4 py-3.5 text-base"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Guests */}
          <div className="space-y-2">
            <label
              htmlFor="guests"
              className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
            >
              Guests
            </label>
            <input
              id="guests"
              name="guests"
              type="number"
              min={MIN_GUESTS}
              max={MAX_GUESTS}
              value={form.guests}
              onChange={handleChange}
              required
              className="form-glass-light w-full px-4 py-3.5 text-base"
            />
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
              className="form-glass-light w-full px-4 py-3.5 text-base placeholder:text-warm-charcoal/40"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              required
              className="form-glass-light w-full px-4 py-3.5 text-base placeholder:text-warm-charcoal/40"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="phone"
              className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
            >
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+297 000 0000"
              required
              className="form-glass-light w-full px-4 py-3.5 text-base placeholder:text-warm-charcoal/40"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2 md:col-span-2">
            <label
              htmlFor="notes"
              className="block text-xs font-semibold tracking-[0.2em] text-warm-charcoal/60 uppercase"
            >
              Notes / Occasion
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Birthday, anniversary, dietary restrictions..."
              className="form-glass-light w-full resize-none px-4 py-3.5 text-base placeholder:text-warm-charcoal/40"
            />
          </div>
        </div>

        <div className="h-px bg-warm-charcoal/10" />

        <StripeCardSection />

        {status === 'error' && errorMessage && (
          <div
            role="alert"
            aria-live="polite"
            className="border border-red-400/40 bg-red-500/10 px-4 py-3 text-base text-red-700"
          >
            {errorMessage}
          </div>
        )}

        {!stripePublishableKey && (
          <div className="border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
            <strong>Demo setup:</strong> add your{' '}
            <code className="bg-warm-charcoal/5 px-1 py-0.5">{STRIPE_PUBLISHABLE_KEY_ENV}</code>{' '}
            to a <code className="bg-warm-charcoal/5 px-1 py-0.5">.env</code> file to activate the
            real Stripe card form.
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'processing'}
          className="w-full bg-sunset-yellow px-8 py-4 text-sm font-semibold tracking-[0.2em] text-warm-charcoal uppercase transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'processing' ? 'Processing…' : `Authorize $${DEPOSIT_AMOUNT} Deposit`}
        </button>
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <ReservationSummary data={form} eventLabel={selectedEvent.label} />
      </div>
    </form>
  );
}

export default function ReservationForm({
  stripePublishableKey,
}: ReservationFormProps) {
  const keyLooksValid =
    typeof stripePublishableKey === 'string' && stripePublishableKey.startsWith('pk_');

  const stripePromise = keyLooksValid
    ? loadStripe(stripePublishableKey)
    : Promise.resolve(null);

  return (
    <Elements stripe={stripePromise}>
      <InnerForm stripePublishableKey={stripePublishableKey} />
    </Elements>
  );
}
