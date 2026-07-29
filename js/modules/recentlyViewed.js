import { storage } from '../core/storage.js';
import { STORAGE_KEYS } from '../core/constants.js';

const MAX_ITEMS = 8;

/** Record that a product was just viewed — call this on every product.html load */
export function recordView(productId) {
  if (!productId) return;

  const ids = storage.get(STORAGE_KEYS.RECENTLY_VIEWED, []);
  const next = [productId, ...ids.filter((id) => id !== productId)].slice(0, MAX_ITEMS);

  storage.set(STORAGE_KEYS.RECENTLY_VIEWED, next);
}

/** Get the full product objects for recently viewed items, excluding the current product */
export function getRecentlyViewed(allProducts, currentProductId) {
  const ids = storage.get(STORAGE_KEYS.RECENTLY_VIEWED, []);

  return ids
    .filter((id) => id !== currentProductId)
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean);
}