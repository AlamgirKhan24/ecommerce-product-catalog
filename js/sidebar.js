const SIDEBAR_STORAGE_KEY = 'nitec_sidebar_collapsed';
const SIDEBAR_COMPONENT_PATH = 'components/sidebar.html';
const LUCIDE_CDN = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';
const ANIMATION_MS = 260;
const MOBILE_QUERY = '(max-width: 980px)';

let isAnimating = false;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.lucide) resolve();
      else existing.addEventListener('load', resolve, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function ensureLucideIcons() {
  if (!window.lucide) await loadScript(LUCIDE_CDN);
  window.lucide?.createIcons();
}

function getRouteFromPath() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  const routes = {
    '': 'home',
    'index.html': 'home',
    'shop.html': window.location.hash === '#categories' ? 'categories' : 'products',
    'product.html': 'products',
    'wishlist.html': 'wishlist',
    'cart.html': 'cart',
    'dashboard.html': 'analytics',
    'profile.html': 'profile',
    'settings.html': 'settings',
    'contact.html': 'contact',
  };

  return routes[page] || page.replace('.html', '');
}

function setActiveLink(root) {
  const activeRoute = getRouteFromPath();
  root.querySelectorAll('[data-route]').forEach((link) => {
    const isActive = link.dataset.route === activeRoute;
    link.classList.toggle('is-active', isActive);
    if (isActive) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function createOverlay() {
  const overlay = document.createElement('button');
  overlay.className = 'sidebar-overlay';
  overlay.type = 'button';
  overlay.setAttribute('aria-label', 'Close sidebar');
  document.body.appendChild(overlay);
  return overlay;
}

function isMobile() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function renderToggleIcon(button) {
  const collapsed = document.body.classList.contains('is-sidebar-collapsed');
  const mobileOpen = document.body.classList.contains('is-sidebar-open');
  const shouldShowOpen = isMobile() ? !mobileOpen : collapsed;
  const label = shouldShowOpen ? 'Expand Sidebar' : 'Collapse Sidebar';
  const icon = shouldShowOpen ? 'panel-left-open' : 'panel-left-close';

  button.dataset.tooltip = label;
  button.setAttribute('aria-label', label);
  button.setAttribute('aria-expanded', String(!shouldShowOpen));
  const iconEl = document.createElement('i');
  iconEl.dataset.lucide = icon;
  iconEl.setAttribute('aria-hidden', 'true');
  button.replaceChildren(iconEl);
  window.lucide?.createIcons();
}

function withAnimationLock(action) {
  if (isAnimating) return;
  isAnimating = true;
  action();
  window.setTimeout(() => {
    isAnimating = false;
  }, ANIMATION_MS);
}

function setCollapsed(isCollapsed, toggleButton) {
  document.body.classList.toggle('is-sidebar-collapsed', isCollapsed);
  localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
  renderToggleIcon(toggleButton);
}

function openMobileSidebar(toggleButton) {
  document.body.classList.add('is-sidebar-open');
  renderToggleIcon(toggleButton);
}

function closeMobileSidebar(toggleButton) {
  document.body.classList.remove('is-sidebar-open');
  renderToggleIcon(toggleButton);
}

function initInteractions(root) {
  const sidebar = root.querySelector('[data-sidebar]');
  const toggleButton = root.querySelector('[data-sidebar-toggle]');
  const overlay = createOverlay();

  sidebar.id = 'app-sidebar';
  document.body.classList.add('has-app-sidebar');

  const savedCollapsed = localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  document.body.classList.toggle('is-sidebar-collapsed', savedCollapsed);
  renderToggleIcon(toggleButton);

  toggleButton.addEventListener('click', () => {
    withAnimationLock(() => {
      if (isMobile()) {
        const isOpen = document.body.classList.contains('is-sidebar-open');
        if (isOpen) closeMobileSidebar(toggleButton);
        else openMobileSidebar(toggleButton);
        return;
      }

      setCollapsed(!document.body.classList.contains('is-sidebar-collapsed'), toggleButton);
    });
  });

  overlay.addEventListener('click', () => {
    withAnimationLock(() => closeMobileSidebar(toggleButton));
  });

  root.querySelectorAll('.app-sidebar__link').forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobile()) {
        closeMobileSidebar(toggleButton);
        return;
      }

      setCollapsed(true, toggleButton);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.body.classList.contains('is-sidebar-open')) {
      withAnimationLock(() => closeMobileSidebar(toggleButton));
      toggleButton.focus();
    }
  });

  window.matchMedia(MOBILE_QUERY).addEventListener('change', () => {
    document.body.classList.remove('is-sidebar-open');
    renderToggleIcon(toggleButton);
  });
}

async function initSidebar() {
  if (document.querySelector('[data-sidebar-root]')) return;

  const root = document.createElement('div');
  root.dataset.sidebarRoot = '';
  document.body.prepend(root);

  try {
    const response = await fetch(SIDEBAR_COMPONENT_PATH);
    if (!response.ok) throw new Error(`Sidebar component failed to load: ${response.status}`);
    root.innerHTML = await response.text();
    setActiveLink(root);
    initInteractions(root);
    await ensureLucideIcons();
    const toggleButton = document.querySelector('.app-sidebar-toggle');
    if (toggleButton) renderToggleIcon(toggleButton);
  } catch (error) {
    console.error('[sidebar]', error);
    root.remove();
  }
}

document.addEventListener('DOMContentLoaded', initSidebar);
