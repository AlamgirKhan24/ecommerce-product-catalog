import { THEMES, PAGINATION } from './constants.js';

// ---------------------------------------------
// Global site configuration
// Single object other modules import and read from —
// change a value here instead of hunting through files
// ---------------------------------------------
export const CONFIG = {
  siteName: 'Nitec',

  // Currency / number formatting (used by formatter.js)
  currency: {
    code: 'USD',
    locale: 'en-US',
    symbol: '$',
  },

  // Theme
  theme: {
    default: THEMES.LIGHT,
    respectSystemPreference: true, // fall back to OS preference if no saved choice
  },

  // Pagination
  pagination: {
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  },

  // Cart behavior
  cart: {
    freeShippingThreshold: 100,
    taxRate: 0.0, // set per-region if needed later
    maxQuantityPerItem: 10,
  },

  // Search (Fuse.js tuning)
  search: {
    debounceMs: 300,
    minChars: 2,
    fuseOptions: {
      keys: ['name', 'category', 'brand', 'tags'],
      threshold: 0.35,
      ignoreLocation: true,
    },
  },

  // Animation timings (kept in sync with SCSS $transition-* vars)
  animation: {
    fast: 150,
    base: 250,
    slow: 400,
    toastDuration: 3000,
  },

  // AOS (scroll reveal) defaults
  aos: {
    duration: 600,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  },

  // Notifications
  notifications: {
    position: 'top-right',
    duration: 3000,
  },

  // Feature flags — toggle features on/off without deleting code
  features: {
    wishlist: true,
    quickView: true,
    recentlyViewed: true,
    darkMode: true,
  },

  // Image handling
  images: {
    placeholder: 'assets/images/placeholder.svg',
    lazyLoadClass: 'lazyload', // hooks into lazysizes
  },
};