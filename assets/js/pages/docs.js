(() => {
  'use strict';

  const host = document.querySelector('[data-dc-sections]');
  const data = window.DOCUMENTATION;
  if (!host) return;
  if (!data || !Array.isArray(data.sections)) {
    console.error('Documentation could not initialize because its data is unavailable.');
    return;
  }

  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const showDraft = data.SHOW_DRAFT === true;
  const draftNotice = document.querySelector('[data-docs-draft]');
  if (draftNotice) draftNotice.hidden = !showDraft;
  const visible = data.sections.filter((item) => item.confirmed === true || showDraft);
  visible.forEach((item) => {
    const card = make('article', 'dc-card');
    card.append(make('span', 'dc-card__status', item.status));
    if (item.confirmed !== true) card.append(make('span', 'dc-card__unconfirmed', 'Unconfirmed'));
    card.append(make('h3', '', item.title), make('p', '', item.description));
    host.append(card);
  });
  host.closest('section').hidden = visible.length === 0;

  const form = document.querySelector('[data-dc-form]');
  const email = document.querySelector('#dc-email');
  const honeypot = document.querySelector('#dc-website');
  const status = document.querySelector('[data-dc-status]');
  const submit = form?.querySelector('[type="submit"]');
  if (!form || !email || !honeypot || !status || !submit) return;

  const setStatus = (message, link) => {
    status.replaceChildren();
    status.append(document.createTextNode(message));
    if (link) {
      status.append(document.createTextNode(' '));
      status.append(link);
    }
  };
  const mailtoFallback = () => {
    const link = make('a', 'dc-form__fallback', 'Open your email app');
    const message = `Please notify me about documentation updates.\nEmail: ${email.value.trim()}`;
    link.href = `mailto:${window.SITE_CONTACT.email}?subject=${encodeURIComponent('Documentation updates')}&body=${encodeURIComponent(message)}`;
    setStatus('The notification form is not connected. Continue by email to send your request.', link);
    const copyStatus = make('span', 'dc-copy-status');
    copyStatus.setAttribute('role', 'status');
    copyStatus.setAttribute('aria-live', 'polite');
    status.append(document.createTextNode(' '), copyStatus);
    window.FrameIQForms?.appendCopyButton(status, () => message, copyStatus);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.replaceChildren();
    if (honeypot.value) {
      setStatus('The request could not be submitted. Please try again.');
      return;
    }
    if (!email.value.trim() || !email.validity.valid) {
      email.setAttribute('aria-invalid', 'true');
      email.focus();
      setStatus('Enter a valid email address.');
      return;
    }
    const consent = form.querySelector('[name="consent"]');
    if (!consent?.checked) {
      setStatus('Please agree to the consent line before submitting.');
      consent?.focus();
      return;
    }
    email.removeAttribute('aria-invalid');

    if (!window.FORM_ENDPOINT) {
      mailtoFallback();
      return;
    }

    submit.disabled = true;
    submit.setAttribute('aria-busy', 'true');
    submit.textContent = 'Sending…';
    try {
      const response = await fetch(window.FORM_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error(`Form endpoint returned ${response.status}`);
      setStatus('Your request was submitted.');
      form.reset();
    } catch (error) {
      console.error('Documentation notification could not be submitted.', error);
      mailtoFallback();
    } finally {
      submit.disabled = false;
      submit.removeAttribute('aria-busy');
      submit.textContent = 'Notify me';
    }
  });
})();
