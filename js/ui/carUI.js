import {
  getCartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartSummary,
} from '../modules/cart.js';
import { createEl, empty } from '../utils/dom.js';
import { formatPrice } from '../utils/formatter.js';
import { EVENTS } from '../core/constants.js';

// ---------------------------------------------
// Cart page UI — renders real cart data into cart.html's
// .cart-items-panel and .cart-summary, replacing the static markup
// ---------------------------------------------

function renderCartItem(item) {
  const qtyDisplay = createEl('strong', {}, String(item.qty));

  const decreaseBtn = createEl(
    'button',
    { type: 'button', 'aria-label': 'Decrease quantity' },
    '−'
  );
  decreaseBtn.addEventListener('click', () => {
    updateQuantity(item.id, item.color, item.qty - 1);
  });

  const increaseBtn = createEl(
    'button',
    { type: 'button', 'aria-label': 'Increase quantity' },
    '+'
  );
  increaseBtn.addEventListener('click', () => {
    updateQuantity(item.id, item.color, item.qty + 1);
  });

  const removeBtn = createEl(
    'button',
    { class: 'cart-item__remove', type: 'button', 'aria-label': 'Remove item' },
    '×'
  );
  removeBtn.addEventListener('click', () => {
    removeFromCart(item.id, item.color, item.name);
  });

  return createEl('article', { class: 'cart-item' }, [
    createEl('div', { class: 'cart-item__media' }, [
      createEl('img', { src: item.image, alt: item.name }),
    ]),
    createEl('div', { class: 'cart-item__info' }, [createEl('h2', {}, item.name)]),
    createEl('div', { class: 'quantity-control' }, [decreaseBtn, qtyDisplay, increaseBtn]),
    createEl('strong', { class: 'cart-item__price' }, formatPrice(item.price * item.qty)),
    removeBtn,
  ]);
}

function renderSummary() {
  const summary = getCartSummary();
  const rows = document.querySelectorAll('.cart-summary__rows > div');

  // rows order in markup: Subtotal, Shipping, Discount — map by position
  if (rows[0]) rows[0].querySelector('strong').textContent = formatPrice(summary.subtotal);
  if (rows[1]) {
    rows[1].querySelector('strong').textContent =
      summary.shipping === 0 ? 'Free' : formatPrice(summary.shipping);
  }

  const totalEl = document.querySelector('.cart-summary__total strong');
  if (totalEl) totalEl.textContent = formatPrice(summary.total);
}

function renderEmptyState(panel) {
  panel.appendChild(
    createEl('div', { class: 'cart-empty' }, [
      createEl('p', {}, 'Your cart is empty.'),
      createEl('a', { class: 'btn btn-primary', href: 'shop.html' }, 'Start shopping'),
    ])
  );
}

function render() {
  const panel = document.querySelector('.cart-items-panel');
  if (!panel) return; // not the cart page

  const items = getCartItems();
  empty(panel);

  if (!items.length) {
    renderEmptyState(panel);
  } else {
    items.forEach((item) => panel.appendChild(renderCartItem(item)));
  }

  renderSummary();
}

/** Bootstrap — call once from app.js, only does work if cart.html is the current page */
export function initCartPage() {
  if (!document.querySelector('.cart-layout')) return;

  render();
  document.addEventListener(EVENTS.CART_UPDATED, render);

  document.querySelector('.cart-coupon')?.addEventListener('submit', (e) => e.preventDefault());
}