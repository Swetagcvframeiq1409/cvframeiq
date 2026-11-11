(function () {
  'use strict';

  var STEPS = [
    { title: 'Understand', body: 'Start with the operating context, visual inputs, and the need to address.' },
    { title: 'Build', body: 'Shape a computer-vision approach around the intended use case.' },
    { title: 'Validate', body: 'Review the approach against relevant conditions and requirements.' },
    { title: 'Deploy', body: 'Prepare the system for its intended environment.' },
    { title: 'Impact', body: 'Bring useful visual intelligence into the intended operation.' },
    { title: 'Iterate', body: '<span class="gk-draft">Draft - pending content</span>' },
    { title: 'Optimise', body: '<span class="gk-draft">Draft - pending content</span>' },
    { title: 'Sustain', body: '<span class="gk-draft">Draft - pending content</span>' }
  ];

  function buildSteplist() {
    var list = document.getElementById('hwwSteplist');
    if (!list) return;

    list.innerHTML = STEPS.map(function (s, i) {
      var num = String(i + 1).padStart(2, '0');
      return '<div class="gk-steplist__row' + (i === 0 ? ' is-active' : '') + '" role="listitem" tabindex="0">'
        + '<div class="gk-steplist__rail">' + num + '</div>'
        + '<div class="gk-steplist__content">'
        + '<h3>' + s.title + '</h3>'
        + '<p>' + s.body + '</p>'
        + '</div>'
        + '<span class="gk-steplist__num" aria-hidden="true">' + num + '</span>'
        + '</div>';
    }).join('');

    var rows = list.querySelectorAll('.gk-steplist__row');

    // Click to activate
    rows.forEach(function (row) {
      row.addEventListener('click', function () { activate(row, rows); });
      row.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(row, rows); }
      });
    });

    // Scroll-active via IntersectionObserver on the wrapper
    var wrap = list.closest('.hww-steplist-wrap');
    if (wrap && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) activate(entry.target, rows);
        });
      }, { root: wrap, rootMargin: '-30% 0px -30% 0px', threshold: 0 });
      rows.forEach(function (r) { io.observe(r); });
    }
  }

  function activate(row, rows) {
    rows.forEach(function (r) { r.classList.remove('is-active'); });
    row.classList.add('is-active');
  }

  function initForm() {
    var form = document.getElementById('hwwContactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var err = field.nextElementSibling;
        var valid = field.value.trim().length > 0 && (field.type !== 'email' || /\S+@\S+\.\S+/.test(field.value));
        field.classList.toggle('is-error', !valid);
        if (err && err.classList.contains('gk-form__error')) err.style.display = valid ? '' : 'block';
        if (!valid) ok = false;
      });
      if (!ok) return;
      var status = document.getElementById('hwwFormStatus');
      if (status) status.textContent = 'Message received — we will be in touch shortly.';
      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildSteplist();
    initForm();
  });
}());
