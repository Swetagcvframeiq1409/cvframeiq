// culture-page.js - scroll effects for the Culture page (prefix cu-)
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- 1. office scene (CSS shapes + Bootstrap Icons only, no SVG) ----
  // item formats (x, y in % of the room, w, h in vmin):
  // ['blob', x, y, w, h, shape, color]  ['desk', x, y, w, h]
  // ['round', x, y, w]  ['person', x, y]  ['icon', x, y, 'bi-name']
  var rooms = [
    [
      ['blob', 58, 6, 26, 30, 'diamond', '#d9c8ff'],
      ['blob', 34, 36, 18, 18, 'rect', '#d4f1dc'],
      ['blob', 4, 62, 22, 28, 'tri', '#ffe3b5'],
      ['blob', 40, 72, 14, 18, 'hex', '#cfe3ff'],
      ['desk', 6, 12, 44, 26], ['icon', 14, 20, 'bi-laptop'], ['icon', 30, 20, 'bi-pc-display'],
      ['person', 14, 34], ['person', 30, 34], ['person', 44, 34],
      ['round', 62, 44, 24], ['person', 58, 40], ['person', 72, 38], ['person', 82, 52], ['person', 66, 62],
      ['icon', 92, 20, 'bi-flower3'], ['icon', 8, 82, 'bi-tree'], ['icon', 50, 92, 'bi-flower2'],
      ['icon', 74, 82, 'bi-snow'], ['icon', 88, 62, 'bi-bell']
    ],
    [
      ['blob', 10, 10, 24, 30, 'tri', '#ffe3b5'],
      ['blob', 66, 58, 24, 30, 'diamond', '#d9c8ff'],
      ['desk', 8, 52, 38, 24], ['icon', 16, 58, 'bi-laptop'], ['icon', 32, 58, 'bi-cup-hot'],
      ['person', 16, 72], ['person', 32, 72],
      ['round', 54, 18, 20], ['person', 50, 14], ['person', 64, 14], ['person', 58, 30],
      ['person', 86, 22], ['person', 90, 40], ['person', 78, 48],
      ['icon', 90, 78, 'bi-tree'], ['icon', 4, 30, 'bi-flower3'], ['icon', 70, 90, 'bi-flower2'],
      ['icon', 82, 38, 'bi-snow'], ['icon', 28, 90, 'bi-bell']
    ],
    [
      ['blob', 52, 8, 26, 30, 'hex', '#cfe3ff'],
      ['blob', 78, 60, 16, 16, 'circle', '#ffe3b5'],
      ['blob', 6, 56, 24, 30, 'diamond', '#d9c8ff'],
      ['desk', 10, 12, 46, 30], ['icon', 20, 20, 'bi-controller'], ['icon', 40, 20, 'bi-trophy'],
      ['person', 14, 46], ['person', 28, 46], ['person', 42, 46], ['person', 56, 46],
      ['round', 66, 62, 22], ['person', 62, 58], ['person', 76, 56], ['person', 70, 74],
      ['icon', 90, 16, 'bi-flower3'], ['icon', 6, 90, 'bi-tree'], ['icon', 44, 82, 'bi-flower2'],
      ['icon', 84, 36, 'bi-snow'], ['icon', 8, 20, 'bi-bell']
    ]
  ];

  var scene = document.getElementById('cuScene');
  var section = document.getElementById('cuExplore');
  if (scene) {
    rooms.forEach(function (items) {
      var room = document.createElement('div');
      room.className = 'cu-room';
      items.forEach(function (it) {
        var type = it[0];
        var d = document.createElement('div');
        d.style.left = it[1] + '%';
        d.style.top = it[2] + '%';
        if (type === 'blob') {
          d.className = 'cu-blob cu-blob--' + it[5];
          d.style.width = it[3] + 'vmin';
          d.style.height = it[4] + 'vmin';
          d.style.background = it[6];
        } else if (type === 'desk') {
          d.className = 'cu-desk';
          d.style.width = it[3] + 'vmin';
          d.style.height = it[4] + 'vmin';
        } else if (type === 'round') {
          d.className = 'cu-round';
          d.style.width = it[3] + 'vmin';
          d.style.height = it[3] + 'vmin';
        } else if (type === 'person') {
          d.className = 'cu-person';
          d.innerHTML = '<i class="bi bi-person"></i>';
        } else {
          d.className = 'cu-icon';
          d.innerHTML = '<i class="bi ' + it[3] + '"></i>';
        }
        room.appendChild(d);
      });
      scene.appendChild(room);
    });
  }

  // ---- 2. pinned pan: sideways on desktop, up/down on mobile ----
  var pin = section ? section.querySelector('.cu-explore__pin') : null;
  var mobile = window.matchMedia('(max-width: 767px)');
  var gallery = document.getElementById('cuMasonry');
  var cols = gallery ? gallery.querySelectorAll('.cu-col') : [];
  var filter = document.getElementById('cuFilter');
  if (filter && gallery) {
    filter.addEventListener('change', function () {
      var selected = filter.value;
      cols.forEach(function (col) {
        var visibleTiles = 0;
        col.querySelectorAll('[data-category]').forEach(function (tile) {
          var visible = selected === 'all' || tile.dataset.category === selected;
          tile.hidden = !visible;
          if (visible) visibleTiles++;
        });
        col.classList.toggle('is-empty', visibleTiles === 0);
      });
    });
  }
  var ticking = false;

  function clamp(v) { return Math.min(1, Math.max(0, v)); }

  function update() {
    ticking = false;
    if (reduce) return;
    var vh = window.innerHeight;

    if (section && scene && pin) {
      var headerH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 74;
      var r = section.getBoundingClientRect();
      var p = clamp((headerH - r.top) / (r.height - pin.offsetHeight));
      var shift = p * ((rooms.length - 1) / rooms.length) * 100;
      scene.style.transform = mobile.matches
        ? 'translate3d(0,-' + shift + '%,0)'
        : 'translate3d(-' + shift + '%,0,0)';
    }

    if (gallery) {
      var g = gallery.getBoundingClientRect();
      var gp = clamp((vh - g.top) / (vh + g.height));
      for (var i = 0; i < cols.length; i++) {
        var dir = i % 2 === 0 ? 1 : -1;
        cols[i].style.transform = 'translate3d(0,' + ((gp - 0.5) * dir * 170) + 'px,0)';
      }
    }
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
