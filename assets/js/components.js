function getRootPath() {
  return document.body.dataset.root || '';
}

function renderBrand(root = getRootPath()) {
  return `<a class="brand" href="${getPageHref('index.html', root)}" aria-label="FrameIQ home"><span class="brand__mark" aria-hidden="true"></span><span class="brand__frame">Frame</span><span class="brand__iq">IQ</span></a>`;
}
const LOGO_HTML = renderBrand;
window.FrameIQLogo = LOGO_HTML;
const ANNOUNCEMENT = { enabled: false, text: '', href: '' };

function getPageHref(path, root = getRootPath()) {
  return /^(#|\/|[a-z][a-z\d+.-]*:)/i.test(path) ? path : `${root || './'}${path}`;
}

function isCurrentPath(href) {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  return currentPath.endsWith(`/${href}`);
}

function renderNavLink(item, root, className = 'nav__link') {
  const current = isCurrentPath(item.href);
  return `<a class="${className}" href="${getPageHref(item.href, root)}"${current ? ' aria-current="page"' : ''}>${item.label}</a>`;
}

function renderNavGroup(label, id, links, root, active = false) {
  const itemClasses = [
    'nav__item',
    'nav__item--mega',
    ...(label === 'Solutions' ? ['nav__item--mega--solutions'] : []),
    ...(['Resources', 'Company'].includes(label) ? ['nav__item--mega--right'] : []),
    ...(active ? ['has-current'] : [])
  ].join(' ');
  const linksMarkup = links.map((item) => {
    return `<li>${renderNavLink(item, root, 'nav-group-menu__link')}</li>`;
  }).join('');
  return `
    <div class="${itemClasses}">
      <button class="nav__button${active ? ' has-current' : ''}" type="button" aria-expanded="false" aria-controls="${id}">
        ${label}<i class="${window.iconClass('chevronDown')} chevron" aria-hidden="true"></i>
      </button>
      <ul class="mega-menu nav-group-menu" id="${id}" aria-label="${label}">${linksMarkup}</ul>
    </div>
  `;
}

function renderHeader(root = getRootPath()) {
  const headerHost = document.querySelector('#site-header');
  if (!headerHost) return;
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const pageHref = (path) => getPageHref(path, root);
  const homeHref = pageHref('index.html');
  const isLoginPage = currentPage === 'login.html';
  const navGroups = window.NAV_DATA?.groups || {};
  const navMarkup = (window.NAV_DATA?.main || []).map((group) => {
    if (group.label === 'Hardware') return renderNavLink(group, root);
    const entries = navGroups[group.label] || [];
    const active = entries.some((entry) => isCurrentPath(entry.href));
    return renderNavGroup(group.label, `nav-${group.label.toLowerCase()}`, entries, root, active);
  }).join('');
  const mobileGroups = (window.NAV_DATA?.main || []).map((group) => {
    if (group.label === 'Hardware') return renderNavLink(group, root, 'mobile-menu__link');
    const entries = navGroups[group.label] || [];
    const expanded = entries.some((entry) => isCurrentPath(entry.href));
    const id = `mobile-${group.label.toLowerCase()}`;
    return `
      <button class="mobile-menu__group${expanded ? ' is-active' : ''}" type="button" aria-expanded="${expanded}" aria-controls="${id}">${group.label} <i class="${window.iconClass('chevronDown')}" aria-hidden="true"></i></button>
      <ul class="mobile-menu__panel" id="${id}"${expanded ? '' : ' hidden'}>${entries.map((entry) => {
        return `<li>${renderNavLink(entry, root, 'mobile-menu__panel-link')}</li>`;
      }).join('')}</ul>`;
  }).join('');
  const announcement = ANNOUNCEMENT.enabled && ANNOUNCEMENT.text
    ? `<div class="announcement-bar" data-announcement><span>${ANNOUNCEMENT.href ? `<a href="${pageHref(ANNOUNCEMENT.href)}">${ANNOUNCEMENT.text}</a>` : ANNOUNCEMENT.text}</span><button class="announcement-bar__close icon-button" type="button" aria-label="Dismiss announcement">×</button></div>`
    : '';
  if (ANNOUNCEMENT.enabled && ANNOUNCEMENT.text) {
    document.documentElement.style.setProperty('--announcement-height', '40px');
  }

  headerHost.innerHTML = `
    ${announcement}
    <header class="site-header" aria-label="Main header">
      <div class="site-header__inner">
        <nav class="navbar" aria-label="Main navigation">
          ${LOGO_HTML(root)}
          <div class="nav" aria-label="Primary navigation">
            ${navMarkup}
          </div>
          <div class="header-actions">
            <button class="icon-button header-theme-toggle" type="button" aria-label="Toggle theme" data-theme-toggle>
              <i class="${window.iconClass('moon')}" aria-hidden="true"></i>
            </button>
            <a class="nav-login header-login${isLoginPage ? ' is-active' : ''}" href="${pageHref('pages/login.html')}"${isLoginPage ? ' aria-current="page"' : ''}>Login</a>
            <a class="btn btn--primary header-start" href="${pageHref('pages/contact.html')}">Book a Demo</a>
          </div>
        </nav>
      </div>
    </header>
    <div class="mobile-overlay" data-mobile-overlay></div>
    <aside class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" aria-hidden="true" inert>
      <div class="mobile-menu__header">
        ${LOGO_HTML(root)}
        <button class="icon-button mobile-menu__close" type="button" aria-label="Close menu" data-mobile-close><i class="${window.iconClass('close')}" aria-hidden="true"></i></button>
      </div>
      <a class="btn btn--primary mobile-menu__cta" href="${pageHref('pages/contact.html')}">Book a Demo</a>
      <nav class="mobile-menu__nav" aria-label="Mobile primary navigation">
        <a href="${homeHref}"${currentPage === 'index.html' ? ' aria-current="page"' : ''}>Home</a>
        ${mobileGroups}
      </nav>
      <div class="mobile-menu__footer">
        <a class="mobile-menu__login" href="${pageHref('pages/login.html')}"${isLoginPage ? ' aria-current="page"' : ''}>Login</a>
      </div>
    </aside>
  `;
  window.initPhotos?.(headerHost);
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

function renderBreadcrumb(items) {
  const host = document.querySelector('#breadcrumb');
  if (!host || !Array.isArray(items) || !items.length) return;
  const list = document.createElement('ol');
  list.className = 'breadcrumb__list';
  items.forEach((item, index) => {
    const element = document.createElement('li');
    const isCurrent = index === items.length - 1;
    if (isCurrent) {
      const current = document.createElement('span');
      current.setAttribute('aria-current', 'page');
      current.textContent = item.label;
      element.appendChild(current);
    } else {
      const link = document.createElement('a');
      link.href = getPageHref(item.href || '#');
      link.textContent = item.label;
      element.appendChild(link);
    }
    list.appendChild(element);
  });
  host.replaceChildren(list);
}
window.renderBreadcrumb = renderBreadcrumb;

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
    Documentation: 'pages/docs.html',
    Careers: 'pages/careers.html',
    'Privacy Policy': 'pages/privacy.html',
    'Terms of Service': 'pages/terms.html',
    Security: 'pages/security.html',
    'Cookie Policy': 'pages/cookies.html'
  };
  const footerSections = [
    { title: 'Solutions', items: window.NAV_DATA?.footer?.solutions || [] },
    { title: 'Products', items: window.NAV_DATA?.footer?.products || [] },
    { title: 'Hardware', items: window.NAV_DATA?.footer?.hardware || [] },
    { title: 'Demos', items: window.NAV_DATA?.footer?.demos || [] },
    { title: 'Resources', items: window.NAV_DATA?.footer?.resources || [] },
    { title: 'Company', items: window.NAV_DATA?.footer?.company || [] },
    { title: 'Legal', items: window.NAV_DATA?.footer?.legal || [] }
  ];
  const socials = Array.isArray(window.FOOTER_SOCIALS) ? window.FOOTER_SOCIALS : [];
  const socialMarkup = socials.map((item) => {
    if (!item || typeof item.href !== 'string' || !/^https?:\/\//i.test(item.href) || !window.ICONS[item.icon]) return '';
    const label = String(item.label || item.icon);
    const href = item.href.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const safeLabel = label.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${safeLabel}"><i class="${window.iconClass(item.icon)}" aria-hidden="true"></i></a>`;
  }).join('');
  const linksMarkup = footerSections.map((group) => `
    <div class="footer-col"><h2>${group.title}</h2><ul class="footer-links">
      ${group.items.map((item) => {
        const active = {
          Features: 'features.html',
          Documentation: 'docs.html',
          Careers: 'careers.html',
          Blog: 'blog.html'
        }[item.label] === currentPage;
        return `<li><a href="${footerHref(footerPageOverrides[item.label] || item.href)}"${active ? ' aria-current="page"' : ''}>${item.label}</a></li>`;
      }).join('')}
    </ul></div>
  `).join('');
  footerHost.innerHTML = `
    <footer class="site-footer">
      <div class="footer-grid">
        <div class="footer-col">
          ${LOGO_HTML(root)}
          <p>Computer Vision and Agentic AI for Indian industry.</p>
          <form class="newsletter-form" novalidate>
            <div class="form-field"><label class="sr-only" for="newsletter-email">Email</label><input id="newsletter-email" name="email" type="email" placeholder="Your email" aria-label="Email address" autocomplete="email" required /></div>
            <div class="newsletter-honeypot" aria-hidden="true"><label for="newsletter-website">Leave this field empty</label><input id="newsletter-website" name="_gotcha" type="text" tabindex="-1" autocomplete="off" /></div>
            <button class="btn btn--primary" type="submit">Subscribe</button>
            <p class="newsletter-status" role="status" aria-live="polite"></p>
          </form>
          <div class="social-list">${socialMarkup}</div>
        </div>
        ${linksMarkup}
      </div>
      <div class="footer-bottom">
        <span class="footer-bottom__copyright">© 2026 FrameIQ. All rights reserved.</span>
      </div>
    </footer>
  `;
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

function initContextualCta() {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  if (currentPath.endsWith('/contact.html')) return;
  const footer = document.querySelector('#site-footer .site-footer');
  if (!footer) return;

  const pageHref = (path) => getPageHref(path);
  const query = new URLSearchParams(window.location.search);
  const sector = (window.SECTORS || []).find((item) => currentPath.endsWith(`/sectors/${item.slug}.html`));
  const product = (window.NAV_DATA?.groups?.Products || []).find((item) => currentPath.endsWith(`/${item.href}`));
  const hardwarePage = currentPath.endsWith('/gear.html')
    || currentPath.endsWith('/gear-product.html')
    || currentPath.endsWith('/edge-starter-kit.html')
    || currentPath.endsWith('/smart-factory-kit.html');
  const title = hardwarePage ? 'hardware' : sector?.name || product?.label || 'your use case';
  const contactHref = query.get('interest') === 'hardware' && query.get('product')
    ? pageHref(`pages/contact.html?interest=hardware&product=${encodeURIComponent(query.get('product'))}`)
    : sector
    ? pageHref(`pages/contact.html?sector=${encodeURIComponent(sector.slug)}`)
    : pageHref(hardwarePage ? 'pages/contact.html?interest=hardware' : 'pages/contact.html');
  const bar = document.createElement('aside');
  bar.className = 'contextual-cta';
  bar.setAttribute('aria-label', 'Contact FrameIQ');
  bar.innerHTML = `<span>${hardwarePage ? 'Book a Hardware Demo' : `Discuss ${title}`}</span><a class="btn btn--primary" href="${contactHref}">${hardwarePage ? 'Book a Hardware Demo' : 'Book a Demo'}</a>`;
  document.body.appendChild(bar);

  if ('IntersectionObserver' in window) {
    const footerObserver = new IntersectionObserver(([entry]) => {
      bar.classList.toggle('is-near-footer', entry.isIntersecting);
    }, { threshold: 0.01 });
    footerObserver.observe(footer);

    const visibleForms = new Set();
    const syncFormVisibility = () => {
      bar.classList.toggle('is-near-form', window.matchMedia('(max-width: 640px)').matches && visibleForms.size > 0);
    };
    const formObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleForms.add(entry.target);
        else visibleForms.delete(entry.target);
      });
      syncFormVisibility();
    });
    document.querySelectorAll('form:not(.newsletter-form)').forEach((form) => formObserver.observe(form));
    window.addEventListener('resize', syncFormVisibility);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  const breadcrumb = document.querySelector('#breadcrumb[data-breadcrumb]');
  if (breadcrumb) {
    const items = JSON.parse(breadcrumb.dataset.breadcrumb);
    renderBreadcrumb(items);
  }
  initChatbot();
  initContextualCta();
});
