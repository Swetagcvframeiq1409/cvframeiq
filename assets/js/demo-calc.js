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

  // Group icons
  const GROUP_ICONS = {
    'Camera views': 'bi-camera-video',
    'Review effort': 'bi-sliders',
    'Cost': 'bi-graph-up'
  };

  function updateSliderFill(range) {
    const min = parseFloat(range.min) || 0;
    const max = parseFloat(range.max) || 100;
    const val = parseFloat(range.value) || 0;
    const pct = max > min ? ((val - min) / (max - min)) * 100 : 0;
    range.style.setProperty('--slider-fill', `${pct}%`);
  }

  function countUp(element, targetValue, format, reducedMotion, animate) {
    const previousFrame = Number(element.dataset.animationFrame);
    if (previousFrame) cancelAnimationFrame(previousFrame);

    const currentValue = Number(element.dataset.numericValue);
    const startValue = Number.isFinite(currentValue) ? currentValue : 0;
    if (!animate || reducedMotion || !Number.isFinite(currentValue)) {
      element.textContent = formatValue(targetValue, format);
      element.dataset.numericValue = String(targetValue);
      return;
    }

    const startedAt = performance.now();
    const duration = 600;
    const step = now => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - ((1 - progress) ** 3);
      const value = startValue + (targetValue - startValue) * eased;
      element.textContent = formatValue(value, format);
      element.dataset.numericValue = String(value);
      if (progress < 1) {
        element.dataset.animationFrame = String(requestAnimationFrame(step));
      } else {
        delete element.dataset.animationFrame;
        element.dataset.numericValue = String(targetValue);
      }
    };
    element.dataset.animationFrame = String(requestAnimationFrame(step));
  }

  function createRoiCalculator(root, config) {
    const values = {};
    const lastValid = {};
    const fields = new Map();
    const outputElements = new Map();
    const mobileResult = root.parentElement.querySelector('[data-roi-mobile-result]');
    const copyButton = root.querySelector('[data-roi-copy]');
    const copyStatus = root.querySelector('[data-roi-copy-status]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fieldsHost = root.querySelector('[data-roi-fields]');
    const outputsHost = root.querySelector('[data-roi-outputs]');
    const status = root.querySelector('[data-roi-status]');
    let copyTimer;
    let fallbackField;
    outputsHost.setAttribute('aria-live', 'polite');
    outputsHost.setAttribute('aria-atomic', 'true');

    const parseHash = () => {
      const match = window.location.hash.match(/^#v=(.*)$/);
      if (!match) return null;
      const parts = match[1].split(',');
      if (parts.length !== config.fields.length) return null;
      const parsed = parts.map(Number);
      const valid = parsed.every((value, index) => {
        const field = config.fields[index];
        const max = field.max ?? field.sliderMax ?? 100000;
        return Number.isFinite(value) && value >= field.min && value <= max;
      });
      return valid ? parsed : null;
    };

    const writeHash = () => {
      const state = config.fields.map(field => values[field.id]).join(',');
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#v=${state}`);
    };

    const clearError = controls => {
      controls.number.removeAttribute('aria-invalid');
      controls.error.textContent = '';
    };

    // Sample values notice
    if (fieldsHost) {
      const notice = document.createElement('p');
      notice.className = 'roi-sample-notice';
      notice.innerHTML = '<i class="bi bi-info-circle" aria-hidden="true"></i> Sample values. Replace them with your own.';
      fieldsHost.before(notice);
    }

    // Group fields by group name
    const groupMap = new Map();
    config.fields.forEach(field => {
      const g = field.group || 'Inputs';
      if (!groupMap.has(g)) groupMap.set(g, []);
      groupMap.get(g).push(field);
    });

    groupMap.forEach((groupFields, groupName) => {
      const groupEl = document.createElement('fieldset');
      groupEl.className = 'roi-group';

      const groupLabel = document.createElement('legend');
      groupLabel.className = 'roi-group__label';
      const iconClass = GROUP_ICONS[groupName] || 'bi-sliders';
      groupLabel.innerHTML = `<i class="bi ${iconClass}" aria-hidden="true"></i>${groupName}`;
      groupEl.appendChild(groupLabel);

      groupFields.forEach(field => {
        const initial = parseHash();
        const initialValue = initial ? initial[config.fields.indexOf(field)] : field.default;
        values[field.id] = initialValue;
        lastValid[field.id] = initialValue;

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
        const max = field.max ?? field.sliderMax ?? 100000;
        number.max = String(max);
        number.step = String(field.step);
        number.value = String(initialValue);
        number.setAttribute('aria-describedby', `roi-${field.id}-help roi-${field.id}-error`);

        const unit = document.createElement('span');
        unit.className = 'roi-field__unit';
        unit.textContent = field.unit;

        const range = document.createElement('input');
        range.type = 'range';
        range.id = `roi-${field.id}-slider`;
        range.min = String(field.min);
        range.max = String(max);
        range.step = String(field.step);
        range.value = String(initialValue);
        const rangeLabel = document.createElement('label');
        rangeLabel.className = 'roi-sr-only';
        rangeLabel.htmlFor = range.id;
        rangeLabel.textContent = `${field.label} slider`;
        updateSliderFill(range);

        const help = document.createElement('p');
        help.className = 'roi-field__help';
        help.id = `roi-${field.id}-help`;
        help.textContent = field.help;

        const error = document.createElement('p');
        error.className = 'roi-field__error';
        error.id = `roi-${field.id}-error`;
        error.setAttribute('aria-live', 'polite');

        control.append(number, unit);
        wrapper.append(label, control, rangeLabel, range, help, error);
        groupEl.appendChild(wrapper);
        fields.set(field.id, { number, range, error });

        const commit = raw => {
          const parsed = Number(raw);
          const valid = raw !== '' && !number.validity.badInput && Number.isFinite(parsed)
            && parsed >= field.min && parsed <= max;
          if (!valid) {
            number.setAttribute('aria-invalid', 'true');
            error.textContent = 'Use a value within the allowed range.';
            if (copyButton) copyButton.disabled = true;
            return;
          }
          const value = parsed;
          values[field.id] = value;
          lastValid[field.id] = value;
          range.value = String(value);
          updateSliderFill(range);
          clearError({ number, error });
          const hasInvalidField = Array.from(fields.values()).some(controls => (
            controls.number.value === ''
            || controls.number.validity.badInput
            || !Number.isFinite(Number(controls.number.value))
            || Number(controls.number.value) < Number(controls.number.min)
            || Number(controls.number.value) > Number(controls.number.max)
          ));
          if (!hasInvalidField) {
            update();
            writeHash();
            if (copyButton) copyButton.disabled = false;
          }
        };

        number.addEventListener('input', () => {
          commit(number.value);
        });
        range.addEventListener('input', () => {
          number.value = range.value;
          commit(range.value);
        });
      });

      fieldsHost.appendChild(groupEl);
    });

    // Outputs
    config.outputs.forEach(output => {
      const card = document.createElement('div');
      card.className = `roi-stat${output.isHeadline ? ' roi-stat--headline' : ''}`;
      const value = document.createElement('strong');
      const label = document.createElement('span');
      label.textContent = `${output.label}${output.unit ? ` (${output.unit})` : ''}`;
      card.append(value, label);
      outputsHost.append(card);
      outputElements.set(output.id, value);
    });

    let hasRenderedSamples = false;
    function update() {
      const computed = config.compute({ ...values });
      config.outputs.forEach(output => {
        const element = outputElements.get(output.id);
        countUp(element, computed[output.id], output.format, reducedMotion, hasRenderedSamples);
      });
      if (mobileResult) {
        const hours = mobileResult.querySelector('[data-mobile-hours]');
        const value = mobileResult.querySelector('[data-mobile-value]');
        const hoursOutput = config.outputs.find(output => output.id === 'hours');
        const valueOutput = config.outputs.find(output => output.id === 'value');
        if (hours) hours.textContent = `${formatValue(computed.hours, hoursOutput.format)} ${hoursOutput.unit}`;
        if (value) value.textContent = `${currencyFormat.format(computed.value)}/${valueOutput.unit}`;
      }
      const event = new CustomEvent('roi-update', {
        bubbles: true,
        detail: { values: { ...values }, outputs: computed }
      });
      if (!hasRenderedSamples) {
        queueMicrotask(() => root.dispatchEvent(event));
      } else {
        root.dispatchEvent(event);
      }
      hasRenderedSamples = true;
      if (status) status.textContent = config.disclaimer;
    }

    root.querySelector('[data-roi-reset]')?.addEventListener('click', () => {
      config.fields.forEach(field => {
        values[field.id] = field.default;
        lastValid[field.id] = field.default;
        const controls = fields.get(field.id);
        if (controls) {
          controls.number.value = String(field.default);
          controls.range.value = String(field.default);
          updateSliderFill(controls.range);
          clearError(controls);
        }
      });
      update();
      writeHash();
      if (copyButton) copyButton.disabled = false;
    });

    copyButton?.addEventListener('click', async () => {
      const computed = config.compute({ ...values });
      const summary = [
        ...config.fields.map(field => `${field.label}: ${fields.get(field.id).number.value} ${field.unit}`),
        ...config.outputs.map(output => {
          const result = formatValue(computed[output.id], output.format);
          return `${output.label}${output.unit ? ` (${output.unit})` : ''}: ${result}`;
        }),
        config.disclaimer
      ].join('\n');
      const icon = copyButton.querySelector('i');
      const showCopied = () => {
        fallbackField?.remove();
        fallbackField = null;
        if (icon) icon.className = 'bi bi-check2';
        if (copyStatus) copyStatus.textContent = 'Copied';
        window.clearTimeout(copyTimer);
        copyTimer = window.setTimeout(() => {
          if (icon) icon.className = 'bi bi-clipboard';
          if (copyStatus) copyStatus.textContent = '';
        }, 2000);
      };

      try {
        await navigator.clipboard.writeText(summary);
        showCopied();
      } catch {
        fallbackField?.remove();
        fallbackField = document.createElement('textarea');
        fallbackField.className = 'roi-copy-fallback';
        fallbackField.value = summary;
        fallbackField.readOnly = true;
        fallbackField.setAttribute('aria-label', 'Summary to copy');
        root.appendChild(fallbackField);
        fallbackField.focus();
        fallbackField.select();
        let copied = false;
        try {
          copied = document.execCommand('copy');
        } catch (error) {
          console.error('The calculator summary could not be copied.', error);
        }
        if (copied) {
          showCopied();
        } else if (copyStatus) {
          copyStatus.textContent = 'Summary selected; copy it manually.';
        }
      }
    });

    const restoreHash = () => {
      const restored = parseHash();
      config.fields.forEach((field, index) => {
        const value = restored ? restored[index] : field.default;
        values[field.id] = value;
        lastValid[field.id] = value;
        const controls = fields.get(field.id);
        controls.number.value = String(value);
        controls.range.value = String(value);
        updateSliderFill(controls.range);
        clearError(controls);
      });
      update();
      if (!restored) writeHash();
      if (copyButton) copyButton.disabled = false;
    };
    window.addEventListener('hashchange', restoreHash);

    if (mobileResult && 'IntersectionObserver' in window) {
      const estimate = root.querySelector('.roi-estimate');
      const mobileQuery = window.matchMedia('(max-width: 768px)');
      const observer = new IntersectionObserver(([entry]) => {
        const visible = mobileQuery.matches && !entry.isIntersecting;
        mobileResult.hidden = !visible;
        document.body.classList.toggle('roi-mobile-bar-visible', visible);
      }, { threshold: 0.1 });
      observer.observe(estimate);
      mobileQuery.addEventListener('change', () => {
        if (!mobileQuery.matches) {
          mobileResult.hidden = true;
          document.body.classList.remove('roi-mobile-bar-visible');
        }
      });
    }

    update();
    if (!window.location.hash.startsWith('#v=')) writeHash();
    return { getValues: () => ({ ...values }) };
  }

  namespace.createRoiCalculator = createRoiCalculator;
})();
