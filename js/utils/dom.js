// ---------------------------------------------
// DOM utilities — small, dependency-free helpers
// used across every ui/ and modules/ file
// ---------------------------------------------

/** Shorthand querySelector, scoped optionally to a parent */
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

/** Shorthand querySelectorAll, returns a real array (not NodeList) */
export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

/**
 * Create an element with attributes, classes, and children in one call.
 * Usage: createEl('button', { class: 'btn', 'aria-label': 'Add' }, 'Add to cart')
 */
export function createEl(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'class') {
      el.className = value;
    } else if (key === 'dataset') {
      Object.entries(value).forEach(([dKey, dVal]) => {
        el.dataset[dKey] = dVal;
      });
    } else if (key.startsWith('on') && typeof value === 'function') {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else {
      el.setAttribute(key, value);
    }
  });

  const list = Array.isArray(children) ? children : [children];
  list.forEach((child) => {
    if (child === null || child === undefined || child === false) return;
    if (typeof child === 'string' || typeof child === 'number') {
      el.appendChild(document.createTextNode(child));
    } else {
      el.appendChild(child);
    }
  });

  return el;
}

/** Add an event listener and return an unsubscribe function */
export function on(target, event, handler, options) {
  target.addEventListener(event, handler, options);
  return () => target.removeEventListener(event, handler, options);
}

/** Event delegation — listen on a static parent for events on dynamic children */
export function delegate(parent, event, selector, handler) {
  const listener = (e) => {
    const target = e.target.closest(selector);
    if (target && parent.contains(target)) {
      handler(e, target);
    }
  };
  parent.addEventListener(event, listener);
  return () => parent.removeEventListener(event, listener);
}

/** Empty an element's contents */
export function empty(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

/** Toggle a class and return whether it's now present */
export function toggleClass(el, className, force) {
  return el.classList.toggle(className, force);
}

/** Read a boolean-ish dataset attribute, e.g. dataset.active === "true" */
export function dataBool(el, key) {
  return el.dataset[key] === 'true';
}

/** Check if an element is currently visible in the viewport */
export function isInViewport(el, offset = 0) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) - offset &&
    rect.bottom >= offset
  );
}

/** Lock/unlock body scroll — used by modal.js and the mobile filter sidebar */
export function lockScroll(shouldLock) {
  document.body.classList.toggle('no-scroll', shouldLock);
}