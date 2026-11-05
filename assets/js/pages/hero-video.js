(function () {
  'use strict';

  var hero = document.querySelector('.hero');
  var video = document.querySelector('.hero-viz__video');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hero || !video || reduce) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        video.play().catch(function () {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.25 });
  observer.observe(hero);
})();
