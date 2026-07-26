// ---------------------------------------------
// Day.js — date formatting plugin setup
// Requires the Day.js core UMD bundle + relativeTime plugin loaded
// globally before this runs (both via CDN <script> tags)
// ---------------------------------------------

export function initDayjs() {
  if (typeof window.dayjs !== 'function') {
    console.warn('[dayjs] Day.js not loaded — date formatting will fall back to raw strings.');
    return;
  }

  // relativeTime plugin powers formatRelativeDate() in utils/formatter.js
  // (e.g. review timestamps: "2 days ago")
  if (window.dayjs_plugin_relativeTime) {
    window.dayjs.extend(window.dayjs_plugin_relativeTime);
  } else {
    console.warn('[dayjs] relativeTime plugin not found — formatRelativeDate() will not work.');
  }
}