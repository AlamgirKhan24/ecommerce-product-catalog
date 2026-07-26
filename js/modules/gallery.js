import { initPhotoSwipe, destroyPhotoSwipe } from '../vendors/photoswipe.js';
import { initThumbnailSlider } from '../vendors/swiper.js';

// ---------------------------------------------
// Gallery — product.html image viewer state
// Coordinates: main image display, thumbnail strip (Swiper), and the
// PhotoSwipe zoom lightbox, so all three stay in sync when the user
// clicks a thumbnail or switches product color/variant.
// ---------------------------------------------

let currentImages = [];
let currentIndex = 0;
let thumbSlider = null;

const mainImageSelector = '.js-gallery-main img';
const thumbSelector = '.js-thumb-slider';

/** Update the large main image to a given index */
function renderMainImage(index) {
  const mainImg = document.querySelector(mainImageSelector);
  if (!mainImg || !currentImages[index]) return;

  mainImg.src = currentImages[index];
  currentIndex = index;

  // keep thumbnail slider in sync (highlight active thumb)
  document.querySelectorAll(`${thumbSelector} .js-thumb-item`).forEach((el, i) => {
    el.classList.toggle('is-active', i === index);
  });
}

/**
 * Initialize the full gallery for a product's image set.
 * Call this on product page load, and again if the user picks a
 * different color variant with its own image set.
 */
export function initGallery(images = []) {
  currentImages = images;
  currentIndex = 0;

  destroyPhotoSwipe(); // clear any previous instance before re-binding
  renderMainImage(0);

  thumbSlider = initThumbnailSlider(thumbSelector);
  initPhotoSwipe('.js-product-gallery', 'a');

  // Clicking a thumbnail updates the main image
  document.querySelectorAll(`${thumbSelector} .js-thumb-item`).forEach((thumb, index) => {
    thumb.addEventListener('click', () => renderMainImage(index));
  });
}

/** Go to the next/previous image (used by custom arrow buttons on the main image) */
export function nextImage() {
  renderMainImage((currentIndex + 1) % currentImages.length);
}

export function prevImage() {
  renderMainImage((currentIndex - 1 + currentImages.length) % currentImages.length);
}

/** Swap to a new image set entirely (e.g. user selects a different color swatch) */
export function setGalleryImages(images) {
  initGallery(images);
}

export function getCurrentImageIndex() {
  return currentIndex;
}