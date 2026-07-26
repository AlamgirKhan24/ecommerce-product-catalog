// ---------------------------------------------
// Throttle — ensures a function runs at most once per interval
// Used by: scroll listeners (navbar shrink-on-scroll), resize handlers
// ---------------------------------------------

/**
 * @param {Function} fn - function to throttle
 * @param {number} limit - minimum ms between calls
 */
export function throttle(fn, limit = 200) {
  let waiting = false;
  let lastArgs = null;

  return function throttled(...args) {
    if (!waiting) {
      fn.apply(this, args);
      waiting = true;

      setTimeout(() => {
        waiting = false;
        // if a call came in during the wait window, run it with the latest args
        if (lastArgs) {
          fn.apply(this, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}