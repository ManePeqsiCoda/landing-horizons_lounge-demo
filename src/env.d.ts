/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_STRIPE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
