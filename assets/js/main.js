function initMegaMenus() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const items = Array.from(nav.querySelectorAll('.nav__item--mega'));
  const overlay = document.querySelector('[data-mega-overlay]');
  const panelFor = (item) => item.querySelector('.mega');
  const linksFor = (item) => Array.from(item.querySelectorAll('.mega a'));
  let closeTimer = null;
  let openTimer = null;
  let suppressFocusOpen = false;

  const syncOverlay = () => {
    const shouldShow = window.matchMedia('(min-width: 1025px)').matches
      && items.some((item) => item.classList.contains('is-open'));
    overlay?.classList.toggle('is-open', shouldShow);
  };

  const closeItem = (item, returnFocus = false) => {
    item.classList.remove('is-open');
    const trigger = item.querySelector('.nav__button');
    trigger?.setAttribute('aria-expanded', 'false');
    syncOverlay();
    if (returnFocus && trigger) {
      suppressFocusOpen = true;
      trigger.focus();
      suppressFocusOpen = false;
    }
  };

  const positionPanel = (item) => {
    if (!window.matchMedia('(min-width: 1025px)').matches) return;
    const trigger = item.querySelector('.nav__button');
    const panel = panelFor(item);
    if (!trigger || !panel) return;
    const triggerRect = trigger.getBoundingClientRect();
    const panelWidth = panel.getBoundingClientRect().width;
    const left = Math.max(16, Math.min(triggerRect.left, window.innerWidth - panelWidth - 16));
    panel.style.left = `${left}px`;
    panel.style.top = `${triggerRect.bottom}px`;
  };

  const closeAll = (except = null, returnFocus = false) => {
    items.forEach((item) => {
      if (item !== except) closeItem(item, returnFocus && item.classList.contains('is-open'));
    });
  };

  const openItem = (item) => {
    window.clearTimeout(closeTimer);
    /* If another item is open, keep panel visible and just switch — no close/reopen */
    const alreadyOpen = items.find((i) => i !== item && i.classList.contains('is-open'));
    if (alreadyOpen) {
      alreadyOpen.classList.remove('is-open');
      alreadyOpen.querySelector('.nav__button')?.setAttribute('aria-expanded', 'false');
    }
    if (item.classList.contains('is-open')) return;
    item.classList.add('is-open');
    const trigger = item.querySelector('.nav__button');
    trigger?.setAttribute('aria-expanded', 'true');
    positionPanel(item);
    syncOverlay();
  };

  const scheduleClose = () => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => closeAll(), 220);
  };

  items.forEach((item) => {
    const trigger = item.querySelector('.nav__button');
    if (!trigger) return;
    const panel = panelFor(item);

    item.addEventListener('focusout', () => {
      window.setTimeout(() => {
        if (!item.contains(document.activeElement)) closeItem(item);
      }, 0);
    });

    item.addEventListener('focusin', () => {
      if (!suppressFocusOpen && window.matchMedia('(min-width: 1025px)').matches) openItem(item);
    });

    trigger.addEventListener('click', (event) => {
      if (trigger.tagName === 'A' && !window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;
      event.preventDefault();
      if (item.classList.contains('is-open')) closeItem(item);
      else openItem(item);
    });

    item.addEventListener('pointerenter', () => {
      if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        window.clearTimeout(closeTimer);
        window.clearTimeout(openTimer);
        openTimer = window.setTimeout(() => openItem(item), 80);
      }
    });

    item.addEventListener('pointerleave', () => {
      window.clearTimeout(openTimer);
      scheduleClose();
    });

    panel?.addEventListener('pointerenter', () => window.clearTimeout(closeTimer));
    panel?.addEventListener('pointerleave', scheduleClose);

    trigger.addEventListener('keydown', (event) => {
      const triggerList = items.map((i) => i.querySelector('.nav__button')).filter(Boolean);
      const triggerIdx = triggerList.indexOf(trigger);

      if (event.key === 'Enter' || event.key === ' ') {
        if (trigger.tagName === 'A') {
          if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
            event.preventDefault();
            openItem(item);
          }
          return;
        }
        event.preventDefault();
        if (item.classList.contains('is-open')) closeItem(item);
        else openItem(item);
        return;
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        openItem(item);
        window.setTimeout(() => {
          if (item.classList.contains('is-open')) linksFor(item)[0]?.focus();
        }, 20);
        return;
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        const next = triggerList[(triggerIdx + 1) % triggerList.length];
        next?.focus();
        return;
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        const prev = triggerList[(triggerIdx - 1 + triggerList.length) % triggerList.length];
        prev?.focus();
        return;
      }
    });

    linksFor(item).forEach((link, index, links) => {
      link.addEventListener('keydown', (event) => {
        let destination = null;
        if (event.key === 'ArrowDown') destination = links[(index + 1) % links.length];
        else if (event.key === 'ArrowUp') destination = links[(index - 1 + links.length) % links.length];
        else if (event.key === 'Home') destination = links[0];
        else if (event.key === 'End') destination = links[links.length - 1];
        if (destination) { event.preventDefault(); destination.focus(); }
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

  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScrollY) > 80) {
      closeAll();
      lastScrollY = window.scrollY;
    }
  }, { passive: true });

  window.addEventListener('resize', () => {
    closeAll();
    syncOverlay();
  });

  window.addEventListener('blur', () => closeAll());
}

function initMobileMenu() {
  const menu = document.querySelector('.mobile-menu');
  const header = document.querySelector('.site-header');
  const actions = document.querySelector('.header-actions');
  if (!menu || !header || !actions) return;

  const overlay = document.querySelector('[data-mobile-overlay]');

  /* Build the toggle button */
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'mobile-menu__toggle';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-controls', 'mobile-menu');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = `<i class="${window.iconClass('menu')}" aria-hidden="true"></i>`;
  actions.prepend(toggle);

  /* Scroll-lock without layout shift */
  let savedScrollY = 0;
  const lockScroll = () => {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
  };
  const unlockScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, savedScrollY);
  };

  /* Focusable elements inside the drawer */
  const focusable = () => Array.from(
    menu.querySelectorAll('a[href], button:not([disabled])')
  ).filter((el) => {
    let node = el;
    while (node && node !== menu) {
      if (node.inert) return false;
      node = node.parentElement;
    }
    return true;
  });

  const closeMenu = (returnFocus = true) => {
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menu.inert = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    toggle.innerHTML = `<i class="${window.iconClass('menu')}" aria-hidden="true"></i>`;
    overlay?.classList.remove('is-open');
    unlockScroll();
    if (returnFocus) toggle.focus();
  };

  const openMenu = () => {
    lockScroll();
    menu.inert = false;
    menu.setAttribute('aria-hidden', 'false');
    menu.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    toggle.innerHTML = `<i class="${window.iconClass('close')}" aria-hidden="true"></i>`;
    overlay?.classList.add('is-open');
    /* Move focus to first focusable element in drawer */
    window.requestAnimationFrame(() => {
      focusable()[0]?.focus();
    });
  };

  toggle.addEventListener('click', () => {
    if (menu.classList.contains('is-open')) closeMenu();
    else openMenu();
  });

  overlay?.addEventListener('click', () => closeMenu());

  /* Focus trap */
  document.addEventListener('keydown', (event) => {
    if (!menu.classList.contains('is-open')) return;
    if (event.key === 'Escape') { closeMenu(); return; }
    if (event.key !== 'Tab') return;
    const elements = focusable();
    if (!elements.length) { event.preventDefault(); return; }
    const first = elements[0];
    const last = elements[elements.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!menu.contains(document.activeElement)) {
      event.preventDefault();
      first.focus();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu();
  });

  /* Accordion — one group open at a time */
  menu.querySelectorAll('.mobile-menu__group').forEach((button) => {
    button.addEventListener('click', () => {
      const panelId = button.getAttribute('aria-controls');
      const panel = document.getElementById(panelId);
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      /* Close all other groups */
      menu.querySelectorAll('.mobile-menu__group').forEach((other) => {
        if (other === button) return;
        other.setAttribute('aria-expanded', 'false');
        const otherPanel = document.getElementById(other.getAttribute('aria-controls'));
        if (otherPanel) {
          otherPanel.setAttribute('hidden', '');
          const inner = otherPanel.querySelector('.mobile-menu__panel-inner');
          if (inner) inner.inert = true;
        }
      });

      /* Toggle this group */
      button.setAttribute('aria-expanded', String(!isExpanded));
      if (panel) {
        if (isExpanded) {
          panel.setAttribute('hidden', '');
          const inner = panel.querySelector('.mobile-menu__panel-inner');
          if (inner) inner.inert = true;
        } else {
          panel.removeAttribute('hidden');
          const inner = panel.querySelector('.mobile-menu__panel-inner');
          if (inner) inner.inert = false;
        }
      }

      /* Scroll to keep the open group visible */
      if (!isExpanded) {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            button.scrollIntoView({ block: 'start', behavior: 'smooth' });
          });
        });
      }
    });
  });

  /* Initialise: set inert on all closed panels */
  menu.querySelectorAll('.mobile-menu__panel').forEach((panel) => {
    const inner = panel.querySelector('.mobile-menu__panel-inner');
    if (inner && panel.hasAttribute('hidden')) inner.inert = true;
  });

  /* Close on link click */
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu(false));
  });

  /* Close when viewport grows past 1024px */
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1025 && menu.classList.contains('is-open')) closeMenu(false);
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
    };
    setOpen(item.classList.contains('is-open'));
    trigger.addEventListener('click', () => {
      const shouldOpen = !item.classList.contains('is-open');
      items.forEach((candidate) => {
        candidate.classList.remove('is-open');
        candidate.querySelector('.accordion-trigger')?.setAttribute('aria-expanded', 'false');
      });
      setOpen(shouldOpen);
    });
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.closest('nav.subnav[data-subnav]')) return;
    link.addEventListener('click', (event) => {
      if (document.querySelector('.about-page') && link.closest('.sticky-subnav')) return;
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

function initSubnav() {
  const navs = Array.from(document.querySelectorAll('nav.subnav[data-subnav]'));
  navs.forEach((nav) => {
    const entries = Array.from(nav.querySelectorAll('a[href^="#"]'))
      .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
      .filter((entry) => entry.section);
    if (!entries.length) return;

    document.documentElement.classList.add('has-subnav');
    entries.forEach(({ link, section }) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 0;
        const top = window.scrollY + section.getBoundingClientRect().top - headerHeight - nav.getBoundingClientRect().height;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion && document.scrollingElement) {
          document.scrollingElement.scrollTop = Math.max(0, top);
        } else {
          window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        }
        const url = new URL(window.location.href);
        url.hash = link.hash;
        history.pushState(null, '', url);
      });
    });
    let scrollFrame = 0;
    const updateActiveLink = () => {
      scrollFrame = 0;
      const offset = (document.querySelector('.site-header')?.getBoundingClientRect().height || 0)
        + nav.getBoundingClientRect().height + 24;
      let active = entries[0];
      entries.forEach((entry) => {
        if (entry.section.getBoundingClientRect().top <= offset) active = entry;
      });
      entries.forEach((entry) => {
        if (entry === active) entry.link.setAttribute('aria-current', 'location');
        else entry.link.removeAttribute('aria-current');
      });
    };
    const scheduleActiveLink = () => {
      if (scrollFrame) return;
      scrollFrame = requestAnimationFrame(updateActiveLink);
    };
    window.addEventListener('scroll', scheduleActiveLink, { passive: true });
    window.addEventListener('resize', scheduleActiveLink);
    updateActiveLink();
  });
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
  initSubnav();
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
      header.classList.toggle('is-scrolled', window.scrollY > 24);
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
  try {
    initMegaMenus();
  } catch (error) {
    console.warn('mega menu skipped', error);
  }
  initMobileMenu();
  initAccordion();
  initSmoothScroll();
  initPagePolish();
  initSiteContact();
});
