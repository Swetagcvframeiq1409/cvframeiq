(() => {
  'use strict';

  const sectors = Array.isArray(window.SECTORS) ? window.SECTORS : [];
  function makeIcon(iconName, className = 'sc-icon') {
    const icon = document.createElement('i');
    icon.className = `${window.iconClass(iconName)} ${className}`;
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function buildGroups(sector) {
    const list = document.createElement('div');
    list.className = 'gk-cards';
    sector.groups.slice(0, 4).forEach((group) => {
      const article = document.createElement('article');
      article.className = 'gk-card';
      const heading = document.createElement('h3');
      heading.textContent = group.title;
      const items = document.createElement('ul');
      group.items.slice(0, 3).forEach((text) => {
        const item = document.createElement('li');
        if (sector.slug === 'agriculture' && text.includes('BeejHealth')) {
          const link = document.createElement('a');
          link.href = 'beejhealth.html';
          link.textContent = text;
          item.appendChild(link);
        } else {
          item.textContent = text;
        }
        items.appendChild(item);
      });
      article.append(heading, items);
      list.appendChild(article);
    });
    return list;
  }

  function buildPlaceholder(sector, loading = 'lazy') {
    const tile = document.createElement('div');
    tile.className = 'sc-image-tile photo-frame';
    tile.dataset.photo = sector.imageSlot || 'sector-smart-city';
    tile.dataset.photoLoading = loading;
    const image = document.createElement('img');
    image.hidden = true;
    image.alt = '';
    image.width = 800;
    image.height = 450;
    image.decoding = 'async';
    tile.append(image);
    return tile;
  }

  function buildSectorRow(sector, index) {
    const article = document.createElement('article');
    article.className = `gk-band${index % 2 ? ' gk-band--dark' : ''}`;
    article.id = sector.slug;
    const visual = buildPlaceholder(sector, index === 0 ? 'eager' : 'lazy');
    const content = document.createElement('div');
    content.className = 'gk-wrap';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'sc-eyebrow';
    eyebrow.append(document.createTextNode('INDUSTRY'));
    const heading = document.createElement('h2');
    heading.textContent = sector.name;
    const summary = document.createElement('p');
    summary.className = 'sc-industry-row__summary';
    summary.textContent = sector.summary;
    const useCases = document.createElement('div');
    useCases.className = 'sc-usecases';
    useCases.appendChild(buildGroups(sector));
    const link = document.createElement('a');
    link.className = 'gk-more';
    link.href = `sectors/${encodeURIComponent(sector.slug)}.html`;
    link.setAttribute('aria-label', `Explore ${sector.name} solutions`);
    link.append(document.createTextNode(`Explore ${sector.name} solutions `));
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    link.appendChild(arrow);
    content.append(eyebrow, heading, summary, useCases, link);
    article.append(visual, content);
    return article;
  }

  const strip = document.querySelector('#sc-icon-strip');
  const host = document.querySelector('#sc-industry-list');
  if (!strip || !host) return;
  host.className = 'gk-cards';
  sectors.forEach((sector) => {
    const card = document.createElement('article');
    card.className = 'gk-card';
    const icon = document.createElement('div');
    icon.className = 'gk-ic';
    icon.appendChild(makeIcon(sector.icon));
    const heading = document.createElement('h3');
    heading.textContent = sector.name;
    const summary = document.createElement('p');
    summary.textContent = sector.summary;
    const link = document.createElement('a');
    link.className = 'gk-more';
    link.href = `sectors/${encodeURIComponent(sector.slug)}.html`;
    link.textContent = 'Explore sector ↗';
    card.append(icon, heading, summary, link);
    host.appendChild(card);

    const navLink = document.createElement('a');
    navLink.className = 'sc-icon-link';
    navLink.href = `sectors/${encodeURIComponent(sector.slug)}.html`;
    const navIcon = document.createElement('span');
    navIcon.className = 'sc-icon-link__icon';
    navIcon.appendChild(makeIcon(sector.icon));
    const navLabel = document.createElement('span');
    navLabel.textContent = sector.name;
    navLink.append(navIcon, navLabel);
    strip.appendChild(navLink);
  });
  window.initPhotos?.();
})();
