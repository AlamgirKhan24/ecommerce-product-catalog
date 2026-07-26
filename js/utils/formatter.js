import { CONFIG } from '../core/config.js';

// ---------------------------------------------
// Formatting helpers — currency, dates (Day.js), numbers
// ---------------------------------------------

/** Format a number as currency using CONFIG.currency settings */
export function formatPrice(amount, { showSymbolOnly = false } = {}) {
  const { locale, code } = CONFIG.currency;

  if (typeof amount !== 'number' || Number.isNaN(amount)) return '—';

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    minimumFractionDigits: 2,
  }).format(amount);

  return showSymbolOnly ? formatted.replace(/[A-Z]{3}\s?/, '') : formatted;
}

/** Format a discount percentage from old/new price */
export function formatDiscount(oldPrice, newPrice) {
  if (!oldPrice || oldPrice <= newPrice) return null;
  const percent = Math.round(((oldPrice - newPrice) / oldPrice) * 100);
  return `-${percent}%`;
}

/** Relative/human date formatting — requires dayjs + relativeTime plugin (vendors/dayjs.js) */
export function formatDate(dateInput, pattern = 'MMM D, YYYY') {
  if (typeof window.dayjs !== 'function') return String(dateInput);
  return window.dayjs(dateInput).format(pattern);
}

export function formatRelativeDate(dateInput) {
  if (typeof window.dayjs !== 'function') return String(dateInput);
  return window.dayjs(dateInput).fromNow();
}

/** Format a large number compactly: 5200 -> "5.2K" (used by CountUp stat cards) */
export function formatCompactNumber(value) {
  return new Intl.NumberFormat(CONFIG.currency.locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

/** Pluralize a word based on count: pluralize(1, 'item') -> "1 item", pluralize(2,'item') -> "2 items" */
export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Truncate text to N characters with an ellipsis, breaking on word boundaries */
export function truncateText(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  const trimmed = text.slice(0, maxLength).trim();
  return `${trimmed.slice(0, trimmed.lastIndexOf(' '))}…`;
}

/** Convert "sequoia-bass-headphone" style slugs into "Sequoia Bass Headphone" */
export function slugToTitle(slug) {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Star rating -> array of {type: 'full'|'half'|'empty'} for rendering */
export function ratingToStars(rating, max = 5) {
  const stars = [];
  for (let i = 1; i <= max; i += 1) {
    if (rating >= i) stars.push({ type: 'full' });
    else if (rating >= i - 0.5) stars.push({ type: 'half' });
    else stars.push({ type: 'empty' });
  }
  return stars;
}