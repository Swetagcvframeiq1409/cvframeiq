(() => {
  'use strict';

  const data = window.CAREERS;
  const rolesHost = document.querySelector('[data-cr-roles]');
  const valuesHost = document.querySelector('[data-cr-values]');
  if (!rolesHost || !valuesHost) return;
  if (!data || !Array.isArray(data.roles) || !Array.isArray(data.values)) {
    console.error('Careers could not initialize because its data is unavailable.');
    return;
  }

  const showDraft = data.SHOW_DRAFT === true;
  const draftNotice = document.querySelector('[data-careers-draft]');
  if (draftNotice) draftNotice.hidden = !showDraft;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const roles = data.roles.filter((item) => item.confirmed === true || showDraft);
  roles.forEach((role) => {
    const card = make('article', 'cr-role');
    if (role.confirmed !== true) card.append(make('span', 'cr-status', 'Unconfirmed'));
    card.append(make('h3', '', role.title));
    const details = [role.team, role.location, role.type].filter(Boolean);
    if (details.length) card.append(make('p', 'cr-role__details', details.join(' · ')));
    if (role.summary) card.append(make('p', '', role.summary));
    if (role.applyEmail) {
      const apply = make('a', 'cr-button', 'Ask about this role');
      apply.href = `mailto:${encodeURIComponent(role.applyEmail)}?subject=${encodeURIComponent(`Application: ${role.title}`)}`;
      card.append(apply);
    }
    rolesHost.append(card);
  });
  if (!roles.length && showDraft) {
    const empty = make('div', 'cr-empty');
    empty.append(
      make('p', '', 'Career openings are pending confirmation.'),
      make('a', 'cr-button', 'Contact FrameIQ')
    );
    empty.querySelector('a').href = window.getPageHref('pages/contact.html');
    rolesHost.append(empty);
  }
  rolesHost.closest('[data-careers-openings]').hidden = !showDraft && !roles.length;
  rolesHost.hidden = false;

  const values = data.values.filter((item) => item.confirmed === true || showDraft);
  values.forEach((item) => {
    const value = make('li', 'cr-value');
    if (item.confirmed !== true) value.append(make('span', 'cr-status', 'Unconfirmed'));
    value.append(make('span', '', item.text));
    valuesHost.append(value);
  });
  const section = valuesHost.closest('[data-cr-values-section]');
  section.hidden = values.length === 0;
})();
