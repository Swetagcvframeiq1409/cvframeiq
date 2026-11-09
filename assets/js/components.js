/* resolveHref — works under three environments:
   1. file:// opened directly
   2. Live Server rooted at the PARENT folder (/frameiq-site/...)
   3. Production clean URLs at the domain root
   Source of truth: the src of the components.js <script> tag, never location.pathname. */
function getSiteBase() {
  try {
    const src = (document.currentScript && document.currentScript.src)
      || (function () {
        const scripts = document.querySelectorAll('script[src]');
        for (let i = scripts.length - 1; i >= 0; i--) {
          if (scripts[i].src.includes('components.js')) return scripts[i].src;
        }
        return '';
      }());
    if (!src) return '';
    // src ends with  .../assets/js/components.js  — drop that suffix
    return src.replace(/assets\/js\/components\.js.*$/, '');
  } catch (e) {
    return '';
  }
}

// Cached base, set once on first call
let _siteBase = null;
function siteBase() {
  if (_siteBase === null) _siteBase = getSiteBase();
  return _siteBase;
}

/* FILE_MAP: NAV_DATA relative paths -> actual file paths from site root */
const FILE_MAP = {
  'index.html': 'index.html',
  'pages/sectors.html': 'pages/sectors.html',
  'pages/ai-store.html': 'pages/ai-store.html',
  'pages/hardware/gear.html': 'pages/hardware/gear.html',
  'pages/playground.html': 'pages/playground.html',
  'pages/blog.html': 'pages/blog.html',
  'pages/about.html': 'pages/about.html',
  'pages/sectors/agriculture.html': 'pages/sectors/agriculture.html',
  'pages/sectors/aviation.html': 'pages/sectors/aviation.html',
  'pages/sectors/banking.html': 'pages/sectors/banking.html',
  'pages/sectors/healthcare.html': 'pages/sectors/healthcare.html',
  'pages/sectors/manufacturing.html': 'pages/sectors/manufacturing.html',
  'pages/sectors/retail.html': 'pages/sectors/retail.html',
  'pages/sectors/security-surveillance.html': 'pages/sectors/security-surveillance.html',
  'pages/sectors/smart-city.html': 'pages/sectors/smart-city.html',
  'pages/sectors/events-entertainment.html': 'pages/sectors/events-entertainment.html',
  'pages/pcb-guardian.html': 'pages/pcb-guardian.html',
  'pages/beejhealth.html': 'pages/beejhealth.html',
  'pages/autolabel.html': 'pages/autolabel.html',
  'pages/ppe-safety.html': 'pages/ppe-safety.html',
  'pages/hardware/edge-starter-kit.html': 'pages/hardware/edge-starter-kit.html',
  'pages/hardware/smart-factory-kit.html': 'pages/hardware/smart-factory-kit.html',
  'pages/hardware/request-quote.html': 'pages/hardware/request-quote.html',
  'pages/hardware/book-demo.html': 'pages/hardware/book-demo.html',
  'pages/roi-pcb-guardian.html': 'pages/roi-pcb-guardian.html',
  'pages/roi-ppe-safety.html': 'pages/roi-ppe-safety.html',
  'pages/research.html': 'pages/research.html',
  'pages/glossary.html': 'pages/glossary.html',
  'pages/compare.html': 'pages/compare.html',
  'pages/culture.html': 'pages/culture.html',
  'pages/team.html': 'pages/team.html',
  'pages/careers.html': 'pages/careers.html',
  'pages/how-we-work.html': 'pages/how-we-work.html',
  'pages/security.html': 'pages/security.html',
  'pages/contact.html': 'pages/contact.html',
  'pages/login.html': 'pages/login.html',
  'pages/privacy.html': 'pages/privacy.html',
  'pages/terms.html': 'pages/terms.html',
  'pages/cookies.html': 'pages/cookies.html',
  'pages/features.html': 'pages/features.html',
  'pages/partners.html': 'pages/partners.html',
  'pages/press-kit.html': 'pages/press-kit.html',
  'pages/responsible-ai.html': 'pages/responsible-ai.html',
  'pages/docs.html': 'pages/docs.html'
};

function resolveHref(navDataPath) {
  if (!navDataPath || typeof navDataPath !== 'string') return '#';
  const v = navDataPath.trim();
  // External, mailto, tel, hash — pass through unchanged
  if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(v)) return v;
  const base = siteBase();
  const file = FILE_MAP[v];
  if (!file) {
    console.warn('[FrameIQ] resolveHref: no file mapped for', v);
    return base + v;
  }
  return base + file;
}

function getRootPath() {
  return document.body.dataset.root || '';
}

function ensureRouteData() {
  if (!window.FRAMEIQ_ROUTES) {
    window.FRAMEIQ_ROUTES = {
      '/': 'index.html',
      '/about': 'pages/about.html',
      '/ai-store': 'pages/ai-store.html',
      '/beejhealth': 'pages/beejhealth.html',
      '/blog': 'pages/blog.html',
      '/careers': 'pages/careers.html',
      '/contact': 'pages/contact.html',
      '/compare': 'pages/compare.html',
      '/cookies': 'pages/cookies.html',
      '/culture': 'pages/culture.html',
      '/docs': 'pages/docs.html',
      '/features': 'pages/features.html',
      '/gear': 'pages/gear.html',
      '/gear-product': 'pages/gear-product.html',
      '/glossary': 'pages/glossary.html',
      '/hardware': 'pages/hardware/gear.html',
      '/hardware/edge-starter-kit': 'pages/hardware/edge-starter-kit.html',
      '/hardware/smart-factory-kit': 'pages/hardware/smart-factory-kit.html',
      '/how-we-work': 'pages/how-we-work.html',
      '/login': 'pages/login.html',
      '/partners': 'pages/partners.html',
      '/playground': 'pages/playground.html',
      '/press-kit': 'pages/press-kit.html',
      '/privacy': 'pages/privacy.html',
      '/research': 'pages/research.html',
      '/responsible-ai': 'pages/responsible-ai.html',
      '/sectors': 'pages/sectors.html',
      '/sectors/agriculture': 'pages/sectors/agriculture.html',
      '/sectors/aviation': 'pages/sectors/aviation.html',
      '/sectors/banking': 'pages/sectors/banking.html',
      '/sectors/events-entertainment': 'pages/sectors/events-entertainment.html',
      '/sectors/healthcare': 'pages/sectors/healthcare.html',
      '/sectors/manufacturing': 'pages/sectors/manufacturing.html',
      '/sectors/retail': 'pages/sectors/retail.html',
      '/sectors/security-surveillance': 'pages/sectors/security-surveillance.html',
      '/sectors/smart-city': 'pages/sectors/smart-city.html',
      '/security': 'pages/security.html',
      '/team': 'pages/team.html',
      '/terms': 'pages/terms.html',
      '/404': '404.html'
    };
  }

  if (!window.FrameIQRoutes) {
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
      if (normalized === '/' && window.FRAMEIQ_ROUTES['/']) {
        return window.FRAMEIQ_ROUTES['/'];
      }
      return window.FRAMEIQ_ROUTES[normalized] || window.FRAMEIQ_ROUTES['/404'];
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
      routes: window.FRAMEIQ_ROUTES,
      normalizePath,
      toFile,
      toHref
    };
  }
}

function cleanUrlPath(path) {
  const value = String(path || '').replace(/\\/g, '/').trim();
  if (!value || value === '#') return value;
  if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(value)) return value;
  const withoutHtml = value.replace(/\.html$/i, '');
  if (withoutHtml === 'index' || withoutHtml === '/index') return '/';
  if (withoutHtml.startsWith('../')) return cleanUrlPath(withoutHtml.replace(/^\.\.\//, ''));
  if (withoutHtml.startsWith('./')) return cleanUrlPath(withoutHtml.replace(/^\.\//, ''));
  return `/${withoutHtml.replace(/^\//, '').replace(/^pages\//, '')}`;
}

function getPageHref(path, root = getRootPath()) {
  if (!path || typeof path !== 'string') return path || '#';
  const value = path.trim();
  // External, mailto, tel, hash — pass through
  if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(value)) return value;
  // Already an absolute URL (from resolveHref)
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  // Relative .html path from NAV_DATA — use resolveHref
  return resolveHref(value);
}

function isCurrentPath(href) {
  if (!href || typeof href !== 'string') return false;
  const v = href.trim();
  if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(v)) return false;
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  // Normalise both sides to the .html filename portion
  const toFile = (p) => {
    const file = FILE_MAP[p];
    if (file) return file;
    // strip base prefix if present
    const base = siteBase();
    if (base && p.startsWith(base)) return p.slice(base.length);
    return p.replace(/^\//, '');
  };
  const targetFile = toFile(v);
  // currentPath ends with the target file path
  if (targetFile === 'index.html') {
    return currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.endsWith('/frameiq-site/');
  }
  return currentPath.endsWith('/' + targetFile) || currentPath.endsWith('/' + targetFile.replace(/\.html$/, ''));
}

function renderBrand(root = getRootPath()) {
  return `<a class="brand" href="${getPageHref('index.html', root)}" aria-label="FrameIQ home">Frame<span class="brand__iq">IQ</span></a>`;
}
const LOGO_HTML = renderBrand;
window.FrameIQLogo = LOGO_HTML;
const ANNOUNCEMENT = { enabled: false, text: '', href: '' };

function renderNavLink(item, root, className = 'nav__link') {
  const current = isCurrentPath(item.href);
  return `<a class="${className}" href="${getPageHref(item.href, root)}"${current ? ' aria-current="page"' : ''}>${item.label}</a>`;
}

function renderNavGroup(label, id, links, root, active = false) {
  /* Per-item icon map — Bootstrap Icons only, all verified present */
  const ITEM_ICONS = {
    'All sectors': 'bi-grid-3x3-gap',
    'Agriculture': 'bi-leaf',
    'Aviation': 'bi-airplane',
    'Banking': 'bi-bank',
    'Banking & Finance': 'bi-bank',
    'Healthcare': 'bi-hospital',
    'Healthcare & Medical': 'bi-heart-pulse',
    'Manufacturing': 'bi-tools',
    'Retail': 'bi-shop',
    'Security & Surveillance': 'bi-shield-check',
    'Smart City': 'bi-buildings',
    'Infrastructure': 'bi-building-gear',
    'Events & Entertainment': 'bi-stars',
    'AI Store': 'bi-bag',
    'PCB Guardian': 'bi-cpu',
    'BeejHealth': 'bi-leaf',
    'AutoLabel': 'bi-layers',
    'PPE Safety': 'bi-shield-check',
    'Gear (all hardware)': 'bi-box-seam',
    'Edge Starter Kit': 'bi-hdd-network',
    'Smart Factory Kit': 'bi-gear',
    'Request a Hardware Quote': 'bi-calculator',
    'Book a Hardware Demo': 'bi-play-circle',
    'Playground': 'bi-play-circle',
    'PCB Guardian ROI calculator': 'bi-cpu',
    'PPE Safety ROI calculator': 'bi-shield-check',
    'Blog': 'bi-book',
    'Docs': 'bi-file-text',
    'Research': 'bi-search',
    'Glossary': 'bi-file-earmark-text',
    'Compare approaches': 'bi-bar-chart',
    'About Us': 'bi-building',
    'Culture': 'bi-people',
    'Team': 'bi-person-badge',
    'Join Us': 'bi-briefcase',
    'How We Work': 'bi-diagram-3',
    'Security': 'bi-shield-lock',
    'Security & Compliance': 'bi-lock'
  };

  const canonicalHref = links[0]?.href || '';
  const useTwoCols = links.length >= 4;
  const isOdd = useTwoCols && (links.length % 2 !== 0);

  const itemClasses = [
    'nav__item',
    'nav__item--mega',
    ...(links.length < 4 ? ['nav__item--mega-compact'] : []),
    ...(label === 'Hardware' ? ['nav__item--hardware'] : []),
    ...(active ? ['has-current'] : [])
  ].filter(Boolean).join(' ');

  const linksMarkup = links.map((item, idx) => {
    const description = typeof item.description === 'string' ? item.description.trim() : '';
    const icon = ITEM_ICONS[item.label] || (console.warn('[FrameIQ] no icon for', item.label), 'bi-grid');
    const spanLast = isOdd && idx === links.length - 1 ? ' mega__item--span' : '';
    const isCurrent = isCurrentPath(item.href);
    return `<a class="mega__item${spanLast}" href="${getPageHref(item.href, root)}"${isCurrent ? ' aria-current="page"' : ''} style="--row-i:${idx}">
      <span class="mega__icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
      <span class="mega__copy">
        <span class="mega__title">${item.label}${isCurrent ? '<span class="mega__current-dot" aria-hidden="true"></span>' : ''}</span>${description ? `<span class="mega__desc">${description}</span>` : ''}
      </span>
      <i class="bi bi-arrow-right mega__arrow" aria-hidden="true"></i>
    </a>`;
  }).join('');

  if (label === 'Demos') {
    const bookHref = getPageHref('pages/contact.html', root);
    return `
    <div class="${itemClasses}">
      <button type="button" class="nav__button${active ? ' has-current' : ''}" data-active="${active ? 'true' : 'false'}"${isCurrentPath(canonicalHref) ? ' data-current="true" aria-current="page"' : ''} aria-expanded="false" aria-controls="${id}" aria-haspopup="true">${label}<i class="bi bi-chevron-down mega__chevron" aria-hidden="true"></i></button>
      <div class="mega nav-mega--demos" id="${id}" role="menu" aria-label="${label}">
        <div class="mega__body mega__demos-layout">
          <div class="mega__demos-list">${linksMarkup}</div>
          <div class="mega__demos-card">
            <div class="mega__demos-card__inner">
              <span class="mega__demos-card__eyebrow">Ready to explore?</span>
              <p class="mega__demos-card__label">Book a Demo</p>
              <p class="mega__demos-card__sub">Draft - pending content</p>
              <a class="mega__demos-card__cta" href="${bookHref}">Book a Demo <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  }

  const strip = `
    <div class="mega__strip">
      <a class="mega__strip-demo" href="${getPageHref('pages/contact.html', root)}">Book a Demo <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
    </div>`;

  return `
    <div class="${itemClasses}">
      <button type="button" class="nav__button${active ? ' has-current' : ''}" data-active="${active ? 'true' : 'false'}"${isCurrentPath(canonicalHref) ? ' data-current="true" aria-current="page"' : ''} aria-expanded="false" aria-controls="${id}" aria-haspopup="true">${label}<i class="bi bi-chevron-down mega__chevron" aria-hidden="true"></i></button>
      <div class="mega" id="${id}" role="menu" aria-label="${label}">
        <div class="mega__body mega__right mega__right--${useTwoCols ? '2col' : '1col'}">${linksMarkup}</div>
        ${strip}
      </div>
    </div>
  `;
}

function renderHeader(root = getRootPath()) {
  const headerHost = document.querySelector('#site-header');
  if (!headerHost) return;
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const pageHref = (path) => getPageHref(path, root);
  const isLoginPage = currentPage === 'login.html';
  const navGroups = window.NAV_DATA?.groups || {};
  const navMarkup = (window.NAV_DATA?.main || []).map((group) => {
    if (group.label === 'Home') return renderNavLink(group, root);
    const entries = navGroups[group.label] || [];
    const active = entries.some((entry) => isCurrentPath(entry.href));
    return renderNavGroup(group.label, `nav-${group.label.toLowerCase()}`, entries, root, active);
  }).join('');
  const mobileGroups = (window.NAV_DATA?.main || []).map((group) => {
    if (group.label === 'Home') return renderNavLink(group, root, 'mobile-menu__link');
    const entries = navGroups[group.label] || [];
    const expanded = entries.some((entry) => isCurrentPath(entry.href));
    const id = `mobile-${group.label.toLowerCase()}`;
    const ITEM_ICONS = {
      'All sectors': 'bi-grid-3x3-gap', 'Agriculture': 'bi-leaf', 'Aviation': 'bi-airplane',
      'Banking': 'bi-bank', 'Banking & Finance': 'bi-bank',
      'Healthcare': 'bi-hospital', 'Healthcare & Medical': 'bi-heart-pulse', 'Manufacturing': 'bi-tools',
      'Retail': 'bi-shop', 'Security & Surveillance': 'bi-shield-check',
      'Smart City': 'bi-buildings', 'Infrastructure': 'bi-building-gear',
      'Events & Entertainment': 'bi-stars', 'AI Store': 'bi-bag', 'PCB Guardian': 'bi-cpu',
      'BeejHealth': 'bi-leaf', 'AutoLabel': 'bi-layers', 'PPE Safety': 'bi-shield-check',
      'Gear (all hardware)': 'bi-box-seam', 'Edge Starter Kit': 'bi-hdd-network',
      'Smart Factory Kit': 'bi-gear', 'Request a Hardware Quote': 'bi-calculator',
      'Book a Hardware Demo': 'bi-play-circle', 'Playground': 'bi-play-circle',
      'PCB Guardian ROI calculator': 'bi-cpu', 'PPE Safety ROI calculator': 'bi-shield-check',
      'Blog': 'bi-book', 'Docs': 'bi-file-text', 'Research': 'bi-search',
      'Glossary': 'bi-file-earmark-text', 'Compare approaches': 'bi-bar-chart',
      'About Us': 'bi-building', 'Culture': 'bi-people', 'Team': 'bi-person-badge',
      'Join Us': 'bi-briefcase', 'How We Work': 'bi-diagram-3',
      'Security': 'bi-shield-lock', 'Security & Compliance': 'bi-lock'
    };
    return `
      <button class="mobile-menu__group${expanded ? ' is-active' : ''}" type="button" aria-expanded="${expanded}" aria-controls="${id}">${group.label}<i class="bi bi-chevron-down" aria-hidden="true"></i></button>
      <ul class="mobile-menu__panel" id="${id}"${expanded ? '' : ' hidden'}><div class="mobile-menu__panel-inner">${entries.map((entry) => {
        const description = typeof entry.description === 'string' ? entry.description.trim() : '';
        const icon = ITEM_ICONS[entry.label] || (console.warn('[FrameIQ] no mobile icon for', entry.label), 'bi-grid');
        return `<li><a class="mobile-menu__panel-link" href="${getPageHref(entry.href, root)}"${isCurrentPath(entry.href) ? ' aria-current="page"' : ''}><span class="drw__icon" aria-hidden="true"><i class="bi ${icon}"></i></span><span><strong>${entry.label}</strong>${description ? `<small>${description}</small>` : ''}</span><i class="bi bi-arrow-right" aria-hidden="true"></i></a></li>`;
      }).join('')}</div></ul>`;
  }).join('');
  const announcement = ANNOUNCEMENT.enabled && ANNOUNCEMENT.text
    ? `<div class="announcement-bar" data-announcement><span>${ANNOUNCEMENT.href ? `<a href="${pageHref(ANNOUNCEMENT.href)}">${ANNOUNCEMENT.text}</a>` : ANNOUNCEMENT.text}</span><button class="announcement-bar__close icon-button" type="button" aria-label="Dismiss announcement">×</button></div>`
    : '';
  if (ANNOUNCEMENT.enabled && ANNOUNCEMENT.text) {
    document.documentElement.style.setProperty('--announcement-height', '40px');
  }

  headerHost.innerHTML = `
    ${announcement}
    <div class="mega-overlay" data-mega-overlay aria-hidden="true"></div>
    <header class="site-header" aria-label="Main header">
      <div class="site-header__inner">
        <nav class="navbar" aria-label="Main navigation">
          ${LOGO_HTML(root)}
          <div class="nav" aria-label="Primary navigation">
            ${navMarkup}
          </div>
          <div class="header-actions">
            <a class="nav-login header-login${isLoginPage ? ' is-active' : ''}" href="${pageHref('pages/login.html')}"${isLoginPage ? ' aria-current="page"' : ''}>Login</a>
            <a class="btn btn--primary header-start" href="${pageHref('pages/contact.html')}"><span>Contact Us</span><i class="bi bi-arrow-right" aria-hidden="true"></i></a>
          </div>
        </nav>
      </div>
    </header>
    <div class="mobile-overlay" data-mobile-overlay></div>
    <aside class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" aria-hidden="true" inert>
      <nav class="mobile-menu__nav" aria-label="Mobile primary navigation">
        ${mobileGroups}
      </nav>
      <div class="mobile-menu__footer">
        <a class="mobile-menu__login" href="${pageHref('pages/login.html')}"${isLoginPage ? ' aria-current="page"' : ''}>Login</a>
        <a class="mobile-menu__contact" href="${pageHref('pages/contact.html')}">Contact Us</a>
      </div>
    </aside>
  `;
  window.initPhotos?.(headerHost);
  try {
    initMegaMenuEnhancements(headerHost, root);
  } catch (error) {
    console.warn('mega menu skipped', error);
  }

  if (ANNOUNCEMENT.enabled && ANNOUNCEMENT.text) {
    try {
      if (localStorage.getItem('frameiq-announcement-dismissed') === 'true') {
        headerHost.querySelector('[data-announcement]')?.setAttribute('hidden', '');
      } else {
        headerHost.querySelector('.announcement-bar__close')?.addEventListener('click', () => {
          try {
            localStorage.setItem('frameiq-announcement-dismissed', 'true');
          } catch (error) {
            console.warn('Announcement dismissal could not be saved.', error);
          }
          headerHost.querySelector('[data-announcement]')?.setAttribute('hidden', '');
        });
      }
    } catch (error) {
      console.warn('Announcement dismissal could not be read.', error);
    }
  }
}

function initMegaMenuEnhancements(headerHost, root) {
  headerHost.querySelectorAll('.mega-menu').forEach((menu) => {
    const featureCard = menu.querySelector('.mega-menu__feature');
    if (!featureCard) return;
    const updateFeature = (event) => {
      const link = event.target.closest('.mega-menu__link[data-feature-href]');
      if (!link || !menu.contains(link)) return;
      featureCard.href = getPageHref(link.dataset.featureHref, root);
      featureCard.querySelector('.mega-menu__feature-eyebrow').textContent = link.dataset.featureEyebrow;
      featureCard.querySelector('.mega-menu__feature-title').textContent = link.dataset.featureTitle;
      featureCard.querySelector('.mega-menu__feature-description').textContent = link.dataset.featureDescription;
      featureCard.querySelector('.mega-menu__feature-cta-label').textContent = link.dataset.featureCta;
    };
    menu.addEventListener('pointerover', updateFeature);
    menu.addEventListener('focusin', updateFeature);
    const firstLink = menu.querySelector('.mega-menu__link[data-feature-href]');
    if (firstLink) updateFeature({ target: firstLink });
  });
}

function renderFooter(root = getRootPath()) {
  const footerHost = document.querySelector('#site-footer');
  if (!footerHost) return;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const footerHref = (href) => href.startsWith('#') && currentPage !== 'index.html'
    ? `${getPageHref('index.html', root)}${href}`
    : getPageHref(href, root);
  const footerPageOverrides = {
    Sectors: 'pages/sectors.html',
    Features: 'pages/features.html',
    Careers: 'pages/careers.html',
    'Privacy Policy': 'pages/privacy.html',
    'Terms of Service': 'pages/terms.html',
    'Cookie Policy': 'pages/cookies.html'
  };
  const footerSections = [
    {
      title: 'Solutions',
      items: window.NAV_DATA?.footer?.solutions?.length
        ? window.NAV_DATA.footer.solutions
        : window.NAV_DATA?.groups?.Solutions || []
    },
    { title: 'Products', items: window.NAV_DATA?.footer?.products || [] },
    { title: 'Hardware', items: window.NAV_DATA?.footer?.hardware || [] },
    { title: 'Demos', items: window.NAV_DATA?.footer?.demos || [] },
    { title: 'Resources', items: window.NAV_DATA?.footer?.resources || [] },
    { title: 'Company', items: window.NAV_DATA?.footer?.company || [] },
    { title: 'Legal', items: window.NAV_DATA?.footer?.legal || [] }
  ];
  const socials = Array.isArray(window.FOOTER_SOCIALS) ? window.FOOTER_SOCIALS : [];
  const siteContact = window.SITE_CONTACT;
  const hardwarePage = document.querySelector('main[data-hardware-gear], main[data-hardware-edge], main[data-hardware-factory], main[data-hardware-quote], main[data-hardware-demo]');
  const hardwareCtaActions = hardwarePage
    ? document.querySelector('main[data-hardware-quote]')
      ? [
          { label: 'Book a Hardware Demo', href: 'pages/hardware/book-demo.html' },
          { label: 'Browse the Gear Store', href: 'pages/hardware/gear.html' }
        ]
      : document.querySelector('main[data-hardware-demo]')
        ? [
            { label: 'Request a Hardware Quote', href: 'pages/hardware/request-quote.html' },
            { label: 'Browse the Gear Store', href: 'pages/hardware/gear.html' }
          ]
        : [
            { label: 'Request a Hardware Quote', href: 'pages/hardware/request-quote.html' },
            { label: 'Book a Hardware Demo', href: 'pages/hardware/book-demo.html' }
          ]
    : null;
  const ctaActionsMarkup = hardwareCtaActions
    ? hardwareCtaActions.map((action, index) => `<a class="btn ${index === 0 ? 'btn--primary' : 'btn--secondary'}" href="${getPageHref(action.href, root)}">${action.label} <i class="bi bi-arrow-right" aria-hidden="true"></i></a>`).join('')
    : `<a class="btn btn--primary" href="${getPageHref('pages/contact.html', root)}">Start a Project <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
            <a class="btn btn--secondary" href="${getPageHref('pages/ai-store.html', root)}">Explore Solutions</a>`;

  /* CTA band — shown on every page except 404 */
  const isNotFound = !!document.querySelector('main.not-found');
  const isSolutionsPage = !!document.querySelector('main.sector-detail-page, main.sx-page');
  const enterpriseCtaId = isSolutionsPage ? ' id="ready-to-deploy"' : '';
  const ctaBand = isNotFound ? '' : `
    <section class="footer-cta" data-tone="dark"${enterpriseCtaId} aria-labelledby="footer-cta-title">
      <div class="footer-cta__inner">
        <div class="footer-cta__copy">
          <p class="footer-cta__eyebrow"><span aria-hidden="true"></span>Now Accepting Enterprise Clients</p>
          <h2 id="footer-cta-title">Ready to Deploy AI That <span class="footer-cta__accent">Actually Works?</span></h2>
          <p class="footer-cta__sub">Free 30-minute strategy call: use-case review, a live demo, and a timeline and cost estimate.</p>
          <div class="footer-cta__actions">
            ${ctaActionsMarkup}
          </div>
        </div>
        <address class="footer-cta__contact">
          <a href="${siteContact.phoneHref}"><span class="footer-cta__icon"><i class="bi bi-telephone" aria-hidden="true"></i></span><span class="footer-cta__value">${siteContact.phone}</span></a>
          <a href="mailto:${siteContact.email}"><span class="footer-cta__icon"><i class="bi bi-envelope" aria-hidden="true"></i></span><span class="footer-cta__value">${siteContact.email}</span></a>
          <span class="footer-cta__location"><span class="footer-cta__icon"><i class="bi bi-geo-alt" aria-hidden="true"></i></span><span class="footer-cta__value">${siteContact.location}</span></span>
        </address>
      </div>
    </section>`;

  /* social icon links */
  const socialMarkup = socials.map((item) => {
    if (!item || typeof item.href !== 'string' || !/^https?:\/\//i.test(item.href) || !window.ICONS[item.icon]) return '';
    const label = String(item.label || item.icon);
    const href = item.href.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const safeLabel = label.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${safeLabel}"><i class="${window.iconClass(item.icon)}" aria-hidden="true"></i></a>`;
  }).join('');

  /* link columns */
  const linksMarkup = footerSections.map((group) => {
    const id = `fc-${group.title.toLowerCase()}`;
    return `
      <div class="footer-col footer-col--links${group.items.length > 6 ? ' footer-col--multi' : ''}">
        <h3 class="footer-col__title">
          <button class="footer-col__toggle" type="button" aria-expanded="false" aria-controls="${id}">
            <span>${group.title}</span><i class="bi bi-plus" aria-hidden="true"></i>
          </button>
        </h3>
        <div class="footer-col__list-wrap">
          <ul class="footer-col__list" id="${id}">
            ${group.items.map((item) => {
              const active = {
                Features: 'features.html',
                Documentation: 'docs.html',
                Careers: 'careers.html',
                Blog: 'blog.html'
              }[item.label] === currentPage;
              return `<li><a href="${footerHref(footerPageOverrides[item.label] || item.href)}"${active ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
            }).join('')}
          </ul>
        </div>
      </div>
    `;
  }).join('');

  footerHost.innerHTML = `
    ${ctaBand}
    <footer class="site-footer" data-tone="dark">
      <div class="footer-grid">
        <div class="footer-col">
          ${LOGO_HTML(root)}
          <p>Leading the future of computer vision and AI solutions. We empower businesses with intelligent systems that see, understand, and act.</p>
          <form class="newsletter-form" novalidate>
            <p class="newsletter-title">Subscribe to our newsletter</p>
            <div class="form-field"><label class="sr-only" for="newsletter-email">Email</label><input id="newsletter-email" name="email" type="email" placeholder="Your email" aria-label="Email address" autocomplete="email" required /></div>
            <div class="newsletter-honeypot" aria-hidden="true"><label for="newsletter-website">Leave this field empty</label><input id="newsletter-website" name="_gotcha" type="text" tabindex="-1" autocomplete="off" /></div>
            <button class="btn btn--primary" type="submit">Subscribe</button>
            <p class="newsletter-status" role="status" aria-live="polite"></p>
          </form>
          <div class="social-list">${socialMarkup}</div>
        </div>
        <nav class="footer-links footer-links-grid" aria-label="Footer">
          ${linksMarkup}
        </nav>
      </div>
      <div class="footer-bottom">
        <span class="footer-bottom__copyright">&copy; 2026 FrameIQ. All rights reserved.</span>
        <nav class="footer-bottom__legal" aria-label="Legal links">
          ${(window.NAV_DATA?.footer?.legal || []).map((item) => `<a href="${footerHref(footerPageOverrides[item.label] || item.href)}">${item.label}</a>`).join('')}
        </nav>
      </div>
    </footer>
  `;

  const footer = footerHost.querySelector('.site-footer');
  const footerGroups = Array.from(footerHost.querySelectorAll('.footer-col--links'));
  const footerBreakpoint = window.matchMedia('(min-width: 992px)');
  if (footer && footerGroups.length) {
    const syncFooterAccordion = () => {
      footer.dataset.accordionReady = 'true';
      footerGroups.forEach((group) => {
        const toggle = group.querySelector('.footer-col__toggle');
        toggle.tabIndex = footerBreakpoint.matches ? -1 : 0;
        toggle.setAttribute('aria-expanded', 'false');
        group.dataset.open = 'false';
      });
    };
    footerGroups.forEach((group) => {
      const toggle = group.querySelector('.footer-col__toggle');
      toggle.addEventListener('click', () => {
        if (footerBreakpoint.matches) return;
        const isOpen = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!isOpen));
        group.dataset.open = String(!isOpen);
      });
    });
    syncFooterAccordion();
    if (typeof footerBreakpoint.addEventListener === 'function') {
      footerBreakpoint.addEventListener('change', syncFooterAccordion);
    } else {
      footerBreakpoint.addListener(syncFooterAccordion);
    }
  }

  const stickyEnquire = document.querySelector('.hw-sticky-enquire');
  if (footer && stickyEnquire && 'IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => stickyEnquire.classList.toggle('is-footer-visible', entry.isIntersecting));
    });
    footerObserver.observe(footer);
  }

  /* CTA reveal: fade+slide up 24px on viewport entry */
  const ctaEl = footerHost.querySelector('.footer-cta');
  if (ctaEl && 'IntersectionObserver' in window) {
    const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (prefersMotion) {
      const revealCta = () => {
        ctaEl.classList.add('is-visible');
        ctaEl.querySelector('.footer-cta__copy')?.classList.add('is-visible');
        ctaEl.querySelector('.footer-cta__contact')?.classList.add('is-visible');
      };
      if (ctaEl.getBoundingClientRect().top < window.innerHeight) {
        revealCta();
      } else {
        ctaEl.classList.add('js-ready');
        const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            revealCta();
            observer.unobserve(entry.target);
            window.clearTimeout(fallback);
          });
        }, { threshold: 0.01, rootMargin: '-5% 0px' });
        const fallback = window.setTimeout(() => {
          revealCta();
          observer.disconnect();
        }, 1500);
        observer.observe(ctaEl);
      }
    }
  }

  const newsletterForm = footerHost.querySelector('.newsletter-form');
  newsletterForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = newsletterForm.querySelector('input');
    const honeypot = newsletterForm.querySelector('[name="_gotcha"]');
    const status = newsletterForm.querySelector('.newsletter-status');
    const email = input.value.trim();
    status.replaceChildren();
    if (honeypot.value.trim()) {
      status.textContent = 'The request could not be submitted. Please try again.';
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      input.setAttribute('aria-invalid', 'true');
      status.textContent = 'Enter a valid email address.';
      input.focus();
      return;
    }
    input.setAttribute('aria-invalid', 'false');
    const message = `Please contact me about FrameIQ updates.\nEmail: ${email}`;
    if (!window.FORM_ENDPOINT) {
      const link = document.createElement('a');
      link.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent('FrameIQ updates')}&body=${encodeURIComponent(message)}`;
      link.textContent = 'Continue by email';
      const copyStatus = document.createElement('span');
      copyStatus.className = 'newsletter-copy-status';
      copyStatus.setAttribute('role', 'status');
      copyStatus.setAttribute('aria-live', 'polite');
      status.append('Newsletter form is not connected. Your email has not been submitted. ', link, copyStatus);
      window.FrameIQForms?.appendCopyButton(status, () => message, copyStatus);
      return;
    }

    const submit = newsletterForm.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    try {
      const response = await fetch(window.FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(newsletterForm),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
      status.textContent = 'Your request was submitted.';
      newsletterForm.reset();
    } catch (error) {
      console.error('Newsletter request could not be submitted.', error);
      const link = document.createElement('a');
      link.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent('FrameIQ updates')}&body=${encodeURIComponent(message)}`;
      link.textContent = 'Continue by email';
      const copyStatus = document.createElement('span');
      copyStatus.className = 'newsletter-copy-status';
      copyStatus.setAttribute('role', 'status');
      copyStatus.setAttribute('aria-live', 'polite');
      status.append('We could not submit your request. Continue by email instead. ', link, copyStatus);
      window.FrameIQForms?.appendCopyButton(status, () => message, copyStatus);
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
    }
  });
}

function initChatbot() {
  if (document.querySelector('.chatbot-button')) return;
  const root = getRootPath();
  const host = document.createElement('div');
  host.className = 'chatbot-button';
  const products = window.NAV_DATA?.groups?.Products || [];
  const recommendations = products.map((item) => (
    `<a class="chatbot-recommendation" href="${getPageHref(item.href, root)}">${item.label}</a>`
  )).join('');
  host.innerHTML = `
    <div class="chatbot-panel" aria-live="polite">
      <div class="chatbot-panel__header"><strong>Explore FrameIQ</strong><button class="icon-button" type="button" aria-label="Close panel"><i class="${window.iconClass('close')}" aria-hidden="true"></i></button></div>
      <div class="chatbot-panel__body">
        <p>Choose a product to explore, or contact the team to discuss a demo.</p>
        <nav class="chatbot-recommendations" aria-label="Product recommendations">${recommendations}</nav>
        <a href="${getPageHref('pages/contact.html', root)}" class="btn btn--primary chatbot-demo-link">Book a demo</a>
      </div>
    </div>
    <button class="chatbot-button__trigger" type="button" aria-label="Open chatbot" aria-expanded="false">
      <i class="${window.iconClass('chat')}" aria-hidden="true"></i>
    </button>`;
  document.body.appendChild(host);
  const trigger = host.querySelector('.chatbot-button__trigger');
  const panel = host.querySelector('.chatbot-panel');
  const close = host.querySelector('.chatbot-panel .icon-button');
  trigger.addEventListener('click', () => {
    panel.classList.toggle('is-open');
    trigger.setAttribute('aria-expanded', String(panel.classList.contains('is-open')));
  });
  close.addEventListener('click', () => {
    panel.classList.remove('is-open');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.focus();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  ensureRouteData();
  renderHeader();
  renderFooter();
  initChatbot();
});
