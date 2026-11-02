// Loaded by the repository-root 404.html (GitHub Pages' not-found page).
// A page that's a plain .html file (foo.html, served at /foo) answers 404
// when opened as /foo/ — retry once without the trailing slash. Paths that
// don't end in a slash are left alone, so a real 404 can't loop.
(function () {
  var path = location.pathname;
  if (!/[^/]\/+$/.test(path)) return;
  location.replace(path.replace(/\/+$/, '') + location.search + location.hash);
})();
