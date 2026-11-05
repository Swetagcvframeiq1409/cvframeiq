(() => {
  'use strict';

  const root = document.querySelector('#sx-root');
  if (!root || !root.dataset.sector) return;

  const entries = Object.entries(window.SECTOR_UI || {}).sort((left, right) => left[1].order - right[1].order);
  const requestedSlug = root.dataset.sector || '';
  const match = entries.find(([slug, ui]) => slug === requestedSlug || ui.sourceSlug === requestedSlug);
  const sector = match
    ? (window.SECTORS || []).find((item) => item.slug === match[1].sourceSlug)
    : null;

  function node(tag, className, text) {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (text !== undefined) result.textContent = text;
    return result;
  }

  function icon(className, extraClass = '') {
    const result = node('i', `${className}${extraClass ? ` ${extraClass}` : ''}`);
    result.setAttribute('aria-hidden', 'true');
    return result;
  }

  function wrap(parent, className = 'sx-wrap') {
    const result = node('div', className);
    parent.appendChild(result);
    return result;
  }

  function band(id, tone, className = '') {
    const result = node('section', `sx-band ${className}`.trim());
    result.id = id;
    result.dataset.tone = tone;
    root.appendChild(result);
    return result;
  }

  function heading(parent, eyebrow, title, description) {
    const header = node('header', 'sx-section-heading');
    if (eyebrow) header.appendChild(node('p', 'sx-eyebrow', eyebrow));
    const titleNode = node('h2', '', title);
    header.appendChild(titleNode);
    if (description) header.appendChild(node('p', 'sx-section-heading__lede', description));
    parent.appendChild(header);
    return titleNode;
  }

  function addReveal(element, delay = 0) {
    element.dataset.sxReveal = '';
    if (delay) element.style.setProperty('--sx-delay', `${delay}ms`);
    return element;
  }

  function pendingCard() {
    return node('p', 'sx-pending sx-muted', 'Draft — pending content');
  }

  function addIconChip(parent, ui) {
    const chip = node('span', 'sx-icon-chip');
    chip.style.setProperty('--sx-tint', ui.tint);
    chip.appendChild(icon(`bi ${ui.icon}`));
    parent.appendChild(chip);
  }

  function titleWithEmphasis(name) {
    const title = node('h1', '');
    const split = name.lastIndexOf(' ');
    if (split < 0) {
      const emphasized = node('em', '', name);
      title.appendChild(emphasized);
      return title;
    }
    title.append(document.createTextNode(`${name.slice(0, split)} `));
    title.appendChild(node('em', '', name.slice(split + 1)));
    return title;
  }

  function buildHero(ui) {
    const section = band('sx-hero', ui.heroTone, 'sx-hero');
    const content = wrap(section, 'sx-wrap sx-hero__layout');
    const copy = node('div', 'sx-hero__copy');
    const breadcrumb = node('nav', 'sx-breadcrumb');
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    const home = node('a', '', 'Home');
    home.href = '../../index.html';
    const sectorsLink = node('a', '', 'Sectors');
    sectorsLink.href = '../sectors.html';
    breadcrumb.append(home, document.createTextNode(' / '), sectorsLink, document.createTextNode(` / ${sector.name}`));
    copy.appendChild(breadcrumb);
    copy.appendChild(node('p', 'sx-eyebrow', 'INDUSTRY'));
    const title = ui.signature === 'healthcare-medical'
      ? (() => {
        const healthcareTitle = node('h1', '');
        healthcareTitle.appendChild(node('em', '', 'Healthcare'));
        healthcareTitle.appendChild(document.createTextNode(' & Medical'));
        return healthcareTitle;
      })()
      : ui.signature === 'events-entertainment'
        ? (() => {
          const eventsTitle = node('h1', '');
          eventsTitle.appendChild(document.createTextNode('Events & '));
          eventsTitle.appendChild(node('em', '', 'Entertainment'));
          return eventsTitle;
        })()
      : ui.signature === 'manufacturing'
        ? (() => {
          const manufacturingTitle = node('h1', '');
          manufacturingTitle.appendChild(node('em', '', 'Manufacturing'));
          return manufacturingTitle;
        })()
      : ui.signature === 'agriculture'
        ? (() => {
          const agricultureTitle = node('h1', '');
          agricultureTitle.appendChild(node('em', '', 'Agriculture'));
          return agricultureTitle;
        })()
      : titleWithEmphasis(sector.name);
    if (ui.signature === 'aviation') title.appendChild(document.createTextNode(' Use Cases'));
    copy.appendChild(title);
    copy.appendChild(node('p', 'sx-hero__lede', sector.summary));
    const actions = node('div', 'sx-actions');
    const bankingFinance = ui.signature === 'banking-finance';
    const aviation = ui.signature === 'aviation';
    const enquiry = bankingFinance || aviation;
    const primary = node('a', 'sx-button sx-button--primary', enquiry ? 'Enquire' : 'Book a Demo');
    primary.href = '../../pages/contact.html';
    if (enquiry) {
      primary.href += `?sector=${encodeURIComponent(sector.slug)}`;
      primary.setAttribute('aria-label', `Enquire about ${sector.name}`);
    }
    if (aviation) primary.appendChild(icon('bi bi-arrow-right'));
    const secondary = node('a', 'sx-button sx-button--secondary', 'All sectors');
    secondary.href = '../sectors.html';
    actions.append(primary, secondary);
    copy.appendChild(actions);

    const panel = node('div', 'sx-hero__panel');
    panel.setAttribute('role', 'group');
    panel.setAttribute('aria-label', `${sector.name} capabilities`);
    if (aviation) {
      const cardGrid = node('div', 'sx-aviation-hero__cards');
      panel.classList.add('sx-aviation-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      const capabilities = [
        { icon: 'bi-airplane', label: sector.groups[2]?.title },
        { icon: 'bi-person-badge', label: sector.groups[0]?.title },
        { icon: 'bi-luggage', label: sector.groups[1]?.title },
        { icon: 'bi-camera-video', label: sector.groups[3]?.title },
        { icon: 'bi-eye', label: sector.groups[0]?.items[1] }
      ];
      capabilities.filter((item) => item.label).forEach((item) => {
        const card = node('div', 'sx-aviation-hero__card');
        card.append(icon(`bi ${item.icon}`), node('span', '', item.label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    const infrastructure = ui.signature === 'infrastructure';
    if (infrastructure) {
      const cardGrid = node('div', 'sx-aviation-hero__cards');
      panel.classList.add('sx-aviation-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      const capabilities = [
        { icon: 'bi-stoplights', label: sector.groups[0]?.title },
        { icon: 'bi-cone-striped', label: sector.groups[1]?.title },
        { icon: 'bi-people', label: sector.groups[2]?.title },
        { icon: 'bi-camera-video', label: sector.groups[3]?.title },
        { icon: 'bi-exclamation-triangle', label: sector.groups[3]?.items[0] }
      ];
      capabilities.filter((item) => item.label).forEach((item) => {
        const card = node('div', 'sx-aviation-hero__card');
        card.append(icon(`bi ${item.icon}`), node('span', '', item.label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    if (bankingFinance) {
      const cardGrid = node('div', 'sx-banking-hero__cards');
      panel.classList.add('sx-banking-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      const capabilities = [
        { icon: 'bi-bank', label: sector.groups[2]?.title },
        { icon: 'bi-shield-lock', label: sector.groups[0]?.title },
        { icon: 'bi-person-vcard', label: sector.groups[1]?.title },
        { icon: 'bi-credit-card', label: sector.groups[3]?.title },
        { icon: 'bi-camera-video', label: sector.groups[0]?.items[0] }
      ];
      capabilities.filter((item) => item.label).forEach((item) => {
        const card = node('div', 'sx-banking-hero__card');
        card.append(icon(`bi ${item.icon}`), node('span', '', item.label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    if (ui.signature === 'security-surveillance') {
      const cardGrid = node('div', 'sx-security-hero__cards');
      panel.classList.add('sx-security-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      const capabilities = [
        { icon: 'bi-camera-video', label: sector.groups[0]?.title },
        { icon: 'bi-person-bounding-box', label: sector.groups[1]?.title },
        { icon: 'bi-bell', label: sector.groups[2]?.title },
        { icon: 'bi-shield-check', label: sector.groups[3]?.title },
        { icon: 'bi-eye', label: sector.groups[0]?.items[1] }
      ];
      capabilities.filter((item) => item.label).forEach((item) => {
        const card = node('div', 'sx-security-hero__card');
        card.append(icon(`bi ${item.icon}`), node('span', '', item.label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    if (ui.signature === 'healthcare-medical') {
      const cardGrid = node('div', 'sx-healthcare-hero__cards');
      panel.classList.add('sx-healthcare-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      [
        ['bi-heart-pulse', sector.groups[0]?.title],
        ['bi-hospital', sector.groups[1]?.title],
        ['bi-person-check', sector.groups[2]?.title],
        ['bi-camera-video', sector.groups[3]?.title],
        ['bi-shield-lock', sector.groups[0]?.items[2]]
      ].filter((item) => item[1]).forEach(([iconName, label]) => {
        const card = node('div', 'sx-healthcare-hero__card');
        card.append(icon(`bi ${iconName}`), node('span', '', label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    if (ui.signature === 'events-entertainment') {
      const cardGrid = node('div', 'sx-events-hero__cards');
      panel.classList.add('sx-events-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      [
        ['bi-ticket-perforated', sector.groups[0]?.title],
        ['bi-people', sector.groups[1]?.title],
        ['bi-music-note-beamed', sector.groups[2]?.title],
        ['bi-camera-video', sector.groups[3]?.title],
        ['bi-door-open', sector.groups[0]?.items[0]]
      ].filter((item) => item[1]).forEach(([iconName, label]) => {
        const card = node('div', 'sx-events-hero__card');
        card.append(icon(`bi ${iconName}`), node('span', '', label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    if (ui.signature === 'manufacturing') {
      const cardGrid = node('div', 'sx-manufacturing-hero__cards');
      panel.classList.add('sx-manufacturing-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      [
        ['bi-gear-wide-connected', sector.groups[0]?.title],
        ['bi-cpu', sector.groups[1]?.title],
        ['bi-search', sector.groups[3]?.title],
        ['bi-camera-video', sector.groups[2]?.title],
        ['bi-check2-circle', sector.groups[3]?.items[1]]
      ].filter((item) => item[1]).forEach(([iconName, label]) => {
        const card = node('div', 'sx-manufacturing-hero__card');
        card.append(icon(`bi ${iconName}`), node('span', '', label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    if (ui.signature === 'agriculture') {
      const cardGrid = node('div', 'sx-agriculture-hero__cards');
      panel.classList.add('sx-agriculture-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      [
        ['bi-flower1', sector.groups[0]?.title],
        ['bi-tree', sector.groups[1]?.title],
        ['bi-sun', sector.groups[2]?.title],
        ['bi-camera-video', sector.groups[3]?.title],
        ['bi-bug', sector.groups[0]?.items[0]]
      ].filter((item) => item[1]).forEach(([iconName, label]) => {
        const card = node('div', 'sx-agriculture-hero__card');
        card.append(icon(`bi ${iconName}`), node('span', '', label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    if (ui.signature === 'retail') {
      const cardGrid = node('div', 'sx-retail-hero__cards');
      panel.classList.add('sx-retail-hero__panel');
      panel.style.setProperty('--sx-tint', ui.tint);
      [
        ['bi-shop', sector.groups[0]?.title],
        ['bi-cart3', sector.groups[1]?.title],
        ['bi-people', sector.groups[2]?.title],
        ['bi-camera-video', sector.groups[3]?.title],
        ['bi-box-seam', sector.groups[1]?.items[0]]
      ].filter((item) => item[1]).forEach(([iconName, label]) => {
        const card = node('div', 'sx-retail-hero__card');
        card.append(icon(`bi ${iconName}`), node('span', '', label));
        cardGrid.appendChild(card);
      });
      panel.appendChild(cardGrid);
      content.append(copy, panel);
      return;
    }
    const panelMark = node('div', 'sx-hero__mark');
    addIconChip(panelMark, ui);
    panel.appendChild(panelMark);
    const labels = node('ul', 'sx-hero__labels');
    sector.groups.slice(0, 3).forEach((group) => labels.appendChild(node('li', '', group.title)));
    panel.appendChild(labels);
    content.append(copy, panel);
  }

  function buildSubnav(ui) {
    const section = band('sx-subnav', 'light', 'sx-subnav-band');
    const nav = node('nav', 'sx-subnav');
    nav.dataset.sxSubnav = '';
    nav.setAttribute('aria-label', 'Explore sectors');
    const chips = node('div', 'sx-subnav__chips');
    const all = node('a', 'sx-subnav__chip', 'All sectors');
    all.href = '../sectors.html';
    chips.appendChild(all);
    let activeChip = null;
    entries.forEach(([slug, item]) => {
      const data = (window.SECTORS || []).find((value) => value.slug === item.sourceSlug);
      if (!data) return;
      const chip = node('a', `sx-subnav__chip${item === ui ? ' is-active' : ''}`, data.name);
      chip.href = item === ui ? '#sx-hero' : item.href;
      if (item === ui) {
        chip.setAttribute('aria-current', 'location');
        activeChip = chip;
      }
      chips.appendChild(chip);
    });
    const progressTrack = node('span', 'sx-subnav__progress');
    progressTrack.setAttribute('aria-hidden', 'true');
    progressTrack.appendChild(node('span', 'sx-subnav__progress-fill'));
    nav.append(chips, progressTrack);
    section.appendChild(nav);
    if (activeChip) {
      const alignActiveChip = () => {
        const maximum = chips.scrollWidth - chips.clientWidth;
        const target = activeChip.offsetLeft - (chips.clientWidth - activeChip.offsetWidth) / 2;
        chips.scrollLeft = Math.max(0, Math.min(maximum, target));
      };
      alignActiveChip();
      if (ui.signature === 'aviation') window.addEventListener('resize', alignActiveChip);
    }
  }

  function buildProof() {
    const section = band('sx-proof', 'light', 'sx-proof');
    const content = wrap(section);
    heading(content, 'VISUAL USE CASES', 'Explore visual use cases');
    const labels = [...new Set(sector.groups.map((group) => group.title))];
    if (!labels.length) {
      content.appendChild(pendingCard());
      return;
    }
    const marquee = node('div', 'sx-marquee');
    marquee.setAttribute('role', 'group');
    marquee.setAttribute('aria-label', `${sector.name} visual use cases`);
    const rail = node('div', 'sx-marquee__rail');
    const track = node('div', 'sx-marquee__track');
    labels.forEach((label) => track.appendChild(node('span', 'sx-marquee__item', label)));
    const clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.classList.add('sx-marquee__track--clone');
    rail.append(track, clone);
    marquee.appendChild(rail);
    content.appendChild(marquee);
  }

  function buildChallenges() {
    const section = band('sx-challenges', 'light', 'sx-challenges');
    const content = wrap(section);
    heading(content, 'OPERATING CONTEXT', 'Challenges we solve');
    const grid = node('div', 'sx-challenge-grid');
    const challengeIcons = [
      'bi-shield-exclamation', 'bi-eye-slash', 'bi-diagram-3', 'bi-camera-video-off',
      'bi-exclamation-triangle', 'bi-clock-history'
    ];
    sector.groups.slice(0, 6).forEach((group, index) => {
      const card = addReveal(node('article', 'sx-card sx-challenge-card'), index * 60);
      const iconBox = node('span', 'sx-icon-chip');
      iconBox.style.setProperty('--sx-tint', match[1].tint);
      iconBox.appendChild(icon(`bi ${challengeIcons[index] || 'bi-eye'}`));
      card.append(iconBox, node('h3', '', group.title), node('p', '', group.items[0] || ''));
      grid.appendChild(card);
    });
    content.appendChild(grid);
  }

  function buildSolutions() {
    const section = band('sx-solutions', 'dark', 'sx-solutions');
    const content = wrap(section, 'sx-wrap sx-split');
    const title = node('div', 'sx-split__title');
    heading(title, 'SECTOR USE CASES', 'What we build');
    const list = node('ol', 'sx-solution-list');
    let order = 0;
    sector.groups.forEach((group) => {
      group.items.forEach((item, itemIndex) => {
        order += 1;
        const row = addReveal(node('li', 'sx-solution-row'), Math.min(order - 1, 8) * 60);
        const number = node('span', 'sx-solution-row__number', String(order).padStart(2, '0'));
        const text = node('span', 'sx-solution-row__copy');
        if (itemIndex === 0) text.append(node('strong', '', group.title));
        text.append(node('span', '', item));
        row.append(number, text, icon('bi bi-arrow-up-right', 'sx-solution-row__arrow'));
        list.appendChild(row);
      });
    });
    if (!order) list.appendChild(pendingCard());
    content.append(title, list);
  }

  function sig_banking_finance(ui) {
    const section = band('sx-signature', ui.heroTone, 'sx-signature sx-sig--banking-finance');
    const content = wrap(section);
    const groups = sector.groups;
    heading(content, groups[3]?.title.toUpperCase() || '', groups[3]?.title || sector.name);

    const layout = node('div', 'sx-sig-banking__layout');
    const list = node('ol', 'sx-sig-banking__points');
    const detail = node('aside', 'sx-sig-banking__detail');
    detail.setAttribute('aria-label', groups[3]?.title || sector.name);
    detail.setAttribute('aria-live', 'polite');
    const detailTitle = node('h3', 'sx-sig-banking__detail-title');
    const detailItems = node('ul', 'sx-sig-banking__detail-items');
    detail.append(detailTitle, detailItems);

    const icons = ['bi-shield-lock', 'bi-person-vcard', 'bi-bank', 'bi-credit-card'];
    const setActive = (group) => {
      detailTitle.textContent = group.title;
      detailItems.replaceChildren(...group.items.map((item) => node('li', '', item)));
      list.querySelectorAll('[data-sx-sig-point]').forEach((point) => {
        point.classList.toggle('is-active', point.dataset.sxSigPoint === group.title);
      });
    };

    groups.forEach((group, index) => {
      const point = node('li', 'sx-sig-banking__point');
      point.dataset.sxSigPoint = group.title;
      const iconChip = node('span', 'sx-icon-chip');
      iconChip.style.setProperty('--sx-tint', ui.tint);
      iconChip.appendChild(icon(`bi ${icons[index] || 'bi-bank'}`));
      const copy = node('div', 'sx-sig-banking__point-copy');
      copy.append(node('h3', '', group.title), node('p', '', group.items[0] || ''));
      const status = node('span', 'sx-sig-banking__status', sector.status === 'draft' ? 'Draft' : sector.status);
      point.append(iconChip, copy, status);
      list.appendChild(point);
    });

    if (groups.length) {
      setActive(groups[0]);
      if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((observations) => {
          const visible = observations
            .filter((observation) => observation.isIntersecting)
            .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
          const activePoint = visible[0]?.target;
          const activeGroup = groups.find((group) => group.title === activePoint?.dataset.sxSigPoint);
          if (activeGroup) setActive(activeGroup);
        }, { rootMargin: '-32% 0px -52% 0px', threshold: 0 });
        list.querySelectorAll('[data-sx-sig-point]').forEach((point) => observer.observe(point));
      } else {
        const updateActive = () => {
          const marker = window.innerHeight * 0.4;
          const activePoint = [...list.querySelectorAll('[data-sx-sig-point]')]
            .filter((point) => point.getBoundingClientRect().top <= marker)
            .pop();
          const activeGroup = groups.find((group) => group.title === activePoint?.dataset.sxSigPoint);
          if (activeGroup) setActive(activeGroup);
        };
        window.addEventListener('scroll', updateActive, { passive: true });
        updateActive();
      }
    }

    layout.append(list, detail);
    content.appendChild(layout);
  }

  function sig_aviation(ui) {
    const section = band('sx-signature', ui.heroTone, 'sx-signature sx-sig--aviation');
    const content = wrap(section);
    const pin = node('div', 'sx-aviation__pin');
    heading(pin, 'USE CASES', 'Use cases to discuss');
    const timeline = node('div', 'sx-aviation__timeline');
    timeline.setAttribute('role', 'group');
    timeline.setAttribute('aria-label', `${sector.name} use cases`);
    const progress = node('div', 'sx-aviation__progress');
    progress.setAttribute('aria-hidden', 'true');
    progress.appendChild(node('span', 'sx-aviation__progress-fill'));
    const viewport = node('div', 'sx-aviation__viewport');
    const track = node('ol', 'sx-aviation__track');
    const stages = [sector.groups[3], sector.groups[0], sector.groups[1], sector.groups[2]].filter(Boolean);

    stages.forEach((group, index) => {
      const stage = node('li', 'sx-aviation__stage');
      stage.dataset.sxAviationStage = String(index);
      const indexLabel = node('span', 'sx-aviation__stage-index', String(index + 1).padStart(2, '0'));
      const title = node('h3', '', group.title);
      const status = node('span', 'sx-aviation__stage-status', sector.status === 'draft' ? 'Draft' : sector.status);
      const items = node('ul', 'sx-aviation__stage-items');
      group.items.forEach((item) => items.appendChild(node('li', '', item)));
      stage.append(indexLabel, title, status, items);
      track.appendChild(stage);
    });

    viewport.appendChild(track);
    timeline.append(progress, viewport);
    pin.appendChild(timeline);
    content.appendChild(pin);

    const mediaQuery = window.matchMedia('(max-width: 900px), (prefers-reduced-motion: reduce)');
    const updateTimeline = () => {
      const horizontal = !mediaQuery.matches;
      const stageNodes = [...track.querySelectorAll('[data-sx-aviation-stage]')];
      if (!stageNodes.length) return;

      let activeIndex = 0;
      if (horizontal) {
        const sidePadding = Math.max(0, (viewport.clientWidth - stageNodes[0].offsetWidth) / 2);
        track.style.paddingInline = `${sidePadding}px`;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const pinHeight = pin.getBoundingClientRect().height;
        const stickyTop = Number.parseFloat(getComputedStyle(pin).top) || 0;
        const scrollRange = Math.max(1, section.offsetHeight - pinHeight);
        const progressValue = Math.min(1, Math.max(0, (window.scrollY - sectionTop + stickyTop) / scrollRange));
        const stagePositions = stageNodes.map((stage) => stage.offsetLeft - (viewport.clientWidth - stage.offsetWidth) / 2);
        const scaledIndex = progressValue * (stageNodes.length - 1);
        const lowerIndex = Math.floor(scaledIndex);
        const upperIndex = Math.min(stageNodes.length - 1, lowerIndex + 1);
        const fraction = scaledIndex - lowerIndex;
        const offset = stagePositions[lowerIndex] + ((stagePositions[upperIndex] - stagePositions[lowerIndex]) * fraction);
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
        progress.querySelector('.sx-aviation__progress-fill').style.transform = `scaleX(${progressValue})`;
        activeIndex = Math.round(scaledIndex);
      } else {
        track.style.paddingInline = '';
        track.style.transform = '';
        progress.querySelector('.sx-aviation__progress-fill').style.transform = '';
        const marker = window.innerHeight * 0.42;
        const visibleStage = stageNodes
          .filter((stage) => stage.getBoundingClientRect().top <= marker)
          .pop();
        if (visibleStage) activeIndex = Number(visibleStage.dataset.sxAviationStage);
      }

      stageNodes.forEach((stage, index) => {
        stage.classList.toggle('is-active', index === activeIndex);
        if (index === activeIndex) stage.setAttribute('aria-current', 'step');
        else stage.removeAttribute('aria-current');
      });
    };

    let frame = 0;
    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateTimeline();
      });
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    mediaQuery.addEventListener?.('change', scheduleUpdate);
    updateTimeline();
  }

  function sig_infrastructure(ui) {
    const section = band('sx-signature', 'dark', 'sx-signature sx-sig--infrastructure');
    section.style.setProperty('--sx-tint', ui.tint);
    const content = wrap(section);
    heading(content, 'SITE ZONES', 'Infrastructure monitoring zones');

    const zones = [
      { icon: 'bi-stoplights', label: 'Traffic' },
      { icon: 'bi-cone-striped', label: 'Infrastructure' },
      { icon: 'bi-people', label: 'Public Spaces' },
      { icon: 'bi-exclamation-triangle', label: 'Emergency' },
      { icon: 'bi-camera-video', label: 'Camera Views' },
      { icon: 'bi-hdd-network', label: 'Edge Nodes' },
      { icon: 'bi-diagram-3', label: 'Workflows' },
      { icon: 'bi-eye', label: 'Visual Review' },
      { icon: 'bi-shield-check', label: 'Safety' }
    ];

    const grid = node('div', 'sx-infra-zones');
    grid.setAttribute('aria-label', 'Infrastructure monitoring zones');
    zones.forEach((zone, index) => {
      const tile = node('div', 'sx-infra-zone');
      tile.dataset.sxZoneIndex = String(index);
      const chip = node('span', 'sx-icon-chip sx-infra-zone__icon');
      chip.style.setProperty('--sx-tint', ui.tint);
      chip.appendChild(icon(`bi ${zone.icon}`));
      const label = node('span', 'sx-infra-zone__label', zone.label);
      const detection = node('span', 'sx-infra-zone__chip', 'Active');
      tile.append(chip, label, detection);
      grid.appendChild(tile);
    });
    content.appendChild(grid);

    // Animate tiles in sequence on first view
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const tiles = Array.from(grid.querySelectorAll('.sx-infra-zone'));
      const observer = new IntersectionObserver((entries, obs) => {
        if (!entries.some(e => e.isIntersecting)) return;
        obs.disconnect();
        tiles.forEach((tile, i) => {
          window.setTimeout(() => tile.classList.add('is-lit'), i * 80);
        });
      }, { threshold: 0.2 });
      observer.observe(grid);
    } else {
      grid.querySelectorAll('.sx-infra-zone').forEach(t => t.classList.add('is-lit'));
    }
  }

  function sig_security_surveillance(ui) {
    const section = band('sx-signature', ui.heroTone, 'sx-signature sx-sig--security-surveillance');
    section.style.setProperty('--sx-tint', ui.tint);
    const content = wrap(section);
    heading(content, 'LIVE WALL', 'See the signals worth reviewing');
    const wall = node('div', 'sx-security-wall');
    wall.setAttribute('role', 'group');
    wall.setAttribute('aria-label', `${sector.name} camera monitor wall`);
    const icons = ['bi-camera-video', 'bi-person-bounding-box', 'bi-bell', 'bi-shield-check', 'bi-eye', 'bi-camera-video'];
    const tiles = sector.groups.flatMap((group, groupIndex) => (
      group.items.slice(0, 2).map((item, itemIndex) => ({
        camera: `${group.title} ${itemIndex + 1}`,
        detection: item,
        icon: icons[groupIndex * 2 + itemIndex] || 'bi-camera-video'
      }))
    )).slice(0, 6);

    tiles.forEach((tile, index) => {
      const card = node('article', 'sx-security-wall__tile');
      card.style.setProperty('--sx-tile-delay', `${index * 2.4}s`);
      card.append(
        icon(`bi ${tile.icon}`, 'sx-security-wall__camera'),
        node('h3', '', tile.camera),
        node('span', 'sx-security-wall__detection', tile.detection)
      );
      wall.appendChild(card);
    });
    content.appendChild(wall);

    const detections = node('div', 'sx-marquee');
    detections.setAttribute('role', 'group');
    detections.setAttribute('aria-label', 'Security and surveillance detection types');
    const rail = node('div', 'sx-marquee__rail');
    const track = node('div', 'sx-marquee__track');
    [...new Set(sector.groups.flatMap((group) => group.items))].forEach((item) => {
      track.appendChild(node('span', 'sx-marquee__item', item));
    });
    rail.appendChild(track);
    detections.appendChild(rail);
    content.appendChild(detections);
  }

  function sig_healthcare_medical(ui) {
    const section = band('sx-signature', ui.heroTone, 'sx-signature sx-sig--healthcare-medical');
    section.style.setProperty('--sx-tint', ui.tint);
    const content = wrap(section);
    heading(content, 'CARE FLOOR', 'Review the settings that matter');
    const layout = node('div', 'sx-healthcare-floor');
    const list = node('div', 'sx-healthcare-floor__settings');
    const detail = node('aside', 'sx-healthcare-floor__detail');
    detail.setAttribute('aria-live', 'polite');
    const detailTitle = node('h3', '');
    const detailItems = node('ul', '');
    detail.append(detailTitle, detailItems);
    const settings = sector.groups;
    const setActive = (group) => {
      detailTitle.textContent = group.title;
      detailItems.replaceChildren(...group.items.map((item) => node('li', '', item)));
      list.querySelectorAll('[data-sx-care-setting]').forEach((row) => {
        row.classList.toggle('is-active', row.dataset.sxCareSetting === group.title);
      });
    };
    settings.forEach((group, index) => {
      const button = node('button', `sx-healthcare-floor__setting${index === 0 ? ' is-active' : ''}`, group.title);
      button.type = 'button';
      button.dataset.sxCareSetting = group.title;
      button.appendChild(icon('bi bi-arrow-right'));
      button.addEventListener('click', () => setActive(group));
      list.appendChild(button);
    });
    if (settings.length) setActive(settings[0]);
    layout.append(list, detail);
    content.appendChild(layout);
    const privacy = sector.groups[2]?.items.find((item) => /privacy/i.test(item));
    if (privacy) {
      const callout = node('aside', 'sx-healthcare-floor__privacy');
      callout.append(icon('bi bi-shield-lock'), node('p', '', privacy));
      content.appendChild(callout);
    }
  }

  function sig_events_entertainment(ui) {
    const section = band('sx-signature', ui.heroTone, 'sx-signature sx-sig--events-entertainment');
    section.style.setProperty('--sx-tint', ui.tint);
    const content = wrap(section);
    heading(content, 'CROWD FLOW', 'Follow the flow through the venue');
    const strip = node('ol', 'sx-events-flow');
    strip.setAttribute('aria-label', `${sector.name} crowd flow stages`);
    sector.groups.forEach((group, index) => {
      const stage = node('li', `sx-events-flow__stage${index === 0 ? ' is-active' : ''}`);
      stage.append(
        node('span', 'sx-events-flow__number', String(index + 1).padStart(2, '0')),
        node('h3', '', group.title),
        node('p', '', group.items[0] || '')
      );
      strip.appendChild(stage);
    });
    content.appendChild(strip);
    const stages = [...strip.querySelectorAll('.sx-events-flow__stage')];
    const setActive = (stage) => {
      stages.forEach((candidate) => candidate.classList.toggle('is-active', candidate === stage));
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((observations) => {
        const visible = observations
          .filter((observation) => observation.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target);
      }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
      stages.forEach((stage) => observer.observe(stage));
    }
  }

  function sig_manufacturing(ui) {
    const section = band('sx-signature', ui.heroTone, 'sx-signature sx-sig--manufacturing');
    section.style.setProperty('--sx-tint', ui.tint);
    const content = wrap(section);
    heading(content, 'INSPECTION LINE', 'Move from input to inspection');
    const line = node('ol', 'sx-manufacturing-line');
    const stations = [
      { icon: 'bi-box-arrow-in-down', title: sector.groups[0]?.title, text: sector.groups[0]?.items[0] },
      { icon: 'bi-gear-wide-connected', title: sector.groups[1]?.title, text: sector.groups[1]?.items[0] },
      { icon: 'bi-search', title: sector.groups[3]?.title, text: sector.groups[3]?.items[0] },
      { icon: 'bi-truck', title: sector.groups[2]?.title, text: sector.groups[2]?.items[0] }
    ].filter((station) => station.title && station.text);
    stations.forEach((station, index) => {
      const item = node('li', `sx-manufacturing-line__station${index === 2 ? ' is-inspection' : ''}`);
      item.append(icon(`bi ${station.icon}`), node('span', 'sx-manufacturing-line__number', String(index + 1).padStart(2, '0')), node('h3', '', station.title), node('p', '', station.text));
      line.appendChild(item);
      if (index < stations.length - 1) line.appendChild(icon('bi bi-arrow-right', 'sx-manufacturing-line__connector'));
    });
    content.appendChild(line);
    const pcb = (window.AI_PRODUCTS || []).find((product) => product.slug === 'pcb-inspection');
    if (pcb) {
      const link = node('a', 'sx-manufacturing-pcb', '');
      link.href = '../../pages/playground.html#pcb';
      link.append(node('span', 'sx-eyebrow', 'RELATED SCENE'), node('strong', '', pcb.name), icon('bi bi-arrow-up-right'));
      content.appendChild(link);
    }
  }

  function sig_agriculture(ui) {
    const section = band('sx-signature', ui.heroTone, 'sx-signature sx-sig--agriculture');
    section.style.setProperty('--sx-tint', ui.tint);
    const content = wrap(section);
    heading(content, 'FIELD TO MARKET', 'Follow the crop story');
    const layout = node('div', 'sx-agriculture-stepper');
    const rail = node('div', 'sx-agriculture-stepper__rail');
    const fill = node('span', 'sx-agriculture-stepper__fill');
    rail.appendChild(fill);
    const list = node('ol', 'sx-agriculture-stepper__list');
    const stages = sector.groups;
    stages.forEach((group, index) => {
      const item = node('li', `sx-agriculture-stepper__stage${index === 0 ? ' is-active' : ''}`);
      addReveal(item, index * 60);
      item.append(
        node('span', 'sx-agriculture-stepper__number', String(index + 1).padStart(2, '0')),
        node('h3', '', group.title),
        node('p', '', group.items[0] || '')
      );
      list.appendChild(item);
    });
    layout.append(rail, list);
    content.appendChild(layout);
    const stageNodes = [...list.querySelectorAll('.sx-agriculture-stepper__stage')];
    const setActive = (index) => {
      stageNodes.forEach((stage, stageIndex) => stage.classList.toggle('is-active', stageIndex === index));
      fill.style.transform = `scaleY(${stageNodes.length > 1 ? index / (stageNodes.length - 1) : 1})`;
    };
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((observations) => {
        const visible = observations
          .filter((observation) => observation.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top);
        const active = visible[0]?.target;
        if (active) setActive(stageNodes.indexOf(active));
      }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
      stageNodes.forEach((stage) => observer.observe(stage));
    }
  }

  function sig_retail(ui) {
      const section = band('sx-signature', ui.heroTone, 'sx-signature sx-sig--retail');
      section.style.setProperty('--sx-tint', ui.tint);
      const content = wrap(section);
      heading(content, 'STORE JOURNEY', 'Review the moments that matter');
      const tabs = node('div', 'sx-tabs sx-retail-tabs');
      tabs.dataset.sxTabs = '';
      const tablist = node('div', 'sx-tabs__list');
      tablist.setAttribute('role', 'tablist');
      const panels = node('div', 'sx-tabs__panels');
      const zoneIcons = ['bi-door-open', 'bi-grid-3x3-gap', 'bi-box-seam', 'bi-cart3'];
      sector.groups.forEach((group, index) => {
        const panelId = `sx-retail-panel-${index + 1}`;
        const tab = node('button', 'sx-tabs__tab', group.title);
        tab.type = 'button';
        tab.id = `sx-retail-tab-${index + 1}`;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panelId);
        tab.setAttribute('aria-selected', String(index === 0));
        tab.tabIndex = index === 0 ? 0 : -1;
        const panel = node('div', 'sx-tabs__panel sx-retail-panel');
        panel.id = panelId;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.hidden = index !== 0;
        const detects = node('div', 'sx-retail-panel__copy');
        detects.appendChild(node('h3', '', 'What FrameIQ detects'));
        const list = node('ul', 'sx-retail-panel__list');
        group.items.forEach((item) => list.appendChild(node('li', '', item)));
        detects.appendChild(list);
        const zone = node('div', 'sx-retail-zone', '');
        zone.setAttribute('aria-hidden', 'true');
        zone.append(icon(`bi ${zoneIcons[index] || 'bi-camera-video'}`), icon('bi-camera-video'), icon('bi-people'));
        panel.append(detects, zone);
        tablist.appendChild(tab);
        panels.appendChild(panel);
      });
      tabs.append(tablist, panels);
      content.appendChild(tabs);
  }

  function buildSignature(ui) {
    if (ui.signature === 'banking-finance') {
      sig_banking_finance(ui);
      return;
    }
    if (ui.signature === 'aviation') {
      sig_aviation(ui);
      return;
    }
    if (ui.signature === 'infrastructure') {
      sig_infrastructure(ui);
      return;
    }
    if (ui.signature === 'security-surveillance') {
      sig_security_surveillance(ui);
      return;
    }
    if (ui.signature === 'healthcare-medical') {
      sig_healthcare_medical(ui);
      return;
    }
    if (ui.signature === 'events-entertainment') {
      sig_events_entertainment(ui);
      return;
    }
    if (ui.signature === 'manufacturing') {
      sig_manufacturing(ui);
      return;
    }
    if (ui.signature === 'agriculture') {
      sig_agriculture(ui);
      return;
    }
    if (ui.signature === 'retail') {
      sig_retail(ui);
      return;
    }
    const section = band('sx-signature', ui.heroTone, 'sx-signature');
    section.hidden = true;
    const placeholder = node('div', 'sx-sig--pending sx-muted', 'Draft — pending content');
    placeholder.hidden = true;
    section.appendChild(placeholder);
  }

  function buildProcess() {
    const section = band('sx-process', 'light', 'sx-process');
    const content = wrap(section);
    heading(content, 'HOW WE WORK', 'How FrameIQ works');
    const steps = window.COMPANY_PAGE_DATA?.process || [];
    if (!steps.length) {
      content.appendChild(pendingCard());
      return;
    }
    const list = node('ol', 'sx-process__list');
    steps.forEach((step, index) => {
      const item = addReveal(node('li', 'sx-process__step'), index * 60);
      item.append(node('span', 'sx-process__number', String(index + 1).padStart(2, '0')), node('h3', '', step.title), node('p', '', step.description));
      list.appendChild(item);
    });
    content.appendChild(list);
  }

  function buildOutcomes() {
    const section = band('sx-outcomes', 'dark', 'sx-outcomes');
    const content = wrap(section);
    heading(content, 'VISUAL REVIEW', 'What teams can review');
    const list = node('ul', 'sx-outcomes__list');
    sector.groups.forEach((group) => {
      group.items.slice(1).forEach((item) => list.appendChild(node('li', '', item)));
    });
    if (!list.childElementCount) {
      content.appendChild(pendingCard());
      return;
    }
    content.appendChild(list);
  }

  function buildStack(ui) {
    const aviation = ui.signature === 'aviation';
    const categories = new Set(sector.relatedCategories || []);
    const products = (window.AI_PRODUCTS || []).filter((product) => categories.has(product.category));
    const feature = Number.isInteger(ui.featureIndex) ? window.FEATURES?.pillars?.[ui.featureIndex] : null;
    const collections = [];
    if (products.length) collections.push({ label: 'AI Store', items: products.map((product) => ({ title: product.name, text: product.summary })) });
    if (feature) collections.push({ label: feature.title, items: (feature.useCases || []).map((text) => ({ title: text, text })) });
    if (!collections.some((collection) => collection.items.length)) return;
    const section = band('sx-stack', 'light', 'sx-stack');
    const content = wrap(section);
    heading(content, aviation ? 'AI STORE' : 'RELATED CAPABILITIES', aviation ? 'Related AI Store products' : 'Explore related capabilities');

    if (collections.length > 1) {
      const tabs = node('div', 'sx-tabs');
      tabs.dataset.sxTabs = '';
      const tablist = node('div', 'sx-tabs__list');
      tablist.setAttribute('role', 'tablist');
      const panelHost = node('div', 'sx-tabs__panels');
      collections.forEach((collection, index) => {
        const panelId = `sx-stack-panel-${index + 1}`;
        const tab = node('button', 'sx-tabs__tab', collection.label);
        tab.type = 'button';
        tab.id = `sx-stack-tab-${index + 1}`;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panelId);
        tab.setAttribute('aria-selected', String(index === 0));
        tab.tabIndex = index === 0 ? 0 : -1;
        const panel = node('div', 'sx-tabs__panel');
        panel.id = panelId;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
        panel.hidden = index !== 0;
        collection.items.forEach((item) => {
          panel.appendChild(node('p', 'sx-stack-item', item.text));
        });
        tablist.appendChild(tab);
        panelHost.appendChild(panel);
      });
      tabs.append(tablist, panelHost);
      content.appendChild(tabs);
      return;
    }

    if (collections.length === 1) {
      const list = node('ul', 'sx-stack__list');
      collections[0].items.forEach((item) => {
        const entry = node('li', '', '');
        if (aviation) {
          const product = products.find((candidate) => candidate.name === item.title);
          const title = node('strong', 'sx-aviation__product-name', item.title);
          const link = node('a', 'sx-aviation__product-link', 'View product');
          link.href = `../../pages/ai-store.html#${encodeURIComponent(product?.category.toLowerCase() || '')}`;
          link.appendChild(icon('bi bi-arrow-up-right'));
          entry.append(title, link);
        } else {
          entry.textContent = item.title;
        }
        list.appendChild(entry);
      });
      content.appendChild(list);
      return;
    }
  }

  function buildFaq() {
    const validFaqs = (window.FAQ_DATA || []).filter((item) => (
      /industr|sector|go live|deployment/i.test(item.question) &&
      item.answer &&
      !/^\[placeholder/i.test(item.answer)
    ));
    if (!validFaqs.length) return;
    const section = band('sx-faq', 'dark', 'sx-faq');
    const content = wrap(section);
    heading(content, 'COMMON QUESTIONS', 'Frequently asked questions');
    const accordion = node('div', 'sx-accordion');
    accordion.dataset.sxAccordion = '';
    validFaqs.forEach((item, index) => {
      const entry = node('article', `sx-accordion__item${index === 0 ? ' is-open' : ''}`);
      const button = node('button', 'sx-accordion__button', item.question);
      const panelId = `sx-faq-answer-${index + 1}`;
      button.type = 'button';
      button.dataset.sxAccordionButton = '';
      button.setAttribute('aria-expanded', String(index === 0));
      button.setAttribute('aria-controls', panelId);
      button.appendChild(icon('bi bi-plus'));
      const panel = node('div', 'sx-accordion__panel');
      panel.id = panelId;
      panel.setAttribute('aria-hidden', String(index !== 0));
      panel.appendChild(node('p', '', item.answer));
      entry.append(button, panel);
      accordion.appendChild(entry);
    });
    content.appendChild(accordion);
  }

  function buildOthers(ui) {
    const section = band('sx-others', 'light', 'sx-others');
    const content = wrap(section);
    const aviation = ui.signature === 'aviation';
    heading(content, aviation ? 'EXPLORE SECTORS' : 'EXPLORE MORE', aviation ? 'Other sectors' : 'Explore other sectors');
    const list = node('div', 'sx-others__list');
    entries.filter(([, item]) => item !== ui).forEach(([, item]) => {
      const other = (window.SECTORS || []).find((sectorItem) => sectorItem.slug === item.sourceSlug);
      if (!other) return;
      const link = node('a', 'sx-other-card', '');
      link.href = item.href;
      link.style.setProperty('--sx-tint', item.tint);
      addIconChip(link, item);
      link.append(node('span', '', other.name), icon('bi bi-arrow-up-right'));
      list.appendChild(link);
    });
    content.appendChild(list);
  }

  function buildCta() {
    const section = band('sx-cta', 'light', 'sx-cta');
    const content = wrap(section, 'sx-wrap sx-cta__inner');
    const copy = node('div', 'sx-cta__copy');
    copy.append(node('p', 'sx-eyebrow', 'START A CONVERSATION'), node('h2', '', "Don't see your industry?"));
    copy.appendChild(node('p', '', 'Tell us what you want to detect and the FrameIQ team can review your enquiry.'));
    const bankingFinance = match[1].signature === 'banking-finance';
    const aviation = match[1].signature === 'aviation';
    const action = node('a', 'sx-button sx-button--primary', bankingFinance || aviation ? 'Start a project' : 'Book a Demo');
    action.href = '../../pages/contact.html';
    if (bankingFinance || aviation) {
      action.appendChild(icon('bi bi-arrow-right'));
    }
    const actions = node('div', 'sx-cta__actions');
    actions.appendChild(action);
    if (bankingFinance || aviation) {
      const store = node('a', 'sx-button sx-button--secondary', 'Browse AI Store');
      store.href = '../../pages/ai-store.html';
      store.appendChild(icon('bi bi-arrow-right'));
      actions.appendChild(store);
    }
    const contact = node('div', 'sx-cta__contact');
    const phone = window.SITE_CONTACT?.phone;
    const phoneHref = window.SITE_CONTACT?.phoneHref;
    const email = window.SITE_CONTACT?.email;
    if (phone && phoneHref) {
      const phoneLink = node('a', '', phone);
      phoneLink.href = phoneHref;
      contact.appendChild(phoneLink);
    }
    if (email) {
      const emailLink = node('a', '', email);
      emailLink.href = `mailto:${email}`;
      contact.appendChild(emailLink);
    }
    content.append(copy, actions, contact);
    if (bankingFinance || aviation) {
      const existingCta = node('div', `sx-sig-banking__existing-cta${aviation ? ' sx-aviation__existing-cta' : ''}`);
      existingCta.append(
        node('p', 'sx-eyebrow', aviation ? 'Talk to us' : 'TALK TO US'),
        node('h3', '', 'Start a conversation'),
        node('p', '', 'Tell us about your use case and the FrameIQ team can review your enquiry.')
      );
      const contactLink = node('a', 'sx-button sx-button--secondary', 'Contact FrameIQ');
      contactLink.href = '../../pages/contact.html';
      existingCta.appendChild(contactLink);
      content.appendChild(existingCta);
    }
  }

  function renderNotFound() {
    root.replaceChildren();
    const section = node('section', 'sx-band sx-band--light sx-not-found');
    section.dataset.tone = 'light';
    const content = wrap(section);
    content.appendChild(node('h1', '', 'Sector not found'));
    content.appendChild(pendingCard());
    root.appendChild(section);
  }

  if (!match || !sector) {
    renderNotFound();
    return;
  }

  buildHero(match[1]);
  buildSubnav(match[1]);
  buildProof();
  buildChallenges();
  buildSolutions();
  buildSignature(match[1]);
  buildProcess();
  buildOutcomes();
  buildStack(match[1]);
  buildFaq();
  buildOthers(match[1]);
  buildCta();

  if (!root.hasAttribute('data-preserve-title')) document.title = `${sector.name} | FrameIQ`;
  window.SECTOR_KIT?.initReveal();
  window.SECTOR_KIT?.initCounters();
  window.SECTOR_KIT?.initMarquee();
  window.SECTOR_KIT?.initAccordion();
  window.SECTOR_KIT?.initTabs();
  window.SECTOR_KIT?.initSubnav();
})();
