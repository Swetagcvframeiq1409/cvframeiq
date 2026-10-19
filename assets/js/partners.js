(() => {
  'use strict';

  const form = document.querySelector('[data-partner-form]');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const message = [
      'Partner enquiry (prepared in browser; not yet sent)',
      `Organization: ${values.organization}`,
      `Contact: ${values.name}`,
      `Email: ${values.email}`,
      `Region: ${values.region}`,
      `Interest: ${values.interest}`
    ].join('\n');
    const status = form.querySelector('.partner-status');
    status.replaceChildren();
    const link = document.createElement('a');
    link.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent('Partner enquiry')}&body=${encodeURIComponent(message)}`;
    link.textContent = `Open email draft to ${window.SITE_CONTACT.email}`;
    const copyStatus = document.createElement('span');
    copyStatus.setAttribute('role', 'status');
    copyStatus.setAttribute('aria-live', 'polite');
    status.append('Nothing has been submitted. ', link, copyStatus);
    window.FrameIQForms?.appendCopyButton(status, () => message, copyStatus);
  });
})();
