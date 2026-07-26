import { CONFIG } from '../core/config.js';
import { NOTIFICATION_TYPES } from '../core/constants.js';

// ---------------------------------------------
// Toastify.js — non-blocking toast notifications
// Requires the Toastify UMD bundle + CSS loaded globally before this runs
// ---------------------------------------------

const TYPE_STYLES = {
  [NOTIFICATION_TYPES.SUCCESS]: { background: 'var(--color-success, #22C55E)' },
  [NOTIFICATION_TYPES.ERROR]: { background: 'var(--color-error, #EF4444)' },
  [NOTIFICATION_TYPES.WARNING]: { background: 'var(--color-warning, #F59E0B)' },
  [NOTIFICATION_TYPES.INFO]: { background: 'var(--color-blue, #1767D8)' },
};

/**
 * Show a toast notification.
 * @param {string} message
 * @param {string} type - one of NOTIFICATION_TYPES
 */
export function showToast(message, type = NOTIFICATION_TYPES.INFO) {
  if (typeof window.Toastify === 'undefined') {
    console.log(`[toast:${type}]`, message); // fallback so nothing is silently lost
    return;
  }

  window.Toastify({
    text: message,
    duration: CONFIG.notifications.duration,
    gravity: 'top',
    position: CONFIG.notifications.position.includes('right') ? 'right' : 'left',
    close: true,
    stopOnFocus: true,
    style: {
      borderRadius: '999px',
      padding: '12px 20px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 12px 28px rgba(8, 11, 13, 0.14)',
      ...TYPE_STYLES[type],
    },
  }).showToast();
}

// Convenience shortcuts — used throughout cart.js, wishlist.js, contact form, etc.
export const toastSuccess = (msg) => showToast(msg, NOTIFICATION_TYPES.SUCCESS);
export const toastError = (msg) => showToast(msg, NOTIFICATION_TYPES.ERROR);
export const toastInfo = (msg) => showToast(msg, NOTIFICATION_TYPES.INFO);
export const toastWarning = (msg) => showToast(msg, NOTIFICATION_TYPES.WARNING);