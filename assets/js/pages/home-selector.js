document.addEventListener('DOMContentLoaded', () => {
  const host = document.querySelector('[data-industry-selector]');
  const sectors = Array.isArray(window.SECTORS) ? window.SECTORS : [];
  const products = Array.isArray(window.AI_PRODUCTS) ? window.AI_PRODUCTS : [];
  const hardware = Array.isArray(window.HARDWARE) ? window.HARDWARE : [];
  if (!host || !sectors.length) return;

  const chips = host.querySelector('[data-industry-chips]');
  const description = host.querySelector('[data-industry-description]');
  const useCases = host.querySelector('[data-industry-usecases]');
  const matches = host.querySelector('[data-industry-matches]');
  const subtitle = document.querySelector('[data-industry-subtext]');
  const cta = document.querySelector('[data-industry-cta]');
  const makeLink = (label, href) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    return link;
  };

  let selectedSlug = '';
  try {
    selectedSlug = window.localStorage.getItem('frameiq-home-sector') || '';
  } catch (error) {
    console.warn('Saved industry choice could not be read.', error);
  }
  if (!sectors.some((sector) => sector.slug === selectedSlug)) selectedSlug = sectors[0].slug;

  sectors.forEach((sector) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'home-industry-chip';
    button.dataset.sector = sector.slug;
    button.textContent = sector.name;
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => selectSector(sector));
    chips.appendChild(button);
  });

  function selectSector(sector) {
    selectedSlug = sector.slug;
    chips.querySelectorAll('[data-sector]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.sector === selectedSlug));
    });
    description.textContent = sector.summary;
    if (subtitle) subtitle.textContent = sector.summary;
    useCases.replaceChildren();
    sector.groups.flatMap((group) => group.items).slice(0, 4).forEach((useCase) => {
      const item = document.createElement('li');
      item.textContent = useCase;
      useCases.appendChild(item);
    });

    const categories = new Set(sector.relatedCategories || []);
    const relatedProducts = products.filter((product) => categories.has(product.category) && product.status !== 'demo scene only');
    const relatedHardware = hardware.filter((item) => categories.has(item.category));
    matches.replaceChildren();
    if (relatedProducts.length) {
      const productList = document.createElement('ul');
      productList.setAttribute('aria-label', 'Related AI Store products');
      relatedProducts.slice(0, 3).forEach((product) => {
        const item = document.createElement('li');
        item.appendChild(makeLink(product.name, `pages/ai-store.html#${encodeURIComponent(product.category.toLowerCase())}`));
        productList.appendChild(item);
      });
      matches.appendChild(productList);
    }
    if (relatedHardware.length) {
      const hardwareList = document.createElement('ul');
      hardwareList.setAttribute('aria-label', 'Related hardware');
      relatedHardware.slice(0, 3).forEach((item) => {
        const entry = document.createElement('li');
        entry.appendChild(makeLink(item.name, 'pages/gear.html'));
        hardwareList.appendChild(entry);
      });
      matches.appendChild(hardwareList);
    }
    if (!relatedProducts.length && !relatedHardware.length) {
      const note = document.createElement('p');
      note.textContent = 'No sector-specific product or hardware mapping is listed yet.';
      matches.appendChild(note);
    }
    if (!relatedHardware.length) {
      matches.appendChild(makeLink('Browse hardware catalog', 'pages/gear.html'));
    }
    if (cta) {
      cta.href = `pages/contact.html?sector=${encodeURIComponent(sector.slug)}`;
      const article = /^[aeiou]/i.test(sector.name) ? 'an' : 'a';
      cta.firstChild.textContent = `Book ${article} ${sector.name} Demo `;
    }
    try {
      window.localStorage.setItem('frameiq-home-sector', sector.slug);
    } catch (error) {
      console.warn('Industry choice could not be saved.', error);
    }
  }

  const initial = sectors.find((sector) => sector.slug === selectedSlug) || sectors[0];
  selectSector(initial);
});
