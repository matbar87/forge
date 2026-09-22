// The generated service worker calls skipWaiting()+clientsClaim(), so a new
// deploy takes control of already-open tabs automatically — but the page's
// already-running JS doesn't know that happened, so without this it would
// keep serving stale content until the visitor manually reloads. Reload
// once when a new worker takes over, and proactively check for updates
// (navigation-triggered checks alone can leave a long-lived open tab, or a
// backgrounded installed PWA, stuck on an old build for a while).
export function setupPwaAutoReload() {
  if (!('serviceWorker' in navigator)) return;

  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloaded) return;
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
