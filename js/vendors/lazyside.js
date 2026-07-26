// ---------------------------------------------
// lazysizes — lazy image loading configuration
// Requires the lazysizes UMD bundle loaded globally (via CDN <script>,
// ideally with the `async` attribute) before this runs
// ---------------------------------------------

/**
 * lazysizes works automatically on any <img class="lazyload" data-src="...">
 * once the script tag is present — no manual init call needed. This file just
 * configures its global options and adds a nice fade-in once each image loads.
 */
export function configureLazySizes() {
  // lazySizesConfig must exist *before* the lazysizes script parses,
  // so if you control script order, define this in a small inline
  // <script> before the lazysizes <script src="..."> tag instead.
  // Keeping it here too as a safe fallback if lazysizes reads it late.
  window.lazySizesConfig = window.lazySizesConfig || {};
  Object.assign(window.lazySizesConfig, {
    loadMode: 2, // load images even slightly outside the viewport, on any network
    expand: 200, // px margin around viewport to start loading early
  });
}

/**
 * Fade images in smoothly once lazysizes finishes loading them,
 * instead of the default hard "pop-in".
 */
export function initLazyFadeIn() {
  document.addEventListener('lazyloaded', (e) => {
    e.target.classList.add('is-loaded');
  });
}

/**
 * Force lazysizes to re-scan the DOM for new `.lazyload` images —
 * call this after productgrid.js renders a fresh batch of product cards,
 * since lazysizes only auto-detects images present at parse time.
 */
export function rescanLazyImages() {
  document.dispatchEvent(new Event('lazyloadUpdate'));
}

/** Bootstrap — call once from app.js */
export function initLazyLoad() {
  configureLazySizes();
  initLazyFadeIn();
}