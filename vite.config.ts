import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Minimal + reliable for Netlify
export default defineConfig({
  plugins: [react()],
  base: "/", // important for Netlify at domain root
  build: {
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
  },
});
