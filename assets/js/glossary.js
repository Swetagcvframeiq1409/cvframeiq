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
  const link = (href, text) => { const node = make('a', '', text); node.href = href; return node; };
  const hero = make('section', 'rs-band rs-hero');
  hero.dataset.tone = 'dark';
  const heroWrap = make('div', 'rs-wrap');
  const crumb = make('nav', 'rs-breadcrumb');
  crumb.setAttribute('aria-label', 'Breadcrumb');
  crumb.append(link('../index.html', 'Home'), make('span', '', '/'), link('blog.html', 'Resources'), make('span', '', '/'), make('span', '', 'Glossary'));
  heroWrap.append(crumb, make('p', 'rs-eyebrow', 'Resources'), make('h1', 'rs-h1', 'Glossary'), make('p', 'rs-lead', 'Plain-language explanations of common computer-vision and deployment terms.'));
  const searchWrap = make('div', 'rs-search-wrap rsg-hero-search');
  const searchIcon = make('i', 'bi bi-search'); searchIcon.setAttribute('aria-hidden', 'true');
  const search = make('input', 'rs-search'); search.type = 'search'; search.id = 'rsg-search'; search.placeholder = 'Search terms'; search.setAttribute('aria-label', 'Search terms');
  searchWrap.append(searchIcon, search); heroWrap.appendChild(searchWrap); hero.appendChild(heroWrap); root.appendChild(hero);
  const browser = make('section', 'rs-band'); browser.dataset.tone = 'light';
  const browserWrap = make('div', 'rs-wrap rsg-browser');
  const rail = make('nav', 'rsg-rail'); rail.setAttribute('aria-label', 'Glossary letters');
  const content = make('div', '');
  const controls = make('div', 'rsg-controls');
  const chips = make('div', 'rsg-chips');
  ['All', 'Models', 'Deployment', 'Applications'].forEach((category) => { const chip = make('button', `rs-chip${category === 'All' ? ' is-active' : ''}`, category); chip.type = 'button'; chip.dataset.cat = category; chips.appendChild(chip); });
  const count = make('p', 'rsg-count'); count.setAttribute('aria-live', 'polite'); controls.append(chips, count); content.appendChild(controls);
  const groups = new Map();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letters.forEach((letter) => {
    const group = make('section', 'rsg-group'); group.dataset.letter = letter; group.id = `rsg-letter-${letter.toLowerCase()}`;
    group.appendChild(make('h2', 'rsg-letter', letter)); const list = make('div', 'rs-grid'); group.appendChild(list); groups.set(letter, { group, list });
    const railLink = make('a', '', letter); railLink.href = `#${group.id}`; railLink.dataset.letter = letter; rail.appendChild(railLink);
  });
  terms.forEach((item, index) => {
    const letter = item.term.charAt(0).toUpperCase();
    const group = groups.get(letter);
    if (!group) return;
    const card = make('article', 'rs-card rsg-term rs-reveal'); card.id = item.slug; card.dataset.cat = item.category; card.dataset.index = String(index); card.dataset.search = `${item.term} ${item.category} ${item.definition}`.toLowerCase();
    const meta = make('div', 'rsg-term-meta'); meta.append(make('span', 'rs-chip', item.category), make('span', 'rs-status', 'For review'));
    card.append(make('h3', '', item.term), meta, make('p', '', item.definition));
    if (item.related.length) { const related = make('div', 'rsg-related'); related.append(make('span', '', 'Related')); item.related.forEach((entry) => related.appendChild(link(entry.href, entry.label))); card.appendChild(related); }
    group.list.appendChild(card);
  });
  groups.forEach(({ group }) => { if (!group.querySelector('.rsg-term')) group.hidden = true; content.appendChild(group); });
  const empty = make('p', 'rs-empty'); empty.textContent = 'No terms match your search.'; empty.hidden = true; content.appendChild(empty);
  browserWrap.append(rail, content); browser.appendChild(browserWrap); root.appendChild(browser);
  const suggest = make('section', 'rs-band rsg-suggest'); suggest.dataset.tone = 'dark'; const suggestWrap = make('div', 'rs-wrap');
  const suggestCard = make('div', 'rsg-suggest-card');
  const suggestText = make('div', 'rsg-suggest-text');
  suggestText.append(make('h2', 'rs-h2', 'Suggest a term'), make('p', '', 'Missing a term? Tell us and we will add it.'));
  const suggestButton = make('a', 'rs-button', 'Contact Us'); suggestButton.href = 'contact.html';
  suggestCard.append(suggestText, suggestButton);
  suggestWrap.appendChild(suggestCard); suggest.appendChild(suggestWrap); root.appendChild(suggest);
  const cta = make('section', 'rs-band rs-cta'); cta.dataset.tone = 'dark'; const ctaWrap = make('div', 'rs-wrap');
  ctaWrap.append(make('h2', 'rs-h2', 'Ready to Deploy AI That Actually Works?'), make('p', '', "Book a free 30-min strategy call. We'll review your use case, show you a live demo, and give you an honest timeline + cost estimate no fluff."));
  const actions = make('div', 'rs-actions'); const start = make('a', 'rs-button', 'Start a Project'); start.href = 'contact.html'; const solutions = make('a', 'rs-button rs-button--secondary', 'Explore Solutions'); solutions.href = 'sectors.html'; actions.append(start, solutions); ctaWrap.appendChild(actions); cta.appendChild(ctaWrap); root.appendChild(cta);
  RS.filterList({
    root: browser,
    chipSelector: '.rsg-chips .rs-chip',
    itemSelector: '.rsg-term',
    searchInput: search,
    emptyEl: empty,
    countFormatter: (visible) => `${visible} ${visible === 1 ? 'term' : 'terms'}`,
    onRender: () => groups.forEach(({ group }) => {
      const visible = [...group.querySelectorAll('.rsg-term')].some((card) => !card.hidden);
      group.hidden = !visible;
      const railLink = rail.querySelector(`[data-letter="${group.dataset.letter}"]`);
      if (railLink) {
        railLink.classList.toggle('is-dim', !visible);
        railLink.tabIndex = visible ? 0 : -1;
        if (visible) railLink.href = `#${group.id}`;
        else railLink.removeAttribute('href');
      }
    })
  });
  const highlight = (slug) => { const target = document.getElementById(slug); if (!target) return; target.classList.add('is-highlighted'); target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' }); window.setTimeout(() => target.classList.remove('is-highlighted'), 2000); };
  terms.forEach((item) => { const card = document.getElementById(item.slug); card.addEventListener('click', (event) => { if (event.target.closest('a')) return; history.replaceState(null, '', `#${item.slug}`); highlight(item.slug); }); });
  addEventListener('hashchange', () => highlight(location.hash.slice(1))); if (location.hash) window.setTimeout(() => highlight(location.hash.slice(1)), 0);
  RS.scrollSpy({ links: rail.querySelectorAll('a'), targets: [...groups.values()].map(({ group }) => group).filter((group) => !group.hidden) });
  RS.reveal();
})();
