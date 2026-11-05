// about-subnav.js - behavior for the About / Company sub navigation.
(function () {
  const nav = document.querySelector('.about-subnav');
  if (!nav) return;

  const list = nav.querySelector('.about-subnav__list');
  const toggle = nav.querySelector('.about-subnav__dropdown-toggle');
  const menu = nav.querySelector('.about-subnav__dropdown-menu');

  // Build the mobile dropdown from the desktop list (single source of truth).
  if (menu && list) {
    menu.innerHTML = '';
    list.querySelectorAll('a').forEach((anchor) => {
      const item = document.createElement('li');
      const clone = anchor.cloneNode(true);
      clone.classList.remove('about-subnav__link');
      clone.classList.add('about-subnav__dropdown-link');
      item.appendChild(clone);
      menu.appendChild(item);
    });
  }

  // Dropdown toggle.
  if (toggle && menu) {
    toggle.addEventListener('click', (event) => {
      event.stopPropagation();
      const open = menu.hasAttribute('hidden');
      if (open) menu.removeAttribute('hidden');
      else menu.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', String(open));
    });
    document.addEventListener('click', (event) => {
      if (!nav.contains(event.target)) {
        menu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        menu.setAttribute('hidden', '');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const currentPage = () => (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const currentHash = () => location.hash.toLowerCase();

  function isActive(anchor) {
    const url = new URL(anchor.getAttribute('href'), location.href);
    const itemPage = (url.pathname.split('/').pop() || 'index.html').toLowerCase();
    const itemHash = url.hash.toLowerCase();
    const page = currentPage();
    if (itemPage !== page) return false;

    const hash = currentHash();
    if (itemHash) return itemHash === hash;

    // No-hash item: active when the hash is empty or not claimed by a sibling.
    if (page === 'about.html') {
      return hash === '' || hash === '#company-snapshot' || hash === '#our-story' ||
        !(hash === '#team');
    }
    return hash === '';
  }

  function applyActive() {
    nav.querySelectorAll('a').forEach((anchor) => {
      const active = isActive(anchor);
      anchor.classList.toggle('is-active', active);
      if (active) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
    });
  }

  // Scroll-spy on the About page: Team item activates when its section is reached.
  function updateScrollSpy() {
    if (currentPage() !== 'about.html') return;
    const teamSection = document.getElementById('team');
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 74;
    const navH = nav.getBoundingClientRect().height;
    const threshold = headerH + navH + 90;
    const teamActive = !!teamSection && teamSection.getBoundingClientRect().top <= threshold;

    nav.querySelectorAll('a').forEach((anchor) => {
      const url = new URL(anchor.getAttribute('href'), location.href);
      const itemHash = url.hash.toLowerCase();
      const isTeamItem = itemHash === '#team';
      const active = teamActive ? isTeamItem : !isTeamItem && (url.pathname.split('/').pop() || '').toLowerCase() === 'about.html';
      // Only toggle the about/team pair; leave other items untouched here.
      if (isTeamItem || itemHash === '') {
        anchor.classList.toggle('is-active', active);
        if (active) anchor.setAttribute('aria-current', 'page');
        else anchor.removeAttribute('aria-current');
      }
    });
  }

  // Smooth scroll for in-page links.
  nav.querySelectorAll('a').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const url = new URL(anchor.getAttribute('href'), location.href);
      const samePage = (url.pathname.split('/').pop() || 'index.html').toLowerCase() === currentPage();
      if (samePage && url.hash) {
        const target = document.getElementById(url.hash.slice(1));
        if (target) {
          event.preventDefault();
          const header = document.querySelector('.site-header');
          const headerH = header ? header.getBoundingClientRect().height : 74;
          const navH = nav.getBoundingClientRect().height;
          const offset = headerH + navH + 12;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: Math.max(0, top),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
          });
          if (history.replaceState) history.replaceState(null, '', url.hash);
        }
      }
      if (menu) {
        menu.setAttribute('hidden', '');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      }
      window.setTimeout(applyActive, 50);
    });
  });

  applyActive();
  window.addEventListener('hashchange', applyActive);

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      updateScrollSpy();
    });
  }, { passive: true });

  window.addEventListener('resize', () => {
    applyActive();
  });
})();