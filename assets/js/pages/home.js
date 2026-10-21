document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hero = document.querySelector('.hero');

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

  if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.role-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        const tiltX = (0.5 - y) * 5;
        const tiltY = (x - 0.5) * 6;

        card.style.setProperty('--spot-x', `${(x * 100).toFixed(1)}%`);
        card.style.setProperty('--spot-y', `${(y * 100).toFixed(1)}%`);
        card.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
      }, { passive: true });

      card.addEventListener('pointerleave', () => {
        card.style.removeProperty('--spot-x');
        card.style.removeProperty('--spot-y');
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  }

  const coverage = document.querySelector('[data-coverage-explorer]');
  const coverageModes = document.querySelectorAll('[data-coverage-mode]');
  const coverageComingSoon = document.querySelector('[data-coverage-coming-soon]');
  const mapUnavailable = document.querySelector('[data-map-unavailable]');
  const coverageData = window.COVERAGE_DATA;

  if (coverage && coverageModes.length && coverageComingSoon && mapUnavailable) {
    const cards = Array.from(coverage.querySelectorAll('[data-coverage-card]'));
    const regions = new Map((coverageData?.regions || []).map((region) => [region.id, region]));
    mapUnavailable.textContent = 'Select a region card below to view its listed coverage details.';
    mapUnavailable.hidden = false;

    const activateRegion = (regionId) => {
      if (!regions.has(regionId)) return;
      cards.forEach((card) => {
        const active = card.dataset.coverageCard === regionId;
        card.classList.toggle('is-active', active);
        card.setAttribute('aria-current', String(active));
        card.setAttribute('aria-pressed', String(active));
      });
    };

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
});
