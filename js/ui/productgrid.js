import { renderProductCard } from './productcard.js';
import { empty } from '../utils/dom.js';
import { createDefaultFilterState, applyFilters, toggleFilterValue } from '../modules/filter.js';
import { sortProducts } from '../modules/sorting.js';
import { paginate, getTotalPages, createDefaultPaginationState } from '../modules/pagination.js';
import { rescanLazyImages } from '../vendors/lazyside.js';
import { refreshAOS } from '../vendors/aos.js';

// ---------------------------------------------
// Product grid — orchestrates filter + sort + pagination + render
// Mounts on any element with [data-product-grid]
// ---------------------------------------------

let allProducts = [];
let filters = createDefaultFilterState();
let sortKey = 'featured';
let pagination = createDefaultPaginationState();

export function getFilters() {
  return filters;
}

export function setFilters(newFilters) {
  filters = newFilters;
  pagination.page = 1;
  render();
}

export function resetFilters() {
  filters = createDefaultFilterState();
  pagination.page = 1;
  render();
}

function getVisibleProducts() {
  const filtered = applyFilters(allProducts, filters);
  return sortProducts(filtered, sortKey);
}

function render() {
  const grid = document.querySelector('[data-product-grid]');
  if (!grid) return;

  const visible = getVisibleProducts();
  const pageItems = paginate(visible, pagination.page, pagination.pageSize);

  empty(grid);
  pageItems.forEach((product) => grid.appendChild(renderProductCard(product)));

  rescanLazyImages();
  refreshAOS();

  document.dispatchEvent(
    new CustomEvent('productgrid:rendered', {
      detail: { totalPages: getTotalPages(visible.length, pagination.pageSize), totalItems: visible.length },
    })
  );
}

/** Initialize the grid with the full product dataset */
export function initProductGrid(products) {
  allProducts = products;
  render();

  // Sort dropdown (values now match SORT_OPTIONS: featured/low/high/rating)
  document.querySelector('[data-sort]')?.addEventListener('change', (e) => {
    sortKey = e.target.value;
    render();
  });

  // Color swatches
  document.querySelectorAll('.neo-swatches span').forEach((swatch) => {
    swatch.addEventListener('click', () => {
      const color = swatch.style.getPropertyValue('--swatch').trim();
      filters = toggleFilterValue(filters, 'colors', color);
      swatch.classList.toggle('is-active');
      pagination.page = 1;
      render();
    });
  });
}

/** Called by search.js when live search results come in — swaps the grid to show only matches */
export function renderSearchResults(results) {
  allProducts = results.length ? results : allProducts;
  pagination.page = 1;
  render();
}

export function goToPage(page) {
  pagination.page = page;
  render();
}

export function getCurrentPagination() {
  return { ...pagination, totalPages: getTotalPages(getVisibleProducts().length, pagination.pageSize) };
}