/* about-page.js — Statement line animation + Vision/Mission pinned swap */
(() => {
  'use strict';

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const ease  = (t) => t * t * (3 - 2 * t);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ── Section D: Vision / Mission ── */
  const vmSection = document.querySelector('[data-ab-vm]');
  const vmRunway  = vmSection?.querySelector('.ab-vm__runway');
  const vmLabel   = vmSection?.querySelector('.ab-vm__label');
  const vmStmt1   = vmSection?.querySelector('[data-ab-stmt="vision"]');
  const vmStmt2   = vmSection?.querySelector('[data-ab-stmt="mission"]');
  const vmPill    = vmSection?.querySelector('.ab-vm__thumb');

  const progressFor = (el) => {
    if (!el) return 0;
    const rect   = el.getBoundingClientRect();
    const travel = Math.max(el.offsetHeight - window.innerHeight, 1);
    return clamp(-rect.top / travel, 0, 1);
  };

  const renderVM = () => {
    if (!vmRunway || !vmStmt1 || !vmStmt2 || !vmLabel || reducedMotion.matches) return;

    const q = progressFor(vmRunway);

    // q 0–0.35: vision fades in from 0.25 to 1
    // q 0.35–0.55: crossfade vision→mission
    // q 0.55–1.0: mission holds at 1
    let o1, o2, y1, y2, labelText;

    if (q < 0.35) {
      const t = ease(clamp(q / 0.35, 0, 1));
      o1 = 0.25 + 0.75 * t;  // starts at 0.25, never invisible
      o2 = 0;
      y1 = 0;
      y2 = 48;
      labelText = 'VISION';
    } else if (q < 0.55) {
      const t = ease(clamp((q - 0.35) / 0.20, 0, 1));
      o1 = 1 - t;
      o2 = t;
      y1 = -32 * t;
      y2 = 32 * (1 - t);
      labelText = t >= 0.5 ? 'MISSION' : 'VISION';
    } else {
      o1 = 0;
      o2 = 1;
      y1 = -32;
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

    // scroll pill thumb: slides from 4px to (pillH - thumbH - 4px)
    if (vmPill) {
      const pillEl  = vmSection.querySelector('.ab-vm__pill');
      const pillH   = pillEl ? pillEl.offsetHeight : 92;
      const thumbH  = vmPill.offsetHeight || 28;
      const maxY    = pillH - thumbH - 4;
      const thumbY  = 4 + q * maxY;
      vmPill.style.setProperty('--thumb-y', `${thumbY}px`);
      vmPill.style.top = `${thumbY}px`;
    }
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
    frame = requestAnimationFrame(() => { frame = 0; renderVM(); });
  };

  window.addEventListener('scroll', scheduleRender, { passive: true });
  window.addEventListener('resize', scheduleRender, { passive: true });
  window.addEventListener('pageshow', scheduleRender);
  reducedMotion.addEventListener('change', scheduleRender);
  scheduleRender();

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
