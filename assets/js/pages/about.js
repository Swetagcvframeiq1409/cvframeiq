(() => {
  document.documentElement.classList.add('js');
  const data = window.COMPANY_PAGE_DATA;
  if (!data) {
    console.error('Company page data is unavailable.');
    return;
  }
  if (data.SHOW_DRAFT !== true) {
    document.querySelectorAll('[data-about-draft]').forEach((element) => element.remove());
  }

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[character]);

  const renderIcon = (name) => {
    if (!name) return '';
    return `<span class="about-card__icon" aria-hidden="true"><i class="${window.iconClass(name)}"></i></span>`;
  };

  const renderCards = (items, className, linkLabel) => items.map((item, index) => `
    <article class="${className} card reveal">
      <span class="about-card__index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      ${renderIcon(item.icon)}
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.description)}</p>
      ${item.href ? `<a class="about-card__link" href="${escapeHtml(item.href)}">${escapeHtml(item.link || linkLabel)} <span aria-hidden="true">→</span></a>` : ''}
    </article>
  `).join('');

  const renderList = (items, className, titleKey = 'title') => items.map((item, index) => `
    <li class="${className} reveal">
      <span class="about-list__index" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span>
      <div><h3>${escapeHtml(item[titleKey])}</h3><p>${escapeHtml(item.description)}</p></div>
    </li>
  `).join('');

  const collectionMarkup = {
    process: renderList(data.process, 'about-process__step'),
    projects: renderCards(data.projects, 'about-project-card'),
    technologies: data.technologies.map((technology) => `
      <li class="about-tech__item reveal">
        ${renderIcon(technology.icon)}
        <span class="about-tech__copy"><strong>${escapeHtml(technology.name)}</strong><span>${escapeHtml(technology.category)}</span></span>
      </li>
    `).join(''),
    vision: renderList(data.visionStages, 'about-vision__step')
  };

  Object.entries(collectionMarkup).forEach(([name, markup]) => {
    const host = document.querySelector(`[data-company-collection="${name}"]`);
    if (!host) return;
    host.innerHTML = markup;
    host.querySelectorAll('.reveal').forEach((item) => item.classList.add('is-visible'));
  });
})();
