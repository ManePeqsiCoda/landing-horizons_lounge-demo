/**
 * Single source of truth for public contact / booking CTAs.
 * Values marked TODO_CLIENTE must be replaced with real client data before production.
 * OpenTable is intentionally not wired to a live URL in this prototype — UI triggers a demo notice.
 */

/** Internal reservation flow (implemented). */
export const RESERVE_PATH = '/reserve';

/**
 * OpenTable is not integrated in this prototype.
 * CTAs use `data-opentable-demo` and show OpenTableNotice instead of navigating away.
 */
export const OPENTABLE_INTEGRATED = false;

export const OPENTABLE_DEMO_MESSAGE =
  'In the final product, this action would open OpenTable for instant table confirmation. OpenTable is not connected in this prototype.';

/** E.164 digits only, no "+". Replace before production. */
export const WHATSAPP_E164 = 'TODO_CLIENTE';

export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_E164}`;

/** Display string for phone; replace before production. */
export const PHONE_DISPLAY = 'TODO_CLIENTE';

export const PHONE_HREF = `tel:${PHONE_DISPLAY.replace(/\s/g, '')}`;

/**
 * Email shown in footer / mailto.
 * Current value is the prototype placeholder — confirm with client (may remain or become TODO_CLIENTE).
 */
export const EMAIL = 'reservations@horizonsaruba.com';

export const EMAIL_HREF = `mailto:${EMAIL}`;

export const SOCIAL = {
  instagram: { label: 'Instagram', href: 'TODO_CLIENTE' },
  facebook: { label: 'Facebook', href: 'TODO_CLIENTE' },
  tiktok: { label: 'TikTok', href: 'TODO_CLIENTE' },
} as const;

export const LEGAL = {
  privacy: { label: 'Privacy Policy', href: 'TODO_CLIENTE' },
  terms: { label: 'Terms of Use', href: 'TODO_CLIENTE' },
  accessibility: { label: 'Accessibility', href: 'TODO_CLIENTE' },
} as const;
