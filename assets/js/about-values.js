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
    const isPhone = isCompact && W <= 767;
    const s = isCompact ? Math.min(1.5, Math.max(0.9, W / 390)) : Math.min(1, H / 820);

    let R, cx, cy, ringBorder, step, sizeTable, opacityTable, textLeft, textWidth;
    if (isPhone) {
      // Prompt 51 mobile arc: curved rail like desktop, active node centre at 0.22 * W.
      const s = Math.min(1, Math.max(0.88, W / 360));              // 320-359px scaling
      R = 0.72 * H;                                                  // ring radius
      ringBorder = Math.min(22, Math.max(14, W * 0.04));             // clamp(14px, 4vw, 22px)
      cx = 0.22 * W - R;                                             // ring centre; rightmost point at 0.22 * W
      cy = H / 2;
      // Angles from the active position: 0, +/-0.25, +/-0.5, +/-0.72, +/-0.9 rad.
      const angleTable = [0, 0.25, 0.5, 0.72, 0.9];
      const angleForDistance = (d) => {
        d = Math.min(Math.max(d, 0), 4);
        const i = Math.floor(d);
        if (i >= 4) { return 0.9; }
        const f = d - i;
        return angleTable[i] + (angleTable[i + 1] - angleTable[i]) * f;
      };
      sizeTable = [[0, 64 * s], [1, 50 * s], [2, 38 * s], [3, 28 * s], [3.6, 22 * s]];
      opacityTable = [[0, 1], [1, 0.82], [2, 0.6], [3, 0.4], [3.6, 0]];
      textLeft = 0.22 * W + 52;                                      // 0.22 * W + 32 + 20
      textWidth = Math.max(150, W - textLeft - 20);

      const circles = [];
      for (let i = 0; i < n; i++) {
        const distance = Math.abs(i - af);
        const angle = (i >= af ? 1 : -1) * angleForDistance(distance);
        const size = interpolate(distance, sizeTable);
        const opacity = interpolate(distance, opacityTable);
        const x = cx + R * Math.cos(angle);
        const y = cy + R * Math.sin(angle);
        circles.push({ index: i, x, y, angle, distance, size, opacity, visible: distance < 3.6, scale: 1 });
      }

      return {
        profile, W, H, count: n, activeFloat: af, s, R, cx, cy, ringBorder, step: 0.25,
        ring: { x: cx - R - ringBorder, y: cy - R - ringBorder, diameter: (R + ringBorder) * 2, border: ringBorder },
        text: { left: textLeft, width: textWidth },
        circles
      };
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
      sizeTable = [[0, 180], [1, 94], [2, 62], [3, 40], [3.6, 40]];
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
      circles.push({ index: i, x, y, angle, distance, size, opacity, visible: distance < 3.6, scale: size / (isPhone ? 100 : (isCompact ? 72 : 180)) });
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
  let safetyTimer = 0;
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
    if (compactMQ.matches && window.innerHeight < 500) return true; // landscape short phones
    return false;
  };

  const isMobileArc = () => mode === 'compact' && window.innerWidth <= 767;

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
    syncNodeAria();
  };

  const syncNodeAria = () => {
    nodes.forEach((btn, i) => {
      if (i === activeIndex) btn.setAttribute('aria-current', 'true');
      else btn.removeAttribute('aria-current');
    });
  };

  // The inner title + sentence are what fade on mobile; the badge stays solid.
  const forceInnerVisible = (panel) => {
    if (!panel) return;
    panel.querySelectorAll('.gk-values__title, .gk-values__desc').forEach((el) => {
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('transform', 'none', 'important');
    });
  };

  const clearInnerForce = (panel) => {
    if (!panel) return;
    panel.querySelectorAll('.gk-values__title, .gk-values__desc').forEach((el) => {
      el.style.removeProperty('opacity');
      el.style.removeProperty('transform');
    });
  };

  // Safety net: 400ms after the last change, force the active panel's inner
  // elements to their end state so a missed transition can never leave text hidden.
  const scheduleSafety = () => {
    if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = 0; }
    safetyTimer = setTimeout(() => {
      safetyTimer = 0;
      if (mode === 'fallback') return;
      const panel = panels[activeIndex];
      if (!panel) return;
      panel.classList.add('is-active');
      panel.classList.remove('is-leaving');
      panel.removeAttribute('aria-hidden');
      forceInnerVisible(panel);
    }, 400);
  };

  const setPanel = (index) => {
    if (mode === 'fallback') {
      // stacked fallback: show all
      panels.forEach((p) => { p.classList.add('is-active'); p.classList.remove('is-leaving'); p.removeAttribute('aria-hidden'); clearInnerForce(p); });
      activeIndex = index; pendingIndex = -1;
      syncNodeAria();
      return;
    }
    if (index === activeIndex && pendingIndex === -1) return;
    if (index === pendingIndex) return;
    pendingIndex = index;
    if (hideTimer) { clearTimeout(hideTimer); hideTimer = 0; }
    if (showTimer) { clearTimeout(showTimer); showTimer = 0; }
    scheduleSafety();
    const doShow = () => {
      showTimer = 0;
      activeIndex = pendingIndex; pendingIndex = -1;
      panels.forEach((p, i) => {
        p.classList.remove('is-leaving');
        clearInnerForce(p);
        const on = i === activeIndex;
        p.classList.toggle('is-active', on);
        if (on) p.removeAttribute('aria-hidden'); else p.setAttribute('aria-hidden', 'true');
      });
      syncNodeAria();
      scheduleSafety();
    };
    if (activeIndex < 0) { doShow(); return; }
    if (isMobileArc()) {
      // Mobile: fade the inner title + sentence out (200ms) while the outgoing
      // panel stays visible, then swap and fade the new ones in. Exactly one
      // panel is visible at any moment and the text always ends at opacity 1.
      const outgoing = panels[activeIndex];
      if (outgoing) { clearInnerForce(outgoing); outgoing.classList.add('is-leaving'); }
      showTimer = setTimeout(doShow, 200);
    } else {
      // outgoing fades 150ms, incoming starts after 100ms so they overlap, never blank
      panels.forEach((p, i) => { if (i === activeIndex) p.classList.remove('is-active'); });
      hideTimer = setTimeout(() => { hideTimer = 0; }, 150); // bookkeeping
      showTimer = setTimeout(doShow, 100);
    }
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
      const h = Math.ceil(stageH * (0.70 * count + 1)); // ~70svh per value + 100svh tail
      track.style.height = `${h}px`;
      track.style.setProperty('--gk-values-track-h', `${h}px`);
    } else {
      track.style.height = `${Math.ceil(stageH + (count - 1) * window.innerHeight)}px`;
      track.style.removeProperty('--gk-values-track-h');
    }
  };

  const render = () => {
    frame = 0;
    if (mode === 'fallback') return;

    const navH = headerHeight();
    const travel = trackTravel();
    const bounds = track.getBoundingClientRect();
    let progress = Math.min(1, Math.max(0, (navH - bounds.top) / travel));
    // Per-segment dwell: each value transition is a segment; within each,
    // the first 20% holds the current value, the middle 60% moves with ease,
    // the last 20% holds the next value. Settled state is present for >=55%
    // of each value's scroll distance.
    const segments = count - 1;
    const segWidth = 1 / segments;
    const segment = Math.min(Math.floor(progress / segWidth), segments - 1);
    const segProgress = (progress - segment * segWidth) / segWidth; // 0 to 1 within segment
    const DWELL = 0.20;
    if (segProgress <= DWELL) {
      targetIndexFloat = segment; // hold current value
    } else if (segProgress >= 1 - DWELL) {
      targetIndexFloat = Math.min(segment + 1, count - 1); // hold next value
    } else {
      const t = (segProgress - DWELL) / (1 - 2 * DWELL); // 0 to 1 within movement phase
      const eased = t * t * (3 - 2 * t); // smoothstep approximates cubic-bezier(.45,0,.2,1)
      targetIndexFloat = segment + eased;
    }

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
      if (W <= 767) {
        // Phone arc per Prompt 50: curved rail like desktop; active node centre ~20% from left edge.
        const layout = computeArcLayout('compact', W, H, activeIndexFloat, count);
        ring.style.display = 'block';
        ring.style.left = `${layout.ring.x}px`;
        ring.style.top = `${layout.ring.y}px`;
        ring.style.width = `${layout.ring.diameter}px`;
        ring.style.height = `${layout.ring.diameter}px`;
        ring.style.borderWidth = `${layout.ring.border}px`;
        ring.style.borderStyle = 'solid';
        ring.style.borderColor = 'rgba(101, 66, 200, 0.14)';
        ring.style.borderRadius = '50%';
        ring.style.transform = 'none';
        stage.style.setProperty('--gk-values-text-left', `${layout.text.left}px`);
        stage.style.removeProperty('--gk-values-text-width');
        stage.style.removeProperty('--stage-scale');
      layout.circles.forEach((c) => {
        const btn = nodes[c.index]; if (!btn) return;
        const active = c.index === selectedIndex;
        const size = c.size;
        const pad = Math.max(0, (44 - size) / 2); // invisible hit area >= 44x44
        btn.style.setProperty('--x', `${c.x}px`);
        btn.style.setProperty('--y', `${c.y}px`);
        btn.style.setProperty('--scale', '1');           // numbers stay upright; size carries the shrink
        btn.style.setProperty('--opacity', String(c.opacity));
        btn.style.width = `${size}px`;
        btn.style.height = `${size}px`;
        btn.style.padding = `${pad}px`;
        btn.style.boxSizing = 'border-box';
        btn.style.backgroundClip = 'content-box';
        btn.style.background = active ? '#6542c8' : 'rgba(101, 66, 200, 0.14)';
        btn.style.color = active ? '#ffffff' : '#6542c8';
        btn.style.setProperty('font-size', `${15 * size / 64}px`, 'important');
        btn.style.zIndex = String(10000 - Math.round(c.distance * 100));
        btn.style.pointerEvents = c.visible ? 'auto' : 'none';
        if (active) btn.setAttribute('aria-current', 'true'); else btn.removeAttribute('aria-current');
      });
      } else {
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
      }
    } else {
      // desktop: use DOM ring for precision (existing behavior)
      const ringRect = ring.getBoundingClientRect();
      const border = parseFloat(getComputedStyle(ring).borderTopWidth) || 0;
      const radius = ringRect.width / 2 - border / 2;
      const centerX = ringRect.left - stageRect.left + ringRect.width / 2;
      const centerY = stage.clientHeight / 2;
      const stageScale = Math.min(1, stage.clientHeight / 820);
      const minCenterDistance = (180 + 94) * stageScale / 2 + 12 * stageScale;
      const step = Math.max(16 * Math.PI / 180, 2 * Math.asin(Math.min(1, minCenterDistance / (2 * radius))));
      stage.style.setProperty('--stage-scale', String(stageScale));
      ring.style.removeProperty('left'); ring.style.removeProperty('top');
      ring.style.removeProperty('width'); ring.style.removeProperty('height');
      ring.style.removeProperty('border-width'); ring.style.removeProperty('transform');

      nodes.forEach((button, index) => {
        const angle = (index - activeIndexFloat) * step;
        const distance = Math.abs(index - activeIndexFloat);
        const size = interpolate(distance, [[0, 180], [1, 94], [2, 62], [3, 40], [3.6, 40]]) * stageScale;
        const opacity = interpolate(distance, [[0, 1], [1, 0.8], [2, 0.45], [3, 0.2], [3.6, 0]]);
        const visible = distance < 3.6;
        button.style.setProperty('--x', `${centerX + radius * Math.cos(angle)}px`);
        button.style.setProperty('--y', `${centerY + radius * Math.sin(angle)}px`);
        button.style.setProperty('--scale', String(size / 180));
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

  const schedule = () => { if (!frame && mode !== 'fallback') frame = window.requestAnimationFrame(render); };

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
    if (safetyTimer) { clearTimeout(safetyTimer); safetyTimer = 0; }
    panels.forEach((p) => { p.classList.remove('is-leaving'); clearInnerForce(p); });
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
      syncNodeAria();
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
