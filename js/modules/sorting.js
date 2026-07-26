import { SORT_OPTIONS } from '../core/constants.js';

// ---------------------------------------------
// Sorting — pure functions, takes an array + sort key, returns a new sorted array
// Used by shop.html's sort dropdown, feeds off applyFilters() output
// ---------------------------------------------

const SORTERS = {
  [SORT_OPTIONS.FEATURED]: (products) => products, // preserves dataset's natural/curated order

  [SORT_OPTIONS.PRICE_LOW_HIGH]: (products) =>
    [...products].sort((a, b) => a.price - b.price),

  [SORT_OPTIONS.PRICE_HIGH_LOW]: (products) =>
    [...products].sort((a, b) => b.price - a.price),

  [SORT_OPTIONS.RATING]: (products) =>
    [...products].sort((a, b) => b.rating - a.rating),

  [SORT_OPTIONS.NEWEST]: (products) =>
    [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),

  [SORT_OPTIONS.NAME_A_Z]: (products) =>
    [...products].sort((a, b) => a.name.localeCompare(b.name)),
};

/** Sort a product array by a SORT_OPTIONS key. Falls back to FEATURED (no-op) if unknown. */
export function sortProducts(products, sortKey) {
  const sorter = SORTERS[sortKey] ?? SORTERS[SORT_OPTIONS.FEATURED];
  return sorter(products);
}

/** Validate a sort key came from a trusted source (e.g. URL query param) before using it */
export function isValidSortKey(key) {
  return Object.values(SORT_OPTIONS).includes(key);
}