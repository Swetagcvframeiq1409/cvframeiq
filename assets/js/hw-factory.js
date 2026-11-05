(() => {
  'use strict';
  const root = document.querySelector('[data-hardware-factory]');
  if (!root) return;
  const products = (window.HARDWARE_PRODUCTS || []).filter((item) => ['industrial-cv-camera', 'ai-vision-pro-camera', 'multi-sensor-array-kit'].includes(item.id));
  const icons = { 'Vision Systems': 'bi-camera-video', 'Sensor Kits': 'bi-broadcast' };
  const money = (value) => `&#8377;${value.toLocaleString('en-IN')}`;
  root.querySelector('[data-factory-products]').innerHTML = products.map((product) => `<article class="hw-factory-product hw-reveal"><i class="bi ${icons[product.category] || 'bi-box-seam'}" aria-hidden="true"></i><h3>${product.name}</h3><p>${product.category} <i class="bi bi-star-fill" aria-hidden="true"></i> ${product.rating}</p><strong class="hw-factory-product__meta">${money(product.price)}</strong>${product.stock === 'out' ? '<span class="hw-factory-stock">Out of Stock</span>' : ''}<a href="gear.html?cat=${product.category.toLowerCase().replace(/\s+/g, '-')}">View in Gear Store <i class="bi bi-arrow-right" aria-hidden="true"></i></a></article>`).join('');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panel = root.querySelector('[role="tabpanel"]');
  const activate = (index, focus = false) => {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const activeTab = tabs[index];
    panel.setAttribute('aria-labelledby', activeTab.id);
    panel.querySelector('h3').textContent = activeTab.dataset.title;
    const link = panel.querySelector('[data-tab-link]');
    link.href = activeTab.dataset.href;
    link.innerHTML = `${activeTab.dataset.link} <i class="bi bi-arrow-right" aria-hidden="true"></i>`;
    if (focus) activeTab.focus();
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : -1) + tabs.length) % tabs.length;
      activate(next, true);
    });
  });
  activate(0);
  const reveal = [...root.querySelectorAll('.hw-reveal')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) reveal.forEach((item) => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
    reveal.forEach((item) => observer.observe(item));
  }
  const counters = [...root.querySelectorAll('[data-count-up]')];
  const displayCounter = (element) => { element.textContent = element.dataset.countUp; };
  if (reduced) counters.forEach(displayCounter);
  else {
    const counterObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { displayCounter(entry.target); counterObserver.unobserve(entry.target); }
    }), { threshold: .6 });
    counters.forEach((item) => counterObserver.observe(item));
  }
})();
