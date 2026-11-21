// products-page.js — shared products page fixes
(function () {
  'use strict';
  document.documentElement.classList.add('pd-js');

  function revealAll() {
    var els = document.querySelectorAll('.gk-reveal, [data-reveal], .ais-reveal, .pp-reveal');
    els.forEach(function (el) { el.classList.add('is-in', 'is-visible'); });
  }

  // observer
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in', 'is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.gk-reveal, [data-reveal], .ais-reveal, .pp-reveal').forEach(function (el) { io.observe(el); });
  } else {
    revealAll();
  }

  // fail-safe timeout 1.5s
  setTimeout(revealAll, 1500);

  // AI Store: scroll tapped chip into view on phone
  var chipsHost = document.getElementById('ais-filter-chips');
  if (chipsHost) {
    chipsHost.addEventListener('click', function (e) {
      var chip = e.target.closest('.ais-chip');
      if (chip) {
        chip.scrollIntoView({
          inline: 'center',
          block: 'nearest',
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
        });
      }
    });
  }
})();