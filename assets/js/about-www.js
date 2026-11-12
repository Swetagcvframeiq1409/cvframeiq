(() => {
  // Respect no-JS fallback
  if (document.documentElement.classList.contains('no-js')) return;
  
  const section = document.querySelector('[data-www]');
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
    const runwayHeight = window.innerHeight * 3.6; /* 360svh ~ 3.6 viewport heights */
    const pinHeight = Math.max(window.innerHeight - headerHeight, 1);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const progress = Math.min(1, Math.max(0,
      (window.scrollY + headerHeight - sectionTop) / Math.max(runwayHeight - pinHeight, 1)
    ));

    /* Drive --p with the same progress map as Prompt 46 */
    section.style.setProperty('--p', String(progress));

    /* Add is-enhanced class when scrolling into the pinned section */
    if (progress > 0.02) {
      section.classList.add('is-enhanced');
    } else {
      section.classList.remove('is-enhanced');
    }
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  const syncMotionMode = () => {
    if (reducedMotion.matches) {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      section.classList.remove('is-enhanced');
      section.style.removeProperty('--p');
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