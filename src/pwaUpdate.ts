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

  // One service worker at the site root serves both pages (main site and
  // the event app at /app/), so always register it there — not relative to
  // whichever page happens to be open.
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(publicUrl('sw.js'), { scope: publicUrl('') })
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
    navigator.serviceWorker.getRegistration().then((reg) => reg?.update());
  };

  window.addEventListener('load', checkForUpdate);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') checkForUpdate();
  });
  setInterval(checkForUpdate, 60 * 60 * 1000);
}
