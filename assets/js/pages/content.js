document.addEventListener('DOMContentLoaded', () => {
  const showDraft = window.LEGAL_PAGE_DATA?.SHOW_DRAFT === true;
  document.querySelectorAll('[data-legal-placeholder]').forEach((element) => {
    element.hidden = !showDraft;
  });

  const hasVisiblePlaceholder = Array.from(document.querySelectorAll('body *')).some((element) =>
    element.children.length === 0 &&
    !element.closest('[hidden]') &&
    /\[Placeholder\b/i.test(element.textContent)
  );
  if (hasVisiblePlaceholder && !document.querySelector('.content-page__draft')) {
    const heading = document.querySelector('.content-page__heading');
    const notice = document.createElement('p');
    notice.className = 'content-page__draft site-draft-notice';
    notice.textContent = 'Draft: this page contains placeholder content that needs confirmation.';
    heading?.after(notice);
  }

  const article = document.querySelector('[data-content-article]');
  const toc = document.querySelector('[data-content-toc]');
  if (article && toc) {
    const list = toc.querySelector('ul');
    const headings = Array.from(article.querySelectorAll('h2'));
    if (list) {
      list.replaceChildren();
      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = `content-section-${index + 1}`;
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent.trim();
        item.appendChild(link);
        list.appendChild(item);
      });
      toc.hidden = headings.length === 0;
    }
  }

  const form = document.querySelector('[data-notify-form]');
  if (form) {
    const email = form.querySelector('input[type="email"]');
    const status = document.querySelector('[data-notify-status]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!email || !status) return;
      if (!email.validity.valid) {
        email.setAttribute('aria-invalid', 'true');
        status.className = 'content-page__form-status is-error';
        status.textContent = 'Enter a valid email address.';
        email.focus();
        return;
      }
      email.setAttribute('aria-invalid', 'false');
      status.className = 'content-page__form-status';
      status.textContent = 'This form is not connected yet; your email was not sent or saved. Contact us to request updates.';
      form.reset();
    });
  }
});
