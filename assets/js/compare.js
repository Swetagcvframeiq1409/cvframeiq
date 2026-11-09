(() => {
  'use strict';
  const root = document.querySelector('#rsc-root');
  const data = window.FRAMEIQ_COMPARE;
  if (!root || !data) return;
  const make = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text !== undefined) node.textContent = text; return node; };
  const lnk = (href, text) => { const node = make('a', '', text); node.href = href; return node; };

  /* ── Hero: compact two-column from 992px, max 460px tall ── */
  const hero = make('section', 'res-hero rs-band gk-band gk-band--dark gk-hero rs-hero rsc-hero-band');
  hero.dataset.tone = 'dark';
  const heroWrap = make('div', 'rs-wrap rsc-hero-wrap');

  const heroText = make('div', '');
  const crumb = make('nav', 'rs-breadcrumb'); crumb.setAttribute('aria-label', 'Breadcrumb');
  crumb.append(lnk('../index.html', 'Home'), make('span', '', '/'), lnk('blog.html', 'Resources'), make('span', '', '/'), make('span', '', 'Compare approaches'));
  heroText.append(crumb, make('p', 'rs-eyebrow', 'Resources'), make('h1', 'rs-h1', 'Compare approaches'), make('p', 'rs-lead', 'Neutral questions for comparing video analytics and edge or cloud deployment.'));

  /* Hero image: edge-and-cloudai.webp 1200x800 54KB */
  const heroFig = document.createElement('figure');
  heroFig.className = 'rsc-hero-fig';
  heroFig.setAttribute('aria-hidden', 'true');
  const heroImg = document.createElement('img');
  heroImg.src = '../assets/img/edge-and-cloudai.webp';
  heroImg.alt = '';
  heroImg.width = 1200;
  heroImg.height = 800;
  heroImg.decoding = 'async';
  heroImg.className = 'rsc-hero-fig__img';
  heroImg.onerror = function () { this.dataset.failed = 'true'; };
  heroFig.appendChild(heroImg);

  heroWrap.append(heroText, heroFig);
  hero.appendChild(heroWrap);
  root.appendChild(hero);

  /* ── Guide band ── */
  const guideBand = make('section', 'rs-band gk-band'); guideBand.dataset.tone = 'light';
  const guideWrap = make('div', 'rs-wrap rs-guide');
  const reviewStatus = make('span', 'rs-status');
  reviewStatus.dataset.status = 'for-review';
  reviewStatus.setAttribute('aria-label', 'For review');
  guideWrap.append(make('p', 'rs-eyebrow', 'Question guide'), make('h2', 'rs-h2', 'Start with your operating context'), reviewStatus);
  const guideCard = make('div', 'rs-card gk-card rsc-guide-card');
  const top = make('div', 'rsc-guide-top');
  const progressText = make('span', 'rs-count');
  const progress = make('div', 'rsc-progress');
  const fill = make('span');
  progress.appendChild(fill); top.append(progressText); guideCard.appendChild(top); guideCard.appendChild(progress);
  const question = make('h3', 'rsc-question');
  const options = make('div', 'rsc-options');
  const guideActions = make('div', 'rsc-actions');
  const back = make('button', 'rs-button rs-button--secondary', 'Back'); back.type = 'button';
  const next = make('button', 'rs-button', 'Next'); next.type = 'button';
  const skip = make('button', 'rs-chip', 'Skip'); skip.type = 'button';
  guideActions.append(back, skip, next);
  guideCard.append(question, options, guideActions);
  guideWrap.appendChild(guideCard); guideBand.appendChild(guideWrap); root.appendChild(guideBand);

  /* ── Table band ── */
  const tableBand = make('section', 'rs-band gk-band gk-band--dark'); tableBand.dataset.tone = 'dark';
  const tableWrap = make('div', 'rs-wrap');
  tableWrap.append(make('p', 'rs-eyebrow', 'Comparison'), make('h2', 'rs-h2', 'Edge and cloud'), make('p', 'rs-lead', 'Neutral comparison rows for discussion, not a recommendation.'));
  const tableOuter = make('div', 'rsc-table-wrap');
  const table = make('table', 'rsc-table');
  const thead = make('thead');
  const headRow = make('tr');
  ['Comparison point', 'Edge', 'Cloud'].forEach((label) => {
    const heading = make('th', '', label); heading.scope = 'col'; headRow.appendChild(heading);
  });
  thead.appendChild(headRow); table.appendChild(thead);
  const tbody = make('tbody');
  data.rows.forEach(([label, edge, cloud]) => {
    const row = make('tr'); row.dataset.row = label;
    const labelCell = make('th'); labelCell.scope = 'row';
    const rowLabel = make('div', 'rsc-row-label');
    const status = make('span', 'rs-status'); status.dataset.status = 'for-review'; status.setAttribute('aria-label', 'For review');
    rowLabel.append(make('span', '', label), status); labelCell.appendChild(rowLabel);
    row.append(labelCell, make('td', '', edge), make('td', '', cloud));
    tbody.appendChild(row);
  });
  table.appendChild(tbody); tableOuter.appendChild(table); tableWrap.appendChild(tableOuter); tableBand.appendChild(tableWrap); root.appendChild(tableBand);

  /* ── Further reading ── */
  const reading = make('section', 'rs-band gk-band'); reading.dataset.tone = 'light';
  const readingWrap = make('div', 'rs-wrap');
  readingWrap.append(make('p', 'rs-eyebrow', 'Further reading'), make('h2', 'rs-h2', 'Keep exploring'));
  const readingGrid = make('div', 'rsc-reading gk-cards');
  [
    ['Edge vs Cloud Video Analytics', 'Read the related blog post.', 'blog-article.html?slug=edge-vs-cloud-video-analytics'],
    ['Edge deployment', 'See the glossary definition.', 'glossary.html#edge-deployment'],
    ['Cloud deployment', 'Review the glossary definition.', 'glossary.html#cloud-deployment'],
    ['Latency', 'Review the glossary definition.', 'glossary.html#latency']
  ].forEach(([title, text, href]) => {
    const card = make('article', 'rs-card gk-card rs-reveal');
    card.append(make('h3', '', title), make('p', '', text), lnk(href, 'Read more'));
    readingGrid.appendChild(card);
  });
  readingWrap.appendChild(readingGrid); reading.appendChild(readingWrap); root.appendChild(reading);

  /* ── Keep exploring ── */
  const keepExploring = make('section', 'res-keep-exploring');
  const keepGrid = make('div', 'res-keep-exploring__grid');
  [
    { label: 'Blog', href: 'blog.html', description: 'Explore FrameIQ insights on AI, computer vision, smart cities, agriculture.', icon: 'bi-book' },
    { label: 'Research', href: 'research.html', description: "Explore FrameIQ's computer vision research focus areas.", icon: 'bi-search' },
    { label: 'Glossary', href: 'glossary.html', description: 'Plain-language explanations of common computer-vision and deployment terms.', icon: 'bi-file-earmark-text' }
  ].forEach((item) => {
    const card = make('a', 'res-keep-exploring__card', '');
    card.href = item.href;
    const iconWrap = make('span', 'res-keep-exploring__icon');
    const icon = make('i', `bi ${item.icon}`); icon.setAttribute('aria-hidden', 'true');
    iconWrap.appendChild(icon);
    const body = make('div', '');
    body.append(make('h3', '', item.label), make('p', '', item.description));
    card.append(iconWrap, body);
    keepGrid.appendChild(card);
  });
  keepExploring.appendChild(keepGrid); root.appendChild(keepExploring);

  /* ── Guide logic ── */
  const answers = Array(data.questions.length).fill(null);
  let current = 0;
  const render = () => {
    const item = data.questions[current];
    progressText.textContent = `${current + 1} of ${data.questions.length}`;
    fill.style.width = `${((current + 1) / data.questions.length) * 100}%`;
    question.textContent = item.question;
    options.replaceChildren();
    item.options.forEach((value) => {
      const button = make('button', 'rs-chip rsc-option', value);
      button.type = 'button';
      button.setAttribute('aria-pressed', String(answers[current] === value));
      button.addEventListener('click', () => { answers[current] = value; render(); });
      options.appendChild(button);
    });
    back.disabled = current === 0;
    next.textContent = current === data.questions.length - 1 ? 'See summary' : 'Next';
    skip.textContent = answers[current] ? 'Clear answer' : 'Skip';
  };
  const showSummary = () => {
    guideCard.replaceChildren();
    const summary = make('div', 'rsc-summary');
    summary.append(make('h3', '', 'A starting point for a conversation, not a recommendation.'), make('p', '', 'Your points to discuss:'));
    const list = make('ul');
    data.questions.forEach((item, index) => {
      const entry = make('li', '', `${item.row}: ${answers[index] || 'Skipped'}`);
      list.appendChild(entry);
      const row = tbody.querySelector(`[data-row="${item.row}"]`);
      if (answers[index] && row) row.classList.add('is-tied');
    });
    summary.appendChild(list);
    const restart = make('button', 'rs-button', 'Start again'); restart.type = 'button';
    restart.addEventListener('click', () => {
      answers.fill(null); current = 0;
      guideCard.replaceChildren(top, progress, question, options, guideActions);
      render();
    });
    summary.appendChild(restart); guideCard.appendChild(summary);
  };
  back.addEventListener('click', () => { if (current > 0) { current -= 1; render(); } });
  next.addEventListener('click', () => { if (current === data.questions.length - 1) showSummary(); else { current += 1; render(); } });
  skip.addEventListener('click', () => { answers[current] = null; if (current === data.questions.length - 1) showSummary(); else { current += 1; render(); } });
  render();

  RS.reveal();
})();
