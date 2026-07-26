import { animateHeroEntrance, animateFloatingProduct } from '../vendors/gsap.js';

// ---------------------------------------------
// Hero — home page hero-showcase entrance + floating product image
// (matches .hero-showcase / .hero-showcase__product markup on index.html)
// ---------------------------------------------

/** Bootstrap — call once from app.js, only runs if the hero section exists on the page */
export function initHero() {
  const hero = document.querySelector('.hero-showcase');
  if (!hero) return; // not the home page, nothing to do

  animateHeroEntrance();
  animateFloatingProduct('.hero-showcase__product');
}