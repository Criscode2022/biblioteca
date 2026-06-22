/**
 * Cloud mode is entirely optional. When the three environment variables below
 * are present at build time, the app offers an online "Nube" mode backed by
 * Neon Auth + the Neon Data API. Otherwise it runs fully offline (localStorage),
 * exactly as before.
 */
export const cloudConfig = {
  stackProjectId: import.meta.env.VITE_STACK_PROJECT_ID,
  stackPublishableClientKey: import.meta.env.VITE_STACK_PUBLISHABLE_CLIENT_KEY,
  dataApiUrl: import.meta.env.VITE_NEON_DATA_API_URL,
};

export const isCloudConfigured = Boolean(
  cloudConfig.stackProjectId &&
    cloudConfig.stackPublishableClientKey &&
    cloudConfig.dataApiUrl,
);
