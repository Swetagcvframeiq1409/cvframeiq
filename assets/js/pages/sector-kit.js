(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function initReveal() {
    const items = Array.from(document.querySelectorAll('[data-sx-reveal]'));
    if (!items.length) return;
    items.forEach((item) => item.classList.add('sx-reveal'));

    const revealAll = () => {
      items.forEach((item) => item.classList.add('is-visible'));
    };
    const revealVisible = () => {
      items.forEach((item) => {
        if (item.getBoundingClientRect().top <= window.innerHeight) item.classList.add('is-visible');
      });
    };

    // Mark JS as ready BEFORE hiding elements so CSS can gate the hide
    document.documentElement.classList.add('sx-js');
    // Immediately reveal anything already in the viewport
    revealVisible();

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -8% 0px' });

    items.forEach((item) => observer.observe(item));
    window.addEventListener('scrollend', revealAll, { once: true });
    // Safety: force-reveal anything still hidden after 1.5 s
    window.setTimeout(revealVisible, 800);
    window.setTimeout(revealAll, 1500);
  }

  function initCounters() {
    const counters = Array.from(document.querySelectorAll('[data-sx-count]'));
    if (!counters.length) return;

    const renderCount = (counter, value) => {
      const precision = Number(counter.dataset.sxPrecision || 0);
      counter.textContent = `${counter.dataset.sxPrefix || ''}${value.toFixed(precision)}${counter.dataset.sxSuffix || ''}`;
    };
    const animate = (counter) => {
      const target = Number(counter.dataset.sxCount);
      if (!Number.isFinite(target)) return;
      if (reducedMotion.matches) {
        renderCount(counter, target);
        return;
      }
      const start = performance.now();
      const duration = 900;
      const frame = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        renderCount(counter, target * (1 - ((1 - progress) ** 3)));
        if (progress < 1) window.requestAnimationFrame(frame);
      };
      window.requestAnimationFrame(frame);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    counters.forEach((counter) => observer.observe(counter));
  }

  function initMarquee() {
    document.querySelectorAll('.sx-marquee').forEach((marquee) => {
      const rail = marquee.querySelector('.sx-marquee__rail');
      const track = rail?.querySelector('.sx-marquee__track');
      if (!rail || !track || rail.dataset.sxCloned === 'true') return;
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.classList.add('sx-marquee__track--clone');
      rail.appendChild(clone);
      rail.dataset.sxCloned = 'true';
    });
  }

  function initAccordion() {
    document.querySelectorAll('[data-sx-accordion]').forEach((accordion) => {
      accordion.querySelectorAll('[data-sx-accordion-button]').forEach((button) => {
        const panelId = button.getAttribute('aria-controls');
        const panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        button.addEventListener('click', () => {
          const expanded = button.getAttribute('aria-expanded') === 'true';
          button.setAttribute('aria-expanded', String(!expanded));
          button.closest('.sx-accordion__item')?.classList.toggle('is-open', !expanded);
          panel.setAttribute('aria-hidden', String(expanded));
        });
      });
    });
  }

  function initTabs() {
    document.querySelectorAll('[data-sx-tabs]').forEach((tabs) => {
      const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));
      const panels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
      const activate = (button, moveFocus = false) => {
        buttons.forEach((tab) => {
          const selected = tab === button;
          tab.setAttribute('aria-selected', String(selected));
          tab.tabIndex = selected ? 0 : -1;
        });
        panels.forEach((panel) => {
          panel.hidden = panel.id !== button.getAttribute('aria-controls');
        });
        if (moveFocus) button.focus();
      };

      buttons.forEach((button, index) => {
        button.addEventListener('click', () => activate(button));
        button.addEventListener('keydown', (event) => {
          let nextIndex = index;
          if (event.key === 'ArrowRight') nextIndex = (index + 1) % buttons.length;
          else if (event.key === 'ArrowLeft') nextIndex = (index - 1 + buttons.length) % buttons.length;
          else if (event.key === 'Home') nextIndex = 0;
          else if (event.key === 'End') nextIndex = buttons.length - 1;
          else return;
          event.preventDefault();
          activate(buttons[nextIndex], true);
        });
      });

      const selected = buttons.find((button) => button.getAttribute('aria-selected') === 'true');
      if (selected) activate(selected);
    });
  }

  function initSubnav() {
    document.querySelectorAll('[data-sx-subnav]').forEach((nav) => {
      const progress = nav.querySelector('.sx-subnav__progress-fill');
      const chips = Array.from(nav.querySelectorAll('.sx-subnav__chip'));
      const targets = chips
        .map((chip) => chip.hasAttribute('data-sx-spy-target')
          ? document.getElementById(chip.dataset.sxSpyTarget)
          : (chip.getAttribute('href')?.startsWith('#') ? document.querySelector(chip.getAttribute('href')) : null))
        .filter(Boolean);

      const setActive = (target) => {
        if (!target) return;
        chips.forEach((chip) => {
          const active = chip.hasAttribute('data-sx-spy-target')
            ? chip.dataset.sxSpyTarget === target.id
            : chip.getAttribute('href') === `#${target.id}`;
          const wasActive = chip.classList.contains('is-active');
          chip.classList.toggle('is-active', active);
          if (active) {
            chip.setAttribute('aria-current', 'location');
            if (!wasActive) {
              const scroller = nav.querySelector('.sx-subnav__chips');
              if (scroller) {
                const chipBounds = chip.getBoundingClientRect();
                const scrollerBounds = scroller.getBoundingClientRect();
                if (chipBounds.left < scrollerBounds.left || chipBounds.right > scrollerBounds.right) {
                  const left = scroller.scrollLeft + chipBounds.left - scrollerBounds.left - (scroller.clientWidth - chipBounds.width) / 2;
                  scroller.scrollTo({ left, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
                }
              }
            }
          } else {
            chip.removeAttribute('aria-current');
          }
        });
      };

      if (targets.length) {
        const sectorGrid = document.getElementById('all-sectors');
        const updateActive = () => {
          const marker = window.innerHeight * 0.3;
          const gridBounds = sectorGrid?.getBoundingClientRect();
          let current;

          if (sectorGrid && (gridBounds.top > marker || gridBounds.bottom <= marker)) {
            current = sectorGrid;
          } else {
            const intersecting = targets
              .filter((target) => {
                const bounds = target.getBoundingClientRect();
                return bounds.top <= marker && bounds.bottom > marker;
              });
            current = intersecting.find((target) => target !== sectorGrid) || intersecting[0];
            if (!current) {
              current = sectorGrid || targets
                .filter((target) => target.getBoundingClientRect().top <= marker)
                .pop() || targets[0];
            }
          }

          setActive(current);
        };
        window.addEventListener('scroll', updateActive, { passive: true });
        window.addEventListener('resize', updateActive);
        updateActive();
      }

      const updateProgress = () => {
        if (!progress) return;
        const maximum = document.documentElement.scrollHeight - window.innerHeight;
        const amount = maximum > 0 ? Math.min(1, Math.max(0, window.scrollY / maximum)) : 0;
        progress.style.transform = `scaleX(${amount})`;
      };
      updateProgress();
      window.addEventListener('scroll', updateProgress, { passive: true });
      window.addEventListener('resize', updateProgress);
    });
  }

  window.SECTOR_KIT = {
    initReveal,
    initCounters,
    initMarquee,
    initAccordion,
    initTabs,
    initSubnav
  };
})();
