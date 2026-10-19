(() => {
  'use strict';

  function initializeSeo() {
    const rootUrl = String(window.SITE_URL || '').replace(/\/+$/, '');
    const pages = Array.isArray(window.SITE_PAGES) ? window.SITE_PAGES : [];
    if (!rootUrl || !pages.length) {
      console.error('SEO metadata could not initialize because SITE_URL or SITE_PAGES is unavailable.');
      return;
    }

    const path = window.location.pathname.replace(/\\/g, '/');
    const route = path.endsWith('/pages/404.html')
      ? 'pages/404.html'
      : path.endsWith('/pages/style-guide.html')
        ? 'pages/style-guide.html'
      : pages.find((item) => path.endsWith(`/${item}`)) || 'index.html';
    const currentUrl = new URL(route === 'index.html' ? `${rootUrl}/` : `${rootUrl}/${route}`);
    const params = new URLSearchParams(window.location.search);
    if (route === 'pages/blog-article.html' && params.has('slug')) {
      currentUrl.searchParams.set('slug', params.get('slug'));
    }

    const title = document.title.trim();
    const descriptionTag = document.querySelector('meta[name="description"]');
    const description = descriptionTag?.content.trim() || `${title.replace(/\s*[|—-]\s*FrameIQ.*$/i, '')} information from FrameIQ AI.`;
    const ensureMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
        document.head.append(element);
      }
      element.content = content;
      return element;
    };
    const ensureLink = (rel, href) => {
      let link = document.head.querySelector(`link[rel="${rel}"]`);
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.append(link);
      }
      link.href = href;
    };

    if (descriptionTag) descriptionTag.content = description;
    else ensureMeta('meta[name="description"]', { name: 'description' }, description);
    ensureLink('canonical', currentUrl.href);
    ensureMeta('meta[property="og:type"]', { property: 'og:type' }, route.includes('blog-article') ? 'article' : 'website');
    ensureMeta('meta[property="og:title"]', { property: 'og:title' }, title);
    ensureMeta('meta[property="og:description"]', { property: 'og:description' }, description);
    ensureMeta('meta[property="og:url"]', { property: 'og:url' }, currentUrl.href);
    ensureMeta('meta[property="og:image"]', { property: 'og:image' }, `${rootUrl}/assets/img/og-image.jpg`);
    ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image');
    ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, title);
    ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
    ensureMeta('meta[name="twitter:image"]', { name: 'twitter:image' }, `${rootUrl}/assets/img/og-image.jpg`);
    ensureMeta('meta[name="theme-color"]', { name: 'theme-color' }, '#08090d');

    const organization = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'FrameIQ AI',
      url: `${rootUrl}/`,
      telephone: window.SITE_CONTACT?.phone,
      email: window.SITE_CONTACT?.email,
      openingHours: 'Mo-Fr 09:00-18:00',
      identifier: window.SITE_CONTACT?.registration ? {
        '@type': 'PropertyValue',
        propertyID: window.SITE_CONTACT.registration.label,
        value: window.SITE_CONTACT.registration.value
      } : undefined,
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Panvel',
        addressRegion: 'Maharashtra',
        addressCountry: 'IN'
      }
    };
    const labels = new Map([
      ['index.html', 'Home'],
      ...pages.filter((item) => item !== 'index.html').map((item) => [item, item.split('/').pop().replace(/\.html$/, '').replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())])
    ]);
    const crumbs = [{ name: 'Home', url: `${rootUrl}/` }];
    if (route.startsWith('pages/sectors/')) {
      crumbs.push({ name: 'Sectors', url: `${rootUrl}/pages/sectors.html` });
    }
    if (route !== 'index.html') {
      const label = route === 'pages/blog-article.html'
        ? title.replace(/\s*\|\s*FrameIQ.*$/i, '')
        : labels.get(route) || title.replace(/\s*\|\s*FrameIQ.*$/i, '');
      crumbs.push({ name: label, url: currentUrl.href });
    }
    document.querySelector('#breadcrumb-jsonld')?.remove();
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
    const pageSchema = document.querySelector('#organization-jsonld');
    if (pageSchema) {
      const schema = JSON.parse(pageSchema.textContent);
      if (schema['@type'] === 'Organization') {
        pageSchema.remove();
      } else if (schema['@type'] === 'ContactPage') {
        schema.url = currentUrl.href;
        pageSchema.textContent = JSON.stringify(schema);
      }
    }
    const organizationScript = document.querySelector('#organization-site-jsonld') || document.createElement('script');
    organizationScript.id = 'organization-site-jsonld';
    organizationScript.type = 'application/ld+json';
    organizationScript.textContent = JSON.stringify(organization);
    document.head.append(organizationScript);
    const breadcrumbScript = document.querySelector('#site-breadcrumb-jsonld') || document.createElement('script');
    breadcrumbScript.id = 'site-breadcrumb-jsonld';
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify(breadcrumb);
    document.head.append(breadcrumbScript);
    if (route === 'pages/404.html' || route === 'pages/style-guide.html') {
      ensureMeta('meta[name="robots"]', { name: 'robots' }, 'noindex,nofollow');
    }
  }

  if (document.readyState === 'complete') {
    initializeSeo();
  } else {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(initializeSeo, 0), { once: true });
  }
})();
