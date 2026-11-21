(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('main[data-no-global-cta]').forEach(function (mainEl) {
    var ctaMatch = function (node) {
      if (!node || !(node instanceof Element)) return false;
      if (node.classList && node.classList.contains('gk-cta')) return true;
      var text = (node.textContent || '').replace(/\s+/g, ' ').trim();
      return text.indexOf('Ready to Deploy AI That Actually Works?') !== -1 || text.indexOf('Working in agriculture?') !== -1;
    };
    Array.prototype.slice.call(mainEl.querySelectorAll('.gk-cta, section, .pp-cta-band')).forEach(function (node) {
      if (ctaMatch(node)) node.remove();
    });
  });

  /* ── workflow scroll observer + click ── */
  document.querySelectorAll('[data-pp-workflow]').forEach(function (wrap) {
    var cards = Array.prototype.slice.call(wrap.querySelectorAll('.pp-step-card'));
    var imgs  = Array.prototype.slice.call(wrap.querySelectorAll('.pp-workflow-img'));
    if (!cards.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('is-on'); });
      imgs.forEach(function (im, i) { im.classList.toggle('active', i === 0); });
      return;
    }

    function activate(idx) {
      cards.forEach(function (c, i) { c.classList.toggle('is-on', i === idx); });
      imgs.forEach(function (im, i) { im.classList.toggle('active', i === idx); });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = cards.indexOf(entry.target);
        if (idx !== -1) activate(idx);
      });
    }, { rootMargin: '-45% 0px -45% 0px' });

    cards.forEach(function (c, i) {
      io.observe(c);
      c.addEventListener('click', function () { activate(i); });
    });
    activate(0);
  });
})();
