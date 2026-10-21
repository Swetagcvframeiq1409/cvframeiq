(() => {
  'use strict';

  const allProducts = Array.isArray(window.AI_PRODUCTS) ? window.AI_PRODUCTS : [];
  const products = allProducts.filter((product) => product.status !== 'demo scene only');
  const sceneBySlug = {
    'ppe-compliance-monitor': { hash: 'ppe', label: 'PPE' },
    'pcb-inspection': { hash: 'pcb', label: 'PCB inspection' },
    'crop-disease-detection': { hash: 'crop', label: 'Crop disease' },
    'traffic-violation-detection-system': { hash: 'traffic', label: 'Traffic' }
  };
  const carryoverCategories = window.LIVE_CARRYOVER?.SHOW_UNCONFIRMED
    ? window.LIVE_CARRYOVER.aiStore.categories.map((category) => category.name)
    : [];
  const categoryOrder = carryoverCategories.length
    ? carryoverCategories.slice(1)
    : ['Safety', 'Retail', 'Traffic', 'Health', 'Industry', 'Agriculture'];
  const allCategoryLabel = carryoverCategories[0] || 'All';
  const categorySlugs = new Map(categoryOrder.map((category) => [category.toLowerCase(), category]));
  const grid = document.querySelector('#as-product-grid');
  const catalog = document.querySelector('#catalog');
  const chipsHost = document.querySelector('#as-filter-chips');
  const searchInput = document.querySelector('#as-search');
  const resultCount = document.querySelector('#as-result-count');
  const productTotal = document.querySelector('#as-product-total');
  const emptyState = document.querySelector('#as-empty');
  const dialog = document.querySelector('#as-detail-dialog');
  const dialogClose = document.querySelector('#as-dialog-close');
  const dialogTitle = document.querySelector('#as-dialog-title');
  const dialogCategory = document.querySelector('#as-dialog-category');
  const dialogSummary = document.querySelector('#as-dialog-summary');
  const dialogCapabilities = document.querySelector('#as-dialog-capabilities');
  const dialogEnquire = document.querySelector('#as-dialog-enquire');
  const playgroundLinks = document.querySelector('#as-playground-links');
  const sortSelect = document.querySelector('#as-sort');
  const compareDialog = document.querySelector('#as-compare-dialog');
  const compareContent = document.querySelector('#as-compare-content');
  const compareOpen = document.querySelector('#as-compare-open');
  const compareCount = document.querySelector('#as-compare-count');
  const compareStatus = document.querySelector('#as-compare-status');
  const compareSelection = new Set();
  const imageByCategory = {
    safety: 'sector-security',
    retail: 'sector-retail',
    traffic: 'sector-smart-city',
    health: 'sector-healthcare',
    industry: 'sector-manufacturing',
    agriculture: 'sector-agriculture'
  };

  if (!grid || !chipsHost || !searchInput || !resultCount || !emptyState || !dialog
    || !compareDialog || !compareContent || !compareOpen || !compareCount || !compareStatus) return;

  let activeCategory = 'All';
  let lastTrigger = null;
  let firstRender = true;

  function makeIcon(name) {
    const icon = document.createElement('i');
    icon.className = window.iconClass(name);
    icon.setAttribute('aria-hidden', 'true');
    return icon;
  }

  function makeButton(label, className, onClick) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.textContent = label;
    button.addEventListener('click', onClick);
    return button;
  }

  function buildChips() {
    const categoriesInData = new Set(products.map((product) => product.category).filter((category) => categorySlugs.has(String(category).toLowerCase())));
    const categories = ['All', ...categoryOrder.filter((category) => categoriesInData.has(category))];
    chipsHost.replaceChildren();

    categories.forEach((category) => {
      const label = category === 'All' ? allCategoryLabel : category;
      const chip = makeButton(label, 'as-chip', () => setCategory(category, true));
      chip.dataset.category = category;
      chip.setAttribute('aria-pressed', String(category === activeCategory));
      chipsHost.appendChild(chip);
    });
  }

  function makeCard(product) {
    const article = document.createElement('article');
    article.className = 'as-card';
    article.dataset.reveal = '';

    const media = document.createElement('div');
    media.className = 'as-card__media photo-frame';
    media.dataset.photo = imageByCategory[product.category.toLowerCase()] || 'ai-store-hero';
    media.dataset.photoLoading = 'lazy';
    const image = document.createElement('img');
    image.width = 800;
    image.height = 450;
    image.decoding = 'async';
    image.alt = '';
    image.hidden = true;
    media.append(image);

    const top = document.createElement('div');
    top.className = 'as-card__top';
    const icon = document.createElement('span');
    icon.className = 'as-card__icon';
    icon.appendChild(makeIcon(product.icon));
    const category = document.createElement('span');
    category.className = 'as-category';
    category.textContent = product.category;
    top.append(icon, category);

    const title = document.createElement('h3');
    title.textContent = product.name;
    const summary = document.createElement('p');
    summary.className = 'as-card__summary';
    summary.textContent = product.summary;

    const list = document.createElement('ul');
    list.className = 'as-card__capabilities';
    product.capabilities.slice(0, 4).forEach((capability) => {
      const item = document.createElement('li');
      item.textContent = capability;
      list.appendChild(item);
    });

    const actions = document.createElement('div');
    actions.className = 'as-card__actions';
    const detailsButton = makeButton('Quick view', 'as-button as-button--secondary', () => openDetails(product, detailsButton));
    const compareButton = makeButton(compareSelection.has(product.slug) ? 'Selected' : 'Compare', 'as-button as-button--secondary as-card__compare', () => {
      if (compareSelection.has(product.slug)) {
        compareSelection.delete(product.slug);
        compareStatus.textContent = '';
      } else if (compareSelection.size >= 3) {
        compareStatus.textContent = 'Compare up to 3 products at a time.';
      } else {
        compareSelection.add(product.slug);
        compareStatus.textContent = '';
      }
      render();
    });
    compareButton.setAttribute('aria-pressed', String(compareSelection.has(product.slug)));
    compareButton.setAttribute('aria-label', `${compareSelection.has(product.slug) ? 'Remove from' : 'Add to'} comparison: ${product.name}`);
    const enquireLink = document.createElement('a');
    enquireLink.className = 'as-button as-button--primary';
    enquireLink.href = `contact.html?product=${encodeURIComponent(product.slug)}`;
    enquireLink.textContent = 'Enquire';
    actions.append(detailsButton, compareButton, enquireLink);
    article.append(media, top, title, summary, list, actions);
    return article;
  }

  function makePlaygroundLink(product, scene) {
    const link = document.createElement('a');
    link.className = 'as-playground__link';
    link.href = `playground.html#${scene.hash}`;
    link.setAttribute('aria-label', `Try the ${scene.label} demo scene for ${product.name}`);
    const title = document.createElement('strong');
    title.textContent = scene.label;
    const action = document.createElement('span');
    action.textContent = 'Try the demo scene';
    const copy = document.createElement('span');
    copy.className = 'as-playground__link-copy';
    copy.append(title, action);
    const arrow = document.createElement('span');
    arrow.className = 'as-playground__link-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '→';
    link.append(copy, arrow);
    return link;
  }

  function renderPlaygroundLinks() {
    if (!playgroundLinks) return;
    playgroundLinks.replaceChildren();
    allProducts.forEach((product) => {
      const scene = sceneBySlug[product.slug];
      if (scene) playgroundLinks.appendChild(makePlaygroundLink(product, scene));
    });
  }

  function matches(product, query) {
    if (!query) return true;
    const searchable = [product.name, product.summary, ...product.capabilities].join(' ').toLowerCase();
    return searchable.includes(query);
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    const matchingProducts = products.filter((product) => (
      (activeCategory === 'All' || product.category === activeCategory) && matches(product, query)
    ));
    if (sortSelect?.value === 'name-asc') matchingProducts.sort((first, second) => first.name.localeCompare(second.name));
    if (sortSelect?.value === 'name-desc') matchingProducts.sort((first, second) => second.name.localeCompare(first.name));
    grid.replaceChildren(...matchingProducts.map(makeCard));
    grid.classList.toggle('is-list', document.querySelector('[data-as-view="list"]')?.getAttribute('aria-pressed') === 'true');
    window.initPhotos?.(grid);
    grid.setAttribute('aria-busy', 'false');
    resultCount.textContent = `Showing ${matchingProducts.length} of ${products.length} products`;
    compareCount.textContent = String(compareSelection.size);
    compareOpen.disabled = compareSelection.size < 2;
    emptyState.hidden = matchingProducts.length > 0;

    window.requestAnimationFrame(() => {
      grid.querySelectorAll('.as-card').forEach((card) => card.classList.add('is-visible'));
      if (firstRender) {
        firstRender = false;
        const hashCategory = categorySlugs.get(window.location.hash.slice(1).toLowerCase());
        if (hashCategory && catalog) {
          window.requestAnimationFrame(() => {
            catalog.scrollIntoView({
              behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
              block: 'start'
            });
          });
        }

      }
    });
  }

  function openComparison() {
    const selected = products.filter((product) => compareSelection.has(product.slug));
    if (selected.length < 2) return;

    const table = document.createElement('table');
    table.className = 'as-compare-table';
    const head = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Product', ...selected.map((product) => product.name)].forEach((label) => {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      headerRow.appendChild(cell);
    });
    head.appendChild(headerRow);
    const body = document.createElement('tbody');
    const rows = [
      ['Category', (product) => product.category],
      ['Summary', (product) => product.summary],
      ['Capabilities', (product) => product.capabilities.join('; ')]
    ];
    rows.forEach(([label, valueFor]) => {
      const row = document.createElement('tr');
      const heading = document.createElement('th');
      heading.scope = 'row';
      heading.textContent = label;
      row.appendChild(heading);
      selected.forEach((product) => {
        const cell = document.createElement('td');
        cell.textContent = valueFor(product);
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
    const enquiryRow = document.createElement('tr');
    const enquiryHeading = document.createElement('th');
    enquiryHeading.scope = 'row';
    enquiryHeading.textContent = 'Enquiry';
    enquiryRow.appendChild(enquiryHeading);
    selected.forEach((product) => {
      const cell = document.createElement('td');
      const link = document.createElement('a');
      link.href = `contact.html?product=${encodeURIComponent(product.slug)}`;
      link.textContent = 'Enquire';
      cell.appendChild(link);
      enquiryRow.appendChild(cell);
    });
    body.appendChild(enquiryRow);
    table.append(head, body);
    compareContent.replaceChildren(table);
    compareDialog.showModal();
  }

  function setCategory(category, updateHash, shouldRender = true) {
    activeCategory = category;
    chipsHost.querySelectorAll('.as-chip').forEach((chip) => {
      const isActive = chip.dataset.category === activeCategory;
      chip.setAttribute('aria-pressed', String(isActive));
    });
    if (updateHash) {
      const hash = category === 'All' ? '' : `#${category.toLowerCase()}`;
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
    }
    if (shouldRender) render();
  }

  function syncSearchUrl() {
    const url = new URL(window.location.href);
    const query = searchInput.value.trim();
    if (query) url.searchParams.set('q', query);
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function applyHashFilter(shouldRender = true) {
    const slug = window.location.hash.slice(1).toLowerCase();
    setCategory(categorySlugs.get(slug) || 'All', false, shouldRender);
  }

  function openDetails(product, trigger) {
    lastTrigger = trigger;
    dialogTitle.textContent = product.name;
    dialogCategory.textContent = product.category;
    dialogSummary.textContent = product.summary;
    dialogCapabilities.replaceChildren();
    product.capabilities.slice(0, 4).forEach((capability) => {
      const item = document.createElement('li');
      item.textContent = capability;
      dialogCapabilities.appendChild(item);
    });
    dialogEnquire.href = `contact.html?product=${encodeURIComponent(product.slug)}`;
    dialog.showModal();
    dialogClose.focus();
    document.body.classList.add('as-dialog-open');
  }

  function closeDetails() {
    if (dialog.open) dialog.close();
  }

  function handleDialogKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDetails();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialog.querySelectorAll('a[href], button:not([disabled])'))
      .filter((element) => element.getClientRects().length > 0);
    if (!focusable.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  searchInput.addEventListener('input', () => {
    syncSearchUrl();
    render();
  });
  sortSelect?.addEventListener('change', render);
  document.querySelectorAll('[data-as-view]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-as-view]').forEach((item) => {
        item.setAttribute('aria-pressed', String(item === button));
      });
      render();
    });
  });
  compareOpen?.addEventListener('click', openComparison);
  document.querySelector('#as-compare-close')?.addEventListener('click', () => compareDialog.close());
  compareDialog?.querySelectorAll('[data-compare-close]').forEach((button) => button.addEventListener('click', () => compareDialog.close()));
  document.querySelector('#as-clear-empty')?.addEventListener('click', () => {
    searchInput.value = '';
    setCategory('All', true);
    searchInput.focus();
  });
  dialogClose?.addEventListener('click', closeDetails);
  dialog.querySelectorAll('[data-close-dialog]').forEach((button) => button.addEventListener('click', closeDetails));
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) closeDetails();
  });
  dialog.addEventListener('keydown', handleDialogKeydown);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDetails();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('as-dialog-open');
    lastTrigger?.focus();
    lastTrigger = null;
  });
  window.addEventListener('hashchange', applyHashFilter);
  window.addEventListener('popstate', () => {
    searchInput.value = new URLSearchParams(window.location.search).get('q') || '';
    syncSearchUrl();
    applyHashFilter();
  });

  productTotal.textContent = `${products.length} products`;
  searchInput.value = new URLSearchParams(window.location.search).get('q') || '';
  buildChips();
  renderPlaygroundLinks();
  applyHashFilter(false);
  window.setTimeout(render, 180);
})();
