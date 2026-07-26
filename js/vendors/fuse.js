import { CONFIG } from '../core/config.js';

// ---------------------------------------------
// Fuse.js — fuzzy search index
// Requires the Fuse.js UMD bundle loaded globally before this runs
// ---------------------------------------------

let fuseInstance = null;

/**
 * Build (or rebuild) the search index from the product dataset.
 * Call this once after products load (see core/app.js), and again
 * only if the product list itself changes.
 */
export function buildSearchIndex(products) {
  if (typeof window.Fuse === 'undefined') {
    console.warn('[fuse] Fuse.js not loaded — search will be disabled.');
    return null;
  }

  fuseInstance = new window.Fuse(products, CONFIG.search.fuseOptions);
  return fuseInstance;
}

/**
 * Run a fuzzy search query against the current index.
 * Returns an array of matched product objects (not Fuse's wrapped result shape).
 */
export function searchProducts(query) {
  if (!fuseInstance) {
    console.warn('[fuse] Search index not built yet — call buildSearchIndex() first.');
    return [];
  }

  if (!query || query.trim().length < CONFIG.search.minChars) {
    return [];
  }

  return fuseInstance.search(query.trim()).map((result) => result.item);
}

/** Check whether the index has been built yet */
export function isIndexReady() {
  return fuseInstance !== null;
}