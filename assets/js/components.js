function getRootPath() {
  return document.body.dataset.root || '';
}

function renderBrand(root = getRootPath()) {
  return `<a class="brand" href="${getPageHref('index.html', root)}" aria-label="FrameIQ home">Frame<span class="brand__iq">IQ</span></a>`;
}
const LOGO_HTML = renderBrand;
window.FrameIQLogo = LOGO_HTML;
const ANNOUNCEMENT = { enabled: false, text: '', href: '' };

function getPageHref(path, root = getRootPath()) {
  return /^(#|\/|[a-z][a-z\d+.-]*:)/i.test(path) ? path : `${root || './'}${path}`;
}

function isCurrentPath(href) {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  if (href === 'index.html') return currentPath === '/' || currentPath.endsWith('/index.html');
  return currentPath.endsWith(`/${href}`);
}

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
    'Healthcare': 'bi-hospital',
    'Manufacturing': 'bi-tools',
    'Retail': 'bi-shop',
    'Security & Surveillance': 'bi-shield-check',
    'Smart City': 'bi-buildings',
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
    'Playground': 'bi-play-btn',
    'PCB Guardian ROI calculator': 'bi-calculator',
    'PPE Safety ROI calculator': 'bi-calculator',
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
    const icon = ITEM_ICONS[item.label] || 'bi-arrow-right';
    const spanLast = isOdd && idx === links.length - 1 ? ' mega__item--span' : '';
    return `<a class="mega__item${spanLast}" href="${getPageHref(item.href, root)}"${isCurrentPath(item.href) ? ' aria-current="page"' : ''}>
      <span class="mega__icon" aria-hidden="true"><i class="bi ${icon}"></i></span>
      <span class="mega__copy">
        <span class="mega__title">${item.label}</span>${description ? `<span class="mega__desc">${description}</span>` : ''}
      </span>
      <i class="bi bi-arrow-right mega__arrow" aria-hidden="true"></i>
    </a>`;
  }).join('');

  const strip = `
    <div class="mega__strip">
      <a class="mega__strip-demo" href="${getPageHref('pages/contact.html', root)}">Book a Demo <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
    </div>`;

  return `
    <div class="${itemClasses}">
      <a class="nav__button${active ? ' has-current' : ''}" href="${getPageHref(canonicalHref, root)}"${isCurrentPath(canonicalHref) ? ' aria-current="page"' : ''} aria-expanded="false" aria-controls="${id}" aria-haspopup="true">${label}<i class="bi bi-chevron-down mega__chevron" aria-hidden="true"></i></a>
      <div class="mega" id="${id}" role="region" aria-label="${label}">
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
      'Banking': 'bi-bank', 'Healthcare': 'bi-hospital', 'Manufacturing': 'bi-tools',
      'Retail': 'bi-shop', 'Security & Surveillance': 'bi-shield-check', 'Smart City': 'bi-buildings',
      'Events & Entertainment': 'bi-stars', 'AI Store': 'bi-bag', 'PCB Guardian': 'bi-cpu',
      'BeejHealth': 'bi-leaf', 'AutoLabel': 'bi-layers', 'PPE Safety': 'bi-shield-check',
      'Gear (all hardware)': 'bi-box-seam', 'Edge Starter Kit': 'bi-hdd-network',
      'Smart Factory Kit': 'bi-gear', 'Request a Hardware Quote': 'bi-calculator',
      'Book a Hardware Demo': 'bi-play-circle', 'Playground': 'bi-play-btn',
      'PCB Guardian ROI calculator': 'bi-calculator', 'PPE Safety ROI calculator': 'bi-calculator',
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
        const icon = ITEM_ICONS[entry.label] || 'bi-arrow-right';
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
    { title: 'Solutions', items: window.NAV_DATA?.footer?.solutions || [] },
    { title: 'Products', items: window.NAV_DATA?.footer?.products || [] },
    { title: 'Hardware', items: window.NAV_DATA?.footer?.hardware || [] },
    { title: 'Demos', items: window.NAV_DATA?.footer?.demos || [] },
    { title: 'Resources', items: window.NAV_DATA?.footer?.resources || [] },
    { title: 'Company', items: window.NAV_DATA?.footer?.company || [] },
    { title: 'Legal', items: window.NAV_DATA?.footer?.legal || [] }
  ];
  const socials = Array.isArray(window.FOOTER_SOCIALS) ? window.FOOTER_SOCIALS : [];
  const siteContact = window.SITE_CONTACT;
  const closingCta = currentPage === 'index.html' || document.querySelector('main.not-found') ? '' : `
    <section class="footer-cta" data-tone="dark" aria-labelledby="footer-cta-title">
      <div class="footer-cta__inner">
        <div>
          <p class="eyebrow">Have a project in mind?</p>
          <h2 id="footer-cta-title">Discuss Your AI Use Case</h2>
          <p>Share what you are building and the challenge you want to address. Contact FrameIQ to discuss your requirements.</p>
        </div>
        <div class="footer-cta__actions">
          <a class="btn btn--primary" href="${getPageHref('pages/contact.html', root)}">Book a Demo</a>
          <a class="btn btn--secondary" href="${getPageHref('pages/playground.html', root)}">Try Live Demo</a>
        </div>
      </div>
    </section>`;
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
    ${closingCta}
    <footer class="site-footer" data-tone="dark">
      <div class="footer-strip">
        <address class="footer-contact">
          <a href="${siteContact.phoneHref}" data-site="phone">${siteContact.phone}</a>
          <a href="mailto:${siteContact.email}" data-site="email">${siteContact.email}</a>
          <span data-site="location">${siteContact.location}</span>
        </address>
      </div>
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
        <div class="footer-links-grid">
          ${linksMarkup}
        </div>
      </div>
      <div class="footer-bottom">
        <span class="footer-bottom__copyright">© 2026 FrameIQ. All rights reserved.</span>
        <nav class="footer-bottom__legal" aria-label="Legal links">
          ${(window.NAV_DATA?.footer?.legal || []).map((item) => `<a href="${footerHref(footerPageOverrides[item.label] || item.href)}">${item.label}</a>`).join('')}
        </nav>
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

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  initChatbot();
});
