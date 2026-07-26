import { storage } from '../core/storage.js';
import { STORAGE_KEYS, EVENTS } from '../core/constants.js';
import { toastSuccess, toastInfo } from '../vendors/toastify.js';
import { confirmClearAll } from '../vendors/sweetalert2.js';

// ---------------------------------------------
// Wishlist — simple toggle on/off, persisted via storage.js
// Wishlist item shape: { id, name, price, image }
// ---------------------------------------------

function getWishlist() {
  return storage.get(STORAGE_KEYS.WISHLIST, []);
}

function saveWishlist(items) {
  storage.set(STORAGE_KEYS.WISHLIST, items);
  document.dispatchEvent(new CustomEvent(EVENTS.WISHLIST_UPDATED, { detail: { items } }));
}

/** Check if a product is already wishlisted */
export function isWishlisted(id) {
  return getWishlist().some((item) => item.id === id);
}

/**
 * Toggle a product in/out of the wishlist. Returns the new state (true = added).
 * This is the main entry point — used by the heart icon on product cards.
 */
export function toggleWishlist(product) {
  const items = getWishlist();
  const existingIndex = items.findIndex((item) => item.id === product.id);

  if (existingIndex > -1) {
    items.splice(existingIndex, 1);
    saveWishlist(items);
    toastInfo(`${product.name} removed from wishlist`);
    return false;
  }

  items.push({
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images?.[0] ?? '',
  });
  saveWishlist(items);
  toastSuccess(`${product.name} added to wishlist`);
  return true;
}

/** Explicitly remove one item (used by the wishlist page's own remove button, no toggle ambiguity) */
export function removeFromWishlist(id, name = 'Item') {
  const items = getWishlist().filter((item) => item.id !== id);
  saveWishlist(items);
  toastInfo(`${name} removed from wishlist`);
  return items;
}

/** Clear the whole wishlist, with a confirmation dialog */
export async function clearWishlist() {
  const confirmed = await confirmClearAll('wishlist');
  if (!confirmed) return getWishlist();

  saveWishlist([]);
  toastInfo('Wishlist cleared');
  return [];
}

/** Count — used for the navbar heart badge */
export function getWishlistCount() {
  return getWishlist().length;
}

/** Read-only accessor for rendering whishlist.html */
export function getWishlistItems() {
  return getWishlist();
}