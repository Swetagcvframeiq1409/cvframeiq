(() => {
  const host = document.querySelector('#gear-product-detail');
  const products = window.HARDWARE;
  const ui = window.GearUI;
  if (!host || !Array.isArray(products) || !ui) {
    console.error('Gear product page could not initialize: product data or UI helpers are unavailable.');
    return;
  }

  const productId = new URLSearchParams(window.location.search).get('product');
  const product = products.find((item) => item.id === productId);
  if (!product) {
    document.title = 'Product not found | FrameIQ Gear Store';
    host.innerHTML = `<section class="gear-product-not-found"><p class="gear-eyebrow"><span></span> FRAMEIQ GEAR STORE</p><h1>Product not found</h1><p>This product is not in the current catalog preview.</p><a class="gear-button gear-button--primary" href="gear.html">Return to Gear Store</a></section>`;
    return;
  }

  const related = products
    .filter((item) => item.id !== product.id)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3);

  document.title = `${product.name} | FrameIQ Gear Store`;
  host.innerHTML = `
    <div class="gear-container">
      <section class="gear-product-detail">
        <div class="gear-product-detail__visual photo-frame" data-photo="${ui.escapeHtml(product.imageSlot || 'gear-camera')}" data-photo-loading="eager"><img width="1600" height="900" decoding="async" hidden alt=""></div>
        <div class="gear-product-detail__info">
          <p class="gear-eyebrow"><span></span> ${ui.escapeHtml(product.category)}</p>
          <h1>${ui.escapeHtml(product.name)}</h1>
          ${product.descriptionPlaceholder || /^\s*\[Placeholder:/i.test(product.description || '') ? '' : `<p class="gear-product-detail__description">${ui.escapeHtml(product.description)}</p>`}
          <strong class="gear-product-detail__price">${ui.money(product.price)}</strong>
          <p class="gear-price-note">Indicative price. Confirm on enquiry.</p>
          <p class="gear-product-detail__availability">Stock status: ${ui.escapeHtml(product.stockStatus)}${product.estimatedDelivery && !product.estimatedDeliveryPlaceholder && !/^\s*\[Placeholder:/i.test(product.estimatedDelivery) ? ` · Estimated delivery: ${ui.escapeHtml(product.estimatedDelivery)}` : ''}</p>
          <div class="gear-product-detail__buttons"><button class="gear-button gear-button--secondary" type="button" data-product-enquiry="${ui.escapeHtml(product.id)}">Add to enquiry list</button><button class="gear-button gear-button--secondary" type="button" data-product-wishlist="${ui.escapeHtml(product.id)}">Save to wishlist</button><a class="gear-button gear-button--primary" href="../pages/contact.html?interest=hardware&amp;product=${encodeURIComponent(product.id)}">Book a Hardware Demo</a></div>
          <p class="gear-detail-note">Technical specifications, compatibility, delivery information, and current inventory are not provided in the product listing. Contact FrameIQ to confirm these details before selecting hardware.</p>
          <a class="gear-text-link" href="../pages/contact.html?interest=hardware&amp;product=${encodeURIComponent(product.id)}">Questions about this product? Contact FrameIQ <span aria-hidden="true">→</span></a>
        </div>
      </section>
      <section class="gear-detail-related" aria-labelledby="gear-related-title"><div class="gear-section-heading"><div><p class="gear-eyebrow"><span></span> EXPLORE MORE</p><h2 id="gear-related-title">Related products</h2></div><a href="gear.html" class="gear-text-link">View all gear <span aria-hidden="true">→</span></a></div><div class="gear-product-grid">${related.map((item) => ui.card(item, { compact: true })).join('')}</div></section>
    </div>`;
  window.initPhotos?.(host);
  const readIds = (key) => {
    try {
      const values = JSON.parse(localStorage.getItem(key) || '[]');
      return new Set(Array.isArray(values) ? values : []);
    } catch (error) {
      console.warn(`Gear product page could not read ${key}.`, error);
      return new Set();
    }
  };
  const addId = (key, id) => {
    try {
      const values = readIds(key);
      values.add(id);
      localStorage.setItem(key, JSON.stringify([...values]));
    } catch (error) {
      console.warn(`Gear product page could not save ${key}; this selection was not persisted.`, error);
    }
  };
  host.addEventListener('click', (event) => {
    const enquiryButton = event.target.closest('[data-product-enquiry]');
    const wishlistButton = event.target.closest('[data-product-wishlist]');
    if (enquiryButton) {
      addId('frameiq-gear-enquiry', enquiryButton.dataset.productEnquiry);
      enquiryButton.textContent = 'Added to enquiry list';
      enquiryButton.setAttribute('aria-pressed', 'true');
    }
    if (wishlistButton) {
      const saved = readIds('frameiq-gear-wishlist');
      const selected = saved.has(product.id);
      if (selected) saved.delete(product.id);
      else saved.add(product.id);
      try {
        localStorage.setItem('frameiq-gear-wishlist', JSON.stringify([...saved]));
      } catch (error) {
        console.warn('Gear product page could not save the wishlist; this selection was not persisted.', error);
      }
      wishlistButton.textContent = selected ? 'Save to wishlist' : 'Saved to wishlist';
      wishlistButton.setAttribute('aria-pressed', String(!selected));
    }
  });
})();
