import {
  toggleFilterValue,
  countActiveFilters,
  getPriceBounds,
  getFilterOptions,
} from '../modules/filter.js';

import { getFilters, setFilters, resetFilters as resetGridFilters } from './productgrid.js';

let products = [];
let priceSlider = null;

const BADGE_LABELS = { new: 'New Arrivals', sale: 'On Sale' };

function renderCheckboxGroup(container, values, field) {
  if (!container) return;
  container.innerHTML = '';

  values.forEach((value) => {
    const id = `${field}-${value}`.replace(/\s+/g, '-').toLowerCase();
    const label = document.createElement('label');
    label.className = 'filter-check';
    label.innerHTML = `<input type="checkbox" id="${id}" value="${value}"> <span>${value}</span>`;

    label.querySelector('input').addEventListener('change', () => {
      setFilters(toggleFilterValue(getFilters(), field, value));
      syncUI();
    });

    container.appendChild(label);
  });
}

function renderColorGroup(container, values) {
  if (!container) return;
  container.innerHTML = '';

  values.forEach((value) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-swatch';
    button.style.setProperty('--swatch', value);
    button.dataset.color = value;
    button.setAttribute('aria-label', `Filter by color ${value}`);

    button.addEventListener('click', () => {
      setFilters(toggleFilterValue(getFilters(), 'colors', value));
      syncUI();
    });

    container.appendChild(button);
  });
}

function renderChips() {
  const chipsWrap = document.querySelector('[data-filter-chips]');
  if (!chipsWrap) return;

  const filters = getFilters();
  const chips = [];

  filters.categories.forEach((v) => chips.push({ field: 'categories', value: v, label: v }));
  filters.brands.forEach((v) => chips.push({ field: 'brands', value: v, label: v }));
  filters.colors.forEach((v) => chips.push({ field: 'colors', value: v, label: `Color ${v}` }));
  (filters.badges || []).forEach((v) => chips.push({ field: 'badges', value: v, label: BADGE_LABELS[v] || v }));
  if (filters.minRating > 0) chips.push({ field: 'minRating', value: 0, label: `${filters.minRating}★ & up` });
  if (filters.inStockOnly) chips.push({ field: 'inStockOnly', value: false, label: 'In stock only' });
  if (filters.priceRange) {
    const [min, max] = filters.priceRange;
    chips.push({ field: 'priceRange', value: null, label: `$${min} – $${max}` });
  }

  chipsWrap.hidden = chips.length === 0;
  chipsWrap.innerHTML = '';

  chips.forEach((chip) => {
    const el = document.createElement('span');
    el.className = 'filter-chip';
    el.innerHTML = `${chip.label} <button type="button" aria-label="Remove ${chip.label}">&times;</button>`;

    el.querySelector('button').addEventListener('click', () => {
      const current = getFilters();
      const next =
        chip.field === 'categories' || chip.field === 'brands' || chip.field === 'colors' || chip.field === 'badges'
          ? toggleFilterValue(current, chip.field, chip.value)
          : { ...current, [chip.field]: chip.field === 'priceRange' ? null : chip.value };

      setFilters(next);
      if (chip.field === 'priceRange' && priceSlider) {
        const { min, max } = getPriceBounds(products);
        priceSlider.set([min, max]);
      }
      syncUI();
    });

    chipsWrap.appendChild(el);
  });
}

function updateCountBadge() {
  const count = countActiveFilters(getFilters());
  const badge = document.querySelector('[data-filter-count-badge]');
  if (badge) {
    badge.hidden = count === 0;
    badge.textContent = count;
  }
}

function updateResultsSummary(totalItems) {
  const el = document.querySelector('[data-results-summary]');
  if (el) el.textContent = `Showing ${totalItems} of ${products.length} products`;
}

function syncCheckboxStates() {
  const filters = getFilters();

  document.querySelectorAll('[data-options-categories] input').forEach((input) => {
    input.checked = filters.categories.includes(input.value);
  });

  document.querySelectorAll('[data-options-brands] input').forEach((input) => {
    input.checked = filters.brands.includes(input.value);
  });

  document.querySelectorAll('[data-options-colors] [data-color]').forEach((button) => {
    const active = filters.colors.includes(button.dataset.color);
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  document.querySelectorAll('[data-badge]').forEach((input) => {
    input.checked = (filters.badges || []).includes(input.dataset.badge);
  });

  const inStock = document.querySelector('[data-instock]');
  if (inStock) inStock.checked = filters.inStockOnly;

  document.querySelectorAll('[data-rating]').forEach((input) => {
    input.checked = Number(input.value) === filters.minRating;
  });
}

function syncUI() {
  renderChips();
  updateCountBadge();
  syncCheckboxStates();
}

function setupDrawer() {
  const trigger = document.querySelector('[data-filter-trigger]');
  const panel = document.querySelector('[data-filter-panel]');
  const overlay = document.querySelector('[data-filter-overlay]');
  const closeBtn = document.querySelector('[data-filter-close]');
  const applyBtn = document.querySelector('[data-filter-apply]');

  const open = () => {
    panel?.classList.add('is-open');
    overlay?.classList.add('is-visible');
    document.body.classList.add('is-filter-open');
  };

  const close = () => {
    panel?.classList.remove('is-open');
    overlay?.classList.remove('is-visible');
    document.body.classList.remove('is-filter-open');
  };

  trigger?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  applyBtn?.addEventListener('click', close);
}

function setupReset() {
  document.querySelectorAll('[data-filter-reset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      resetGridFilters();
      if (priceSlider) {
        const { min, max } = getPriceBounds(products);
        priceSlider.set([min, max]);
      }
      syncUI();
    });
  });
}

function setupRating() {
  document.querySelectorAll('[data-rating]').forEach((input) => {
    input.addEventListener('change', () => {
      setFilters({ ...getFilters(), minRating: Number(input.value) });
      syncUI();
    });
  });
}

function setupAvailability() {
  document.querySelector('[data-instock]')?.addEventListener('change', (e) => {
    setFilters({ ...getFilters(), inStockOnly: e.target.checked });
    syncUI();
  });
}

function setupBadges() {
  document.querySelectorAll('[data-badge]').forEach((input) => {
    input.addEventListener('change', () => {
      setFilters(toggleFilterValue(getFilters(), 'badges', input.dataset.badge));
      syncUI();
    });
  });
}

function setupPriceSlider() {
  const el = document.querySelector('[data-price-slider]');
  if (!el || typeof noUiSlider === 'undefined') return;

  const { min, max } = getPriceBounds(products);
  if (min === max) return;

  noUiSlider.create(el, {
    start: [min, max],
    connect: true,
    range: { min, max },
    step: 1,
  });

  priceSlider = el.noUiSlider;

  const minLabel = document.querySelector('[data-price-min]');
  const maxLabel = document.querySelector('[data-price-max]');

  priceSlider.on('update', (values) => {
    if (minLabel) minLabel.textContent = `$${Math.round(values[0])}`;
    if (maxLabel) maxLabel.textContent = `$${Math.round(values[1])}`;
  });

  priceSlider.on('change', (values) => {
    setFilters({ ...getFilters(), priceRange: [Math.round(values[0]), Math.round(values[1])] });
    syncUI();
  });
}

export function initFiltersUI(productList) {
  products = productList;

  const options = getFilterOptions(products);
  renderCheckboxGroup(document.querySelector('[data-options-categories]'), options.categories, 'categories');
  renderCheckboxGroup(document.querySelector('[data-options-brands]'), options.brands, 'brands');
  renderColorGroup(document.querySelector('[data-options-colors]'), options.colors);

  setupPriceSlider();
  setupRating();
  setupAvailability();
  setupBadges();
  setupReset();
  setupDrawer();
  syncUI();

  document.addEventListener('productgrid:rendered', (e) => {
    updateResultsSummary(e.detail.totalItems);
  });
}
