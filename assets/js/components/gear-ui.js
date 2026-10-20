(() => {
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  const icon = (name, className = '') => {
    return `<i class="${window.iconClass(name)} ${escapeHtml(className)}" aria-hidden="true"></i>`;
  };

  const money = (amount) => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);

  const stockLabel = (product) => product.stockStatus || 'Check availability';
  const compatibilityBadges = (product) => Array.isArray(product.compatibility) && product.compatibility.length
    ? `<div class="gear-compatible"><span>Compatible with</span><ul class="gear-compatibility-badges" aria-label="Compatibility">${product.compatibility.map((tag) => `<li>${escapeHtml(tag)}</li>`).join('')}</ul></div>`
    : '';

  const isPlaceholder = (value, explicitlyPlaceholder) => explicitlyPlaceholder
    || typeof value !== 'string'
    || /^\s*\[Placeholder:/i.test(value);

  const card = (product, options = {}) => {
    if (options.compact) {
      return `
        <article class="gear-product-card gear-product-card--compact">
          <a class="gear-product-card__compact-media photo-frame" data-photo="${escapeHtml(product.imageSlot || 'gear-camera')}" data-photo-loading="lazy" href="gear-product.html?product=${encodeURIComponent(product.id)}" aria-label="View ${escapeHtml(product.name)}">
            <img width="800" height="450" alt="" hidden>
          </a>
          <div class="gear-product-card__compact-body"><p>${escapeHtml(product.category)}</p><h3><a href="gear-product.html?product=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3><strong>${money(product.price)}</strong><small>Indicative price. Confirm on enquiry.</small><a class="gear-text-link" href="gear-product.html?product=${encodeURIComponent(product.id)}">View product <span aria-hidden="true">→</span></a></div>
        </article>
      `;
    }
    const wished = options.wishlist?.has(product.id) || false;
    const compared = options.compare?.has(product.id) || false;
    return `
      <article class="gear-product-card" data-product-card="${escapeHtml(product.id)}">
        <div class="gear-product-card__media photo-frame" data-photo="${escapeHtml(product.imageSlot || 'gear-camera')}" data-photo-loading="lazy">
          <img width="800" height="450" alt="" hidden>
          <button class="gear-icon-button gear-product-card__wish${wished ? ' is-active' : ''}" type="button" data-action="wishlist" data-id="${escapeHtml(product.id)}" aria-label="${wished ? 'Remove from' : 'Add to'} wishlist: ${escapeHtml(product.name)}" aria-pressed="${wished}">${icon('heart')}</button>
        </div>
        <div class="gear-product-card__body">
          <div class="gear-product-card__meta"><span class="gear-product-card__category">${escapeHtml(product.category)}</span>${product.rating ? `<span class="gear-product-card__rating" aria-label="${escapeHtml(product.rating)} out of 5 stars">${escapeHtml(product.rating)}</span>` : ''}<span class="gear-product-card__availability">${escapeHtml(stockLabel(product))}</span></div>
          <h3><a href="gear-product.html?product=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3>
          ${isPlaceholder(product.description, product.descriptionPlaceholder) ? '' : `<p>${escapeHtml(product.description)}</p>`}
          ${compatibilityBadges(product)}
          ${isPlaceholder(product.estimatedDelivery, product.estimatedDeliveryPlaceholder) ? '' : `<p class="gear-product-card__delivery">Estimated delivery: ${escapeHtml(product.estimatedDelivery)}</p>`}
          <div class="gear-product-card__bottom">
            <span class="gear-product-card__price-wrap"><strong class="gear-product-card__price">${money(product.price)}</strong><small>Indicative price. Confirm on enquiry.</small></span>
            <button class="gear-compare-toggle${compared ? ' is-active' : ''}" type="button" data-action="compare" data-id="${escapeHtml(product.id)}" aria-pressed="${compared}">${icon('compare')}<span>${compared ? 'Selected' : 'Compare'}</span></button>
          </div>
          <div class="gear-product-card__actions">
            <button class="gear-button gear-button--secondary" type="button" data-action="details" data-id="${escapeHtml(product.id)}">View details</button>
            <button class="gear-button gear-button--primary" type="button" data-action="enquire" data-id="${escapeHtml(product.id)}">Add to enquiry</button>
          </div>
        </div>
      </article>
    `;
  };

  window.GearUI = { escapeHtml, icon, money, card };
})();
