(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#getstarted-form');
    const name = document.querySelector('#signup-name');
    const email = document.querySelector('#signup-email');
    const project = document.querySelector('#signup-project');
    const status = document.querySelector('[data-getstarted-status]');
    const submitButton = form?.querySelector('[type="submit"]');
    const honeypot = form?.querySelector('[name="_gotcha"]');
    const logo = document.querySelector('[data-frameiq-logo]');

    if (logo && typeof window.FrameIQLogo === 'function') {
      logo.innerHTML = window.FrameIQLogo();
    }
    if (!form || !name || !email || !project || !status || !submitButton || !honeypot) return;

    const clearStatus = () => {
      status.replaceChildren();
      status.className = 'login-status';
    };

    const showFieldError = (field, message) => {
      const error = document.getElementById(field.getAttribute('aria-describedby'));
      if (error) error.textContent = message;
      field.setAttribute('aria-invalid', 'true');
      field.focus();
    };

    const clearFieldError = (field) => {
      const error = document.getElementById(field.getAttribute('aria-describedby'));
      if (error) error.textContent = '';
      field.removeAttribute('aria-invalid');
    };

    const getMessage = () => [
      `Name: ${name.value.trim()}`,
      `Email: ${email.value.trim()}`,
      `Message: ${project.value.trim()}`
    ].join('\n');

    const showFallback = (message) => {
      status.className = 'login-status is-info';
      const text = document.createElement('span');
      text.textContent = message;
      const link = document.createElement('a');
      link.className = 'login-email-fallback';
      link.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent('FrameIQ enquiry')}&body=${encodeURIComponent(getMessage())}`;
      link.textContent = 'Email FrameIQ';
      const copyStatus = document.createElement('span');
      copyStatus.className = 'login-copy-status';
      copyStatus.setAttribute('role', 'status');
      copyStatus.setAttribute('aria-live', 'polite');
      status.replaceChildren(text, document.createTextNode(' '), link, copyStatus);
      window.FrameIQForms?.appendCopyButton(status, getMessage, copyStatus);
    };

    [name, email, project].forEach((field) => {
      field.addEventListener('input', () => {
        clearFieldError(field);
        clearStatus();
      });
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearStatus();
      clearFieldError(name);
      clearFieldError(email);

      if (honeypot.value.trim()) {
        status.className = 'login-status is-error';
        status.textContent = 'The request could not be submitted. Please try again.';
        return;
      }
      if (!name.value.trim()) {
        showFieldError(name, 'Enter your full name.');
        return;
      }
      if (!email.value.trim() || !email.validity.valid) {
        showFieldError(email, 'Enter a valid work email address.');
        return;
      }

      if (!window.FORM_ENDPOINT) {
        showFallback('The enquiry form is not connected yet. Continue by email to send your message.');
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent = 'Sending…';
      submitButton.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(window.FORM_ENDPOINT, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);

        status.className = 'login-status is-info';
        status.textContent = 'Your enquiry was sent successfully.';
        form.reset();
      } catch (error) {
        console.error('Enquiry could not be submitted.', error);
        showFallback('We could not send your request. Continue by email to send it instead.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Send an Enquiry';
        submitButton.removeAttribute('aria-busy');
      }
    });
  });
})();
