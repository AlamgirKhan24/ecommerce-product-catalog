import { createEl } from '../utils/dom.js';
import { formatPrice } from '../utils/formatter.js';
import { isWishlisted, toggleWishlist } from '../modules/wishlist.js';

// ---------------------------------------------
// Renders a single product into your real .neo-product-card markup
// ---------------------------------------------

const heartIconPath =
  'M19.5 5.4c-1.7-1.7-4.4-1.7-6.1 0L12 6.8l-1.4-1.4c-1.7-1.7-4.4-1.7-6.1 0s-1.7 4.4 0 6.1L12 19l7.5-7.5c1.7-1.7 1.7-4.4 0-6.1Z';

function heartSvg() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', heartIconPath);
  svg.appendChild(path);
  return svg;
}

/** Build one product card DOM node matching your existing markup exactly */
export function renderProductCard(product) {
  const wishBtn = createEl(
    'button',
    {
      class: 'neo-product-card__wish',
      type: 'button',
      'aria-label': 'Add to wishlist',
      dataset: { productId: product.id },
    },
    [heartSvg()]
  );
  wishBtn.classList.toggle('is-active', isWishlisted(product.id));

  wishBtn.addEventListener('click', () => {
    const nowWishlisted = toggleWishlist(product);
    wishBtn.classList.toggle('is-active', nowWishlisted);
  });

  const media = createEl(
    'a',
    { class: 'neo-product-card__media', href: `product.html?id=${product.id}` },
    [createEl('img', { src: product.images?.[0] ?? '', alt: product.name, loading: 'lazy' })]
  );

  const meta = createEl('div', { class: 'neo-product-card__meta' }, [
    createEl('strong', {}, formatPrice(product.price)),
    createEl('small', {}, `★ ${product.rating.toFixed(1)}`),
  ]);

  const body = createEl('div', { class: 'neo-product-card__body' }, [
    createEl('span', {}, product.category),
    createEl('h3', {}, product.name),
    meta,
  ]);

  return createEl(
    'article',
    { class: 'neo-product-card', dataset: { productId: product.id } },
    [wishBtn, media, body]
  );
}
import { getPageRange } from '../modules/pagination.js';
import { createEl } from '../utils/dom.js';

function renderPaginationControls() {
  const nav = document.querySelector('[data-pagination]');
  if (!nav) return;

  const { page, totalPages } = getCurrentPagination();
  nav.innerHTML = '';
  if (totalPages <= 1) return;

  const prevBtn = createEl(
    'button',
    { class: 'pagination__arrow', 'aria-label': 'Previous page', disabled: page === 1 ? '' : null },
    '‹'
  );
  prevBtn.addEventListener('click', () => goToPage(page - 1));
  nav.appendChild(prevBtn);

  getPageRange(page, totalPages).forEach((entry) => {
    if (entry === '…') {
      nav.appendChild(createEl('span', { class: 'pagination__ellipsis' }, '…'));
      return;
    }
    const btn = createEl(
      'button',
      { class: `pagination__btn${entry === page ? ' is-active' : ''}` },
      String(entry)
    );
    btn.addEventListener('click', () => goToPage(entry));
    nav.appendChild(btn);
  });

  const nextBtn = createEl(
    'button',
    { class: 'pagination__arrow', 'aria-label': 'Next page', disabled: page === totalPages ? '' : null },
    '›'
  );
  nextBtn.addEventListener('click', () => goToPage(page + 1));
  nav.appendChild(nextBtn);
}

document.addEventListener('productgrid:rendered', renderPaginationControls);
