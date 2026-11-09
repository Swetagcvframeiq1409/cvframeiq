(function () {
  'use strict';

  window.FIQ = window.FIQ || {};
  const IMAGE_DIR = 'assets/img/sectors';
  const IMAGE_MANIFEST = window.FIQ_IMAGES || {};

  function getBasePath() {
    const bodyRoot = document.body && document.body.dataset && document.body.dataset.root;
    if (bodyRoot) return bodyRoot.replace(/\/$/, '');
    const path = window.location.pathname || '/';
    const sitePrefix = '/frameiq-site';
    if (path.indexOf(sitePrefix) === 0) return sitePrefix;
    return '';
  }

  function assetPath(name) {
    const base = getBasePath();
    return `${base}/${IMAGE_DIR}/${name}`.replace(/\/+/g, '/');
  }

  function buildFallback(name, alt, icon) {
    const label = alt || name || 'Sector media';
    const fallbackIcon = icon || 'bi-camera-video';
    return '<div class="fiq-media fiq-media--fallback" role="img" aria-label="' + label.replace(/"/g, '&quot;') + '"><i class="bi ' + fallbackIcon + '" aria-hidden="true"></i></div>';
  }

  function buildPicture(name, meta, opts) {
    const source = assetPath(name);
    const altText = opts && opts.decorative ? '' : (opts && opts.alt ? opts.alt : (meta && meta.alt ? meta.alt : ''));
    const sizes = opts && opts.sizes ? opts.sizes : '(max-width: 480px) 100vw, (max-width: 800px) 80vw, (max-width: 1200px) 60vw, 50vw';
    const loading = opts && opts.priority ? 'eager' : 'lazy';
    const priority = opts && opts.priority ? ' fetchpriority="high"' : '';
    const imgStyle = meta && meta.pos ? ' style="object-position:' + meta.pos + ';"' : '';
    const dimensions = ' width="' + meta.w + '" height="' + meta.h + '"';
    const image = '<img src="' + source + (meta.variants ? '-800.webp' : '.webp') + '"' + dimensions +
      ' alt="' + altText.replace(/"/g, '&quot;') + '" loading="' + loading + '" decoding="async"' + priority + imgStyle;
    if (!meta.variants) return image + '>';

    return '<picture>' +
      '<source type="image/webp" srcset="' + source + '-480.webp 480w, ' + source + '-800.webp 800w, ' + source + '-1200.webp 1200w, ' + source + '.webp ' + meta.w + 'w" sizes="' + sizes + '">' +
      image + '>' +
      '</picture>';
  }

  function img(name, opts) {
    const safeName = String(name || '').trim();
    const options = opts || {};
    if (!safeName || !IMAGE_MANIFEST[safeName]) {
      return buildFallback(safeName, options.alt || 'Sector visual', options.icon || 'bi-camera-video');
    }
    const meta = IMAGE_MANIFEST[safeName];
    if (options.decorative) {
      return buildPicture(safeName, meta, Object.assign({}, options, { alt: '', decorative: true }));
    }
    return buildPicture(safeName, meta, options);
  }

  window.FIQ.img = img;
})();
