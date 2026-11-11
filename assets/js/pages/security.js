(function () {
  'use strict';

  // Sticky "On this page" active highlight
  function initToc() {
    var toc = document.querySelector('.security-toc');
    if (!toc) return;
    var links = toc.querySelectorAll('a[data-section]');
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute('data-section');
      var el = document.getElementById(id);
      if (el) sections.push({ id: id, el: el, link: a });
    });
    if (!sections.length) return;

    function update() {
      var scrollY = window.scrollY || window.pageYOffset;
      var current = sections[0].id;
      sections.forEach(function (s) {
        var top = s.el.getBoundingClientRect().top + scrollY;
        if (scrollY + 120 >= top) current = s.id;
      });
      links.forEach(function (a) {
        var isActive = a.getAttribute('data-section') === current;
        a.classList.toggle('is-active', isActive);
        if (isActive) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Sector list highlight on scroll through the standards section
  function initSectors() {
    var list = document.querySelector('.security-sector-list');
    var section = document.getElementById('security-standards');
    if (!list || !section) return;
    var items = list.querySelectorAll('li');
    if (!items.length) return;

    function update() {
      var rect = section.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh - rect.top) / (rect.height + vh);
      progress = Math.max(0, Math.min(1, progress));
      var idx = Math.min(items.length - 1, Math.floor(progress * items.length));
      items.forEach(function (li, i) {
        li.classList.toggle('is-active', i === idx);
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Security report form validation
  function initForm() {
    var form = document.getElementById('securityReportForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      form.querySelectorAll('[required]').forEach(function (field) {
        var err = field.parentElement.querySelector('.gk-form__error');
        var isEmpty = !field.value.trim();
        var isEmailBad = field.type === 'email' && field.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());

        if (isEmpty || isEmailBad) {
          valid = false;
          field.classList.add('is-error');
          if (err) err.style.display = 'block';
        } else {
          field.classList.remove('is-error');
          if (err) err.style.display = 'none';
        }
      });

      if (valid) {
        var status = document.getElementById('secFormStatus');
        if (status) status.textContent = 'Thank you. We will review your report and respond shortly.';
        form.reset();
      }
    });

    // Clear errors on input
    form.querySelectorAll('input, textarea').forEach(function (field) {
      field.addEventListener('input', function () {
        field.classList.remove('is-error');
        var err = field.parentElement.querySelector('.gk-form__error');
        if (err) err.style.display = 'none';
      });
    });
  }

  // Security FAQ accordion (does NOT auto-open first item, so clicking any item opens it)
  function initFaq() {
    var acc = document.querySelector('[data-sec-acc]');
    if (!acc) return;
    var items = acc.querySelectorAll('.gk-acc__item');
    items.forEach(function (it) {
      var q = it.querySelector('.gk-acc__q');
      if (!q) return;
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', function () {
        var open = it.classList.contains('is-open');
        items.forEach(function (o) {
          o.classList.remove('is-open');
          var oq = o.querySelector('.gk-acc__q');
          if (oq) oq.setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          it.classList.add('is-open');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initToc(); initSectors(); initForm(); initFaq(); });
  } else {
    initToc(); initSectors(); initForm(); initFaq();
  }
})();
