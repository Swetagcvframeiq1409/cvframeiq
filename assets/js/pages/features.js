(() => {
  'use strict';

  const host = document.querySelector('[data-ft-pillars]');
  const data = window.FEATURES;
  if (!host) return;
  if (!data || !Array.isArray(data.pillars)) {
    console.error('Features could not initialize because its data is unavailable.');
    return;
  }

  const showDraft = data.SHOW_DRAFT === true;
  const draftNotice = document.querySelector('[data-features-draft]');
  if (draftNotice) draftNotice.hidden = !showDraft;
  const visible = data.pillars.filter((item) => item.confirmed === true || showDraft);
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  visible.forEach((item) => {
    const card = make('article', 'ft-card');
    if (item.confirmed !== true) card.append(make('span', 'ft-status', 'Unconfirmed'));
    card.append(make('h2', '', item.title), make('p', '', item.summary));
    const list = make('ul', 'ft-list');
    item.useCases.forEach((useCase) => list.append(make('li', '', useCase)));
    card.append(list);
    host.append(card);
  });
  host.closest('section').hidden = visible.length === 0;

  const related = document.querySelector('[data-ft-related]');
  data.related.forEach((item) => {
    const link = make('a', 'ft-related__link');
    link.href = item.href;
    link.append(make('strong', '', item.label), make('span', '', item.description));
    related.append(link);
  });
})();
