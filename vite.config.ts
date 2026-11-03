import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import { generateSW, type RuntimeCaching } from 'workbox-build';
import { resolve } from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';

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

// The event app is a plain file, app.html, not app/index.html: hosts like
// GitHub Pages serve /app from app.html directly, whereas a directory would
// be answered with a 301 to /app/ on the host's own domain (breaking a
// proxied deployment such as koscioldlamiasta.pl/kuznia/app).
//
// It gets its own service worker (app-sw.js, scoped to the page, registered
// from app.html's data-sw attributes) and manifest (app.webmanifest), so the
// main site's service worker, manifest and shared JS mention nothing about
// it. The worker is generated after the build from the finished dist/
// output: app.html, app.webmanifest and the shared bundles/public assets.
// app.html's manifest link is pointed at app.webmanifest first, since
// vite-plugin-pwa injects the main manifest into every page.
const EVENT_APP_FILES = ['app.html', 'app.webmanifest', 'app-sw.js'];

// The admin panel (admin.html, served at /admin) is a separate page for
// editing the plan and questions; neither service worker caches it, and the
// main site's files never mention it.
const ADMIN_FILES = ['admin.html', 'assets/admin-*'];

const eventAppServiceWorker = (): Plugin => {
  let outDir = 'dist';
  return {
    name: 'event-app-service-worker',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const htmlPath = resolve(outDir, 'app.html');
      const html = await readFile(htmlPath, 'utf8');
      const fixed = html.replace(
        /<link rel="manifest" href="[^"]*">/,
        '<link rel="manifest" href="./app.webmanifest">'
      );
      if (fixed === html) throw new Error('app.html: manifest link not found');
      await writeFile(htmlPath, fixed);

      // The admin panel isn't an installable app: drop the injected manifest.
      const adminPath = resolve(outDir, 'admin.html');
      const adminHtml = await readFile(adminPath, 'utf8');
      await writeFile(adminPath, adminHtml.replace(/<link rel="manifest" href="[^"]*">/, ''));

      const { count, warnings } = await generateSW({
        globDirectory: outDir,
        globPatterns: [ASSET_GLOB, 'app.webmanifest'],
        globIgnores: ['index.html', 'sw.js', 'workbox-*.js', 'app-sw.js', 'manifest.webmanifest', ...ADMIN_FILES],
        swDest: resolve(outDir, 'app-sw.js'),
        inlineWorkboxRuntime: true,
        sourcemap: false,
        mode: 'production',
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        // /app is served from the precached app.html (Workbox tries the
        // '.html' variant of a clean URL); anything else navigated to within
        // the worker's scope, e.g. /app?ref=x, falls back to it as well.
        navigateFallback: 'app.html',
        navigateFallbackAllowlist: [/\/app(\.html)?(\?.*)?$/],
        runtimeCaching: runtimeCaching('app-'),
      });
      warnings.forEach((w) => console.warn(w));
      console.log(`event app service worker: precache ${count} entries -> app-sw.js`);
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
      // instead: the main site registers /sw.js, the event app app-sw.js.
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
        // A new deploy must take over already-open tabs and installed apps
        // right away (src/pwaUpdate.ts then reloads them once). The plugin
        // only adds these itself when it injects its own registration
        // script, which is turned off above — without them a new worker
        // sits in "waiting" while any old tab is open, and the old worker
        // keeps serving stale pages.
        skipWaiting: true,
        clientsClaim: true,
        // The event app has its own worker; keep its files out of this one.
        globIgnores: [...EVENT_APP_FILES, ...ADMIN_FILES],
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
      // event app at /app (always in the in-event view, see App's
      // alwaysLive). They share components, translations and the schedule.
      input: {
        main: resolve(__dirname, 'index.html'),
        app: resolve(__dirname, 'app.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: 'all'
  }
});
