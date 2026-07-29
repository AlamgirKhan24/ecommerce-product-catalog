import { getFilterOptions, toggleFilterValue } from '../modules/filter.js';
import { getFilters, setFilters } from './productgrid.js';
import { syncFiltersUI } from './filtersUI.js';

const ICON_MAP = {
  Headphones: 'headphones',
  Accessories: 'watch',
  Carry: 'briefcase',
  'Home Tech': 'lamp',
};

function iconFor(category) {
  return ICON_MAP[category] || 'package';
}

export function initCategoryShowcase(products) {
  const grid = document.querySelector('[data-category-grid]');
  if (!grid) return;

  const { categories } = getFilterOptions(products);

  grid.innerHTML = categories
    .map((cat) => {
      const count = products.filter((p) => p.category === cat).length;
      return `
        <button type="button" class="category-card" data-category-tile="${cat}">
          <span class="category-card__icon"><i data-lucide="${iconFor(cat)}" aria-hidden="true"></i></span>
          <strong>${cat}</strong>
          <span>${count} products</span>
        </button>
      `;
    })
    .join('');

  if (window.lucide) window.lucide.createIcons();

  grid.querySelectorAll('[data-category-tile]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.categoryTile;
      setFilters({ ...getFilters(), categories: [category] });
      syncFiltersUI();

      grid.querySelectorAll('[data-category-tile]').forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      document.querySelector('.shop-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}