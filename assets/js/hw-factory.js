(() => {
  'use strict';
  const root = document.querySelector('[data-hardware-factory]');
  if (!root) return;
  const products = (window.HARDWARE_PRODUCTS || []).filter((item) => ['industrial-cv-camera', 'ai-vision-pro-camera', 'multi-sensor-array-kit'].includes(item.id));
  const icons = { 'Vision Systems': 'bi-camera-video', 'Sensor Kits': 'bi-broadcast' };
  const money = (value) => `&#8377;${value.toLocaleString('en-IN')}`;
  root.querySelector('[data-factory-products]').innerHTML = products.map((product) => `<article class="hw-factory-product gk-card hw-reveal"><i class="bi ${icons[product.category] || 'bi-box-seam'}" aria-hidden="true"></i><h3>${product.name}</h3><p>${product.category} <i class="bi bi-star-fill" aria-hidden="true"></i> ${product.rating}</p><strong class="hw-factory-product__meta">${money(product.price)}</strong>${product.stock === 'out' ? '<span class="hw-factory-stock">Out of Stock</span>' : ''}<a href="gear.html?cat=${product.category.toLowerCase().replace(/\s+/g, '-')}">View in Gear Store <i class="bi bi-arrow-right" aria-hidden="true"></i></a></article>`).join('');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panel = root.querySelector('[role="tabpanel"]');
  const tabImgFrame = panel.querySelector('.hw-tab-img-frame');
  const tabImages = [...tabImgFrame.querySelectorAll('.hw-tab-img-frame__image')];
  const imagePromises = new Map();
  let activeImage = tabImages.find((image) => image.classList.contains('is-current')) || null;
  let imageRequest = 0;
  function preloadImage(src) {
    if (!imagePromises.has(src)) {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
      imagePromises.set(src, image.decode().then(() => src, (error) => {
        imagePromises.delete(src);
        throw error;
      }));
    }
    return imagePromises.get(src);
  }

  async function showTabImage(tab) {
    const src = tab.dataset.img;
    if (!src) return;
    const request = ++imageRequest;
    if (activeImage?.getAttribute('src') === src) return;
    try {
      await preloadImage(src);
      if (request !== imageRequest) return;
      const nextImage = activeImage === tabImages[0] ? tabImages[1] : tabImages[0];
      nextImage.src = src;
      nextImage.alt = tab.dataset.imgAlt || '';
      await nextImage.decode();
      if (request !== imageRequest) return;
      nextImage.classList.add('is-current');
      activeImage?.classList.remove('is-current');
      activeImage = nextImage;
      tabImgFrame.classList.remove('img-failed');
      tabImgFrame.classList.add('is-loaded');
    } catch (error) {
      if (request === imageRequest) console.error(`Unable to decode Smart Factory tab image: ${src}`, error);
    }
  }

  const activate = (index, focus = false) => {
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const activeTab = tabs[index];
    panel.setAttribute('aria-labelledby', activeTab.id);
    panel.querySelector('h3').textContent = activeTab.dataset.title;
    const summary = panel.querySelector('p');
    summary.replaceChildren();
    if (activeTab.hasAttribute('data-draft')) {
      const draft = document.createElement('span');
      draft.className = 'gk-draft';
      draft.textContent = activeTab.dataset.content;
      summary.append(draft);
    } else {
      summary.textContent = activeTab.dataset.content;
    }
    const link = panel.querySelector('[data-tab-link]');
    if (activeTab.dataset.href && activeTab.dataset.link) {
      link.hidden = false;
      link.href = activeTab.dataset.href;
      link.replaceChildren(document.createTextNode(`${activeTab.dataset.link} `));
      const icon = document.createElement('i');
      icon.className = 'bi bi-arrow-right';
      icon.setAttribute('aria-hidden', 'true');
      link.append(icon);
    } else {
      link.hidden = true;
    }
    void showTabImage(activeTab);
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
  const preloadRemainingImages = () => tabs.forEach((tab) => {
    if (tab.dataset.img) {
      void preloadImage(tab.dataset.img).catch((error) => {
        console.error(`Unable to preload Smart Factory tab image: ${tab.dataset.img}`, error);
      });
    }
  });
  if ('requestIdleCallback' in window) window.requestIdleCallback(preloadRemainingImages, { timeout: 1500 });
  else window.setTimeout(preloadRemainingImages, 0);
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
