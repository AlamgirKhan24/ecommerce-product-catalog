import { formatPrice } from '../utils/formatter.js';

// ---------------------------------------------
// noUiSlider — price range filter
// Requires the noUiSlider UMD bundle + CSS loaded globally before this runs
// ---------------------------------------------

let sliderInstance = null;

/**
 * Initialize the price range slider inside the filter sidebar.
 * @param {string} selector - the mount element (e.g. '.js-price-slider')
 * @param {object} options
 * @param {number} options.min - lowest price in the current dataset
 * @param {number} options.max - highest price in the current dataset
 * @param {Function} options.onChange - called with [minPrice, maxPrice] as the user drags
 */
export function initPriceSlider(selector, { min = 0, max = 500, onChange } = {}) {
  const el = document.querySelector(selector);
  if (!el || typeof window.noUiSlider === 'undefined') return null;

  // Destroy any previous instance before re-initializing (e.g. dataset changed)
  if (el.noUiSlider) {
    el.noUiSlider.destroy();
  }

  window.noUiSlider.create(el, {
    start: [min, max],
    connect: true,
    range: { min, max },
    step: 1,
    format: {
      to: (value) => Math.round(value),
      from: (value) => Number(value),
    },
  });

  sliderInstance = el.noUiSlider;

  // Live value display, e.g. two <span> elements showing $min - $max
  const [minLabel, maxLabel] = document.querySelectorAll(`${selector}-values span`);

  sliderInstance.on('update', (values) => {
    const [lo, hi] = values;
    if (minLabel) minLabel.textContent = formatPrice(Number(lo));
    if (maxLabel) maxLabel.textContent = formatPrice(Number(hi));
  });

  // Debounced-by-nature "change" event (fires once dragging stops) drives actual filtering
  sliderInstance.on('change', (values) => {
    const [lo, hi] = values.map(Number);
    if (typeof onChange === 'function') onChange([lo, hi]);
  });

  return sliderInstance;
}

/** Reset the slider back to full range — used by the "Clear filters" button */
export function resetPriceSlider(min, max) {
  if (!sliderInstance) return;
  sliderInstance.set([min, max]);
}

/** Get current slider values as numbers */
export function getPriceRange() {
  if (!sliderInstance) return null;
  return sliderInstance.get().map(Number);
}