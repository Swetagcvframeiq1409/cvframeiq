(() => {
  'use strict';

  const revealTimers = new WeakMap();
  const copyTimers = new WeakMap();
  let revealObserver;
  document.documentElement.classList.add('js-reveal');

  function initReveal(root = document) {
    const items = Array.from(root.querySelectorAll('.dm-reveal'))
      .filter(el => !el.dataset.revealInitialized);
    if (!items.length) return;
    items.forEach(el => { el.dataset.revealInitialized = 'true'; });

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }

    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          window.clearTimeout(revealTimers.get(entry.target));
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
    }

    items.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
        return;
      }

      revealObserver.observe(el);
      revealTimers.set(el, window.setTimeout(() => {
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      }, 1200));
    });
  }

  function initTabs(root = document) {
    const tabs = Array.from(root.querySelectorAll('[data-dm-tab]'));
    if (!tabs.length || tabs.some(tab => tab.dataset.tabInitialized)) return;
    tabs.forEach(tab => { tab.dataset.tabInitialized = 'true'; });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const stage = root.querySelector('#dm-stage');
    const visual = stage?.querySelector('.dm-stage__visual');
    const image = stage?.querySelector('[data-dm-active-image]');
    const activeTitle = root.querySelector('[data-dm-active-title]');
    const activeHeading = root.querySelector('[data-dm-active-heading]');
    const activeCopy = root.querySelector('[data-dm-active-copy]');
    const jsonPreview = root.querySelector('[data-dm-json-preview]');
    const viewTabs = Array.from(root.querySelectorAll('[data-dm-view-tab]'));
    const viewPanels = Array.from(root.querySelectorAll('[data-dm-view-panel]'));
    const workspace = root.querySelector('.dm-workspace');
    if (!stage || !visual || !image) return;

    function getPayload(tab) {
      return {
        scene: tab.dataset.scene || '',
        title: tab.dataset.title || '',
        mode: 'simulated',
        note: 'Illustrative scene only; no detection was run.'
      };
    }

    function activate(index, moveFocus, updateHash = false, instant = false) {
      const safeIndex = (index + tabs.length) % tabs.length;
      const selected = tabs[safeIndex];
      tabs.forEach((tab, i) => {
        const active = i === safeIndex;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      stage.setAttribute('aria-labelledby', selected.id);
      if (activeTitle) activeTitle.textContent = selected.dataset.title || '';
      if (activeHeading) activeHeading.textContent = selected.dataset.title || '';
      if (activeCopy) activeCopy.textContent = selected.dataset.description || '';
      const payload = getPayload(selected);
      if (jsonPreview) jsonPreview.textContent = JSON.stringify(payload, null, 2);

      const nextImage = selected.dataset.image || '';
      if (image.getAttribute('src') !== nextImage) {
        if (!reducedMotion && !instant) visual.classList.add('is-changing');
        image.alt = selected.dataset.alt || '';
        image.onload = () => requestAnimationFrame(() => visual.classList.remove('is-changing'));
        image.onerror = () => {
          visual.classList.remove('is-changing');
          visual.classList.add('dm-media--fallback');
        };
        image.classList.remove('dm-media--error');
        visual.classList.remove('dm-media--fallback');
        image.src = nextImage;
        if (image.complete && image.naturalWidth) {
          requestAnimationFrame(() => visual.classList.remove('is-changing'));
        }
      } else {
        image.alt = selected.dataset.alt || '';
      }
      if (moveFocus) tabs[safeIndex].focus();
      if (updateHash) {
        window.history.pushState(window.history.state, '', `#scene=${selected.dataset.scene}`);
      }
    }

    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => activate(index, false, true));
      tab.addEventListener('keydown', event => {
        if (event.key === 'ArrowRight') { event.preventDefault(); activate(index + 1, true, true); }
        else if (event.key === 'ArrowLeft') { event.preventDefault(); activate(index - 1, true, true); }
        else if (event.key === 'Home') { event.preventDefault(); activate(0, true, true); }
        else if (event.key === 'End') { event.preventDefault(); activate(tabs.length - 1, true, true); }
      });
    });

    const activateHash = () => {
      const params = new URLSearchParams(window.location.hash.slice(1));
      const sceneId = (params.get('scene') || '').toLowerCase();
      const index = tabs.findIndex(tab => tab.dataset.scene === sceneId);
      if (index >= 0) activate(index, false, false, true);
    };
    const params = new URLSearchParams(window.location.hash.slice(1));
    const initialScene = (params.get('scene') || '').toLowerCase();
    const initialIndex = tabs.findIndex(tab => tab.dataset.scene === initialScene);
    activate(initialIndex >= 0 ? initialIndex : 0, false, false, true);
    window.addEventListener('hashchange', activateHash);

    viewTabs.forEach((tab, index) => {
      const activateView = (position, moveFocus) => {
        const selected = viewTabs[position];
        viewTabs.forEach((candidate, i) => {
          const active = i === position;
          candidate.setAttribute('aria-selected', String(active));
          candidate.tabIndex = active ? 0 : -1;
        });
        viewPanels.forEach(panel => { panel.hidden = panel.id !== selected.getAttribute('aria-controls'); });
        if (moveFocus) selected.focus();
      };
      tab.addEventListener('click', () => activateView(index, false));
      tab.addEventListener('keydown', event => {
        let next = -1;
        if (event.key === 'ArrowRight') next = (index + 1) % viewTabs.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + viewTabs.length) % viewTabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = viewTabs.length - 1;
        if (next < 0) return;
        event.preventDefault();
        activateView(next, true);
      });
    });

    const preload = () => {
      tabs.forEach(tab => {
        const image = new Image();
        image.src = tab.dataset.image || '';
      });
    };
    if ('IntersectionObserver' in window && workspace) {
      const observer = new IntersectionObserver((entries, instance) => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        preload();
        instance.disconnect();
      }, { rootMargin: '400px 0px' });
      observer.observe(workspace);
    } else {
      preload();
    }
  }

  function initCopyJson(root = document) {
    root.querySelectorAll('[data-dm-copy]').forEach(button => {
      if (button.dataset.copyInitialized) return;
      button.dataset.copyInitialized = 'true';
      button.addEventListener('click', async () => {
        const selected = root.querySelector('[data-dm-tab][aria-selected="true"]');
        const status = root.querySelector('[data-dm-status]');
        const label = button.querySelector('[data-dm-copy-label]');
        const icon = button.querySelector('i');
        const originalLabel = label ? label.textContent : button.textContent;
        const originalIcon = icon ? icon.className : '';
        const payload = selected ? {
          scene: selected.dataset.scene || '',
          title: selected.dataset.title || '',
          mode: 'simulated',
          note: 'Illustrative scene only; no detection was run.'
        } : null;
        try {
          if (!payload || !window.FrameIQForms?.copyText) throw new Error('Clipboard support is unavailable.');
          await window.FrameIQForms.copyText(JSON.stringify(payload, null, 2));
          if (label) label.textContent = 'Copied';
          if (icon) icon.className = 'bi bi-check2';
          if (status) status.textContent = 'Copied';
          window.clearTimeout(copyTimers.get(button));
          copyTimers.set(button, window.setTimeout(() => {
            if (label) label.textContent = originalLabel;
            if (icon) icon.className = originalIcon;
            if (status) status.textContent = '';
          }, 1500));
        } catch (error) {
          console.error('Playground JSON could not be copied.', error);
          if (status) status.textContent = 'Copy unavailable. Please try again.';
        }
      });
    });
  }

  function initTilt(root = document) {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    root.querySelectorAll('.dm-frame').forEach(frame => {
      if (frame.dataset.tiltInitialized) return;
      frame.dataset.tiltInitialized = 'true';
      frame.addEventListener('pointermove', event => {
        const bounds = frame.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const rotateY = (x - 0.5) * 6;
        const rotateX = (0.5 - y) * 6;
        frame.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
      frame.addEventListener('pointerleave', () => {
        frame.style.transform = '';
      });
    });
  }

  function init(root = document) {
    initReveal(root);
    initTabs(root);
    initCopyJson(root);
    initTilt(root);
  }

  window.FrameIQDemoPage = { init };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init(), { once: true });
  } else {
    init();
  }
})();
