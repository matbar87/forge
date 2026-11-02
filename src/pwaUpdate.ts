// The generated service worker calls skipWaiting()+clientsClaim(), so a new
// deploy takes control of already-open tabs automatically — but the page's
// already-running JS doesn't know that happened, so without this it would
// keep serving stale content until the visitor manually reloads. Reload
// once when a new worker takes over, and proactively check for updates
// (navigation-triggered checks alone can leave a long-lived open tab, or a
// backgrounded installed PWA, stuck on an old build for a while).
import { publicUrl } from './publicUrl';

export function setupPwaAutoReload() {
  // No service worker is generated in dev (`npm run dev`).
  if (import.meta.env.DEV || !('serviceWorker' in navigator)) return;

  // Each page has its own service worker. A page can name its own worker
  // and scope on <html data-sw="…" data-sw-scope="…"> (the event app does);
  // otherwise it's the main site's worker at the site root. Keeping those
  // names in the page itself means this bundle, which both pages share,
  // doesn't mention the event app's files.
  const { sw, swScope } = document.documentElement.dataset;
  const swUrl = sw ? new URL(sw, document.baseURI).href : publicUrl('sw.js');
  const scope = sw ? new URL(swScope ?? './', document.baseURI).href : publicUrl('');
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl, { scope })
      .catch((err) => console.error('Service worker registration failed', err));
  });

  // clientsClaim() makes the very first service worker install also fire
  // 'controllerchange' — not just later updates — so reloading unconditionally
  // on that event caused an unwanted reload on every first-ever visit. Only
  // reload when an older controller is being replaced by a newer one (a
  // real update); never on the initial hand-off from no controller at all.
  const hadControllerAtLoad = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded || !hadControllerAtLoad) return;
    reloaded = true;
    window.location.reload();
  });

  const checkForUpdate = () => {
    navigator.serviceWorker.getRegistration(scope).then((reg) => reg?.update());
  };

  window.addEventListener('load', checkForUpdate);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate();
  });
  setInterval(checkForUpdate, 60 * 60 * 1000);
}
