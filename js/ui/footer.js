// ---------------------------------------------
// Footer — currently static markup, so this file just handles
// the small dynamic bits: auto-updating copyright year.
// ---------------------------------------------

/** Bootstrap — call once from app.js on every page */
export function initFooter() {
  const footer = document.querySelector('.neo-footer-strip');
  if (!footer) return;

  const yearEl = footer.querySelector('[data-year]');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  footer.querySelector('[data-back-to-top]')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
