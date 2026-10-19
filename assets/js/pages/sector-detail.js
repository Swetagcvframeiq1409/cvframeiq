(() => {
  'use strict';

  const main = document.querySelector('main[data-sector]');
  const host = document.querySelector('[data-sector-content]');
  if (!main || !host) return;

  const sectors = Array.isArray(window.SECTORS) ? window.SECTORS : [];
  const products = Array.isArray(window.AI_PRODUCTS) ? window.AI_PRODUCTS : [];
  const allowedScenes = new Set(['ppe', 'pcb', 'crop', 'traffic']);
  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function addMeta(selector, attribute, value) {
    const meta = document.querySelector(selector);
    if (meta) meta.setAttribute(attribute, value);
  }

  function addGroups(sector) {
    const grid = element('div', 'sc-group-grid');
    sector.groups.slice(0, 4).forEach((group) => {
      const card = element('article', 'sc-group-card');
      const heading = element('h3', '', group.title);
      const list = element('ul');
      group.items.slice(0, 3).forEach((text) => {
        const item = element('li');
        if (sector.slug === 'agriculture' && text.includes('BeejHealth')) {
          const link = element('a', '', text);
          link.href = '../beejhealth.html';
          item.appendChild(link);
        } else {
          item.textContent = text;
        }
        list.appendChild(item);
      });
      card.append(heading, list);
      grid.appendChild(card);
    });
    return grid;
  }

  function createRelatedProducts(sector) {
    const matched = products.filter((product) => (
      product.status !== 'demo scene only' &&
      sector.relatedCategories.includes(product.category)
    ));
    if (!matched.length) return null;

    const section = element('section', 'sc-related sc-section');
    section.id = 'related-products';
    section.setAttribute('aria-labelledby', 'sc-related-title');
    const heading = element('h2', '', 'Related AI Store products');
    heading.id = 'sc-related-title';
    const grid = element('div', 'sc-related-grid');
    matched.forEach((product) => {
      const card = element('article', 'sc-related-card');
      const category = element('span', 'sc-related-card__category', product.category);
      const title = element('h3', '', product.name);
      const summary = element('p', '', product.summary);
      const link = element('a', 'sc-text-link', 'View in AI Store');
      link.href = `../ai-store.html#${encodeURIComponent(product.category.toLowerCase())}`;
      link.setAttribute('aria-label', `View ${product.name} in the AI Store`);
      card.append(category, title, summary, link);
      grid.appendChild(card);
    });
    section.append(heading, grid);
    return section;
  }

  function createScene(sector) {
    if (!allowedScenes.has(sector.playgroundScene)) return null;
    const section = element('section', 'sc-demo-strip');
    section.setAttribute('aria-label', 'Illustrative Playground scene');
    const copy = element('div');
    copy.append(element('p', 'sc-eyebrow', 'TRY A DEMO SCENE'), element('h2', '', 'Explore an illustrative scene'), element('p', '', 'Playground uses demo data.'));
    const link = element('a', 'sc-button sc-button--secondary', 'Try the demo scene →');
    link.href = `../playground.html#${encodeURIComponent(sector.playgroundScene)}`;
    link.setAttribute('aria-label', `Try the ${sector.playgroundScene} illustrative demo scene`);
    section.append(copy, link);
    return section;
  }

  function createOtherSectors(sector) {
    const others = sectors.filter((item) => item.slug !== sector.slug);
    const section = element('section', 'sc-other sc-section');
    section.id = 'related-sectors';
    section.setAttribute('aria-labelledby', 'sc-other-title');
    const heading = element('h2', '', 'Other sectors');
    heading.id = 'sc-other-title';
    const list = element('nav', 'sc-other__links');
    list.setAttribute('aria-label', 'Other sector pages');
    others.forEach((other) => {
      const link = element('a', 'sc-other__link', other.name);
      link.href = `${encodeURIComponent(other.slug)}.html`;
      list.appendChild(link);
    });
    section.append(heading, list);
    return section;
  }

  function addCta() {
    const section = element('section', 'sc-cta-section');
    section.id = 'enquiry';
    section.setAttribute('aria-labelledby', 'sc-cta-title');
    const inner = element('div', 'sc-container');
    const band = element('div', 'sc-cta');
    const copy = element('div');
    copy.append(element('p', 'sc-eyebrow', 'TALK TO US'), element('h2', '', "Don't see your industry?"));
    const h2 = copy.querySelector('h2');
    h2.id = 'sc-cta-title';
    copy.appendChild(element('p', '', 'Tell us what you want to detect and the FrameIQ team can review your enquiry.'));
    const actions = element('div', 'sc-actions');
    const contact = element('a', 'sc-button sc-button--primary', 'Start a project →');
    contact.href = '../../pages/contact.html';
    const store = element('a', 'sc-button sc-button--secondary', 'Browse AI Store');
    store.href = '../../pages/ai-store.html';
    actions.append(contact, store);
    band.append(copy, actions);
    inner.appendChild(band);
    section.appendChild(inner);
    return section;
  }

  function setTitle(sector) {
    const title = `${sector.name} Computer Vision Use Cases | FrameIQ`;
    const description = `${sector.summary.split('. ')[0].replace(/[.!?]$/, '')}.`;
    document.title = title.length < 60 ? title : `${sector.name} | FrameIQ`;
    addMeta('meta[name="description"]', 'content', description);
    addMeta('meta[property="og:title"]', 'content', document.title);
    addMeta('meta[property="og:description"]', 'content', description);
    const pageUrl = `https://cvframeiq.com/pages/sectors/${sector.slug}.html`;
    addMeta('link[rel="canonical"]', 'href', pageUrl);
    addMeta('meta[property="og:url"]', 'content', pageUrl);
  }

  function renderNotFound() {
    document.title = 'Sector Not Found | FrameIQ';
    const section = element('section', 'sc-not-found');
    const heading = element('h1', '', 'Sector not found');
    const message = element('p', '', 'This sector page is unavailable. Browse the sector listing to explore the available use cases.');
    const link = element('a', 'sc-button sc-button--primary', 'All sectors');
    link.href = '../../pages/sectors.html';
    section.append(heading, message, link);
    host.replaceChildren(section);
  }

  const sector = sectors.find((item) => item.slug === main.dataset.sector);
  if (!sector || !Array.isArray(sector.groups) || !Array.isArray(sector.relatedCategories)) {
    renderNotFound();
    return;
  }

  setTitle(sector);
  const page = element('div', 'sc-detail');
  const hero = element('section', 'sc-detail-hero');
  hero.setAttribute('aria-labelledby', 'sc-detail-title');
  const heroInner = element('div', 'sc-container sc-detail-hero__inner');
  const copy = element('div');
  copy.appendChild(element('p', 'sc-eyebrow', 'SECTOR'));
  const title = element('h1', '');
  title.id = 'sc-detail-title';
  title.append(document.createTextNode(`${sector.name} `), element('span', 'text-gradient', 'Use Cases'));
  copy.append(title, element('p', 'sc-detail-hero__summary', sector.summary));
  const actions = element('div', 'sc-actions');
  const enquire = element('a', 'sc-button sc-button--primary', 'Enquire →');
  enquire.href = `../../pages/contact.html?sector=${encodeURIComponent(sector.slug)}`;
  enquire.setAttribute('aria-label', `Enquire about ${sector.name}`);
  const allSectors = element('a', 'sc-button sc-button--secondary', 'All sectors');
  allSectors.href = '../../pages/sectors.html';
  actions.append(enquire, allSectors);
  copy.appendChild(actions);

  const visual = element('div', 'sc-detail-hero__visual photo-frame');
  visual.dataset.photo = sector.imageSlot || 'sector-smart-city';
  visual.dataset.photoLoading = 'eager';
  const image = element('img', 'sc-detail-hero__image');
  image.hidden = true;
  image.alt = '';
  image.width = 1600;
  image.height = 900;
  visual.append(image);
  heroInner.append(copy, visual);
  hero.appendChild(heroInner);
  page.appendChild(hero);

  const cases = element('section', 'sc-section');
  cases.id = 'use-cases';
  cases.setAttribute('aria-labelledby', 'sc-cases-title');
  const casesInner = element('div', 'sc-container');
  const casesHeading = element('div', 'sc-section-heading');
  casesHeading.append(element('p', 'sc-eyebrow', 'USE CASES'), element('h2', '', 'Use cases to discuss'));
  casesHeading.querySelector('h2').id = 'sc-cases-title';
  casesInner.append(casesHeading, addGroups(sector));
  cases.appendChild(casesInner);
  page.appendChild(cases);

  const related = createRelatedProducts(sector);
  if (related) {
    const wrapper = element('div', 'sc-container');
    wrapper.appendChild(related);
    page.appendChild(wrapper);
  }
  const scene = createScene(sector);
  if (scene) {
    const wrapper = element('div', 'sc-container sc-demo-wrap');
    wrapper.appendChild(scene);
    page.appendChild(wrapper);
  }
  page.appendChild(createOtherSectors(sector));
  page.appendChild(addCta());
  page.appendChild(element('p', 'sc-footer-note', 'Use cases, scope and timelines are confirmed on enquiry.'));
  host.replaceChildren(page);
  window.initPhotos?.();
})();
