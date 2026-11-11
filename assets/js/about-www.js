(() => {
  const section = document.querySelector('[data-gk-www]');
  if (!section) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;

  const smooth = (start, end, progress) => {
    const value = Math.min(1, Math.max(0, (progress - start) / (end - start)));
    return value * value * (3 - 2 * value);
  };

  const render = () => {
    frame = 0;
    if (reducedMotion.matches) return;

    const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76;
    const mobile = window.matchMedia('(max-width: 599px)').matches;
    const runwayHeight = window.innerHeight * (mobile ? 3.2 : 4);
    const pinHeight = Math.max(window.innerHeight - headerHeight, 1);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const sectionHeight = section.classList.contains('is-enhanced') ? section.offsetHeight : runwayHeight;
    const progress = Math.min(1, Math.max(0,
      (window.scrollY + headerHeight - sectionTop) / Math.max(sectionHeight - pinHeight, 1)
    ));
    const easeOut = (value) => 1 - (1 - value) ** 3;
    const maximumGap = mobile ? 0.72 : 0.9;
    const values = {
      '--disc-o': 1 - smooth(0.20, 0.34, progress),
      '--disc-s': 1 + 0.35 * smooth(0.20, 0.34, progress),
      '--ring-o': 1 - smooth(0.16, 0.26, progress),
      '--circ-o': smooth(0.30, 0.40, progress),
      '--gap': 0.13 + (maximumGap - 0.13) * easeOut(smooth(0.46, 0.64, progress)),
      '--t1-o': smooth(0.56, 0.66, progress),
      '--t2-o': smooth(0.60, 0.70, progress),
      '--t3-o': smooth(0.64, 0.74, progress)
    };

    Object.entries(values).forEach(([name, value]) => {
      section.style.setProperty(name, String(value));
    });
    section.classList.add('is-enhanced');
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  const syncMotionMode = () => {
    if (reducedMotion.matches) {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      section.classList.remove('is-enhanced');
      ['--disc-o', '--disc-s', '--ring-o', '--circ-o', '--gap', '--t1-o', '--t2-o', '--t3-o']
        .forEach((name) => section.style.removeProperty(name));
      return;
    }
    render();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  reducedMotion.addEventListener('change', syncMotionMode);
  syncMotionMode();
})();
