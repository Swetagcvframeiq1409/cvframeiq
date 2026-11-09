(() => {
  'use strict';
  const root = document.querySelector('#rsg-root');
  const terms = Array.isArray(window.FRAMEIQ_GLOSSARY) ? window.FRAMEIQ_GLOSSARY : [];
  if (!root) return;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const lnk = (href, text) => { const node = make('a', '', text); node.href = href; return node; };

  /* ── Hero: always visible on first paint ── */
  const hero = make('section', 'res-hero rs-band gk-band gk-band--dark gk-hero rs-hero');
  hero.dataset.tone = 'dark';
  const heroWrap = make('div', 'rs-wrap');
  heroWrap.style.cssText = 'display:grid;grid-template-columns:1fr;gap:2rem;align-items:center;';

  const heroText = make('div', '');
  const crumb = make('nav', 'rs-breadcrumb');
  crumb.setAttribute('aria-label', 'Breadcrumb');
  crumb.append(lnk('../index.html', 'Home'), make('span', '', '/'), lnk('blog.html', 'Resources'), make('span', '', '/'), make('span', '', 'Glossary'));
  heroText.append(crumb, make('p', 'rs-eyebrow', 'Resources'), make('h1', 'rs-h1', 'Glossary'), make('p', 'rs-lead', 'Plain-language explanations of common computer-vision and deployment terms.'));

  /* Hero image: understand-image.webp 1200x900 55KB */
  const heroFig = document.createElement('figure');
  heroFig.className = 'rs-fig rs-fig--hero';
  heroFig.style.cssText = 'aspect-ratio:4/3;display:none;';
  heroFig.setAttribute('aria-hidden', 'true');
  const heroImg = document.createElement('img');
  heroImg.src = '../assets/img/understand-image.webp';
  heroImg.alt = '';
  heroImg.width = 1200;
  heroImg.height = 900;
  heroImg.decoding = 'async';
  heroImg.className = 'rs-fig__img';
  heroImg.onerror = function () { this.dataset.failed = 'true'; };
  heroFig.appendChild(heroImg);

  heroWrap.append(heroText, heroFig);
  hero.appendChild(heroWrap);

  /* Show hero image from 992px */
  const mq = window.matchMedia('(min-width: 992px)');
  const applyHeroLayout = (matches) => {
    if (matches) {
      heroWrap.style.gridTemplateColumns = '1fr 1fr';
      heroFig.style.display = 'block';
    } else {
      heroWrap.style.gridTemplateColumns = '1fr';
      heroFig.style.display = 'none';
    }
  };
  applyHeroLayout(mq.matches);
  mq.addEventListener('change', (e) => applyHeroLayout(e.matches));

  /* Search box in hero */
  const searchWrap = make('div', 'rs-search-wrap rsg-hero-search');
  const searchIcon = make('i', 'bi bi-search'); searchIcon.setAttribute('aria-hidden', 'true');
  const search = make('input', 'rs-search'); search.type = 'search'; search.id = 'rsg-search'; search.placeholder = 'Search terms'; search.setAttribute('aria-label', 'Search terms');
  searchWrap.append(searchIcon, search); heroText.appendChild(searchWrap);

  root.appendChild(hero);

  /* ── Browser section ── */
  const browser = make('section', 'rs-band gk-band'); browser.dataset.tone = 'light';
  const browserWrap = make('div', 'rs-wrap rsg-browser');

  /* A-Z rail */
  const rail = make('nav', 'gk-subnav rsg-rail'); rail.setAttribute('aria-label', 'Glossary letters');
  const railWrap = make('div', 'gk-wrap');

  const content = make('div', '');
  const controls = make('div', 'rsg-controls');
  const chips = make('div', 'rsg-chips');
  ['All', 'Models', 'Deployment', 'Applications'].forEach((category) => {
    const chip = make('button', `rs-chip${category === 'All' ? ' is-active' : ''}`, category);
    chip.type = 'button'; chip.dataset.cat = category; chips.appendChild(chip);
  });
  const count = make('p', 'rsg-count'); count.setAttribute('aria-live', 'polite');
  controls.append(chips, count); content.appendChild(controls);

  const groups = new Map();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letters.forEach((letter) => {
    const group = make('section', 'rsg-group'); group.dataset.letter = letter; group.id = `rsg-letter-${letter.toLowerCase()}`;
    group.appendChild(make('h2', 'rsg-letter', letter));
    const list = make('div', 'rs-grid gk-cards'); group.appendChild(list); groups.set(letter, { group, list });
    const railLink = make('a', '', letter); railLink.href = `#${group.id}`; railLink.dataset.letter = letter; railWrap.appendChild(railLink);
  });

  terms.forEach((item, index) => {
    const letter = item.term.charAt(0).toUpperCase();
    const group = groups.get(letter);
    if (!group) return;
    const card = make('article', 'rs-card gk-card rsg-term rs-reveal');
    card.id = item.slug; card.dataset.cat = item.category; card.dataset.index = String(index);
    card.dataset.search = `${item.term} ${item.category} ${item.definition}`.toLowerCase();
    const meta = make('div', 'rsg-term-meta');
    const status = make('span', 'rs-status');
    status.dataset.status = 'for-review';
    status.setAttribute('aria-label', 'For review');
    meta.append(make('span', 'rs-chip', item.category), status);
    card.append(make('h3', '', item.term), meta, make('p', '', item.definition));
    if (item.related.length) {
      const related = make('div', 'rsg-related');
      related.append(make('span', '', 'Related'));
      item.related.forEach((entry) => related.appendChild(lnk(entry.href, entry.label)));
      card.appendChild(related);
    }
    group.list.appendChild(card);
  });

  groups.forEach(({ group }) => {
    if (!group.querySelector('.rsg-term')) group.hidden = true;
    content.appendChild(group);
  });

  /* Empty state card with Clear button */
  const emptyCard = make('div', 'rs-card');
  emptyCard.style.cssText = 'grid-column:1/-1;padding:2.5rem;text-align:center;gap:1rem;display:flex;flex-direction:column;align-items:center;';
  emptyCard.hidden = true;
  const emptyMsg = make('p', '', 'No terms match');
  emptyMsg.style.cssText = 'color:var(--text-muted);margin:0;';
  const clearBtn = make('button', 'rs-clear-btn', 'Clear');
  clearBtn.type = 'button';
  emptyCard.append(emptyMsg, clearBtn);
  content.appendChild(emptyCard);

  rail.appendChild(railWrap);
  browserWrap.append(rail, content); browser.appendChild(browserWrap); root.appendChild(browser);

  /* ── Suggest section ── */
  const suggest = make('section', 'rs-band gk-band--dark rsg-suggest'); suggest.dataset.tone = 'dark';
  const suggestWrap = make('div', 'rs-wrap');
  const suggestCard = make('div', 'rsg-suggest-card');
  const suggestText = make('div', 'rsg-suggest-text');
  suggestText.append(make('h2', 'rs-h2', 'Suggest a term'), make('p', '', 'Missing a term? Tell us and we will add it.'));
  const suggestButton = make('a', 'rs-button', 'Contact Us'); suggestButton.href = 'contact.html';
  suggestCard.append(suggestText, suggestButton);
  suggestWrap.appendChild(suggestCard); suggest.appendChild(suggestWrap); root.appendChild(suggest);

  /* ── Keep exploring ── */
  const keepExploring = make('section', 'res-keep-exploring');
  const keepGrid = make('div', 'res-keep-exploring__grid');
  [
    { label: 'Blog', href: 'blog.html', description: 'Explore FrameIQ insights on AI, computer vision, smart cities, agriculture.', icon: 'bi-book' },
    { label: 'Research', href: 'research.html', description: "Explore FrameIQ's computer vision research focus areas.", icon: 'bi-search' },
    { label: 'Compare', href: 'compare.html', description: 'Neutral questions for comparing video analytics and edge or cloud deployment.', icon: 'bi-bar-chart' }
  ].forEach((item) => {
    const card = make('a', 'res-keep-exploring__card', '');
    card.href = item.href;
    const iconWrap = make('span', 'res-keep-exploring__icon');
    const icon = make('i', `bi ${item.icon}`); icon.setAttribute('aria-hidden', 'true');
    iconWrap.appendChild(icon);
    const body = make('div', '');
    body.append(make('h3', '', item.label), make('p', '', item.description));
    card.append(iconWrap, body);
    keepGrid.appendChild(card);
  });
  keepExploring.appendChild(keepGrid); root.appendChild(keepExploring);

  /* ── Filter logic ── */
  const updateRail = () => {
    groups.forEach(({ group }) => {
      const visible = [...group.querySelectorAll('.rsg-term')].some((card) => !card.hidden);
      group.hidden = !visible;
      const railLink = rail.querySelector(`[data-letter="${group.dataset.letter}"]`);
      if (railLink) {
        railLink.classList.toggle('is-dim', !visible);
        railLink.tabIndex = visible ? 0 : -1;
        if (visible) railLink.href = `#${group.id}`;
        else railLink.removeAttribute('href');
      }
    });
  };

  RS.filterList({
    root: browser,
    chipSelector: '.rsg-chips .rs-chip',
    itemSelector: '.rsg-term',
    searchInput: search,
    emptyEl: emptyCard,
    countFormatter: (visible) => `${visible} ${visible === 1 ? 'term' : 'terms'}`,
    onRender: () => updateRail()
  });

  /* Clear button resets search and chips */
  clearBtn.addEventListener('click', () => {
    search.value = '';
    search.dispatchEvent(new Event('input'));
    const allChip = chips.querySelector('[data-cat="All"]');
    if (allChip) allChip.click();
  });

  /* ── Hash highlight ── */
  const highlight = (slug) => {
    const target = document.getElementById(slug);
    if (!target) return;
    target.classList.add('is-highlighted');
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => target.classList.remove('is-highlighted'), 2000);
  };
  terms.forEach((item) => {
    const card = document.getElementById(item.slug);
    if (!card) return;
    card.addEventListener('click', (event) => {
      if (event.target.closest('a')) return;
      history.replaceState(null, '', `#${item.slug}`);
      highlight(item.slug);
    });
  });
  addEventListener('hashchange', () => highlight(location.hash.slice(1)));
  if (location.hash) window.setTimeout(() => highlight(location.hash.slice(1)), 0);

  RS.scrollSpy({ links: rail.querySelectorAll('a'), targets: [...groups.values()].map(({ group }) => group).filter((group) => !group.hidden) });

  /* Reveal only below-fold items */
  RS.reveal();
})();
