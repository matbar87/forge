import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // The generated registerSW.js uses document-relative paths, which
      // would point at /app/sw.js from the event app. Registration is done
      // in src/pwaUpdate.ts instead, always against the site root.
      injectRegister: false,
      manifest: {
        name: 'Kuźnia / Forge — Męski Wyjazd',
        short_name: 'Kuźnia',
        description: 'Męski Wyjazd Kuźnia / Forge (Men\'s Camp): 12 - 14 listopada. Trzy dni formacji, braterstwa, wyzwań i odpoczynku.',
        lang: 'pl',
        start_url: './',
        scope: './',
        display: 'standalone',
        theme_color: '#18212C',
        background_color: '#121820',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // Default globPatterns only picks up JS/CSS/HTML — the brand SVGs,
        // gallery photos and PNG icons living in public/ need to be listed
        // explicitly to end up in the offline app shell. The hero background
        // video is large and streamed, so it's deliberately left out here
        // and cached lazily at runtime instead (see runtimeCaching below).
        // The event app's own manifest (public/app/manifest.webmanifest) is
        // added here too, so it can still be installed while offline.
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,woff2}', 'app/manifest.webmanifest'],
        // Offline navigations fall back to the main site's index.html — but
        // never for the event app, which has its own precached page
        // (app/index.html, served for /app/). Without this, opening /app
        // (no trailing slash, or with a query string — not an exact
        // precache hit) would render the main site instead. Those requests
        // are handled by the network-first 'event-app-pages' route below.
        navigateFallbackDenylist: [/\/app(\/|$)/],
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              request.mode === 'navigate' && /\/app\/?$/.test(url.pathname),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'event-app-pages',
              expiration: { maxEntries: 5 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /\/intro\.mp4$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'hero-video',
              expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      // Two pages from one codebase: the main site, and the standalone
      // event app at /app/ (always in the in-event view, see App's
      // alwaysLive). They share components, translations and the schedule.
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app/index.html'),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all'
  }
});
