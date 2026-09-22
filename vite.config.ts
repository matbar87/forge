import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
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
        globPatterns: ['**/*.{js,css,html,svg,png,webp,ico,woff2}'],
        runtimeCaching: [
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
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all'
  }
});
