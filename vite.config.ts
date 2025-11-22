import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Handle Node.js built-in modules
    conditions: ['node'],
  },
  build: {
    rollupOptions: {
      external: ['mysql2', 'mysql2/promise', 'buffer', 'stream', 'events'],
    }
  },
  // Handle Node.js built-in modules
  define: {
    global: 'globalThis',
  }
});