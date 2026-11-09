(() => {
  'use strict';

  const root = document.querySelector('#sx-root');
  if (!root || root.dataset.page !== 'all-sectors') return;
  if (root.dataset.renderedPage === 'all-sectors') return;

  const entries = Object.entries(window.SECTOR_UI || {}).sort((left, right) => left[1].order - right[1].order);
  const sectors = entries.map(([slug, ui]) => ({
    slug,
    ui,
    data: (window.SECTORS || []).find((sector) => sector.slug === ui.sourceSlug)
  })).filter((item) => item.data);

  function node(tag, className, text) {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (text !== undefined) result.textContent = text;
    return result;
  }

  function icon(className) {
    const result = node('i', className);
    result.setAttribute('aria-hidden', 'true');
    return result;
  }

  function media(parent, name, className, options = {}) {
    const frame = node('div', `sx-media ${className || ''}`.trim());
    frame.innerHTML = window.FIQ.img(name, options);
    const image = frame.querySelector('img');
    if (image) {
      image.addEventListener('error', () => {
        frame.innerHTML = window.FIQ.img(null, { alt: image.alt || 'Sector visual' });
      }, { once: true });
    }
    parent.appendChild(frame);
    return frame;
  }

  function band(id, tone, className = '') {
    const gkTone = tone === 'dark' ? ' gk-band--dark' : '';
    const result = node('section', `sx-band gk-band${gkTone} ${className}`.trim());
    result.id = id;
    result.dataset.tone = tone;
    root.appendChild(result);
    return result;
  }

  function wrap(parent, className = 'sx-wrap') {
    const result = node('div', className);
    parent.appendChild(result);
    return result;
  }

  function addReveal(element, delay = 0) {
    element.dataset.sxReveal = '';
    if (delay) element.style.setProperty('--sx-delay', `${delay}ms`);
    return element;
  }

  function sectionHeading(parent, eyebrow, title, description) {
    const header = node('header', 'sx-section-heading');
    header.append(node('p', 'sx-eyebrow', eyebrow), node('h2', '', title));
    if (description) header.appendChild(node('p', 'sx-section-heading__lede', description));
    parent.appendChild(header);
  }

  function buildHero() {
    const section = band('hero', 'dark', 'sx-hero gk-hero');
    const content = wrap(section, 'sx-wrap gk-wrap sx-hero__layout');
    const copy = node('div', 'sx-hero__copy');
    const breadcrumb = node('nav', 'sx-breadcrumb');
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    const home = node('a', '', 'Home');
    home.href = '../index.html';
    breadcrumb.append(home, document.createTextNode(' / Sectors'));
    copy.append(breadcrumb, node('p', 'sx-eyebrow', 'INDUSTRIES'));
    const title = node('h1', '', 'Explore industry use cases');
    copy.append(title, node('p', 'sx-hero__lede', 'Explore how computer vision can be applied across industries. Scope and timelines are confirmed on enquiry.'));

    const actions = node('div', 'sx-actions');
    const explore = node('a', 'sx-button sx-button--primary gk-btn', 'Explore industries');
    explore.href = '#all-sectors';
    const exploreIcon = icon('bi bi-arrow-down');
    explore.appendChild(exploreIcon);
    const talk = node('a', 'sx-button sx-button--secondary gk-btn', 'Talk to us');
    talk.href = 'contact.html';
    talk.appendChild(icon('bi bi-arrow-up-right'));
    actions.append(explore, talk);
    copy.appendChild(actions);

    const panel = node('div', 'sx-hero__panel sx-hero__panel--overview');
    media(panel, 'hub-hero', 'sx-hero__overview-media', {
      priority: true,
      sizes: '(min-width:992px) 42vw, 92vw'
    });
    const labels = node('div', 'sx-hero__overview-labels');
    sectors.slice(0, 4).forEach(({ data, ui }) => {
      const label = node('span', 'sx-hero__overview-label', data.name);
      label.style.setProperty('--sx-tint', ui.tint);
      labels.appendChild(label);
    });
    panel.appendChild(labels);
    content.append(copy, panel);
  }

  function buildSubnav() {
    const section = band('sector-navigation', 'light', 'sx-subnav-band');
    const nav = node('nav', 'sx-subnav');
    nav.dataset.sxSubnav = '';
    nav.setAttribute('aria-label', 'Explore sectors');
    const chips = node('div', 'sx-subnav__chips');
    const active = node('a', 'sx-subnav__chip is-active', 'All sectors');
    active.href = '#all-sectors';
    active.dataset.sxSpyTarget = 'all-sectors';
    active.setAttribute('aria-current', 'location');
    chips.appendChild(active);
    sectors.forEach(({ slug, data, ui }) => {
      const link = node('a', 'sx-subnav__chip', data.name);
      link.href = `sectors/${ui.href}`;
      link.dataset.sxSpyTarget = `sector-${slug}`;
      chips.appendChild(link);
    });
    const progressTrack = node('span', 'sx-subnav__progress');
    progressTrack.setAttribute('aria-hidden', 'true');
    progressTrack.appendChild(node('span', 'sx-subnav__progress-fill'));
    nav.append(chips, progressTrack);
    section.appendChild(nav);
  }

  function buildSectorGrid() {
    const section = band('all-sectors', 'light', 'sx-sector-grid-band');
    const content = wrap(section);
    const intro = node('header', 'sx-section-heading');
    intro.append(
      node('p', 'sx-eyebrow', 'SECTOR USE CASES'),
      node('p', 'sx-section-heading__lede', 'Examples of visual use cases to discuss for each operating environment.')
    );
    content.appendChild(intro);
    const grid = node('div', 'gk-cards sx-sector-grid');
    sectors.forEach(({ slug, data, ui }, index) => {
      const link = addReveal(node('a', 'gk-card sx-sector-card'), index * 60);
      link.id = `sector-${slug}`;
      link.href = `sectors/${ui.href}`;
      link.setAttribute('aria-label', `Explore ${data.name} solutions`);
      link.style.setProperty('--sx-tint', ui.tint);
      media(link, data.media?.hero, 'sx-sector-card__media', {
        sizes: '(min-width:1280px) 30vw, (min-width:768px) 46vw, 92vw'
      });
      const body = node('span', 'sx-sector-card__body');
      const top = node('span', 'sx-sector-card__top');
      top.append(node('span', 'sx-sector-card__index', String(index + 1).padStart(2, '0')));
      const chip = node('span', 'sx-icon-chip');
      chip.appendChild(icon(`bi ${ui.icon}`));
      top.appendChild(chip);
      const title = node('span', 'sx-sector-card__title', data.name);
      const summary = node('span', 'sx-sector-card__summary', data.summary);
      const arrow = icon('bi bi-arrow-up-right');
      arrow.classList.add('sx-sector-card__arrow');
      const action = node('span', 'sx-sector-card__action', 'Explore sector');
      action.appendChild(arrow);
      body.append(top, title, summary, action);
      link.appendChild(body);
      grid.appendChild(link);
    });
    content.appendChild(grid);
    content.appendChild(node('p', 'sx-footer-note', 'Use cases, scope and timelines are confirmed on enquiry.'));
  }

  function buildMarquee() {
    const section = band('cross-sector-keywords', 'dark', 'sx-marquee-band');
    const content = wrap(section);
    sectionHeading(content, 'COMPUTER VISION ACROSS SECTORS', 'Visual use cases');
    const tiles = [
      { title: 'Venue operations', image: 'hub-tile-venue-operations' },
      { title: 'Event safety', image: null },
      { title: 'Safety & PPE', image: 'hub-tile-safety-ppe' },
      { title: 'Hazard detection', image: 'hub-tile-hazard-detection' },
      { title: 'Vehicle safety', image: 'hub-tile-vehicle-safety' },
      { title: 'Quality control', image: 'hub-tile-quality-control' }
    ];
    const grid = node('div', 'sx-visual-grid');
    tiles.forEach((item) => {
      const tile = node('article', 'sx-visual-tile');
      media(tile, item.image, 'sx-visual-tile__media', {
        sizes: '(min-width:1280px) 30vw, (min-width:768px) 46vw, 88vw'
      });
      tile.appendChild(node('h3', '', item.title));
      grid.appendChild(tile);
    });
    content.appendChild(grid);
  }

  function buildCapabilities() {
    const section = band('cross-sector-capabilities', 'light', 'sx-capabilities');
    const content = wrap(section);
    sectionHeading(content, 'FRAMEIQ CAPABILITIES', 'Computer vision for real-world workflows');
    const pillars = window.FEATURES?.pillars || [];
    const grid = node('div', 'gk-cards sx-capability-grid');
    const pillarImages = [
      'manufacturing-defect-inspection',
      null,
      'security-surveillance-hero',
      'ai-agents-control-room'
    ];
    pillars.slice(0, 4).forEach((pillar, index) => {
      const card = addReveal(node('article', 'gk-card sx-card sx-capability-card'), index * 60);
      media(card, pillarImages[index], 'sx-capability-card__media', {
        sizes: '(min-width:1280px) 23vw, (min-width:768px) 44vw, 90vw'
      });
      card.append(node('p', 'sx-capability-card__index', String(index + 1).padStart(2, '0')), node('h3', '', pillar.title), node('p', '', pillar.summary));
      grid.appendChild(card);
    });
    content.appendChild(grid);
  }

  function buildProcess() {
    const section = band('how-frameiq-works', 'dark', 'sx-process');
    const content = wrap(section);
    sectionHeading(content, 'HOW WE WORK', 'How FrameIQ works');
    const steps = window.COMPANY_PAGE_DATA?.process || [];
    const list = node('ol', 'gk-cards sx-process__list');
    const stepIcons = ['bi bi-bullseye', 'bi bi-cpu', 'bi bi-patch-check', 'bi bi-rocket-takeoff', 'bi bi-graph-up-arrow'];
    steps.forEach((step, index) => {
      const item = addReveal(node('li', 'gk-card sx-process__step'), index * 60);
      item.append(node('span', 'sx-process__number', String(index + 1).padStart(2, '0')), icon(stepIcons[index] || 'bi bi-arrow-right'), node('h3', '', step.title), node('p', '', step.description));
      list.appendChild(item);
    });
    content.appendChild(list);
  }

  function buildFaq() {
    const faqs = (window.FAQ_DATA || []).filter((item) => (
      /industr|sector|go live|deployment/i.test(item.question) &&
      item.answer &&
      !/^\[placeholder/i.test(item.answer)
    ));
    if (!faqs.length) return;
    const section = band('sector-faq', 'light', 'sx-faq');
    const content = wrap(section);
    sectionHeading(content, 'COMMON QUESTIONS', 'Frequently asked questions');
    const accordion = node('div', 'gk-acc');
    accordion.dataset.gkAcc = '';
    faqs.forEach((item, index) => {
      const entry = node('div', 'gk-acc__item');
      const button = node('button', 'gk-acc__q', item.question);
      const panelId = `sx-all-sectors-faq-${index + 1}`;
      button.type = 'button';
      button.setAttribute('aria-controls', panelId);
      const panel = node('div', 'gk-acc__a');
      panel.id = panelId;
      const panelInner = node('div');
      panelInner.appendChild(node('p', '', item.answer));
      panel.appendChild(panelInner);
      entry.append(button, panel);
      accordion.appendChild(entry);
    });
    content.appendChild(accordion);
  }

  function buildCta() {
    const section = band('sector-cta', 'light', 'sx-cta');
    const content = wrap(section, 'sx-wrap gk-cta sx-cta__inner');
    const copy = node('div', 'sx-cta__copy');
    copy.append(node('p', 'sx-eyebrow', 'START A CONVERSATION'), node('h2', '', "Don't see your industry?"));
    copy.appendChild(node('p', '', 'Tell us what you want to detect and the FrameIQ team can review your enquiry.'));
    const actions = node('div', 'sx-cta__actions');
    const demo = node('a', 'gk-btn', 'Book a Demo');
    demo.href = 'contact.html';
    demo.appendChild(icon('bi bi-arrow-up-right'));
    const project = node('a', 'gk-btn', 'Start a project');
    project.href = 'contact.html';
    project.appendChild(icon('bi bi-arrow-up-right'));
    const store = node('a', 'gk-btn', 'Browse AI Store');
    store.href = 'ai-store.html';
    store.appendChild(icon('bi bi-arrow-up-right'));
    actions.append(demo, project, store);
    const contacts = node('div', 'sx-cta__contact');
    const phone = window.SITE_CONTACT?.phone;
    const phoneHref = window.SITE_CONTACT?.phoneHref;
    const email = window.SITE_CONTACT?.email;
    if (phone && phoneHref) {
      const link = node('a', '', phone);
      link.href = phoneHref;
      contacts.appendChild(link);
    }
    if (email) {
      const link = node('a', '', email);
      link.href = `mailto:${email}`;
      contacts.appendChild(link);
    }
    content.append(copy, actions, contacts);
  }

  function render() {
    root.replaceChildren();
    buildHero();
    buildSubnav();
    buildSectorGrid();
    buildMarquee();
    buildCapabilities();
    buildProcess();
    buildFaq();
    buildCta();
    document.title = 'All sectors | FrameIQ';
    window.SECTOR_KIT?.initReveal();
    window.SECTOR_KIT?.initCounters();
    window.SECTOR_KIT?.initMarquee();
    window.SECTOR_KIT?.initAccordion();
    window.SECTOR_KIT?.initTabs();
    window.SECTOR_KIT?.initSubnav();
    root.dataset.renderedPage = 'all-sectors';
  }

  render();
})();
