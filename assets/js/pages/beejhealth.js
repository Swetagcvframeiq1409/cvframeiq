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
  var hero = el('header', 'gk-band gk-band--dark gk-hero');
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

  var capabilityGroups = [
    ['Focus areas', 'Where it can apply', D.focusAreas],
    ['Crops', 'Supported crops', D.crops],
    ['Platform', 'Platform features', D.platformFeatures],
    ['Technology', 'Technology', D.technology],
    ['Roadmap', 'Roadmap (indicative, subject to change)', D.roadmap]
  ].map(function (group) {
    return { label: group[1], items: visible(group[2]) };
  }).filter(function (group) {
    return group.items.length > 0;
  });

  if (capabilityGroups.length) {
    var capabilities = section('capabilities', 'Capabilities', 'Platform features');
    var tabs = el('div', 'gk-tabs');
    tabs.dataset.gkTabs = '';
    var tabBar = el('div', 'gk-tabs__bar');
    tabBar.setAttribute('role', 'tablist');
    tabBar.setAttribute('aria-label', 'BeejHealth capabilities');
    capabilityGroups.forEach(function (group, i) {
      var tabId = 'bh-capability-tab-' + i;
      var panelId = 'bh-capability-panel-' + i;
      var button = el('button', '', group.label);
      button.type = 'button';
      button.id = tabId;
      button.setAttribute('role', 'tab');
      button.setAttribute('aria-controls', panelId);
      button.setAttribute('aria-selected', String(i === 0));
      tabBar.appendChild(button);

      var panel = el('div', 'gk-tabs__panel' + (i === 0 ? ' is-on' : ''));
      panel.id = panelId;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabId);
      var copy = el('div', 'bh-tab-copy');
      group.items.forEach(function (item) {
        copy.appendChild(el('h3', 'bh-h3', item.title));
        copy.appendChild(el('p', 'bh-p', item.text));
        tag(copy, item);
      });
      var art = el('div', 'gk-art product-camera-art');
      art.setAttribute('aria-hidden', 'true');
      art.appendChild(el('span')); art.appendChild(el('span')); art.appendChild(el('span'));
      panel.append(copy, art);
      tabs.appendChild(panel);
    });
    tabs.insertBefore(tabBar, tabs.firstChild);
    capabilities.wrap.appendChild(tabs);
    root.appendChild(capabilities.s);
  }

  var wf = visible(D.workflow);
  if (wf.length) {
    var s1 = section('workflow', 'How it could work', 'Discussion workflow');
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

  var rel = section('problem', 'Product concept', 'Problem to explore');
  rel.wrap.appendChild(el('p', 'bh-lead', D.intro.summary));
  rel.wrap.appendChild(el('p', 'gk-eyebrow', 'Related'));
  rel.wrap.appendChild(el('h3', 'bh-h3', 'Related pages'));
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

  var faqs = (window.FAQ_DATA || []).filter(function (item) {
    return item.question === 'What is BeejHealth?' && item.answer;
  });
  if (faqs.length) {
    var faq = section('faq', 'Frequently asked questions', 'Common questions');
    var accordion = el('div', 'gk-acc');
    accordion.dataset.gkAcc = '';
    faqs.forEach(function (item) {
      var entry = el('div', 'gk-acc__item');
      var question = el('button', 'gk-acc__q', item.question);
      question.type = 'button';
      var answer = el('div', 'gk-acc__a');
      var answerContent = el('div');
      answerContent.appendChild(el('p', 'bh-p', item.answer));
      answer.appendChild(answerContent);
      entry.append(question, answer);
      accordion.appendChild(entry);
    });
    faq.wrap.appendChild(accordion);
    root.appendChild(faq.s);
  }

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
