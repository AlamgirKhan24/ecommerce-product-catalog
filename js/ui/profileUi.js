import { getWishlistItems, removeFromWishlist } from '../modules/wishlist.js';
import { getCartCount } from '../modules/cart.js';
import { storage } from '../core/storage.js';
import { STORAGE_KEYS, EVENTS } from '../core/constants.js';
import { createEl, empty, qs, qsa } from '../utils/dom.js';
import { formatPrice } from '../utils/formatter.js';
import { toastSuccess, toastInfo } from '../vendors/toastify.js';
import { confirmDialog } from '../vendors/sweetalert2.js';

// ---------------------------------------------
// Profile page — account overview, tabs, live wishlist snapshot,
// and settings actions. Only does work if profile.html is the
// current page (guarded by [data-profile-page]).
// ---------------------------------------------

const PREFS_DEFAULTS = {
  orderUpdates: true,
  promoEmails: false,
};

function getPrefs() {
  return { ...PREFS_DEFAULTS, ...storage.get(STORAGE_KEYS.USER_PREFS, {}) };
}

function savePrefs(prefs) {
  storage.set(STORAGE_KEYS.USER_PREFS, prefs);
}

// ---------- Tabs ----------
function initTabs(root) {
  const tabs = qsa('[data-profile-tab]', root);
  const panels = qsa('[data-profile-panel]', root);

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.profileTab;

      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
      panels.forEach((panel) => {
        panel.classList.toggle('is-active', panel.dataset.profilePanel === target);
      });
    });
  });
}

function initHeroShortcuts(root) {
  qsa('[data-goto-tab]', root).forEach((btn) => {
    btn.addEventListener('click', () => {
      qs(`[data-profile-tab="${btn.dataset.gotoTab}"]`, root)?.click();
    });
  });
}

// ---------- Stats ----------
function renderStats(root) {
  const wishlistCountEl = qs('[data-stat="wishlist"]', root);
  const cartCountEl = qs('[data-stat="cart"]', root);

  if (wishlistCountEl) wishlistCountEl.textContent = String(getWishlistItems().length);
  if (cartCountEl) cartCountEl.textContent = String(getCartCount());
}

// ---------- Wishlist tab ----------
function renderWishlistTab(root) {
  const grid = qs('[data-profile-wishlist-grid]', root);
  if (!grid) return;

  const items = getWishlistItems();
  empty(grid);

  if (!items.length) {
    grid.appendChild(
      createEl('div', { class: 'profile-empty' }, [
        createEl('p', {}, "You haven't saved anything to your wishlist yet."),
        createEl('a', { class: 'btn btn--dark', href: 'shop.html' }, 'Browse products'),
      ])
    );
    return;
  }

  items.forEach((item) => {
    const removeBtn = createEl(
      'button',
      { type: 'button', class: 'icon-btn', 'aria-label': `Remove ${item.name} from wishlist` },
      '✕'
    );
    removeBtn.addEventListener('click', () => removeFromWishlist(item.id, item.name));

    grid.appendChild(
      createEl('article', { class: 'card' }, [
        createEl('a', { href: `product.html?id=${item.id}` }, [
          createEl('img', { src: item.image, alt: item.name, loading: 'lazy' }),
        ]),
        createEl('div', {}, [
          createEl('h3', {}, item.name),
          createEl('strong', {}, formatPrice(item.price)),
        ]),
        removeBtn,
      ])
    );
  });
}

// ---------- Settings tab ----------
function initSettings(root) {
  const prefs = getPrefs();

  const orderUpdatesInput = qs('[data-pref="orderUpdates"]', root);
  const promoEmailsInput = qs('[data-pref="promoEmails"]', root);

  if (orderUpdatesInput) orderUpdatesInput.checked = prefs.orderUpdates;
  if (promoEmailsInput) promoEmailsInput.checked = prefs.promoEmails;

  [orderUpdatesInput, promoEmailsInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('change', () => {
      const updated = {
        ...getPrefs(),
        [input.dataset.pref]: input.checked,
      };
      savePrefs(updated);
      toastSuccess('Preferences saved');
    });
  });

  const clearDataBtn = qs('[data-clear-account-data]', root);
  clearDataBtn?.addEventListener('click', async () => {
    const confirmed = await confirmDialog({
      title: 'Clear all local data?',
      text: 'This removes your cart, wishlist, and saved preferences from this browser. This can\u2019t be undone.',
      confirmText: 'Yes, clear it',
      icon: 'warning',
    });
    if (!confirmed) return;

    storage.clearAppData();
    toastInfo('Local data cleared');
    renderStats(root);
    renderWishlistTab(root);
  });
}

// ---------- Bootstrap ----------
export function initProfilePage() {
  const root = document.querySelector('[data-profile-page]');
  if (!root) return; // not the profile page

  initTabs(root);
  initHeroShortcuts(root);
  renderStats(root);
  renderWishlistTab(root);
  initSettings(root);

  document.addEventListener(EVENTS.WISHLIST_UPDATED, () => {
    renderStats(root);
    renderWishlistTab(root);
  });
  document.addEventListener(EVENTS.CART_UPDATED, () => renderStats(root));
}