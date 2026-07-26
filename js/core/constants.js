// ---------------------------------------------
// Storage keys — single source of truth for localStorage
// ---------------------------------------------
export const STORAGE_KEYS = {
  CART: 'nitec_cart',
  WISHLIST: 'nitec_wishlist',
  THEME: 'nitec_theme',
  RECENTLY_VIEWED: 'nitec_recently_viewed',
  USER_PREFS: 'nitec_user_prefs',
};

// ---------------------------------------------
// Theme
// ---------------------------------------------
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const THEME_ATTR = 'data-theme';

// ---------------------------------------------
// Sorting options — used by sorting.js + filtersUI.js dropdown
// ---------------------------------------------
export const SORT_OPTIONS = {
  FEATURED: 'featured',
  PRICE_LOW_HIGH: 'low',
  PRICE_HIGH_LOW: 'high',
  RATING: 'rating',
};

export const SORT_LABELS = {
  [SORT_OPTIONS.FEATURED]: 'Featured',
  [SORT_OPTIONS.PRICE_LOW_HIGH]: 'Price: Low to High',
  [SORT_OPTIONS.PRICE_HIGH_LOW]: 'Price: High to Low',
  [SORT_OPTIONS.RATING]: 'Top Rated',
  [SORT_OPTIONS.NEWEST]: 'Newest',
  [SORT_OPTIONS.NAME_A_Z]: 'Name: A-Z',
};

// ---------------------------------------------
// Breakpoints — mirrors scss/abstracts/_breakpoints.scss
// (kept in sync manually since SCSS vars aren't accessible from JS)
// ---------------------------------------------
export const BREAKPOINTS = {
  XS: 375,
  SM: 576,
  MD: 768,
  LG: 992,
  XL: 1200,
  XXL: 1440,
};

// ---------------------------------------------
// Product badges
// ---------------------------------------------
export const BADGES = {
  NEW: 'new',
  SALE: 'sale',
  POPULAR: 'popular',
  OUT_OF_STOCK: 'out-of-stock',
};

// ---------------------------------------------
// Pagination
// ---------------------------------------------
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
};

// ---------------------------------------------
// Toast / notification types (Toastify.js wrapper uses these)
// ---------------------------------------------
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// ---------------------------------------------
// Custom DOM events — used for cross-module communication
// e.g. cart.js dispatches CART_UPDATED, navbar.js listens to update badge count
// ---------------------------------------------
export const EVENTS = {
  CART_UPDATED: 'cart:updated',
  WISHLIST_UPDATED: 'wishlist:updated',
  THEME_CHANGED: 'theme:changed',
  FILTERS_CHANGED: 'filters:changed',
  PRODUCTS_LOADED: 'products:loaded',
};

// ---------------------------------------------
// Data source paths
// ---------------------------------------------
export const DATA_PATHS = {
  PRODUCTS: 'assets/data/product.json',
  CATEGORIES: 'assets/data/categories.json',
  BRANDS: 'assets/data/brands.json',
  REVIEWS: 'assets/data/reviews.json',
  USERS: 'assets/data/users.json',
};