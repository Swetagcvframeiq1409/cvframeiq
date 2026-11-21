// gk-products.js — Products section interactions
// Loaded by: ai-store.html, pcb-guardian.html, beejhealth.html, autolabel.html, ppe-safety.html

(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. REVEAL FALLBACK — ensure content visible after 1.2s
     ============================================================ */
  function initRevealFallback() {
    var targets = document.querySelectorAll('.gk-reveal, [data-reveal], .ais-reveal, .pp-reveal, .gk-prod-section-head, .gk-prod-card, .gk-prod-fact, .gk-prod-step, .gk-prod-tabs-panel, .gk-prod-acc__item, .gk-prod-bento__card, .gk-prod-why-card, .gk-prod-sector-card');
    if (!targets.length) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        targets.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.2 && rect.bottom > -40) {
            el.classList.add('is-in', 'is-visible');
          }
        });
      }, 1200);
    }, { once: true });
  }


  /* ============================================================
     3. COMPARE TRAY — show when 2-3 items selected
     ============================================================ */
  function initCompareTray() {
    var tray = document.querySelector('.gk-prod-compare-tray');
    if (!tray) return;

    var compareBtns = document.querySelectorAll('.gk-prod-card__actions .gk-btn--compare, .ais-btn--icon[data-ais-compare]');
    var trayCount = tray.querySelector('[data-tray-count]') || tray.querySelector('#ais-tray-count');
    var trayCompareBtn = tray.querySelector('[data-tray-compare]') || tray.querySelector('#ais-tray-compare');

    var selection = new Set();

    function updateTray() {
      var count = selection.size;
      if (trayCount) trayCount.textContent = String(count);
      tray.classList.toggle('is-visible', count > 0);
      if (trayCompareBtn) {
        trayCompareBtn.disabled = count < 2;
        trayCompareBtn.setAttribute('aria-disabled', String(count < 2));
      }
    }

    compareBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var card = btn.closest('.gk-prod-card, .ais-card');
        var productName = card ? (card.querySelector('.gk-prod-card__title, h3')?.textContent?.trim() || '') : '';
        var productId = btn.dataset.productId || btn.getAttribute('aria-label')?.replace(/^Add to comparison: /, '') || productName;

        if (selection.has(productId)) {
          selection.delete(productId);
          btn.setAttribute('aria-pressed', 'false');
          btn.setAttribute('aria-label', 'Add to comparison: ' + productName);
        } else if (selection.size >= 3) {
          // Show toast or status message
          var status = document.querySelector('#ais-compare-status, .gk-prod-compare-status');
          if (status) status.textContent = 'Compare up to 3 products at a time.';
          return;
        } else {
          selection.add(productId);
          btn.setAttribute('aria-pressed', 'true');
          btn.setAttribute('aria-label', 'Remove from comparison: ' + productName);
        }
        var status = document.querySelector('#ais-compare-status, .gk-prod-compare-status');
        if (status) status.textContent = '';
        updateTray();
      });
    });

    // Tray compare button opens comparison dialog/page
    if (trayCompareBtn) {
      trayCompareBtn.addEventListener('click', function () {
        if (selection.size < 2) return;
        // If compare page exists, navigate; otherwise show draft
        var compareUrl = 'compare.html';
        var params = new URLSearchParams();
        selection.forEach(function (id) { params.append('product', id); });
        window.location.href = compareUrl + '?' + params.toString();
      });
    }

    // Keyboard: Escape closes tray
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && tray.classList.contains('is-visible')) {
        tray.classList.remove('is-visible');
      }
    });
  }

  /* ============================================================
     6. JOURNEY / TIMELINE — scroll observer for pinned media
     ============================================================ */
  function initJourneyObserver() {
    document.querySelectorAll('[data-gk-journey], .gk-prod-journey, .gk-prod-timeline').forEach(function (wrap) {
      var steps = Array.prototype.slice.call(wrap.querySelectorAll('.gk-step, .gk-prod-step, .gk-prod-timeline__step'));
      var media = wrap.querySelector('.gk-art, .gk-prod-journey__media, .gk-prod-timeline__media, .pp-workflow-img');

      if (!steps.length) return;

      if (reduce || !('IntersectionObserver' in window)) {
        steps.forEach(function (s) { s.classList.add('is-on'); });
        if (media) media.classList.add('active');
        return;
      }

      function activate(idx) {
        steps.forEach(function (s, i) { s.classList.toggle('is-on', i === idx); });
        if (media) {
          var imgs = media.querySelectorAll('img, .pp-workflow-img');
          if (imgs.length) {
            imgs.forEach(function (im, i) { im.classList.toggle('active', i === idx); });
          }
        }
      }

      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var idx = steps.indexOf(entry.target);
          if (idx !== -1) activate(idx);
        });
      }, { rootMargin: '-45% 0px -45% 0px' });

      steps.forEach(function (s) { io.observe(s); });
      activate(0);
    });
  }

  /* ============================================================
     7. IMAGE FALLBACK — .gk-img-slot onerror handler
     ============================================================ */
  function initImageFallbacks() {
    document.querySelectorAll('.gk-img-slot img, .gk-prodhero__media img, .gk-prod-card__media img, .pp-tab-img img, .pp-workflow-img img').forEach(function (img) {
      if (img.dataset.fallbackInit) return;
      img.dataset.fallbackInit = 'true';

      var fallback = img.nextElementSibling;
      if (fallback && fallback.classList.contains('gk-img-fallback')) {
        img.addEventListener('error', function () {
          img.style.display = 'none';
          fallback.removeAttribute('hidden');
        });
        img.addEventListener('load', function () {
          img.style.display = '';
          fallback.setAttribute('hidden', '');
        });
      }
    });
  }

  /* ============================================================
     8. MARQUEE — pause on hover, clone for seamless loop
     ============================================================ */
  function initMarquee() {
    var tracks = document.querySelectorAll('.gk-prod-marquee__track, .gk-marquee__track');
    tracks.forEach(function (track) {
      if (track.dataset.cloned) return;
      var children = Array.prototype.slice.call(track.children);
      children.forEach(function (child) {
        var clone = child.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
      track.dataset.cloned = '1';
    });
  }

  /* ============================================================
     9. HORIZONTAL SCROLL PREVENTION — body clamp
     ============================================================ */
  function preventHorizontalScroll() {
    // Already handled in CSS: html, body { max-width: 100%; overflow-x: clip; }
    // But add runtime check for debugging
    if (window.matchMedia('(max-width: 767px)').matches) {
      var check = function () {
        if (document.documentElement.scrollWidth > window.innerWidth) {
          console.warn('[gk-products] Horizontal scroll detected:', document.documentElement.scrollWidth, 'vs', window.innerWidth);
          var culprit = document.querySelector('*[style*="width"]:not(html):not(body)');
          if (culprit) console.warn('[gk-products] Possible culprit:', culprit);
        }
      };
      window.addEventListener('resize', check, { passive: true });
      check();
    }
  }

  /* ============================================================
     INIT — run all
     ============================================================ */
  function init() {
    initRevealFallback();
    initCompareTray();
    initJourneyObserver();
    initImageFallbacks();
    initMarquee();
    preventHorizontalScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();