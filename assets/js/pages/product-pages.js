(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── spec tabs ── */
  document.querySelectorAll('[data-pp-tabs]').forEach(function (wrap) {
    var btns = Array.prototype.slice.call(wrap.querySelectorAll('.pp-tab-btn'));
    var panels = Array.prototype.slice.call(wrap.querySelectorAll('.pp-tab-panel'));
    var img = wrap.querySelector('.pp-tab-img img');

    function isPendingOnlyPanel(panel) {
      if (!panel) return false;
      var text = panel.textContent.replace(/\s+/g, ' ').trim();
      return /Draft\s*—\s*pending content/i.test(text) && !/[A-Za-z0-9]{3,}/.test(text.replace(/Draft\s*—\s*pending content/gi, '').trim());
    }

    var liveBtns = [];
    var livePanels = [];
    btns.forEach(function (btn, idx) {
      var panel = panels[idx];
      if (!panel || isPendingOnlyPanel(panel)) {
        if (panel) panel.remove();
        btn.remove();
        return;
      }
      liveBtns.push(btn);
      livePanels.push(panel);
    });

    if (!liveBtns.length) return;

    var sources = [];
    liveBtns.forEach(function (b) { sources.push(b.getAttribute('data-img') || ''); });

    function show(i) {
      liveBtns.forEach(function (b, n) {
        b.setAttribute('aria-selected', String(n === i));
        b.setAttribute('tabindex', n === i ? '0' : '-1');
      });
      livePanels.forEach(function (p, n) { p.classList.toggle('is-on', n === i); });
      if (img && sources[i]) {
        img.src = sources[i];
        img.alt = liveBtns[i].textContent.trim();
      }
    }

    liveBtns.forEach(function (b, n) {
      b.addEventListener('click', function () { show(n); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show((n + 1) % liveBtns.length); liveBtns[(n + 1) % liveBtns.length].focus(); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); show((n - 1 + liveBtns.length) % liveBtns.length); liveBtns[(n - 1 + liveBtns.length) % liveBtns.length].focus(); }
        if (e.key === 'Home') { e.preventDefault(); show(0); liveBtns[0].focus(); }
        if (e.key === 'End')  { e.preventDefault(); show(liveBtns.length - 1); liveBtns[liveBtns.length - 1].focus(); }
      });
    });
    show(0);
  });

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

  /* ── FAQ accordion ── */
  document.querySelectorAll('[data-pp-acc]').forEach(function (acc) {
    var items = Array.prototype.slice.call(acc.querySelectorAll('.pp-acc-item'));
    items.forEach(function (item) {
      var q = item.querySelector('.pp-acc-q');
      if (!q) return;
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        items.forEach(function (o) {
          o.classList.remove('is-open');
          var oq = o.querySelector('.pp-acc-q');
          if (oq) oq.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('is-open');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
    if (items[0]) {
      items[0].classList.add('is-open');
      var fq = items[0].querySelector('.pp-acc-q');
      if (fq) fq.setAttribute('aria-expanded', 'true');
    }
  });

  /* ── workflow scroll observer ── */
  document.querySelectorAll('[data-pp-workflow]').forEach(function (wrap) {
    var cards = Array.prototype.slice.call(wrap.querySelectorAll('.pp-step-card'));
    var nums  = Array.prototype.slice.call(wrap.querySelectorAll('.pp-step-num'));
    if (!cards.length) return;

    if (reduce || !('IntersectionObserver' in window)) {
      cards.forEach(function (c) { c.classList.add('is-on'); });
      nums.forEach(function (n) { n.classList.add('is-on'); });
      return;
    }

    function activate(idx) {
      cards.forEach(function (c, i) { c.classList.toggle('is-on', i === idx); });
      nums.forEach(function (n, i) { n.classList.toggle('is-on', i === idx); });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = cards.indexOf(entry.target);
        if (idx !== -1) activate(idx);
      });
    }, { rootMargin: '-40% 0px -40% 0px' });

    cards.forEach(function (c) { io.observe(c); });
    activate(0);
  });
})();
