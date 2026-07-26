
import { getQueryParams } from '../utils/helpers.js';

// ---------------------------------------------
// Product — single product detail page logic
// Reads ?id= from the URL, finds the matching product from the full dataset
// ---------------------------------------------

/** Find a product by id from the full dataset. Falls back to the first product if no match. */
export function getCurrentProduct(products) {
  const { id } = getQueryParams();
  if (!id) return products[0] ?? null;
  return products.find((p) => p.id === id) ?? products[0] ?? null;
}

/** Pick related products — same category, excluding the current one, capped at 4 */
export function getRelatedProducts(products, currentProduct, limit = 4) {
  if (!currentProduct) return [];
  return products
    .filter((p) => p.category === currentProduct.category && p.id !== currentProduct.id)
    .slice(0, limit);
}

import { formatPrice } from '../utils/formatter.js';
import { addToCart } from './cart.js';
import { toggleWishlist, isWishlisted } from './wishlist.js';
import { renderProductCard } from '../ui/productcard.js';
import { empty } from '../utils/dom.js';

/** Fill the static product-detail markup with real data for the current product */
export function renderProductDetail(product, relatedProducts = []) {
  if (!product) return;

  const panel = document.querySelector('.product-info-panel');
  const gallery = document.querySelector('.product-gallery-panel__image img');

  if (gallery) {
    gallery.src = product.images?.[0] ?? '';
    gallery.alt = product.name;
  }

  if (panel) {
    panel.querySelector('.neo-pill').textContent = product.category;
    panel.querySelector('h1').textContent = product.name;
    panel.querySelector('p').textContent = product.description ?? '';

    const priceEl = panel.querySelector('.product-price strong');
    const oldPriceEl = panel.querySelector('.product-price del');
    if (priceEl) priceEl.textContent = formatPrice(product.price);
    if (oldPriceEl) {
      if (product.oldPrice) {
        oldPriceEl.textContent = formatPrice(product.oldPrice);
        oldPriceEl.style.display = '';
      } else {
        oldPriceEl.style.display = 'none';
      }
    }

    // Quantity + Add to Cart wiring
    const qtyDisplay = panel.querySelector('.quantity-control strong');
    const [decreaseBtn, increaseBtn] = panel.querySelectorAll('.quantity-control button');
    let qty = 1;

    decreaseBtn?.addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      qtyDisplay.textContent = qty;
    });
    increaseBtn?.addEventListener('click', () => {
      qty += 1;
      qtyDisplay.textContent = qty;
    });

    const addBtn = panel.querySelector('.neo-cta');
    addBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      addToCart(product, { qty });
    });

    const wishBtn = panel.querySelector('.neo-icon--heart');
    if (wishBtn) {
      wishBtn.classList.toggle('is-active', isWishlisted(product.id));
      wishBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const nowActive = toggleWishlist(product);
        wishBtn.classList.toggle('is-active', nowActive);
      });
    }
  }

  // Related products grid
  const relatedGrid = document.querySelector('.product-related .neo-product-grid');
  if (relatedGrid && relatedProducts.length) {
    empty(relatedGrid);
    relatedProducts.forEach((p) => relatedGrid.appendChild(renderProductCard(p)));
  }
}
