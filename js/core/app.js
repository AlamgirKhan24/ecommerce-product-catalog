import { CONFIG } from './config.js';
import { DATA_PATHS } from './constants.js';

import { initTheme } from '../modules/theme.js';
import { initSearchIndex } from '../modules/search.js';
import { getCurrentProduct, getRelatedProducts, renderProductDetail } from '../modules/product.js';
import { initProductTabs } from '../ui/productTabs.js';
import { initStatistics } from '../modules/statistics.js';
import { initCountdowns } from '../modules/countdown.js';
import { initGallery } from '../modules/gallery.js';

import { initNavbar } from '../ui/navbar.js';
import { initFooter } from '../ui/footer.js';
import { initHero } from '../ui/hero.js';
import { initProductGrid } from '../ui/productgrid.js';
import { initFiltersUI } from '../ui/filtersUI.js';
import { getWishlistItems, removeFromWishlist, clearWishlist } from '../modules/wishlist.js';
import { addToCart } from '../modules/cart.js';
import { initCartPage } from '../ui/carUI.js';
import { initFeaturedProducts } from '../ui/featuredProducts.js';

import { initAOS } from '../vendors/aos.js';
import { initLazyLoad } from '../vendors/lazyside.js';
import { initDayjs } from '../vendors/dayjs.js';
import { initLucideIcons } from '../vendors/lucide.js';

import { notifyLoadError } from '../modules/notifications.js';

// ---------------------------------------------
// App bootstrap — runs once per page load, wires up
// every module/ui piece based on what's actually present in the DOM
// ---------------------------------------------

async function loadProducts() {
  try {
    const res = await fetch(DATA_PATHS.PRODUCTS);
    if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('[app] Product load failed:', err);
    notifyLoadError('products');
    return [];
  }
}

async function init() {
  // Theme first, before anything paints
  initTheme();

  // Vendor setup that doesn't depend on data
  initDayjs();
  initLazyLoad();
  initAOS();

  // Global chrome — present on every page
  initNavbar();
  initFooter();

  // Page-specific hero animation (no-ops if not on the home page)
  initHero();
  initFeaturedProducts();

  // Load the product dataset once, then fan out to whichever
  // page-specific feature actually needs it
  const products = await loadProducts();

  initSearchIndex(products);
  initStatistics({ products, reviews: [] });
  initCountdowns();

  // shop.html — live grid with filter/sort/search
  // shop.html — live grid with filter/sort/search
  if (document.querySelector('[data-product-grid]')) {
    initProductGrid(products);
    initFiltersUI(products);
  }

  // wishlist.html
  initWishlistPage();

  // cart.html
  initCartPage();

  // product.html — detail view + gallery + related products
  // product.html — detail view + gallery + related products
  if (document.querySelector('.product-detail')) {
    const current = getCurrentProduct(products);
    const related = getRelatedProducts(products, current);
    renderProductDetail(current, related);
    initProductTabs(current);
    if (current?.images?.length) initGallery(current.images);
  }
}

document.addEventListener('DOMContentLoaded', init);

initLucideIcons();
