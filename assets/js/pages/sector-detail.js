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
    // Use sector icon as fallback icon so it's never a bare camera
    const fallbackIcon = `bi-${sector.icon || 'camera-video'}`;
    media.innerHTML = window.FIQ.img(name, Object.assign({ icon: fallbackIcon }, options || {}));
    const image = media.querySelector('img');
    if (image) {
      image.setAttribute('loading', options && options.priority ? 'eager' : 'lazy');
      image.setAttribute('decoding', 'async');
      image.addEventListener('error', () => {
        media.innerHTML = window.FIQ.img('', { alt: image.alt || 'Sector visual', icon: fallbackIcon });
      }, { once: true });
    }
    parent.appendChild(media);
    return media;
  }

  function makeNeutralProducts() {
    // Returns null — no real content yet, so the section is hidden entirely
    return null;
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
    // Only render groups that have real items
    const realGroups = groups.filter((group) => Array.isArray(group.items) && group.items.length > 0);
    if (!realGroups.length) return;
    const section = appendBand('sector-use-cases', '', 'sector-detail__use-cases');
    const content = make('div', 'gk-wrap');
    appendHeading(content, 'Use cases to discuss');
    const cards = make('div', 'gk-cards gk-cards--four');
    realGroups.forEach((group) => {
      const card = make('article', 'gk-card');
      card.appendChild(make('h3', '', group.title));
      const list = make('ul');
      group.items.forEach((item) => list.appendChild(make('li', '', item)));
      card.appendChild(list);
      cards.appendChild(card);
    });
    content.appendChild(cards);
    section.appendChild(content);
  }

  function buildCapabilities() {
    const feature = Number.isInteger(sector.capabilityIndex) ? window.FEATURES?.pillars?.[sector.capabilityIndex] : null;
    // Only render if we have either a feature description or a helps image
    if (!feature && !sector.media?.helps) return;
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

    // Only render the section when there is real content
    if (!cards.childElementCount) return;

    const section = appendBand('sector-related', '', 'sector-detail__related');
    const content = make('div', 'gk-wrap');
    appendHeading(content, 'Related hardware & products');
    content.appendChild(cards);
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
