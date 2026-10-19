document.addEventListener('DOMContentLoaded', () => {
  const select = document.querySelector('#pcb-demo-input');
  const button = document.querySelector('[data-pcb-run]');
  const output = document.querySelector('[data-pcb-output]');
  if (!select || !button || !output) return;

  const demoNotes = {
    'board-a': 'Demo data: sample region A selected for human review.',
    'board-b': 'Demo data: sample region B noted for discussion; no defect classification is supplied.',
    'board-c': 'Demo data: sample image context selected. Inspection criteria are To be confirmed.'
  };
  button.addEventListener('click', () => {
    output.textContent = demoNotes[select.value] || 'Demo data: sample not found.';
  });
});
