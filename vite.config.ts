import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { generateSW, type RuntimeCaching } from 'workbox-build';
import { resolve } from 'node:path';

// Shared by both service workers. Each one gets its own cache names
// (prefix), so the main site's and the event app's caches stay independent.
const runtimeCaching = (prefix: string): RuntimeCaching[] => [
  {
    urlPattern: /\/intro\.mp4$/,
    handler: 'CacheFirst',
    options: {
      cacheName: `${prefix}hero-video`,
      expiration: { maxEntries: 1, maxAgeSeconds: 60 * 60 * 24 * 30 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: `${prefix}google-fonts-stylesheets`,
      expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
    },
  },
  {
    urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: `${prefix}google-fonts-webfonts`,
      expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
];

// Default globPatterns only picks up JS/CSS/HTML — the brand SVGs, gallery
// photos and PNG icons living in public/ need to be listed explicitly to end
// up in the offline app shell. The hero background video is large and
// streamed, so it's deliberately left out and cached lazily at runtime.
const ASSET_GLOB = '**/*.{js,css,html,svg,png,webp,ico,woff2}';

// The event app (/app/) gets its own service worker at /app/sw.js, scoped to
// /app/, so the main site's service worker contains nothing about it. It's
// generated after the build from the finished dist/ output: app/index.html
// and its manifest, plus the shared JS/CSS bundles and public assets one
// level up (precache URLs are relative to the worker, hence the '../').
const eventAppServiceWorker = (): Plugin => {
  let outDir = 'dist';
  return {
    name: 'event-app-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const { count, warnings } = await generateSW({
        globDirectory: outDir,
        globPatterns: [ASSET_GLOB, 'app/manifest.webmanifest'],
        globIgnores: ['index.html', 'sw.js', 'workbox-*.js', 'app/sw.js', 'manifest.webmanifest'],
        manifestTransforms: [
          async (entries) => ({
            manifest: entries.map((e) => ({
              ...e,
              url: e.url.startsWith('app/') ? e.url.slice('app/'.length) : `../${e.url}`,
            })),
            warnings: [],
          }),
        ],
        swDest: resolve(outDir, 'app/sw.js'),
        inlineWorkboxRuntime: true,
        sourcemap: false,
        mode: 'production',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // Any navigation inside /app/ (e.g. with a query string) falls back
        // to the event app's own page, also offline.
        navigateFallback: 'index.html',
        runtimeCaching: runtimeCaching('app-'),
      });
      warnings.forEach((w) => console.warn(w));
      console.log(`event app service worker: precache ${count} entries -> app/sw.js`);
    },
  };
};

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      // The generated registerSW.js uses document-relative paths and only
      // knows about one worker. Registration is done in src/pwaUpdate.ts
      // instead: the main site registers /sw.js, the event app /app/sw.js.
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
        globPatterns: [ASSET_GLOB],
        // The event app has its own worker; keep its files out of this one.
        globIgnores: ['app/**'],
        // The main site is a single page, precached as index.html (which
        // also serves '/'). No catch-all fallback: it would otherwise hand
        // the main page to navigations elsewhere on the origin.
        navigateFallback: null,
        runtimeCaching: runtimeCaching(''),
      },
    }),
    eventAppServiceWorker(),
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
