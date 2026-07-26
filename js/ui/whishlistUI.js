import { getWishlistItems, removeFromWishlist } from '../modules/whishlist.js';
import { createEl, empty } from '../utils/dom.js';
import { formatPrice } from '../utils/formatter.js';
import { EVENTS } from '../core/constants.js';
import { rescanLazyImages } from '../vendors/lazyside.js';

// ---------------------------------------------
// Wishlist page — renders real wishlist data into the
// existing .neo-product-grid on whishlist.html, replacing
// the hardcoded static cards
// ---------------------------------------------

const heartIconPath =
  'M19.5 5.4c-1.7-1.7-4.4-1.7-6.1 0L12 6.8l-1.4-1.4c-1.7-1.7-4.4-1.7-6.1 0s-1.7 4.4 0 6.1L12 19l7.5-7.5c1.7-1.7 1.7-4.4 0-6.1Z';

function heartSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', heartIconPath);
  svg.appendChild(path);
  return svg;
}

function renderWishlistCard(item) {
  const removeBtn = createEl(
    'button',
    { class: 'neo-product-card__wish is-active', type: 'button', 'aria-label': 'Remove from wishlist' },
    [heartSvg()]
  );
  removeBtn.addEventListener('click', () => {
    removeFromWishlist(item.id, item.name);
  });

  return createEl('article', { class: 'neo-product-card' }, [
    removeBtn,
    createEl('a', { class: 'neo-product-card__media', href: `product.html?id=${item.id}` }, [
      createEl('img', { src: item.image, alt: item.name }),
    ]),
    createEl('div', { class: 'neo-product-card__body' }, [
      createEl('div', { class: 'neo-product-card__meta' }, [
        createEl('strong', {}, formatPrice(item.price)),
      ]),
      createEl('h3', {}, item.name),
      createEl('a', { class: 'wishlist-cart-btn', href: 'cart.html' }, 'Move to cart'),
    ]),
  ]);
}

function updateCount() {
  const countEl = document.querySelector('.wishlist-hero__count strong');
  const items = getWishlistItems();
  if (countEl) countEl.textContent = String(items.length).padStart(2, '0');
}

function renderEmptyState(grid) {
  grid.appendChild(
    createEl('div', { class: 'wishlist-empty' }, [
      createEl('p', {}, 'Your wishlist is empty.'),
      createEl('a', { class: 'btn btn-primary', href: 'shop.html' }, 'Browse products'),
    ])
  );
}

function render() {
  const grid = document.querySelector('.neo-product-grid');
  if (!grid) return; // not the wishlist page

  const items = getWishlistItems();
  empty(grid);

  if (!items.length) {
    renderEmptyState(grid);
  } else {
    items.forEach((item) => grid.appendChild(renderWishlistCard(item)));
  }

  updateCount();
  rescanLazyImages();
}

/** Bootstrap — call once from app.js, only does work if wishlist.html is the current page */
export function initWishlistPage() {
  if (!document.querySelector('.wishlist-panel')) return;

  render();
  document.addEventListener(EVENTS.WISHLIST_UPDATED, render);
}