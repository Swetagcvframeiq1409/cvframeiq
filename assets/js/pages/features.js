(() => {
  'use strict';

  const data = window.FEATURES;
  if (!data) return;

  document.documentElement.classList.add('js');

  const showDraft = data.SHOW_DRAFT === true;
  const draftNotice = document.querySelector('[data-features-draft]');
  if (draftNotice) draftNotice.hidden = !showDraft;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Capabilities: active index + panels ---------- */
  const panels = document.querySelectorAll('.ft-panel');
  const indexRows = document.querySelectorAll('.ft-index__row');
  const indexLine = document.querySelector('.ft-index__line');
  let activeIndex = -1;

  const setActive = (idx) => {
    if (idx === activeIndex) return;
    if (activeIndex >= 0) {
      panels[activeIndex].classList.remove('is-active');
      if (indexRows[activeIndex]) indexRows[activeIndex].classList.remove('is-active');
    }
    activeIndex = idx;
    if (idx >= 0) {
      panels[idx].classList.add('is-active');
      if (indexRows[idx]) indexRows[idx].classList.add('is-active');
      if (indexLine) {
        const row = indexRows[idx];
        if (row) {
          const rect = row.getBoundingClientRect();
          const track = document.querySelector('.ft-index__track');
          const trackRect = track ? track.getBoundingClientRect() : { top: 0, height: 0 };
          const fill = ((rect.top - trackRect.top) / trackRect.height) * 100;
          indexLine.style.setProperty('--fill', Math.max(0, Math.min(100, fill)) + '%');
        }
      }
    } else if (indexLine) {
      indexLine.style.setProperty('--fill', '0%');
    }
  };

  /* Reveal panels on enter with 80ms stagger, once; fallback after 1.5s */
  let revealed = 0;
  const revealPanel = (panel) => {
    if (panel.classList.contains('is-visible')) return;
    panel.classList.add('is-visible');
    revealed++;
    if (revealed === panels.length && indexLine) {
      // all revealed
    }
  };

  if (panels.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      const intersecting = entries.filter((e) => e.isIntersecting);
      if (intersecting.length === 0) return;

      // Pick the panel nearest the viewport centre
      let best = intersecting[0];
      let bestDistance = Math.abs(best.boundingClientRect.top + best.boundingClientRect.height / 2 - window.innerHeight / 2);
      for (const entry of intersecting) {
        const dist = Math.abs(entry.boundingClientRect.top + entry.boundingClientRect.height / 2 - window.innerHeight / 2);
        if (dist < bestDistance) {
          best = entry;
          bestDistance = dist;
        }
      }

      const idx = Array.from(panels).indexOf(best.target);
      if (idx >= 0) {
        revealPanel(best.target);
        setActive(idx);
      }
    }, { threshold: 0.15, rootMargin: "-40% 0px -40% 0px" });
    panels.forEach((panel, i) => {
      panel.style.transitionDelay = (i * 80) + 'ms';
      io.observe(panel);
    });
  }

  // Fallback: mark all panels visible after 1.5s if observer hasn't fired
  setTimeout(() => {
    panels.forEach((panel) => {
      if (!panel.classList.contains('is-visible')) {
        panel.classList.add('is-visible');
      }
    });
    if (panels.length > 0) setActive(0);
  }, 1500);

  /* Index row click: smooth scroll to panel */
  indexRows.forEach((row, i) => {
    row.addEventListener('click', () => {
      const target = document.getElementById(row.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const target = document.getElementById(row.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* Cursor spotlight on panels */
  if (!reduce) {
    panels.forEach((panel) => {
      panel.addEventListener('mousemove', (e) => {
        const rect = panel.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        panel.style.setProperty('--mx', mx + '%');
        panel.style.setProperty('--my', my + '%');
      });
    });
  }

  /* Hero frame reveal on enter */
  const frame = document.querySelector('.ft-stage__frame');
  if (frame && 'IntersectionObserver' in window) {
    const fio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          fio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fio.observe(frame);
  }

  /* ---------- Related cards ---------- */
  const related = document.querySelector('[data-ft-related]');

  const iconMap = {
    'AI Store': 'bi-bag',
    'Sectors': 'bi-diagram-3',
    'Playground': 'bi-play-circle'
  };

  data.related.forEach((item, index) => {
    const link = document.createElement('a');
    link.className = 'ft-related__card';
    link.href = item.href;

    const icon = document.createElement('div');
    icon.className = 'ft-related__icon';
    const bi = document.createElement('i');
    bi.className = 'bi ' + iconMap[item.label];
    icon.append(bi);

    const title = document.createElement('h3');
    title.textContent = item.label;
    const desc = document.createElement('p');
    desc.textContent = item.description;

    const copy = document.createElement('div');
    copy.className = 'ft-related__copy';
    copy.append(title, desc);

    const arrow = document.createElement('span');
    arrow.className = 'ft-related__arrow';
    const arrowBi = document.createElement('i');
    arrowBi.className = 'bi bi-arrow-right';
    arrow.append(arrowBi);

    link.append(icon, copy, arrow);
    related.append(link);

    link.style.transitionDelay = (index * 80) + 'ms';
  });

  if (!reduce && 'IntersectionObserver' in window) {
    const cards = document.querySelectorAll('.ft-related__card');
    const rio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          rio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    cards.forEach((card) => rio.observe(card));
  }

  related.closest('section').hidden = !data.related || data.related.length === 0;
})();
