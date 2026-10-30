// bento-stack.js
// Explore the platform: works out how far the visitor has scrolled through
// the pinned cards and writes it to the CSS variable --bq (0 to 4).
// Only runs on screens 900px or wider when reduced motion is off.
(() => {
  'use strict';

  const section = document.getElementById('home-practices');
  const stack = section ? section.querySelector('.site-bento') : null;
  if (!stack) return;

  // the dots sit after the stack in the HTML; move them inside so they can stay pinned
  const dots = section.querySelector('.site-bento__dots');
  if (dots && dots.parentElement !== stack) stack.appendChild(dots);

  const items = Array.from(stack.querySelectorAll('.site-bento__item'));
  if (items.length < 2) return;

  const small = window.matchMedia('(max-width: 899px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  let current = -1;

  const update = () => {
    frame = 0;
    // pin = the top value the cards stick at
    const pin = parseFloat(getComputedStyle(items[0]).top) || 0;
    const rect = stack.getBoundingClientRect();
    const travel = Math.max(rect.height - items[0].offsetHeight - 70, 1);
    const p = Math.min(1, Math.max(0, (pin - rect.top) / travel));
    const q = p * (items.length - 1);
    stack.style.setProperty('--bq', q.toFixed(3));

    const now = Math.round(q);
    if (now !== current) {
      current = now;
      items.forEach((item, i) => item.classList.toggle('is-current', i === now));
    }
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  const apply = () => {
    const on = !small.matches && !reduced.matches;
    section.classList.toggle('bento-stack-on', on);
    if (on) schedule();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  small.addEventListener('change', apply);
  reduced.addEventListener('change', apply);
  apply();
})();
