(() => {
  'use strict';

  const currency = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 });

  document.querySelectorAll('[data-roi-calculator]').forEach((calculator) => {
    const type = calculator.dataset.roiCalculator;
    const fields = Array.from(calculator.querySelectorAll('input'));
    const results = calculator.querySelector('.calculator-results');
    const emailButton = calculator.querySelector('[data-calculator-email]');
    const status = calculator.querySelector('.calculator-status');
    let latestResult = '';

    const calculate = () => {
      const values = Object.fromEntries(fields.map((field) => [field.name, field.value === '' ? null : Number(field.value)]));
      const missing = fields.some((field) => values[field.name] === null);
      const invalid = fields.some((field) => !Number.isFinite(values[field.name]) || values[field.name] < 0)
        || values.coverage > 100;
      emailButton.disabled = missing || invalid;
      status.textContent = '';
      if (missing || invalid) {
        latestResult = '';
        results.replaceChildren(Object.assign(document.createElement('p'), {
          textContent: missing ? 'Enter all assumptions to display an estimate.' : 'Check the inputs. Values must be non-negative and the explored share must be 0–100%.'
        }));
        return;
      }

      const monthlyMinutes = type === 'pcb'
        ? values.volume * values.minutes
        : values.cameras * values.hours * values.days * values.minutes;
      const illustrativeHours = monthlyMinutes / 60 * values.coverage / 100;
      const illustrativeValue = illustrativeHours * values.hourlyCost;
      latestResult = `Illustrative estimate based on your inputs\nIllustrative hours per month: ${number.format(illustrativeHours)}\nIllustrative value of time per month: ${currency.format(illustrativeValue)}\nThis is not a product result, quote, forecast, or promised saving.`;
      results.replaceChildren();
      const hours = document.createElement('p');
      hours.innerHTML = `<strong>${number.format(illustrativeHours)} hours/month</strong><span>Illustrative review time explored</span>`;
      const value = document.createElement('p');
      value.innerHTML = `<strong>${currency.format(illustrativeValue)}/month</strong><span>Illustrative value of time, using your hourly-cost input</span>`;
      results.append(hours, value);
      emailButton.disabled = false;
    };

    fields.forEach((field) => field.addEventListener('input', calculate));
    calculator.querySelector('[data-calculator-print]')?.addEventListener('click', () => window.print());
    emailButton?.addEventListener('click', () => {
      if (!latestResult || !window.SITE_CONTACT?.email) {
        status.textContent = 'The email draft could not be prepared because the result or contact email is unavailable.';
        return;
      }
      const subject = type === 'pcb' ? 'Illustrative PCB Guardian estimate' : 'Illustrative PPE Safety estimate';
      window.location.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(latestResult)}`;
      status.textContent = `An email draft is being opened for ${window.SITE_CONTACT.email}. It has not been sent.`;
    });
  });
})();
