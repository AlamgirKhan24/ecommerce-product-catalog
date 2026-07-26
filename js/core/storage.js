// ---------------------------------------------
// Storage — thin, safe wrapper around localStorage
// Every module (cart, wishlist, theme) reads/writes through this,
// never touches window.localStorage directly.
// ---------------------------------------------

const isAvailable = (() => {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch (err) {
    console.warn('[storage] localStorage unavailable, falling back to memory:', err);
    return false;
  }
})();

// In-memory fallback if localStorage is blocked (private browsing, quota, etc.)
const memoryStore = new Map();

function rawGet(key) {
  if (isAvailable) return window.localStorage.getItem(key);
  return memoryStore.has(key) ? memoryStore.get(key) : null;
}

function rawSet(key, value) {
  if (isAvailable) {
    window.localStorage.setItem(key, value);
  } else {
    memoryStore.set(key, value);
  }
}

function rawRemove(key) {
  if (isAvailable) {
    window.localStorage.removeItem(key);
  } else {
    memoryStore.delete(key);
  }
}

export const storage = {
  /**
   * Get a parsed value by key. Returns `fallback` if missing or invalid.
   */
  get(key, fallback = null) {
    const raw = rawGet(key);
    if (raw === null || raw === undefined) return fallback;

    try {
      return JSON.parse(raw);
    } catch {
      // value was stored as a plain string, not JSON
      return raw;
    }
  },

  /**
   * Store a value (auto-stringified). Returns true on success.
   */
  set(key, value) {
    try {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      rawSet(key, serialized);
      return true;
    } catch (err) {
      console.error(`[storage] Failed to set "${key}":`, err);
      return false;
    }
  },

  /**
   * Remove a single key.
   */
  remove(key) {
    rawRemove(key);
  },

  /**
   * Check if a key exists.
   */
  has(key) {
    return rawGet(key) !== null;
  },

  /**
   * Clear only keys belonging to this app (prefix-based),
   * so we don't wipe unrelated localStorage from other scripts.
   */
  clearAppData(prefix = 'nitec_') {
    if (!isAvailable) {
      memoryStore.clear();
      return;
    }
    Object.keys(window.localStorage)
      .filter((key) => key.startsWith(prefix))
      .forEach((key) => window.localStorage.removeItem(key));
  },
};