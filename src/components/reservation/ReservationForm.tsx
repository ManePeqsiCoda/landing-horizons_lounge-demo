import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeCardElementOptions } from '@stripe/stripe-js';
import { Minus, Plus, Calendar, Clock, Users, Mail, Phone, User, FileText, CreditCard } from 'lucide-react';
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
      color: '#fdf8f1',
      fontFamily: '"Montserrat", ui-sans-serif, system-ui, sans-serif',
      letterSpacing: '0.01em',
      '::placeholder': {
        color: 'rgba(253, 248, 241, 0.45)',
      },
    },
    invalid: {
      color: '#ff9b85',
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function StripeCardSection() {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return (
      <div className="rounded-xl border border-sunset-orange/30 bg-sunset-orange/10 p-4 text-sm text-sunset-orange">
        Stripe is loading or the publishable key is missing. Add your{' '}
        {STRIPE_PUBLISHABLE_KEY_ENV} to test the card form.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label
        htmlFor="card-element"
        className="reserve-label"
      >
        <CreditCard size={16} strokeWidth={1.5} />
        Card Details
      </label>
      <div className="reserve-card-element rounded-xl border border-cream/15 bg-cream/8 px-4 py-4 transition focus-within:border-sunset-orange focus-within:bg-cream/12 focus-within:shadow-[0_0_0_3px_rgba(255,122,69,0.15)]">
        <CardElement id="card-element" options={cardOptions} />
      </div>
      <p className="text-xs font-medium text-cream/45">
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

  const adjustGuests = (delta: number) => {
    setForm((prev) => ({
      ...prev,
      guests: Math.max(MIN_GUESTS, Math.min(MAX_GUESTS, prev.guests + delta)),
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
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-cream/15 bg-cream/10 p-8 text-center shadow-2xl backdrop-blur-xl md:p-12"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sunset-yellow/20 shadow-[0_0_40px_rgba(255,215,0,0.25)]">
          <svg
            className="h-10 w-10 text-sunset-yellow"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 font-serif text-3xl font-bold tracking-tight text-cream md:text-4xl">
          Reservation Ready
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-cream/70">
          Your demo deposit of{' '}
          <strong className="text-sunset-yellow">${DEPOSIT_AMOUNT} {DEPOSIT_CURRENCY}</strong> has
          been authorized. We are preparing your request to send to Horizons Lounge.
        </p>
        <a
          href={buildMailto(form, paymentMethodId)}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-sunset-yellow px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-warm-charcoal shadow-lg transition-all hover:-translate-y-0.5 hover:bg-cream hover:shadow-xl"
        >
          Send request via email
        </a>
        <p className="mt-4 text-xs text-cream/45">
          If your email client did not open automatically, click the button above.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-7 lg:grid-cols-12 lg:gap-10" noValidate>
      <motion.div
        className="space-y-6 lg:col-span-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-2">
          {/* Experience */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="eventId" className="reserve-label">
              <Calendar size={16} strokeWidth={1.5} />
              Experience
            </label>
            <select
              id="eventId"
              name="eventId"
              value={form.eventId}
              onChange={handleChange}
              className="reserve-select"
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
            <label htmlFor="date" className="reserve-label">
              <Calendar size={16} strokeWidth={1.5} />
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
              className="reserve-input"
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <label htmlFor="time" className="reserve-label">
              <Clock size={16} strokeWidth={1.5} />
              Time
            </label>
            <select
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="reserve-select"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Guests stepper */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="guests" className="reserve-label">
              <Users size={16} strokeWidth={1.5} />
              Guests
            </label>
            <div className="flex w-full items-center md:w-64">
              <button
                type="button"
                onClick={() => adjustGuests(-1)}
                disabled={form.guests <= MIN_GUESTS}
                className="reserve-stepper-btn h-14 w-14 rounded-l-xl"
                aria-label="Decrease guests"
              >
                <Minus size={20} strokeWidth={1.5} />
              </button>
              <input
                id="guests"
                name="guests"
                type="number"
                min={MIN_GUESTS}
                max={MAX_GUESTS}
                value={form.guests}
                onChange={handleChange}
                required
                className="reserve-stepper-value h-14"
              />
              <button
                type="button"
                onClick={() => adjustGuests(1)}
                disabled={form.guests >= MAX_GUESTS}
                className="reserve-stepper-btn h-14 w-14 rounded-r-xl"
                aria-label="Increase guests"
              >
                <Plus size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="fullName" className="reserve-label">
              <User size={16} strokeWidth={1.5} />
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
              className="reserve-input"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="reserve-label">
              <Mail size={16} strokeWidth={1.5} />
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
              className="reserve-input"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="phone" className="reserve-label">
              <Phone size={16} strokeWidth={1.5} />
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
              className="reserve-input"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2 md:col-span-2">
            <label htmlFor="notes" className="reserve-label">
              <FileText size={16} strokeWidth={1.5} />
              Notes / Occasion
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Birthday, anniversary, dietary restrictions..."
              className="reserve-input resize-none"
            />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="h-px bg-cream/10" />

        <motion.div variants={itemVariants}>
          <StripeCardSection />
        </motion.div>

        {status === 'error' && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="polite"
            className="rounded-xl border border-red-400/40 bg-red-500/12 px-4 py-3 text-base text-red-200"
          >
            {errorMessage}
          </motion.div>
        )}

        {!stripePublishableKey && (
          <motion.div
            variants={itemVariants}
            className="rounded-xl border border-sunset-orange/30 bg-sunset-orange/10 px-4 py-3 text-sm text-sunset-orange"
          >
            <strong>Demo setup:</strong> add your{' '}
            <code className="rounded bg-cream/10 px-1 py-0.5">{STRIPE_PUBLISHABLE_KEY_ENV}</code> to
            a <code className="rounded bg-cream/10 px-1 py-0.5">.env</code> file to activate the
            real Stripe card form.
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={status === 'processing'}
            className="reserve-submit-button"
          >
            {status === 'processing' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-cream/30 border-t-cream" />
                Processing…
              </span>
            ) : (
              <span>Authorize ${DEPOSIT_AMOUNT} Deposit</span>
            )}
          </button>
        </motion.div>
      </motion.div>

      {/* Summary */}
      <motion.div
        className="lg:col-span-4"
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <ReservationSummary data={form} eventLabel={selectedEvent.label} />
      </motion.div>
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
