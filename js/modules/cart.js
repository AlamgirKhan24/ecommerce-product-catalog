import { storage } from '../core/storage.js';
import { STORAGE_KEYS, EVENTS } from '../core/constants.js';
import { CONFIG } from '../core/config.js';
import { toastSuccess, toastInfo } from '../vendors/toastify.js';
import { confirmRemoveItem, confirmClearAll } from '../vendors/sweetalert2.js';

// ---------------------------------------------
// Cart — add/remove/update, persisted via storage.js
// Cart item shape: { id, name, price, image, color, qty }
// ---------------------------------------------

function getCart() {
  return storage.get(STORAGE_KEYS.CART, []);
}

function saveCart(items) {
  storage.set(STORAGE_KEYS.CART, items);
  document.dispatchEvent(new CustomEvent(EVENTS.CART_UPDATED, { detail: { items } }));
}

/** Add a product to the cart, or increment qty if it's already there (same id + color) */
export function addToCart(product, { color = null, qty = 1 } = {}) {
  const items = getCart();
  const existing = items.find((item) => item.id === product.id && item.color === color);

  if (existing) {
    existing.qty = Math.min(existing.qty + qty, CONFIG.cart.maxQuantityPerItem);
  } else {
    items.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] ?? '',
      color,
      qty: Math.min(qty, CONFIG.cart.maxQuantityPerItem),
    });
  }

  saveCart(items);
  toastSuccess(`${product.name} added to cart`);
  return items;
}

/** Update quantity for a specific line item */
export function updateQuantity(id, color, qty) {
  const items = getCart();
  const item = items.find((i) => i.id === id && i.color === color);
  if (!item) return items;

  item.qty = Math.max(1, Math.min(qty, CONFIG.cart.maxQuantityPerItem));
  saveCart(items);
  return items;
}

/** Remove a single line item, with a confirmation dialog */
export async function removeFromCart(id, color, name = 'This item') {
  const confirmed = await confirmRemoveItem(name);
  if (!confirmed) return getCart();

  const items = getCart().filter((i) => !(i.id === id && i.color === color));
  saveCart(items);
  toastInfo(`${name} removed from cart`);
  return items;
}

/** Clear the whole cart, with a confirmation dialog */
export async function clearCart() {
  const confirmed = await confirmClearAll('cart');
  if (!confirmed) return getCart();

  saveCart([]);
  toastInfo('Cart cleared');
  return [];
}

/** Total item count (sum of quantities) — used for the navbar badge */
export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

/** Subtotal before tax/shipping */
export function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.qty, 0);
}

/** Full order summary: subtotal, tax, shipping, total — used on cart.html */
export function getCartSummary() {
  const subtotal = getCartSubtotal();
  const tax = subtotal * CONFIG.cart.taxRate;
  const shipping = subtotal >= CONFIG.cart.freeShippingThreshold || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
    freeShippingRemaining: Math.max(0, CONFIG.cart.freeShippingThreshold - subtotal),
  };
}

/** Read the current cart contents (read-only accessor for UI rendering) */
export function getCartItems() {
  return getCart();
}