(() => {
  'use strict';
  const root = document.querySelector('[data-hardware-demo]');
  if (!root) return;
  const panels = [...root.querySelectorAll('[data-step-panel]')];
  const stepButtons = [...root.querySelectorAll('[data-step-button]')];
  const choices = [...root.querySelectorAll('[data-focus]')];
  const slots = [...root.querySelectorAll('[data-slot]')];
  const form = root.querySelector('[data-demo-form]');
  const state = { step: 0, focus: '', slot: '' };
  const errors = new Map();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  root.querySelector('[data-date]').min = tomorrow.toISOString().slice(0, 10);
  const setError = (field, message) => {
    const wrapper = field.closest('.hw-demo__field');
    wrapper.classList.toggle('is-invalid', Boolean(message));
    wrapper.querySelector('.hw-demo__error').innerHTML = message ? `<i class="bi bi-exclamation-circle" aria-hidden="true"></i>${message}` : '';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) errors.set(field, message); else errors.delete(field);
  };
  const validateField = (field) => {
    if (field.type === 'checkbox' && field.required && !field.checked) return 'Consent is required.';
    if (field.required && !field.value.trim()) return 'This field is required.';
    if (field.type === 'email' && field.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value)) return 'Enter a valid email address.';
    return '';
  };
  const showStep = (index) => {
    state.step = index;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    stepButtons.forEach((button, i) => { button.setAttribute('aria-current', i === index ? 'step' : 'false'); });
    root.querySelector('[data-progress]').style.width = `${((index + 1) / 3) * 100}%`;
    root.querySelector('[data-step-live]').textContent = `Step ${index + 1} of 3`;
  };
  const validateStep = () => {
    errors.clear();
    if (state.step === 0 && !state.focus) { root.querySelector('[data-focus-error]').textContent = 'Choose a demo focus.'; choices[0].focus(); return false; }
    if (state.step === 1) {
      const required = [...form.querySelectorAll('[data-details] [required]')];
      required.forEach((field) => setError(field, validateField(field)));
      if (errors.size) { errors.keys().next().value.focus(); return false; }
    }
    if (state.step === 2) {
      const date = root.querySelector('[data-date]');
      const dateValue = new Date(`${date.value}T00:00:00`);
      setError(date, !date.value ? 'Choose a date.' : dateValue.getDay() === 0 ? 'We are available Monday to Saturday' : '');
      if (!state.slot) { root.querySelector('[data-slot-error]').textContent = 'Choose a time slot.'; if (!errors.size) slots[0].focus(); }
      if (errors.size || !state.slot) return false;
    }
    return true;
  };
  choices.forEach((choice) => choice.addEventListener('click', () => {
    state.focus = choice.dataset.focus;
    choices.forEach((item) => {
      item.setAttribute('aria-checked', String(item === choice));
      item.setAttribute('aria-pressed', String(item === choice));
      item.tabIndex = item === choice ? 0 : -1;
    });
    root.querySelector('[data-focus-error]').textContent = '';
    root.querySelector('[data-summary-focus]').textContent = state.focus;
  }));
  // Arrow key navigation for radiogroup
  const choiceGroup = root.querySelector('[role="radiogroup"]');
  if (choiceGroup) {
    choiceGroup.addEventListener('keydown', (event) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(event.key)) return;
      event.preventDefault();
      const idx = choices.indexOf(document.activeElement);
      if (idx < 0) return;
      const next = event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? (idx + 1) % choices.length
        : (idx - 1 + choices.length) % choices.length;
      choices[next].click();
      choices[next].focus();
    });
  }
  slots.forEach((slot) => slot.addEventListener('click', () => { state.slot = slot.dataset.slot; slots.forEach((item) => item.setAttribute('aria-pressed', String(item === slot))); root.querySelector('[data-slot-error]').textContent = ''; root.querySelector('[data-summary-slot]').textContent = state.slot; }));
  root.querySelector('[data-date]').addEventListener('change', (event) => { root.querySelector('[data-summary-date]').textContent = event.target.value || 'Not selected'; });
  stepButtons.forEach((button, index) => button.addEventListener('click', () => { if (index <= state.step || validateStep()) showStep(index); }));
  root.querySelectorAll('[data-continue]').forEach((button) => button.addEventListener('click', () => { if (validateStep()) showStep(state.step + 1); }));
  root.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showStep(state.step - 1)));
  form.querySelectorAll('input,select,textarea').forEach((field) => field.addEventListener('blur', () => setError(field, validateField(field))));
  const prefill = new URLSearchParams(location.search).get('topic');
  if (prefill) choices.find((choice) => choice.dataset.topic === prefill || choice.dataset.focus.toLowerCase().replace(/\s+/g, '-') === prefill)?.click();
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!validateStep()) return;
    const data = new FormData(form);
    data.set('Demo focus', state.focus);
    data.set('Date', root.querySelector('[data-date]').value);
    data.set('Time slot', state.slot);
    const body = encodeURIComponent([...data.entries()].map(([key, value]) => `${key}: ${value}`).join('\n'));
    const mailto = `mailto:official@cvframeiq.com?subject=${encodeURIComponent('Hardware demo request')}&body=${body}`;
    root.querySelector('[data-success-summary]').textContent = `Focus: ${state.focus} | Date: ${data.get('Date')} | Time: ${state.slot}`;
    root.querySelector('[data-success] > p:nth-of-type(2)').textContent = 'Your email draft is ready. Review it and send it to complete your request.';
    root.querySelector('[data-wizard]').hidden = true; root.querySelector('[data-success]').hidden = false; root.querySelector('[data-success]').dataset.mailto = mailto; window.location.href = mailto;
  });
  showStep(0);
})();
