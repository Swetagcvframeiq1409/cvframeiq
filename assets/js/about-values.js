(() => {
  'use strict';

  const section = document.querySelector('[data-gk-values]');
  if (!section) return;

  const track = section.querySelector('[data-gk-values-track]');
  const stage = section.querySelector('.gk-values__stage');
  const ring = section.querySelector('.gk-values__ring');
  const nodes = Array.from(section.querySelectorAll('.gk-values__node'));
  const panels = Array.from(section.querySelectorAll('.gk-values__panel'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const count = Math.min(nodes.length, panels.length);
  const desktop = () => window.innerWidth >= 1024 && !reducedMotion.matches;
  const headerHeight = () =>
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76;

  if (!track || !stage || !ring || !count) return;

  const step = 16 * Math.PI / 180;
  let frame = 0;
  let panelTimer = 0;
  let activeIndex = 0;
  let activeIndexFloat = 0;
  let targetIndexFloat = 0;
  let wasDesktop = false;
  let initialized = false;

  const trackTravel = () => Math.max(track.offsetHeight - stage.offsetHeight, 1);

  const updateTrackHeight = () => {
    if (desktop()) {
      track.style.height = `${Math.ceil(stage.getBoundingClientRect().height + (count - 1) * window.innerHeight)}px`;
    } else {
      track.style.removeProperty('height');
    }
  };

  const setPanel = (index) => {
    if (index === activeIndex && !panelTimer) return;
    if (panelTimer) {
      window.clearTimeout(panelTimer);
      panelTimer = 0;
    }

    if (index === activeIndex) {
      panels[index].classList.add('is-active');
      panels[index].removeAttribute('aria-hidden');
      return;
    }

    panels.forEach((panel) => {
      panel.classList.remove('is-active');
      panel.setAttribute('aria-hidden', 'true');
    });

    panelTimer = window.setTimeout(() => {
      panels[index].classList.add('is-active');
      panels[index].removeAttribute('aria-hidden');
      activeIndex = index;
      panelTimer = 0;
    }, 200);
  };

  const interpolate = (distance, values) => {
    for (let i = 1; i < values.length; i += 1) {
      if (distance <= values[i][0]) {
        const [startDistance, startValue] = values[i - 1];
        const [endDistance, endValue] = values[i];
        const fraction = (distance - startDistance) / (endDistance - startDistance);
        return startValue + (endValue - startValue) * fraction;
      }
    }
    return values[values.length - 1][1];
  };

  const render = () => {
    frame = 0;
    if (!desktop()) return;

    const travel = trackTravel();
    const bounds = track.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (headerHeight() - bounds.top) / travel));
    targetIndexFloat = progress * (count - 1);

    if (!initialized) {
      activeIndexFloat = targetIndexFloat;
      initialized = true;
    } else {
      activeIndexFloat += (targetIndexFloat - activeIndexFloat) * 0.18;
      if (Math.abs(targetIndexFloat - activeIndexFloat) < 0.001) {
        activeIndexFloat = targetIndexFloat;
      }
    }

    const selectedIndex = Math.min(count - 1, Math.max(0, Math.round(activeIndexFloat)));
    setPanel(selectedIndex);
    const ringRect = ring.getBoundingClientRect();
    const stageRect = stage.getBoundingClientRect();
    const border = parseFloat(getComputedStyle(ring).borderTopWidth) || 0;
    const radius = ringRect.width / 2 - border / 2;
    const centerX = ringRect.left - stageRect.left + ringRect.width / 2;
    const centerY = stage.clientHeight / 2;

    nodes.forEach((button, index) => {
      const angle = (index - activeIndexFloat) * step;
      const distance = Math.abs(index - activeIndexFloat);
      const size = interpolate(distance, [[0, 140], [1, 100], [2, 76], [3, 56]]);
      const opacity = interpolate(distance, [[0, 1], [1, 0.7], [2, 0.4], [3, 0.15]]);
      const visible = distance <= 3;

      button.style.setProperty('--x', `${centerX + radius * Math.cos(angle)}px`);
      button.style.setProperty('--y', `${centerY + radius * Math.sin(angle)}px`);
      button.style.setProperty('--scale', visible ? String(size / 140) : '0');
      button.style.setProperty('--opacity', visible ? String(opacity) : '0');
      button.style.pointerEvents = visible ? 'auto' : 'none';
      if (index === selectedIndex) button.setAttribute('aria-current', 'true');
      else button.removeAttribute('aria-current');
    });

    if (Math.abs(targetIndexFloat - activeIndexFloat) >= 0.001) {
      frame = window.requestAnimationFrame(render);
    }
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  const syncLayout = () => {
    const useDesktop = desktop();
    updateTrackHeight();

    if (!useDesktop) {
      if (panelTimer) {
        window.clearTimeout(panelTimer);
        panelTimer = 0;
      }
      panels.forEach((panel) => {
        panel.classList.remove('is-active');
        panel.removeAttribute('aria-hidden');
      });
      nodes.forEach((button) => {
        button.removeAttribute('aria-current');
        button.style.removeProperty('--x');
        button.style.removeProperty('--y');
        button.style.removeProperty('--scale');
        button.style.removeProperty('--opacity');
        button.style.removeProperty('pointer-events');
      });
      if (frame) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      wasDesktop = false;
      initialized = false;
      return;
    }

    if (!wasDesktop) {
      activeIndex = Math.min(count - 1, Math.max(0, Math.round(activeIndexFloat)));
      panels.forEach((panel, index) => {
        panel.classList.toggle('is-active', index === activeIndex);
        if (index === activeIndex) panel.removeAttribute('aria-hidden');
        else panel.setAttribute('aria-hidden', 'true');
      });
      wasDesktop = true;
      initialized = false;
    }
    schedule();
  };

  nodes.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (!desktop()) return;
      const fraction = index / (count - 1);
      const top = window.scrollY + track.getBoundingClientRect().top - headerHeight() + fraction * trackTravel();
      window.scrollTo({
        top,
        behavior: reducedMotion.matches ? 'auto' : 'smooth'
      });
    });
  });

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', syncLayout, { passive: true });
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', syncLayout);

  syncLayout();
})();
