(() => {
  'use strict';

  const sceneIds = new Set(['ppe', 'pcb', 'crop', 'traffic']);
  const scenes = Array.from(document.querySelectorAll('[data-playground-scene]'));

  function selectScene() {
    const sceneId = window.location.hash.slice(1).toLowerCase();
    if (!sceneIds.has(sceneId)) {
      scenes.forEach((scene) => scene.classList.remove('is-selected'));
      return;
    }
    scenes.forEach((scene) => scene.classList.toggle('is-selected', scene.id === sceneId));
  }

  selectScene();
  window.addEventListener('hashchange', selectScene);

  scenes.forEach((scene) => {
    const button = scene.querySelector('[data-copy-scene-json]');
    const status = scene.querySelector('[role="status"]');
    button?.addEventListener('click', async () => {
      const payload = {
        scene: scene.id,
        title: scene.querySelector('h2')?.textContent.trim() || '',
        mode: 'simulated',
        note: 'Illustrative scene only; no detection was run.'
      };
      try {
        await window.FrameIQForms.copyText(JSON.stringify(payload, null, 2));
        status.textContent = 'Illustrative JSON copied.';
      } catch (error) {
        console.error('Playground JSON could not be copied.', error);
        status.textContent = 'Copy was unavailable. Please try again.';
      }
    });
  });
})();
