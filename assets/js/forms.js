(() => {
  'use strict';

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        if (!document.execCommand) throw error;
      }
    }

    const field = document.createElement('textarea');
    field.value = text;
    field.setAttribute('readonly', '');
    field.style.position = 'fixed';
    field.style.opacity = '0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('The browser could not copy the message.');
    return true;
  }

  function appendCopyButton(host, getText, status) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn btn--secondary';
    button.textContent = 'Copy my message';
    button.addEventListener('click', async () => {
      try {
        await copyText(getText());
        status.textContent = 'Message copied. Paste it into your email.';
      } catch (error) {
        console.error('Message could not be copied.', error);
        status.textContent = 'Copy was unavailable. Select and copy the message manually.';
      }
    });
    host.append(button);
    return button;
  }

  window.FrameIQForms = { appendCopyButton, copyText };
})();
