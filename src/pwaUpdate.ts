// The generated service worker calls skipWaiting()+clientsClaim(), so a new
// deploy takes control of already-open tabs automatically — but the page's
// already-running JS doesn't know that happened, so without this it would
// keep serving stale content until the visitor manually reloads. Reload
// once when a new worker takes over, and proactively check for updates
// (navigation-triggered checks alone can leave a long-lived open tab, or a
// backgrounded installed PWA, stuck on an old build for a while).
import { publicUrl } from './publicUrl';

export function setupPwaAutoReload(isEventApp: boolean) {
  // No service worker is generated in dev (`npm run dev`).
  if (import.meta.env.DEV || !('serviceWorker' in navigator)) return;

  // Each page has its own service worker: the main site's at the site root,
  // the event app's next to its own page (scoped to that folder only). The
  // event app's is resolved relative to the document rather than spelled
  // out here, since this bundle is shared with the main site.
  const swUrl = isEventApp ? new URL('sw.js', document.baseURI).href : publicUrl('sw.js');
  const scope = isEventApp ? new URL('./', document.baseURI).href : publicUrl('');
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
