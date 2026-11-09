/* hw-img.js — shared image frame loader and scroll reveal for hardware pages */
(() => {
  'use strict';

  /* ── Image frame: fade in on load, placeholder on error ── */
  function initImgFrames(root) {
    root.querySelectorAll('.hw-img-frame img, .hw-consult-img img').forEach((img) => {
      const frame = img.parentElement;
      const load = () => {
        img.removeEventListener('error', fail);
        frame.classList.remove('img-failed');
        frame.classList.add('is-loaded');
      };
      const fail = () => {
        img.removeEventListener('load', load);
        frame.classList.remove('is-loaded');
        frame.classList.add('img-failed');
      };
      if (img.complete && img.naturalWidth > 0) { load(); return; }
      if (img.complete) { fail(); return; }
      img.addEventListener('load', load, { once: true });
      img.addEventListener('error', fail, { once: true });
    });
  }

  /* ── Scroll reveal ── */
  function initReveal(root) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = [...root.querySelectorAll('.hw-reveal')];
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    items.forEach((el) => {
      if (el.getBoundingClientRect().top <= window.innerHeight) el.classList.add('is-visible');
    });
    root.classList.add('hw-reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    items.forEach((el) => observer.observe(el));
  }

  /* ── Count-up on reveal ── */
  function initCountUp(root) {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const counters = [...root.querySelectorAll('[data-count-up]')];
    if (!counters.length) return;
    const show = (el) => { el.textContent = el.dataset.countUp; };
    if (reduced || !('IntersectionObserver' in window)) {
      counters.forEach(show);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { show(entry.target); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => observer.observe(el));
  }

  /* ── Init on DOMContentLoaded ── */
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.hw-page') || document.body;
    initImgFrames(root);
    initReveal(root);
    initCountUp(root);
  });

  window.HW_IMG = { initImgFrames, initReveal, initCountUp };
})();
