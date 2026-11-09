(function () {
  'use strict';
  var container = document.getElementById('hww-steps');
  if (!container) return;
  var steps = (window.COMPANY_PAGE_DATA && Array.isArray(window.COMPANY_PAGE_DATA.process))
    ? window.COMPANY_PAGE_DATA.process
    : [];
  if (!steps.length) {
    container.innerHTML = '<p>Coming soon.</p>';
    return;
  }
  container.innerHTML = steps.map(function (step, i) {
    return '<article class="hww-step">'
      + '<span class="hww-step__num">' + String(i + 1).padStart(2, '0') + '</span>'
      + '<h3>' + step.title + '</h3>'
      + '<p>' + (step.description || 'More details coming soon') + '</p>'
      + '</article>';
  }).join('');
}());
