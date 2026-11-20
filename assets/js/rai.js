/* rai.js - Responsible AI page interactions */
(function () {
  'use strict';

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Scroll spy for subnav
    initScrollSpy();

    // Reveal observer
    initRevealObserver();

    // Failsafe: reveal all content within viewport after 1200ms, all after 2500ms
    setTimeout(revealInViewport, 1200);
    setTimeout(revealAll, 2500);
  }

  // Scroll spy: highlight active subnav link based on scroll position
  function initScrollSpy() {
    const subnav = document.querySelector('.rai-subnav');
    const progressBar = document.getElementById('rai-progress-bar');
    const links = subnav ? subnav.querySelectorAll('a[data-rai-anchor]') : [];
    const sections = Array.from(links).map(link => {
      const id = link.getAttribute('data-rai-anchor');
      return document.getElementById(id);
    }).filter(Boolean);

    if (!sections.length) return;

    const headerH = 74;
    const subnavH = subnav ? subnav.offsetHeight : 0;
    const offset = headerH + subnavH + 20;

    function onScroll() {
      const scrollY = window.scrollY + offset;
      let activeSection = null;

      // Find the last section whose top is <= scrollY
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        if (sectionTop <= scrollY) {
          activeSection = section;
          break;
        }
      }

      // If no section found, use first
      if (!activeSection) activeSection = sections[0];

      // Update active link
      const activeId = activeSection.id;
      links.forEach(link => {
        const isActive = link.getAttribute('data-rai-anchor') === activeId;
        link.setAttribute('aria-current', isActive ? 'true' : 'false');
        link.classList.toggle('is-active', isActive);
      });

      // Update progress bar
      if (progressBar) {
        const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = pageHeight > 0 ? (window.scrollY / pageHeight) * 100 : 0;
        progressBar.style.width = Math.min(100, Math.max(0, progress)) + '%';
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Initial call
  }

  // IntersectionObserver for reveal animations
  function initRevealObserver() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      // Instant reveal
      document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-in'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }

  // Failsafe: reveal elements in or above viewport
  function revealInViewport() {
    const vh = window.innerHeight;
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < vh && rect.bottom > 0) {
        el.classList.add('is-in');
      }
    });
  }

  // Failsafe: reveal everything
  function revealAll() {
    document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(el => {
      el.classList.add('is-in');
    });
  }
})();