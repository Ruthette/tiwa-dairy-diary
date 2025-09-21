// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      '37433696fb18.ngrok-free.app', // your ngrok hostname
    ],
  },
  plugins: [
    react(),
    // Your componentTagger plugin here if you need it.
    // It's not a standard Vite plugin, so you'll need to define it.
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    target: "esnext",
    minify: "esbuild",
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          supabase: ["@supabase/supabase-js", "@tanstack/react-query"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "react-hook-form",
            "@hookform/resolvers",
            "zod",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    target: "esnext",
    drop: ["console", "debugger"],
  },
}));