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
    const grid = element('div', 'gk-cards');
    sector.groups.slice(0, 4).forEach((group) => {
      const card = element('article', 'gk-card');
      const icon = element('div', 'gk-ic');
      icon.appendChild(createKeywordIcon(group.title + ' ' + sector.name));
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
      card.append(icon, heading, list);
      grid.appendChild(card);
    });
    return grid;
  }

  function createKeywordIcon(text) {
    const value = text.toLowerCase(), icon = element('i');
    let name = 'grid';
    if (/traffic|airport|aviation/.test(value)) name = 'airplane';
    else if (/crop|farm|agri|livestock/.test(value)) name = 'flower1';
    else if (/health|care|patient/.test(value)) name = 'heart-pulse';
    else if (/security|surveillance|threat|access/.test(value)) name = 'shield-check';
    else if (/retail|store|shelf/.test(value)) name = 'shop';
    else if (/bank|fraud|identity/.test(value)) name = 'bank';
    else if (/manufact|quality|defect|production/.test(value)) name = 'buildings';
    else if (/city|crowd|event/.test(value)) name = 'people';
    icon.className = window.iconClass ? window.iconClass(name) : `bi bi-${name}`;
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function createRelatedProducts(sector) {
    const matched = products.filter((product) => (
      product.status !== 'demo scene only' &&
      sector.relatedCategories.includes(product.category)
    ));
    if (!matched.length) return null;

    const section = element('section', 'gk-band gk-band--dark');
    section.id = 'related-products';
    section.setAttribute('aria-labelledby', 'sc-related-title');
    const inner = element('div', 'gk-wrap');
    const headingWrap = element('div', 'gk-head');
    headingWrap.append(element('p', 'gk-eyebrow', 'AI Store'), element('h2', '', 'Related AI Store products'));
    const heading = headingWrap.querySelector('h2');
    heading.id = 'sc-related-title';
    const grid = element('div', 'gk-cards');
    matched.forEach((product) => {
      const card = element('article', 'gk-card');
      const icon = element('div', 'gk-ic');
      icon.appendChild(createKeywordIcon(product.name + ' ' + product.category));
      card.append(icon, element('h3', '', product.name));
      const link = element('a', 'gk-more', 'View product →');
      link.href = `../ai-store.html#${encodeURIComponent(product.category.toLowerCase())}`;
      link.setAttribute('aria-label', `View ${product.name} in the AI Store`);
      card.appendChild(link);
      grid.appendChild(card);
    });
    inner.append(headingWrap, grid);
    section.appendChild(inner);
    return section;
  }

  function addCta() {
    const section = element('section', 'gk-band gk-band--dark');
    section.id = 'enquiry';
    section.setAttribute('aria-labelledby', 'sc-cta-title');
    const band = element('div', 'gk-cta');
    band.append(element('span', 'gk-eyebrow', 'TALK TO US'));
    band.append(element('h2', '', "Don't see your industry?"));
    band.querySelector('h2').id = 'sc-cta-title';
    band.appendChild(element('p', '', 'Tell us what you want to detect and the FrameIQ team can review your enquiry.'));
    const contact = element('a', 'gk-btn', 'Start a project →');
    contact.href = '../../pages/contact.html';
    const store = element('a', 'gk-btn gk-btn--ghost', 'Browse AI Store →');
    store.href = '../../pages/ai-store.html';
    band.append(contact, store);
    section.appendChild(band);
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
  const subnav = element('nav', 'gk-subnav');
  const subnavInner = element('div', 'gk-wrap');
  sectors.forEach((item) => {
    const link = element('a', '', item.name);
    link.href = `${encodeURIComponent(item.slug)}.html`;
    if (item.slug === sector.slug) link.setAttribute('aria-current', 'page');
    subnavInner.appendChild(link);
  });
  subnav.appendChild(subnavInner);

  const hero = element('header', 'gk-hero');
  hero.setAttribute('aria-labelledby', 'sc-detail-title');
  const heroInner = element('div', 'gk-wrap');
  const copy = element('div');
  copy.appendChild(element('p', 'gk-crumb', 'Home / Sectors / ' + sector.name));
  const title = element('h1', '');
  title.id = 'sc-detail-title';
  title.append(document.createTextNode(`${sector.name} `));
  title.appendChild(element('b', '', 'Use Cases'));
  copy.append(title, element('p', 'sc-detail-hero__summary', sector.summary));
  const actions = element('div', 'sc-actions');
  const enquire = element('a', 'gk-btn', 'Enquire →');
  enquire.href = `../../pages/contact.html?sector=${encodeURIComponent(sector.slug)}`;
  enquire.setAttribute('aria-label', `Enquire about ${sector.name}`);
  const allSectors = element('a', 'gk-btn gk-btn--ghost', 'All sectors');
  allSectors.href = '../../pages/sectors.html';
  actions.append(enquire, allSectors);
  copy.appendChild(actions);

  const art = element('div', 'gk-art sc-detail-hero__art');
  art.setAttribute('aria-hidden', 'true');
  if (sector.imageSlot) {
    art.className = 'gk-art sc-detail-hero__art sc-detail-hero__photo';
    art.dataset.photo = sector.imageSlot;
    art.dataset.photoLoading = 'eager';
  } else {
    ['tl', 'tr', 'bl'].forEach((position) => art.appendChild(element('span', `sc-camera-frame sc-camera-frame--${position}`)));
    art.appendChild(element('span', 'sc-camera-frame__scan'));
  }
  art.dataset.gkParallax = '0.06';
  heroInner.append(copy, art);
  hero.appendChild(heroInner);
  page.append(subnav, hero);

  const cases = element('section', 'gk-band');
  cases.id = 'use-cases';
  cases.setAttribute('aria-labelledby', 'sc-cases-title');
  const casesInner = element('div', 'gk-wrap');
  const casesHeading = element('div', 'gk-head');
  casesHeading.append(element('p', 'gk-eyebrow', 'USE CASES'), element('h2', '', 'Use cases to discuss'));
  casesHeading.querySelector('h2').id = 'sc-cases-title';
  const casesGrid = addGroups(sector);
  if (sector.groups.length <= 4) casesGrid.classList.add('gk-cards--four');
  casesInner.append(casesHeading, casesGrid);
  cases.appendChild(casesInner);
  page.appendChild(cases);

  const related = createRelatedProducts(sector);
  if (related) page.appendChild(related);

  const other = element('section', 'gk-ind');
  other.setAttribute('aria-label', 'Other sectors');
  const otherInner = element('div', 'gk-wrap');
  const otherCard = element('div', 'gk-ind__card');
  const otherCopy = element('div');
  otherCopy.append(element('span', 'gk-eyebrow', 'Explore sectors'), element('h2', '', 'Other sectors'));
  const otherList = element('ul', 'gk-ind__list');
  sectors.filter((item) => item.slug !== sector.slug).forEach((item) => {
    const row = element('li');
    const link = element('a', '', `${item.name} ↗`);
    link.href = `${encodeURIComponent(item.slug)}.html`;
    row.appendChild(link);
    otherList.appendChild(row);
  });
  otherCard.append(otherCopy, otherList);
  otherInner.appendChild(otherCard);
  other.appendChild(otherInner);
  page.appendChild(other);

  const faqItems = sector.faq || sector.faqs || sector.questions;
  if (Array.isArray(faqItems) && faqItems.length) {
    const faq = element('section', 'gk-band');
    faq.id = 'faq';
    const faqInner = element('div', 'gk-wrap gk-split');
    const faqCopy = element('div');
    faqCopy.append(element('span', 'gk-eyebrow', 'Frequently asked questions'), element('h2', '', 'Frequently asked questions'));
    const acc = element('div', 'gk-acc');
    acc.dataset.gkAcc = '';
    faqItems.forEach((item) => {
      const row = element('div', 'gk-acc__item');
      row.append(element('button', 'gk-acc__q', item.question || item.q), element('div', 'gk-acc__a'));
      row.querySelector('.gk-acc__a').append(element('div', '', item.answer || item.a || ''));
      acc.appendChild(row);
    });
    faqInner.append(faqCopy, acc);
    faq.appendChild(faqInner);
    page.appendChild(faq);
  }
  if (!allowedScenes.has(sector.playgroundScene)) {
    // Sector pages without an illustrative scene keep the real copy only.
  }
  page.appendChild(addCta());
  page.appendChild(element('p', 'sc-footer-note', 'Use cases, scope and timelines are confirmed on enquiry.'));
  host.replaceChildren(page);
  window.initPhotos?.();
})();
