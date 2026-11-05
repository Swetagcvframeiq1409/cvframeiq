(() => {
  'use strict';

  const form = document.getElementById('jnForm');
  const status = document.getElementById('jnStatus');
  if (!form || !status) return;

  const fields = [...form.querySelectorAll('input, textarea')];
  const showError = (field, message) => {
    const error = document.getElementById(`jn-${field.name}-error`);
    field.classList.toggle('is-bad', Boolean(message));
    field.setAttribute('aria-invalid', String(Boolean(message)));
    if (error) error.textContent = message;
  };
  const validate = (field) => {
    if (field.type === 'checkbox' && field.required && !field.checked) return 'Consent is required.';
    if (field.required && field.type === 'file' && !field.files.length) return 'Choose a resume file.';
    if (field.required && field.type !== 'file' && field.type !== 'checkbox' && !field.value.trim()) return 'This field is required.';
    if (field.type === 'email' && field.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(field.value)) return 'Enter a valid email address.';
    if (field.type === 'url' && field.value && !/^https?:\/\/\S+$/i.test(field.value)) return 'Enter a complete LinkedIn URL.';
    if (field.type === 'file' && field.files.length && !/\.(pdf|doc|docx)$/i.test(field.files[0].name)) return 'Upload a PDF, DOC, or DOCX file.';
    return '';
  };

  fields.forEach((field) => field.addEventListener('blur', () => showError(field, validate(field))));
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = fields.filter((field) => {
      const message = validate(field);
      showError(field, message);
      return Boolean(message);
    });
    status.classList.toggle('is-bad', invalid.length > 0);
    if (invalid.length) {
      status.textContent = 'Please correct the highlighted fields before continuing.';
      invalid[0].focus();
      return;
    }

    const values = new FormData(form);
    const resume = form.querySelector('[name="resume"]').files[0];
    const body = [
      `Name: ${values.get('name')}`,
      `Email: ${values.get('email')}`,
      `Phone: ${values.get('phone') || ''}`,
      `Role applied for: ${values.get('role')}`,
      `LinkedIn: ${values.get('linkedin') || ''}`,
      `Resume filename: ${resume.name}`,
      '',
      `Message: ${values.get('message') || ''}`,
      '',
      'Please attach the resume file before sending.'
    ].join('\n');
    status.classList.remove('is-bad');
    status.textContent = 'Your email draft is ready. Attach your resume file and send the email to complete your application.';
    window.location.href = `mailto:official@cvframeiq.com?subject=${encodeURIComponent('Careers enquiry')}&body=${encodeURIComponent(body)}`;
  });
})();
