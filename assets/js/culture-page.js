// culture-page.js - Culture page scroll effects (prefix cu- / gk-culture-strip)
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- gallery filter ----
  var gallery = document.getElementById('cuMasonry');
  var cols = gallery ? Array.prototype.slice.call(gallery.querySelectorAll('.cu-col')) : [];
  var filter = document.getElementById('cuFilter');
  if (filter && gallery) {
    filter.addEventListener('change', function () {
      var selected = filter.value;
      cols.forEach(function (col) {
        var visible = 0;
        col.querySelectorAll('[data-category]').forEach(function (tile) {
          var show = selected === 'all' || tile.dataset.category === selected;
          tile.hidden = !show;
          if (show) visible++;
        });
        col.classList.toggle('is-empty', visible === 0);
      });
    });
  }

  // ---- gallery parallax ----
  var galleryTicking = false;
  function updateGallery() {
    if (!gallery || reduce) return;
    var vh = window.innerHeight;
    var g = gallery.getBoundingClientRect();
    var gp = Math.min(1, Math.max(0, (vh - g.top) / (vh + g.height)));
    for (var i = 0; i < cols.length; i++) {
      var dir = i % 2 === 0 ? 1 : -1;
      cols[i].style.transform = 'translate3d(0,' + ((gp - 0.5) * dir * 170).toFixed(1) + 'px,0)';
    }
    galleryTicking = false;
  }
  if (!reduce) {
    window.addEventListener('scroll', function () {
      if (!galleryTicking) { galleryTicking = true; requestAnimationFrame(updateGallery); }
    }, { passive: true });
    updateGallery();
  }

})();
