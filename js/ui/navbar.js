import { getCartCount } from '../modules/cart.js';
import { getWishlistCount } from '../modules/wishlist.js';
import { bindSearchInput } from '../modules/search.js';
import { renderSearchResults } from './productgrid.js';
import { EVENTS } from '../core/constants.js';
import { createEl } from '../utils/dom.js';

const LUCIDE_CDN = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.lucide) resolve();
      else existing.addEventListener('load', resolve, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function ensureLucide() {
  if (!window.lucide) await loadScript(LUCIDE_CDN);
  window.lucide?.createIcons();
}

function replaceChildrenWithIcon(element, iconName) {
  const badge = element.querySelector('.neo-icon__badge');
  element.replaceChildren(createEl('i', { 'data-lucide': iconName, 'aria-hidden': 'true' }));
  if (badge) element.appendChild(badge);
}

async function enhanceNavbarVisuals() {
  try {
    document.querySelectorAll('.neo-search button').forEach((button) => {
      button.replaceChildren(createEl('i', { 'data-lucide': 'search', 'aria-hidden': 'true' }));
    });

    document.querySelectorAll('[data-cart-badge], .neo-icon[href$="cart.html"]').forEach((link) => {
      replaceChildrenWithIcon(link, 'shopping-cart');
      link.setAttribute('aria-label', 'Cart');
      link.dataset.cartBadge = '';
    });

    document.querySelectorAll('[data-wishlist-badge], .neo-icon[href$="wishlist.html"]').forEach((link) => {
      replaceChildrenWithIcon(link, 'heart');
      link.setAttribute('aria-label', 'Wishlist');
      link.dataset.wishlistBadge = '';
    });

    document.querySelectorAll('.neo-user').forEach((profile) => {
      profile.setAttribute('aria-label', 'Open profile menu');
      if (!profile.querySelector('.neo-user__chevron')) {
        profile.appendChild(
          createEl('i', {
            class: 'neo-user__chevron',
            'data-lucide': 'chevron-down',
            'aria-hidden': 'true',
          })
        );
      }
    });

    await ensureLucide();
  } catch (err) {
    console.warn('[navbar] Lucide icons unavailable, keeping existing SVG icons:', err);
  }
}

function renderBadge(anchorSelector, count) {
  const anchors = document.querySelectorAll(anchorSelector);

  anchors.forEach((anchor) => {
    let badge = anchor.querySelector('.neo-icon__badge');

    if (count <= 0) {
      badge?.remove();
      anchor.classList.remove('is-active');
      return;
    }

    if (!badge) {
      badge = createEl('span', { class: 'neo-icon__badge', 'aria-hidden': 'true' });
      anchor.appendChild(badge);
    }

    badge.textContent = count > 99 ? '99+' : String(count);
    anchor.classList.add('is-active');
  });
}

function updateCartBadge() {
  renderBadge('[data-cart-badge]', getCartCount());
}

function updateWishlistBadge() {
  renderBadge('[data-wishlist-badge]', getWishlistCount());
}

export function initNavbar() {
  enhanceNavbarVisuals().then(() => {
    updateCartBadge();
    updateWishlistBadge();
  });

  updateCartBadge();
  updateWishlistBadge();

  document.addEventListener(EVENTS.CART_UPDATED, updateCartBadge);
  document.addEventListener(EVENTS.WISHLIST_UPDATED, updateWishlistBadge);

  bindSearchInput('[data-search]', (results, query) => {
    if (document.querySelector('[data-product-grid]')) {
      renderSearchResults(results);
    } else if (query.trim().length) {
      window.location.href = `shop.html?q=${encodeURIComponent(query)}`;
    }
  });
}
