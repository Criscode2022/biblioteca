import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";
import { cloudConfig, isCloudConfigured } from "./config";

export type NeonBooksClient = ReturnType<typeof createClient>;

/**
 * Neon Auth + Data API client. Only instantiated when cloud mode is configured;
 * in offline-only builds it stays `null` and no auth code runs.
 */
export const neonClient: NeonBooksClient | null = isCloudConfigured
  ? createClient({
      auth: {
        adapter: BetterAuthReactAdapter(),
        url: cloudConfig.neonAuthUrl!,
      },
      dataApi: {
        url: cloudConfig.dataApiUrl!,
      },
    })
  : null;
