// about-nav.js - makes the sticky section chips on the About page work.
// 1) clicking a chip scrolls to its section (under the sticky header + chip bar)
// 2) exactly one chip is highlighted while scrolling
// 3) the highlighted chip scrolls into view inside the chip bar
(function () {
  var ACTIVE_CLASS = 'is-active'; // must be the class that about CSS uses to style the active chip
  var page = document.querySelector('.about-page') || document.querySelector('main');
  if (!page) return;

  // all in-page links that point to a real section
  var links = Array.prototype.filter.call(page.querySelectorAll('a[href^="#"]'), function (a) {
    return a.hash.length > 1 && document.getElementById(a.hash.slice(1));
  });
  if (links.length < 5) return;

  // the chip bar is the smallest parent that holds 5 or more of those links
  var bar = null;
  links.forEach(function (a) {
    var el = a.parentElement;
    while (el && el !== page) {
      var count = links.filter(function (l) { return el.contains(l); }).length;
      if (count >= 5) { if (!bar || bar.contains(el)) bar = el; break; }
      el = el.parentElement;
    }
  });
  if (!bar) return;
  var chips = links.filter(function (l) { return bar.contains(l); });
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function offset() {
    var header = document.querySelector('.site-header, header');
    var h = header ? header.getBoundingClientRect().height : 74;
    return h + bar.getBoundingClientRect().height + 12;
  }

  // 1) click -> scroll
  chips.forEach(function (chip) {
    chip.addEventListener('click', function (e) {
      var target = document.getElementById(chip.hash.slice(1));
      if (!target) return;
      e.preventDefault();
      var y = target.getBoundingClientRect().top + window.pageYOffset - offset();
      window.scrollTo({ top: Math.max(0, y), behavior: reduce ? 'auto' : 'smooth' });
      if (history.replaceState) history.replaceState(null, '', chip.hash);
      setActive(chip);
    });
  });

  // 2) one active chip
  function setActive(chip) {
    chips.forEach(function (c) {
      var on = c === chip;
      c.classList.toggle(ACTIVE_CLASS, on);
      if (on) c.setAttribute('aria-current', 'true'); else c.removeAttribute('aria-current');
    });
    // 3) keep the chip visible inside the bar (only moves the bar, never the page)
    var left = chip.offsetLeft - (bar.clientWidth - chip.offsetWidth) / 2;
    bar.scrollTo({ left: Math.max(0, left), behavior: reduce ? 'auto' : 'smooth' });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      ticking = false;
      var line = offset() + 40;
      var current = chips[0];
      chips.forEach(function (c) {
        var t = document.getElementById(c.hash.slice(1));
        if (t && t.getBoundingClientRect().top <= line) current = c;
      });
      if (!current.classList.contains(ACTIVE_CLASS)) setActive(current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
})();
