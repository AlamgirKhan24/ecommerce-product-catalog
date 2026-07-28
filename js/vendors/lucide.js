// ---------------------------------------------
// Lucide Icons — initialization
// Requires the Lucide UMD bundle loaded globally before this runs.
// Renders every <i data-lucide="..."> element into an inline SVG.
// ---------------------------------------------

/** Initialize (or re-scan) Lucide icons. Safe to call multiple times —
 *  e.g. after dynamically rendering product cards, testimonials, etc. */
export function initLucideIcons() {
  if (typeof window.lucide === 'undefined') {
    console.warn('[lucide] library not loaded — check the CDN script tag in <head>/<body>.');
    return;
  }
  window.lucide.createIcons();
}