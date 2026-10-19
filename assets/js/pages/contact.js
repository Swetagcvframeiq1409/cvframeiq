(() => {
  'use strict';

  const WHATSAPP_URL = '';
  const CALENDAR_URL = '';

  const COMPANY_FACTS = {
    entity: 'FrameIQ AI',
    registrationLabel: window.SITE_CONTACT.registration.label,
    registrationValue: window.SITE_CONTACT.registration.value,
    incorporated: 'June 2025',
    location: window.SITE_CONTACT.location,
    hours: window.SITE_CONTACT.hours,
    phone: window.SITE_CONTACT.phone,
  };

  const SECTORS = Object.fromEntries((Array.isArray(window.SECTORS) ? window.SECTORS : []).map((sector) => [
    sector.slug,
    {
      label: sector.name,
      placeholder: `Tell us what you would like to discuss for ${sector.name}.`,
      hint: `Share the environment, visual inputs and use case you would like to discuss for ${sector.name}.`
    }
  ]));
  Object.assign(SECTORS, {
    agents: {
      label: 'AI Vision Agents',
      placeholder: 'Tell us about the workflow you want to automate and the systems involved.',
      hint: 'Include the workflow, visual inputs, and the actions an agent should take.'
    },
    general: {
      label: 'General Inquiry',
      placeholder: 'Tell us what you would like to discuss, ask, or explore with FrameIQ.',
      hint: 'Share enough context for us to route your enquiry to the right person.'
    }
  });

  const BUDGETS = [
    'Under ₹5,00,000',
    '₹5,00,000 to ₹25,00,000',
    '₹25,00,000 to ₹1,00,00,000',
    'Above ₹1,00,00,000',
    'Not decided'
  ];

  const STORAGE_KEY = 'frameiq-contact-draft';
  const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

  let currentStep = 1;
  let sectorTimer = 0;
  let toastTimer = 0;

  const form = document.querySelector('#contact-form');
  if (!form) return;

  const stepPanels = Array.from(form.querySelectorAll('.ct-step-panel'));
  const stepIndicators = Array.from(document.querySelectorAll('[data-step-indicator]'));
  const stepLiveRegion = document.querySelector('#step-live-region');
  const stepHeading = document.querySelector('#contact-form-heading');
  const formMessage = document.querySelector('#form-message');
  const projectDetails = document.querySelector('#project-details');
  const projectHint = document.querySelector('#project-hint');
  const characterCount = document.querySelector('.ct-character-count');
  const toast = document.querySelector('.ct-toast');

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function safeStorageRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      return;
    }
  }

  function getSectorInput(value) {
    return form.querySelector(`input[name="sector"][value="${value}"]`);
  }

  function addSectorChoices() {
    const grid = form.querySelector('.ct-sector-grid');
    if (!grid || !Array.isArray(window.SECTORS)) return;
    window.SECTORS.forEach((sector) => {
      if (getSectorInput(sector.slug)) return;
      const label = document.createElement('label');
      label.className = `ct-sector-option ct-sector-option--${sector.slug}`;
      label.htmlFor = `sector-${sector.slug}`;
      const radio = document.createElement('input');
      radio.id = `sector-${sector.slug}`;
      radio.type = 'radio';
      radio.name = 'sector';
      radio.value = sector.slug;
      const tile = document.createElement('span');
      tile.className = 'ct-sector-option__tile';
      tile.setAttribute('aria-hidden', 'true');
      const sectorIcon = document.createElement('i');
      sectorIcon.className = window.iconClass(sector.icon);
      sectorIcon.setAttribute('aria-hidden', 'true');
      tile.appendChild(sectorIcon);
      const content = document.createElement('span');
      content.className = 'ct-sector-option__content';
      const title = document.createElement('span');
      title.className = 'ct-sector-option__title';
      title.textContent = sector.name;
      const description = document.createElement('span');
      description.className = 'ct-sector-option__desc';
      description.textContent = 'Discuss computer vision use cases for this sector';
      content.append(title, description);
      const chevron = document.createElement('span');
      chevron.className = 'ct-sector-option__chevron';
      chevron.setAttribute('aria-hidden', 'true');
      chevron.textContent = '›';
      label.append(radio, tile, content, chevron);
      grid.insertBefore(label, grid.querySelector('.ct-sector-option--agents'));
    });
  }

  function getSelectedSector() {
    return form.querySelector('input[name="sector"]:checked')?.value || '';
  }

  function goToStep(stepNumber, options = {}) {
    const nextStep = Number(stepNumber);
    if (!Number.isInteger(nextStep) || nextStep < 1 || nextStep > 3) return;
    if (nextStep > 1 && !getSelectedSector()) return;

    const changed = nextStep !== currentStep;
    currentStep = nextStep;

    stepPanels.forEach((panel) => {
      const isCurrent = Number(panel.dataset.step) === currentStep;
      panel.classList.toggle('is-active', isCurrent);
      panel.hidden = !isCurrent;
      panel.setAttribute('aria-hidden', String(!isCurrent));
    });

    stepIndicators.forEach((indicator) => {
      const number = Number(indicator.dataset.stepIndicator);
      const isCurrent = number === currentStep;
      const isComplete = number < currentStep;
      indicator.classList.toggle('is-current', isCurrent);
      indicator.classList.toggle('is-complete', isComplete);
      if (isCurrent) indicator.setAttribute('aria-current', 'step');
      else indicator.removeAttribute('aria-current');

      const badge = indicator.querySelector('.ct-step__badge');
      if (badge) {
        if (isComplete) {
          badge.innerHTML = `<i class="${window.iconClass('check')}" aria-hidden="true"></i>`;
        } else {
          badge.textContent = String(number);
        }
      }
    });

    const track = document.querySelector('.ct-stepper__track');
    if (track) {
      track.style.setProperty('--ct-step-progress', `${((currentStep - 1) / 2) * 100}%`);
    }
    if (stepLiveRegion) stepLiveRegion.textContent = `Step ${currentStep} of 3`;
    if (formMessage) formMessage.textContent = '';

    if (changed && options.focus !== false) {
      stepHeading?.focus({ preventScroll: true });
      stepHeading?.scrollIntoView({ behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth', block: 'nearest' });
    }
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  async function copyText(value) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        throw new Error('Clipboard API unavailable');
      }
      showToast('Copied');
    } catch (error) {
      const temporaryInput = document.createElement('textarea');
      temporaryInput.value = value;
      temporaryInput.setAttribute('readonly', '');
      temporaryInput.style.position = 'fixed';
      temporaryInput.style.opacity = '0';
      document.body.appendChild(temporaryInput);
      temporaryInput.select();
      let copied = false;
      try {
        copied = document.execCommand('copy');
      } catch (fallbackError) {
        copied = false;
      } finally {
        temporaryInput.remove();
      }
      showToast(copied ? 'Copied' : 'Unable to copy');
    }
  }

  function updateSectorPrompt() {
    const sector = SECTORS[getSelectedSector()];
    if (!sector || !projectDetails) return;
    projectDetails.placeholder = sector.placeholder;
    if (projectHint) projectHint.textContent = sector.hint;
  }

  function showFieldError(control, message) {
    const field = control.closest('.ct-field, .ct-checkbox');
    const error = field?.querySelector('.ct-error');
    if (!error) return;
    if (!error.id) error.id = `${control.id || control.name}-error`;
    error.textContent = message;
    control.setAttribute('aria-invalid', 'true');
    const describedBy = new Set((control.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
    describedBy.add(error.id);
    control.setAttribute('aria-describedby', Array.from(describedBy).join(' '));
  }

  function clearFieldError(control) {
    const field = control.closest('.ct-field, .ct-checkbox');
    const error = field?.querySelector('.ct-error');
    if (error) error.textContent = '';
    control.removeAttribute('aria-invalid');
  }

  function getValidationMessage(control) {
    if (control.validity.valueMissing) {
      return control.type === 'checkbox' ? 'Please agree before sending your enquiry.' : 'This field is required.';
    }
    if (control.validity.tooShort) return `Please enter at least ${control.minLength} characters.`;
    if (control.validity.typeMismatch) return 'Enter a valid email address.';
    if (control.validity.patternMismatch || control.validity.customError) return 'Enter a valid Indian phone number using +91 or 10 digits.';
    return 'Please check this field.';
  }

  function validatePhone() {
    const phone = form.querySelector('#phone');
    if (!phone) return true;
    const raw = phone.value.trim();
    if (!raw) {
      phone.setCustomValidity('');
      return true;
    }
    const normalized = raw.replace(/[\s()-]/g, '').replace(/^\+91/, '');
    const isValid = /^\d{10}$/.test(normalized);
    phone.setCustomValidity(isValid ? '' : 'Enter a valid Indian phone number using +91 or 10 digits.');
    return isValid;
  }

  function validatePanel(stepNumber, { focus = true } = {}) {
    const panel = stepPanels.find((candidate) => Number(candidate.dataset.step) === stepNumber);
    if (!panel) return false;

    const controls = Array.from(panel.querySelectorAll('input:not([type="hidden"]):not([type="file"]), textarea, select'));
    if (stepNumber === 3) validatePhone();

    let firstInvalid = null;
    controls.forEach((control) => {
      if (control.disabled) return;
      if (!control.checkValidity()) {
        showFieldError(control, getValidationMessage(control));
        if (!firstInvalid) firstInvalid = control;
      } else {
        clearFieldError(control);
      }
    });


    if (firstInvalid) {
      firstInvalid?.focus();
      return false;
    }
    return true;
  }

  function setChoice(groupName, value) {
    const hiddenControl = {
      budget: form.querySelector('#budget-hidden'),
      timeline: form.querySelector('#timeline-hidden'),
      contactMethod: form.querySelector('#contact-method-hidden')
    }[groupName];
    if (!hiddenControl) return;

    hiddenControl.value = value;
    form.querySelectorAll(`[data-choice="${groupName}"]`).forEach((button) => {
      const selected = button.dataset.value === value;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
      if (groupName === 'contactMethod') {
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', String(selected));
        button.tabIndex = selected ? 0 : -1;
      }
    });
    clearFieldError(hiddenControl);
    updateSummary();
    saveDraft();
  }

  function scheduleSectorStep() {
    window.clearTimeout(sectorTimer);
    sectorTimer = window.setTimeout(() => goToStep(2), REDUCED_MOTION.matches ? 0 : 250);
  }

  function updateSummary() {
    const sector = SECTORS[getSelectedSector()];
    const values = {
      sector: sector?.label || 'Not selected',
      budget: form.querySelector('#budget-hidden')?.value || 'Not selected',
      timeline: form.querySelector('#timeline-hidden')?.value || 'Not selected'
    };
    Object.entries(values).forEach(([key, value]) => {
      const target = document.querySelector(`[data-summary="${key}"]`);
      if (target) target.textContent = value;
    });
  }

  function saveDraft() {
    const textFields = ['projectDetails', 'firstName', 'lastName', 'workEmail', 'phone', 'company', 'role'];
    const draft = {};
    textFields.forEach((name) => {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) draft[name] = field.value;
    });
    draft.sector = getSelectedSector();
    draft.cameraCount = form.elements.namedItem('cameraCount')?.value || '';
    draft.budget = form.querySelector('#budget-hidden')?.value || '';
    draft.timeline = form.querySelector('#timeline-hidden')?.value || '';
    draft.preferredContact = form.querySelector('#contact-method-hidden')?.value || '';
    safeStorageSet(STORAGE_KEY, JSON.stringify(draft));
  }

  function restoreDraft() {
    const saved = safeStorageGet(STORAGE_KEY);
    if (!saved) return;
    let draft;
    try {
      draft = JSON.parse(saved);
    } catch (error) {
      safeStorageRemove(STORAGE_KEY);
      return;
    }
    if (!draft || typeof draft !== 'object') return;

    ['projectDetails', 'firstName', 'lastName', 'workEmail', 'phone', 'company', 'role'].forEach((name) => {
      const field = form.elements.namedItem(name);
      if ((field instanceof HTMLInputElement || field instanceof HTMLTextAreaElement) && typeof draft[name] === 'string') {
        field.value = draft[name];
      }
    });
    if (typeof draft.cameraCount === 'string') form.elements.namedItem('cameraCount').value = draft.cameraCount;
    if (SECTORS[draft.sector]) getSectorInput(draft.sector).checked = true;
    if (BUDGETS.includes(draft.budget)) setChoice('budget', draft.budget);
    if (['As soon as possible', 'Within 1 month', '1 to 3 months', 'Just exploring'].includes(draft.timeline)) setChoice('timeline', draft.timeline);
    if (['Email', 'Phone', 'WhatsApp'].includes(draft.preferredContact)) setChoice('contactMethod', draft.preferredContact);
    if (projectDetails && characterCount) characterCount.textContent = `${projectDetails.value.length} / 1000`;
    updateSectorPrompt();
    updateSummary();
  }

  function setCompanyFacts() {
    document.querySelectorAll('[data-fact]').forEach((element) => {
      const fact = COMPANY_FACTS[element.dataset.fact];
      if (fact) element.textContent = fact;
    });
    const schemaScript = document.querySelector('#organization-jsonld');
    if (schemaScript) {
      const schema = JSON.parse(schemaScript.textContent);
      Object.assign(schema.mainEntity, {
        telephone: window.SITE_CONTACT.phone,
        email: window.SITE_CONTACT.email,
        openingHours: 'Mo-Fr 09:00-18:00',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Panvel',
          addressLocality: 'Panvel',
          addressRegion: 'Maharashtra',
          addressCountry: 'IN'
        }
      });
      schemaScript.textContent = JSON.stringify(schema);
    }

    function isHttpsUrl(value) {
      if (typeof value !== 'string' || !value.trim()) return false;
      try {
        return new URL(value).protocol === 'https:';
      } catch (error) {
        return false;
      }
    }

    function renderOptionalContactLinks() {
      const host = document.querySelector('[data-contact-actions]');
      if (!host) return;

      const links = [
        { href: WHATSAPP_URL, label: 'Chat on WhatsApp' },
        { href: CALENDAR_URL, label: 'Book a call' }
      ].filter((item) => isHttpsUrl(item.href));

      host.replaceChildren(...links.map((item) => {
        const link = document.createElement('a');
        link.className = 'ct-side-action';
        link.href = item.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = item.label;
        return link;
      }));

      const talkStrip = host.closest('.ct-talk-strip');
      if (talkStrip) {
        talkStrip.hidden = links.length === 0;
        talkStrip.style.display = links.length ? '' : 'none';
      }
    }

    function renderContactSocials() {
      const host = document.querySelector('[data-contact-socials]');
      if (!host) return;

      const socials = Array.isArray(window.FOOTER_SOCIALS) ? window.FOOTER_SOCIALS : [];
      const links = socials.filter((item) => item && window.ICONS[item.icon] && isHttpsUrl(item.href));

      host.replaceChildren(...links.map((item) => {
        const link = document.createElement('a');
        link.href = item.href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `FrameIQ on ${item.label} (opens in a new tab)`);

        const icon = document.createElement('span');
        icon.className = 'ct-social-grid__icon';
        icon.setAttribute('aria-hidden', 'true');
        const glyph = document.createElement('i');
        glyph.className = window.iconClass(item.icon);
        glyph.setAttribute('aria-hidden', 'true');
        icon.appendChild(glyph);

        const label = document.createElement('span');
        label.textContent = item.label;
        link.append(icon, label);
        return link;
      }));

      const socialCard = host.closest('.ct-sidebar-card');
      if (socialCard) {
        socialCard.hidden = links.length === 0;
        socialCard.style.display = links.length ? '' : 'none';
      }
    }

    const faqScript = document.querySelector('#faq-jsonld');
    if (faqScript) {
      const faqSchema = JSON.parse(faqScript.textContent);
      const responseQuestion = faqSchema.mainEntity.find((entry) => entry.name === 'How fast do you respond?');
      if (responseQuestion) {
        responseQuestion.acceptedAnswer.text = `Response times have not been confirmed. Contact FrameIQ at ${window.SITE_CONTACT.email} or ${window.SITE_CONTACT.phone} during ${window.SITE_CONTACT.hours}.`;
        faqScript.textContent = JSON.stringify(faqSchema);
      }
    }
    const responseFaq = [...document.querySelectorAll('.ct-accordion-item')].find((item) => item.querySelector('.ct-accordion-trigger')?.textContent.includes('How fast do you respond?'));
    const responseAnswer = responseFaq?.querySelector('.ct-accordion-panel p');
    if (responseAnswer) responseAnswer.textContent = `Response times have not been confirmed. Contact FrameIQ at ${window.SITE_CONTACT.email} or ${window.SITE_CONTACT.phone} during ${window.SITE_CONTACT.hours}.`;
    renderOptionalContactLinks();
    renderContactSocials();
  }

  function getMessageText() {
    const values = new FormData(form);
    const sector = SECTORS[getSelectedSector()]?.label || 'General Inquiry';
    const lines = [
      `Sector: ${sector}`,
      `Project: ${values.get('projectDetails') || ''}`,
      `Cameras or sites: ${values.get('cameraCount') || 'Not sure yet'}`,
      `Budget: ${values.get('budget') || 'Not selected'}`,
      `Timeline: ${values.get('timeline') || 'Not selected'}`,
      `Name: ${values.get('firstName') || ''} ${values.get('lastName') || ''}`,
      `Work email: ${values.get('workEmail') || ''}`,
      `Phone: ${values.get('phone') || 'Not provided'}`,
      `Company: ${values.get('company') || 'Not provided'}`,
      `Role: ${values.get('role') || 'Not provided'}`,
      `Preferred contact: ${values.get('preferredContact') || 'Not selected'}`,
    ];
    return lines.join('\n').slice(0, 1799);
  }

  function showFormNotice(message, { emailLink = false, isError = false } = {}) {
    if (!formMessage) return;
    formMessage.classList.remove('sr-only');
    formMessage.classList.toggle('ct-form-message--error', isError);
    formMessage.replaceChildren();
    const text = document.createElement('p');
    text.textContent = message;
    formMessage.appendChild(text);
    if (emailLink) {
      const link = document.createElement('a');
      const sector = SECTORS[getSelectedSector()]?.label || 'General Inquiry';
      const body = getMessageText();
      link.className = 'btn btn--primary ct-email-fallback';
      link.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent(`Enquiry: ${sector}`)}&body=${encodeURIComponent(body)}`;
      link.textContent = 'Send this by email';
      formMessage.appendChild(link);
      const copyStatus = document.createElement('span');
      copyStatus.className = 'ct-copy-status';
      copyStatus.setAttribute('role', 'status');
      copyStatus.setAttribute('aria-live', 'polite');
      formMessage.appendChild(copyStatus);
      window.FrameIQForms?.appendCopyButton(formMessage, getMessageText, copyStatus);
    }
    formMessage.focus?.();
  }

  function showSuccess() {
    const firstName = form.elements.namedItem('firstName').value.trim();
    const sectorLabel = SECTORS[getSelectedSector()]?.label || 'General Inquiry';
    const budget = form.querySelector('#budget-hidden').value || 'Not selected';
    const timeline = form.querySelector('#timeline-hidden').value || 'Not selected';

    const screen = document.createElement('section');
    screen.className = 'ct-success';
    screen.setAttribute('aria-labelledby', 'contact-success-title');
    screen.innerHTML = `
      <span class="ct-success__icon ${window.iconClass('check')}" role="img" aria-label="Message sent successfully"></span>
      <h2 id="contact-success-title" tabindex="-1">Thank you, ${escapeHtml(firstName)}!</h2>
      <p>Your enquiry has been submitted successfully.</p>
      <div class="ct-success__recap"><strong>${escapeHtml(sectorLabel)}</strong><span>${escapeHtml(budget)}</span><span>${escapeHtml(timeline)}</span></div>
      <div class="ct-success__actions">
        <a class="btn btn--secondary" href="../index.html">Back to Home</a>
        <button class="btn btn--primary" type="button" data-send-another>Send another message</button>
      </div>
    `;
    form.replaceWith(screen);
    screen.querySelector('[data-send-another]')?.addEventListener('click', () => window.location.reload());
    screen.querySelector('h2')?.focus();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[character]));
  }

  async function submitForm(event) {
    event.preventDefault();
    if (currentStep === 1) {
      if (!getSelectedSector()) {
        showToast('Choose a sector to continue.');
        return;
      }
      goToStep(2);
      return;
    }
    if (currentStep === 2) {
      if (validatePanel(2)) goToStep(3);
      return;
    }

    if (!validatePanel(3)) return;
    if (form.elements.namedItem('_gotcha').value.trim()) {
      showFormNotice(`We could not process this enquiry. Please email ${window.SITE_CONTACT.email}.`, { isError: true });
      return;
    }

    if (!window.FORM_ENDPOINT) {
      showFormNotice('Contact form is not connected yet. Click below to send this by email.', { emailLink: true });
      return;
    }

    const submitButton = form.querySelector('.ct-btn-submit');
    const originalLabel = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending…';
    submitButton.setAttribute('aria-busy', 'true');
    if (formMessage) formMessage.textContent = '';

    try {
      const payload = new FormData(form);
      const response = await fetch(window.FORM_ENDPOINT, {
        method: 'POST',
        body: payload,
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Form endpoint returned ${response.status}`);
      }
      safeStorageRemove(STORAGE_KEY);
      showSuccess();
    } catch (error) {
      showFormNotice(`We could not send your enquiry right now. Please email ${window.SITE_CONTACT.email}.`, { isError: true });
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
      submitButton.removeAttribute('aria-busy');
    }
  }

  function initializeForm() {
    setCompanyFacts();
    addSectorChoices();
    restoreDraft();
    goToStep(1, { focus: false });
    updateSummary();

    const querySector = new URLSearchParams(window.location.search).get('sector');
    const selectedSector = Array.isArray(window.SECTORS)
      ? window.SECTORS.find((sector) => sector.slug === querySector)
      : null;
    if (selectedSector) {
      const radio = getSectorInput(selectedSector.slug);
      if (radio) radio.checked = true;
      if (projectDetails) {
        projectDetails.value = `Sector: ${selectedSector.name}\nUse case: `;
        if (characterCount) characterCount.textContent = `${projectDetails.value.length} / 1000`;
      }
      updateSectorPrompt();
      updateSummary();
      goToStep(1, { focus: false });
    }
    const gearEnquiry = new URLSearchParams(window.location.search).get('gearEnquiry');
    if (gearEnquiry && projectDetails) {
      const generalSector = getSectorInput('general');
      if (generalSector) generalSector.checked = true;
      projectDetails.value = gearEnquiry.slice(0, 1000);
      if (characterCount) characterCount.textContent = `${projectDetails.value.length} / 1000`;
      updateSectorPrompt();
      updateSummary();
      goToStep(2, { focus: false });
      projectDetails.focus();
    }
    const productSlug = new URLSearchParams(window.location.search).get('product');
    const selectedProduct = Array.isArray(window.AI_PRODUCTS)
      ? window.AI_PRODUCTS.find((product) => product.slug === productSlug && product.status !== 'demo scene only')
      : null;
    if (selectedProduct && projectDetails) {
      if (!selectedSector) {
        const generalSector = getSectorInput('general');
        if (generalSector) generalSector.checked = true;
      }
      projectDetails.value = selectedSector
        ? `I'm interested in: ${selectedProduct.name}\nSector: ${selectedSector.name}`
        : `I'm interested in: ${selectedProduct.name}`;
      if (characterCount) characterCount.textContent = `${projectDetails.value.length} / 1000`;
      updateSectorPrompt();
      updateSummary();
      goToStep(2, { focus: false });
      projectDetails.focus();
    }
    const queryTopic = new URLSearchParams(window.location.search).get('topic');
    if (queryTopic === 'research' && projectDetails && !projectDetails.value.trim()) {
      if (!getSelectedSector()) {
        const generalSector = getSectorInput('general');
        if (generalSector) generalSector.checked = true;
      }
      projectDetails.value = "I'd like to discuss: Computer vision research";
      if (characterCount) characterCount.textContent = `${projectDetails.value.length} / 1000`;
      updateSectorPrompt();
      updateSummary();
      goToStep(2, { focus: false });
      projectDetails.focus();
    }

    form.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.matches('input[name="sector"]')) {
        updateSectorPrompt();
        updateSummary();
        saveDraft();
        scheduleSectorStep();
      }
      if (target.matches('select')) saveDraft();
    });

    form.addEventListener('input', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target === projectDetails && characterCount) characterCount.textContent = `${projectDetails.value.length} / 1000`;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        if (target.id === 'phone') validatePhone();
        if (target.getAttribute('aria-invalid') === 'true' && target.checkValidity()) clearFieldError(target);
        saveDraft();
      }
    });

    form.addEventListener('focusout', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement)) return;
      if (target.id === 'phone') validatePhone();
      if (!target.checkValidity()) showFieldError(target, getValidationMessage(target));
      else clearFieldError(target);
    });

    form.addEventListener('submit', submitForm);

    document.querySelectorAll('[data-choice]').forEach((button) => {
      button.setAttribute('aria-pressed', 'false');
      if (button.dataset.choice === 'contactMethod') {
        button.setAttribute('role', 'radio');
        button.setAttribute('aria-checked', 'false');
        button.tabIndex = document.querySelector('[data-choice="contactMethod"]') === button ? 0 : -1;
      }
      button.addEventListener('click', () => setChoice(button.dataset.choice, button.dataset.value));
    });
    document.querySelectorAll('.ct-sector-option').forEach((option) => {
      option.addEventListener('click', () => {
        const radio = option.querySelector('input[name="sector"]');
        if (radio?.checked) scheduleSectorStep();
      });
    });

    document.querySelectorAll('.ct-btn-back').forEach((button) => {
      button.addEventListener('click', () => goToStep(Math.max(1, currentStep - 1)));
    });
    document.querySelector('.ct-btn-next')?.addEventListener('click', () => {
      if (validatePanel(2)) goToStep(3);
    });

    document.querySelectorAll('[data-summary-edit]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        goToStep(link.dataset.summaryEdit === 'sector' ? 1 : 2);
      });
    });

    document.querySelectorAll('[data-sector].ct-sidebar-row').forEach((button) => {
      button.addEventListener('click', () => {
        const radio = getSectorInput(button.dataset.sector);
        if (!radio) return;
        radio.checked = true;
        updateSectorPrompt();
        updateSummary();
        saveDraft();
        goToStep(2);
        document.querySelector('.ct-form-panel')?.scrollIntoView({ behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth', block: 'start' });
      });
    });

    document.querySelectorAll('[data-copy], [data-company-phone-copy]').forEach((button) => {
      button.addEventListener('click', () => copyText(button.dataset.copy));
    });

    document.querySelectorAll('.ct-side-action[aria-disabled="true"]').forEach((button) => {
      button.addEventListener('click', (event) => event.preventDefault());
    });

    document.querySelectorAll('.ct-accordion-trigger').forEach((button) => {
      const panel = button.closest('.ct-accordion-item')?.querySelector('.ct-accordion-panel');
      if (panel) panel.hidden = !button.getAttribute('aria-expanded').includes('true');
      button.addEventListener('click', () => {
        const item = button.closest('.ct-accordion-item');
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        item?.classList.toggle('is-open', open);
        if (panel) panel.hidden = !open;
      });
    });

    const contactMethodButtons = Array.from(document.querySelectorAll('[data-choice="contactMethod"]'));
    contactMethodButtons[0]?.closest('[role="radiogroup"]')?.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        const currentIndex = contactMethodButtons.indexOf(document.activeElement);
        const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
        const next = contactMethodButtons[(currentIndex + direction + contactMethodButtons.length) % contactMethodButtons.length];
        next.focus();
        next.click();
    });

    let pointerFramePending = false;
    let pointerPosition = null;
    document.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch' || REDUCED_MOTION.matches) return;
      if (window.innerWidth < 1024) return;
      pointerPosition = { x: event.clientX, y: event.clientY };
      if (pointerFramePending) return;
      pointerFramePending = true;
      window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--ct-pointer-x', `${pointerPosition.x}px`);
        document.documentElement.style.setProperty('--ct-pointer-y', `${pointerPosition.y}px`);
        pointerFramePending = false;
      });
    }, { passive: true });
  }

  initializeForm();
})();
