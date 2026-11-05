(() => {
  'use strict';

  const root = document.querySelector('[data-roi-calculator="ppe"]');
  if (!root || !window.FrameIQRoi) return;

  let latestResult = '';
  window.FrameIQRoi.createRoiCalculator(root, {
    fields: [
      { id: 'cameras', label: 'Camera views', unit: 'views', default: 0, min: 0, max: null, sliderMax: 100000, step: 1, help: 'Number of camera views included.' },
      { id: 'hours', label: 'Recorded hours per camera per day', unit: 'hours/day', default: 0, min: 0, max: null, sliderMax: 24, step: .1, help: 'Recorded hours for each camera view per day.' },
      { id: 'days', label: 'Operating days per month', unit: 'days/month', default: 0, min: 0, max: null, sliderMax: 31, step: 1, help: 'Operating days included in one month.' },
      { id: 'minutes', label: 'Manual review minutes per recorded camera-hour', unit: 'minutes/hour', default: 0, min: 0, max: null, sliderMax: 60, step: .1, help: 'Manual review time for one recorded camera-hour.' },
      { id: 'hourlyCost', label: 'Labour cost per hour (INR)', unit: 'INR/hour', default: 0, min: 0, max: null, sliderMax: 100000, step: 1, help: 'Your own hourly-cost input.' },
      { id: 'coverage', label: 'Share of review time explored (%)', unit: '%', default: 0, min: 0, max: 100, step: 1, help: 'The share of review time included in this illustrative estimate.' }
    ],
    compute(values) {
      const hours = values.cameras * values.hours * values.days * values.minutes / 60 * values.coverage / 100;
      return { hours, value: hours * values.hourlyCost };
    },
    outputs: [
      { id: 'hours', label: 'Illustrative review time explored per month', unit: 'hours/month', format: 'number', isHeadline: true },
      { id: 'value', label: 'Illustrative value of time, using your hourly-cost input', unit: 'per month', format: 'currency' }
    ],
    assumptions: ['No automated review coverage or savings is assumed.'],
    disclaimer: 'Illustrative estimate based on your inputs'
  });

  root.addEventListener('roi-update', (event) => {
    const outputs = event.detail.outputs;
    latestResult = `Illustrative estimate based on your inputs\nIllustrative hours per month: ${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(outputs.hours)}\nIllustrative value of time per month: ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(outputs.value)}\nThis is not a product result, quote, forecast, or promised saving.`;
  });

  root.querySelector('[data-roi-print]')?.addEventListener('click', () => window.print());
  root.querySelector('[data-roi-email]')?.addEventListener('click', () => {
    if (!latestResult || !window.SITE_CONTACT?.email) return;
    window.location.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent('Illustrative PPE Safety estimate')}&body=${encodeURIComponent(latestResult)}`;
    const status = root.querySelector('[data-roi-action-status]');
    if (status) status.textContent = `An email draft is being opened for ${window.SITE_CONTACT.email}. It has not been sent.`;
  });
})();
