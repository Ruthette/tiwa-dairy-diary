import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist", // ✅ Changed this to the standard 'dist' folder
    target: "esnext",
    minify: "esbuild",
    sourcemap: false, // ⬇️ Set to false for faster builds and smaller output
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"], // ✅ Grouped core dependencies
          supabase: ["@supabase/supabase-js", "@tanstack/react-query"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "react-hook-form",
            "@hookform/resolvers",
            "zod",
          ], // ✅ Grouped remaining dependencies
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    target: "esnext",
    drop: ["console", "debugger"],
  },
});