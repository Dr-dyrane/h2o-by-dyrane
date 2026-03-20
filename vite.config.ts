import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,
      includeAssets: ["favicon.ico", "robots.txt", "/icons/*.png", "og-image.png"],
      manifest: {
        name: "Dyrane",
        short_name: "Dyrane",
        description:
          "Premium websites, AI tools, and custom platforms designed to make products easier to understand, easier to trust, and easier to use.",
        start_url: "/",
        display: "standalone",
        background_color: "#fbf5ee",
        theme_color: "#fbf5ee",
        orientation: "portrait",
        scope: "/",
        lang: "en",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        categories: ["business", "productivity", "technology"],
        screenshots: [
          {
            src: "/og-image.png",
            sizes: "1200x630",
            type: "image/png",
            form_factor: "wide",
            label: "Dyrane - Premium websites, AI tools, and custom platforms",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: null,
        globPatterns: ["**/*.{js,css,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
