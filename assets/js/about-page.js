/* about-page.js */
(function () {
  'use strict';

  var root = document.querySelector('.ab');
  if (!root) return;

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var mobileBreak  = window.matchMedia('(max-width: 860px)');

  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }

  function sectionProgress(el) {
    var r = el.getBoundingClientRect();
    var d = r.height - window.innerHeight;
    return d > 0 ? clamp(-r.top / d, 0, 1) : 0;
  }

  /* ── Sections ── */
  var story     = root.querySelector('[data-ab-story]');
  var vision    = root.querySelector('[data-ab-vm]');
  var journey   = root.querySelector('[data-ab-journey]');
  var growth    = root.querySelector('[data-ab-growth]');
  var statement = root.querySelector('[data-ab-words]');
  var words     = [];

  /* ── Word-reveal for statement ── */
  if (statement) {
    var parts = statement.textContent.trim().split(/\s+/);
    statement.textContent = '';
    parts.forEach(function (word, i) {
      var span = document.createElement('span');
      span.textContent = word;
      if (/^(indian|industry|autonomous|decisions)[.,]?$/.test(word.toLowerCase())) {
        span.classList.add('ab-highlight');
      }
      statement.appendChild(span);
      if (i < parts.length - 1) statement.appendChild(document.createTextNode(' '));
      words.push(span);
    });
  }

  /* ── Core Values (journey) ── */
  var valueItems  = journey ? Array.prototype.slice.call(journey.querySelectorAll('.ab-vtext li')) : [];
  var nodesBox    = journey ? journey.querySelector('.ab-nodes') : null;
  var ring        = journey ? journey.querySelector('.ab-ring-big') : null;
  var counterEl   = journey ? journey.querySelector('.ab-jcounter') : null;
  var progressBar = journey ? journey.querySelector('.ab-jprogress__bar') : null;
  var prevBtn     = journey ? journey.querySelector('.ab-jprev') : null;
  var nextBtn     = journey ? journey.querySelector('.ab-jnext') : null;
  var nodes       = [];
  var manualIndex = null;
  var manualScrollY = null;
  var count       = valueItems.length;

  function isJourneyStatic() {
    return !journey || journey.classList.contains('is-static') || mobileBreak.matches;
  }

  function setActiveIndex(idx) {
    var bounded = clamp(idx, 0, count - 1);
    if (manualIndex === bounded) return;
    manualIndex = bounded;
    manualScrollY = window.scrollY;
    renderJourney(bounded);
  }

  function renderJourney(activeIndex) {
    if (isJourneyStatic()) return;

    /* update value text */
    valueItems.forEach(function (item, i) {
      item.classList.toggle('on', i === activeIndex);
    });

    /* update counter */
    if (counterEl) {
      counterEl.textContent =
        String(activeIndex + 1).padStart(2, '0') + ' / ' +
        String(count).padStart(2, '0');
    }

    /* update progress bar */
    if (progressBar) {
      progressBar.style.width = ((activeIndex / Math.max(count - 1, 1)) * 100).toFixed(1) + '%';
    }

    /* update nodes */
    if (!nodes.length) return;

    var stage      = journey.querySelector('.ab-jstage');
    var arcArea    = journey.querySelector('.ab-arc-area');
    if (!arcArea) return;

    var areaH      = arcArea.clientHeight;
    var areaW      = arcArea.clientWidth;
    var isSmall    = window.innerWidth < 900;
    var diameter   = isSmall ? 520 : 900;
    var thickness  = 48;
    var leftOffset = isSmall ? -380 : -520;
    var angleStep  = isSmall ? 18 : 15;
    var radius     = diameter / 2 - thickness / 2;
    var centerX    = leftOffset + diameter / 2;
    var centerY    = areaH * 0.5;

    ring.style.width       = diameter + 'px';
    ring.style.height      = diameter + 'px';
    ring.style.borderWidth = thickness + 'px';
    ring.style.left        = leftOffset + 'px';
    ring.style.top         = (centerY - diameter / 2) + 'px';

    nodes.forEach(function (node, i) {
      var dist  = i - activeIndex;
      var angle = dist * angleStep * Math.PI / 180;
      var x     = centerX + radius * Math.cos(angle) - 28;
      var y     = centerY + radius * Math.sin(angle) - 28;
      var op    = clamp(1 - Math.abs(dist) / 4.2, 0.55, 1);
      node.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      node.style.opacity   = op.toFixed(2);
      node.classList.toggle('on', i === activeIndex);
      node.setAttribute('aria-pressed', String(i === activeIndex));
    });
  }

  function updateJourneyFromScroll() {
    if (isJourneyStatic() || !journey) return;
    var progress = sectionProgress(journey);
    var scrolledIndex = Math.min(count - 1, Math.floor(progress * count));
    var active = manualIndex !== null ? manualIndex : scrolledIndex;
    renderJourney(active);
  }

  /* build nodes */
  if (journey && nodesBox && count > 0) {
    journey.style.setProperty('--n', count);
    valueItems.forEach(function (item, i) {
      var node = document.createElement('button');
      node.type = 'button';
      node.className = 'ab-node';
      node.textContent = String(i + 1).padStart(2, '0');
      node.setAttribute('aria-label', 'Show value ' + String(i + 1).padStart(2, '0') + ': ' + (item.querySelector('h3') ? item.querySelector('h3').textContent : ''));
      node.setAttribute('aria-pressed', 'false');
      nodesBox.appendChild(node);
      nodes.push(node);
    });
  }

  /* prev / next buttons */
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      setActiveIndex((manualIndex === null ? 0 : manualIndex) - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      setActiveIndex((manualIndex === null ? 0 : manualIndex) + 1);
    });
  }

  /* node clicks */
  if (journey) {
    journey.addEventListener('click', function (e) {
      var target = e.target.closest('.ab-node');
      if (target) setActiveIndex(nodes.indexOf(target));
    });

    /* keyboard */
    journey.addEventListener('keydown', function (e) {
      if (isJourneyStatic()) return;
      if (!journey.contains(document.activeElement)) return;
      var cur = manualIndex === null ? 0 : manualIndex;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault(); setActiveIndex(cur + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); setActiveIndex(cur - 1);
      }
    });

    /* touch swipe */
    var touchStartX = null;
    journey.addEventListener('touchstart', function (e) {
      if (isJourneyStatic() || !e.changedTouches.length) return;
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    journey.addEventListener('touchend', function (e) {
      if (touchStartX === null || !e.changedTouches.length) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) > 40) {
        setActiveIndex((manualIndex === null ? 0 : manualIndex) + (dx < 0 ? 1 : -1));
      }
    }, { passive: true });
  }

  /* ── Static layout toggle ── */
  function applyStaticLayout() {
    var isStatic = reducedMotion.matches || mobileBreak.matches;
    if (story)   story.classList.toggle('is-static', isStatic);
    if (vision)  vision.classList.toggle('is-static', isStatic);
    if (journey) journey.classList.toggle('is-static', isStatic);
    if (isStatic) {
      if (story) story.setAttribute('data-step', '4');
      manualIndex = null;
      manualScrollY = null;
    }
  }

  /* ── Main update loop ── */
  function update() {
    var vh = window.innerHeight;
    var isReduced = reducedMotion.matches;

    /* who/what/why story */
    if (story && !story.classList.contains('is-static')) {
      var sp = sectionProgress(story);
      var step = sp < .12 ? 1 : sp < .34 ? 2 : sp < .58 ? 3 : 4;
      if (story.getAttribute('data-step') !== String(step)) story.setAttribute('data-step', String(step));
    }

    /* growth bars */
    if (growth) {
      var gr = growth.getBoundingClientRect();
      var rise = isReduced ? 1 : clamp((vh - gr.top) / (gr.height * .72), 0, 1);
      growth.style.setProperty('--line-progress', rise.toFixed(3));
    }

    /* word reveal */
    if (statement && words.length) {
      var sr = statement.getBoundingClientRect();
      var sp2 = isReduced ? 1 : clamp((vh * .88 - sr.top) / (sr.height + vh * .55), 0, 1);
      var lit = Math.round(sp2 * words.length);
      words.forEach(function (w, i) { w.classList.toggle('on', i < lit); });
    }

    /* vision band */
    if (vision && !vision.classList.contains('is-static')) {
      var vp = sectionProgress(vision);
      var vi = vision.querySelectorAll('.ab-vm__item');
      vi[0].classList.toggle('is-on', vp < .5);
      vi[1].classList.toggle('is-on', vp >= .5);
    }

    /* journey */
    updateJourneyFromScroll();
  }

  /* ── Reveal observer ── */
  var revealItems = root.querySelectorAll('.ab-rv');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); obs.unobserve(entry.target); }
      });
    }, { threshold: .12 });
    revealItems.forEach(function (el) { obs.observe(el); });
  } else {
    revealItems.forEach(function (el) { el.classList.add('in'); });
  }
  root.classList.add('ab-motion-ready');

  /* ── Card spotlight ── */
  root.querySelectorAll('.ab-card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ── Scroll / resize ── */
  var ticking = false;
  function onScroll() {
    if (manualIndex !== null && manualScrollY !== null && Math.abs(window.scrollY - manualScrollY) > 2) {
      manualIndex = null;
      manualScrollY = null;
    }
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { ticking = false; update(); });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { applyStaticLayout(); onScroll(); });
  reducedMotion.addEventListener('change', function () { applyStaticLayout(); onScroll(); });
  mobileBreak.addEventListener('change', function () { applyStaticLayout(); onScroll(); });

  applyStaticLayout();
  update();
})();
