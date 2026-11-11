(function () {
  'use strict';

  var panSection = document.querySelector('[data-cu-pan]');
  if (!panSection) return;

  var viewport = panSection.querySelector('.cu-pan__viewport');
  var track = panSection.querySelector('.cu-pan__track');
  var sticky = panSection.querySelector('.cu-pan__sticky');
  var hint = panSection.querySelector('.cu-pan__hint');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var TILE_SIZES = {
    'tile1.webp': { width: 1680, height: 944 },
    'tile2.webp': { width: 1536, height: 1024 },
    'tile3.webp': { width: 1536, height: 1024 },
    'tile4.webp': { width: 1536, height: 1024 },
    'tile5.webp': { width: 1536, height: 1024 },
    'tile6.webp': { width: 1536, height: 1024 },
    'tile7.webp': { width: 1536, height: 1024 },
    'tile8.webp': { width: 1536, height: 1024 },
    'tile9.webp': { width: 1536, height: 1024 },
    'tile10.webp': { width: 1536, height: 1024 },
    'tile11.webp': { width: 1536, height: 1024 },
    'tile12.webp': { width: 1536, height: 1024 },
    'tile13.webp': { width: 1536, height: 1024 }
  };

  var CULTURE_TILES = [
    'tile1.webp', 'tile2.webp', 'tile3.webp', 'tile4.webp', 'tile5.webp',
    'tile6.webp', 'tile7.webp', 'tile8.webp', 'tile9.webp', 'tile10.webp',
    'tile11.webp', 'tile12.webp', 'tile13.webp'
  ];

  var state = {
    panDistance: 0,
    scrollDistance: 0,
    rafId: 0
  };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function getHeaderHeight() {
    var siteHeader = document.getElementById('site-header');
    var height = siteHeader ? siteHeader.getBoundingClientRect().height : 76;
    var value = Math.round(height || 76);
    document.documentElement.style.setProperty('--header-h', value + 'px');
    if (sticky) {
      sticky.style.top = value + 'px';
      sticky.style.height = 'calc(100vh - ' + value + 'px)';
    }
    return value;
  }

  function buildTiles() {
    if (!track) return;

    track.innerHTML = '';
    CULTURE_TILES.forEach(function (fileName, index) {
      var image = document.createElement('img');
      var dims = TILE_SIZES[fileName] || { width: 1536, height: 1024 };
      var src = '../assets/img/' + fileName;

      image.src = src;
      image.alt = '';
      image.draggable = false;
      image.loading = index < 3 ? 'eager' : 'lazy';
      image.decoding = 'async';
      image.width = dims.width;
      image.height = dims.height;
      image.setAttribute('aria-hidden', 'true');
      image.className = 'cu-pan__tile';

      image.onerror = function () {
        var fallback = document.createElement('div');
        fallback.className = 'cu-pan__img-fallback';
        fallback.style.aspectRatio = dims.width + ' / ' + dims.height;
        fallback.setAttribute('aria-hidden', 'true');
        image.replaceWith(fallback);
      };

      track.appendChild(image);
    });
  }

  function updatePanMetrics() {
    if (!viewport || !track) return;

    if (reduceMotion.matches) {
      if (sticky) {
        sticky.style.position = 'relative';
        sticky.style.top = '0';
        sticky.style.height = 'auto';
      }
      panSection.style.height = 'auto';
      track.style.transform = 'translate3d(0, 0, 0)';
      viewport.style.overflowX = 'auto';
      viewport.style.overflowY = 'hidden';
      viewport.style.scrollSnapType = 'x proximity';
      viewport.style.webkitOverflowScrolling = 'touch';
      return;
    }

    var headerHeight = getHeaderHeight();
    if (sticky) {
      sticky.style.position = 'sticky';
      sticky.style.top = headerHeight + 'px';
      sticky.style.height = 'calc(100vh - ' + headerHeight + 'px)';
    }

    viewport.style.overflowX = 'hidden';
    viewport.style.overflowY = 'hidden';
    viewport.style.scrollSnapType = 'none';

    state.panDistance = Math.max(0, track.scrollWidth - viewport.clientWidth);

    if (state.panDistance <= 0) {
      track.style.transform = 'translate3d(0, 0, 0)';
      panSection.style.height = 'auto';
      if (hint) hint.style.display = 'none';
      return;
    }

    if (hint) hint.style.display = 'block';
    state.scrollDistance = clamp(state.panDistance * 0.42, 3 * window.innerHeight, 10 * window.innerHeight);
    panSection.style.height = (window.innerHeight + state.scrollDistance) + 'px';

    var sectionTop = panSection.offsetTop;
    var progress = clamp((window.scrollY - sectionTop) / state.scrollDistance, 0, 1);
    var translateX = -progress * state.panDistance;
    track.style.transform = 'translate3d(' + translateX + 'px, 0, 0)';
  }

  function requestPanUpdate() {
    if (state.rafId) return;

    state.rafId = window.requestAnimationFrame(function () {
      state.rafId = 0;
      updatePanMetrics();
    });
  }

  function bindObservers() {
    if (track && viewport) {
      var resizeObserver = new ResizeObserver(function () {
        requestPanUpdate();
      });

      resizeObserver.observe(track);
      resizeObserver.observe(viewport);
    }

    window.addEventListener('scroll', requestPanUpdate, { passive: true });
    window.addEventListener('resize', requestPanUpdate);
    window.addEventListener('orientationchange', requestPanUpdate);
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) requestPanUpdate();
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(requestPanUpdate);
    }

    Array.prototype.forEach.call(track.querySelectorAll('img'), function (img) {
      img.addEventListener('load', requestPanUpdate, { once: true });
    });
  }

  buildTiles();
  bindObservers();
  updatePanMetrics();

  if (reduceMotion.addEventListener) {
    reduceMotion.addEventListener('change', updatePanMetrics);
  } else if (reduceMotion.addListener) {
    reduceMotion.addListener(updatePanMetrics);
  }
})();
