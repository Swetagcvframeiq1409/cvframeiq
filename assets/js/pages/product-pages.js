(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── spec tabs ── */
  document.querySelectorAll('[data-pp-tabs]').forEach(function (wrap) {
    var btns = Array.prototype.slice.call(wrap.querySelectorAll('.pp-tab-btn'));
    var panels = Array.prototype.slice.call(wrap.querySelectorAll('.pp-tab-panel'));

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

    var active = 0;

    function updateButtons() {
      liveBtns.forEach(function (b, n) {
        var sel = n === active;
        b.setAttribute('aria-selected', String(sel));
        b.setAttribute('tabindex', sel ? '0' : '-1');
        b.classList.toggle('is-on', sel);
      });
    }

    function show(i, animate) {
      if (i === active) return;
      var oldPanel = livePanels[active];
      oldPanel.classList.remove('is-on');
      oldPanel.setAttribute('hidden', '');
      active = i;
      var panel = livePanels[active];
      updateButtons();
      panel.removeAttribute('hidden');
      if (animate) {
        panel.offsetHeight; // force style recalc (opacity 0, translateY(8px), display grid)
        requestAnimationFrame(function () { panel.classList.add('is-on'); });
      } else {
        panel.classList.add('is-on');
      }
    }

    livePanels.forEach(function (p, n) { if (n !== active) p.setAttribute('hidden', ''); });
    show(0, false);

    liveBtns.forEach(function (b, n) {
      b.addEventListener('click', function () { show(n, true); });
      b.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show((n + 1) % liveBtns.length, true); liveBtns[(n + 1) % liveBtns.length].focus(); }
        if (e.key === 'ArrowLeft')  { e.preventDefault(); show((n - 1 + liveBtns.length) % liveBtns.length, true); liveBtns[(n - 1 + liveBtns.length) % liveBtns.length].focus(); }
        if (e.key === 'Home') { e.preventDefault(); show(0, true); liveBtns[0].focus(); }
        if (e.key === 'End')  { e.preventDefault(); show(liveBtns.length - 1, true); liveBtns[liveBtns.length - 1].focus(); }
      });
    });
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
