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
  const compactMQ = window.matchMedia('(max-width: 1023px)');
  const count = Math.min(nodes.length, panels.length);

  if (!track || !stage || !ring || !count) return;

  const headerHeight = () => {
    const header = document.querySelector('.site-header, header, [data-header]');
    if (header) {
      const h = header.getBoundingClientRect().height;
      if (h > 0) return Math.round(h);
    }
    const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gk-nav-h'))
      || parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76;
    return Math.round(v);
  };

  const interpolate = (distance, values) => {
    for (let i = 1; i < values.length; i += 1) {
      if (distance <= values[i][0]) {
        const [sD, sV] = values[i - 1];
        const [eD, eV] = values[i];
        const f = (distance - sD) / (eD - sD);
        return sV + (eV - sV) * f;
      }
    }
    return values[values.length - 1][1];
  };

  /**
   * Pure arc layout computation (desktop or compact profile).
   * profile: 'desktop' | 'compact'
   */
  function computeArcLayout(profile, W, H, activeFloat, count) {
    const n = Math.max(count, 1);
    const af = Math.min(n - 1, Math.max(0, activeFloat));
    const isCompact = profile === 'compact';
    const isPhone = isCompact && W <= 768;
    const s = isCompact ? Math.min(1.5, Math.max(0.9, W / 390)) : Math.min(1, H / 820);

    let R, cx, cy, ringBorder, step, sizeTable, opacityTable, textLeft, textWidth;
    if (isPhone) {
      ringBorder = Math.min(24, Math.max(16, W * 0.055));
      R = 0.46 * H;
      cx = 0.72 * W - R;
      cy = 0.30 * H;
      sizeTable = [[0, 112], [1, 68], [2, 44], [3, 30], [3.6, 22]];
      opacityTable = [[0, 1], [1, 0.65], [2, 0.3], [3, 0.15], [3.6, 0]];
      step = Math.max(0.26, (112 / 2 + 68 / 2 + 10) / R);
      textLeft = 20;
      textWidth = Math.max(W - 40, 0);
    } else if (isCompact) {
      ringBorder = Math.min(24, Math.max(16, W * 0.055));
      R = 0.50 * H;
      // "Apex of the ring centerline at x = 0.20 * W" => rightmost point cx+R = 0.20*W
      cx = 0.20 * W - R;
      cy = H / 2;
      sizeTable = [[0, 72 * s], [1, 50 * s], [2, 34 * s], [3, 22 * s], [3.6, 22 * s]];
      opacityTable = [[0, 1], [1, 0.8], [2, 0.45], [3, 0.2], [3.6, 0]];
      // STEP so adjacent settled gap >= 10px
      const r0 = (72 * s) / 2, r1 = (50 * s) / 2;
      step = (r0 + r1 + 10) / R; // ~0.18 rad @390
      textLeft = 0.34 * W;
      const rightGutter = 20;
      textWidth = Math.max(0, W - textLeft - rightGutter);
      // ensure text starts >= 16px right of active circle right edge
      const activeRight = cx + R + (72 * s) / 2; // active at theta 0
      const minTextLeft = activeRight + 16;
      if (textLeft < minTextLeft) {
        const shift = minTextLeft - textLeft;
        textLeft = minTextLeft;
        textWidth = Math.max(0, textWidth - shift);
      }
      // maintain >=200px if possible by allowing smaller right gutter (down to 0) but prefer 20
      if (textWidth < 200) {
        const need = 200 - textWidth;
        const giveLeft = Math.min(need, Math.max(0, textLeft - minTextLeft));
        textLeft -= giveLeft;
        textWidth += giveLeft;
        if (textWidth < 200) textWidth = Math.max(0, W - textLeft); // sacrifice right gutter if absolutely needed
      }
    } else {
      ringBorder = 40;
      R = Math.min(H * 1.1, W * 0.66) / 2 - ringBorder / 2; // legacy-ish, recomputed from DOM in practice; kept for API
      // desktop uses DOM ring in render for precision; provide sensible defaults
      R = 0.53 * H - ringBorder / 2;
      cx = (0.03 * W + R) - R; // placeholder
      cy = H / 2;
      sizeTable = [[0, 148], [1, 94], [2, 62], [3, 40], [3.6, 40]];
      opacityTable = [[0, 1], [1, 0.8], [2, 0.45], [3, 0.2], [3.6, 0]];
      step = 16 * Math.PI / 180;
      textLeft = 0.38 * W;
      textWidth = Math.min(W * 0.58, 608);
    }

    const circles = [];
    for (let i = 0; i < n; i++) {
      const angle = (i - af) * step;
      const distance = Math.abs(i - af);
      const size = interpolate(distance, sizeTable);
      const opacity = interpolate(distance, opacityTable);
      const x = cx + R * Math.cos(angle);
      const y = cy + R * Math.sin(angle);
      circles.push({ index: i, x, y, angle, distance, size, opacity, visible: distance < 3.6, scale: size / (isCompact ? 72 : 148) });
    }

    return {
      profile, W, H, count: n, activeFloat: af, s, R, cx, cy, ringBorder, step,
      ring: { x: cx - R - ringBorder, y: cy - R - ringBorder, diameter: (R + ringBorder) * 2, border: ringBorder },
      text: { left: textLeft, width: textWidth },
      circles
    };
  }

  window.GK_ARC = window.GK_ARC || {};
  window.GK_ARC.computeArcLayout = computeArcLayout;

  let frame = 0;
  let hideTimer = 0;
  let showTimer = 0;
  let activeIndex = -1;
  let pendingIndex = -1;
  let activeIndexFloat = 0;
  let targetIndexFloat = 0;
  let initialized = false;
  let mode = 'none'; // 'desktop' | 'compact' | 'fallback'
  let ro = null;
  let resizeDebounce = 0;
  let inView = false;

  const trackTravel = () => Math.max(track.offsetHeight - stage.offsetHeight, 1);

  const isFallback = () => {
    if (reducedMotion.matches) return true;
    if (compactMQ.matches && window.innerHeight < 520) return true; // landscape short phones
    return false;
  };

  const desiredMode = () => {
    if (isFallback()) return 'fallback';
    return compactMQ.matches ? 'compact' : 'desktop';
  };

  const setPanelImmediate = (index, visible) => {
    panels.forEach((p, i) => {
      const on = visible && i === index;
      p.classList.toggle('is-active', on);
      if (on) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
    });
  };

  const setPanel = (index) => {
    if (mode === 'fallback') {
      // stacked fallback: show all
      panels.forEach((p) => { p.classList.add('is-active'); p.removeAttribute('aria-hidden'); });
      activeIndex = index; pendingIndex = -1; return;
    }
    if (index === activeIndex && pendingIndex === -1) return;
    if (index === pendingIndex) return;
    pendingIndex = index;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; }
    if (showTimer) { clearTimeout(showTimer); showTimer = 0; }
    const doShow = () => {
      activeIndex = pendingIndex; pendingIndex = -1;
      panels.forEach((p, i) => {
        const on = i === activeIndex;
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
      });
    };
    if (activeIndex < 0) { doShow(); return; }
    // outgoing fades 150ms, incoming starts after 100ms -> never blank >250ms (150ms overlap window)
    panels.forEach((p, i) => { if (i === activeIndex) p.classList.remove('is-active'); });
    hideTimer = setTimeout(() => { hideTimer = 0; }, 150); // bookkeeping
    showTimer = setTimeout(doShow, 100);
  };

  const updateTrackHeight = () => {
    const navH = headerHeight();
    document.documentElement.style.setProperty('--gk-nav-h', `${navH}px`);
    if (mode === 'fallback') {
      track.style.removeProperty('height');
      track.style.removeProperty('--gk-values-track-h');
      return;
    }
    const stageH = stage.getBoundingClientRect().height || (window.innerHeight - navH);
    if (mode === 'compact') {
      const h = Math.ceil(stageH + count * window.innerHeight * 0.75);
      track.style.height = `${h}px`;
      track.style.setProperty('--gk-values-track-h', `${h}px`);
    } else {
      track.style.height = `${Math.ceil(stageH + (count - 1) * window.innerHeight)}px`;
      track.style.removeProperty('--gk-values-track-h');
    }
  };

  const render = () => {
    frame = 0;
    if (!inView || mode === 'fallback') return;

    const navH = headerHeight();
    const travel = trackTravel();
    const bounds = track.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (navH - bounds.top) / travel));
    targetIndexFloat = progress * (count - 1);

    if (!initialized) {
      activeIndexFloat = targetIndexFloat;
      initialized = true;
    } else {
      activeIndexFloat += (targetIndexFloat - activeIndexFloat) * 0.18;
      if (Math.abs(targetIndexFloat - activeIndexFloat) < 0.001) activeIndexFloat = targetIndexFloat;
    }

    const selectedIndex = Math.min(count - 1, Math.max(0, Math.round(activeIndexFloat)));
    setPanel(selectedIndex);

    const stageRect = stage.getBoundingClientRect();
    const W = stageRect.width || stage.clientWidth;
    const H = stageRect.height || stage.clientHeight;

    if (mode === 'compact') {
      const layout = computeArcLayout('compact', W, H, activeIndexFloat, count);
      // apply ring
      ring.style.left = `${layout.ring.x}px`;
      ring.style.top = `${layout.ring.y}px`;
      ring.style.width = `${layout.ring.diameter}px`;
      ring.style.height = `${layout.ring.diameter}px`;
      ring.style.borderWidth = `${layout.ring.border}px`;
      ring.style.transform = 'none';
      // text column
      stage.style.setProperty('--gk-values-text-left', `${layout.text.left}px`);
      stage.style.setProperty('--gk-values-text-width', `${layout.text.width}px`);
      // nodes
      layout.circles.forEach((c) => {
        const btn = nodes[c.index]; if (!btn) return;
        btn.style.setProperty('--x', `${c.x}px`);
        btn.style.setProperty('--y', `${c.y}px`);
        btn.style.setProperty('--scale', String(c.scale));
        btn.style.setProperty('--opacity', String(c.opacity));
        btn.style.zIndex = String(10000 - Math.round(c.distance * 100));
        btn.style.pointerEvents = c.visible ? 'auto' : 'none';
        if (c.index === selectedIndex) btn.setAttribute('aria-current', 'true'); else btn.removeAttribute('aria-current');
        btn.style.fontSize = c.distance < 0.5 ? `${13 * layout.s}px` : (c.distance >= 3 ? '0px' : '');
      });
    } else {
      // desktop: use DOM ring for precision (existing behavior)
      const ringRect = ring.getBoundingClientRect();
      const border = parseFloat(getComputedStyle(ring).borderTopWidth) || 0;
      const radius = ringRect.width / 2 - border / 2;
      const centerX = ringRect.left - stageRect.left + ringRect.width / 2;
      const centerY = stage.clientHeight / 2;
      const stageScale = Math.min(1, stage.clientHeight / 820);
      const minCenterDistance = (148 + 94) * stageScale / 2 + 12 * stageScale;
      const step = Math.max(16 * Math.PI / 180, 2 * Math.asin(Math.min(1, minCenterDistance / (2 * radius))));
      stage.style.setProperty('--stage-scale', String(stageScale));
      ring.style.removeProperty('left'); ring.style.removeProperty('top');
      ring.style.removeProperty('width'); ring.style.removeProperty('height');
      ring.style.removeProperty('border-width'); ring.style.removeProperty('transform');

      nodes.forEach((button, index) => {
        const angle = (index - activeIndexFloat) * step;
        const distance = Math.abs(index - activeIndexFloat);
        const size = interpolate(distance, [[0, 148], [1, 94], [2, 62], [3, 40], [3.6, 40]]) * stageScale;
        const opacity = interpolate(distance, [[0, 1], [1, 0.8], [2, 0.45], [3, 0.2], [3.6, 0]]);
        const visible = distance < 3.6;
        button.style.setProperty('--x', `${centerX + radius * Math.cos(angle)}px`);
        button.style.setProperty('--y', `${centerY + radius * Math.sin(angle)}px`);
        button.style.setProperty('--scale', String(size / 148));
        button.style.setProperty('--opacity', String(opacity));
        button.style.zIndex = String(10000 - Math.round(distance * 100));
        button.style.pointerEvents = visible ? 'auto' : 'none';
        button.style.removeProperty('font-size');
        if (index === selectedIndex) button.setAttribute('aria-current', 'true'); else button.removeAttribute('aria-current');
      });
    }

    if (Math.abs(targetIndexFloat - activeIndexFloat) >= 0.001) {
      frame = window.requestAnimationFrame(render);
    }
  };

  const schedule = () => { if (!frame && inView && mode !== 'fallback') frame = window.requestAnimationFrame(render); };

  const clearNodeInline = () => {
    nodes.forEach((button) => {
      button.removeAttribute('aria-current');
      ['--x','--y','--scale','--opacity','pointer-events','z-index','font-size'].forEach(p => button.style.removeProperty(p));
    });
    ring.style.removeProperty('left'); ring.style.removeProperty('top');
    ring.style.removeProperty('width'); ring.style.removeProperty('height');
    ring.style.removeProperty('border-width'); ring.style.removeProperty('transform');
    stage.style.removeProperty('--gk-values-text-left');
    stage.style.removeProperty('--gk-values-text-width');
    stage.style.removeProperty('--stage-scale');
  };

  const applyMode = () => {
    const next = desiredMode();
    if (next === mode) { updateTrackHeight(); schedule(); return; }
    mode = next;
    initialized = false;
    activeIndex = -1; pendingIndex = -1; activeIndexFloat = 0; targetIndexFloat = 0;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; }
    if (showTimer) { clearTimeout(showTimer); showTimer = 0; }
    section.classList.toggle('gk-values--arc-active', mode !== 'fallback');
    section.classList.toggle('gk-values--fallback', mode === 'fallback');

    if (mode === 'fallback') {
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      clearNodeInline();
      panels.forEach((p) => { p.classList.add('is-active'); p.removeAttribute('aria-hidden'); p.style.removeProperty('transition'); });
      track.style.removeProperty('height');
    } else {
      panels.forEach((p, i) => { p.classList.toggle('is-active', i === 0); if (i===0) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden','true'); });
      activeIndex = 0;
      clearNodeInline();
    }
    updateTrackHeight();
    schedule();
  };

  const onResize = () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => { applyMode(); updateTrackHeight(); schedule(); }, 100);
  };

  nodes.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (mode === 'fallback') return;
      const fraction = index / (count - 1);
      const navH = headerHeight();
      const top = window.scrollY + track.getBoundingClientRect().top - navH + fraction * trackTravel();
      window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
    });
  });

  // Only run rAF while on screen
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      inView = entries.some(e => e.isIntersecting);
      if (inView) schedule();
      else if (frame) { cancelAnimationFrame(frame); frame = 0; }
    }, { rootMargin: '20% 0px' });
    io.observe(section);
  } else {
    inView = true;
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('orientationchange', onResize);
  window.addEventListener('pageshow', () => { applyMode(); schedule(); });
  reducedMotion.addEventListener('change', () => { applyMode(); schedule(); });
  compactMQ.addEventListener('change', () => { applyMode(); schedule(); });

  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(onResize);
    ro.observe(stage);
  }

  // initial: mark JS-capable; fallback if something throws
  try {
    applyMode();
  } catch (e) {
    section.classList.remove('gk-values--arc-active');
    section.classList.add('gk-values--fallback');
    mode = 'fallback';
  }
  schedule();
})();
