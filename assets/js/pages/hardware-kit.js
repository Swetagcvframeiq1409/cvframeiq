(() => {
  const host = document.querySelector('#hardware-kit-options');
  const products = window.HARDWARE;
  if (!host || !Array.isArray(products)) {
    console.error('Hardware kit page could not initialize: product data is unavailable.');
    return;
  }

  const kitType = document.body.dataset.hardwareKit;
  const categories = kitType === 'edge'
    ? new Set(['Processing Units', 'Development Boards'])
    : new Set(['Vision Systems', 'Processing Units']);
  const options = products.filter((product) => categories.has(product.category));
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);

  let selected = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem('frameiq-gear-enquiry') || '[]');
    if (Array.isArray(saved)) selected = new Set(saved.filter((id) => products.some((product) => product.id === id)));
  } catch (error) {
    console.warn('Hardware kit page could not read the saved enquiry list.', error);
  }

  host.innerHTML = options.map((product) => {
    const tags = Array.isArray(product.compatibility) && product.compatibility.length
      ? `<div class="gear-compatible"><span>Compatible with</span><ul class="gear-compatibility-badges">${product.compatibility.map((tag) => `<li>${esc(tag)}</li>`).join('')}</ul></div>`
      : '';
    return `<article class="gear-product-card gear-kit-card" data-kit-product="${esc(product.id)}">
      <div class="gear-product-card__media photo-frame" data-photo="${esc(product.imageSlot || 'gear-camera')}" data-photo-loading="lazy"><img width="800" height="450" alt="" hidden></div>
      <div class="gear-product-card__body">
        <div class="gear-product-card__meta"><span class="gear-product-card__category">${esc(product.category)}</span><span class="gear-product-card__availability">${esc(product.stockStatus || 'Check availability')}</span></div>
        <h3><a href="gear-product.html?product=${encodeURIComponent(product.id)}">${esc(product.name)}</a></h3>
        ${tags}
        <p class="gear-price-note">Confirm on enquiry</p>
        <div class="gear-product-card__actions">
          <a class="gear-button gear-button--secondary" href="gear-product.html?product=${encodeURIComponent(product.id)}">View details</a>
          <button class="gear-button gear-button--primary" type="button" data-add-kit-product="${esc(product.id)}" aria-pressed="${selected.has(product.id)}">${selected.has(product.id) ? 'Added to enquiry' : 'Add to enquiry'}</button>
        </div>
      </div>
    </article>`;
  }).join('');
  host.setAttribute('aria-busy', 'false');
  window.initPhotos?.(host);

  const count = document.querySelector('[data-kit-count]');
  const sendLink = document.querySelector('[data-send-enquiry]');
  const updateEnquiry = () => {
    if (count) count.textContent = String(selected.size);
    if (sendLink) {
      const ids = [...selected].join(',');
      sendLink.href = ids
        ? `../pages/contact.html?interest=hardware&products=${encodeURIComponent(ids)}`
        : '../pages/contact.html?interest=hardware';
    }
    host.querySelectorAll('[data-add-kit-product]').forEach((button) => {
      const added = selected.has(button.dataset.addKitProduct);
      button.textContent = added ? 'Added to enquiry' : 'Add to enquiry';
      button.setAttribute('aria-pressed', String(added));
    });
  };
  updateEnquiry();
  host.addEventListener('click', (event) => {
    const button = event.target.closest('[data-add-kit-product]');
    if (!button) return;
    selected.add(button.dataset.addKitProduct);
    try {
      localStorage.setItem('frameiq-gear-enquiry', JSON.stringify([...selected]));
    } catch (error) {
      console.warn('Hardware kit page could not persist the enquiry list.', error);
    }
    updateEnquiry();
  });
})();
