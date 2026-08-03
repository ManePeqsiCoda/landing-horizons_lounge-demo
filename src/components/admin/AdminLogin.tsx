import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, UserRound } from 'lucide-react';

const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'horizons',
};

interface AdminLoginProps {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (
      username.trim() === DEMO_CREDENTIALS.username &&
      password === DEMO_CREDENTIALS.password
    ) {
      setError(null);
      onSuccess();
    } else {
      setError('Invalid credentials. Try the demo login below.');
    }
  };

  const handleAutofill = () => {
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      {/* Backdrop — shows the dashboard blurred behind */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#fcf9f4]/95 via-[#f6efe6]/90 to-[#fff8f0]/95 backdrop-blur-md"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="admin-card relative z-10 w-full max-w-md p-8 lg:p-10"
      >
        <p className="admin-sidebar-kicker">Horizons Lounge Aruba</p>
        <h1 className="admin-section-title mt-1">Admin login</h1>
        <p className="admin-section-sub mt-2">
          The Sunset Ritual dashboard — staff access only.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <div>
            <label
              htmlFor="admin-username"
              className="admin-stat-label mb-2 block"
            >
              Username
            </label>
            <div className="relative">
              <UserRound
                size={18}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-subtle)]"
              />
              <input
                id="admin-username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="admin-input w-full py-3 pl-11! pr-4"
                placeholder="Username"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="admin-stat-label mb-2 block"
            >
              Password
            </label>
            <div className="relative">
              <LockKeyhole
                size={18}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--admin-subtle)]"
              />
              <input
                id="admin-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="admin-input w-full py-3 pl-11! pr-4"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-[var(--admin-cancel)]/8 px-4 py-3 text-sm font-medium text-[var(--admin-cancel)]"
            >
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleAutofill}
            className="admin-button admin-button-secondary w-full py-3"
          >
            Autofill demo credentials
          </button>

          <button type="submit" className="admin-button admin-button-primary w-full py-3">
            Sign in
          </button>
        </form>

        <div className="mt-8 border-t border-[var(--admin-line)] pt-5 text-center">
          <p className="text-xs font-semibold tracking-[0.14em] text-[var(--admin-subtle)] uppercase">
            Demo login
          </p>
          <p className="admin-number mt-1.5 text-sm font-bold text-[var(--admin-ink)]">
            admin&nbsp;&nbsp;/&nbsp;&nbsp;horizons
          </p>
        </div>
      </motion.div>
    </div>
  );
}
