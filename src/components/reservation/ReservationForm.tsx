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
import CustomSelect from './CustomSelect';
import {
  DEPOSIT_AMOUNT,
  DEPOSIT_CURRENCY,
  MAX_GUESTS,
  MIN_GUESTS,
  RESERVATION_EMAIL,
  RESERVATION_EVENTS,
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
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 12 },
  visible: {
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function StripeCardSection({ onCardChange }: { onCardChange: (complete: boolean) => void }) {
  const stripe = useStripe();
  const elements = useElements();

  if (!stripe || !elements) {
    return (
      <div className="border border-ivory/15 bg-ivory/[0.06] px-4 py-3 text-base text-ivory/85">
        Connecting secure card fields…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label htmlFor="card-element" className="reserve-label flex items-center mx-2">
        <span className="reserve-label-text flex items-center">
          <CreditCard size={16} strokeWidth={1.5} className="mx-2 text-center" />
          Card Details
        </span>
        <div className="reserve-control reserve-card-element w-full border border-ivory/22 bg-ivory/[0.08] px-4 py-4 transition focus-within:border-coral focus-within:bg-ivory/[0.12] focus-within:shadow-[0_0_0_3px_rgba(255,122,69,0.18)]">
          <CardElement
            id="card-element"
            options={cardOptions}
            onChange={(event) => onCardChange(event.complete)}
          />
        </div>
      </label>
      <p className="text-xs font-medium text-ivory/45">
        Test card — 4242 4242 4242 4242, any future date, any CVC.
      </p>
    </div>
  );
}

/** Visual card fields for the prototype when no Stripe publishable key is configured. */
function DemoCardSection({ onCardChange }: { onCardChange: (complete: boolean) => void }) {
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  useEffect(() => {
    const digits = number.replace(/\D/g, '');
    const expOk = /^(0[1-9]|1[0-2])\s*\/\s*\d{2}$/.test(expiry.trim());
    const cvcOk = /^\d{3,4}$/.test(cvc.trim());
    onCardChange(digits.length >= 15 && expOk && cvcOk);
  }, [number, expiry, cvc, onCardChange]);

  const formatNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  const formatExpiry = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
  };

  return (
    <div className="space-y-3">
      <div className="reserve-label flex">
        <span className="reserve-label-text flex items-center mx-2">
          <CreditCard size={16} strokeWidth={1.5} className="mx-2" />
          Card Details
        </span>
        <div className="reserve-control grid w-full gap-3 sm:grid-cols-[1fr_auto_auto]">
          <label className="sr-only" htmlFor="demo-card-number">
            Card number
          </label>
          <input
            id="demo-card-number"
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="Card number"
            value={number}
            onChange={(e) => setNumber(formatNumber(e.target.value))}
            className="reserve-input"
          />
          <label className="sr-only" htmlFor="demo-card-expiry">
            Expiry
          </label>
          <input
            id="demo-card-expiry"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM / YY"
            value={expiry}
            onChange={(e) => setExpiry(formatExpiry(e.target.value))}
            className="reserve-input sm:w-28"
          />
          <label className="sr-only" htmlFor="demo-card-cvc">
            CVC
          </label>
          <input
            id="demo-card-cvc"
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="CVC"
            value={cvc}
            onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
            className="reserve-input sm:w-24"
          />
        </div>
      </div>
      <p className="text-xs font-medium text-ivory/45">
        Prototype demo — deposit is simulated. No real charge is made.
      </p>
    </div>
  );
}

function InnerForm({
  demoMode,
}: {
  demoMode: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
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

  const isFormValid = Boolean(
    form.fullName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      cardComplete &&
      (demoMode || (stripe && elements))
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const eventParam = params.get('event');
    const dateParam = params.get('date');
    const timeParam = params.get('time');
    const guestsParam = params.get('guests');

    setForm((prev) => {
      const next = { ...prev };
      if (eventParam && RESERVATION_EVENTS.some((e) => e.id === eventParam)) {
        next.eventId = eventParam;
      }
      if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam) && dateParam >= todayInputValue()) {
        next.date = dateParam;
      }
      if (timeParam) {
        // Hero bar sends 12h labels ("5:30 PM"); the form uses 24h slots.
        const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(timeParam);
        if (match) {
          let h = Number(match[1]) % 12;
          if (match[3].toUpperCase() === 'PM') h += 12;
          const slot = `${String(h).padStart(2, '0')}:${match[2]}`;
          if ((TIME_SLOTS as readonly string[]).includes(slot)) next.time = slot;
        } else if ((TIME_SLOTS as readonly string[]).includes(timeParam)) {
          next.time = timeParam;
        }
      }
      if (guestsParam) {
        const g = Number(guestsParam);
        if (Number.isFinite(g)) {
          next.guests = Math.max(MIN_GUESTS, Math.min(MAX_GUESTS, g));
        }
      }
      return next;
    });
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

    if (!cardComplete) {
      setErrorMessage('Please complete your card details.');
      setStatus('error');
      return;
    }

    setStatus('processing');

    if (demoMode) {
      await new Promise((resolve) => window.setTimeout(resolve, 650));
      setPaymentMethodId(`pm_demo_${Date.now()}`);
      setStatus('success');
      return;
    }

    if (!stripe || !elements) {
      setErrorMessage('Stripe is not ready. Please refresh and try again.');
      setStatus('error');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage('Card element not found. Please try again.');
      setStatus('error');
      return;
    }

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
        className="border border-ivory/15 bg-teal-night/80 p-8 text-center shadow-2xl md:p-12"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-sunflower/20 shadow-[0_0_40px_rgba(255,215,0,0.25)]">
          <svg
            className="h-10 w-10 text-sunflower"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="mt-6 font-serif text-3xl font-bold tracking-tight text-ivory md:text-4xl">
          Reservation Ready
        </h2>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ivory/85">
          Your demo deposit of{' '}
          <strong className="text-sunflower">${DEPOSIT_AMOUNT} {DEPOSIT_CURRENCY}</strong> has
          been authorized. We are preparing your request to send to Horizons Lounge.
        </p>
        <a
          href={buildMailto(form, paymentMethodId)}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-sunflower px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-pine shadow-lg transition-all hover:-translate-y-0.5 hover:bg-ivory hover:shadow-xl"
        >
          Send request via email
        </a>
        <p className="mt-4 text-xs text-ivory/45">
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
          <label htmlFor="eventId" className="reserve-label flex">
            <span className="reserve-label-text flex items-center mx-2">
              <Calendar size={16} strokeWidth={1.5} className="mx-2"/>
              Experience
            </span>
            <CustomSelect
              id="eventId"
              name="eventId"
              value={form.eventId}
              options={RESERVATION_EVENTS.map((event) => ({
                value: event.id,
                label: event.label,
              }))}
              onChange={(value) => setForm((prev) => ({ ...prev, eventId: value }))}
            />
          </label>

          {/* Date */}
          <label htmlFor="date" className="reserve-label flex">
            <span className="reserve-label-text flex items-center mx-2">
              <Calendar size={16} strokeWidth={1.5} className="mx-2" />
              Date
            </span>
            <input
              id="date"
              name="date"
              type="date"
              min={todayInputValue()}
              value={form.date}
              onChange={handleChange}
              required
              className="reserve-control reserve-input"
            />
          </label>

          {/* Time */}
          <label htmlFor="time" className="reserve-label flex">
            <span className="reserve-label-text flex items-center mx-2">
              <Clock size={16} strokeWidth={1.5} className="mx-2"/>
              Time
            </span>
            <CustomSelect
              id="time"
              name="time"
              value={form.time}
              options={TIME_SLOTS.map((slot) => ({ value: slot, label: slot }))}
              onChange={(value) => setForm((prev) => ({ ...prev, time: value }))}
            />
          </label>

          {/* Guests stepper */}
          <label htmlFor="guests" className="reserve-label md:col-span-2 flex">
            <span className="reserve-label-text flex items-center mx-2">
              <Users size={16} strokeWidth={1.5} className="mx-2"/>
              Guests
            </span>
            <div className="reserve-control flex w-full items-center md:w-64">
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
          </label>

          {/* Full Name */}
          <label htmlFor="fullName" className="reserve-label flex">
            <span className="reserve-label-text flex items-center mx-2">
              <User size={16} strokeWidth={1.5} className="mx-2" />
              Full Name
            </span>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
              className="reserve-control reserve-input"
            />
          </label>

          {/* Email */}
          <label htmlFor="email" className="reserve-label flex">
            <span className="reserve-label-text flex items-center mx-2">
              <Mail size={16} strokeWidth={1.5} className="mx-2"/>
              Email
            </span>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="jane@example.com"
              required
              className="reserve-control reserve-input"
            />
          </label>

          {/* Phone */}
          <label htmlFor="phone" className="reserve-label md:col-span-2 flex">
            <span className="reserve-label-text flex items-center mx-2">
              <Phone size={16} strokeWidth={1.5} className='mx-2' />
              Phone
            </span>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="+297 000 0000"
              required
              className="reserve-control reserve-input"
            />
          </label>

          {/* Notes */}
          <label htmlFor="notes" className="reserve-label flex md:col-span-2">
            <span className="reserve-label-text flex items-center mx-2">
              <FileText size={16} strokeWidth={1.5} className='mx-2'/>
              Notes / Occasion
            </span>
            <textarea
              id="notes"
              name="notes"
              rows={2}
              value={form.notes}
              onChange={handleChange}
              placeholder="Birthday, anniversary, dietary restrictions..."
              className="reserve-control reserve-input resize-none"
            />
          </label>
        </motion.div>

        <motion.div variants={itemVariants} className="h-px bg-ivory/10" />

        <motion.div variants={itemVariants}>
          {demoMode ? (
            <DemoCardSection onCardChange={setCardComplete} />
          ) : (
            <StripeCardSection onCardChange={setCardComplete} />
          )}
        </motion.div>

        {status === 'error' && errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            aria-live="polite"
            className="border border-red-400/40 bg-red-500/12 px-4 py-3 text-base text-red-200"
          >
            {errorMessage}
          </motion.div>
        )}

        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={!isFormValid || status === 'processing'}
            className="reserve-submit-button"
            title={
              isFormValid
                ? 'Complete your reservation'
                : 'Please fill in all required information and card details'
            }
          >
            {status === 'processing' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-ivory/30 border-t-ivory" />
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
        initial={{ x: 16 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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

  return (
    <Elements stripe={keyLooksValid ? loadStripe(stripePublishableKey) : null}>
      <InnerForm demoMode={!keyLooksValid} />
    </Elements>
  );
}
