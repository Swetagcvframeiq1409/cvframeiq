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
    list.className = 'sc-group-grid';
    sector.groups.slice(0, 4).forEach((group) => {
      const article = document.createElement('article');
      article.className = 'sc-group-card';
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
    article.className = `sc-industry-row${index % 2 ? ' sc-industry-row--reverse' : ''}`;
    article.id = sector.slug;
    const visual = buildPlaceholder(sector, index === 0 ? 'eager' : 'lazy');
    const content = document.createElement('div');
    content.className = 'sc-industry-row__content';
    const eyebrow = document.createElement('p');
    eyebrow.className = 'sc-eyebrow';
    const dot = document.createElement('span');
    dot.setAttribute('aria-hidden', 'true');
    eyebrow.append(dot, document.createTextNode(' INDUSTRY'));
    const heading = document.createElement('h2');
    heading.textContent = sector.name;
    const summary = document.createElement('p');
    summary.className = 'sc-industry-row__summary';
    summary.textContent = sector.summary;
    const useCases = document.createElement('div');
    useCases.className = 'sc-usecases';
    useCases.appendChild(buildGroups(sector));
    const link = document.createElement('a');
    link.className = 'sc-text-link';
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
  const list = document.querySelector('#sc-industry-list');
  if (!strip || !list) return;

  sectors.forEach((sector) => {
    const link = document.createElement('a');
    link.className = 'sc-icon-link';
    link.href = `#${encodeURIComponent(sector.slug)}`;
    link.setAttribute('aria-label', `Jump to ${sector.name}`);
    const icon = document.createElement('span');
    icon.className = 'sc-icon-link__icon';
    icon.appendChild(makeIcon(sector.icon));
    const label = document.createElement('span');
    label.textContent = sector.name;
    link.append(icon, label);
    strip.appendChild(link);
    list.appendChild(buildSectorRow(sector, list.children.length));
  });
  window.initPhotos?.();
})();
