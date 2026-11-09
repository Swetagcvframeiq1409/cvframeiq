(() => {
  'use strict';
  const root = document.querySelector('[data-hardware-edge]');
  if (!root) return;
  const money = (value) => `&#8377;${value.toLocaleString('en-IN')}`;
  const products = (window.HARDWARE_PRODUCTS || []).filter((item) => ['Processing Units', 'Development Boards', 'Vision Systems'].includes(item.category) && ['edge-ai-processor-x1', 'nvidia-jetson-kit', 'raspberry-pi-ai-dev-board', 'ai-vision-pro-camera'].includes(item.id));
  const icons = { 'Processing Units': 'bi-cpu', 'Development Boards': 'bi-motherboard', 'Vision Systems': 'bi-camera-video' };
  root.querySelector('[data-edge-products]').innerHTML = products.map((product) => `<article class="hw-edge-product gk-card hw-reveal"><i class="bi ${icons[product.category]}" aria-hidden="true"></i><h3>${product.name}</h3><p>${product.category} <i class="bi bi-star-fill" aria-hidden="true"></i> ${product.rating}</p><strong class="hw-edge-product__price">${money(product.price)}</strong><a class="hw-edge-product__link" href="gear.html?cat=${product.category.toLowerCase().replace(/\s+/g, '-')}">View in Gear Store <i class="bi bi-arrow-right" aria-hidden="true"></i></a></article>`).join('');
  const faqSection = root.querySelector('.hw-edge-faq');
  const faqContainer = root.querySelector('[data-edge-faq]');
  const faqData = window.FAQ_DATA || [];
  const faqItems = [
    'Do I need existing AI/ML infrastructure?',
    'Is my data secure? Can I deploy on-premise?',
    'Can FrameIQ work with our existing ERP or PLC systems?'
  ].map((question) => {
    const item = faqData.find((entry) => entry.question === question);
    return item && item.answer && !/^\[placeholder/i.test(item.answer)
      ? `<details><summary>${question}</summary><p>${item.answer}</p></details>`
      : '';
  }).filter(Boolean);
  if (faqItems.length) {
    faqContainer.innerHTML = faqItems.join('');
    faqSection.hidden = false;
  }
  const reveals = [...root.querySelectorAll('.hw-reveal')];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) reveals.forEach((item) => item.classList.add('is-visible'));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .12 });
    reveals.forEach((item) => observer.observe(item));
  }
  const counters = [...root.querySelectorAll('[data-count-up]')];
  const showCounter = (element) => { element.textContent = element.dataset.countUp; };
  if (reduced) counters.forEach(showCounter);
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { showCounter(entry.target); observer.unobserve(entry.target); } }), { threshold: .5 });
    counters.forEach((item) => observer.observe(item));
  }
  const stepsWrap = root.querySelector('.hw-edge-process__steps-wrap');
  const progressTrack = root.querySelector('.hw-edge-process__progress');
  const progressFill = root.querySelector('[data-process-progress]');
  const steps = [...root.querySelectorAll('.hw-edge-step')];
  if (stepsWrap && progressTrack && progressFill && steps.length > 1) {
    let updateQueued = false;
    let firstCenter = 0;
    let lastCenter = 0;
    const measureProgress = () => {
      const wrapBox = stepsWrap.getBoundingClientRect();
      const firstBadge = steps[0].querySelector('.hw-edge-step__number').getBoundingClientRect();
      const lastBadge = steps.at(-1).querySelector('.hw-edge-step__number').getBoundingClientRect();
      firstCenter = firstBadge.top + scrollY + firstBadge.height / 2;
      lastCenter = lastBadge.top + scrollY + lastBadge.height / 2;
      progressTrack.style.left = `${firstBadge.left - wrapBox.left + firstBadge.width / 2}px`;
      progressTrack.style.top = `${firstBadge.top - wrapBox.top + firstBadge.height / 2}px`;
      progressTrack.style.height = `${Math.max(0, lastCenter - firstCenter)}px`;
    };
    const updateProgress = () => {
      const distance = lastCenter - firstCenter;
      const progress = distance > 0 ? Math.max(0, Math.min(1, (scrollY + innerHeight - firstCenter) / distance)) : 0;
      progressFill.style.height = `${progress * 100}%`;
    };
    const update = () => {
      updateQueued = false;
      measureProgress();
      updateProgress();
    };
    const queueUpdate = () => {
      if (updateQueued) return;
      updateQueued = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', queueUpdate, { passive: true });
    window.addEventListener('resize', queueUpdate, { passive: true });
    document.fonts.ready.then(queueUpdate);
    update();
  }
})();
