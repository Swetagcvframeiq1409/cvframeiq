(() => {
  const groups = ['Pages', 'Products', 'Sectors', 'Resources'];
  let dialog;
  let input;
  let resultsHost;
  let activeResults = [];
  let activeIndex = -1;
  let lastTrigger;

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function highlight(title, query) {
    const expression = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
    let output = '';
    let cursor = 0;
    let match = expression.exec(title);
    while (match) {
      output += `${escapeHtml(title.slice(cursor, match.index))}<mark>${escapeHtml(match[0])}</mark>`;
      cursor = match.index + match[0].length;
      match = expression.exec(title);
    }
    return output + escapeHtml(title.slice(cursor));
  }

  function resolveUrl(url) {
    const root = document.body.dataset.root || '';
    const path = url.startsWith('#') ? `${root || './'}index.html${url}` : `${root || './'}${url}`;
    return new URL(path, window.location.href).href;
  }

  function rankEntry(entry, query) {
    const needle = query.toLocaleLowerCase();
    const title = entry.title.toLocaleLowerCase();
    const keywords = entry.keywords.toLocaleLowerCase();
    if (title === needle) return 0;
    if (title.startsWith(needle)) return 1;
    if (title.includes(needle)) return 2;
    return keywords.includes(needle) ? 3 : -1;
  }

  function renderResults(query) {
    const needle = query.trim();
    activeIndex = -1;
    activeResults = needle
      ? (Array.isArray(window.SEARCH_INDEX) ? window.SEARCH_INDEX : [])
        .map((entry) => ({ entry, rank: rankEntry(entry, needle) }))
        .filter((result) => result.rank >= 0)
        .sort((left, right) => left.rank - right.rank || left.entry.title.localeCompare(right.entry.title))
        .map((result) => result.entry)
      : [];

    if (!activeResults.length) {
      resultsHost.innerHTML = needle
        ? `<p class="search-empty">No results. Try a suggested link:</p><div class="search-suggestions">${[
          ['Home', 'index.html'], ['AI Store', 'pages/ai-store.html'], ['Contact', 'pages/contact.html']
        ].map(([label, url]) => `<a class="search-result" href="${resolveUrl(url)}">${label}<span>Suggested</span></a>`).join('')}</div>`
        : '<p class="search-empty">Start typing to search FrameIQ.</p>';
      return;
    }

    resultsHost.innerHTML = groups.map((group) => {
      const entries = activeResults.filter((entry) => entry.group === group);
      if (!entries.length) return '';
      return `<section class="search-group" aria-label="${group}"><h2>${group}</h2>${entries.map((entry) => `
        <a class="search-result" href="${resolveUrl(entry.url)}" data-search-result>
          <span>${highlight(entry.title, needle)}</span><span aria-hidden="true">↗</span>
        </a>
      `).join('')}</section>`;
    }).join('');
  }

  function setActive(index) {
    const results = Array.from(resultsHost.querySelectorAll('[data-search-result]'));
    if (!results.length) return;
    activeIndex = (index + results.length) % results.length;
    results.forEach((item, itemIndex) => {
      item.classList.toggle('is-active', itemIndex === activeIndex);
      item.setAttribute('aria-current', itemIndex === activeIndex ? 'true' : 'false');
    });
    results[activeIndex].scrollIntoView({ block: 'nearest' });
  }

  function openPalette(query = '', trigger = document.activeElement) {
    if (!dialog) return;
    lastTrigger = trigger instanceof HTMLElement ? trigger : null;
    if (!dialog.open) dialog.showModal();
    input.value = query;
    renderResults(query);
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }

  function closePalette() {
    if (dialog?.open) dialog.close();
  }

  function init() {
    if (dialog || !document.body) return;
    const container = document.createElement('div');
    container.innerHTML = `
      <dialog class="search-dialog" aria-label="Search FrameIQ">
        <div class="search-palette">
          <div class="search-palette__input">
            <i class="${window.iconClass('search')}" aria-hidden="true"></i>
            <input type="search" autocomplete="off" placeholder="Search pages, products and more…" aria-label="Search FrameIQ" aria-controls="search-results">
            <button type="button" class="search-palette__close" aria-label="Close search">Esc</button>
          </div>
          <div class="search-results" id="search-results" aria-live="polite"></div>
          <div class="search-palette__hints"><span>↑↓ Navigate</span><span>Enter Open</span><span>Esc Close</span></div>
        </div>
      </dialog>`;
    document.body.appendChild(container);
    dialog = container.querySelector('dialog');
    input = dialog.querySelector('input');
    resultsHost = dialog.querySelector('#search-results');
    document.addEventListener('click', (event) => {
      if (!(event.target instanceof Element)) return;
      const trigger = event.target.closest('[data-search-open]');
      if (!trigger) return;
      const sourceInput = trigger.closest('form')?.querySelector('[data-search-input]');
      openPalette(sourceInput?.value || '', trigger);
    });
    document.querySelectorAll('[data-search-input]').forEach((searchInput) => {
      searchInput.addEventListener('focus', () => openPalette(searchInput.value, searchInput));
      searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          openPalette(searchInput.value, searchInput);
        }
      });
    });
    dialog.querySelector('.search-palette__close').addEventListener('click', closePalette);
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closePalette();
    });
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closePalette();
    });
    dialog.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      closePalette();
    });
    dialog.addEventListener('close', () => lastTrigger?.focus());
    input.addEventListener('input', () => renderResults(input.value));
    input.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActive(activeIndex + 1);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActive(activeIndex < 0 ? 0 : activeIndex - 1);
      } else if (event.key === 'Enter') {
        const active = resultsHost.querySelector('.search-result.is-active') || resultsHost.querySelector('[data-search-result]');
        if (active) {
          event.preventDefault();
          window.location.href = active.href;
        }
      }
    });
    resultsHost.addEventListener('keydown', (event) => {
      if (!['ArrowDown', 'ArrowUp'].includes(event.key)) return;
      const results = Array.from(resultsHost.querySelectorAll('.search-result'));
      const current = results.indexOf(document.activeElement);
      if (current < 0) return;
      event.preventDefault();
      const next = (current + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length;
      results[next].focus();
    });
    document.addEventListener('keydown', (event) => {
      const shortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      const slashShortcut = event.key === '/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement) && !(event.target instanceof HTMLElement && event.target.isContentEditable);
      if (!shortcut && !slashShortcut) return;
      event.preventDefault();
      openPalette('', document.activeElement);
    });
  }

  window.openSearchPalette = openPalette;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
