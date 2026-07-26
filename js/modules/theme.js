import { storage } from '../core/storage.js';
import { CONFIG } from '../core/config.js';
import { STORAGE_KEYS, THEMES, THEME_ATTR, EVENTS } from '../core/constants.js';

// ---------------------------------------------
// Theme — dark/light mode, persisted + system-preference aware
// ---------------------------------------------

function getSystemPreference() {
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? THEMES.DARK : THEMES.LIGHT;
}

function applyTheme(theme) {
  document.documentElement.setAttribute(THEME_ATTR, theme);
  document.dispatchEvent(new CustomEvent(EVENTS.THEME_CHANGED, { detail: { theme } }));
}

/** Get the currently active theme (saved > system preference > config default) */
export function getCurrentTheme() {
  return (
    storage.get(STORAGE_KEYS.THEME) ??
    (CONFIG.theme.respectSystemPreference ? getSystemPreference() : CONFIG.theme.default)
  );
}

/** Set and persist a specific theme */
export function setTheme(theme) {
  if (!Object.values(THEMES).includes(theme)) return;
  storage.set(STORAGE_KEYS.THEME, theme);
  applyTheme(theme);
}

/** Flip between light/dark */
export function toggleTheme() {
  const current = getCurrentTheme();
  const next = current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK;
  setTheme(next);
  return next;
}

/**
 * Initialize theme on page load — applies the correct theme immediately
 * (call this as early as possible, ideally before first paint) and wires
 * up the toggle button plus live system-preference changes.
 */
export function initTheme(toggleSelector = '.js-theme-toggle') {
  if (!CONFIG.features.darkMode) return;

  applyTheme(getCurrentTheme());

  document.querySelectorAll(toggleSelector).forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = toggleTheme();
      btn.setAttribute('aria-pressed', String(next === THEMES.DARK));
    });
  });

  // Only react to OS changes if the user hasn't made an explicit choice
  if (CONFIG.theme.respectSystemPreference) {
    window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (storage.has(STORAGE_KEYS.THEME)) return; // explicit choice wins
      applyTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    });
  }
}