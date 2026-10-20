(() => {
  const products = window.HARDWARE;
  const ui = window.GearUI;
  if (!Array.isArray(products) || !ui) {
    console.error('Gear Store could not initialize: product data or UI helpers are unavailable.');
    return;
  }

  const byId = new Map(products.map((product) => [product.id, product]));
  const readList = (key) => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || '[]');
      if (!Array.isArray(stored)) throw new TypeError('Stored value must be an array');
      return new Set(stored.filter((id) => byId.has(id)));
    } catch (error) {
      console.warn(`Gear Store could not read ${key}; using an empty in-memory list.`, error);
      return new Set();
    }
  };
  const persist = (key, list) => {
    try {
      localStorage.setItem(key, JSON.stringify([...list]));
    } catch (error) {
      console.warn(`Gear Store could not save ${key}; changes will last for this visit only.`, error);
    }
  };
  const wishlist = readList('frameiq-gear-wishlist');
  const enquiry = readList('frameiq-gear-enquiry');
  const compare = new Set([...readList('frameiq-gear-compare')].slice(0, 3));
  const state = { query: '', category: '', minPrice: 0, maxPrice: 24800, priceRange: '', enquireOnly: false, includeOut: true, sort: 'featured', page: 1 };
  let detailOpener = null;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const categoryHost = $('#category-filters');
  [...new Set(products.map((product) => product.category))].forEach((category) => {
    categoryHost.insertAdjacentHTML('beforeend', `<label class="gear-check"><input type="checkbox" name="gear-category" value="${ui.escapeHtml(category)}"><span>${ui.escapeHtml(category)}</span></label>`);
  });

  const sidebar = $('.gear-filter-sidebar');
  $('#in-stock-only').name = 'gear-in-stock';
  const mobileContent = $('#mobile-filter-content');
  const mobileSidebar = sidebar.cloneNode(true);
  mobileSidebar.querySelector('#in-stock-only').name = 'gear-in-stock';
  mobileSidebar.classList.remove('gear-filter-sidebar');
  mobileSidebar.removeAttribute('aria-label');
  mobileSidebar.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
  mobileSidebar.querySelectorAll('label[for]').forEach((label) => label.removeAttribute('for'));
  mobileSidebar.querySelectorAll('[data-clear-filters]').forEach((button) => button.remove());
  mobileContent.append(mobileSidebar);

  const selectedCategories = () => new Set($$('input[name="gear-category"]:checked').map((input) => input.value));
  const syncRange = (value) => {
    $$('input[type="range"]').forEach((input) => { input.value = String(value); });
    $$('.gear-range-label strong').forEach((label) => { label.textContent = ui.money(value); });
  };

  const renderCatalog = () => {
    const selected = selectedCategories();
    const normalized = state.query.trim().toLocaleLowerCase();
    const matchesCurrentFilters = (product) => {
      const text = [product.name, product.category, ...(product.descriptionPlaceholder ? [] : [product.description]), ...(product.compatibility || [])].join(' ').toLocaleLowerCase();
      return (!normalized || text.includes(normalized))
        && (!selected.size || selected.has(product.category))
        && product.price >= state.minPrice
        && product.price <= state.maxPrice;
    };
    const matching = products.filter(matchesCurrentFilters);
    let filtered = matching.filter((product) => (
      (!state.enquireOnly || product.stockStatus !== 'Out of stock')
      && (state.includeOut || product.stockStatus !== 'Out of stock')
    ));
    if (state.sort === 'price-asc') filtered.sort((a, b) => a.price - b.price);
    if (state.sort === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (state.sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));

    const pageSize = 12;
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    state.page = Math.min(state.page, pages);
    const start = (state.page - 1) * pageSize;
    $('#product-grid').innerHTML = filtered.slice(start, start + pageSize)
      .map((product) => ui.card(product, { wishlist, compare })).join('');
    const firstPhoto = $('#product-grid').querySelector('[data-photo]');
    if (firstPhoto) firstPhoto.dataset.photoLoading = 'eager';
    window.initPhotos?.($('#product-grid'));
    $('#product-grid').setAttribute('aria-busy', 'false');
    $('#empty-state').hidden = filtered.length > 0;
    $('#product-grid').hidden = filtered.length === 0;
    const shownCount = Math.min(pageSize, Math.max(0, filtered.length - start));
    const productWord = filtered.length === 1 ? 'product' : 'products';
    const rangeSummary = filtered.length > pageSize
      ? `Showing ${start + 1}–${start + shownCount} of ${filtered.length} products`
      : `Showing ${shownCount} ${productWord}`;
    $('#result-summary').textContent = rangeSummary;
    $('#gear-catalog-count strong').textContent = String(filtered.length);
    $('#gear-catalog-count span').textContent = 'Products in catalog';
    $$('.gear-filter-count-note').forEach((note) => {
      note.textContent = `${filtered.length} ${productWord} ${filtered.length === 1 ? 'matches' : 'match'} current filters.`;
    });
    $('#pagination').innerHTML = pages > 1
      ? `<button type="button" class="gear-page-button" data-page="${state.page - 1}"${state.page === 1 ? ' disabled' : ''} aria-label="Previous page">←</button>${Array.from({ length: pages }, (_, index) => `<button type="button" class="gear-page-button${state.page === index + 1 ? ' is-current' : ''}" data-page="${index + 1}"${state.page === index + 1 ? ' aria-current="page"' : ''}>${index + 1}</button>`).join('')}<button type="button" class="gear-page-button" data-page="${state.page + 1}"${state.page === pages ? ' disabled' : ''} aria-label="Next page">→</button>`
      : '';
    renderChips(selected);
    updateCounts();
  };

  window.initPhotos?.($('.gear-hero__visual'));

  const renderChips = (selected) => {
    const chips = [];
    if (state.query) chips.push(`<button type="button" data-remove-filter="query">Search: ${ui.escapeHtml(state.query)} <span aria-hidden="true">×</span></button>`);
    selected.forEach((category) => chips.push(`<button type="button" data-remove-category="${ui.escapeHtml(category)}">${ui.escapeHtml(category)} <span aria-hidden="true">×</span></button>`));
    if (state.priceRange) chips.push(`<button type="button" data-remove-filter="price">${ui.escapeHtml(state.priceRange)} <span aria-hidden="true">×</span></button>`);
    if (state.enquireOnly) chips.push('<button type="button" data-remove-filter="enquire">Available to enquire <span aria-hidden="true">×</span></button>');
    $('#active-filters').innerHTML = chips.length ? `${chips.join('')}<button type="button" class="gear-chip-clear" data-clear-filters>Clear all</button>` : '';
    const count = chips.length;
    $$('[data-filter-count]').forEach((element) => {
      element.textContent = count ? `(${count})` : '';
    });
  };

  const updateCounts = () => {
    $$('[data-wishlist-count]').forEach((element) => { element.textContent = String(wishlist.size); });
    $$('[data-compare-count]').forEach((element) => { element.textContent = String(compare.size); });
    $$('[data-enquiry-count]').forEach((element) => { element.textContent = String(enquiry.size); });
  };

  const setFilter = (name) => {
    if (name === 'query') {
      state.query = '';
      $('#gear-search').value = '';
    } else if (name === 'price') {
      state.minPrice = 0;
      state.maxPrice = 24800;
      state.priceRange = '';
      $$('input[name="gear-price"]').forEach((input) => { input.checked = false; });
      syncRange(state.maxPrice);
    } else if (name === 'enquire') {
      state.enquireOnly = false;
      $$('input[name="gear-in-stock"]').forEach((input) => { input.checked = false; });
    } else if (name === 'out') {
      state.includeOut = true;
      $$('input[name="gear-include-out"]').forEach((input) => { input.checked = true; });
    }
    state.page = 1;
    renderCatalog();
  };

  const resetFilters = () => {
    state.query = '';
    state.minPrice = 0;
    state.maxPrice = 24800;
    state.priceRange = '';
    state.enquireOnly = false;
    state.includeOut = true;
    state.page = 1;
    $('#gear-search').value = '';
    $('#gear-sort').value = 'featured';
    state.sort = 'featured';
    $$('input[name="gear-category"]').forEach((input) => { input.checked = false; });
    $$('input[name="gear-in-stock"]').forEach((input) => { input.checked = false; });
    $$('input[name="gear-include-out"]').forEach((input) => { input.checked = true; });
    $$('input[name="gear-price"]').forEach((input) => { input.checked = false; });
    syncRange(state.maxPrice);
    renderCatalog();
  };

  const detailContent = (product) => {
    const fields = [
      ['Category', product.category],
      ['Description', product.description, product.descriptionPlaceholder],
      ['Stock status', product.stockStatus],
      ['Estimated delivery', product.estimatedDelivery, product.estimatedDeliveryPlaceholder],
      ['Compatibility', Array.isArray(product.compatibility) && product.compatibility.length ? product.compatibility.join(', ') : '']
    ].filter(([, value, explicitlyPlaceholder]) => (
      value !== undefined
      && value !== null
      && value !== ''
      && !explicitlyPlaceholder
      && !(typeof value === 'string' && /^\s*\[Placeholder:/i.test(value))
    ));
    if (product.specifications && typeof product.specifications === 'object') {
      Object.entries(product.specifications).forEach(([label, value]) => {
        if (
          value !== undefined
          && value !== null
          && value !== ''
          && !(typeof value === 'string' && /^\s*\[Placeholder:/i.test(value))
        ) fields.push([label, value]);
      });
    }
    const specificationRows = fields.map(([label, value]) => (
      `<div><dt>${ui.escapeHtml(label)}</dt><dd>${ui.escapeHtml(value)}</dd></div>`
    )).join('');
    const imageSlot = ui.escapeHtml(product.imageSlot || 'gear-camera');
    const imageAlt = ui.escapeHtml(product.name);
    const image = `<div class="gear-dialog-product__visual photo-frame" data-photo="${imageSlot}" data-photo-loading="eager"><img width="800" height="450" alt="${imageAlt}" hidden><button class="gear-icon-button gear-product-card__wish${wishlist.has(product.id) ? ' is-active' : ''}" type="button" data-action="wishlist" data-id="${ui.escapeHtml(product.id)}" aria-label="${wishlist.has(product.id) ? 'Remove from' : 'Add to'} wishlist: ${imageAlt}" aria-pressed="${wishlist.has(product.id)}">${ui.icon('heart')}</button></div>`;
    return `<div class="gear-dialog-product">${image}<h3>${ui.escapeHtml(product.name)}</h3><p class="gear-dialog-product__price"><strong>${ui.money(product.price)}</strong><small>Indicative price. Confirm on enquiry.</small></p><dl class="gear-product-specifications">${specificationRows}</dl><div class="gear-dialog-product__actions"><a class="gear-button gear-button--secondary" href="gear-product.html?product=${encodeURIComponent(product.id)}">Open product page</a><button class="gear-button gear-button--primary" type="button" data-action="enquire" data-id="${ui.escapeHtml(product.id)}">Add to enquiry list</button></div></div>`;
  };

  const productRows = (ids, emptyMessage, removable) => {
    const items = [...ids].map((id) => byId.get(id)).filter(Boolean);
    if (!items.length) return `<div class="gear-list-empty">${ui.icon('cart')}<p>${emptyMessage}</p></div>`;
    return `<ul class="gear-dialog-list">${items.map((product) => `<li><div><strong>${ui.escapeHtml(product.name)}</strong><span>${ui.escapeHtml(product.category)} · ${ui.money(product.price)} · Indicative price. Confirm on enquiry.</span></div>${removable ? `<button type="button" class="gear-text-button" data-remove-list="${ui.escapeHtml(product.id)}" data-list="${removable}">Remove</button>` : ''}</li>`).join('')}</ul>`;
  };

  const openEnquiry = () => {
    const content = $('#gear-enquiry-content');
    const selected = [...enquiry].map((id) => byId.get(id)).filter(Boolean);
    content.innerHTML = `${productRows(new Set(selected.map((product) => product.id)), 'Your enquiry list is empty. Add a product to get started.', 'enquiry')}${selected.length ? `<p class="gear-detail-note">Continue to the contact form with this product list, or use the email draft fallback.</p><a class="gear-button gear-button--primary gear-enquiry-mail" href="${makeContactFormHref(selected)}">Send enquiry</a><a class="gear-button gear-button--secondary gear-enquiry-mail" href="${makeMailto(selected)}">Send enquiry by email</a>` : ''}`;
    $('#gear-enquiry-dialog').showModal();
  };

  const renderCompare = () => {
    const selected = [...compare].map((id) => byId.get(id)).filter(Boolean);
    const compatibilityRow = selected.some((product) => product.compatibility?.length)
      ? `<div class="gear-compare-row"><span>Compatibility</span>${selected.map((product) => `<span>${product.compatibility?.length ? product.compatibility.map(ui.escapeHtml).join(', ') : '—'}</span>`).join('')}</div>`
      : '';
    $('#gear-compare-content').innerHTML = selected.length
      ? `<div class="gear-compare-table" style="--compare-cols:${selected.length}"><div class="gear-compare-row gear-compare-row--head"><span>Product</span>${selected.map((product) => `<strong>${ui.escapeHtml(product.name)}<button type="button" class="gear-text-button" data-uncompare="${ui.escapeHtml(product.id)}">Remove</button></strong>`).join('')}</div><div class="gear-compare-row"><span>Category</span>${selected.map((product) => `<span>${ui.escapeHtml(product.category)}</span>`).join('')}</div><div class="gear-compare-row"><span>Price</span>${selected.map((product) => `<span>${ui.money(product.price)} · Indicative price. Confirm on enquiry.</span>`).join('')}</div><div class="gear-compare-row"><span>Stock status</span>${selected.map((product) => `<span>${ui.escapeHtml(product.stockStatus)}</span>`).join('')}</div>${compatibilityRow}</div>`
      : '<div class="gear-list-empty"><p>Select up to three products with the Compare control to see a side-by-side view.</p></div>';
  };

  const makeMailto = (selected) => {
    const names = selected.map((product) => `- ${product.name}`).join('\n');
    return `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent('FrameIQ Gear Store enquiry')}&body=${encodeURIComponent(`Hello FrameIQ,\n\nI would like to enquire about:\n${names}\n\nPlease share more information about specifications, compatibility, and current availability.\n`)}`;
  };
  const makeContactFormHref = (selected) => {
    const ids = selected.map((product) => product.id).join(',');
    return `../pages/contact.html?interest=hardware&products=${encodeURIComponent(ids)}`;
  };

  document.addEventListener('input', (event) => {
    if (event.target.id === 'gear-search') {
      state.query = event.target.value;
      state.page = 1;
      renderCatalog();
    }
  });

  document.addEventListener('change', (event) => {
    const target = event.target;
    if (target.matches('input[name="gear-category"]')) {
      const values = selectedCategories();
      $$('input[name="gear-category"]').forEach((input) => { input.checked = values.has(input.value); });
      state.page = 1;
      renderCatalog();
    } else if (target.name === 'gear-in-stock') {
      state.enquireOnly = target.checked;
      $$('input[name="gear-in-stock"]').forEach((input) => { input.checked = target.checked; });
      state.page = 1;
      renderCatalog();
    } else if (target.name === 'gear-price') {
      state.minPrice = Number(target.dataset.min);
      state.maxPrice = target.dataset.max ? Number(target.dataset.max) : Number.POSITIVE_INFINITY;
      state.priceRange = target.value;
      $$('input[name="gear-price"]').forEach((input) => { input.checked = input.value === target.value; });
      state.page = 1;
      renderCatalog();
    } else if (target.name === 'gear-include-out') {
      state.includeOut = target.checked;
      $$('input[name="gear-include-out"]').forEach((input) => { input.checked = target.checked; });
      state.page = 1;
      renderCatalog();
    } else if (target.id === 'gear-sort') {
      state.sort = target.value;
      state.page = 1;
      renderCatalog();
    }
  });

  document.addEventListener('click', (event) => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.matches('[data-gear-view]')) {
      const isList = target.dataset.gearView === 'list';
      document.querySelectorAll('[data-gear-view]').forEach((button) => {
        button.setAttribute('aria-pressed', String(button === target));
      });
      $('#product-grid').classList.toggle('is-list', isList);
    } else if (target.matches('[data-close-dialog]')) {
      target.closest('dialog')?.close();
    } else if (target.matches('[data-open-filter]')) {
      $('#gear-filter-dialog').showModal();
    } else if (target.matches('[data-open-wishlist]')) {
      $('#gear-wishlist-content').innerHTML = productRows(wishlist, 'Your wishlist is empty. Save a product with the heart button to keep it here.', 'wishlist');
      $('#gear-wishlist-dialog').showModal();
    } else if (target.matches('[data-open-compare]')) {
      renderCompare();
      $('#gear-compare-dialog').showModal();
    } else if (target.matches('[data-open-enquiry]')) {
      openEnquiry();
    } else if (target.matches('[data-page]')) {
      state.page = Number(target.dataset.page);
      renderCatalog();
      $('#catalog-title').scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (target.matches('[data-clear-filters]')) {
      resetFilters();
    } else if (target.matches('[data-remove-filter]')) {
      setFilter(target.dataset.removeFilter);
    } else if (target.matches('[data-remove-category]')) {
      $$('input[name="gear-category"]').forEach((input) => {
        if (input.value === target.dataset.removeCategory) input.checked = false;
      });
      state.page = 1;
      renderCatalog();
    } else if (target.matches('[data-action="wishlist"]')) {
      if (wishlist.has(target.dataset.id)) wishlist.delete(target.dataset.id);
      else wishlist.add(target.dataset.id);
      persist('frameiq-gear-wishlist', wishlist);
      if (target.closest('#gear-detail-content')) {
        const product = byId.get(target.dataset.id);
        const wished = wishlist.has(target.dataset.id);
        target.classList.toggle('is-active', wished);
        target.setAttribute('aria-pressed', String(wished));
        target.setAttribute('aria-label', `${wished ? 'Remove from' : 'Add to'} wishlist: ${product?.name || 'product'}`);
      }
      renderCatalog();
      updateCounts();
    } else if (target.matches('[data-action="compare"]')) {
      const id = target.dataset.id;
      if (compare.has(id)) compare.delete(id);
      else if (compare.size < 3) compare.add(id);
      else {
        $('#gear-compare-content').innerHTML = '<p class="gear-detail-note">You can compare up to three products at a time. Remove a product from your comparison before selecting another.</p>';
        $('#gear-compare-dialog').showModal();
        return;
      }
      persist('frameiq-gear-compare', compare);
      renderCatalog();
    } else if (target.matches('[data-action="details"]')) {
      const product = byId.get(target.dataset.id);
      if (product) {
        $('#gear-detail-content').innerHTML = detailContent(product);
        window.initPhotos?.($('#gear-detail-content'));
        detailOpener = target;
        $('#gear-detail-dialog').showModal();
        $('#gear-detail-dialog [data-close-dialog]').focus();
      }
    } else if (target.matches('[data-action="enquire"]')) {
      const product = byId.get(target.dataset.id);
      if (product) {
        enquiry.add(product.id);
        persist('frameiq-gear-enquiry', enquiry);
        updateCounts();
        openEnquiry();
      }
    } else if (target.matches('[data-remove-list]')) {
      const list = target.dataset.list === 'wishlist' ? wishlist : enquiry;
      list.delete(target.dataset.removeList);
      if (target.dataset.list !== 'wishlist') persist('frameiq-gear-enquiry', enquiry);
      else persist('frameiq-gear-wishlist', wishlist);
      if (target.dataset.list === 'wishlist') {
        $('#gear-wishlist-content').innerHTML = productRows(wishlist, 'Your wishlist is empty. Save a product with the heart button to keep it here.', 'wishlist');
      } else openEnquiry();
      renderCatalog();
    } else if (target.matches('[data-uncompare]')) {
      compare.delete(target.dataset.uncompare);
      persist('frameiq-gear-compare', compare);
      renderCompare();
      renderCatalog();
    }
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
  const detailDialog = $('#gear-detail-dialog');
  detailDialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      detailDialog.close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = $$('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])', detailDialog);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  detailDialog.addEventListener('close', () => {
    detailOpener?.focus();
    detailOpener = null;
  });
  $('#product-grid').setAttribute('aria-busy', 'true');
  window.setTimeout(renderCatalog, 140);
})();
