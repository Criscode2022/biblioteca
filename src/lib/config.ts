/**
 * Cloud mode is entirely optional. When both environment variables below are
 * present at build time, the app offers an online "Nube" mode backed by
 * Neon Auth + the Neon Data API. Otherwise it runs fully offline (localStorage),
 * exactly as before.
 */
export const cloudConfig = {
  neonAuthUrl: import.meta.env.VITE_NEON_AUTH_URL,
  dataApiUrl: import.meta.env.VITE_NEON_DATA_API_URL,
};

export const isCloudConfigured = Boolean(
  cloudConfig.neonAuthUrl && cloudConfig.dataApiUrl,
);
