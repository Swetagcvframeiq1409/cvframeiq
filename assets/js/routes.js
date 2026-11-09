(function () {
  'use strict';

  const routes = window.FRAMEIQ_ROUTES || {
    '/': 'index.html',
    '/about': 'pages/about.html',
    '/ai-store': 'pages/ai-store.html',
    '/sectors': 'pages/sectors.html',
    '/404': '404.html'
  };

  const normalizePath = (value) => {
    const path = String(value || '').replace(/\\/g, '/').trim();
    if (!path || path === '#') return '/';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('mailto:') || path.startsWith('tel:')) return path;
    if (path.startsWith('/')) return path;
    if (path === 'index.html') return '/';
    if (path.endsWith('.html')) return `/${path.replace(/^\.\//, '').replace(/\.html$/i, '')}`;
    return `/${path.replace(/^\.\//, '').replace(/^pages\//, '')}`;
  };

  const toFile = (route) => {
    const normalized = normalizePath(route);
    if (normalized === '/' && routes['/']) return routes['/'];
    return routes[normalized] || routes['/404'];
  };

  const toHref = (href) => {
    if (!href || typeof href !== 'string') return href || '/';
    const trimmed = href.trim();
    if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(trimmed)) return trimmed;
    if (trimmed === 'index.html') return '/';
    const clean = normalizePath(trimmed);
    return clean === '/' ? '/' : clean;
  };

  window.FrameIQRoutes = {
    routes,
    normalizePath,
    toFile,
    toHref
  };
})();
