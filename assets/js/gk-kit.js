// gk-kit.js - wires tabs, accordions, journeys, counters, and sub-nav links.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealTargets = document.querySelectorAll('.gk-reveal, .gk-r, [data-reveal], .ab-reveal');
  if (revealTargets.length) {
    var revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 }) : null;

    revealTargets.forEach(function (el, index) {
      el.style.setProperty('--gk-d', (index * 60) + 'ms');
      if (reduce) {
        el.classList.add('is-in');
        return;
      }
      if (revealObserver) {
        revealObserver.observe(el);
        return;
      }
      if (el.getBoundingClientRect().top < window.innerHeight * 1.2) {
        el.classList.add('is-in');
      }
    });

    window.addEventListener('load', function () {
      window.setTimeout(function () {
        revealTargets.forEach(function (el) {
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight * 1.2 && rect.bottom > -40) {
            el.classList.add('is-in');
          }
        });
      }, 1200);
    }, { once: true });
  }

  document.querySelectorAll('[data-gk-tabs]').forEach(function (box) {
    var btns = box.querySelectorAll('.gk-tabs__bar button');
    var panels = box.querySelectorAll('.gk-tabs__panel');
    function show(i) {
      btns.forEach(function (b, n) {
        b.setAttribute('aria-selected', String(n === i));
        b.setAttribute('tabindex', n === i ? '0' : '-1');
      });
      panels.forEach(function (p, n) { p.classList.toggle('is-on', n === i); });
    }
    btns.forEach(function (b, n) {
      b.addEventListener('click', function () { show(n); });
    });
    var prev = box.querySelector('[data-gk-prev]');
    var next = box.querySelector('[data-gk-next]');
    function cur() {
      for (var i = 0; i < btns.length; i++) {
        if (btns[i].getAttribute('aria-selected') === 'true') return i;
      }
      return 0;
    }
    if (prev) prev.addEventListener('click', function () { show((cur() + btns.length - 1) % btns.length); });
    if (next) next.addEventListener('click', function () { show((cur() + 1) % btns.length); });
    show(0);

    function openHashTarget() {
      var id = location.hash ? location.hash.slice(1) : '';
      if (!id) return;
      panels.forEach(function (panel, index) {
        var target = document.getElementById(id);
        if (target && panel.contains(target)) {
          show(index);
          window.setTimeout(function () {
            var header = document.querySelector('.site-header');
            var offset = header ? header.getBoundingClientRect().height : 0;
            window.scrollTo({ top: window.scrollY + target.getBoundingClientRect().top - offset - 16, behavior: reduce ? 'auto' : 'smooth' });
          }, 0);
        }
      });
    }
    window.addEventListener('hashchange', openHashTarget);
    openHashTarget();
  });

  document.querySelectorAll('[data-gk-acc]').forEach(function (acc) {
    var items = acc.querySelectorAll('.gk-acc__item');
    items.forEach(function (it) {
      var q = it.querySelector('.gk-acc__q');
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', function () {
        var open = it.classList.contains('is-open');
        items.forEach(function (o) {
          o.classList.remove('is-open');
          o.querySelector('.gk-acc__q').setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          it.classList.add('is-open');
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
    if (items[0]) {
      items[0].classList.add('is-open');
      items[0].querySelector('.gk-acc__q').setAttribute('aria-expanded', 'true');
    }
  });

  document.querySelectorAll('[data-gk-journey]').forEach(function (j) {
    var steps = j.querySelectorAll('.gk-step');
    var nums = j.querySelector('.gk-journey__nums');
    if (nums && !nums.children.length) {
      steps.forEach(function (s, i) {
        var n = document.createElement('span');
        n.textContent = String(i + 1).padStart(2, '0');
        nums.appendChild(n);
      });
    }
    if (!('IntersectionObserver' in window)) {
      steps.forEach(function (s) { s.classList.add('is-on'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var idx = Array.prototype.indexOf.call(steps, entry.target);
        steps.forEach(function (s, i) { s.classList.toggle('is-on', i === idx); });
        if (nums) Array.prototype.forEach.call(nums.children, function (n, i) { n.classList.toggle('is-on', i === idx); });
      });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach(function (s) { io.observe(s); });
    if (steps[0]) {
      steps[0].classList.add('is-on');
      if (nums && nums.children[0]) nums.children[0].classList.add('is-on');
    }
  });

  var counters = document.querySelectorAll('[data-gk-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduce) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        counterObserver.unobserve(entry.target);
        var el = entry.target;
        var end = parseFloat(el.getAttribute('data-gk-count'));
        var prefix = el.getAttribute('data-prefix') || '';
        var suffix = el.getAttribute('data-suffix') || '';
        var decimals = (String(end).split('.')[1] || '').length;
        var start = performance.now();
        (function tick(now) {
          var progress = Math.min((now - start) / 1100, 1);
          var value = end * (1 - Math.pow(1 - progress, 3));
          el.textContent = prefix + value.toFixed(decimals) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        })(start);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (counter) { counterObserver.observe(counter); });
  }

  document.querySelectorAll('.gk-subnav a').forEach(function (a) {
    if (a.getAttribute('href') && a.pathname === location.pathname) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
