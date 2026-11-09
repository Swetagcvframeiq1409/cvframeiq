(() => {
  'use strict';

  const root = document.querySelector('#sx-root');
  if (!root || !root.dataset.sector) return;
  if (root.dataset.renderedSector === root.dataset.sector) return;

  const entries = Object.entries(window.SECTOR_UI || {});
  const requestedSlug = root.dataset.sector;
  const match = entries.find(([slug, ui]) => slug === requestedSlug || ui.sourceSlug === requestedSlug);
  const ui = match?.[1];
  const sector = ui && (window.SECTORS || []).find((item) => item.slug === ui.sourceSlug);

  function make(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function link(text, href, className) {
    const element = make('a', className, text);
    element.href = href;
    return element;
  }

  function appendBand(id, tone, className = '') {
    const section = make('section', `gk-band ${tone} ${className}`.trim());
    section.id = id;
    root.appendChild(section);
    return section;
  }

  function appendHeading(parent, title) {
    const heading = make('header', 'sector-detail__heading');
    heading.appendChild(make('h2', '', title));
    parent.appendChild(heading);
  }

  function appendMedia(parent, name, className, options) {
    const media = make('div', `sector-detail__media ${className || ''}`.trim());
    media.innerHTML = window.FIQ.img(name, options);
    const image = media.querySelector('img');
    if (image) {
      image.addEventListener('error', () => {
        media.innerHTML = window.FIQ.img('', { alt: image.alt || 'Sector visual' });
      }, { once: true });
    }
    parent.appendChild(media);
    return media;
  }

  function makeNeutralProducts() {
    const block = make('div', 'gk-cards');
    const links = [
      { label: 'AI Store', href: '../ai-store.html', icon: 'bi-grid-3x3-gap' },
      { label: 'Hardware', href: '../hardware/gear.html', icon: 'bi-cpu' },
      { label: 'Book a Hardware Demo', href: '../hardware/book-demo.html', icon: 'bi-calendar-check' }
    ];
    links.forEach((item) => {
      const card = make('article', 'gk-card');
      const icon = make('i', `bi ${item.icon} sector-detail__product-icon`);
      icon.setAttribute('aria-hidden', 'true');
      const title = make('h3');
      title.appendChild(link(item.label, item.href, 'sector-detail__product-link'));
      card.append(
        icon,
        title,
        make('p', 'gk-draft', 'Draft — pending content')
      );
      block.appendChild(card);
    });
    return block;
  }

  function buildHero() {
    const section = appendBand('sector-hero', 'gk-band--dark gk-hero', 'sector-detail__hero');
    const content = make('div', 'gk-wrap sector-detail__hero-layout');
    const copy = make('div', 'sector-detail__hero-copy');
    const breadcrumb = make('nav', 'gk-crumb');
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    breadcrumb.append(
      link('Home', '../../index.html'),
      document.createTextNode(' / '),
      link('Sectors', '../sectors.html'),
      document.createTextNode(` / ${sector.name}`)
    );
    const actions = make('div', 'sector-detail__hero-actions');
    actions.append(
      link('Book a Demo', '../contact.html', 'gk-btn'),
      link('View use cases', '#sector-use-cases', 'gk-btn gk-btn--ghost')
    );
    copy.append(
      breadcrumb,
      make('span', 'gk-eyebrow', 'SOLUTIONS'),
      make('h1', '', sector.name),
      make('p', '', sector.summary),
      actions
    );
    content.append(copy);
    appendMedia(content, sector.media?.hero, 'sector-detail__hero-media', {
      priority: true,
      sizes: '(min-width:992px) 46vw, 92vw'
    });
    section.appendChild(content);
  }

  function buildUseCases() {
    const groups = Array.isArray(sector.groups) ? sector.groups.filter((group) => group?.title) : [];
    const section = appendBand('sector-use-cases', '', 'sector-detail__use-cases');
    const content = make('div', 'gk-wrap');
    appendHeading(content, 'Use cases to discuss');
    const cards = make('div', 'gk-cards gk-cards--four');
    groups.forEach((group) => {
      const card = make('article', 'gk-card');
      card.appendChild(make('h3', '', group.title));
      const list = make('ul');
      const items = Array.isArray(group.items) ? group.items : [];
      items.forEach((item) => list.appendChild(make('li', '', item)));
      if (!items.length) {
        const draft = make('li');
        draft.appendChild(make('span', 'gk-draft', 'Draft — pending content'));
        list.appendChild(draft);
      }
      card.appendChild(list);
      cards.appendChild(card);
    });
    content.appendChild(cards);
    section.appendChild(content);
  }

  function buildCapabilities() {
    const feature = Number.isInteger(sector.capabilityIndex) ? window.FEATURES?.pillars?.[sector.capabilityIndex] : null;
    const section = appendBand('sector-capabilities', 'gk-band--dark', 'sector-detail__capabilities');
    const content = make('div', 'gk-wrap');
    appendHeading(content, 'How FrameIQ helps here');
    const split = make('div', 'sector-detail__capability-layout');
    const copy = make('article', 'gk-card sector-detail__capability-copy');
    if (feature) {
      copy.append(make('h3', '', feature.title), make('p', '', feature.summary));
      if (feature.useCases?.length) {
        const list = make('ul');
        feature.useCases.forEach((item) => list.appendChild(make('li', '', item)));
        copy.appendChild(list);
      }
      if (sector.slug === 'agriculture') {
        copy.appendChild(link('Explore BeejHealth', '../beejhealth.html', 'sector-detail__link'));
      }
    }

    const mediaColumn = make('div', 'sector-detail__capability-media');
    appendMedia(mediaColumn, sector.media?.helps, '', {
      sizes: '(min-width:992px) 40vw, 92vw'
    });
    if (sector.media?.extra) {
      appendMedia(mediaColumn, sector.media.extra, 'sector-detail__media--secondary', {
        sizes: '(min-width:992px) 28vw, 70vw'
      });
    }
    split.append(copy, mediaColumn);
    content.appendChild(split);

    if (Array.isArray(sector.media?.gallery) && sector.media.gallery.length) {
      const gallery = make('div', 'sector-detail__gallery');
      const titles = new Set(feature?.useCases || []);
      sector.media.gallery.forEach((item) => {
        if (!titles.has(item.title)) return;
        const card = make('article', 'sector-detail__gallery-card');
        appendMedia(card, item.image, '', {
          sizes: '(min-width:992px) 30vw, 85vw'
        });
        card.appendChild(make('h3', '', item.title));
        gallery.appendChild(card);
      });
      if (gallery.childElementCount) content.appendChild(gallery);
    }
    section.appendChild(content);
  }

  function buildRelated() {
    const section = appendBand('sector-related', '', 'sector-detail__related');
    const content = make('div', 'gk-wrap');
    appendHeading(content, 'Related hardware & products');

    const productSlugs = { agriculture: ['crop-disease-detection'] };
    const products = window.AI_PRODUCTS || [];
    const cards = make('div', 'gk-cards');
    const selected = (productSlugs[sector.slug] || [])
      .map((slug) => products.find((product) => product.slug === slug))
      .filter((product) => product && product.status !== 'demo scene only');

    selected.forEach((product) => {
      const card = make('article', 'gk-card');
      card.append(
        make('h3', '', product.name),
        make('span', 'sector-detail__status', product.status),
        make('p', '', product.summary),
        link(
          'View in AI Store',
          `../ai-store.html#${encodeURIComponent(product.category.toLowerCase())}`,
          'sector-detail__link'
        )
      );
      cards.appendChild(card);
    });

    if (sector.slug === 'agriculture') {
      const feature = window.FEATURES?.pillars?.[1];
      if (feature) {
        const card = make('article', 'gk-card');
        card.append(
          make('h3', '', 'BeejHealth'),
          make('p', '', feature.summary),
          link('Explore BeejHealth', '../beejhealth.html', 'sector-detail__link')
        );
        cards.appendChild(card);
      }
    }

    if (!cards.childElementCount) {
      content.appendChild(makeNeutralProducts());
    } else {
      content.appendChild(cards);
    }
    section.appendChild(content);
  }

  function buildCta() {
    const section = appendBand('sector-cta', '', 'sector-detail__cta-band');
    const cta = make('div', 'gk-cta');
    cta.append(
      make('span', 'gk-eyebrow', 'START A CONVERSATION'),
      make('h2', '', 'Start a conversation'),
      make('p', '', 'Tell us what you want to detect and the FrameIQ team can review your enquiry.'),
      link('Contact FrameIQ', '../contact.html', 'gk-btn')
    );
    section.appendChild(cta);
  }

  function renderNotFound() {
    root.replaceChildren();
    const section = make('section', 'gk-band');
    const content = make('div', 'gk-wrap');
    content.append(make('h1', '', 'Sector not found'), link('All sectors', '../sectors.html', 'gk-btn'));
    section.appendChild(content);
    root.appendChild(section);
  }

  if (!sector) {
    renderNotFound();
    return;
  }

  root.replaceChildren();
  buildHero();
  buildUseCases();
  buildCapabilities();
  buildRelated();
  buildCta();
  if (!root.hasAttribute('data-preserve-title')) document.title = `${sector.name} | FrameIQ`;
  root.dataset.renderedSector = requestedSlug;
})();
