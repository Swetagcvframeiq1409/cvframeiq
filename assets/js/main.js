function getStoredTheme() {
  try {
    const saved = localStorage.getItem('frameiq-theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch (error) {
    console.warn('Saved theme could not be read.', error);
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function applyTheme(theme, persist = true) {
  document.body.dataset.theme = theme;
  if (!persist) return;
  try {
    localStorage.setItem('frameiq-theme', theme);
  } catch (error) {
    console.warn('Theme preference could not be saved.', error);
  }
}

function initThemeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  applyTheme(document.body.dataset.theme || getStoredTheme(), false);
  if (!toggle) return;
  const updateToggleIcon = () => {
    const icon = toggle.querySelector('i');
    if (icon) icon.className = window.iconClass(document.body.dataset.theme === 'light' ? 'moon' : 'sun');
  };
  updateToggleIcon();
  toggle.addEventListener('click', () => {
    applyTheme(document.body.dataset.theme === 'light' ? 'dark' : 'light');
    updateToggleIcon();
  });
}

function initMegaMenus() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const items = Array.from(nav.querySelectorAll('.nav__item--mega'));
  const linksFor = (item) => Array.from(item.querySelectorAll('.nav-group-menu a'));
  let keyboardNavigation = false;
  const alignPanel = (item) => {
    const panel = item.querySelector('.nav-group-menu');
    item.classList.remove('is-flipped');
    if (!panel || item.classList.contains('nav__item--mega--right')) return;
    if (panel.getBoundingClientRect().right > window.innerWidth - 16) item.classList.add('is-flipped');
  };
  const alignOpenPanels = () => {
    items.filter((item) => item.classList.contains('is-open')).forEach(alignPanel);
  };
  const closeItem = (item, returnFocus = false) => {
    item.classList.remove('is-open');
    const trigger = item.querySelector('.nav__button');
    trigger?.setAttribute('aria-expanded', 'false');
    if (returnFocus && trigger) {
      item.dataset.suppressFocusOpen = 'true';
      trigger.focus();
      delete item.dataset.suppressFocusOpen;
    }
  };
  const openItem = (item) => {
    if (item.classList.contains('is-open')) return;
    items.forEach((candidate) => {
      if (candidate !== item) closeItem(candidate);
    });
    item.classList.add('is-open');
    const trigger = item.querySelector('.nav__button');
    trigger?.setAttribute('aria-expanded', 'true');
    alignPanel(item);
  };

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') keyboardNavigation = true;
  }, true);
  document.addEventListener('pointerdown', () => { keyboardNavigation = false; }, true);

  items.forEach((item) => {
    const trigger = item.querySelector('.nav__button');
    if (!trigger) return;
    item.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!item.contains(document.activeElement)) closeItem(item);
      }, 0);
    });
    item.addEventListener('focusin', () => {
      if (keyboardNavigation && !item.dataset.suppressFocusOpen) openItem(item);
    });
    trigger.addEventListener('click', () => {
      if (item.classList.contains('is-open')) closeItem(item);
      else openItem(item);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        openItem(item);
        const links = linksFor(item);
        (event.key === 'ArrowDown' ? links[0] : links[links.length - 1])?.focus();
      }
    });
    linksFor(item).forEach((link, index, links) => {
      link.addEventListener('keydown', (event) => {
        let destination = null;
        if (event.key === 'ArrowDown') destination = links[(index + 1) % links.length];
        else if (event.key === 'ArrowUp') destination = links[(index - 1 + links.length) % links.length];
        else if (event.key === 'Home') destination = links[0];
        else if (event.key === 'End') destination = links[links.length - 1];
        if (destination) {
          event.preventDefault();
          destination.focus();
        }
      });
    });
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || !event.target.closest('.nav__item--mega')) {
      items.forEach((item) => closeItem(item));
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openItemEl = items.find((item) => item.classList.contains('is-open'));
    if (openItemEl) {
      event.preventDefault();
      closeItem(openItemEl, true);
    }
  });
  window.addEventListener('resize', alignOpenPanels);
  document.fonts?.ready.then(alignOpenPanels);
  document.fonts?.addEventListener('loadingdone', alignOpenPanels);
}

function initMobileMenu() {
  const menu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.site-header');
  const actions = document.querySelector('.header-actions');
  if (!menu || !header || !actions) return;
  const overlay = document.querySelector('[data-mobile-overlay]');
  const closeButton = menu.querySelector('[data-mobile-close]');
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'icon-button mobile-menu__toggle';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-controls', 'mobile-menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = `<i class="${window.iconClass('menu')}" aria-hidden="true"></i>`;
  actions.prepend(toggle);

  const focusable = () => Array.from(menu.querySelectorAll('a[href], button:not([disabled])')).filter((element) => !element.closest('[hidden]'));
  const closeMenu = (returnFocus = true) => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    overlay?.classList.remove('is-open');
    if (returnFocus) toggle.focus();
  };
  const openMenu = () => {
    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    overlay?.classList.add('is-open');
    closeButton?.focus();
  };
  toggle.addEventListener('click', openMenu);
  closeButton?.addEventListener('click', () => closeMenu());
  overlay?.addEventListener('click', () => closeMenu());
  menu.querySelectorAll('.mobile-menu__group').forEach((button) => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = button.getAttribute('aria-expanded') === 'true';
      menu.querySelectorAll('.mobile-menu__group').forEach((otherButton) => {
        if (otherButton === button) return;
        otherButton.setAttribute('aria-expanded', 'false');
        const otherPanel = document.getElementById(otherButton.getAttribute('aria-controls'));
        if (otherPanel) otherPanel.hidden = true;
      });
      button.setAttribute('aria-expanded', String(!expanded));
      if (panel) panel.hidden = expanded;
    });
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
  menu.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const elements = focusable();
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });
}

function initAccordion() {
  const items = Array.from(document.querySelectorAll('.accordion-item'));
  items.forEach((item) => {
    const trigger = item.querySelector('.accordion-trigger');
    const panel = item.querySelector('.accordion-panel');
    const inner = panel?.querySelector('.accordion-panel__inner');
    if (!trigger || !panel || !inner) return;
    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
      panel.style.maxHeight = open ? `${inner.scrollHeight + 20}px` : '0px';
    };
    setOpen(item.classList.contains('is-open'));
    trigger.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('is-open');
      items.forEach((candidate) => {
        candidate.classList.remove('is-open');
        candidate.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
        const candidatePanel = candidate.querySelector('.accordion-panel');
        if (candidatePanel) candidatePanel.style.maxHeight = '0px';
      });
      setOpen(shouldOpen);
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      const target = targetId && targetId.length > 1 ? document.querySelector(targetId) : null;
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
      const url = new URL(window.location.href);
      url.hash = targetId;
      history.pushState(null, '', url);
    });
  });
}

function initStickySubnav() {
  const pathname = window.location.pathname.replace(/\\/g, '/');
  const page = pathname.split('/').pop();
  const isSectorDetail = pathname.includes('/sectors/');
  if (!isSectorDetail && !['about.html', 'features.html', 'docs.html'].includes(page)) return;

  const main = document.querySelector('main');
  if (!main) return;
  const sections = Array.from(main.querySelectorAll('section[id]'))
    .map((section) => ({ section, heading: section.querySelector(':scope > h2, :scope header h2, :scope .section-head h2, :scope h2') }))
    .filter((item) => item.heading && item.heading.textContent.trim());
  if (sections.length < 2) return;

  const nav = document.createElement('nav');
  nav.className = 'sticky-subnav';
  nav.setAttribute('aria-label', 'On this page');
  const list = document.createElement('div');
  list.className = 'sticky-subnav__list';
  const links = sections.map(({ section, heading }, index) => {
    const link = document.createElement('a');
    link.href = `#${section.id}`;
    link.textContent = heading.textContent.trim();
    if (index === 0) link.setAttribute('aria-current', 'location');
    list.appendChild(link);
    return { section, link };
  });
  nav.appendChild(list);
  document.documentElement.classList.add('has-sticky-subnav');
  const firstSection = main.querySelector('section');
  if (firstSection) firstSection.after(nav);
  else main.prepend(nav);

  if ('IntersectionObserver' in window) {
    const activeObserver = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];
      if (!active) return;
      links.forEach(({ section, link }) => {
        if (section === active.target) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -62% 0px', threshold: [0, .2, .5] });
    links.forEach(({ section }) => activeObserver.observe(section));
  }
}

function initCursorGlow() {
  if (window.matchMedia('(hover: none), (pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
  let frame = 0;
  document.addEventListener('pointermove', (event) => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`);
      frame = 0;
    });
  }, { passive: true });
}

function initPagePolish() {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.body.classList.add('page-fade-in');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);
  const backToTop = document.createElement('button');
  backToTop.type = 'button';
  backToTop.className = 'icon-button back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = `<i class="${window.iconClass('arrowUp')}" aria-hidden="true"></i>`;
  document.body.appendChild(backToTop);
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }));
  initStickySubnav();
  initCursorGlow();

  const header = document.querySelector('.site-header');
  const measureHeader = () => {
    if (!header) return;
    document.documentElement.style.setProperty('--header-h', `${header.getBoundingClientRect().height}px`);
  };
  measureHeader();
  if (header && 'ResizeObserver' in window) new ResizeObserver(measureHeader).observe(header);
  let ticking = false;
  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    progress.style.transform = `scaleX(${ratio})`;
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
    if (header) {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
}

function initSiteContact() {
  const contact = window.SITE_CONTACT;
  if (!contact) {
    console.error('Shared contact details are unavailable.');
    return;
  }
  const values = {
    phone: contact.phone,
    email: contact.email,
    location: contact.location,
    hours: contact.hours,
    registration: contact.registration.value,
    registrationLabel: contact.registration.label
  };
  document.querySelectorAll('[data-site]').forEach((element) => {
    const key = element.dataset.site;
    if (!(key in values)) return;
    element.textContent = values[key];
    if (key === 'phone' && element instanceof HTMLAnchorElement) element.href = contact.phoneHref;
    if (key === 'email' && element instanceof HTMLAnchorElement) element.href = `mailto:${contact.email}`;
  });
  document.querySelectorAll('[data-site-copy]').forEach((button) => {
    const key = button.dataset.siteCopy;
    if (key in values) button.dataset.copy = values[key];
  });

  document.querySelectorAll('#organization-jsonld').forEach((script) => {
    const schema = JSON.parse(script.textContent);
    const organization = schema.mainEntity?.['@type'] === 'Organization' ? schema.mainEntity : schema;
    organization.telephone = contact.phone;
    organization.email = contact.email;
    organization.openingHours = 'Mo-Fr 09:00-18:00';
    organization.address = {
      '@type': 'PostalAddress',
      streetAddress: contact.location.split(',')[0],
      addressLocality: contact.location.split(',')[0],
      addressRegion: contact.location.split(',')[1].trim(),
      addressCountry: 'IN'
    };
    script.textContent = JSON.stringify(schema);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMegaMenus();
  initMobileMenu();
  initAccordion();
  initSmoothScroll();
  initPagePolish();
  initSiteContact();
});
