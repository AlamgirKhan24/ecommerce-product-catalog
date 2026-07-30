import { storage } from './core/storage.js';
import { STORAGE_KEYS } from './core/constants.js';
import { getCurrentTheme, setTheme } from './modules/theme.js';
import { clearCart } from './modules/cart.js';
import { clearWishlist } from './modules/wishlist.js';
import { toastSuccess } from './vendors/toastify.js';

// ---------------------------------------------
// Settings page — profile form, dark mode toggle, and
// data/storage actions (clear cart, clear wishlist, reset prefs)
// ---------------------------------------------

const DEFAULT_PREFS = {
  name: '',
  email: '',
  phone: '',
  emailUpdates: true,
  orderNotifications: true,
  newsletter: false,
};

function loadPrefs() {
  return { ...DEFAULT_PREFS, ...storage.get(STORAGE_KEYS.USER_PREFS, {}) };
}

function savePrefs(prefs) {
  storage.set(STORAGE_KEYS.USER_PREFS, prefs);
}

function applyPrefsToForm(form, prefs) {
  form.querySelector('[name="name"]').value = prefs.name;
  form.querySelector('[name="email"]').value = prefs.email;
  form.querySelector('[name="phone"]').value = prefs.phone;
  form.querySelector('[name="emailUpdates"]').checked = prefs.emailUpdates;
  form.querySelector('[name="orderNotifications"]').checked = prefs.orderNotifications;
  form.querySelector('[name="newsletter"]').checked = prefs.newsletter;
}

function initProfileForm(root) {
  const form = root.querySelector('[data-settings-form]');
  if (!form) return;

  applyPrefsToForm(form, loadPrefs());

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const updated = {
      name: (data.get('name') || '').trim(),
      email: (data.get('email') || '').trim(),
      phone: (data.get('phone') || '').trim(),
      emailUpdates: form.querySelector('[name="emailUpdates"]').checked,
      orderNotifications: form.querySelector('[name="orderNotifications"]').checked,
      newsletter: form.querySelector('[name="newsletter"]').checked,
    };
    savePrefs(updated);
    toastSuccess('Settings saved');
  });

  root.querySelector('[data-reset-settings]')?.addEventListener('click', () => {
    storage.remove(STORAGE_KEYS.USER_PREFS);
    applyPrefsToForm(form, { ...DEFAULT_PREFS });
    toastSuccess('Preferences reset to default');
  });
}

function initThemeToggle(root) {
  const toggle = root.querySelector('[data-settings-theme-toggle]');
  if (!toggle) return;

  toggle.checked = getCurrentTheme() === 'dark';
  toggle.addEventListener('change', () => {
    setTheme(toggle.checked ? 'dark' : 'light');
  });
}

function initDataActions(root) {
  root.querySelector('[data-clear-cart]')?.addEventListener('click', () => clearCart());
  root.querySelector('[data-clear-wishlist]')?.addEventListener('click', () => clearWishlist());
}

function initSettingsPage() {
  const root = document.querySelector('[data-settings-page]');
  if (!root) return;

  initProfileForm(root);
  initThemeToggle(root);
  initDataActions(root);
}

document.addEventListener('DOMContentLoaded', initSettingsPage);