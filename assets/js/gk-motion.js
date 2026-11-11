// gk-motion.js - progress bar, pointer spotlight, marquee clone, parallax, and heading underline.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealFallback() {
    document.querySelectorAll('.gk-r, .gk-reveal, [data-reveal], .ab-reveal').forEach(function (el) {
      el.classList.add('is-in');
    });
  }

  window.addEventListener('load', function () {
    window.setTimeout(revealFallback, 1200);
  }, { once: true });

  var bar = document.createElement('div');
  bar.className = 'gk-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  function prog() {
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  }
  addEventListener('scroll', prog, { passive: true });
  prog();

  if (reduce) return;

  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.gk-card, .gk-metric');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  function cloneMarquees() {
    document.querySelectorAll('.gk-marquee__track').forEach(function (t) {
      if (t.getAttribute('data-cloned')) return;
      Array.prototype.slice.call(t.children).forEach(function (n) {
        var c = n.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        t.appendChild(c);
      });
      t.setAttribute('data-cloned', '1');
    });
  }
  document.addEventListener('DOMContentLoaded', cloneMarquees);
  window.addEventListener('load', function () {
    cloneMarquees();
    window.setTimeout(cloneMarquees, 800);
  });

  var px = document.querySelectorAll('[data-gk-parallax]');
  if (px.length) {
    var ticking = false;
    function par() {
      px.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        var k = parseFloat(el.getAttribute('data-gk-parallax')) || 0.08;
        el.style.transform = 'translateY(' + ((r.top + r.height / 2 - innerHeight / 2) * -k).toFixed(1) + 'px)';
      });
      ticking = false;
    }
    addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(par);
      }
    }, { passive: true });
    par();
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('gk-seen');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll('.gk-band h2').forEach(function (h) {
      io.observe(h);
    });
  }

})();
