import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/auth': 'http://localhost:5000',
      '/users': 'http://localhost:5000',
      '/analysis': 'http://localhost:5000',
      '/explain': 'http://localhost:5000',
      '/roadmap': 'http://localhost:5000',
      '/generator': 'http://localhost:5000',
      '/interview': 'http://localhost:5000',
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
