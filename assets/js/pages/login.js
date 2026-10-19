document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#login-form');
  const email = document.querySelector('#login-email');
  const password = document.querySelector('#login-password');
  const status = document.querySelector('[data-login-status]');
  const passwordToggle = document.querySelector('[data-password-toggle]');
  const logo = document.querySelector('[data-frameiq-logo]');

  if (logo && typeof window.FrameIQLogo === 'function') {
    logo.innerHTML = window.FrameIQLogo();
  }
  if (!form || !email || !password || !status) return;

  const emailError = document.querySelector('#email-error');
  const passwordError = document.querySelector('#password-error');
  const clearStatus = () => {
    status.replaceChildren();
    status.className = 'login-status';
  };

  passwordToggle?.addEventListener('click', () => {
    const showing = password.type === 'password';
    password.type = showing ? 'text' : 'password';
    passwordToggle.setAttribute('aria-pressed', String(showing));
    passwordToggle.setAttribute('aria-label', showing ? 'Hide password' : 'Show password');
    password.focus();
  });

  form.addEventListener('input', (event) => {
    const field = event.target;
    if (field === email) {
      emailError.textContent = '';
      email.removeAttribute('aria-invalid');
    } else if (field === password) {
      passwordError.textContent = '';
      password.removeAttribute('aria-invalid');
    }
    clearStatus();
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    emailError.textContent = '';
    passwordError.textContent = '';
    email.removeAttribute('aria-invalid');
    password.removeAttribute('aria-invalid');
    clearStatus();

    status.className = 'login-status is-info';
    status.append(
      document.createTextNode('Customer login is not available yet. '),
      Object.assign(document.createElement('a'), {
        href: 'contact.html',
        textContent: 'Contact us for help.'
      })
    );
  });
});
