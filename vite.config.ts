/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      includeAssets: ["vite.svg"],

      manifest: {
        name: "Omni-ERP — Enterprise Suite",
        short_name: "Omni-ERP",
        description:
          "Plateforme de gestion d'entreprise : projets, RH, clients, stocks et analytics.",
        lang: "fr",
        start_url: "/dashboard",
        scope: "/",
        display: "standalone",
        background_color: "#0c1326",
        theme_color: "#6366f1",
        icons: [
          {
            src: "pwa-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,webp,woff2}"],

        runtimeCaching: [
          {
            // Catalogue distant : on sert le cache d'abord pour que
            // l'application reste consultable hors ligne.
            urlPattern: /^https:\/\/dummyjson\.com\/.*/,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "dummyjson",
              expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/cdn\.dummyjson\.com\/.*/,
            handler: "CacheFirst",
            options: {
              cacheName: "dummyjson-images",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Données locales : le réseau fait foi, le cache sert de repli.
            urlPattern: /^http:\/\/localhost:3000\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "json-server",
              networkTimeoutSeconds: 3,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      devOptions: {
        // Désactivé en développement : le service worker masquerait le HMR
        enabled: false,
      },
    }),
  ],

  test: {
    environment: "jsdom",
    // jsdom n'active localStorage que sur une origine définie
    environmentOptions: { jsdom: { url: "http://localhost:5173" } },
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: false,

    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/main.tsx",
        "src/test/**",
        "src/**/*.types.ts",
        "src/app/router.tsx",
      ],
    },
  },
});
