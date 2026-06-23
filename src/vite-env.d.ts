/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Neon Auth base URL (Better Auth endpoint). */
  readonly VITE_NEON_AUTH_URL?: string;
  /** Neon Data API base URL (PostgREST endpoint). */
  readonly VITE_NEON_DATA_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
