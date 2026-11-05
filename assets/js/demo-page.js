(() => {
  'use strict';

  const tabs = Array.from(document.querySelectorAll('[data-dm-tab]'));
  const scenes = Array.from(document.querySelectorAll('[data-dm-scene]'));

  function activate(index, moveFocus) {
    const safeIndex = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === safeIndex;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    scenes.forEach((scene, sceneIndex) => {
      scene.classList.toggle('is-active', sceneIndex === safeIndex);
      scene.hidden = sceneIndex !== safeIndex;
    });
    if (moveFocus) tabs[safeIndex]?.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(index, false));
    tab.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        activate(index + 1, true);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        activate(index - 1, true);
      } else if (event.key === 'Home') {
        event.preventDefault();
        activate(0, true);
      } else if (event.key === 'End') {
        event.preventDefault();
        activate(tabs.length - 1, true);
      }
    });
  });

  function activateHash() {
    const hash = window.location.hash.slice(1).toLowerCase();
    const index = scenes.findIndex((scene) => scene.id === hash);
    if (index >= 0) activate(index, false);
  }

  if (tabs.length && scenes.length) {
    activateHash();
    window.addEventListener('hashchange', activateHash);
  }

  document.querySelectorAll('[data-dm-copy]').forEach((button) => {
    button.addEventListener('click', async () => {
      const scene = button.closest('[data-dm-scene]');
      const status = scene?.querySelector('[data-dm-status]');
      const payload = {
        scene: scene?.id || '',
        title: scene?.querySelector('h3')?.textContent.trim() || '',
        mode: 'simulated',
        note: 'Illustrative scene only; no detection was run.'
      };
      try {
        await window.FrameIQForms.copyText(JSON.stringify(payload, null, 2));
        if (status) status.textContent = 'Illustrative JSON copied.';
      } catch (error) {
        console.error('Playground JSON could not be copied.', error);
        if (status) status.textContent = 'Copy was unavailable. Please try again.';
      }
    });
  });

  const revealItems = document.querySelectorAll('.dm-reveal');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .12 });
    revealItems.forEach((item) => observer.observe(item));
  }
})();
