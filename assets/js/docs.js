(() => {
  'use strict';
  const root = document.querySelector('#rs-docs');
  const groups = window.NAV_DATA?.groups || {};
  if (!root) return;
  const href = (value) => value.startsWith('http') ? value : `../${value}`;
  const make = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const index = document.querySelector('#rsd-index');
  const allRows = [];
  Object.entries(groups).forEach(([groupName, items], groupIndex) => {
    const card = make('article', 'rs-card rsd-card rs-reveal');
    card.appendChild(make('h3', '', groupName));
    const rows = make('div', 'rsd-rows');
    (items || []).forEach((item, itemIndex) => {
      const link = make('a', 'rsd-doc-row');
      link.href = href(item.href);
      link.dataset.cat = 'All';
      link.dataset.search = `${groupName} ${item.label} ${item.description || ''}`.toLowerCase();
      link.append(make('span', 'rsd-row-label', item.label), make('span', 'rs-status', 'Docs draft'));
      rows.appendChild(link);
      allRows.push(link);
    });
    card.appendChild(rows);
    index.appendChild(card);
  });
  const search = document.querySelector('#rsd-search');
  const empty = document.querySelector('#rsd-empty');
  const count = document.querySelector('#rsd-count');
  RS.filterList({
    root,
    chipSelector: '.rsd-filter',
    itemSelector: '.rsd-doc-row',
    searchInput: search,
    emptyEl: empty,
    countFormatter: (visible) => `${visible} documentation topics`,
    onRender: () => document.querySelectorAll('.rsd-card').forEach((card) => {
      card.hidden = ![...card.querySelectorAll('.rsd-doc-row')].some((row) => !row.hidden);
    })
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) { event.preventDefault(); search.focus(); }
  });
  const firstItem = Object.values(groups).flat()[0];
  document.querySelector('#rsd-preview-title').textContent = firstItem?.label || 'Documentation';
  document.querySelectorAll('.rsd-copy').forEach((button) => button.addEventListener('click', async () => {
    const codeEl = button.closest('pre')?.querySelector('code');
    const text = codeEl ? codeEl.textContent : 'Draft — pending content';
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = make('textarea', '', text);
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        if (!document.execCommand('copy')) throw new Error('Clipboard copy was not available.');
        area.remove();
      }
      button.textContent = 'Copied';
      window.setTimeout(() => { button.textContent = 'Copy'; }, 1500);
    } catch (error) {
      console.error('Documentation copy failed.', error);
      button.textContent = 'Copy unavailable';
    }
  }));
  const sidebar = document.querySelector('#rsd-sidebar');
  Object.keys(groups).forEach((groupName, index) => {
    const target = document.querySelector(`#rsd-section-${index + 1}`);
    const link = make('a', index === 0 ? 'is-active' : '', groupName);
    link.href = `#rsd-section-${index + 1}`;
    sidebar.appendChild(link);
    if (target) target.dataset.rsdTarget = '';
  });
  RS.scrollSpy({ links: sidebar.querySelectorAll('a'), targets: document.querySelectorAll('[data-rsd-target]') });
  RS.reveal();
})();
