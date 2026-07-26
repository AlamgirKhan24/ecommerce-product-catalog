import { initCountUps } from '../vendors/countup.js';

// ---------------------------------------------
// Statistics — derives real numbers from the actual dataset
// instead of hardcoding "5m+ Downloads" style stats in HTML,
// then feeds them into CountUp.js for the animated reveal.
// ---------------------------------------------

/** Compute site-wide stats from the loaded product/review data */
export function computeSiteStats({ products = [], reviews = [] } = {}) {
  const totalProducts = products.length;

  const avgRating = products.length
    ? products.reduce((sum, p) => sum + (p.rating ?? 0), 0) / products.length
    : 0;

  const totalReviews = reviews.length || products.reduce((sum, p) => sum + (p.reviewCount ?? 0), 0);

  const totalStock = products.reduce((sum, p) => sum + (p.stock ?? 0), 0);

  return {
    totalProducts,
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews,
    totalStock,
  };
}

/**
 * Push computed stats into the DOM's data-countup-end attributes
 * before triggering the CountUp animation, so the numbers shown
 * are real instead of whatever placeholder is in the HTML.
 */
export function renderSiteStats(stats, mountSelector = '[data-stat]') {
  document.querySelectorAll(mountSelector).forEach((el) => {
    const key = el.dataset.stat; // e.g. data-stat="totalReviews"
    if (stats[key] !== undefined) {
      el.dataset.countupEnd = stats[key];
    }
  });
}

/** Bootstrap — call once from app.js after product/review data has loaded */
export function initStatistics(data) {
  const stats = computeSiteStats(data);
  renderSiteStats(stats);
  initCountUps();
  return stats;
}