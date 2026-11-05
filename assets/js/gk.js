// gk.js - adds a calm scroll reveal to normal sections on every page.
// It skips the home pinned sections and anything that already animates itself.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
  var main = document.getElementById('main-content');
  if (!main) return;
  var SKIP = '[class*="story"],[class*="stack"],[class*="bento"],.hero,.reveal-up,[data-count],.fx-w,[data-scroll-story]';
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  function mark() {
    main.querySelectorAll('section').forEach(function (sec) {
      if (sec.matches(SKIP) || sec.closest(SKIP)) return;
      // the heading block and then each direct child of the first grid/list get a small stagger
      var kids = [];
      Array.prototype.forEach.call(sec.querySelectorAll('h2, h3, p, ul, [class*="grid"] > *, [class*="card"]'), function (n) {
        if (n.closest(SKIP) && n.closest(SKIP) !== sec) return;
        if (n.classList.contains('gk-r') || n.closest('.gk-r')) return;
        kids.push(n);
      });
      kids.slice(0, 24).forEach(function (n, i) {
        n.classList.add('gk-r'); n.style.setProperty('--gk-d', Math.min(i, 6) * 70 + 'ms'); io.observe(n);
      });
    });
  }
  // run after the page JS has built its own content
  window.addEventListener('load', function () { setTimeout(mark, 250); });
})();
