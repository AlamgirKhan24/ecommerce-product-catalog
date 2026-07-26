// ---------------------------------------------
// Debounce — delays execution until the user stops triggering the event
// Used by: search.js (search-as-you-type), filter.js (price slider input)
// ---------------------------------------------

/**
 * @param {Function} fn - function to debounce
 * @param {number} delay - wait time in ms
 * @param {boolean} immediate - if true, fires on the leading edge instead of trailing
 */
export function debounce(fn, delay = 300, immediate = false) {
  let timeoutId;

  return function debounced(...args) {
    const callNow = immediate && !timeoutId;

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) fn.apply(this, args);
    }, delay);

    if (callNow) fn.apply(this, args);
  };
}