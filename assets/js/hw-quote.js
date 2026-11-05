(() => {
  'use strict';
  const root = document.querySelector('[data-hardware-quote]');
  if (!root) return;
  const form = root.querySelector('[data-quote-form]');
  const fields = [...form.querySelectorAll('input, select, textarea')];
  const chips = [...root.querySelectorAll('[data-interest]')];
  const prefill = root.querySelector('[data-prefill]');
  const params = new URLSearchParams(location.search);
  const products = window.HARDWARE_PRODUCTS || [];
  let quoteProduct = params.get('product');
  const kitLabels = { 'edge-starter-kit': 'Edge Starter Kit', 'smart-factory-kit': 'Smart Factory Kit' };
  const errors = new Map();
  const showError = (field, message) => {
    const wrapper = field.closest('.hw-quote__field');
    const error = wrapper.querySelector('.hw-quote__error');
    wrapper.classList.toggle('is-invalid', Boolean(message));
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    error.innerHTML = message ? `<i class="bi bi-exclamation-circle" aria-hidden="true"></i>${message}` : '';
    if (message) errors.set(field, message); else errors.delete(field);
  };
  const validate = (field) => {
    if (field.type === 'checkbox' && field.required && !field.checked) return 'Consent is required.';
    if (field.required && !field.value.trim()) return 'This field is required.';
    if (field.type === 'email' && field.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value)) return 'Enter a valid email address.';
    return '';
  };
  fields.forEach((field) => field.addEventListener('blur', () => showError(field, validate(field))));
  const setPrefill = () => {
    if (!quoteProduct) { prefill.hidden = true; return; }
    const product = products.find((item) => item.id === quoteProduct);
    const label = product?.name || kitLabels[quoteProduct];
    if (!label) { prefill.hidden = true; return; }
    prefill.hidden = false;
    prefill.querySelector('[data-prefill-name]').textContent = `Quote for: ${label}`;
    const category = product?.category;
    if (category) chips.find((chip) => chip.dataset.interest === category)?.setAttribute('aria-pressed', 'true');
    if (quoteProduct === 'edge-starter-kit' || quoteProduct === 'smart-factory-kit') chips.find((chip) => chip.dataset.interest === (quoteProduct === 'edge-starter-kit' ? 'Edge Starter Kit' : 'Smart Factory Kit'))?.setAttribute('aria-pressed', 'true');
  };
  chips.forEach((chip) => chip.addEventListener('click', () => chip.setAttribute('aria-pressed', String(chip.getAttribute('aria-pressed') !== 'true'))));
  prefill.querySelector('[data-prefill-remove]').addEventListener('click', () => { quoteProduct = ''; prefill.hidden = true; });
  setPrefill();
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    fields.forEach((field) => showError(field, validate(field)));
    if (errors.size) { errors.keys().next().value.focus(); return; }
    const selected = chips.filter((chip) => chip.getAttribute('aria-pressed') === 'true').map((chip) => chip.dataset.interest).join(', ');
    const data = new FormData(form);
    data.set('Hardware of interest', selected || 'Not specified');
    if (quoteProduct) data.set('Quote product', quoteProduct);
    const body = encodeURIComponent([...data.entries()].map(([key, value]) => `${key}: ${value}`).join('\n'));
    const subject = encodeURIComponent(`Hardware quote request${quoteProduct ? `: ${quoteProduct}` : ''}`);
    const mailto = `mailto:official@cvframeiq.com?subject=${subject}&body=${body}`;
    const success = root.querySelector('[data-quote-success]');
    success.querySelector('p').textContent = 'Your email draft is ready. Review it and send it to complete your request.';
    success.dataset.mailto = mailto;
    success.hidden = false;
    window.location.href = mailto;
  });
  root.querySelector('[data-another]').addEventListener('click', () => { form.reset(); chips.forEach((chip) => chip.setAttribute('aria-pressed', 'false')); errors.clear(); fields.forEach((field) => showError(field, '')); root.querySelector('[data-quote-success]').hidden = true; root.querySelector('[data-quote-form-wrap]').hidden = false; });
})();
