"use strict";
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Tabs: roving tabindex, Arrow keys, Home/End ── */
  document.querySelectorAll('[data-pp-tabs]').forEach(function (wrap) {
    if (wrap.dataset.pp90Bound === '1') return;
    wrap.dataset.pp90Bound = '1';

    var bar = wrap.querySelector('.pp-tab-bar');
    var btns = Array.prototype.slice.call(wrap.querySelectorAll('.pp-tab-btn'));
    var panels = Array.prototype.slice.call(wrap.querySelectorAll('.pp-tab-panel'));

    function isPendingOnlyPanel(panel) {
      if (!panel) return false;
      var text = panel.textContent.replace(/\s+/g, ' ').trim();
      return /Draft\s*[—-]\s*pending content/i.test(text) && !/[A-Za-z0-9]{3,}/.test(text.replace(/Draft\s*[—-]\s*pending content/gi, '').trim());
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
      if (animate && !reduce) {
        panel.offsetHeight;
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

    /* Centre active pill on mobile */
    var mqMobile = window.matchMedia('(max-width: 767px)');
    function centre(btn) {
      if (!mqMobile.matches || !btn || !bar) return;
      btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
    }
    bar.addEventListener('scroll', function () {
      var maxScroll = bar.scrollWidth - bar.clientWidth;
      bar.classList.toggle('is-start', bar.scrollLeft > 1);
      bar.classList.toggle('is-end', maxScroll > 1 && bar.scrollLeft >= maxScroll - 1);
    }, { passive: true });
    liveBtns.forEach(function (btn) {
      btn.addEventListener('click', function () { centre(btn); });
      btn.addEventListener('keydown', function (e) {
        if (!mqMobile.matches) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'Home' || e.key === 'End') {
          requestAnimationFrame(function () { centre(document.activeElement); });
        }
      });
    });
  });

  /* ── FAQ Accordion: real dropdown, one open at a time, keyboard ── */
  document.querySelectorAll('[data-pp-acc]').forEach(function (acc) {
    if (acc.dataset.pp90Bound === '1') return;
    acc.dataset.pp90Bound = '1';

    var items = Array.prototype.slice.call(acc.querySelectorAll('.pp-acc-item'));

    function closeAll() {
      items.forEach(function (item) {
        item.classList.remove('is-open');
        var q = item.querySelector('.pp-acc-q');
        var a = item.querySelector('.pp-acc-a');
        if (q) q.setAttribute('aria-expanded', 'false');
        if (a) {
          a.setAttribute('aria-hidden', 'true');
          a.hidden = true;
        }
      });
    }

    function openItem(item, btn) {
      closeAll();
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      var a = item.querySelector('.pp-acc-a');
      if (a) {
        a.setAttribute('aria-hidden', 'false');
        a.hidden = false;
      }
    }

    function toggleItem(item, btn) {
      var isOpen = item.classList.contains('is-open');
      if (isOpen) {
        closeAll();
      } else {
        openItem(item, btn);
      }
    }

    items.forEach(function (item, index) {
      var q = item.querySelector('.pp-acc-q');
      var a = item.querySelector('.pp-acc-a');
      if (!q || !a) return;

      q.setAttribute('aria-controls', a.id);
      q.setAttribute('aria-expanded', 'false');
      a.setAttribute('aria-labelledby', q.id);
      a.setAttribute('role', 'region');
      a.hidden = true;
      a.setAttribute('aria-hidden', 'true');

      q.addEventListener('click', function () { toggleItem(item, q); });

      q.addEventListener('keydown', function (e) {
        var key = e.key;
        if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          toggleItem(item, q);
          return;
        }
        if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
          e.preventDefault();
          var target;
          if (key === 'Home') {
            target = items[0] && items[0].querySelector('.pp-acc-q');
          } else if (key === 'End') {
            target = items[items.length - 1] && items[items.length - 1].querySelector('.pp-acc-q');
          } else {
            var step = key === 'ArrowDown' ? 1 : -1;
            var j = index + step;
            if (j < 0) j = items.length - 1;
            if (j >= items.length) j = 0;
            target = items[j] && items[j].querySelector('.pp-acc-q');
          }
          if (target) target.focus();
        }
      });
    });

    /* Open first item on load */
    if (items[0]) {
      var firstQ = items[0].querySelector('.pp-acc-q');
      var firstA = items[0].querySelector('.pp-acc-a');
      if (firstQ && firstA) {
        items[0].classList.add('is-open');
        firstQ.setAttribute('aria-expanded', 'true');
        firstA.setAttribute('aria-hidden', 'false');
        firstA.hidden = false;
      }
    }
  });
})();