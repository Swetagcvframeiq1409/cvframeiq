(() => {
  'use strict';
  const root = document.querySelector('[data-hardware-demo]');
  if (!root) return;
  const panels = [...root.querySelectorAll('[data-step-panel]')];
  const stepItems = [...root.querySelectorAll('[data-step-item]')];
  const choices = [...root.querySelectorAll('input[name="demo-focus"]')];
  const slots = [...root.querySelectorAll('[data-slot]')];
  const form = root.querySelector('[data-demo-form]');
  const state = { step: 0, focus: '', slot: '' };
  const errors = new Map();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateInput = root.querySelector('[data-date]');
  if (dateInput) dateInput.min = tomorrow.toISOString().slice(0, 10);

  const setError = (field, message) => {
    const wrapper = field.closest('.hw-demo__field');
    if (!wrapper) return;
    wrapper.classList.toggle('is-invalid', Boolean(message));
    const el = wrapper.querySelector('.hw-demo__error');
    if (el) el.innerHTML = message ? `<i class="bi bi-exclamation-circle" aria-hidden="true"></i>${message}` : '';
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) errors.set(field, message); else errors.delete(field);
  };
  const validateField = (field) => {
    if (field.type === 'checkbox' && field.required && !field.checked) return 'Consent is required.';
    if (field.required && !field.value.trim()) return 'This field is required.';
    if (field.type === 'email' && field.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value)) return 'Enter a valid email address.';
    return '';
  };

  const updateStepper = (index) => {
    stepItems.forEach((item, i) => {
      item.classList.toggle('is-done', i < index);
      item.setAttribute('aria-current', i === index ? 'step' : 'false');
    });
    const live = root.querySelector('[data-step-live]');
    const labels = ['Choose a demo focus','Your details','Pick a time'];
    if (live) live.textContent = `Step ${index + 1} of 3: ${labels[index]}`;
  };

  const showStep = (index) => {
    state.step = index;
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    if (index < panels.length) {
      panels[index].removeAttribute('hidden');
      panels[index].focus();
      panels[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    updateStepper(index);
    // carry focus chip
    root.querySelectorAll('[data-summary-focus]').forEach((el) => { el.textContent = state.focus || 'Not selected'; });
  };

  const validateStep = () => {
    errors.clear();
    if (state.step === 0 && !state.focus) {
      const e = root.querySelector('[data-focus-error]');
      if (e) e.textContent = 'Choose a demo focus.';
      return false;
    }
    if (state.step === 1) {
      const required = [...form.querySelectorAll('[data-details] [required]')];
      required.forEach((field) => setError(field, validateField(field)));
      if (errors.size) { errors.keys().next().value.focus(); return false; }
    }
    if (state.step === 2) {
      const date = root.querySelector('[data-date]');
      setError(date, !date.value ? 'Choose a date.' : (new Date(`${date.value}T00:00:00`).getDay() === 0 ? 'We are available Monday to Saturday.' : ''));
      const slotErr = root.querySelector('[data-slot-error]');
      if (!state.slot) { if (slotErr) slotErr.textContent = 'Choose a time slot.'; if (!errors.size) slots[0]?.focus(); }
      else if (slotErr) slotErr.textContent = '';
      if (errors.size || !state.slot) return false;
    }
    return true;
  };

  // Continue button state for step 1
  const continueBtn = panels[0].querySelector('[data-continue]');
  const statusEl = panels[0].querySelector('[data-status]');
  const setContinueEnabled = (enabled) => {
    if (!continueBtn) return;
    continueBtn.disabled = !enabled;
    continueBtn.setAttribute('aria-disabled', String(!enabled));
    if (statusEl) statusEl.textContent = enabled ? `Selected: ${state.focus}` : 'Select an option to continue';
  };
  setContinueEnabled(false);

  choices.forEach((input) => {
    input.addEventListener('change', () => {
      if (!input.checked) return;
      state.focus = input.dataset.focus;
      root.querySelectorAll('[data-summary-focus]').forEach((el) => { el.textContent = state.focus; });
      root.querySelectorAll('[data-focus-name]').forEach((el) => { el.textContent = state.focus; });
      root.querySelectorAll('[data-focus-chip], [data-focus-chip2]').forEach((el) => { el.hidden = false; });
      const err = root.querySelector('[data-focus-error]');
      if (err) err.textContent = '';
      setContinueEnabled(true);
    });
  });

  // Enter on card advances
  root.querySelectorAll('.hw-demo__choice').forEach((label) => {
    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { const inp = label.querySelector('input'); if (inp) { inp.checked = true; inp.dispatchEvent(new Event('change')); } const btn = panels[0].querySelector('[data-continue]'); if (btn && !btn.disabled) btn.click(); }
    });
  });

  slots.forEach((slot) => slot.addEventListener('click', () => {
    state.slot = slot.dataset.slot;
    slots.forEach((item) => item.setAttribute('aria-pressed', String(item === slot)));
    const e = root.querySelector('[data-slot-error]'); if (e) e.textContent = '';
    root.querySelectorAll('[data-summary-slot]').forEach((el) => { el.textContent = state.slot; });
  }));

  dateInput?.addEventListener('change', (event) => {
    root.querySelectorAll('[data-summary-date]').forEach((el) => { el.textContent = event.target.value || 'Not selected'; });
  });

  stepItems.forEach((item, index) => item.addEventListener('click', () => {
    if (index <= state.step || validateStep()) showStep(index);
  }));
  root.querySelectorAll('[data-continue]').forEach((button) => button.addEventListener('click', () => { if (validateStep()) showStep(state.step + 1); }));
  root.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', () => showStep(state.step - 1)));
  root.querySelectorAll('[data-change-focus]').forEach((button) => button.addEventListener('click', () => showStep(0)));

  form?.querySelectorAll('input,select,textarea').forEach((field) => field.addEventListener('blur', () => setError(field, validateField(field))));

  // URL preselect
  const prefill = new URLSearchParams(location.search).get('focus') || new URLSearchParams(location.search).get('topic');
  if (prefill) {
    const target = choices.find((c) => c.dataset.topic === prefill || c.dataset.focus.toLowerCase().replace(/\s+/g,'-') === prefill);
    if (target) { target.checked = true; target.dispatchEvent(new Event('change')); }
  }

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (state.step !== 2) { showStep(2); return; }
    if (!validateStep()) return;
    const data = new FormData(form);
    data.set('Demo focus', state.focus);
    data.set('Date', root.querySelector('[data-date]').value);
    data.set('Time slot', state.slot);
    const body = encodeURIComponent([...data.entries()].map(([key, value]) => `${key}: ${value}`).join('\n'));
    const mailto = `mailto:official@cvframeiq.com?subject=${encodeURIComponent('Hardware demo request')}&body=${body}`;
    const succ = root.querySelector('[data-success-summary]');
    if (succ) succ.textContent = `Focus: ${state.focus} | Date: ${data.get('Date')} | Time: ${state.slot}`;
    root.querySelector('[data-wizard]').hidden = true;
    root.querySelector('[data-success]').hidden = false;
    root.querySelector('[data-success]').dataset.mailto = mailto;
    window.location.href = mailto;
  });

  showStep(0);
  updateStepper(0);
})();
