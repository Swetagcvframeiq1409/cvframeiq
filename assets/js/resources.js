(() => {
  'use strict';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveal = () => {
    const items = [...document.querySelectorAll('.rs-reveal')];
    if (reduced || !('IntersectionObserver' in window)) { items.forEach((item) => item.classList.add('is-in')); return; }
    items.forEach((item) => {
      if (item.getBoundingClientRect().top <= window.innerHeight) item.classList.add('is-in');
    });
    document.documentElement.classList.add('rs-js');
    const observer = new IntersectionObserver((entries, current) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); current.unobserve(entry.target); }
    }), { threshold: 0.15 });
    items.forEach((item) => observer.observe(item));
    window.setTimeout(() => items.forEach((item) => item.classList.add('is-in')), 2500);
  };
  const filterList = ({ root, chipSelector, itemSelector, searchInput, emptyEl, countFormatter, onRender }) => {
    const chips = [...root.querySelectorAll(chipSelector)];
    const items = [...root.querySelectorAll(itemSelector)];
    const count = root.querySelector('[aria-live="polite"]');
    let category = 'All';
    const render = () => {
      const query = searchInput.value.trim().toLowerCase();
      const queryWords = query.split(/\s+/).filter(Boolean);
      let visible = 0;
      items.forEach((item) => {
        const searchText = item.dataset.search || item.textContent;
        const match = (category === 'All' || item.dataset.cat === category)
          && (!query || queryWords.every((word) => new RegExp(`(^|[^a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=$|[^a-z0-9])`, 'i').test(searchText)));
        item.hidden = !match; if (match) visible += 1;
      });
      chips.forEach((chip) => chip.classList.toggle('is-active', chip.dataset.cat === category));
      emptyEl.hidden = visible !== 0;
      if (count) count.textContent = typeof countFormatter === 'function'
        ? countFormatter(visible)
        : `${visible} ${visible === 1 ? 'article' : 'articles'}`;
      if (typeof onRender === 'function') onRender(visible);
    };
    chips.forEach((chip) => chip.addEventListener('click', () => { category = chip.dataset.cat; render(); }));
    searchInput.addEventListener('input', render);
    render();
  };
  const progressBar = () => {
    const fill = document.querySelector('.rs-progress span');
    if (!fill) return;
    const update = () => { const max = document.documentElement.scrollHeight - innerHeight; fill.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`; };
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
  };
  const scrollSpy = ({ links, targets }) => {
    const linkNodes = [...links];
    const targetNodes = [...targets];
    if (!linkNodes.length || !targetNodes.length || !('IntersectionObserver' in window)) return;
    const activate = (id) => linkNodes.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) activate(visible.target.id);
    }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });
    targetNodes.forEach((target) => observer.observe(target));
  };
  window.RS = { reveal, filterList, scrollSpy, progressBar };
})();
