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
    totalCount: root.querySelector('[data-total-products]'),
    categoryFilters: root.querySelector('[data-category-filters]'),
    search: root.querySelector('[data-search]'),
    sort: root.querySelector('[data-sort]'),
    stock: root.querySelector('[data-stock]'),
    dialog: document.querySelector('[data-dialog]'),
    dialogForm: document.querySelector('[data-enquiry-form]'),
    dialogProduct: document.querySelector('[data-dialog-product]')
  };
  const filterToggle = root.querySelector('[data-filter-toggle]');
  const filterSheet = root.querySelector('[data-filter-sheet]');
  const filterApply = root.querySelector('[data-filter-apply]');
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
      return `<label class="hw-filter-option"><input type="radio" name="category" value="${value}"${state.category === value ? ' checked' : ''}><span class="hw-opt-label">${label}</span><span class="hw-opt-count">${count}</span></label>`;
    }).join('');
    els.categoryFilters.querySelectorAll('input').forEach((input) => input.addEventListener('change', () => {
      state.category = input.value;
      syncUrl();
      render();
    }));
    root.querySelector('[data-price-filters]').innerHTML = priceRanges.map(([value, label]) => `<label class="hw-filter-option"><input type="radio" name="price" value="${value}"${state.price === value ? ' checked' : ''}><span class="hw-opt-label">${label}</span></label>`).join('');
    root.querySelectorAll('[name="price"]').forEach((input) => input.addEventListener('change', () => {
      state.price = input.value;
      render();
    }));
  }

  function renderCards() {
    const visible = filteredProducts();
    els.count.textContent = `${visible.length} Product${visible.length === 1 ? '' : 's'}`;
    if (!visible.length) {
      els.products.innerHTML = '<div class="hw-empty"><i class="bi bi-search" aria-hidden="true"></i><strong>No products match your filters</strong><br><button class="hw-reset" type="button" data-empty-reset>Reset</button></div>';
      els.products.querySelector('[data-empty-reset]').addEventListener('click', reset);
      return;
    }
    els.products.innerHTML = visible.map((product, index) => {
      const inStock = product.stock === 'in';
      const rating = Number(product.rating ?? 4.8).toFixed(1);
      return `<article class="hw-card hw-reveal${inStock ? '' : ' hw-card--out'}" style="--hw-delay:${index * 50}ms">
        <div class="hw-card__tile"><i class="bi ${iconFor[product.category]}" aria-hidden="true"></i></div>
        <div class="hw-card__body">
          <span class="hw-chip">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.description || 'High-performance gear optimized for your AI and vision workloads.'}</p>
          <div class="hw-card__meta">
            <span class="hw-price">${price(product.price)}</span>
            <span class="hw-rating"><i class="bi bi-star-fill" aria-hidden="true"></i> ${rating}</span>
          </div>
          ${inStock ? `<button class="hw-button hw-button--primary" type="button" data-enquire="${product.id}">Enquire Now <i class="bi bi-arrow-right" aria-hidden="true"></i></button>` : '<span class="hw-card__stock">Out of Stock</span>'}
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
    renderFilters();
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
    els.stock.checked = false;
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
  els.stock.addEventListener('change', () => { state.stock = els.stock.checked; renderCards(); });
  root.querySelector('[data-deals]')?.addEventListener('click', () => {
    state.sort = 'price-asc';
    els.sort.value = 'price-asc';
    renderCards();
  });
  root.querySelector('[data-reset]')?.addEventListener('click', reset);
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

  filterToggle?.addEventListener('click', () => {
    const open = !filterSheet.classList.contains('is-open');
    filterSheet.classList.toggle('is-open', open);
    filterToggle.setAttribute('aria-expanded', String(open));
  });
  filterApply?.addEventListener('click', () => {
    filterSheet.classList.remove('is-open');
    filterToggle?.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && filterSheet?.classList.contains('is-open')) {
      filterSheet.classList.remove('is-open');
      filterToggle?.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('click', (event) => {
    if (filterSheet?.classList.contains('is-open') && !filterSheet.contains(event.target) && event.target !== filterToggle) {
      filterSheet.classList.remove('is-open');
      filterToggle?.setAttribute('aria-expanded', 'false');
    }
  });

  render();
})();
