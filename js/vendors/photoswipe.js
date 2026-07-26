// ---------------------------------------------
// PhotoSwipe — product image lightbox/zoom
// Requires PhotoSwipe v5 UMD bundle + CSS loaded globally before this runs
// Gallery markup convention: a container with <a href="full-image.jpg"
// data-pswp-width="..." data-pswp-height="..."><img ...></a> children
// ---------------------------------------------

let lightboxInstance = null;

/**
 * Initialize the lightbox, delegated to a gallery container so it works
 * even if gallery.js swaps images in/out dynamically.
 * @param {string} gallerySelector - e.g. '.js-product-gallery'
 * @param {string} childSelector - e.g. 'a.gallery-item'
 */
export function initPhotoSwipe(gallerySelector = '.js-product-gallery', childSelector = 'a') {
  if (typeof window.PhotoSwipeLightbox === 'undefined') return null;

  const galleryEl = document.querySelector(gallerySelector);
  if (!galleryEl) return null;

  lightboxInstance = new window.PhotoSwipeLightbox({
    gallery: gallerySelector,
    children: childSelector,
    pswpModule: window.PhotoSwipe, // core module, loaded via CDN alongside the lightbox bundle
    showHideAnimationType: 'zoom',
    bgOpacity: 0.9,
    padding: { top: 24, bottom: 24, left: 24, right: 24 },
  });

  lightboxInstance.init();
  return lightboxInstance;
}

/** Open the lightbox programmatically at a given image index (e.g. thumbnail click) */
export function openPhotoSwipeAt(index = 0) {
  if (!lightboxInstance) return;
  lightboxInstance.loadAndOpen(index);
}

/** Clean up — call if the gallery is destroyed/replaced (e.g. navigating between products via AJAX) */
export function destroyPhotoSwipe() {
  if (!lightboxInstance) return;
  lightboxInstance.destroy();
  lightboxInstance = null;
}