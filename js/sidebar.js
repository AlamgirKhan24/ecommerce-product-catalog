const SIDEBAR_STORAGE_KEY = 'nitec_sidebar_collapsed';
const SIDEBAR_COMPONENT_PATH = 'components/sidebar.html';
const LUCIDE_CDN = 'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js';

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', resolve, { once: true });
      if (window.lucide) resolve();
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
  if (!window.lucide) {
    await loadScript(LUCIDE_CDN);
  }

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

function createMobileToggle() {
  const button = document.createElement('button');
  button.className = 'sidebar-mobile-toggle';
  button.type = 'button';
  button.setAttribute('aria-label', 'Open navigation');
  button.setAttribute('aria-controls', 'app-sidebar');
  button.setAttribute('aria-expanded', 'false');
  button.innerHTML = '<i data-lucide="menu" aria-hidden="true"></i>';
  document.body.prepend(button);
  return button;
}

function createOverlay() {
  const overlay = document.createElement('button');
  overlay.className = 'sidebar-overlay';
  overlay.type = 'button';
  overlay.setAttribute('aria-label', 'Close navigation');
  document.body.appendChild(overlay);
  return overlay;
}

function setCollapsed(isCollapsed, collapseButton) {
  document.body.classList.toggle('is-sidebar-collapsed', isCollapsed);
  localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));

  if (collapseButton) {
    collapseButton.setAttribute('aria-pressed', String(isCollapsed));
    collapseButton.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
    const text = collapseButton.querySelector('span');
    const icon = collapseButton.querySelector('i, svg');
    if (text) text.textContent = isCollapsed ? 'Expand' : 'Collapse';
    if (icon) icon.setAttribute('data-lucide', isCollapsed ? 'panel-left-open' : 'panel-left-close');
    window.lucide?.createIcons();
  }
}

function initInteractions(root) {
  const sidebar = root.querySelector('[data-sidebar]');
  const collapseButton = root.querySelector('[data-sidebar-collapse]');
  const closeButton = root.querySelector('[data-sidebar-close]');
  const mobileToggle = createMobileToggle();
  const overlay = createOverlay();

  sidebar.id = 'app-sidebar';
  document.body.classList.add('has-app-sidebar');

  const savedCollapsed = localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  setCollapsed(savedCollapsed, collapseButton);

  function openMobileSidebar() {
    document.body.classList.add('is-sidebar-open');
    mobileToggle.setAttribute('aria-expanded', 'true');
    closeButton?.focus();
  }

  function closeMobileSidebar() {
    document.body.classList.remove('is-sidebar-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  }

  collapseButton?.addEventListener('click', () => {
    const nextState = !document.body.classList.contains('is-sidebar-collapsed');
    setCollapsed(nextState, collapseButton);
  });

  mobileToggle.addEventListener('click', openMobileSidebar);
  closeButton?.addEventListener('click', closeMobileSidebar);
  overlay.addEventListener('click', closeMobileSidebar);

  root.querySelectorAll('.app-sidebar__link').forEach((link) => {
    link.addEventListener('click', closeMobileSidebar);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileSidebar();
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
  } catch (error) {
    console.error('[sidebar]', error);
    root.remove();
  }
}

document.addEventListener('DOMContentLoaded', initSidebar);
