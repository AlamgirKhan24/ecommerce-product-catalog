import { getCartCount } from '../modules/cart.js';
import { getWishlistCount } from '../modules/whishlist.js';
import { bindSearchInput } from '../modules/search.js';
import { renderSearchResults } from './productgrid.js';
import { EVENTS } from '../core/constants.js';
import { createEl } from '../utils/dom.js';

// ---------------------------------------------
// Navbar — search binding, live cart/wishlist badge counts
// ---------------------------------------------

function renderBadge(anchorSelector, count) {
  const anchor = document.querySelector(anchorSelector);
  if (!anchor) return;

  let badge = anchor.querySelector('.neo-icon__badge');

  if (count <= 0) {
    badge?.remove();
    return;
  }

  if (!badge) {
    badge = createEl('span', { class: 'neo-icon__badge' });
    anchor.appendChild(badge);
  }

  badge.textContent = count > 99 ? '99+' : String(count);
}

function updateCartBadge() {
  renderBadge('[data-cart-badge]', getCartCount());
}

function updateWishlistBadge() {
  renderBadge('[data-wishlist-badge]', getWishlistCount());
}

/** Bootstrap — call once from app.js on every page */
export function initNavbar() {
  updateCartBadge();
  updateWishlistBadge();

  // Keep badges live as cart/wishlist change from any page/module
  document.addEventListener(EVENTS.CART_UPDATED, updateCartBadge);
  document.addEventListener(EVENTS.WISHLIST_UPDATED, updateWishlistBadge);

  // Wire the search input — only meaningful on shop.html where the grid exists,
  // but binding is harmless on other pages since it just won't find [data-product-grid]
  bindSearchInput('[data-search]', (results, query) => {
    if (document.querySelector('[data-product-grid]')) {
      renderSearchResults(results);
    } else if (query.trim().length) {
      // On pages without a grid (home, about), redirect to shop with the query
      window.location.href = `shop.html?q=${encodeURIComponent(query)}`;
    }
  });
}