(() => {
  'use strict';

  const carryover = window.LIVE_CARRYOVER;
  if (!carryover || carryover.SHOW_UNCONFIRMED !== true) return;

  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const source = (element, page) => {
    element.dataset.sourcePage = page;
    return element;
  };

  if (carryover.SHOW_REVIEW_BANNER === true) {
    const banner = make('aside', 'live-review-banner', carryover.reviewNotice);
    banner.setAttribute('role', 'status');
    banner.dataset.liveReviewBanner = '';
    document.body.prepend(banner);
  }

  function renderHome() {
    const hero = document.querySelector('.hero');
    if (hero) {
      const stats = make('section', 'live-stats-strip');
      stats.setAttribute('aria-label', 'Home statistics carried over from the current live site');
      const container = make('div', 'container live-stats-strip__grid');
      carryover.home.stats.forEach((stat) => {
        const item = source(make('article', 'live-stat'), stat.sourcePage);
        item.append(make('strong', '', stat.value), make('span', '', stat.label));
        container.append(item);
      });
      stats.append(container);
      hero.after(stats);
    }

    const proof = document.querySelector('#proof .container');
    if (proof) {
      proof.replaceChildren();
      const heading = make('div', 'section-head');
      heading.append(make('p', 'eyebrow', 'Client Results'), make('h2', '', 'Real Impact, Real Clients'), make('p', '', carryover.home.testimonialIntro.text));
      const metrics = make('div', 'live-impact-metrics');
      carryover.home.impactStats.forEach((stat) => {
        const item = source(make('article', 'live-impact-metric'), stat.sourcePage);
        item.append(make('strong', '', stat.value), make('span', '', stat.label));
        metrics.append(item);
      });
      const testimonials = make('div', 'live-testimonials');
      carryover.home.testimonials.forEach((review) => {
        const card = source(make('article', 'live-testimonial card'), review.sourcePage);
        const stars = make('div', 'live-testimonial__rating', '★'.repeat(review.rating));
        stars.setAttribute('aria-label', `${review.rating} out of 5 stars`);
        const quote = make('blockquote', '', review.quote);
        const author = make('p', 'live-testimonial__author', review.name);
        const role = make('p', 'live-testimonial__role', review.role);
        card.append(stars, quote, author, role, make('span', 'live-testimonial__sector', review.sector));
        testimonials.append(card);
      });
      proof.append(heading, metrics, testimonials);
    }

    const accordion = document.querySelector('#faq .accordion');
    if (accordion) {
      accordion.replaceChildren(...carryover.home.faq.map((faq, index) => {
        const item = source(make('div', `accordion-item${index === 0 ? ' is-open' : ''}`), faq.sourcePage);
        const trigger = make('button', 'accordion-trigger');
        trigger.type = 'button';
        trigger.setAttribute('aria-expanded', String(index === 0));
        trigger.append(make('span', '', faq.question), make('i', 'bi bi-chevron-down'));
        trigger.lastElementChild.setAttribute('aria-hidden', 'true');
        const panel = make('div', 'accordion-panel');
        if (index === 0) panel.style.maxHeight = '300px';
        panel.append(make('div', 'accordion-panel__inner', faq.answer));
        item.append(trigger, panel);
        return item;
      }));
    }
  }

  const sectorNames = new Map(carryover.sectors.names.map((sector) => [sector.slug, sector.label]));

  function applyLiveSectorNavigation() {
    const solutions = window.NAV_DATA?.groups?.Solutions;
    if (!Array.isArray(solutions)) return;
    const allSectors = solutions.find((item) => item.href === 'pages/sectors.html');
    const liveSlugs = new Set(carryover.sectors.names.map((sector) => sector.slug));
    const orderedLinks = carryover.sectors.names
      .map((sector) => solutions.find((item) => item.href === `pages/sectors/${sector.slug}.html`))
      .filter(Boolean);
    const remainingLinks = solutions.filter((item) => (
      item !== allSectors && ![...liveSlugs].some((slug) => item.href === `pages/sectors/${slug}.html`)
    ));
    window.NAV_DATA.groups.Solutions = [allSectors, ...orderedLinks, ...remainingLinks].filter(Boolean);
    window.NAV_DATA.groups.Solutions.forEach((item) => {
      const match = item.href.match(/^pages\/sectors\/([^/]+)\.html$/);
      if (match && sectorNames.has(match[1])) item.label = sectorNames.get(match[1]);
    });
    (window.NAV_DATA.footer?.solutions || []).forEach((item) => {
      const match = item.href.match(/^pages\/sectors\/([^/]+)\.html$/);
      if (match && sectorNames.has(match[1])) item.label = sectorNames.get(match[1]);
    });
  }

  function renderSectorImpact() {
    (window.SECTORS || []).forEach((sector) => {
      if (sectorNames.has(sector.slug)) sector.name = sectorNames.get(sector.slug);
      const row = document.querySelector(`#sc-industry-list #${CSS.escape(sector.slug)}`);
      const heading = row?.querySelector('h2');
      if (heading) heading.textContent = sector.name;
      const link = row?.querySelector('.sc-text-link');
      if (link) {
        link.setAttribute('aria-label', `Explore ${sector.name} solutions`);
        link.firstChild.textContent = `Explore ${sector.name} solutions `;
      }
    });
    carryover.sectors.impacts.forEach((impact) => {
      const row = document.querySelector(`#sc-industry-list #${CSS.escape(impact.slug)}`);
      const content = row?.querySelector('.sc-industry-row__content');
      if (!content) return;
      const card = source(make('section', 'live-sector-impact'), impact.sourcePage);
      card.append(make('h3', '', 'Impact'));
      const list = make('ul');
      impact.items.forEach((text) => list.append(make('li', '', text)));
      card.append(list);
      content.querySelector('.sc-text-link')?.before(card);
    });
  }

  function renderAbout() {
    const heroEyebrow = document.querySelector('.about-hero__copy .about-eyebrow');
    if (heroEyebrow) heroEyebrow.textContent = carryover.about.registrationLine.value;
    const facts = document.querySelector('#company-facts dl');
    if (facts) {
      facts.replaceChildren();
      const values = [
        ['COMPANY NAME', carryover.about.registration.entity.value],
        ['CIN NUMBER', carryover.about.registration.registrationNumber.value],
        ['CURRENT STATUS', carryover.about.registration.status.value],
        ['ENTITY TYPE', carryover.about.registration.entityType.value],
        ['INCORPORATION DATE', carryover.about.registration.incorporationDate.value],
        ['REGISTERED LOCATION', carryover.about.registration.location.value],
        ['Hours', carryover.contact.hours.value]
      ];
      values.forEach(([label, value]) => {
        const row = source(make('div'), '/about');
        row.append(make('dt', '', label), make('dd', '', value));
        facts.append(row);
      });
    }
    const valuesGrid = document.querySelector('#core-values .ab-grid');
    if (valuesGrid) {
      valuesGrid.replaceChildren(...carryover.about.values.map((value) => {
        const card = source(make('article', 'ab-card'), '/about');
        card.append(make('h3', '', value.title), make('p', '', value.description));
        return card;
      }));
    }
    const timeline = document.querySelector('#company-journey .about-timeline');
    if (timeline) {
      timeline.setAttribute('aria-label', 'Milestones carried over from the current live site');
      timeline.replaceChildren(...carryover.about.milestones.map((milestone) => {
        const item = source(make('li', 'about-timeline__item'), milestone.sourcePage);
        item.append(make('span', 'about-timeline__node'));
        item.firstElementChild.setAttribute('aria-hidden', 'true');
        const card = make('article', 'about-timeline__card card');
        card.append(make('time', '', milestone.date), make('h3', '', milestone.title), make('p', '', milestone.description));
        item.append(card);
        return item;
      }));
      const intro = document.querySelector('#company-journey .about-section__intro p:last-child');
      if (intro) intro.textContent = 'Milestones carried over from the current live site.';
    }
  }

  function renderContact() {
    document.querySelectorAll('[data-site="hours"]').forEach((node) => {
      node.textContent = carryover.contact.hours.value;
    });
    const intro = document.querySelector('.ct-hero__copy > p');
    if (intro) intro.textContent = carryover.contact.responseIntro.text;
    const infoGrid = document.querySelector('.ct-info-grid');
    if (infoGrid && !infoGrid.querySelector('[data-live-response-card]')) {
      const card = source(make('article', 'ct-info-card'), carryover.contact.responseCard.sourcePage);
      card.dataset.liveResponseCard = '';
      const icon = make('div', 'ct-info-card__icon');
      icon.setAttribute('aria-hidden', 'true');
      icon.append(make('i', 'bi bi-clock-history'));
      const body = make('div', 'ct-info-card__body');
      body.append(
        make('span', 'ct-info-card__label', 'RESPONSE TIME'),
        make('strong', 'ct-info-card__value', carryover.contact.responseCard.title),
        make('small', '', carryover.contact.responseCard.subtitle),
        make('p', '', carryover.contact.responsePromise.text)
      );
      card.append(icon, body);
      infoGrid.append(card);
    }
  }

  function renderGear() {
    const heroStats = document.querySelectorAll('.gear-stats > div');
    if (heroStats[1]) {
      heroStats[1].replaceChildren(make('strong', '', carryover.gear.heroRating.value), make('span', '', 'AVG RATING'));
    }
    const rangeFieldset = document.querySelector('#price-range')?.closest('.gear-filter-group');
    if (rangeFieldset) {
      rangeFieldset.replaceChildren(make('legend', '', 'Price range'));
      carryover.gear.priceRanges.forEach((range, index) => {
        const label = source(make('label', 'gear-check'), range.sourcePage);
        const input = make('input');
        input.type = 'radio';
        input.name = 'gear-price';
        input.value = range.label;
        input.dataset.min = String(range.min);
        input.dataset.max = range.max === null ? '' : String(range.max);
        input.checked = index === 0;
        if (index === 0) input.checked = false;
        label.append(input, make('span', '', range.label));
        rangeFieldset.append(label);
      });
    }
    const stockLabel = document.querySelector('#in-stock-only')?.closest('label')?.querySelector('span');
    if (stockLabel) stockLabel.textContent = carryover.gear.stockFilter.label;
    document.querySelector('#include-out-of-stock')?.closest('label')?.remove();
  }

  function renderSectorsAfterPageScripts() {
    renderSectorImpact();
  }

  renderHome();
  applyLiveSectorNavigation();
  renderAbout();
  renderContact();
  renderGear();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderSectorsAfterPageScripts, { once: true });
  } else {
    renderSectorsAfterPageScripts();
  }
})();
