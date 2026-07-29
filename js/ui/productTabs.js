import { DATA_PATHS } from '../core/constants.js';

function setupTabSwitching() {
  const buttons = document.querySelectorAll('[data-tab-btn]');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tabBtn;

      document.querySelectorAll('[data-tab-btn]').forEach((b) => {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });

      document.querySelectorAll('[data-tab-panel]').forEach((panel) => {
        const isTarget = panel.dataset.tabPanel === target;
        panel.classList.toggle('is-active', isTarget);
        panel.hidden = !isTarget;
      });
    });
  });
}

function renderDescription(product) {
  const el = document.querySelector('[data-tab-description]');
  if (el) el.textContent = product.description || 'No description available for this product yet.';
}

function renderSpecs(product) {
  const el = document.querySelector('[data-tab-specs]');
  if (!el) return;

  const inStock = product.stock > 0;
  const rows = [
    ['SKU', product.sku || '—'],
    ['Brand', product.brand || '—'],
    ['Category', product.category || '—'],
    ['Availability', inStock ? `In stock (${product.stock})` : 'Out of stock'],
    ['Rating', product.rating ? `${product.rating} / 5 (${product.reviewCount || 0} reviews)` : '—'],
    ['Tags', product.tags?.length ? product.tags.join(', ') : '—'],
  ];

  el.innerHTML = rows
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join('');
}

async function renderReviews(product) {
  const wrap = document.querySelector('[data-tab-reviews]');
  if (!wrap) return;

  let reviews = [];
  try {
    const res = await fetch(DATA_PATHS.REVIEWS);
    const data = await res.json();
    reviews = Array.isArray(data) ? data.filter((r) => r.productId === product.id) : [];
  } catch {
    reviews = [];
  }

  if (!reviews.length) {
    wrap.innerHTML = '<p class="product-reviews__empty">No reviews yet — be the first to review this product.</p>';
    return;
  }

  wrap.innerHTML = reviews
    .map(
      (r) => `
        <div class="product-review">
          <span class="product-review__avatar">${(r.name || '?').charAt(0)}</span>
          <div class="product-review__body">
            <strong>${r.name || 'Anonymous'}</strong>
            <div class="product-review__rating">${'★'.repeat(r.rating || 0)}${'☆'.repeat(5 - (r.rating || 0))}</div>
            <p class="product-review__text">${r.text || ''}</p>
          </div>
        </div>
      `
    )
    .join('');
}

export function initProductTabs(product) {
  if (!product) return;
  setupTabSwitching();
  renderDescription(product);
  renderSpecs(product);
  renderReviews(product);
}