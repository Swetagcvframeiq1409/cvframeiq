(function () {
  'use strict';
  var D = window.RESEARCH;
  var root = document.getElementById('rs-root');
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
  function section(id, eyebrow, title, note) {
    var s = el('section', 'rs-section reveal');
    s.id = id;
    var wrap = el('div', 'container');
    wrap.appendChild(el('p', 'rs-eyebrow', eyebrow));
    wrap.appendChild(el('h2', 'rs-h2', title));
    if (note) wrap.appendChild(el('p', 'rs-note', note));
    s.appendChild(wrap);
    return { s: s, wrap: wrap };
  }
  function cards(list, numbered) {
    var grid = el('div', 'rs-grid');
    list.forEach(function (item, i) {
      var c = el('article', 'rs-card');
      if (numbered) c.appendChild(el('span', 'rs-step', String(i + 1).padStart(2, '0')));
      c.appendChild(el('h3', 'rs-h3', item.title));
      c.appendChild(el('p', 'rs-p', item.text));
      if (!item.confirmed) c.appendChild(el('span', 'rs-tag', 'Unconfirmed'));
      grid.appendChild(c);
    });
    return grid;
  }

  // Hero
  var hero = el('section', 'rs-hero');
  var hw = el('div', 'container rs-hero__inner');
  var left = el('div', 'rs-hero__copy');
  left.appendChild(el('p', 'rs-eyebrow', 'Research · Computer vision'));
  var h1 = el('h1', 'rs-h1');
  h1.appendChild(document.createTextNode('From raw pixels to '));
  h1.appendChild(el('span', 'text-gradient', 'useful decisions'));
  left.appendChild(h1);
  left.appendChild(el('p', 'rs-lead', D.intro.summary));
  var actions = el('div', 'rs-actions');
  var a1 = el('a', 'btn btn--primary', 'Discuss a collaboration');
  a1.href = 'contact.html?topic=research';
  var a2 = el('a', 'btn btn--secondary', 'Browse AI Store');
  a2.href = 'ai-store.html';
  actions.appendChild(a1); actions.appendChild(a2);
  left.appendChild(actions);
  var right = el('div', 'rs-hero__visual');
  right.dataset.photo = 'research-hero';
  right.dataset.photoLoading = 'eager';
  var heroImage = el('img', 'rs-hero__image');
  heroImage.hidden = true;
  heroImage.alt = '';
  heroImage.width = 1600;
  heroImage.height = 900;
  right.append(heroImage);
  hw.appendChild(left); hw.appendChild(right);
  hero.appendChild(hw);
  root.appendChild(hero);
  window.initPhotos?.();

  var comparison = section('agentic-comparison', 'Conceptual comparison', 'Agentic CV vs Traditional CV', 'A discussion framework, not a claim about a specific FrameIQ product or deployment.');
  var comparisonControls = el('div', 'rs-mode-toggle');
  comparisonControls.setAttribute('role', 'group');
  comparisonControls.setAttribute('aria-label', 'Choose a conceptual computer vision approach');
  var comparisonCopy = el('p', 'rs-p rs-mode-copy');
  comparisonCopy.setAttribute('aria-live', 'polite');
  var comparisonModes = {
    traditional: 'Traditional CV workflows commonly return configured detections or classifications for a downstream review step. The exact behavior depends on the system and configuration.',
    agentic: 'An agentic CV workflow may connect visual observations to scoped reasoning or action steps. Appropriate automation, human review, and integrations must be agreed for each use case.'
  };
  ['traditional', 'agentic'].forEach(function (mode) {
    var button = el('button', 'rs-mode-button', mode === 'traditional' ? 'Traditional CV' : 'Agentic CV');
    button.type = 'button';
    button.setAttribute('aria-pressed', String(mode === 'traditional'));
    button.addEventListener('click', function () {
      comparisonControls.querySelectorAll('button').forEach(function (item) {
        item.setAttribute('aria-pressed', String(item === button));
      });
      comparisonCopy.textContent = comparisonModes[mode];
    });
    comparisonControls.appendChild(button);
  });
  comparisonCopy.textContent = comparisonModes.traditional;
  comparison.wrap.append(comparisonControls, comparisonCopy);
  root.appendChild(comparison.s);

  var architecture = section('research-architecture', 'Illustrative architecture', 'Camera to action', 'Conceptual components only. Placement, data flow, hosting, security controls, and integrations are To be confirmed.');
  var architectureGrid = el('div', 'rs-architecture');
  var architectureInfo = el('p', 'rs-note rs-architecture__info', 'Select or focus a component to read its discussion note.');
  architectureInfo.id = 'rs-architecture-info';
  [
    ['Camera', 'An image or video source selected for a scoped use case.'],
    ['Edge', 'A possible on-site compute location; availability and requirements are To be confirmed.'],
    ['Model', 'A configured vision component; model, data, and evaluation details are To be confirmed.'],
    ['Agent', 'An optional workflow component to discuss; supported behavior is To be confirmed.'],
    ['Action', 'A proposed notification or workflow outcome, subject to human review and agreement.']
  ].forEach(function (item, index) {
    var node = el('button', 'rs-architecture__node', item[0]);
    node.type = 'button';
    node.setAttribute('aria-controls', architectureInfo.id);
    node.dataset.info = item[1];
    node.addEventListener('mouseenter', function () { architectureInfo.textContent = item[1]; });
    node.addEventListener('focus', function () { architectureInfo.textContent = item[1]; });
    node.addEventListener('click', function () { architectureInfo.textContent = item[1]; });
    architectureGrid.appendChild(node);
    if (index < 4) architectureGrid.appendChild(el('span', 'rs-architecture__arrow', '→'));
  });
  architecture.wrap.append(architectureGrid, architectureInfo);
  root.appendChild(architecture.s);

  var modelCard = section('model-card-template', 'Documentation template', 'Model card', 'Template only. All fields below require project-specific confirmation.');
  var modelFields = el('dl', 'rs-model-card');
  [
    ['Model name and version', 'To be confirmed'],
    ['Intended use and exclusions', 'To be confirmed'],
    ['Input data and provenance', 'To be confirmed'],
    ['Evaluation data and method', 'To be confirmed'],
    ['Known limitations', 'To be confirmed'],
    ['Human review and escalation', 'To be confirmed']
  ].forEach(function (field) {
    modelFields.append(el('dt', '', field[0]), el('dd', '', field[1]));
  });
  modelCard.wrap.appendChild(modelFields);
  root.appendChild(modelCard.s);

  var cfg = [
    ['directions', 'Research directions', 'Areas of focus', D.pillars, false, 'These describe what we are exploring, not delivered results.'],
    ['areas', 'Application areas', 'Where this can apply', D.areas, false, ''],
    ['approach', 'Intended approach', 'How we would work with you', D.approach, true, 'Scope and timelines are confirmed on enquiry.'],
    ['differs', 'Positioning', 'How this differs', D.differs, false, '']
  ];
  cfg.forEach(function (c) {
    var items = visible(c[3]);
    if (!items.length) return;
    var s = section(c[0], c[1], c[2], c[5]);
    s.wrap.appendChild(cards(items, c[4]));
    root.appendChild(s.s);
  });

  // CTA
  var cta = el('section', 'rs-section rs-cta reveal');
  var cw = el('div', 'container rs-cta__box');
  cw.appendChild(el('p', 'rs-eyebrow', 'Talk to us'));
  cw.appendChild(el('h2', 'rs-h2', 'Have a vision problem to explore?'));
  cw.appendChild(el('p', 'rs-p', 'Share what you want to detect and where, and the FrameIQ team can review your enquiry.'));
  var ca = el('div', 'rs-actions');
  var c1 = el('a', 'btn btn--primary', 'Start a conversation'); c1.href = 'contact.html?topic=research';
  var c2 = el('a', 'btn btn--secondary', 'Browse sectors'); c2.href = 'sectors.html';
  ca.appendChild(c1); ca.appendChild(c2);
  cw.appendChild(ca);
  cw.appendChild(el('p', 'rs-note', 'Focus areas, scope and timelines are confirmed on enquiry.'));
  cta.appendChild(cw);
  root.appendChild(cta);

  var all = root.querySelectorAll('.reveal');
  Array.prototype.forEach.call(all, function (n) { n.classList.add('is-visible', 'visible', 'in-view'); });
})();
