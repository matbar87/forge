// Files in public/ live at the site root, but pages can be served from a
// subfolder too (the event app at /app), so a plain './file.svg' would
// resolve against the wrong directory there. Resolve against this module's
// own URL instead: in a build it sits in /assets/, in dev in /src/ — either
// way '../' is the site root, regardless of which page imported it.
const moduleUrl = import.meta.url;

export const publicUrl = (path: string) => new URL(`../${path}`, moduleUrl).href;
