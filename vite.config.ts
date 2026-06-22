import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from the domain root on Netlify.
  base: "/",
  build: {
    // The optional Neon Auth SDK is sizeable; keep build output quiet.
    chunkSizeWarningLimit: 1600,
  },
});
