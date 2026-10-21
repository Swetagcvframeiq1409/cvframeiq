(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = '.card, .sector-card, .gear-product-card, .blog-card, .as-card, .as-product-card, .feature-card, .pricing-card, .team-card, .faq-card, .role-card, .site-bento__card, .glossary-card, [class*="product-card"], [class*="__card"]';
  const timeline = document.querySelector('[data-process-story]');
  const steps = timeline ? [...timeline.querySelectorAll('.process-step')] : [];
  const scenes = timeline?.closest('.process-story-layout')?.querySelector('.process__visual');
  const revealAll = () => document.querySelectorAll('[data-reveal]').forEach((item) => {
    item.classList.add('is-visible');
    item.classList.remove('is-entering');
    item.style.setProperty('--reveal-delay', '0ms');
  });

  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  const targets = new Set();
  const add = (item, variant = 'up') => {
    if (!(item instanceof Element) || item.matches('.hero-enter, .camera-panel')) return;
    if (!item.hasAttribute('data-reveal')) item.setAttribute('data-reveal', variant);
    else if (!item.dataset.reveal) item.dataset.reveal = variant;
    targets.add(item);
    return item;
  };
  const prepare = (root = document) => {
    root.querySelectorAll('main section').forEach((section) => {
      section.classList.add('motion-divider');
      if (!section.querySelector(':scope > .motion-divider__line')) {
        const line = document.createElement('span');
        line.className = 'motion-divider__line';
        line.setAttribute('aria-hidden', 'true');
        section.prepend(line);
      }
    });
    root.querySelectorAll('main section, main > h1, main > .not-found__graphic, main > .eyebrow, main > .not-found__message, main > form, main > nav, main section .eyebrow, main section h1, main section h2, main section h3, main section p, main section blockquote, main section .section-head, main section .section-divider, main section article, main section table, main section [role="listitem"], footer .footer-col, #site-footer .footer-col').forEach((item) => {
      const variant = item.matches('.eyebrow') ? 'fade'
        : item.matches('main.not-found > h1, article, [role="listitem"]') ? 'scale' : 'up';
      add(item, variant);
    });
    root.querySelectorAll(cards).forEach((item) => add(item, 'scale'));
    root.querySelectorAll('[data-reveal], .reveal, [data-count]').forEach((item) => add(item));
    root.querySelectorAll('.process-story .process-step').forEach((item) => add(item, 'left'));
    root.querySelectorAll('.process-story-layout .process__visual').forEach((item) => add(item, 'right'));
    root.querySelectorAll('main section .section-head').forEach((head) => {
      const eyebrow = head.querySelector('.eyebrow');
      const title = head.querySelector('h2, h3');
      if (eyebrow) add(eyebrow, 'fade')?.style.setProperty('--reveal-delay', '0ms');
      if (title) add(title, 'up')?.style.setProperty('--reveal-delay', '80ms');
    });
    root.querySelectorAll('main :is([class*="grid"], [role="list"])').forEach((grid) => {
      const items = [...grid.children].filter((item) => item.matches(cards));
      items.slice(0, 10).forEach((item, index) => {
        add(item, 'scale');
        item.style.setProperty('--reveal-delay', `${index * 80}ms`);
      });
      if (grid.children.length === 2 && !items.length && getComputedStyle(grid).gridTemplateColumns.split(' ').length === 2) {
        [...grid.children].forEach((item, index) => add(item, index ? 'right' : 'left'));
      }
    });
    root.querySelectorAll('.footer-grid > .footer-col').forEach((item, index) => {
      add(item, 'up');
      item.style.setProperty('--reveal-delay', `${index * 80}ms`);
    });
  };

  prepare();
  document.documentElement.classList.add('js-motion');

  const countUp = (item) => {
    if (!item.hasAttribute('data-count') || item.dataset.counted) return;
    const target = Number(item.dataset.count);
    if (!Number.isFinite(target)) {
      console.error('Invalid motion count:', item.dataset.count);
      return;
    }
    item.dataset.counted = 'true';
    const finalText = item.textContent;
    item.setAttribute('aria-label', finalText);
    const decimals = Number(item.dataset.decimals || 0);
    const format = new Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 650, 1);
      item.textContent = format.format(target * progress);
      if (progress < 1) requestAnimationFrame(tick);
      else item.textContent = finalText;
    };
    requestAnimationFrame(tick);
  };

  const reveal = (item) => {
    item.classList.add('is-entering', 'is-visible');
    observer.unobserve(item);
    countUp(item);
  };
  const updateTimeline = (entry) => {
    const index = Number(entry.target.dataset.stepIndex || 0);
    steps.forEach((step, position) => {
      const active = position === index;
      step.classList.toggle('is-active', active);
      if (active) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
    });
    timeline.classList.add('is-visible');
    timeline.style.setProperty('--story-progress', String(index / Math.max(steps.length - 1, 1)));
    scenes?.querySelectorAll('.process-scene').forEach((scene, position) => {
      scene.classList.toggle('is-active', position === index);
      scene.setAttribute('aria-hidden', String(position !== index));
    });
  };
  const observer = new IntersectionObserver((entries) => {
    const activeSteps = [];
    entries.forEach((entry) => {
      if (entry.target.matches('.process-step') && entry.isIntersecting) activeSteps.push(entry);
      if (entry.isIntersecting && entry.target.hasAttribute('data-reveal')) reveal(entry.target);
      else if (entry.isIntersecting && entry.target === timeline) timeline.classList.add('is-visible');
    });
    if (activeSteps.length) {
      activeSteps.sort((a, b) => Math.abs(a.boundingClientRect.top + a.boundingClientRect.height / 2 - innerHeight / 2)
        - Math.abs(b.boundingClientRect.top + b.boundingClientRect.height / 2 - innerHeight / 2));
      updateTimeline(activeSteps[0]);
    }
  }, { threshold: [0, .12, .25, .5, .75, 1], rootMargin: '0px 0px -6% 0px' });

  targets.forEach((item) => {
    if (item.closest('[hidden], [inert], details:not([open])')) {
      item.classList.add('is-visible');
    } else if (item.getBoundingClientRect().top < innerHeight * .94) {
      item.classList.add('is-visible');
      countUp(item);
    } else observer.observe(item);
  });
  steps.forEach((step) => { if (!targets.has(step)) observer.observe(step); });

  const mutations = new MutationObserver((records) => records.forEach((record) => record.addedNodes.forEach((node) => {
    if (!(node instanceof Element)) return;
    if (node.matches('[data-reveal], .reveal, [data-count]') || node.matches(cards)) add(node, node.matches(cards) ? 'scale' : 'up');
    prepare(node);
    [ ...(node.matches('[data-reveal]') ? [node] : []), ...node.querySelectorAll('[data-reveal]') ].forEach((item) => {
      if (item.closest('[hidden], [inert], details:not([open])') || item.getBoundingClientRect().top < innerHeight * .94) {
        item.classList.add('is-visible');
      } else observer.observe(item);
    });
  })));
  document.querySelectorAll('main, #site-footer').forEach((root) => mutations.observe(root, { childList: true, subtree: true }));

  document.addEventListener('transitionend', (event) => {
    if (event.propertyName === 'opacity' && event.target instanceof Element) event.target.classList.remove('is-entering');
  });
  document.addEventListener('focusin', (event) => {
    const item = event.target.closest('[data-reveal]');
    if (item) reveal(item);
    document.getElementById(event.target.getAttribute('aria-controls'))?.querySelectorAll('[data-reveal]').forEach(reveal);
  }, true);
  document.addEventListener('toggle', (event) => {
    if (event.target instanceof HTMLDetailsElement && event.target.open) event.target.querySelectorAll('[data-reveal]').forEach(reveal);
  }, true);
  window.addEventListener('beforeprint', revealAll);
  window.setTimeout(() => {
    revealAll();
    observer.disconnect();
    mutations.disconnect();
  }, 2500);

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.hash || /^(mailto|tel):/i.test(link.href)) return;
    try {
      event.preventDefault();
      document.body.classList.add('page-exit');
      window.setTimeout(() => location.assign(url.href), 150);
    } catch (error) {
      console.warn('Page transition failed; navigating immediately.', error);
      location.assign(url.href);
    }
  });
})();
