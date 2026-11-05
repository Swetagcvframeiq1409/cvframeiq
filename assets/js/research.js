(() => {
  'use strict';
  const root = document.querySelector('#rs-research');
  if (!root) return;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const focus = [
    { title: 'Computer Vision for Manufacturing', text: 'AI-powered defect detection, production line monitoring, and quality inspection systems trained specifically for Indian manufacturing environments.', tags: ['Real-Time Visual Inspection', 'Custom Model Training'], icon: 'bi-gear-wide-connected' },
    { title: 'BeejHealth Crop AI Advisory', text: "India's AI crop health advisory. Farmers click a photo our model detects disease, nutrient deficiency, and pest issues instantly with actionable guidance.", tags: ['Disease Detection', 'Instant Diagnosis', 'Indian Crops'], icon: 'bi-flower1' },
    { title: 'Autonomous AI Vision Agents', text: "Self-learning AI systems that don't just detect they decide and act. Multi-modal agents combining vision, language, and automation for enterprise workflows.", tags: [], icon: 'bi-stars' },
    { title: 'AI Store', text: 'Ready-to-use CV models, no in-house AI team needed.', tags: [], icon: 'bi-shop' }
  ];
  const tools = ['PyTorch', 'TensorFlow', 'OpenCV', 'YOLOv8', 'Hugging Face', 'Python', 'ONNX', 'FastAPI', 'Docker', 'AWS', 'YOLOv8', 'SAM', 'Vision Transformers'];
  const hero = make('section', 'rs-band rs-hero', '');
  hero.dataset.tone = 'dark';
  const heroWrap = make('div', 'rs-wrap');
  const crumb = make('nav', 'rs-breadcrumb');
  crumb.setAttribute('aria-label', 'Breadcrumb');
  crumb.innerHTML = '<a href="../index.html">Home</a><span>/</span><a href="blog.html">Resources</a><span>/</span><span>Research</span>';
  heroWrap.append(crumb, make('p', 'rs-eyebrow', 'Resources'), make('h1', 'rs-h1', 'Research'), make('p', 'rs-lead', "Explore FrameIQ's computer vision research focus areas."));
 hero.appendChild(heroWrap); root.appendChild(hero);
  const focusBand = make('section', 'rs-band', ''); focusBand.dataset.tone = 'light';
  const focusWrap = make('div', 'rs-wrap rsr-focus');
  const nav = make('nav', 'rsr-focus-nav'); nav.setAttribute('aria-label', 'Research focus areas');
  const cards = make('div', 'rsr-focus-cards');
  focus.forEach((item, index) => {
    const id = `rsr-focus-${index + 1}`;
    const link = make('a', index === 0 ? 'is-active' : '', item.title); link.href = `#${id}`; nav.appendChild(link);
    const card = make('article', 'rs-card rsr-focus-card rs-reveal'); card.id = id; card.dataset.rsrFocus = '';
    const icon = make('div', 'rsr-focus-icon'); icon.appendChild(make('i', `bi ${item.icon}`)); icon.firstChild.setAttribute('aria-hidden', 'true');
    const body = make('div', ''); body.append(make('h3', '', item.title), make('p', '', item.text));
    const tags = make('div', 'rsr-tags'); item.tags.forEach((tag) => tags.appendChild(make('span', 'rs-chip', tag))); body.appendChild(tags);
    card.append(icon, body); cards.appendChild(card);
  });
  focusWrap.append(nav, cards); focusBand.appendChild(focusWrap); root.appendChild(focusBand);
  const pillarsBand = make('section', 'rs-band', ''); pillarsBand.dataset.tone = 'light';
  const pillarsWrap = make('div', 'rs-wrap');
  pillarsWrap.append(make('p', 'rs-eyebrow', 'Four pillars'), make('h2', 'rs-h2', 'One engineering standard across every focus area'));
  const pillarGrid = make('div', 'rs-grid rsr-pillar-grid');
  const pillarsData = (window.FEATURES && Array.isArray(window.FEATURES.pillars) ? window.FEATURES.pillars : []);
  pillarsData.forEach((pillar) => {
    const card = make('article', 'rs-card rsr-pillar rs-reveal'); card.append(make('h3', '', pillar.title), make('p', '', pillar.summary));
    const list = make('ul', 'rsr-pillar-list');
    (pillar.useCases && pillar.useCases.length ? pillar.useCases : ['Draft \u2014 pending content']).forEach((useCase) => {
      const li = make('li', '', '');
      const icon = make('i', 'bi bi-check2'); icon.setAttribute('aria-hidden', 'true');
      li.append(icon, document.createTextNode(' ' + useCase));
      list.appendChild(li);
    });
    card.appendChild(list); pillarGrid.appendChild(card);
  });
  pillarsWrap.appendChild(pillarGrid); pillarsBand.appendChild(pillarsWrap); root.appendChild(pillarsBand);
  const processBand = make('section', 'rs-band', ''); processBand.dataset.tone = 'dark';
  const processWrap = make('div', 'rs-wrap');
  processWrap.append(make('p', 'rs-eyebrow', 'Our Process'), make('h2', 'rs-h2', 'How a vision project runs'));
  const process = make('div', 'rsr-process');
  const processSteps = window.COMPANY_PAGE_DATA && Array.isArray(window.COMPANY_PAGE_DATA.process) ? window.COMPANY_PAGE_DATA.process : [];
  processSteps.forEach((item, index) => {
    const step = make('article', 'rsr-step rs-reveal');
    step.append(make('b', '', String(index + 1).padStart(2, '0')), make('h3', '', item.title), make('p', '', item.description || 'Draft \u2014 pending content'));
    process.appendChild(step);
  });
  processWrap.appendChild(process);
  processBand.appendChild(processWrap); root.appendChild(processBand);
  const toolBand = make('section', 'rs-band', ''); toolBand.dataset.tone = 'light';
  const toolWrap = make('div', 'rs-wrap'); toolWrap.append(make('p', 'rs-eyebrow', 'Tooling'), make('h2', 'rs-h2', 'Built on open tooling'));
  const marquee = make('div', 'rsr-marquee'); const toolList = make('div', 'rsr-tools'); tools.forEach((tool) => toolList.appendChild(make('span', 'rsr-tool', tool))); marquee.appendChild(toolList); toolWrap.appendChild(marquee); toolBand.appendChild(toolWrap); root.appendChild(toolBand);
  if (window.SITE_FLAGS?.SHOW_DRAFTS) {
    const publications = make('section', 'rs-band', ''); publications.dataset.tone = 'light';
    const pubWrap = make('div', 'rs-wrap'); pubWrap.append(make('p', 'rs-eyebrow', 'Publications'), make('h2', 'rs-h2', 'Research publications'));
    const publication = make('article', 'rs-card rsr-publication');
    publication.append(make('p', 'rs-status', 'Draft — pending content'), make('p', '', 'Publications will be listed here once approved.'));
    pubWrap.appendChild(publication); publications.appendChild(pubWrap); root.appendChild(publications);
  }
  const cta = make('section', 'rs-band rs-cta', ''); cta.dataset.tone = 'dark'; const ctaWrap = make('div', 'rs-wrap'); ctaWrap.append(make('h2', 'rs-h2', 'Ready to Deploy AI That Actually Works?'), make('p', '', "Book a free 30-min strategy call. We'll review your use case, show you a live demo, and give you an honest timeline + cost estimate no fluff.")); const actions = make('div', 'rs-actions'); const start = make('a', 'rs-button', 'Start a Project'); start.href = 'contact.html'; const solutions = make('a', 'rs-button rs-button--secondary', 'Explore Solutions'); solutions.href = 'sectors.html'; actions.append(start, solutions); ctaWrap.appendChild(actions); cta.appendChild(ctaWrap); root.appendChild(cta);
  RS.scrollSpy({ links: nav.querySelectorAll('a'), targets: cards.querySelectorAll('[data-rsr-focus]') });
  RS.reveal();
})();
