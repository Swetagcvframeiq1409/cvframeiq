/* about-page.js — Statement line animation + Vision/Mission pinned swap */
(() => {
  'use strict';

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const ease  = (t) => t * t * (3 - 2 * t);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Added About bands: reveal and marquee visibility ── */
  const revealTargets = Array.from(document.querySelectorAll('.ab-added [data-reveal], .ab-www-cards .ab-www-card, .ab-pillars [data-reveal]'));
  const marqueeRows = Array.from(document.querySelectorAll('.ab-tech-marquee__row, .ab-techstack .gk-marquee__track'));
  const staggerGroups = ['.ab-registration__grid', '.ab-timeline', '.ab-building__grid', '.ab-expertise__grid', '.ab-www-cards__grid', '.ab-pillars__grid'];
  let revealObserver;
  let marqueeObserver;

  const setupAddedMotion = () => {
    revealObserver?.disconnect();
    marqueeObserver?.disconnect();
    revealObserver = null;
    marqueeObserver = null;

    const root = document.documentElement;
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      root.classList.remove('ab-reveal-ready');
      revealTargets.forEach((target) => target.classList.add('is-in'));
      marqueeRows.forEach((row) => row.classList.remove('is-inview'));
      return;
    }

    revealTargets.forEach((target) => target.classList.remove('is-in'));
    staggerGroups.forEach((selector) => {
      document.querySelectorAll(selector).forEach((group) => {
        const items = Array.from(group.children);
        const count = Math.max(items.length, 1);
        const total = Math.min(400, Math.max(0, (count - 1) * 80));
        items.forEach((card, index) => {
          const delay = count === 1 ? 0 : Math.round((index / (count - 1)) * total);
          card.style.setProperty('--ab-reveal-delay', `${delay}ms`);
        });
      });
    });

    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
    revealTargets.forEach((target) => revealObserver.observe(target));

    marqueeRows.forEach((row) => row.classList.remove('is-inview'));
    if (marqueeRows.length) {
      marqueeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => entry.target.classList.toggle('is-inview', entry.isIntersecting));
      }, { threshold: 0.01 });
      marqueeRows.forEach((row) => marqueeObserver.observe(row));
    }
    root.classList.add('ab-reveal-ready');
  };

  setupAddedMotion();
  reducedMotion.addEventListener('change', setupAddedMotion);
  window.addEventListener('pagehide', () => {
    revealObserver?.disconnect();
    marqueeObserver?.disconnect();
  }, { once: true });

  /* ── Section D: Vision / Mission ── */
  const vmSection = document.querySelector('[data-ab-vm]');
  const vmRunway  = vmSection?.querySelector('.ab-vm__runway');
  const vmLabel   = vmSection?.querySelector('.ab-vm__label');
  const vmStmt1   = vmSection?.querySelector('[data-ab-stmt="vision"]');
  const vmStmt2   = vmSection?.querySelector('[data-ab-stmt="mission"]');

  const progressFor = (el) => {
    if (!el) return 0;
    const rect   = el.getBoundingClientRect();
    const travel = Math.max(el.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / travel, 0, 1);
  };

  /* Reading progress line: 2px vertical, 32px left of headline, driven by word-reveal progress */
  const vmStage = vmSection?.querySelector('.ab-vm__stage');
  const vmProgress = vmSection?.querySelector('.ab-vm__progress');
  const vmProgressFill = vmSection?.querySelector('.ab-vm__progress-fill');
  const vmTextBlock = vmSection?.querySelector('.ab-vm__textblock, .ab-vm__grid');
  const vmGrid = vmSection?.querySelector('.ab-vm__grid');
  let headlineHeight = 0;

  const updateProgressLine = () => {
    if (!vmStage || !vmProgress || !vmTextBlock || !vmGrid || window.innerWidth < 1024) {
      if (vmProgress) vmProgress.classList.remove('is-visible');
      return;
    }
    const headings = Array.from(vmTextBlock.querySelectorAll('.ab-vm__heading'));
    const target = headings.find((h) => {
      const cs = getComputedStyle(h.closest('.ab-vm__stmt') || h);
      return parseFloat(cs.opacity || '1') > 0.2;
    }) || headings[0];
    if (!target) {
      vmProgress.classList.remove('is-visible');
      return;
    }
    const gridRect = vmGrid.getBoundingClientRect();
    const hRect = target.getBoundingClientRect();
    headlineHeight = hRect.height;
    vmProgress.style.height = `${headlineHeight}px`;
    vmProgress.style.top = `${hRect.top - gridRect.top}px`;
    vmProgress.classList.add('is-visible');
  };

  /* ResizeObserver to track headline dimensions */
  const headlineObserver = new ResizeObserver(() => updateProgressLine());
  const vmHeadings = vmSection?.querySelectorAll('.ab-vm__heading');
  vmHeadings?.forEach(h => headlineObserver.observe(h));

  const renderVM = () => {
    if (!vmRunway || !vmStmt1 || !vmStmt2 || !vmLabel || reducedMotion.matches) return;

    const q = progressFor(vmRunway);

    // q 0-0.35: vision fades in from 0.25 to 1
    // q 0.35-0.45: vision fades out to 0 (mission hidden)
    // q 0.45-0.55: mission fades in to 1 (vision hidden)
    // q 0.55-1.0: mission holds at 1
    let o1, o2, y1, y2, labelText;

    if (q < 0.35) {
      const t = ease(clamp(q / 0.35, 0, 1));
      o1 = 0.25 + 0.75 * t;
      o2 = 0;
      y1 = 0;
      y2 = 32;
      labelText = 'VISION';
    } else if (q < 0.45) {
      const t = ease(clamp((q - 0.35) / 0.10, 0, 1));
      o1 = 1 - t;
      o2 = 0;
      y1 = -24 * t;
      y2 = 32;
      labelText = 'VISION';
    } else if (q < 0.55) {
      const t = ease(clamp((q - 0.45) / 0.10, 0, 1));
      o1 = 0;
      o2 = t;
      y1 = -24;
      y2 = 32 * (1 - t);
      labelText = 'MISSION';
    } else {
      o1 = 0;
      o2 = 1;
      y1 = -24;
      y2 = 0;
      labelText = 'MISSION';
    }

    vmStmt1.style.setProperty('--vm-o', String(o1));
    vmStmt1.style.setProperty('--vm-y', `${y1}px`);
    vmStmt1.setAttribute('aria-hidden', o1 < 0.02 ? 'true' : 'false');

    vmStmt2.style.setProperty('--vm-o', String(o2));
    vmStmt2.style.setProperty('--vm-y', `${y2}px`);
    vmStmt2.setAttribute('aria-hidden', o2 < 0.02 ? 'true' : 'false');

    if (vmLabel.textContent !== labelText) vmLabel.textContent = labelText;

    // Update progress line fill based on scroll progress
    if (vmProgressFill && window.innerWidth >= 1024) {
      vmProgressFill.style.transform = `scaleY(${q})`;
    }

    updateProgressLine();
  };

  /* ── Section C: Statement line animation ── */
  const artEl = document.querySelector('[data-ab-lines]');
  let linesDrawn = false;

  const drawLines = () => {
    if (linesDrawn || !artEl) return;
    linesDrawn = true;
    artEl.querySelectorAll('.ab-line').forEach((line, i) => {
      line.style.setProperty('--stagger-i', String(i));
      line.classList.add('is-drawn');
    });
  };

  if (artEl && !reducedMotion.matches) {
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { drawLines(); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(artEl);
  } else if (artEl) {
    drawLines();
  }

  /* ── rAF-throttled scroll/resize ── */
  let frame = 0;
  const scheduleRender = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => { frame = 0; renderVM(); updateProgressLine(); });
  };

  window.addEventListener('scroll', scheduleRender, { passive: true });
  window.addEventListener('resize', () => { scheduleRender(); updateProgressLine(); }, { passive: true });
  window.addEventListener('pageshow', scheduleRender);
  reducedMotion.addEventListener('change', scheduleRender);
  scheduleRender();
  updateProgressLine();

  /* ── India time clock ── */
  const indiaTime = document.querySelector('.ab-cta__time');
  if (indiaTime) {
    const updateIndiaTime = () => {
      const now = new Date();
      indiaTime.textContent = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata'
      }).format(now);
      indiaTime.dateTime = now.toISOString();
      indiaTime.hidden = false;
    };
    updateIndiaTime();
    const clockInterval = window.setInterval(updateIndiaTime, 30000);
    window.addEventListener('pagehide', () => window.clearInterval(clockInterval), { once: true });
  }
})();
