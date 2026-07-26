// ---------------------------------------------
// GSAP — entrance and micro-interaction animations
// Requires the GSAP UMD bundle (+ ScrollTrigger plugin) loaded globally
// ---------------------------------------------

function getGsap() {
  return typeof window.gsap !== 'undefined' ? window.gsap : null;
}

/** Hero section entrance — staggered fade/slide-up on page load */
export function animateHeroEntrance() {
  const gsap = getGsap();
  if (!gsap) return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.from('.hero-card__badge', { opacity: 0, y: 12, duration: 0.5 })
    .from('.hero-card__title', { opacity: 0, y: 24, duration: 0.6 }, '-=0.3')
    .from('.hero-card__stat', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
    .from('.hero-card__media img', { opacity: 0, scale: 0.92, duration: 0.7 }, '-=0.5')
    .from('.bento-card', { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }, '-=0.5');
}

/** Gentle floating loop for the hero product image (paired with the CSS float keyframe) */
export function animateFloatingProduct(selector = '.hero-card__media img') {
  const gsap = getGsap();
  if (!gsap) return;

  gsap.to(selector, {
    y: -14,
    duration: 2.2,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });
}

/** Scroll-triggered reveal for generic sections — requires ScrollTrigger plugin */
export function animateScrollReveals(selector = '.js-reveal') {
  const gsap = getGsap();
  if (!gsap || typeof window.ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(window.ScrollTrigger);

  document.querySelectorAll(selector).forEach((el) => {
    gsap.from(el, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });
}

/** Quick "pop" feedback animation — used on add-to-cart button click */
export function animatePop(target) {
  const gsap = getGsap();
  if (!gsap) return;
  gsap.fromTo(target, { scale: 1 }, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1 });
}

/** Bootstrap page-load animations — call once from app.js on the home page */
export function initHomeAnimations() {
  animateHeroEntrance();
  animateFloatingProduct();
  animateScrollReveals();
}