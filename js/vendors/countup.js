// ---------------------------------------------
// CountUp.js — animated number counters
// Requires the CountUp UMD bundle loaded globally before this runs
// Trigger on scroll-into-view so numbers animate when the user actually sees them
// ---------------------------------------------

const activeCounters = new Map();

/**
 * Initialize a single counter on an element.
 * Expects the element to have data-countup-end (and optionally
 * data-countup-prefix / data-countup-suffix / data-countup-decimals).
 */
function createCounter(el) {
  if (typeof window.CountUp === 'undefined') return null;

  const end = Number(el.dataset.countupEnd ?? el.textContent.replace(/[^\d.]/g, ''));
  const prefix = el.dataset.countupPrefix ?? '';
  const suffix = el.dataset.countupSuffix ?? '';
  const decimals = Number(el.dataset.countupDecimals ?? 0);

  const counter = new window.CountUp(el, end, {
    duration: 2,
    prefix,
    suffix,
    decimalPlaces: decimals,
    useEasing: true,
    useGrouping: true,
  });

  if (!counter.error) {
    activeCounters.set(el, counter);
  } else {
    console.warn('[countup]', counter.error);
  }

  return counter;
}

/**
 * Find all `[data-countup-end]` elements on the page and animate them
 * once each scrolls into view, using IntersectionObserver so we don't
 * fire counters that are off-screen on load.
 */
export function initCountUps(selector = '[data-countup-end]') {
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        if (!activeCounters.has(el)) {
          const counter = createCounter(el);
          counter?.start();
        }
        obs.unobserve(el);
      });
    },
    { threshold: 0.4 }
  );

  elements.forEach((el) => observer.observe(el));
}