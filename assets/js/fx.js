// fx.js - small motion effects for every page (no libraries).
// 1) heading words slide up   2) numbers count up   3) cards get a cursor glow   4) buttons pull toward the cursor
// Everything is skipped when the visitor asks for reduced motion.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (reduce) return;

  // change these lists if a class name on your page is different
  var HEADINGS = '#main-content h2';
  var SKIP_HEADINGS = '.home-statement, .home-story, .site-bento-section, .pillar-card, [data-no-split]';
  var COUNTERS = '.live-impact-metric strong, .home-stat-band strong, [data-count]';
  var CARDS = '.card, .ab-card, .focus-card, .why-card, .role-card, .blog-card, .about-timeline__card';
  var BUTTONS = '.btn, .button';

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      if (en.target.classList.contains('fx-split')) en.target.classList.add('fx-in');
      else countUp(en.target);
    });
  }, { threshold: 0.35 }) : null;

  // 1) split a heading into words (keeps child tags such as gradient spans)
  function splitHeading(h) {
    if (h.closest(SKIP_HEADINGS) || h.classList.contains('fx-split')) return;
    if (h.closest('.gk-acc, .gk-acc__item, [data-gk-acc]')) return;
    if (h.querySelector('.gk-acc__q')) return;
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3 && n.textContent.trim()) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span'); w.className = 'fx-w';
            var inner = document.createElement('span'); inner.className = 'fx-wi';
            inner.style.transitionDelay = (i++ * 55) + 'ms';
            inner.textContent = part; w.appendChild(inner); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(h);
    h.classList.add('fx-split');
    if (io) io.observe(h); else h.classList.add('fx-in');
  }
  document.querySelectorAll(HEADINGS).forEach(splitHeading);

  // 2) count up numbers like 7+, 99.2%, <200ms (text such as 24/7 is left alone)
  function parse(el) {
    var m = el.textContent.trim().match(/^([<>~]?)(\d+(?:\.\d+)?)(.*)$/);
    if (!m || /[\/]/.test(m[3])) return null;
    return { pre: m[1], num: parseFloat(m[2]), dec: (m[2].split('.')[1] || '').length, post: m[3] };
  }
  document.querySelectorAll(COUNTERS).forEach(function (el) {
    var p = parse(el); if (!p) return;
    el._fx = p; el.setAttribute('aria-label', el.textContent.trim());
    el.textContent = p.pre + (0).toFixed(p.dec) + p.post;
    if (io) io.observe(el);
  });
  function countUp(el) {
    var p = el._fx; if (!p) return;
    var start = null, dur = 1400;
    function tick(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = p.pre + (p.num * e).toFixed(p.dec) + p.post;
      if (k < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (!fine) return;
  // 3) cursor glow on cards (sets --mx / --my; the glow itself is in fx.css)
  // only cards that are already positioned get the glow, so no layout can break
  document.querySelectorAll(CARDS).forEach(function (c) {
    if (getComputedStyle(c).position !== 'static') c.classList.add('fx-glow');
  });
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest(CARDS);
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  // 4) magnetic buttons: move up to 6px toward the cursor
  document.querySelectorAll(BUTTONS).forEach(function (b) {
    b.addEventListener('pointermove', function (e) {
      var r = b.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 12;
      var y = ((e.clientY - r.top) / r.height - 0.5) * 8;
      b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
    });
    b.addEventListener('pointerleave', function () { b.style.transform = ''; });
  });
})();
