// blog-v2.js - editorial blog page: featured story, popular list, topic chips, search and an uneven article grid.
// It only READS the existing article data. It never writes new article text.
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) read the posts from the existing data file, whatever the field names are
  // Source variable is window.FRAMEIQ_BLOG_POSTS (assets/data/blog-posts.js).
  function getPosts() {
    var src = window.FRAMEIQ_BLOG_POSTS || [];
    if (!Array.isArray(src)) src = Object.keys(src).map(function (k) { return src[k]; });
    return src.map(function (p, i) {
      return {
        title: p.title || p.name || '',
        category: p.category || p.topic || p.tag || 'Insight',
        excerpt: p.summary || p.excerpt || p.description || '',
        image: p.image || p.cover || p.img || '',
        read: p.readTime || p.read_time || p.minutes || p.read || '',
        slug: p.slug || p.id || String(i),
        href: 'blog-article.html?slug=' + encodeURIComponent(p.slug || p.id || i),
        index: i
      };
    }).filter(function (p) { return p.title; });
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function readText(p) { return p.read ? (/min/i.test(p.read) ? p.read : p.read + ' min read') : ''; }

  // 2) the picture of an article: the real image if there is one, otherwise a camera-frame composition made with CSS
  function art(p) {
    var v = 'v' + (p.index % 3);
    if (p.image) return '<div class="bl-art"><img src="' + esc(p.image) + '" alt="" loading="lazy" decoding="async" width="1200" height="750"></div>';
    return '<div class="bl-art bl-art--frame ' + v + '" aria-hidden="true"><span class="bl-box b1"></span><span class="bl-box b2"></span><span class="bl-box b3"></span><span class="bl-scan"></span></div>';
  }

  var posts = getPosts();
  var state = { topic: 'All', q: '' };
  var el = {
    featured: document.getElementById('bl-featured'),
    popular: document.getElementById('bl-popular'),
    topics: document.getElementById('bl-topics'),
    search: document.getElementById('bl-search'),
    grid: document.getElementById('bl-grid'),
    count: document.getElementById('bl-count')
  };
  if (!posts.length || !el.grid) return;
  // 3) featured story
  if (el.featured) {
    var f = posts[0];
    el.featured.innerHTML =
      '<a class="bl-feature reveal-up" href="' + esc(f.href) + '">' + art(f) +
      '<div class="bl-feature__text"><span class="bl-tag">' + esc(f.category) + '</span>' +
      '<h2>' + esc(f.title) + '</h2><p>' + esc(f.excerpt) + '</p>' +
      '<span class="bl-meta">' + esc(readText(f)) + '</span><span class="bl-more">Read article <i aria-hidden="true">&rarr;</i></span></div></a>';
  }

  // 4) popular list (numbered rows)
  if (el.popular) {
    el.popular.innerHTML = posts.slice(0, 5).map(function (p, i) {
      return '<li><a class="bl-row" href="' + esc(p.href) + '"><span class="bl-row__n">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="bl-row__t">' + esc(p.title) + '</span><span class="bl-row__m">' + esc(p.category) + (readText(p) ? ' &middot; ' + esc(readText(p)) : '') + '</span><i aria-hidden="true">&rarr;</i></a></li>';
    }).join('');
  }

  // 5) topic chips built from the categories that really exist
  var topics = ['All'];
  posts.forEach(function (p) { if (topics.indexOf(p.category) < 0) topics.push(p.category); });
  if (el.topics) {
    el.topics.innerHTML = topics.map(function (t) {
      return '<button type="button" class="bl-chip" data-topic="' + esc(t) + '" aria-pressed="' + (t === 'All') + '">' + esc(t) + '</button>';
    }).join('');
    el.topics.addEventListener('click', function (e) {
      var b = e.target.closest('.bl-chip'); if (!b) return;
      state.topic = b.getAttribute('data-topic'); render(true);
    });
  }
  if (el.search) el.search.addEventListener('input', function () { state.q = el.search.value.trim().toLowerCase(); render(true); });

  // keep ?topic= and ?q= in the address so a filtered page can be shared
  var params = new URLSearchParams(location.search);
  if (params.get('topic') && topics.indexOf(params.get('topic')) > -1) state.topic = params.get('topic');
  if (params.get('q')) { state.q = params.get('q').toLowerCase(); if (el.search) el.search.value = params.get('q'); }

  // 6) the uneven grid: every 5th card is wide, so it does not look like a template
  function render(animate) {
    var browsing = state.topic === 'All' && !state.q;
    var list = posts.filter(function (p, idx) {
      if (browsing && idx === 0 && posts.length > 3) return false; // featured story is already shown above
      var okT = state.topic === 'All' || p.category === state.topic;
      var okQ = !state.q || (p.title + ' ' + p.excerpt + ' ' + p.category).toLowerCase().indexOf(state.q) > -1;
      return okT && okQ;
    });
    if (el.topics) Array.prototype.forEach.call(el.topics.children, function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-topic') === state.topic)); });
    el.grid.innerHTML = list.length ? list.map(function (p, i) {
      var wide = (list.length > 3 && i % 5 === 0) ? ' bl-card--wide' : '';
      return '<a class="bl-card' + wide + '" href="' + esc(p.href) + '">' + art(p) +
        '<div class="bl-card__text"><span class="bl-tag">' + esc(p.category) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.excerpt) + '</p>' +
        '<span class="bl-meta">' + esc(readText(p)) + '</span></div></a>';
    }).join('') : '<p class="bl-empty">No articles match. Try another topic or word.</p>';
    if (el.count) el.count.textContent = list.length + (list.length === 1 ? ' article' : ' articles');
    if (animate && !reduce) { el.grid.classList.remove('is-swap'); void el.grid.offsetWidth; el.grid.classList.add('is-swap'); }
    var u = new URLSearchParams(); if (state.topic !== 'All') u.set('topic', state.topic); if (state.q) u.set('q', state.q);
    if (history.replaceState) history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : ''));
  }
  render(false);

  // 7) reveal on scroll
  var items = document.querySelectorAll('.reveal-up, .bl-card, .bl-row');
  if (!('IntersectionObserver' in window) || reduce) { items.forEach(function (n) { n.classList.add('is-in'); }); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }); }, { threshold: 0.12 });
  items.forEach(function (n) { io.observe(n); });
  if (el.grid) new MutationObserver(function () { document.querySelectorAll('.bl-card:not(.is-in)').forEach(function (n) { n.classList.add('is-in'); }); }).observe(el.grid, { childList: true });
})();

