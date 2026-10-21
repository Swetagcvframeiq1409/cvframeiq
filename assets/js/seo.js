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
    const route = path.endsWith('/404.html')
      ? '404.html'
      : pages.find((item) => path.endsWith(`/${item}`)) || 'index.html';
    const currentUrl = new URL(route === 'index.html' ? `${rootUrl}/` : `${rootUrl}/${route}`);
    const params = new URLSearchParams(window.location.search);
    if (route === 'pages/blog-article.html' && params.has('slug')) {
      currentUrl.searchParams.set('slug', params.get('slug'));
    }
    if (route === 'pages/gear-product.html' && params.has('product')) {
      currentUrl.searchParams.set('product', params.get('product'));
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
    const setJsonLd = (id, schema) => {
      let script = document.getElementById(id);
      if (!schema) {
        script?.remove();
        return;
      }
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.append(script);
      }
      script.textContent = JSON.stringify(schema);
    };
    setJsonLd('organization-site-jsonld', route === 'index.html' ? organization : null);

    const blogPost = route === 'pages/blog-article.html'
      ? window.FRAMEIQ_BLOG_POSTS?.find((post) => post.slug === params.get('slug'))
      : null;
    const imageForSlot = (slot) => {
      const image = window.SITE_IMAGES?.[slot];
      const localSlot = image?.localSlot || slot;
      const localPhotos = window.LOCAL_PHOTOS;
      return image?.local && Array.isArray(localPhotos) && localPhotos.includes(localSlot)
        ? `${rootUrl}/${image.local.replace(/^\/+/, '')}`
        : undefined;
    };
    setJsonLd('article-jsonld', blogPost ? {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: blogPost.title,
      description: blogPost.summary || description,
      image: imageForSlot(blogPost.imageSlot),
      mainEntityOfPage: currentUrl.href
    } : null);

    const product = route === 'pages/gear-product.html'
      ? window.HARDWARE?.find((item) => item.id === params.get('product'))
      : null;
    setJsonLd('product-jsonld', product ? {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.descriptionPlaceholder || /^\s*\[Placeholder:/i.test(product.description || '')
        ? undefined
        : product.description,
      image: imageForSlot(product.imageSlot)
    } : null);

    if (route === '404.html') {
      ensureMeta('meta[name="robots"]', { name: 'robots' }, 'noindex,nofollow');
    }
  }

  if (document.readyState === 'complete') {
    initializeSeo();
  } else {
    document.addEventListener('DOMContentLoaded', () => window.setTimeout(initializeSeo, 0), { once: true });
  }
})();
