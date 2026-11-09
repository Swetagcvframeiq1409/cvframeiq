(function () {
  'use strict';

  const routes = window.FRAMEIQ_ROUTES || {};
  const app = document.getElementById('app');
  if (!app) return;

  const pageCache = new Map();
  let currentController = null;

  function isRouteKnown(url) {
    const path = new URL(url, window.location.origin).pathname.replace(/\\/g, '/');
    return Boolean(routes[path] || routes[path.replace(/\/$/, '')] || routes['/404']);
  }

  function shouldHandle(link) {
    if (!link) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    if (link.rel === 'external' || link.rel === 'noopener') return false;
    if (link.origin !== window.location.origin) return false;
    if (link.pathname === window.location.pathname && !link.hash) return false;
    return isRouteKnown(link.href);
  }

  async function fetchPage(url) {
    const controller = new AbortController();
    currentController = controller;
    const response = await fetch(url, { signal: controller.signal, credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Route failed with ${response.status}`);
    return response.text();
  }

  function swapPage(html, path) {
    const parser = new DOMParser();
    const nextDocument = parser.parseFromString(html, 'text/html');
    const nextApp = nextDocument.querySelector('#app, main, #main-content');
    if (!nextApp) throw new Error('Page template does not contain #app or main content');
    app.replaceChildren(...nextApp.childNodes);
    document.title = nextDocument.title || document.title;
    const pageName = path.replace(/^\//, '').replace(/\//g, '-') || 'home';
    const pageModule = window.FrameIQ && window.FrameIQ.pages ? window.FrameIQ.pages[pageName] : null;
    if (pageModule && pageModule.destroy) pageModule.destroy();
    if (pageModule && pageModule.init) pageModule.init(app);
    document.dispatchEvent(new CustomEvent('frameiq:page-ready', { detail: { path } }));
  }

  async function navigate(url, fromClick = false) {
    const targetUrl = new URL(url, window.location.href).href;
    const routePath = new URL(targetUrl).pathname;
    const cacheKey = routePath || '/';
    if (currentController) currentController.abort();
    try {
      const html = pageCache.has(cacheKey) ? pageCache.get(cacheKey) : await fetchPage(targetUrl);
      pageCache.set(cacheKey, html);
      document.dispatchEvent(new CustomEvent('frameiq:navigate', { detail: { url: targetUrl, fromClick } }));
      swapPage(html, routePath);
      history.pushState({ path: routePath }, '', targetUrl);
    } catch (error) {
      console.warn('Router fallback triggered:', error);
      window.location.assign(targetUrl);
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a');
    if (!link || !shouldHandle(link)) return;
    event.preventDefault();
    navigate(link.href, true);
  }, true);

  window.addEventListener('popstate', () => {
    const nextUrl = new URL(window.location.href);
    const target = routes[nextUrl.pathname] || routes['/404'];
    if (!target) return;
    navigate(nextUrl.href, false);
  });

  window.FrameIQRouter = {
    navigate,
    routes,
    pageCache
  };
})();
