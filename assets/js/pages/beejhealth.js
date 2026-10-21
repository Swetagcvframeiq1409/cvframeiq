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
    return (list || []).filter(function (i) { return i.confirmed || D.SHOW_UNCONFIRMED; });
  }
  function tag(node, item) {
    if (!item.confirmed) node.appendChild(el('span', 'bh-tag bh-tag--unconfirmed', 'Unconfirmed'));
  }
  function section(id, eyebrow, title, note) {
    var s = el('section', 'bh-section reveal');
    s.id = id;
    var wrap = el('div', 'container');
    wrap.appendChild(el('p', 'bh-eyebrow', eyebrow));
    wrap.appendChild(el('h2', 'bh-h2', title));
    if (note) wrap.appendChild(el('p', 'bh-note', note));
    s.appendChild(wrap);
    return { s: s, wrap: wrap };
  }
  function cards(list, numbered) {
    var grid = el('div', 'bh-grid');
    list.forEach(function (item, i) {
      var c = el('article', 'bh-card');
      if (numbered) c.appendChild(el('span', 'bh-step', String(i + 1).padStart(2, '0')));
      c.appendChild(el('h3', 'bh-h3', item.title));
      c.appendChild(el('p', 'bh-p', item.text));
      tag(c, item);
      grid.appendChild(c);
    });
    return grid;
  }

  var hero = el('section', 'bh-hero');
  var hw = el('div', 'container bh-hero__inner');
  var left = el('div', 'bh-hero__copy');
  left.appendChild(el('p', 'bh-eyebrow', 'BeejHealth · Agriculture'));
  var h1 = el('h1', 'bh-h1');
  h1.appendChild(document.createTextNode('Computer vision for '));
  h1.appendChild(el('span', 'text-gradient', 'crop health'));
  left.appendChild(h1);
  left.appendChild(el('p', 'bh-lead', D.intro.summary));
  var actions = el('div', 'bh-actions');
  var a1 = el('a', 'btn btn--primary', 'Enquire');
  a1.href = 'contact.html?sector=agriculture&product=crop-disease-detection';
  var a2 = el('a', 'btn btn--secondary', 'Try the demo scene');
  a2.href = 'playground.html#crop';
  actions.appendChild(a1); actions.appendChild(a2);
  left.appendChild(actions);
  left.appendChild(el('p', 'bh-note', 'Playground uses demo data.'));
  var right = el('div', 'bh-hero__visual');
  right.dataset.photo = 'beejhealth-hero';
  right.dataset.photoLoading = 'eager';
  var heroImage = el('img', 'bh-hero__image');
  heroImage.hidden = true;
  heroImage.alt = '';
  heroImage.width = 1600;
  heroImage.height = 900;
  right.append(heroImage);
  hw.appendChild(left); hw.appendChild(right);
  hero.appendChild(hw);
  root.appendChild(hero);
  window.initPhotos?.();

  var wf = visible(D.workflow);
  if (wf.length) {
    var s1 = section('workflow', 'Intended workflow', 'How it is intended to work');
    s1.wrap.appendChild(cards(wf, true));
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
    s.wrap.appendChild(cards(items, false));
    root.appendChild(s.s);
  });

  var rel = section('related', 'Related', 'Related pages');
  var rg = el('div', 'bh-grid');
  var products = (window.AI_PRODUCTS || []).filter(function (p) { return /crop/i.test(p.name); });
  products.forEach(function (p) {
    var c = el('article', 'bh-card');
    c.appendChild(el('h3', 'bh-h3', p.name));
    c.appendChild(el('p', 'bh-p', p.summary));
    var l = el('a', 'bh-link', 'View in AI Store \u2192');
    l.href = 'ai-store.html#' + String(p.category || '').toLowerCase();
    c.appendChild(l);
    rg.appendChild(c);
  });
  var sc = el('article', 'bh-card');
  sc.appendChild(el('h3', 'bh-h3', 'Agriculture sector'));
  sc.appendChild(el('p', 'bh-p', 'See computer vision use cases for agriculture.'));
  var sl = el('a', 'bh-link', 'Explore the sector \u2192');
  sl.href = 'sectors/agriculture.html';
  sc.appendChild(sl);
  rg.appendChild(sc);
  rel.wrap.appendChild(rg);
  root.appendChild(rel.s);

  var cta = el('section', 'bh-section bh-cta reveal');
  var cw = el('div', 'container bh-cta__box');
  cw.appendChild(el('p', 'bh-eyebrow', 'Talk to us'));
  cw.appendChild(el('h2', 'bh-h2', 'Working in agriculture?'));
  cw.appendChild(el('p', 'bh-p', 'Tell us about your crops, fields and goals and the FrameIQ team can review your enquiry.'));
  var ca = el('div', 'bh-actions');
  var c1 = el('a', 'btn btn--primary', 'Start a project'); c1.href = 'contact.html?sector=agriculture';
  var c2 = el('a', 'btn btn--secondary', 'Browse sectors'); c2.href = 'sectors.html';
  ca.appendChild(c1); ca.appendChild(c2);
  cw.appendChild(ca);
  cw.appendChild(el('p', 'bh-note', 'Features, availability and timelines are confirmed on enquiry.'));
  cta.appendChild(cw);
  root.appendChild(cta);

  // reveal items added after load
  var all = root.querySelectorAll('.reveal');
  Array.prototype.forEach.call(all, function (n) { n.classList.add('is-visible', 'visible', 'in-view'); });
})();
