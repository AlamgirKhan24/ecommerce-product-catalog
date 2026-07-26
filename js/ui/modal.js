import { createEl, lockScroll } from '../utils/dom.js';
import { formatPrice } from '../utils/formatter.js';

// ---------------------------------------------
// Modal — quick-view product modal, built entirely in JS
// (no static HTML skeleton needed; injected into <body> on demand)
// Also provides a generic openModal/closeModal pair other features
// (e.g. a future "size guide" or "newsletter signup" popup) can reuse.
// ---------------------------------------------

let activeModal = null;
let lastFocusedEl = null;

function trapFocus(e, modalEl) {
  if (e.key !== 'Tab') return;

  const focusable = modalEl.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

/** Generic modal shell — pass in any content node */
export function openModal(contentEl, { className = '' } = {}) {
  closeModal(); // only one modal at a time

  lastFocusedEl = document.activeElement;

  const overlay = createEl('div', { class: 'modal-overlay', role: 'presentation' });
  const dialog = createEl(
    'div',
    {
      class: `modal-dialog ${className}`.trim(),
      role: 'dialog',
      'aria-modal': 'true',
      tabindex: '-1',
    },
    [
      createEl('button', { class: 'modal-close', 'aria-label': 'Close', onClick: closeModal }, '×'),
      contentEl,
    ]
  );

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);
  lockScroll(true);

  const keydownHandler = (e) => {
    if (e.key === 'Escape') closeModal();
    trapFocus(e, dialog);
  };
  overlay.addEventListener('keydown', keydownHandler);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  dialog.focus();
  activeModal = { overlay, keydownHandler };
}

/** Close whatever modal is currently open, restoring scroll + focus */
export function closeModal() {
  if (!activeModal) return;

  activeModal.overlay.removeEventListener('keydown', activeModal.keydownHandler);
  activeModal.overlay.remove();
  lockScroll(false);
  lastFocusedEl?.focus();
  activeModal = null;
}

/** Build and open the quick-view modal for a specific product */
export function openQuickView(product) {
  const content = createEl('div', { class: 'quick-view' }, [
    createEl('img', { class: 'quick-view__image', src: product.images?.[0] ?? '', alt: product.name }),
    createEl('div', { class: 'quick-view__body' }, [
      createEl('span', { class: 'quick-view__category' }, product.category),
      createEl('h2', { class: 'quick-view__title' }, product.name),
      createEl('p', { class: 'quick-view__price' }, formatPrice(product.price)),
      createEl('p', { class: 'quick-view__description' }, product.description ?? ''),
      createEl(
        'a',
        { class: 'btn btn--accent', href: `product.html?id=${product.id}` },
        'View full details'
      ),
    ]),
  ]);

  openModal(content, { className: 'quick-view-modal' });
}