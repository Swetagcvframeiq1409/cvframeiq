document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const header = document.querySelector('.site-header, #site-header > header, header');
  const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 40);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  document.body.classList.add('is-page-ready');
  document.querySelectorAll('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || link.target === '_blank' || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      event.preventDefault();
      document.body.classList.add('is-page-leaving');
      window.setTimeout(() => { window.location.assign(url.href); }, reducedMotion ? 0 : 200);
    });
  });

  const practiceCarousel = document.querySelector('[data-practice-carousel]');
  const practiceCards = practiceCarousel ? Array.from(practiceCarousel.children) : [];
  const practiceDots = Array.from(document.querySelectorAll('.practice-carousel-dots i'));
  const movePractice = (direction) => {
    if (!practiceCarousel || !practiceCards.length) return;
    const cardWidth = practiceCards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(practiceCarousel).columnGap || '0');
    practiceCarousel.scrollBy({ left: direction * cardWidth, behavior: reducedMotion ? 'auto' : 'smooth' });
  };
  document.querySelector('[data-practice-prev]')?.addEventListener('click', () => movePractice(-1));
  document.querySelector('[data-practice-next]')?.addEventListener('click', () => movePractice(1));
  practiceCarousel?.addEventListener('scroll', () => {
    if (!practiceCards.length) return;
    const cardWidth = practiceCards[0].getBoundingRect?.().width || practiceCards[0].getBoundingClientRect().width;
    const index = Math.min(practiceDots.length - 1, Math.max(0, Math.round(practiceCarousel.scrollLeft / cardWidth)));
    practiceDots.forEach((dot, dotIndex) => dot.classList.toggle('is-active', dotIndex === index));
  }, { passive: true });

  const statNumbers = Array.from(document.querySelectorAll('#main-content [data-count]'));
  const animateNumber = (element) => {
    if (element.dataset.counted === 'true') return;
    element.dataset.counted = 'true';
    const target = Number(element.dataset.count);
    const decimals = Number(element.dataset.decimals || 0);
    const prefix = element.dataset.prefix ? element.dataset.prefix.replace('&lt;', '<') : '';
    const suffix = element.dataset.suffix || '';
    if (reducedMotion) {
      element.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      return;
    }
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${prefix}${(target * eased).toFixed(decimals)}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && statNumbers.length) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { animateNumber(entry.target); observer.unobserve(entry.target); } });
    }, { threshold: 0.45 });
    statNumbers.forEach((number) => statsObserver.observe(number));
  }

  const hero = document.querySelector('.hero');
  const heroScenes = hero ? hero.querySelectorAll('.hero__scene') : [];

  heroScenes.forEach((scene) => {
    scene.classList.remove('is-photo');
    scene.style.removeProperty('background-image');
  });

  if (hero) {
    hero.querySelectorAll('.hero-enter[data-enter]').forEach((element) => {
      element.style.setProperty('--enter-order', element.dataset.enter);
    });
    if (reducedMotion) {
      hero.classList.add('is-ready');
    } else {
      const revealHero = () => hero.classList.add('is-ready');
      const revealFallback = window.setTimeout(revealHero, 350);
      requestAnimationFrame(() => {
        window.clearTimeout(revealFallback);
        revealHero();
      });
    }

    if (!reducedMotion) {
      let frame = 0;
      const glow = hero.querySelector('.hero__glow');
      const updateGlow = () => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (!glow) return;
          const offset = Math.min(Math.max(window.scrollY * 0.025, 0), 24);
          glow.style.transform = `translateY(${-offset}px)`;
        });
      };
      window.addEventListener('scroll', updateGlow, { passive: true });
    }
  }

  const coverage = document.querySelector('[data-coverage-explorer]');
  const coverageModes = document.querySelectorAll('[data-coverage-mode]');
  const coverageComingSoon = document.querySelector('[data-coverage-coming-soon]');
  const mapUnavailable = document.querySelector('[data-map-unavailable]');
  const mapPanel = coverage?.querySelector('.coverage-map-panel');
  const coverageData = window.COVERAGE_DATA;

  if (coverage && coverageModes.length && coverageComingSoon && mapUnavailable) {
    const cards = Array.from(coverage.querySelectorAll('[data-coverage-card]'));
    const regions = new Map((coverageData?.regions || []).map((region) => [region.id, region]));
    mapUnavailable.textContent = 'Select a region card below to view its listed coverage details.';
    mapUnavailable.hidden = false;

    let mapDetails = null;

    const activateRegion = (regionId) => {
      if (!regions.has(regionId)) return;
      const activeCard = cards.find((card) => card.dataset.coverageCard === regionId);
      cards.forEach((card) => {
        const active = card.dataset.coverageCard === regionId;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-current', String(active));
        card.setAttribute('aria-pressed', String(active));
      });

      if (!activeCard || !mapPanel) return;

      // Copy the active card's existing coverage details into the left panel.
      if (!mapDetails) {
        mapDetails = document.createElement('div');
        mapDetails.className = 'coverage-map-panel__content';
        mapUnavailable.replaceWith(mapDetails);
      }

      const zone = document.createElement('p');
      zone.className = 'coverage-map-panel__zone';
      const zoneLabel = activeCard.querySelector('.coverage-region-card__eyebrow');
      zone.textContent = zoneLabel ? zoneLabel.textContent : '';

      const title = document.createElement('h3');
      title.className = 'coverage-map-panel__title';
      const cardTitle = activeCard.querySelector('h3');
      title.textContent = cardTitle ? cardTitle.textContent : '';

      const description = document.createElement('p');
      description.className = 'coverage-map-panel__description';
      const cardDescription = activeCard.querySelector('.coverage-region-card__summary');
      description.textContent = cardDescription ? cardDescription.textContent : '';

      const sectorList = document.createElement('ul');
      sectorList.className = 'coverage-map-panel__tags';
      const cardSectors = activeCard.querySelector('[data-sector-list]');
      if (cardSectors) {
        cardSectors.querySelectorAll('li').forEach((sector) => {
          sectorList.appendChild(sector.cloneNode(true));
        });
      }

      mapDetails.replaceChildren(zone, title, description, sectorList);
      mapPanel.classList.remove('is-switching');
      void mapPanel.offsetWidth;
      requestAnimationFrame(() => {
        mapPanel.classList.add('is-switching');
      });
    };

    // Select a region card on load so the coverage panel has real details.
    const activeCard = cards.find((card) => card.classList.contains('is-active'));
    activateRegion(activeCard?.dataset.coverageCard || cards[0]?.dataset.coverageCard);

    cards.forEach((card) => {
      const region = regions.get(card.dataset.coverageCard);
      if (!region) return;
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', `${region.name}: ${region.sectors.join(', ')}`);
      card.addEventListener('focus', () => activateRegion(region.id));
      card.addEventListener('pointerenter', () => activateRegion(region.id), { passive: true });
      card.addEventListener('click', () => activateRegion(region.id));
      card.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activateRegion(region.id);
      });
    });

    activateRegion('maharashtra');
    coverageModes.forEach((button) => {
      if (button.disabled) return;
      button.addEventListener('click', () => {
        const isIndia = button.dataset.coverageMode === 'india';
        coverageModes.forEach((modeButton) => {
          const active = modeButton === button;
          modeButton.classList.toggle('is-active', active);
          modeButton.setAttribute('aria-pressed', String(active));
        });
        coverage.hidden = !isIndia;
        coverageComingSoon.hidden = isIndia;
      });
    });
  }

  const carousel = document.querySelector('[data-carousel]');
  const slides = document.querySelectorAll('[data-slide]');
  const prevButton = document.querySelector('[data-carousel-prev]');
  const nextButton = document.querySelector('[data-carousel-next]');

  if (carousel && slides.length) {
    let activeIndex = 0;

    const renderSlide = (index) => {
      slides.forEach((slide, idx) => {
        slide.hidden = idx !== index;
        slide.setAttribute('aria-hidden', String(idx !== index));
      });
    };

    renderSlide(activeIndex);

    prevButton?.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + slides.length) % slides.length;
      renderSlide(activeIndex);
    });

    nextButton?.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % slides.length;
      renderSlide(activeIndex);
    });

    carousel.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') nextButton?.click();
      if (event.key === 'ArrowLeft') prevButton?.click();
    });
  }

  const blogRow = document.querySelector('#blog .blog-grid');
  const blogPrevious = document.querySelector('[data-blog-prev]');
  const blogNext = document.querySelector('[data-blog-next]');
  if (blogRow && blogPrevious && blogNext) {
    const updateBlogControls = () => {
      blogPrevious.disabled = blogRow.scrollLeft <= 1;
      blogNext.disabled = blogRow.scrollLeft + blogRow.clientWidth >= blogRow.scrollWidth - 1;
    };
    const scrollBlog = (direction) => {
      const card = blogRow.querySelector('.blog-card');
      const gap = Number.parseFloat(getComputedStyle(blogRow).columnGap) || 0;
      blogRow.scrollBy({
        left: direction * ((card?.getBoundingClientRect().width || blogRow.clientWidth) + gap),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    };
    blogPrevious.addEventListener('click', () => scrollBlog(-1));
    blogNext.addEventListener('click', () => scrollBlog(1));
    blogRow.addEventListener('scrollend', updateBlogControls);
    blogRow.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollBlog(-1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollBlog(1);
      }
    });
    updateBlogControls();
  }
});
