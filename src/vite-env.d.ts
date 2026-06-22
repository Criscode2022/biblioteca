/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Neon Auth (Stack) project id. */
  readonly VITE_STACK_PROJECT_ID?: string;
  /** Neon Auth (Stack) publishable client key. */
  readonly VITE_STACK_PUBLISHABLE_CLIENT_KEY?: string;
  /** Neon Data API base URL (PostgREST endpoint). */
  readonly VITE_NEON_DATA_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
