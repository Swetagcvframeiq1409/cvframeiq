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

    const timeDisplay = hero.querySelector('[data-camera-time]');
    const updateCameraTime = () => {
      if (!timeDisplay) return;
      const time = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date());
      timeDisplay.textContent = `${time} IST`;
    };
    updateCameraTime();
    window.setInterval(updateCameraTime, 1000);

    if (!reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let frame = 0;
      hero.addEventListener('pointermove', (event) => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const bounds = hero.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width - 0.5;
          const y = (event.clientY - bounds.top) / bounds.height - 0.5;

          hero.querySelectorAll('.hero-floater[data-parallax]').forEach((floater) => {
            const strength = Number(floater.dataset.parallax);
            floater.style.transform = `translate3d(${(-x * strength * 48).toFixed(2)}px, ${(-y * strength * 48).toFixed(2)}px, 0)`;
          });

          const panel = hero.querySelector('.camera-panel[data-parallax]');
          if (panel) {
            const strength = Number(panel.dataset.parallax);
            panel.style.setProperty('--parallax-x', `${(x * strength * 42).toFixed(2)}deg`);
            panel.style.setProperty('--parallax-y', `${(-y * strength * 30).toFixed(2)}deg`);
          }
        });
      }, { passive: true });

      hero.addEventListener('pointerleave', () => {
        if (frame) cancelAnimationFrame(frame);
        hero.querySelectorAll('.hero-floater').forEach((floater) => {
          floater.style.transform = '';
        });
        const panel = hero.querySelector('.camera-panel');
        panel?.style.removeProperty('--parallax-x');
        panel?.style.removeProperty('--parallax-y');
      });
    }
  }

  const visionCanvas = document.querySelector('.vision-overlay');
  if (visionCanvas instanceof HTMLCanvasElement) {
    const context = visionCanvas.getContext('2d');
    if (!context) {
      console.error('The home vision overlay could not initialize its canvas context.');
    } else {
      const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
      let visible = false;
      let animationFrame = 0;
      let canvasWidth = 0;
      let canvasHeight = 0;
      const detections = [
        { x: .18, y: .23, width: .2, height: .43, label: 'Object', phase: 0 },
        { x: .61, y: .3, width: .22, height: .38, label: 'Region', phase: 2.1 }
      ];

      const resizeCanvas = () => {
        const bounds = visionCanvas.getBoundingClientRect();
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        canvasWidth = bounds.width;
        canvasHeight = bounds.height;
        visionCanvas.width = Math.round(canvasWidth * scale);
        visionCanvas.height = Math.round(canvasHeight * scale);
        context.setTransform(scale, 0, 0, scale, 0, 0);
        if (motionPreference.matches || !visible) drawDetections(0);
      };

      const drawDetections = (time) => {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        detections.forEach((detection) => {
          const drift = motionPreference.matches ? 0 : Math.sin((time / 650) + detection.phase) * 5;
          const x = detection.x * canvasWidth + drift;
          const y = detection.y * canvasHeight + Math.cos((time / 650) + detection.phase) * 3;
          const width = detection.width * canvasWidth;
          const height = detection.height * canvasHeight;
          const labelWidth = 64;
          const labelHeight = 23;
          const labelY = Math.max(4, y - labelHeight - 5);

          context.strokeStyle = 'rgba(185, 150, 255, .92)';
          context.lineWidth = 1.5;
          context.strokeRect(x, y, width, height);
          context.fillStyle = 'rgba(20, 14, 35, .92)';
          context.fillRect(x, labelY, labelWidth, labelHeight);
          context.fillStyle = '#fff';
          context.font = '600 11px Inter, sans-serif';
          context.fillText(detection.label, x + 8, labelY + 15);
        });
      };

      const animate = (time) => {
        animationFrame = 0;
        if (!visible || document.hidden) return;
        drawDetections(time);
        if (!motionPreference.matches) animationFrame = requestAnimationFrame(animate);
      };

      const updateVisibility = (nextVisible) => {
        visible = nextVisible;
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        if (visible) {
          drawDetections(performance.now());
          if (!motionPreference.matches && !document.hidden) animationFrame = requestAnimationFrame(animate);
        }
      };

      const visibilityObserver = 'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => updateVisibility(entry.isIntersecting), { threshold: .01 })
        : null;
      if (visibilityObserver) visibilityObserver.observe(visionCanvas);
      else updateVisibility(true);

      const resizeObserver = 'ResizeObserver' in window ? new ResizeObserver(resizeCanvas) : null;
      resizeObserver?.observe(visionCanvas);
      window.addEventListener('resize', resizeCanvas, { passive: true });
      motionPreference.addEventListener?.('change', () => updateVisibility(visible));
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (animationFrame) cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        } else if (visible && !motionPreference.matches) {
          animationFrame = requestAnimationFrame(animate);
        } else if (visible) {
          drawDetections(0);
        }
      });
      resizeCanvas();
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

  const counters = document.querySelectorAll('[data-count]');
  const formatterFor = (element) => {
    const decimals = Number(element.dataset.decimals || 0);
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  const renderCount = (element, value) => {
    element.textContent = formatterFor(element).format(value);
  };

  const animateCount = (element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) {
      console.error('Invalid hero statistic count:', element.dataset.count);
      return;
    }

    if (reducedMotion) {
      renderCount(element, target);
      return;
    }

    const duration = 650;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      renderCount(element, target * progress);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        renderCount(element, target);
      }
    };
    requestAnimationFrame(tick);
  };

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      });
    }, { threshold: 0.55 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCount);
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

  const processStory = document.querySelector('[data-process-story]');
  const storySteps = processStory ? Array.from(processStory.querySelectorAll('.process-step')) : [];
  const processVisual = processStory?.closest('.process-story-layout')?.querySelector('.process__visual');
  const scenes = processVisual ? Array.from(processVisual.querySelectorAll('.process-scene')) : [];

  if (processStory && storySteps.length && reducedMotion) processStory.classList.add('is-visible');
  if (processStory && storySteps.length && 'IntersectionObserver' in window && !reducedMotion) {
    const storyObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        processStory.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    storyObserver.observe(processStory);

    const setActiveStep = (index) => {
      storySteps.forEach((step, stepIndex) => {
        const active = stepIndex === index;
        step.classList.toggle('is-active', active);
        if (active) {
          step.setAttribute('aria-current', 'step');
        } else {
          step.removeAttribute('aria-current');
        }
      });

      const progress = storySteps.length > 1 ? (index / (storySteps.length - 1)) * 100 : 100;
      processStory.style.setProperty('--story-progress', `${progress}%`);

      scenes.forEach((scene, sceneIndex) => {
        const active = sceneIndex === index;
        scene.classList.toggle('is-active', active);
        scene.setAttribute('aria-hidden', String(!active));
      });
    };

    setActiveStep(0);
    const stepObserver = new IntersectionObserver((entries) => {
      const visibleSteps = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio);
      if (!visibleSteps.length) return;
      setActiveStep(Number(visibleSteps[0].target.dataset.stepIndex || 0));
    }, { rootMargin: '-38% 0px -38% 0px', threshold: [0.1, 0.35, 0.6, 0.85] });

    storySteps.forEach((step) => stepObserver.observe(step));
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
