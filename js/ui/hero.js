import { animateHeroEntrance, animateFloatingProduct } from '../vendors/gsap.js';

// ---------------------------------------------
// Hero — home page hero-showcase entrance + floating product image
// (matches .hero-showcase / .hero-showcase__product markup on index.html)
// ---------------------------------------------

// ---------------------------------------------
// Promo banner — scroll-triggered fade-in.
// The countdown itself is already handled automatically by the
// existing js/modules/countdown.js (via app.js's initCountdowns())
// — no wiring needed here, just the reveal animation.
// ---------------------------------------------
function initPromoBannerReveal() {
  const banner = document.querySelector('.promo-banner');
  if (!banner) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          banner.classList.add('is-visible');
          observer.unobserve(banner);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(banner);
}

/** Bootstrap — call once from app.js, only runs if the hero section exists on the page */
export function initHero() {
  const hero = document.querySelector('.hero-showcase');
  if (!hero) return; // not the home page, nothing to do

  animateHeroEntrance();
  animateFloatingProduct('.hero-showcase__product');
  initPromoBannerReveal();
}