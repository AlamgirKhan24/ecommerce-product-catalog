// ---------------------------------------------
// Swiper.js — carousel initialization
// Requires the Swiper UMD bundle loaded globally before this file runs
// (via CDN script tag in each HTML page)
// ---------------------------------------------

/**
 * Init the hero/featured product image slider (product.html gallery uses
 * PhotoSwipe instead — this is for horizontal card carousels only:
 * "Related Products", "Recently Viewed", home page category slider).
 */
export function initProductSlider(selector = '.js-product-slider') {
  const el = document.querySelector(selector);
  if (!el || typeof window.Swiper === 'undefined') return null;

  return new window.Swiper(el, {
    slidesPerView: 1.15,
    spaceBetween: 16,
    speed: 500,
    grabCursor: true,
    breakpoints: {
      576: { slidesPerView: 2.2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      992: { slidesPerView: 4, spaceBetween: 24 },
    },
    navigation: {
      nextEl: `${selector}-next`,
      prevEl: `${selector}-prev`,
    },
  });
}

/** Init a full-bleed hero banner slider (if home page has multiple hero slides) */
export function initHeroSlider(selector = '.js-hero-slider') {
  const el = document.querySelector(selector);
  if (!el || typeof window.Swiper === 'undefined') return null;

  return new window.Swiper(el, {
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: { crossFade: true },
    speed: 700,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: {
      el: `${selector}-pagination`,
      clickable: true,
    },
  });
}

/** Init the small thumbnail strip on product.html (syncs with the main gallery) */
export function initThumbnailSlider(selector = '.js-thumb-slider') {
  const el = document.querySelector(selector);
  if (!el || typeof window.Swiper === 'undefined') return null;

  return new window.Swiper(el, {
    slidesPerView: 4,
    spaceBetween: 12,
    watchSlidesProgress: true,
  });
}

/** Bootstrap every slider present on the current page — call once from app.js */
export function initAllSliders() {
  initHeroSlider();
  initProductSlider('.js-product-slider');
  initProductSlider('.js-related-slider');
  initThumbnailSlider();
}