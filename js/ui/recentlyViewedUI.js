import { renderProductCard } from './productcard.js';
import { empty } from '../utils/dom.js';

export function renderRecentlyViewed(products) {
  const section = document.querySelector('[data-recently-viewed]');
  const grid = document.querySelector('[data-recently-viewed-grid]');
  if (!section || !grid) return;

  if (!products.length) {
    section.hidden = true;
    return;
  }

  empty(grid);
  products.forEach((p) => grid.appendChild(renderProductCard(p)));
  section.hidden = false;
}