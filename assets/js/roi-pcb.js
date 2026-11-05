(() => {
  'use strict';

  const root = document.querySelector('[data-roi-calculator="pcb"]');
  if (!root || !window.FrameIQRoi) return;

  let latestResult = '';
  window.FrameIQRoi.createRoiCalculator(root, {
    fields: [
      { id: 'volume', label: 'Boards reviewed per month', unit: 'boards', default: 0, min: 0, max: 100000, step: 1, help: 'Number of boards reviewed in one month.' },
      { id: 'minutes', label: 'Manual review minutes per board', unit: 'minutes', default: 0, min: 0, max: 1440, step: .1, help: 'Time spent on manual review for one board.' },
      { id: 'hourlyCost', label: 'Labour cost per hour (INR)', unit: 'INR/hour', default: 0, min: 0, max: 100000, step: 1, help: 'Your own hourly-cost input.' },
      { id: 'coverage', label: 'Share of review time explored (%)', unit: '%', default: 0, min: 0, max: 100, step: 1, help: 'The share of review time included in this illustrative estimate.' }
    ],
    compute(values) {
      const hours = values.volume * values.minutes / 60 * values.coverage / 100;
      return { hours, value: hours * values.hourlyCost };
    },
    outputs: [
      { id: 'hours', label: 'Illustrative review time explored per month', unit: 'hours/month', format: 'number', isHeadline: true },
      { id: 'value', label: 'Illustrative value of time, using your hourly-cost input', unit: 'per month', format: 'currency' }
    ],
    assumptions: ['No automation coverage or savings is assumed.'],
    disclaimer: 'Illustrative estimate based on your inputs'
  });

  root.addEventListener('roi-update', (event) => {
    const values = event.detail.values;
    const outputs = event.detail.outputs;
    latestResult = `Illustrative estimate based on your inputs\nIllustrative hours per month: ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(outputs.hours)}\nIllustrative value of time per month: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(outputs.value)}\nThis is not a product result, quote, forecast, or promised saving.`;
    root.dataset.lastInputs = JSON.stringify(values);
  });

  root.querySelector('[data-roi-print]')?.addEventListener('click', () => window.print());
  root.querySelector('[data-roi-email]')?.addEventListener('click', () => {
    if (!latestResult || !window.SITE_CONTACT?.email) return;
    window.location.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent('Illustrative PCB Guardian estimate')}&body=${encodeURIComponent(latestResult)}`;
    const status = root.querySelector('[data-roi-action-status]');
    if (status) status.textContent = `An email draft is being opened for ${window.SITE_CONTACT.email}. It has not been sent.`;
  });
})();
