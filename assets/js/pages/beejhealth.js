(function () {
  'use strict';
  var D = window.BEEJHEALTH;
  var root = document.getElementById('bh-root');
  if (!D || !root) return;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function visible(list) {
    return (list || []).filter(function (i) {
      return i.confirmed || D.SHOW_UNCONFIRMED || /\[placeholder/i.test(String(i.text || i.title || ''));
    });
  }
  function tag(node, item) {
    if (!item.confirmed) node.appendChild(el('span', 'bh-tag bh-tag--unconfirmed', 'Unconfirmed'));
  }
  function section(id, eyebrow, title, note) {
    var s = el('section', 'gk-band reveal');
    s.id = id;
    var wrap = el('div', 'gk-wrap');
    wrap.appendChild(el('p', 'gk-eyebrow', eyebrow));
    wrap.appendChild(el('h2', 'gk-head', title));
    if (note) wrap.appendChild(el('p', 'bh-note', note));
    s.appendChild(wrap);
    return { s: s, wrap: wrap };
  }
  function cards(list, numbered) {
    var grid = el('div', 'gk-cards');
    list.forEach(function (item, i) {
      var c = el('article', 'gk-card');
      if (numbered)       c.appendChild(el('span', 'gk-journey__num', String(i + 1).padStart(2, '0')));
      c.appendChild(el('h3', 'bh-h3', item.title));
      c.appendChild(el('p', 'bh-p', item.text));
      tag(c, item);
      grid.appendChild(c);
    });
    return grid;
  }

  var hero = el('header', 'gk-hero');
  var hw = el('div', 'gk-wrap');
  var left = el('div', 'bh-hero__copy');
  left.appendChild(el('p', 'gk-eyebrow', 'BeejHealth · Agriculture'));
  var h1 = el('h1', 'bh-h1');
  h1.appendChild(document.createTextNode('Beej'));
  h1.appendChild(el('b', '', 'Health'));
  left.appendChild(h1);
  left.appendChild(el('p', 'bh-lead', D.intro.summary));
  var actions = el('div', 'bh-actions');
  var a1 = el('a', 'gk-btn', 'Enquire');
  a1.href = 'contact.html?sector=agriculture&product=crop-disease-detection';
  var a2 = el('a', 'gk-btn gk-btn--ghost', 'Try the demo scene');
  a2.href = 'playground.html#crop';
  actions.appendChild(a1); actions.appendChild(a2);
  left.appendChild(actions);
  left.appendChild(el('p', 'bh-note', 'Playground uses demo data.'));
  var right = el('div', 'gk-art product-camera-art');
  right.setAttribute('aria-hidden', 'true');
  right.appendChild(el('span')); right.appendChild(el('span')); right.appendChild(el('span'));
  hw.appendChild(left); hw.appendChild(right);
  hero.appendChild(hw);
  root.appendChild(hero);

  var problem = section('problem', 'Product concept', 'Problem to explore');
  var problemCopy = el('p', 'bh-lead', D.intro.summary);
  problem.wrap.appendChild(problemCopy);
  root.appendChild(problem.s);

  var wf = visible(D.workflow);
  if (wf.length) {
    var s1 = section('workflow', 'How it could work', 'Discussion workflow');
    s1.s.className = 'gk-band gk-band--dark reveal';
    var journey = el('div', 'gk-journey');
    journey.dataset.gkJourney = '';
    var nums = el('div', 'gk-journey__nums');
    var content = el('div', '');
    wf.forEach(function (item, i) {
      var step = el('div', 'gk-step');
      var num = el('span', 'gk-journey__num', String(i + 1).padStart(2, '0'));
      num.dataset.step = String(i);
      nums.appendChild(num);
      step.appendChild(el('h3', 'bh-h3', item.title));
      step.appendChild(el('p', 'bh-p', item.text));
      tag(step, item);
      content.appendChild(step);
    });
    journey.insertBefore(nums, journey.firstChild);
    journey.appendChild(content);
    var art = el('div', 'gk-art product-camera-art');
    art.setAttribute('aria-hidden', 'true');
    art.appendChild(el('span')); art.appendChild(el('span')); art.appendChild(el('span'));
    journey.appendChild(art);
    s1.wrap.appendChild(journey);
    root.appendChild(s1.s);
  }

  [
    ['focus', 'Focus areas', 'Where it can apply', D.focusAreas],
    ['crops', 'Crops', 'Supported crops', D.crops],
    ['platform', 'Platform', 'Platform features', D.platformFeatures],
    ['technology', 'Technology', 'Technology', D.technology],
    ['roadmap', 'Roadmap', 'Roadmap (indicative, subject to change)', D.roadmap]
  ].forEach(function (cfg) {
    var items = visible(cfg[3]);
    if (!items.length) return;
    var s = section(cfg[0], cfg[1], cfg[2]);
    if (cfg[0] === 'technology' || cfg[0] === 'roadmap') s.s.className = 'gk-band gk-band--dark reveal';
    s.wrap.appendChild(cards(items, false));
    root.appendChild(s.s);
  });

  var rel = section('related', 'Related', 'Related pages');
  var rg = el('div', 'gk-cards');
  var products = (window.AI_PRODUCTS || []).filter(function (p) { return /crop/i.test(p.name); });
  products.forEach(function (p) {
    var c = el('article', 'gk-card');
    c.appendChild(el('h3', 'bh-h3', p.name));
    c.appendChild(el('p', 'bh-p', p.summary));
    var l = el('a', 'bh-link', 'View in AI Store \u2192');
    l.href = 'ai-store.html#' + String(p.category || '').toLowerCase();
    c.appendChild(l);
    rg.appendChild(c);
  });
  var sc = el('article', 'gk-card');
  sc.appendChild(el('h3', 'bh-h3', 'Agriculture sector'));
  sc.appendChild(el('p', 'bh-p', 'See computer vision use cases for agriculture.'));
  var sl = el('a', 'bh-link', 'Explore the sector \u2192');
  sl.href = 'sectors/agriculture.html';
  sc.appendChild(sl);
  rg.appendChild(sc);
  rel.wrap.appendChild(rg);
  root.appendChild(rel.s);

  var cta = el('section', 'gk-band gk-band--dark reveal');
  var cw = el('div', 'gk-wrap gk-cta');
  cw.appendChild(el('p', 'gk-eyebrow', 'Discuss your use case'));
  cw.appendChild(el('h2', 'bh-h2', 'Working in agriculture?'));
  cw.appendChild(el('p', 'bh-p', 'Tell us about your crops, fields and goals and the FrameIQ team can review your enquiry.'));
  var ca = el('div', 'bh-actions');
  var c1 = el('a', 'gk-btn', 'Start a project'); c1.href = 'contact.html?sector=agriculture';
  var c2 = el('a', 'gk-btn gk-btn--ghost', 'Browse sectors'); c2.href = 'sectors.html';
  ca.appendChild(c1); ca.appendChild(c2);
  cw.appendChild(ca);
  cw.appendChild(el('p', 'bh-note', 'Features, availability and timelines are confirmed on enquiry.'));
  cta.appendChild(cw);
  root.appendChild(cta);

  // reveal items added after load
  var all = root.querySelectorAll('.reveal');
  Array.prototype.forEach.call(all, function (n) { n.classList.add('is-visible', 'visible', 'in-view'); });
})();
