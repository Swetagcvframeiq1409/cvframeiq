
(() => {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const form =
      document.querySelector('[data-partner-form]') ||
      document.getElementById('partner-form');

    if (!form) return;

    const status =
      form.querySelector('.partner-status') ||
      document.getElementById('partner-form-status');

    const preview = document.getElementById('partner-preview');
    const previewDetails = document.getElementById('partner-preview-details');
    const editButton = document.getElementById('partner-edit');

    const partnerType =
      form.querySelector('[name="interest"]') ||
      form.querySelector('[name="partnerType"]');

    // -----------------------------------------
    // 1. AUTO-SELECT PARTNERSHIP TYPE
    // -----------------------------------------

    document.querySelectorAll('[data-partner-choice]').forEach((item) => {
      item.addEventListener('click', () => {
        const choice = item.getAttribute('data-partner-choice');

        if (partnerType && choice) {
          partnerType.value = choice;
        }
      });
    });

    // -----------------------------------------
    // 2. CREATE ENQUIRY MESSAGE
    // -----------------------------------------

    function getEnquiryMessage(values) {
      return [
        'Partner enquiry (prepared in browser; not yet sent)',
        '',
        `Organization: ${values.organization || ''}`,
        `Contact: ${values.name || ''}`,
        `Email: ${values.email || ''}`,
        `Region: ${values.region || ''}`,
        `Interest: ${values.interest || ''}`,
        `Message: ${values.message || ''}`
      ].join('\n');
    }

    // -----------------------------------------
    // 3. SHOW ENQUIRY PREVIEW
    // -----------------------------------------

    function showPreview(values) {
      if (!preview || !previewDetails) return;

      previewDetails.replaceChildren();

      const details = [
        ['Organization', values.organization],
        ['Contact name', values.name],
        ['Work email', values.email],
        ['Region / territory', values.region],
        ['Partnership interest', values.interest],
        ['Message', values.message]
      ];

      details.forEach(([label, value]) => {
        const term = document.createElement('dt');
        const description = document.createElement('dd');

        term.textContent = label;
        description.textContent = value || '—';

        previewDetails.append(term, description);
      });

      preview.hidden = false;
      preview.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }

    // -----------------------------------------
    // 4. HANDLE FORM SUBMISSION
    // -----------------------------------------

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.reportValidity()) return;

      const rawValues = Object.fromEntries(
        new FormData(form).entries()
      );

      const values = {
        organization: rawValues.organization,
        name: rawValues.name,
        email: rawValues.email,
        region: rawValues.region,
        interest: rawValues.interest || rawValues.partnerType,
        message: rawValues.message
      };

      const message = getEnquiryMessage(values);

      // Show enquiry preview
      showPreview(values);

      if (!status) return;

      status.replaceChildren();

      const email = window.SITE_CONTACT?.email;

      if (email) {
        const link = document.createElement('a');

        link.href =
          `mailto:${email}?subject=${encodeURIComponent('Partner enquiry')}` +
          `&body=${encodeURIComponent(message)}`;

        link.textContent = `Open email draft to ${email}`;

        status.append(
          'Nothing has been submitted. ',
          link
        );
      } else {
        status.textContent =
          'Nothing has been submitted. The contact email is not configured.';
      }

      const copyStatus = document.createElement('span');

      copyStatus.setAttribute('role', 'status');
      copyStatus.setAttribute('aria-live', 'polite');

      status.append(copyStatus);

      // Retain existing FrameIQ copy functionality
      window.FrameIQForms?.appendCopyButton(
        status,
        () => message,
        copyStatus
      );

      status.hidden = false;
    });

    // -----------------------------------------
    // 5. EDIT ENQUIRY DETAILS
    // -----------------------------------------

    if (editButton && preview) {
      editButton.addEventListener('click', () => {
        preview.hidden = true;

        const organizationInput = form.querySelector(
          '[name="organization"]'
        );

        organizationInput?.focus();
      });
    }
  });
})();
