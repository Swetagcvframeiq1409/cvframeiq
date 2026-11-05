/* about-page.js - About page only. Scroll progress for the pinned sections. */
(function () {
  'use strict';
  var root = document.querySelector('.ab');
  if (!root) return;

  var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mob = window.matchMedia('(max-width: 767px)');
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  // 0 -> 1 while a tall section scrolls past (sticky stage inside)
  function prog(el) {
    var r = el.getBoundingClientRect();
    var total = r.height - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }

  var story = root.querySelector('[data-ab-story]');
  var vm = root.querySelector('[data-ab-vm]');
  var journey = root.querySelector('[data-ab-journey]');
  var media = root.querySelector('[data-ab-media]');
  var growth = root.querySelector('[data-ab-growth]');
  var statement = root.querySelector('[data-ab-words]');

  // split statement into words
  var words = [];
  if (statement) {
    var parts = statement.textContent.trim().split(/\s+/);
    statement.textContent = '';
    parts.forEach(function (w, i) {
      var s = document.createElement('span');
      s.textContent = w;
      statement.appendChild(s);
      if (i < parts.length - 1) statement.appendChild(document.createTextNode(' '));
      words.push(s);
    });
  }

  // values journey set up
  var items = journey ? [].slice.call(journey.querySelectorAll('.ab-vtext li')) : [];
  var nodesBox = journey ? journey.querySelector('.ab-nodes') : null;
  var ring = journey ? journey.querySelector('.ab-ring-big') : null;
  var nodes = [];
  if (journey) {
    journey.style.setProperty('--n', items.length);
    items.forEach(function (li, i) {
      var n = document.createElement('div');
      n.className = 'ab-node';
      n.textContent = (i < 9 ? '0' : '') + (i + 1);
      nodesBox.appendChild(n);
      nodes.push(n);
    });
  }

  function setStatic() {
    var reduced = rm.matches;
    if (story) story.classList.toggle('is-static', reduced);
    if (vm) vm.classList.toggle('is-static', reduced);
    if (journey) journey.classList.toggle('is-static', reduced);
  }

  function update() {
    var vh = window.innerHeight;
    var reduced = rm.matches;

    if (media) {
      var r = media.getBoundingClientRect();
      media.style.setProperty('--p', reduced ? 1 : clamp((vh - r.top) / (vh * 0.75), 0, 1).toFixed(3));
    }

    if (story && !story.classList.contains('is-static')) {
      var p = prog(story);
      var step = p < 0.26 ? 0 : p < 0.4 ? 1 : p < 0.56 ? 2 : p < 0.72 ? 3 : 4;
      if (story.getAttribute('data-step') !== String(step)) story.setAttribute('data-step', step);
    }

    if (growth) {
      var g = growth.getBoundingClientRect();
      if (g.top < vh * 0.85) growth.classList.add('in');
    }

    if (statement && words.length) {
      var s = statement.getBoundingClientRect();
      var sp = reduced ? 1 : clamp((vh * 0.85 - s.top) / (vh * 0.5), 0, 1);
      var lit = Math.round(sp * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('on', i < lit);
    }

    if (vm && !vm.classList.contains('is-static')) {
      var vp = prog(vm);
      var els = vm.querySelectorAll('.ab-vm__item');
      els[0].classList.toggle('is-on', vp < 0.5);
      els[1].classList.toggle('is-on', vp >= 0.5);
    }

    if (journey && !journey.classList.contains('is-static')) {
      var jp = prog(journey);
      var n = nodes.length;
      var f = jp * (n - 1);
      var idx = Math.round(f);
      var stage = journey.querySelector('.ab-jstage');
      var h = stage.clientHeight;
      var m = mob.matches;
      var D = m ? 520 : 900, th = m ? 44 : 64, left = m ? -400 : -560, stepDeg = m ? 18 : 15;
      var R = D / 2 - th / 2, cx = left + D / 2, cy = h * (m ? 0.42 : 0.5);
      ring.style.width = ring.style.height = D + 'px';
      ring.style.borderWidth = th + 'px';
      ring.style.left = left + 'px';
      ring.style.top = (cy - D / 2) + 'px';
      for (var k = 0; k < n; k++) {
        var d = k - f, ad = Math.abs(d), a = d * stepDeg * Math.PI / 180;
        var x = cx + R * Math.cos(a) - 28, y = cy + R * Math.sin(a) - 28;
        var sc = 1 + clamp(1 - ad, 0, 1) * 0.55;
        nodes[k].style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) scale(' + sc.toFixed(3) + ')';
        nodes[k].style.opacity = clamp(1 - ad / 4.2, 0, 1).toFixed(2);
        nodes[k].classList.toggle('on', k === idx);
        items[k].classList.toggle('on', k === idx);
      }
    }
  }

  // reveal on view
  var rv = root.querySelectorAll('.ab-rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    rv.forEach(function (el) { io.observe(el); });
  } else {
    rv.forEach(function (el) { el.classList.add('in'); });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { ticking = false; update(); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { setStatic(); onScroll(); });
  if (rm.addEventListener) { rm.addEventListener('change', function () { setStatic(); onScroll(); }); mob.addEventListener('change', function () { setStatic(); onScroll(); }); }

  setStatic();
  update();
})();
