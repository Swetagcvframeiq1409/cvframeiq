(() => {
  'use strict';

  const search = document.getElementById('crSearch');
  const rolesList = document.getElementById('crRolesList');
  const noRoles = document.getElementById('crNoRoles');
  const roleField = document.getElementById('cr-role');
  const applySection = document.getElementById('apply');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const updateApplyVisibility = () => {
    if (applySection) {
      const bounds = applySection.getBoundingClientRect();
      document.body.classList.toggle('cr-apply-visible', bounds.top < window.innerHeight - 1 && bounds.bottom > 1);
    }
  };

  if (applySection) {
    window.addEventListener('scroll', updateApplyVisibility, { passive: true });
    window.addEventListener('resize', updateApplyVisibility);
    window.addEventListener('focusin', updateApplyVisibility);
    updateApplyVisibility();
  }

  document.querySelectorAll('.cr-page a[href^="#"]').forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    link.addEventListener('click', event => {
      event.preventDefault();
      if (window.location.hash !== link.getAttribute('href')) {
        window.history.pushState(null, '', link.getAttribute('href'));
      }
      target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if (search && rolesList && noRoles) {
    const roleRows = Array.from(rolesList.querySelectorAll('.cr-role-row'));

    search.addEventListener('input', () => {
      const query = search.value.trim().toLowerCase();
      let visible = 0;

      roleRows.forEach(row => {
        const matches = !query || row.dataset.title.toLowerCase().includes(query);
        row.closest('.cr-role-item').hidden = !matches;
        if (matches) visible++;
      });

      noRoles.hidden = visible > 0;
    });

    roleRows.forEach(row => {
      row.addEventListener('click', () => {
        if (roleField) {
          roleField.value = row.dataset.title;
          roleField.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (applySection) {
          applySection.scrollIntoView({ behavior: 'auto', block: 'start' });
          updateApplyVisibility();
        }
        if (roleField) roleField.focus({ preventScroll: true });
      });
    });
  }

  const form = document.getElementById('crForm');
  const status = document.getElementById('crStatus');
  if (!form || !status) return;

  const fieldConfig = [
    { name: 'name', error: 'cr-name-error', message: value => value.trim() ? '' : 'Enter your name.' },
    { name: 'email', error: 'cr-email-error', message: value => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim()) ? '' : 'Enter a valid email address.' },
    { name: 'role', error: 'cr-role-error', message: value => value.trim() ? '' : 'Enter the role you are applying for.' },
    { name: 'linkedin', error: 'cr-linkedin-error', message: value => {
      if (!value.trim()) return '';
      try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:' ? '' : 'Enter a full URL.';
      } catch {
        return 'Enter a full URL.';
      }
    } },
    { name: 'resume', error: 'cr-resume-error', message: (value, input) => {
      const file = input.files && input.files[0];
      if (!file) return 'Choose a resume file.';
      return /\.(pdf|doc|docx)$/i.test(file.name) ? '' : 'Choose a PDF, DOC or DOCX file.';
    } }
  ];

  const privacy = form.elements.namedItem('privacy');

  function setError(input, errorId, message) {
    const error = document.getElementById(errorId);
    if (error) error.textContent = message;
    input.setAttribute('aria-invalid', String(Boolean(message)));
    return Boolean(message);
  }

  function validate() {
    const invalidFields = [];

    fieldConfig.forEach(config => {
      const input = form.elements.namedItem(config.name);
      const message = config.message(input.value, input);
      if (setError(input, config.error, message)) invalidFields.push(input);
    });

    const consentError = document.getElementById('cr-consent-error');
    const consentInvalid = !privacy.checked;
    if (consentError) consentError.textContent = consentInvalid ? 'Consent is required.' : '';
    privacy.setAttribute('aria-invalid', String(consentInvalid));
    if (consentInvalid) invalidFields.push(privacy);

    return invalidFields;
  }

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      status.textContent = '';
      if (input.getAttribute('aria-invalid') !== 'true') return;
      if (input.name === 'privacy') {
        const error = document.getElementById('cr-consent-error');
        if (error && input.checked) error.textContent = '';
        input.setAttribute('aria-invalid', String(!input.checked));
        return;
      }
      const config = fieldConfig.find(item => item.name === input.name);
      if (!config) return;
      setError(input, config.error, config.message(input.value, input));
    });
    input.addEventListener('change', () => {
      if (input.type !== 'file' || input.getAttribute('aria-invalid') !== 'true') return;
      const config = fieldConfig.find(item => item.name === input.name);
      if (config) setError(input, config.error, config.message(input.value, input));
    });
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    status.textContent = '';
    const invalidFields = validate();

    if (invalidFields.length) {
      status.textContent = 'Please correct the highlighted fields.';
      invalidFields[0].focus({ preventScroll: true });
      invalidFields[0].scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth', block: 'start' });
      return;
    }

    const data = new FormData(form);
    const resume = form.elements.namedItem('resume').files[0];
    const body = [
      `Name: ${data.get('name')}`,
      `Email: ${data.get('email')}`,
      `Phone: ${data.get('phone') || ''}`,
      `Role: ${data.get('role')}`,
      `LinkedIn: ${data.get('linkedin') || ''}`,
      `Resume filename: ${resume.name}`,
      '',
      `Message: ${data.get('message') || ''}`,
      '',
      'Please attach the resume file before sending.'
    ].join('\n');
    const subject = `Careers enquiry - ${data.get('role')}`;
    const mailto = `mailto:official@cvframeiq.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    status.textContent = 'Your email draft is ready. Attach your resume and send.';
    window.location.href = mailto;
  });
})();
