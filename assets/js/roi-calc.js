(() => {
  'use strict';

  const namespace = window.FrameIQRoi = window.FrameIQRoi || {};
  const numberFormat = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 });
  const currencyFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  function formatValue(value, format) {
    if (format === 'currency') return currencyFormat.format(value);
    if (format === 'integer') return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(value);
    return numberFormat.format(value);
  }

  function createRoiCalculator(root, config) {
    const values = {};
    const lastValid = {};
    const fields = new Map();
    const outputElements = new Map();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fieldsHost = root.querySelector('[data-roi-fields]');
    const outputsHost = root.querySelector('[data-roi-outputs]');
    const status = root.querySelector('[data-roi-status]');

    config.fields.forEach((field) => {
      values[field.id] = field.default;
      lastValid[field.id] = field.default;
      const wrapper = document.createElement('div');
      wrapper.className = 'roi-field';
      const label = document.createElement('label');
      label.className = 'roi-field__label';
      label.htmlFor = `roi-${field.id}`;
      label.textContent = field.label;
      const control = document.createElement('div');
      control.className = 'roi-field__control';
      const number = document.createElement('input');
      number.id = `roi-${field.id}`;
      number.type = 'number';
      number.inputMode = 'decimal';
      number.min = String(field.min);
      if (field.max !== null && field.max !== undefined) number.max = String(field.max);
      number.step = String(field.step);
      number.value = String(field.default);
      const unit = document.createElement('span');
      unit.className = 'roi-field__unit';
      unit.textContent = field.unit;
      const range = document.createElement('input');
      range.type = 'range';
      range.min = String(field.min);
      range.max = String(field.sliderMax ?? field.max ?? 100000);
      range.step = String(field.step);
      range.value = String(field.default);
      range.setAttribute('aria-label', `${field.label} slider`);
      const help = document.createElement('p');
      help.className = 'roi-field__help';
      help.textContent = field.help;
      control.append(number, unit);
      wrapper.append(label, control, range, help);
      fieldsHost.append(wrapper);
      fields.set(field.id, { number, range });

      const commit = (raw) => {
        const parsed = Number(raw);
        const value = Number.isFinite(parsed)
          ? field.max === null || field.max === undefined
            ? Math.max(field.min, parsed)
            : Math.min(field.max, Math.max(field.min, parsed))
          : lastValid[field.id];
        values[field.id] = value;
        lastValid[field.id] = value;
        number.value = String(value);
        range.value = String(value);
        update();
      };
      number.addEventListener('input', () => {
        if (number.value === '') {
          commit(lastValid[field.id]);
          return;
        }
        commit(number.value);
      });
      range.addEventListener('input', () => commit(range.value));
    });

    config.outputs.forEach((output) => {
      const card = document.createElement('div');
      card.className = `roi-stat${output.isHeadline ? ' roi-stat--headline' : ''}`;
      const value = document.createElement('strong');
      const label = document.createElement('span');
      label.textContent = `${output.label}${output.unit ? ` (${output.unit})` : ''}`;
      card.append(value, label);
      outputsHost.append(card);
      outputElements.set(output.id, value);
    });

    function update() {
      const computed = config.compute({ ...values });
      config.outputs.forEach((output) => {
        const element = outputElements.get(output.id);
        const next = formatValue(computed[output.id], output.format);
        if (!reducedMotion) {
          element.animate([{ opacity: .35 }, { opacity: 1 }], { duration: 250, easing: 'ease-out' });
        }
        element.textContent = next;
      });
      if (status) status.textContent = config.disclaimer;
      root.dispatchEvent(new CustomEvent('roi-update', { detail: { values: { ...values }, outputs: computed } }));
    }

    root.querySelector('[data-roi-reset]')?.addEventListener('click', () => {
      config.fields.forEach((field) => {
        values[field.id] = field.default;
        lastValid[field.id] = field.default;
        const controls = fields.get(field.id);
        controls.number.value = String(field.default);
        controls.range.value = String(field.default);
      });
      update();
    });

    update();
    return { getValues: () => ({ ...values }) };
  }

  namespace.createRoiCalculator = createRoiCalculator;
})();
