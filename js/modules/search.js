import { buildSearchIndex, searchProducts, isIndexReady } from '../vendors/fuse.js';
import { debounce } from '../utils/debounce.js';
import { CONFIG } from '../core/config.js';
import { EVENTS } from '../core/constants.js';

// ---------------------------------------------
// Search — wraps vendors/fuse.js with debounced input handling
// and dispatches a DOM event so any page can react (navbar dropdown,
// dedicated shop.html search results, etc.)
// ---------------------------------------------

let allProducts = [];

/** Call once after product.json loads (from app.js) to build the searchable index */
export function initSearchIndex(products) {
  allProducts = products;
  buildSearchIndex(products);
}

/** Run a search immediately (no debounce) — used for "Enter key" or programmatic search */
export function runSearch(query) {
  if (!isIndexReady()) return [];

  const trimmed = query.trim();
  if (!trimmed) return [];

  const results = searchProducts(trimmed);

  document.dispatchEvent(
    new CustomEvent(EVENTS.FILTERS_CHANGED, {
      detail: { type: 'search', query: trimmed, results },
    })
  );

  return results;
}

/** Debounced version — attach directly to a search <input>'s 'input' event */
export const debouncedSearch = debounce(runSearch, CONFIG.search.debounceMs);

/**
 * Wire up a search input element: debounced live results as the user types,
 * plus immediate search on Enter key.
 * @param {string} selector - e.g. '.js-search-input'
 * @param {Function} onResults - callback(results, query) to render dropdown/grid
 */
export function bindSearchInput(selector, onResults) {
  const input = document.querySelector(selector);
  if (!input) return;

  input.addEventListener('input', (e) => {
    const query = e.target.value;
    if (query.trim().length < CONFIG.search.minChars) {
      onResults([], query);
      return;
    }
    const results = debouncedSearch(query);
    // debounce fires async, so also call onResults from the event listener below
    document.addEventListener(
      EVENTS.FILTERS_CHANGED,
      (evt) => {
        if (evt.detail.type === 'search') onResults(evt.detail.results, evt.detail.query);
      },
      { once: true }
    );
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const results = runSearch(input.value);
      onResults(results, input.value);
    }
  });
}

/** Get recently-added-to-index product count — small sanity check for debugging */
export function getIndexedCount() {
  return allProducts.length;
}