(() => {
  'use strict';

  const allProducts = Array.isArray(window.AI_PRODUCTS) ? window.AI_PRODUCTS : [];
  const products = allProducts.filter(p => p.status !== 'demo scene only');

  const sceneBySlug = {
    'ppe-compliance-monitor':            { hash: 'ppe',     label: 'PPE' },
    'pcb-inspection':                    { hash: 'pcb',     label: 'PCB inspection' },
    'crop-disease-detection':            { hash: 'crop',    label: 'Crop disease' },
    'traffic-violation-detection-system':{ hash: 'traffic', label: 'Traffic' }
  };

  const categoryOrder = ['Safety','Retail','Traffic','Health','Industry','Agriculture'];
  const categorySlugs = new Map(categoryOrder.map(c => [c.toLowerCase(), c]));

  // Icon map per product icon key
  const iconMap = {
    traffic:    'cone-striped',
    shield:     'shield-check',
    retail:     'shop',
    inspection: 'tools',
    health:     'heart-pulse',
    agriculture:'leaf',
    circuit:    'cpu'
  };

  // Sector icon map
  const sectorIconMap = {
    bank:       'bank',
    airplane:   'airplane',
    hospital:   'hospital',
    factory:    'tools',
    security:   'shield-check',
    city:       'buildings',
    retail:     'shop',
    agriculture:'leaf',
    ticket:     'ticket'
  };

  const grid          = document.querySelector('#ais-product-grid');
  const chipsHost     = document.querySelector('#ais-filter-chips');
  const searchInput   = document.querySelector('#ais-search');
  const resultCount   = document.querySelector('#ais-result-count');
  const productTotal  = document.querySelector('#ais-product-total');
  const emptyState    = document.querySelector('#ais-empty');
  const dialog        = document.querySelector('#ais-detail-dialog');
  const dialogClose   = document.querySelector('#ais-dialog-close');
  const dialogTitle   = document.querySelector('#ais-dialog-title');
  const dialogCat     = document.querySelector('#ais-dialog-category');
  const dialogSummary = document.querySelector('#ais-dialog-summary');
  const dialogCaps    = document.querySelector('#ais-dialog-capabilities');
  const dialogEnquire = document.querySelector('#ais-dialog-enquire');
  const playgroundLinks = document.querySelector('#ais-playground-links');
  const sortSelect    = document.querySelector('#ais-sort');
  const compareDialog = document.querySelector('#ais-compare-dialog');
  const compareContent= document.querySelector('#ais-compare-content');
  const compareOpen   = document.querySelector('#ais-compare-open');
  const compareCount  = document.querySelector('#ais-compare-count');
  const compareStatus = document.querySelector('#ais-compare-status');
  const tray          = document.querySelector('#ais-tray');
  const trayCount     = document.querySelector('#ais-tray-count');
  const sectorsGrid   = document.querySelector('#ais-sectors-grid');

  if (!grid || !chipsHost || !searchInput || !resultCount || !emptyState || !dialog) return;

  const compareSelection = new Set();
  let activeCategory = 'All';
  let lastTrigger = null;
  let firstRender = true;

  // ── Reveal system ──────────────────────────────────────────────
  function initReveal() {
    const items = document.querySelectorAll('.ais-reveal');
    if (!items.length) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('ais-motion-enabled');
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    items.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) { el.classList.add('is-visible'); return; }
    });
    const obs = new IntersectionObserver((entries, o) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        o.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    items.forEach(el => {
      if (!el.classList.contains('is-visible')) {
        obs.observe(el);
        setTimeout(() => { el.classList.add('is-visible'); obs.unobserve(el); }, 1200);
      }
    });
  }

  // ── Sectors grid ───────────────────────────────────────────────
  function buildSectors() {
    if (!sectorsGrid || !Array.isArray(window.SECTORS)) return;
    const sectors = window.SECTORS.filter(s => s.status !== 'hidden');
    sectorsGrid.replaceChildren();
    sectors.forEach(sector => {
      const iconClass = sectorIconMap[sector.icon] || 'building-gear';
      const a = document.createElement('a');
      a.className = 'ais-sector-card ais-reveal';
      a.href = `sectors/${sector.slug}.html`;
      a.innerHTML = `
        <span class="ais-sector-icon" aria-hidden="true"><i class="bi bi-${iconClass}"></i></span>
        <span class="ais-sector-copy">
          <strong>${sector.name}</strong>
          <span>${sector.summary.slice(0, 60).replace(/\.$/, '')}...</span>
        </span>
        <i class="bi bi-arrow-right ais-sector-arrow" aria-hidden="true"></i>`;
      sectorsGrid.appendChild(a);
    });
    // Re-observe new elements
    initReveal();
  }

  // ── Filter chips ───────────────────────────────────────────────
  function buildChips() {
    const inData = new Set(products.map(p => p.category).filter(c => categorySlugs.has(c.toLowerCase())));
    const cats = ['All', ...categoryOrder.filter(c => inData.has(c))];
    chipsHost.replaceChildren();
    cats.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ais-chip';
      btn.textContent = cat;
      btn.dataset.category = cat;
      btn.dataset.aisCategory = cat;
      btn.setAttribute('aria-pressed', String(cat === activeCategory));
      btn.addEventListener('click', () => setCategory(cat, true));
      chipsHost.appendChild(btn);
    });
  }

  // Card builder ───────────────────────────────────────────────
  function makeCard(product, idx) {
    const article = document.createElement('article');
    article.className = 'ais-card';
    article.dataset.category = (product.category || '').toLowerCase();
    article.style.transitionDelay = `${(idx % 9) * 60}ms`;

    // Thumbnail — try product image, fall back to category image, then icon
    const thumb = document.createElement('div');
    thumb.className = 'ais-card-thumb';
    thumb.dataset.category = (product.category || '').toLowerCase();
    const iconName = iconMap[product.icon] || 'camera-video';
    const catSlug = product.category.toLowerCase();
    const imgEl = document.createElement('img');
    imgEl.src = `../assets/img/products/store-${catSlug}.webp`;
    imgEl.alt = `${product.category} category illustration`;
    imgEl.width = 400;
    imgEl.height = 250;
    imgEl.loading = 'lazy';
    imgEl.className = 'ais-card-thumb-img';
    const thumbIcon = document.createElement('i');
    thumbIcon.className = `bi bi-${iconName} ais-card-thumb-icon`;
    thumbIcon.setAttribute('aria-hidden', 'true');
    imgEl.addEventListener('error', () => {
      imgEl.style.display = 'none';
      thumbIcon.style.display = '';
    });
    imgEl.addEventListener('load', () => {
      thumbIcon.style.display = 'none';
    });
    thumb.appendChild(imgEl);
    thumb.appendChild(thumbIcon);

    // Body
    const body = document.createElement('div');
    body.className = 'ais-card-body';

    // Category chip with icon
    const cat = document.createElement('span');
    cat.className = 'ais-card-cat';
    cat.innerHTML = `<i class="bi bi-${iconName}" aria-hidden="true"></i>${product.category}`;

    // Title
    const title = document.createElement('h3');
    title.textContent = product.name;

    // Description with read-more toggle
    const desc = document.createElement('p');
    desc.className = 'ais-card-desc';
    desc.textContent = product.summary;
    if (product.summary && product.summary.length > 90) {
      desc.title = product.summary;
    }

    const readMore = document.createElement('button');
    readMore.type = 'button';
    readMore.className = 'ais-read-more';
    readMore.textContent = 'Read more';
    readMore.setAttribute('aria-expanded', 'false');
    readMore.addEventListener('click', () => {
      const expanded = desc.classList.toggle('is-expanded');
      readMore.textContent = expanded ? 'Read less' : 'Read more';
      readMore.setAttribute('aria-expanded', String(expanded));
    });

    // Bullets — first 3 only
    const list = document.createElement('ul');
    list.className = 'ais-card-caps';
    product.capabilities.slice(0, 3).forEach(cap => {
      const li = document.createElement('li');
      li.textContent = cap;
      list.appendChild(li);
    });

    // Actions: Enquire (primary), View (secondary), Compare (icon-only)
    const actions = document.createElement('div');
    actions.className = 'ais-card-actions';

    const enquireLink = document.createElement('a');
    enquireLink.className = 'ais-btn ais-btn--primary';
    enquireLink.href = `contact.html?product=${encodeURIComponent(product.slug)}`;
    enquireLink.innerHTML = `Enquire <i class="bi bi-arrow-right" aria-hidden="true"></i>`;

    const viewBtn = document.createElement('button');
    viewBtn.type = 'button';
    viewBtn.className = 'ais-btn ais-btn--secondary';
    viewBtn.textContent = 'View';
    viewBtn.addEventListener('click', () => openDetails(product, viewBtn));

    const compareBtn = document.createElement('button');
    compareBtn.type = 'button';
    compareBtn.className = 'ais-btn ais-btn--icon';
    compareBtn.setAttribute('aria-label', `Add to comparison: ${product.name}`);
    compareBtn.setAttribute('aria-pressed', String(compareSelection.has(product.slug)));
    compareBtn.dataset.aisCompare = '';
    compareBtn.innerHTML = `<i class="bi bi-arrow-left-right" aria-hidden="true"></i>`;
    if (compareSelection.has(product.slug)) {
      compareBtn.setAttribute('aria-pressed', 'true');
      compareBtn.setAttribute('aria-label', `Remove from comparison: ${product.name}`);
    }
    compareBtn.addEventListener('click', () => {
      if (compareSelection.has(product.slug)) {
        compareSelection.delete(product.slug);
        compareStatus.textContent = '';
      } else if (compareSelection.size >= 3) {
        compareStatus.textContent = 'Compare up to 3 products at a time.';
        return;
      } else {
        compareSelection.add(product.slug);
        compareStatus.textContent = '';
      }
      render();
    });

    actions.append(enquireLink, viewBtn, compareBtn);
    body.append(cat, title, desc, readMore, list, actions);
    article.append(thumb, body);
    return article;
  }

  // ── Playground links ───────────────────────────────────────────
  function renderPlaygroundLinks() {
    if (!playgroundLinks) return;
    playgroundLinks.replaceChildren();
    allProducts.forEach(product => {
      const scene = sceneBySlug[product.slug];
      if (!scene) return;
      const a = document.createElement('a');
      a.className = 'ais-demo-link';
      a.href = `playground.html#${scene.hash}`;
      a.setAttribute('aria-label', `Try the ${scene.label} demo scene for ${product.name}`);
      a.innerHTML = `
        <span class="ais-demo-link-copy">
          <strong>${scene.label}</strong>
          <span>Try the demo scene</span>
        </span>
        <i class="bi bi-arrow-right" aria-hidden="true"></i>`;
      playgroundLinks.appendChild(a);
    });
  }

  // ── Render ─────────────────────────────────────────────────────
  function matches(product, query) {
    if (!query) return true;
    return [product.name, product.summary, ...product.capabilities].join(' ').toLowerCase().includes(query);
  }

  function render() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = products.filter(p =>
      (activeCategory === 'All' || p.category === activeCategory) && matches(p, query)
    );
    if (sortSelect?.value === 'name-asc') visible.sort((a,b) => a.name.localeCompare(b.name));
    if (sortSelect?.value === 'name-desc') visible.sort((a,b) => b.name.localeCompare(a.name));

    // Fade out, swap, fade in
    grid.style.opacity = '0';
    grid.style.transition = 'opacity .15s ease';
    setTimeout(() => {
      grid.replaceChildren(...visible.map((p, i) => makeCard(p, i)));
      grid.classList.toggle('is-list', document.querySelector('[data-ais-view="list"][aria-pressed="true"]') !== null);
      grid.setAttribute('aria-busy', 'false');
      grid.style.opacity = '';
      grid.style.transition = '';
      window.requestAnimationFrame(() => {
        grid.querySelectorAll('.ais-card').forEach(c => c.classList.add('is-visible'));
      });
      if (firstRender) {
        firstRender = false;
        const hashCat = categorySlugs.get(window.location.hash.slice(1).toLowerCase());
        if (hashCat) {
          const catalog = document.querySelector('#catalog');
          catalog?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        }
      }
    }, 150);

    resultCount.textContent = `Showing ${visible.length} of ${products.length} products`;
    if (compareCount) compareCount.textContent = String(compareSelection.size);
    if (trayCount) trayCount.textContent = String(compareSelection.size);
    if (compareOpen) compareOpen.disabled = compareSelection.size < 2;
    if (tray) tray.classList.toggle('is-visible', compareSelection.size > 0);
    emptyState.hidden = visible.length > 0;
  }

  // ── Compare dialog ─────────────────────────────────────────────
  function openComparison() {
    const selected = products.filter(p => compareSelection.has(p.slug));
    if (selected.length < 2) return;
    const table = document.createElement('table');
    table.className = 'ais-compare-table';
    const head = document.createElement('thead');
    const hRow = document.createElement('tr');
    ['Product', ...selected.map(p => p.name)].forEach(label => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      hRow.appendChild(th);
    });
    head.appendChild(hRow);
    const body = document.createElement('tbody');
    [
      ['Category', p => p.category],
      ['Summary',  p => p.summary],
      ['Capabilities', p => p.capabilities.join('; ')]
    ].forEach(([label, fn]) => {
      const row = document.createElement('tr');
      const th = document.createElement('th');
      th.scope = 'row';
      th.textContent = label;
      row.appendChild(th);
      selected.forEach(p => {
        const td = document.createElement('td');
        td.textContent = fn(p);
        row.appendChild(td);
      });
      body.appendChild(row);
    });
    const eRow = document.createElement('tr');
    const eTh = document.createElement('th');
    eTh.scope = 'row';
    eTh.textContent = 'Enquiry';
    eRow.appendChild(eTh);
    selected.forEach(p => {
      const td = document.createElement('td');
      const a = document.createElement('a');
      a.href = `contact.html?product=${encodeURIComponent(p.slug)}`;
      a.textContent = 'Enquire';
      td.appendChild(a);
      eRow.appendChild(td);
    });
    body.appendChild(eRow);
    table.append(head, body);
    compareContent.replaceChildren(table);
    compareDialog.showModal();
  }

  // ── Category / hash ────────────────────────────────────────────
  function setCategory(cat, updateHash, shouldRender = true) {
    activeCategory = cat;
    chipsHost.querySelectorAll('.ais-chip').forEach(chip => {
      chip.setAttribute('aria-pressed', String(chip.dataset.category === activeCategory));
    });
    if (updateHash) {
      const hash = cat === 'All' ? '' : `#${cat.toLowerCase()}`;
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`);
    }
    if (shouldRender) render();
  }

  function applyHashFilter(shouldRender = true) {
    const slug = window.location.hash.slice(1).toLowerCase();
    setCategory(categorySlugs.get(slug) || 'All', false, shouldRender);
  }

  // ── Detail dialog ──────────────────────────────────────────────
  function openDetails(product, trigger) {
    lastTrigger = trigger;
    dialogTitle.textContent = product.name;
    dialogCat.textContent = product.category;
    dialogSummary.textContent = product.summary;
    dialogCaps.replaceChildren();
    product.capabilities.forEach(cap => {
      const li = document.createElement('li');
      li.textContent = cap;
      dialogCaps.appendChild(li);
    });
    dialogEnquire.href = `contact.html?product=${encodeURIComponent(product.slug)}`;
    dialog.showModal();
    dialogClose.focus();
    document.body.classList.add('ais-dialog-open');
  }

  function closeDetails() { if (dialog.open) dialog.close(); }

  function handleDialogKeydown(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeDetails(); return; }
    if (e.key !== 'Tab') return;
    const focusable = Array.from(dialog.querySelectorAll('a[href], button:not([disabled])')).filter(el => el.getClientRects().length > 0);
    if (!focusable.length) { e.preventDefault(); dialog.focus(); return; }
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ── Event wiring ───────────────────────────────────────────────
  searchInput.addEventListener('input', () => {
    const url = new URL(window.location.href);
    const q = searchInput.value.trim();
    if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    render();
  });
  sortSelect?.addEventListener('change', render);
  document.querySelectorAll('[data-ais-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-ais-view]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
      render();
    });
  });
  compareOpen?.addEventListener('click', openComparison);
  document.querySelector('#ais-tray-compare')?.addEventListener('click', openComparison);
  document.querySelector('#ais-compare-close')?.addEventListener('click', () => compareDialog?.close());
  compareDialog?.querySelectorAll('[data-compare-close]').forEach(btn => btn.addEventListener('click', () => compareDialog.close()));
  document.querySelector('#ais-clear-empty')?.addEventListener('click', () => {
    searchInput.value = '';
    setCategory('All', true);
    searchInput.focus();
  });
  dialogClose?.addEventListener('click', closeDetails);
  dialog.querySelectorAll('[data-close-dialog]').forEach(btn => btn.addEventListener('click', closeDetails));
  dialog.addEventListener('click', e => { if (e.target === dialog) closeDetails(); });
  dialog.addEventListener('keydown', handleDialogKeydown);
  dialog.addEventListener('cancel', e => { e.preventDefault(); closeDetails(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('ais-dialog-open');
    lastTrigger?.focus();
    lastTrigger = null;
  });
  window.addEventListener('hashchange', applyHashFilter);
  window.addEventListener('popstate', () => {
    searchInput.value = new URLSearchParams(window.location.search).get('q') || '';
    applyHashFilter();
  });

  // ── Init ───────────────────────────────────────────────────────
  if (productTotal) productTotal.textContent = String(products.length);
  searchInput.value = new URLSearchParams(window.location.search).get('q') || '';
  buildChips();
  buildSectors();
  renderPlaygroundLinks();
  applyHashFilter(false);
  setTimeout(render, 180);
  setTimeout(initReveal, 300);
})();
