// gk.js - adds a calm scroll reveal to normal sections on every page.
// It skips the home pinned sections and anything that already animates itself.
(function () {
  'use strict';

  var main = document.getElementById('main-content');
  if (!main) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SKIP = '[class*="story"],[class*="stack"],[class*="bento"],.hero,.reveal-up,[data-count],.fx-w,[data-scroll-story]';

  function prepareVisible(item) {
    item.classList.add('is-in');
    item.style.transform = '';
    item.style.opacity = '';
    item.style.clipPath = '';
    item.style.mask = '';
    item.style.filter = '';
    item.style.overflow = '';
  }

  if (reduce || !('IntersectionObserver' in window)) {
    main.querySelectorAll('section, h2, h3, p, ul, [class*="grid"] > *, [class*="card"]').forEach(function (item) {
      if (item.matches(SKIP) || item.closest(SKIP)) return;
      prepareVisible(item);
    });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      prepareVisible(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.01, rootMargin: '-5% 0px' });

  function mark() {
    main.querySelectorAll('section').forEach(function (sec) {
      if (sec.matches(SKIP) || sec.closest(SKIP)) return;
      var kids = [];
      Array.prototype.forEach.call(sec.querySelectorAll('h2, h3, p, ul, [class*="grid"] > *, [class*="card"]'), function (n) {
        if (n.closest(SKIP) && n.closest(SKIP) !== sec) return;
        if (n.classList.contains('gk-r') || n.closest('.gk-r')) return;
        kids.push(n);
      });
      kids.slice(0, 24).forEach(function (n, i) {
        n.classList.add('gk-r');
        n.style.setProperty('--gk-d', Math.min(i, 6) * 70 + 'ms');
        io.observe(n);
      });
    });
  }

  window.addEventListener('load', function () {
    mark();
  }, { once: true });
})();
