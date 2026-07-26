import { CONFIG } from '../core/config.js';

// ---------------------------------------------
// AOS (Animate On Scroll) — initialization
// Requires the AOS UMD bundle + aos.css loaded globally before this runs
// ---------------------------------------------

let initialized = false;

/** Initialize AOS once, using CONFIG.aos defaults */
export function initAOS() {
  if (typeof window.AOS === 'undefined') return;

  window.AOS.init({
    duration: CONFIG.aos.duration,
    easing: CONFIG.aos.easing,
    once: CONFIG.aos.once,
    offset: CONFIG.aos.offset,
    disable: 'mobile', // skip heavy scroll animations on small screens for performance
  });

  initialized = true;
}

/**
 * Refresh AOS after DOM changes — call this after dynamically rendering
 * product cards (productgrid.js) or filter results, since AOS scans the DOM
 * once on init and won't "see" new elements otherwise.
 */
export function refreshAOS() {
  if (!initialized || typeof window.AOS === 'undefined') return;
  window.AOS.refresh();
}

/** Hard refresh — recalculates element positions too (use after major layout shifts) */
export function refreshAOSHard() {
  if (!initialized || typeof window.AOS === 'undefined') return;
  window.AOS.refreshHard();
}