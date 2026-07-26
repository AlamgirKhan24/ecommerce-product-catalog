import { PAGINATION } from '../core/constants.js';

// ---------------------------------------------
// Pagination — pure functions, slices a product array into pages
// State (current page) is owned by whatever UI file calls this (productgrid.js)
// ---------------------------------------------

/** Default pagination state */
export function createDefaultPaginationState(pageSize = PAGINATION.DEFAULT_PAGE_SIZE) {
  return {
    page: 1,
    pageSize,
  };
}

/** Total number of pages for a given item count + page size */
export function getTotalPages(totalItems, pageSize) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/** Slice the array to just the current page's items */
export function paginate(items, page, pageSize) {
  const totalPages = getTotalPages(items.length, pageSize);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Build the array of page numbers to render as clickable buttons,
 * with `…` gaps for large page counts (e.g. [1, '…', 4, 5, 6, '…', 12]).
 */
export function getPageRange(currentPage, totalPages, siblingCount = 1) {
  const totalNumbers = siblingCount * 2 + 5; // first, last, current, 2 siblings, 2 ellipses

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const range = [1];

  if (showLeftDots) range.push('…');

  for (let i = Math.max(2, leftSibling); i <= Math.min(totalPages - 1, rightSibling); i += 1) {
    range.push(i);
  }

  if (showRightDots) range.push('…');

  range.push(totalPages);

  return range;
}

/** Clamp a requested page number into valid bounds */
export function clampPage(page, totalPages) {
  return Math.min(Math.max(1, page), totalPages);
}