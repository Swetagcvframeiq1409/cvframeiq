(() => {
  'use strict';

  const products = window.HARDWARE_PRODUCTS || [];
  const root = document.querySelector('[data-hardware-gear]');
  if (!root) return;

  const categoryId = (category) => category.toLowerCase().replace(/\s+/g, '-');
  const iconFor = {
    'Vision Systems': 'bi-camera-video',
    'Processing Units': 'bi-cpu',
    'Sensor Kits': 'bi-broadcast',
    'Development Boards': 'bi-motherboard'
  };
  const price = (value) => `&#8377;${value.toLocaleString('en-IN')}`;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);
  const state = {
    category: new URLSearchParams(location.search).get('cat') || 'all',
    search: '',
    price: 'all',
    stock: false,
    sort: 'featured'
  };
  const categories = ['All Products', 'Vision Systems', 'Processing Units', 'Sensor Kits', 'Development Boards'];
  const priceRanges = [
    ['all', 'All prices'],
    ['under-10000', 'Under &#8377;10,000'],
    ['10000-20000', '&#8377;10,000 to &#8377;20,000'],
    ['20000-25000', '&#8377;20,000 to &#8377;25,000'],
    ['over-25000', '&#8377;25,000+']
  ];
  const els = {
    products: root.querySelector('[data-products]'),
    count: root.querySelector('[data-count]'),
    showing: root.querySelector('[data-showing]'),
    totalCount: root.querySelector('[data-total-products]'),
    categoryFilters: root.querySelector('[data-category-filters]'),
    priceFilters: root.querySelector('[data-price-filters]'),
    search: root.querySelector('[data-search]'),
    sort: root.querySelector('[data-sort]'),
    stock: root.querySelector('[data-stock]'),
    stockCount: root.querySelector('[data-stock-count]'),
    activeFilters: root.querySelector('[data-active-filters]'),
    activeCount: root.querySelector('[data-active-count]'),
    filterApply: root.querySelector('[data-filter-apply]'),
    dialog: document.querySelector('[data-dialog]'),
    dialogForm: document.querySelector('[data-enquiry-form]'),
    dialogProduct: document.querySelector('[data-dialog-product]')
  };
  const filterToggle = root.querySelector('[data-filter-toggle]');
  const filterSheet = root.querySelector('[data-filter-sheet]');
  const filterBackdrop = root.querySelector('[data-filter-backdrop]');
  const filterClose = root.querySelector('[data-filter-close]');
  const filterMedia = window.matchMedia('(max-width: 991px)');
  const clearButtons = [...root.querySelectorAll('[data-reset]')];
  const stickyEnquire = root.querySelector('.hw-sticky-enquire');
  document.body.classList.toggle('has-hw-sticky-enquire', Boolean(stickyEnquire));
  if (els.totalCount) els.totalCount.textContent = `${products.length + 44}+`;

  function getPriceMatch(value) {
    if (state.price === 'under-10000') return value < 10000;
    if (state.price === '10000-20000') return value >= 10000 && value <= 20000;
    if (state.price === '20000-25000') return value > 20000 && value <= 25000;
    if (state.price === 'over-25000') return value > 25000;
    return true;
  }

  function filteredProducts() {
    const query = state.search.trim().toLowerCase();
    const result = products.filter((product) => {
      const categoryMatch = state.category === 'all' || categoryId(product.category) === state.category;
      const searchMatch = !query || `${product.name} ${product.category}`.toLowerCase().includes(query);
      return categoryMatch && searchMatch && getPriceMatch(product.price) && (!state.stock || product.stock === 'in');
    });
    return result.sort((a, b) => {
      if (state.sort === 'price-asc') return a.price - b.price;
      if (state.sort === 'price-desc') return b.price - a.price;
      if (state.sort === 'newest') return a.addedRank - b.addedRank;
      return a.featuredRank - b.featuredRank;
    });
  }

  function renderFilters() {
    const counts = products.reduce((result, product) => {
      result[categoryId(product.category)] = (result[categoryId(product.category)] || 0) + 1;
      return result;
    }, {});
    els.categoryFilters.innerHTML = categories.map((label) => {
      const value = label === 'All Products' ? 'all' : categoryId(label);
      const count = value === 'all' ? products.length : counts[value] || 0;
      return `<label class="hw-filter-option hw-filter-row${state.category === value ? ' is-selected' : ''}"><input type="radio" name="category" value="${value}"${state.category === value ? ' checked' : ''}><span class="hw-opt-label">${label}</span><span class="hw-opt-count">${count}</span></label>`;
    }).join('');
    els.priceFilters.innerHTML = priceRanges.map(([value, label]) => {
      const count = value === 'all' ? products.length : products.filter((product) => {
        if (value === 'under-10000') return product.price < 10000;
        if (value === '10000-20000') return product.price >= 10000 && product.price <= 20000;
        if (value === '20000-25000') return product.price > 20000 && product.price <= 25000;
        return product.price > 25000;
      }).length;
      return `<label class="hw-filter-option hw-filter-row${state.price === value ? ' is-selected' : ''}${count === 0 ? ' is-empty' : ''}"><input type="radio" name="price" value="${value}"${state.price === value ? ' checked' : ''}><span class="hw-opt-label">${label}</span><span class="hw-opt-count">${count}</span></label>`;
    }).join('');
    if (els.stockCount) els.stockCount.textContent = products.filter((product) => product.stock === 'in').length;
    els.categoryFilters.addEventListener('change', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.name !== 'category') return;
      state.category = input.value;
      syncUrl();
      render();
    });
    els.priceFilters.addEventListener('change', (event) => {
      const input = event.target;
      if (!(input instanceof HTMLInputElement) || input.name !== 'price') return;
      state.price = input.value;
      render();
    });
  }

  function getActiveFilters() {
    const active = [];
    if (state.category !== 'all') {
      const category = categories.find((label) => categoryId(label) === state.category);
      if (category) active.push({ key: 'category', label: category });
    }
    if (state.price !== 'all') {
      const range = priceRanges.find(([value]) => value === state.price);
      if (range) active.push({ key: 'price', label: range[1].replace(/&#8377;/g, '₹') });
    }
    if (state.stock) active.push({ key: 'stock', label: 'In Stock Only' });
    if (state.search.trim()) active.push({ key: 'search', label: `Search: ${state.search.trim()}` });
    return active;
  }

  function syncFilterControls() {
    els.categoryFilters.querySelectorAll('[name="category"]').forEach((input) => {
      input.checked = input.value === state.category;
      input.closest('.hw-filter-row').classList.toggle('is-selected', input.checked);
    });
    els.priceFilters.querySelectorAll('[name="price"]').forEach((input) => {
      input.checked = input.value === state.price;
      input.closest('.hw-filter-row').classList.toggle('is-selected', input.checked);
    });
    els.stock.checked = state.stock;
    els.stock.closest('.hw-filter-row').classList.toggle('is-selected', state.stock);
  }

  function renderCards() {
    const visible = filteredProducts();
    const active = getActiveFilters();
    const countLabel = `${visible.length} product${visible.length === 1 ? '' : 's'}`;
    els.count.textContent = countLabel;
    els.showing.textContent = `Showing ${visible.length} of ${products.length}`;
    els.filterApply.textContent = `Show ${countLabel}`;
    els.activeCount.textContent = String(active.length);
    els.activeCount.hidden = active.length === 0;
    clearButtons.forEach((button) => { button.hidden = active.length === 0; });
    els.activeFilters.innerHTML = active.map(({ key, label }) => `<button class="hw-active-chip" type="button" data-remove-filter="${key}" aria-label="Remove ${escapeHtml(label)}">${escapeHtml(label)}<i class="bi bi-x" aria-hidden="true"></i></button>`).join('');
    els.activeFilters.hidden = active.length === 0;
    els.activeFilters.querySelectorAll('[data-remove-filter]').forEach((button) => button.addEventListener('click', () => {
      const key = button.dataset.removeFilter;
      if (key === 'category') state.category = 'all';
      if (key === 'price') state.price = 'all';
      if (key === 'stock') state.stock = false;
      if (key === 'search') state.search = '';
      els.search.value = state.search;
      syncUrl();
      render();
    }));
    if (!visible.length) {
      els.products.innerHTML = '<div class="hw-empty"><i class="bi bi-search" aria-hidden="true"></i><strong>No products match your filters.</strong><button class="hw-reset" type="button" data-empty-reset>Clear all filters</button></div>';
      els.products.querySelector('[data-empty-reset]').addEventListener('click', reset);
      return;
    }
    els.products.innerHTML = visible.map((product, index) => {
      const inStock = product.stock === 'in';
      const rating = Number(product.rating ?? 4.8).toFixed(1);
      return `<article class="hw-card gk-card hw-reveal${inStock ? '' : ' hw-card--out'}" style="--hw-delay:${index * 50}ms">
        <div class="hw-card__tile"><i class="bi ${iconFor[product.category]}" aria-hidden="true"></i>${inStock ? '' : '<span class="hw-card__stock">Out of Stock</span>'}</div>
        <div class="hw-card__body">
          <span class="hw-chip">${product.category}</span>
          <h3>${product.name}</h3>
          <p class="hw-card__description">${product.description || 'High-performance gear optimized for your AI and vision workloads.'}</p>
          <div class="hw-card__meta">
            <span class="hw-price">${price(product.price)}</span>
            <span class="hw-rating"><i class="bi bi-star-fill" aria-hidden="true"></i> ${rating}</span>
          </div>
          <div class="hw-card__actions">
            <a class="hw-card__quote" href="request-quote.html?product=${encodeURIComponent(product.id)}">Request a Quote <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
            <button class="hw-button hw-button--primary" type="button" data-enquire="${product.id}">Enquire Now <i class="bi bi-arrow-right" aria-hidden="true"></i></button>
          </div>
        </div>
      </article>`;
    }).join('');
    els.products.querySelectorAll('[data-enquire]').forEach((button) => button.addEventListener('click', () => openDialog(button.dataset.enquire)));
    requestAnimationFrame(() => els.products.querySelectorAll('.hw-reveal').forEach((card) => card.classList.add('is-visible')));
  }

  function syncUrl() {
    const url = new URL(location.href);
    if (state.category === 'all') url.searchParams.delete('cat');
    else url.searchParams.set('cat', state.category);
    history.replaceState(null, '', url);
  }

  function render() {
    syncFilterControls();
    renderCards();
  }

  function reset() {
    state.category = 'all';
    state.search = '';
    state.price = 'all';
    state.stock = false;
    state.sort = 'featured';
    els.search.value = '';
    els.sort.value = 'featured';
    syncUrl();
    render();
  }

  let lastFocus = null;
  function openDialog(id) {
    const product = products.find((item) => item.id === id);
    if (!product) return;
    lastFocus = document.activeElement;
    els.dialogProduct.textContent = product.name;
    els.dialog.hidden = false;
    els.dialog.setAttribute('aria-hidden', 'false');
    els.dialogForm.reset();
    els.dialogForm.dataset.product = product.name;
    els.dialog.querySelector('input').focus();
  }

  function validateEnquiry() {
    const fields = [...els.dialogForm.querySelectorAll('[required]')];
    let firstInvalid = null;
    fields.forEach((field) => {
      const message = !field.value.trim()
        ? 'This field is required.'
        : field.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value)
          ? 'Enter a valid email address.'
          : '';
      const error = field.parentElement.querySelector('.hw-dialog__error');
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      error.textContent = message;
      if (message && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  function validateEnquiryField(field) {
    const message = !field.value.trim()
      ? 'This field is required.'
      : field.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value)
        ? 'Enter a valid email address.'
        : '';
    const error = field.parentElement.querySelector('.hw-dialog__error');
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.textContent = message;
  }

  function closeDialog() {
    els.dialog.hidden = true;
    els.dialog.setAttribute('aria-hidden', 'true');
    lastFocus?.focus();
  }

  function trapFocus(event) {
    if (els.dialog.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeDialog(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...els.dialog.querySelectorAll('button, input, textarea')].filter((item) => !item.disabled);
    if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1).focus(); }
    else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0].focus(); }
  }

  els.search.addEventListener('input', () => { state.search = els.search.value; renderCards(); });
  els.sort.addEventListener('change', () => { state.sort = els.sort.value; renderCards(); });
  els.stock.addEventListener('change', () => { state.stock = els.stock.checked; render(); });
  root.querySelector('[data-deals]')?.addEventListener('click', () => {
    state.sort = 'price-asc';
    els.sort.value = 'price-asc';
    renderCards();
  });
  clearButtons.forEach((button) => button.addEventListener('click', reset));
  els.dialog?.querySelector('[data-dialog-close]')?.addEventListener('click', closeDialog);
  els.dialog?.addEventListener('click', (event) => { if (event.target === els.dialog) closeDialog(); });
  document.addEventListener('keydown', trapFocus);
  els.dialogForm?.querySelectorAll('[required]').forEach((field) => field.addEventListener('blur', () => validateEnquiryField(field)));
  els.dialogForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateEnquiry()) return;
    const data = new FormData(els.dialogForm);
    const subject = encodeURIComponent(`Hardware enquiry: ${els.dialogForm.dataset.product}`);
    const body = encodeURIComponent([...data.entries()].map(([key, value]) => `${key}: ${value}`).join('\n'));
    els.dialogForm.hidden = true;
    els.dialog.querySelector('[data-success]').hidden = false;
    els.dialog.dataset.mailto = `mailto:official@cvframeiq.com?subject=${subject}&body=${body}`;
    window.location.href = els.dialog.dataset.mailto;
  });

  let filterFocusReturn = null;
  let previousBodyOverflow = '';
  function syncFilterDialogMode() {
    if (filterMedia.matches) {
      filterSheet.setAttribute('role', 'dialog');
      filterSheet.setAttribute('aria-labelledby', 'hw-filter-title');
      filterSheet.setAttribute('aria-modal', 'true');
      filterSheet.setAttribute('aria-hidden', filterSheet.classList.contains('is-open') ? 'false' : 'true');
      return;
    }
    if (filterSheet.classList.contains('is-open')) closeFilterSheet(false);
    filterSheet.setAttribute('role', 'region');
    filterSheet.setAttribute('aria-label', 'Filter products');
    filterSheet.removeAttribute('aria-labelledby');
    filterSheet.removeAttribute('aria-modal');
    filterSheet.setAttribute('aria-hidden', 'false');
  }

  function openFilterSheet() {
    if (!filterMedia.matches || filterSheet.classList.contains('is-open')) return;
    filterFocusReturn = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;
    filterSheet.classList.add('is-open');
    filterSheet.setAttribute('aria-hidden', 'false');
    filterBackdrop.hidden = false;
    filterToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('hw-filters-open');
    document.body.style.overflow = 'hidden';
    filterClose.focus();
  }

  function closeFilterSheet(returnFocus = true) {
    if (!filterSheet.classList.contains('is-open')) return;
    const focusTarget = filterFocusReturn || filterToggle;
    filterSheet.classList.remove('is-open');
    filterSheet.setAttribute('aria-hidden', filterMedia.matches ? 'true' : 'false');
    filterBackdrop.hidden = true;
    filterToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('hw-filters-open');
    document.body.style.overflow = previousBodyOverflow;
    filterFocusReturn = null;
    if (returnFocus && focusTarget.isConnected) requestAnimationFrame(() => focusTarget.focus());
  }

  filterToggle.addEventListener('click', openFilterSheet);
  filterSheet.querySelector('[data-filter-scroll]').addEventListener('scroll', (event) => {
    event.currentTarget.classList.toggle('is-scrolled', event.currentTarget.scrollTop > 0);
  }, { passive: true });
  filterClose.addEventListener('click', () => closeFilterSheet());
  filterBackdrop.addEventListener('click', () => closeFilterSheet());
  els.filterApply.addEventListener('click', () => closeFilterSheet());
  document.addEventListener('keydown', (event) => {
    if (!filterSheet.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeFilterSheet();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...filterSheet.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), a[href]')]
      .filter((element) => element.offsetParent !== null);
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  filterMedia.addEventListener('change', syncFilterDialogMode);

  renderFilters();
  syncFilterDialogMode();
  render();
})();
