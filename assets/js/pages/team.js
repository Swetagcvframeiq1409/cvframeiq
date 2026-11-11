(function () {
  'use strict';
  var grid = document.getElementById('team-grid');
  if (!grid) return;

  grid.innerHTML = Array.from({ length: 8 }, function () {
    return '<article class="tm-card">'
      + '<div class="tm-avatar" aria-hidden="true"><i class="bi bi-person"></i></div>'
      + '<p class="tm-pending">Photo pending</p>'
      + '</article>';
  }).join('');
}());
