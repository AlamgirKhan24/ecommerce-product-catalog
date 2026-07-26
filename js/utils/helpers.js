// ---------------------------------------------
// Generic helpers — small pure functions with no single home elsewhere
// ---------------------------------------------

/** Generate a reasonably unique ID (cart line items, toast IDs, etc.) */
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** Deep clone a plain object/array (structuredClone fallback for older browsers) */
export function deepClone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

/** Clamp a number between min and max */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Group an array of objects by a key or key-function. Returns a Map. */
export function groupBy(array, keyOrFn) {
  const getKey = typeof keyOrFn === 'function' ? keyOrFn : (item) => item[keyOrFn];
  return array.reduce((map, item) => {
    const key = getKey(item);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(item);
    return map;
  }, new Map());
}

/** Return unique values from an array, optionally by a key */
export function uniqueBy(array, keyOrFn) {
  const getKey = typeof keyOrFn === 'function' ? keyOrFn : (item) => item[keyOrFn];
  const seen = new Set();
  return array.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Sum a numeric field across an array of objects */
export function sumBy(array, keyOrFn) {
  const getValue = typeof keyOrFn === 'function' ? keyOrFn : (item) => item[keyOrFn];
  return array.reduce((total, item) => total + (Number(getValue(item)) || 0), 0);
}

/** Shallow-compare two objects by their own enumerable keys */
export function shallowEqual(a, b) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

/** Wait N ms — useful for staggered animations or simulated loading states */
export function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Safely get a nested property by dot-path: getPath(obj, 'a.b.c', fallback) */
export function getPath(obj, path, fallback = undefined) {
  const result = path
    .split('.')
    .reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
  return result === undefined ? fallback : result;
}

/** Shuffle an array without mutating the original (Fisher–Yates) */
export function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Read URL query params as a plain object */
export function getQueryParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

/** Update the URL query string without a full page reload (for filter/sort state) */
export function setQueryParams(params, { replace = true } = {}) {
  const url = new URL(window.location.href);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
}