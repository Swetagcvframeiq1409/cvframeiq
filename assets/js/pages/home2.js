// home2.js - section dots on the right edge of the Home page.
// Reads the real headings of the sections, so no new text is added.
(function () {
  var main = document.getElementById('main-content');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!main || window.innerWidth < 1100) return;

  var items = [];
  main.querySelectorAll(':scope > section[id]').forEach(function (s) {
    var h = s.querySelector('h1, h2');
    if (!h || !h.textContent.trim()) return;
    items.push({ section: s, label: h.textContent.replace(/\s+/g, ' ').trim() });
  });
  if (items.length < 4) return;

  var nav = document.createElement('nav');
  nav.className = 'home-dots';
  nav.setAttribute('aria-label', 'Page sections');
  var list = document.createElement('ul');
  items.forEach(function (it) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = '#' + it.section.id;
    a.setAttribute('aria-label', it.label);
    a.innerHTML = '<span class="home-dots__label"></span><span class="home-dots__dot"></span>';
    a.firstChild.textContent = it.label;
    a.addEventListener('click', function (e) {
      e.preventDefault();
      var y = it.section.getBoundingClientRect().top + window.pageYOffset - 70;
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    });
    li.appendChild(a); list.appendChild(li); it.link = a;
  });
  nav.appendChild(list);
  document.body.appendChild(nav);

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      items.forEach(function (it) {
        var on = it.section === en.target;
        it.link.classList.toggle('is-active', on);
        if (on) it.link.setAttribute('aria-current', 'true'); else it.link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  items.forEach(function (it) { io.observe(it.section); });

})();