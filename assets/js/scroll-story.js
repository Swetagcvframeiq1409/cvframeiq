(() => {
  'use strict';

  const smallScreen = window.matchMedia('(max-width: 899px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = Array.from(document.querySelectorAll('[data-scroll-story], [data-www]'));
  const dialSections = sections.filter((section) => section.matches('[data-gk-dial]'));
  const aboutWww = document.querySelector('[data-www]');
  const aboutWwwPin = aboutWww?.querySelector('.about-www__pin');
  const aboutWwwPointer = aboutWww?.querySelector('.about-www__pointer');
  const dialStates = new WeakMap();
  const activeSections = new Set();
  const story = document.getElementById('home-story');
  const slides = story ? Array.from(story.querySelectorAll('.home-story__slide')) : [];
  const hero = document.querySelector('.hero[data-scroll-story]');
  const statement = document.querySelector('.home-statement[data-scroll-story]');
  const statementCue = statement?.querySelector('.home-statement__scroll-cue');
  const gearStatement = document.querySelector('.gear-statement[data-scroll-story]');
  const gearBundles = document.querySelector('.gear-bundles[data-scroll-story]');
  const gearChapters = document.querySelector('.gear-chapters[data-scroll-story]');
  const aboutWordmark = document.querySelector('.gk-about-wordmark[data-scroll-story] .gk-about-wordmark__mark');
  const aboutValues = document.querySelector('.gk-about-values[data-scroll-story]');
  const aboutStory = document.querySelector('.gk-about-story[data-scroll-story]');
  const wordmark = story?.querySelector('.home-story__wordmark');
  const practiceItems = Array.from(document.querySelectorAll('.site-bento__item'));
  const practiceDots = Array.from(document.querySelectorAll('.site-bento__dots i'));
  let observer = null;
  let frame = 0;
  let currentSlide = -1;
  let currentPractice = -1;

  const splitWords = (element, className) => {
    if (element.dataset.wordsReady) return;

    const original = element.textContent.trim();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    let wordIndex = 0;
    nodes.forEach((node) => {
      const parts = node.textContent.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement('span');
        word.className = className;
        word.setAttribute('aria-hidden', 'true');
        word.style.setProperty('--word-index', String(wordIndex));
        word.textContent = part;
        wordIndex += 1;
        fragment.append(word);
      });
      node.replaceWith(fragment);
    });

    element.setAttribute('aria-label', original);
    element.dataset.wordsReady = 'true';
    element.style.setProperty('--word-count', String(Math.max(wordIndex, 1)));
  };

  const prepareText = () => {
    if (aboutWordmark) {
      splitWords(aboutWordmark, 'home-story__word');
      const words = aboutWordmark.querySelectorAll('.home-story__word');
      const total = words.length;
      words.forEach((word, index) => {
        word.style.setProperty('--word-start', String(index / total));
        word.style.setProperty('--word-count', String(total));
      });
    }

    const statementParagraphs = Array.from(document.querySelectorAll('.home-statement__paragraph'));
    statementParagraphs.forEach((paragraph) => {
      splitWords(paragraph, 'home-statement__word');
    });
    if (statement) {
      const spans = statement.querySelectorAll('.home-statement__word');
      const total = spans.length;
      spans.forEach((span, index) => {
        span.style.setProperty('--word-start', String(index / total));
        span.style.setProperty('--word-count', String(total));
      });
    }

    const gearParagraphs = Array.from(document.querySelectorAll('.gear-statement__paragraph'));
    gearParagraphs.forEach((paragraph) => {
      splitWords(paragraph, 'gear-statement__word');
      const spans = paragraph.querySelectorAll('.gear-statement__word');
      const total = spans.length;
      spans.forEach((span, index) => {
        span.style.setProperty('--word-start', String(index / total));
        span.style.setProperty('--word-count', String(total));
      });
    });

    slides.forEach((slide) => {
      slide.querySelectorAll('.home-story__text, .home-story__detail').forEach((paragraph) => {
        splitWords(paragraph, 'home-story__word');
      });

    });

    const letters = story?.querySelector('.home-story__letters');
    if (letters && !letters.dataset.lettersReady) {
      const label = letters.textContent;
      letters.replaceChildren(...Array.from(label, (letter, index) => {
        const span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--letter-index', String(index));
        span.textContent = letter;
        return span;
      }));
      letters.dataset.lettersReady = 'true';
    }
  };

  const updateStory = (progress) => {
    if (!slides.length) return;
    const ranges = [0.1525, 0.3025, 0.4525, 0.61];
    const index = ranges.findIndex((edge) => progress < edge);
    if (index === currentSlide) return;
    currentSlide = index;
    slides.forEach((slide, position) => {
      const active = position === index;
      slide.classList.toggle('is-current', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
  };

  const updatePracticeDots = (index) => {
    if (index === currentPractice) return;
    currentPractice = index;
    practiceDots.forEach((dot, position) => dot.classList.toggle('is-active', position === index));
  };

  const setDialGeometry = (state) => {
    const width = window.innerWidth;
    const height = state.pin.getBoundingClientRect().height;
    const radius = height * 0.53;
    const rightmost = width < 600 ? 40 : width < 1024 ? width * 0.14 : width * 0.03 + radius;
    const centerX = rightmost - radius;
    const centerY = height / 2;
    const bubbleSize = width < 600 ? 44 : width < 1024 ? 80 : 120;

    state.width = width;
    state.height = height;
    state.radius = radius;
    state.centerX = centerX;
    state.centerY = centerY;
    state.pin.style.setProperty('--dial-radius', `${radius}px`);
    state.pin.style.setProperty('--dial-center-x', `${centerX}px`);
    state.pin.style.setProperty('--dial-center-y', `${centerY}px`);
    state.pin.style.setProperty('--dial-bubble-size', `${bubbleSize}px`);
  };

  const setupDial = (section) => {
    const pin = section.querySelector('.gk-dial__pin');
    const buttons = Array.from(section.querySelectorAll('.gk-dial__nums button'));
    const articles = Array.from(section.querySelectorAll('.gk-dial__t'));
    if (!pin || !buttons.length || buttons.length !== articles.length) {
      console.error('Core values dial requires a pin and matching value buttons and articles.');
      return null;
    }

    const state = {
      pin,
      buttons,
      articles,
      width: 0,
      height: 0,
      radius: 0,
      centerX: 0,
      centerY: 0,
      activeIndex: -1,
      pendingIndex: -1,
      textTimer: 0
    };
    section.style.setProperty('--n', String(buttons.length));
    section.classList.add('is-enhanced');
    setDialGeometry(state);

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        const travel = Math.max(section.offsetHeight - pin.offsetHeight, 1);
        const progress = 0.04 + (index / Math.max(buttons.length - 1, 1)) * 0.92;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: sectionTop + progress * travel,
          behavior: reducedMotion.matches ? 'instant' : 'smooth'
        });
      });
    });

    return state;
  };

  const disableDials = () => {
    dialSections.forEach((section) => {
      section.classList.remove('is-enhanced');
      const state = dialStates.get(section);
      if (!state) return;
      window.clearTimeout(state.textTimer);
      state.activeIndex = -1;
      state.pendingIndex = -1;
      state.articles.forEach((article) => article.removeAttribute('aria-hidden'));
    });
  };

  const updateDialText = (state, index) => {
    if (state.activeIndex === index || state.pendingIndex === index) return;
    state.pendingIndex = index;
    window.clearTimeout(state.textTimer);
    state.textTimer = window.setTimeout(() => {
      state.activeIndex = state.pendingIndex;
      state.pendingIndex = -1;
      state.articles.forEach((article, position) => {
        const active = position === state.activeIndex;
        article.classList.toggle('is-active', active);
        article.setAttribute('aria-hidden', String(!active));
      });
    }, state.activeIndex < 0 ? 0 : 120);
  };

  const renderDial = (section, progress) => {
    const state = dialStates.get(section);
    if (!state) return;
    const lastIndex = state.buttons.length - 1;
    const position = Math.max(0, Math.min(1, (progress - 0.04) / 0.92)) * lastIndex;

    state.buttons.forEach((button, index) => {
      const angle = (index - position) * (16 * Math.PI / 180);
      const x = state.centerX + state.radius * Math.cos(angle) - state.width / 2;
      const y = state.centerY + state.radius * Math.sin(angle) - state.height / 2;
      const distance = Math.abs(index - position);
      const scale = distance <= 1
        ? 1 - distance * 0.15
        : distance <= 2 ? 0.85 - (distance - 1) * 0.25 : 0.6;
      const fillOpacity = distance < 0.5
        ? 0.25
        : distance <= 1 ? 0.25 - (distance - 0.5) * 0.34
          : distance <= 2 ? 0.08 - (distance - 1) * 0.04 : 0;
      const numberOpacity = distance <= 1
        ? 1 - distance * 0.4
        : distance <= 2 ? 0.6 - (distance - 1) * 0.3
          : distance <= 3 ? 0.3 - (distance - 2) * 0.15 : 0.15;

      button.style.setProperty('--bubble-x', `${x}px`);
      button.style.setProperty('--bubble-y', `${y}px`);
      button.style.setProperty('--bubble-scale', scale.toFixed(3));
      button.style.setProperty('--bubble-fill-opacity', Math.max(fillOpacity, 0).toFixed(3));
      button.style.setProperty('--bubble-number-opacity', numberOpacity.toFixed(3));
    });

    updateDialText(state, Math.round(position + 0.002));
  };

  const render = () => {
    frame = 0;
    let practiceIndex = -1;

    activeSections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      const isDial = section.matches('[data-gk-dial]');
      const pin = isDial ? section.querySelector('.gk-dial__pin') : section === aboutWww ? aboutWwwPin : null;
      const travel = Math.max(bounds.height - (pin ? pin.offsetHeight : window.innerHeight), 1);
      const headerHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 76;
      const progress = Math.min(1, Math.max(0,
        section === aboutWww ? (headerHeight - bounds.top) / travel : -bounds.top / travel
      ));
      section.style.setProperty('--p', progress.toFixed(4));
      if (section === aboutWww) section.classList.add('is-enhanced');
      if (isDial) renderDial(section, progress);
      if (section === aboutValues) {
        const steps = Array.from(section.querySelectorAll('.gk-step'));
        const nums = Array.from(section.querySelectorAll('.gk-journey__nums span'));
        const index = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        steps.forEach((step, position) => step.classList.toggle('is-on', position === index));
        nums.forEach((number, position) => number.classList.toggle('is-on', position === index));
        section.querySelector('.gk-journey__line span')?.style.setProperty('transform', `scaleY(${progress})`);
        const wrap = section.querySelector(':scope > .gk-wrap');
        wrap?.classList.toggle('is-scroll-pinned', bounds.top <= 0 && bounds.bottom > window.innerHeight);
      }
      if (section === aboutStory) {
        const stage = section.querySelector('.gk-about-story__stage');
        const pinned = bounds.top <= 0 && bounds.bottom > window.innerHeight;
        stage?.classList.toggle('is-scroll-pinned', pinned);
      }
      section.querySelectorAll('[data-product-frame]').forEach((frameElement) => {
        frameElement.style.setProperty('--p', progress.toFixed(4));
      });

      if (section === hero) {
        const heroProgress = Math.min(1, Math.max(0, (-bounds.top) / Math.max(bounds.height * 0.9, window.innerHeight * 0.9)));
        section.style.setProperty('--hero-scroll-progress', heroProgress.toFixed(4));
      }

      if (section === story) {
        updateStory(progress);
        wordmark?.classList.toggle('is-revealed', progress >= 0.85);
      }
      if (section === gearChapters && !smallScreen.matches && !reducedMotion.matches) {
        const index = Math.min(3, Math.floor(progress * 4));
        if (section.dataset.activeIndex !== String(index)) {
          section.dataset.active = String(index);
          section.dataset.activeIndex = String(index);
          window.setTimeout(() => {
            if (section.dataset.activeIndex !== String(index)) return;
            section.querySelectorAll('.gear-chapter').forEach((chapter, position) => {
              chapter.classList.toggle('is-active', position === index);
              chapter.setAttribute('aria-hidden', position === index ? 'false' : 'true');
            });
            section.querySelectorAll('.gear-chapter-rail i').forEach((dot, position) => {
              dot.classList.toggle('is-active', position === index);
            });
          }, 200);
        }
      }
      if (section === gearBundles) {
        section.querySelectorAll('.gear-bundle-card').forEach((card, index, cards) => {
          if (index === cards.length - 1) return;
          const nextCard = cards[index + 1].getBoundingClientRect();
          const covered = Math.min(1, Math.max(0, (window.innerHeight * .55 - nextCard.top) / (window.innerHeight * .55)));
          card.style.setProperty('--bundle-scale', String(1 - covered * .04));
          card.style.setProperty('--bundle-opacity', String(1 - covered * .30));
        });
      }
      if (section.classList.contains('site-bento__item')) {
        section.classList.toggle('is-covered', progress > 0.72);
        const itemIndex = practiceItems.indexOf(section);
        if (bounds.top <= window.innerHeight * 0.65 && bounds.bottom > window.innerHeight * 0.65) {
          practiceIndex = itemIndex;
        }
      }
    });

    if (statement && statementCue) {
      const bounds = statement.getBoundingClientRect();
      const travel = Math.max(bounds.height - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      statementCue.style.visibility = progress > 0.15 ? 'hidden' : 'visible';
    }

    if (practiceIndex !== -1) updatePracticeDots(practiceIndex);
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  const stop = () => {
    observer?.disconnect();
    observer = null;
    activeSections.clear();
    aboutWww?.classList.remove('is-enhanced');
    document.documentElement.classList.remove('scroll-story-enabled');
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const start = () => {
    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      stop();
      disableDials();
      return;
    }

    const observedSections = smallScreen.matches
      ? [...dialSections, ...sections.filter((section) => section.matches('[data-www]'))]
      : sections;
    if (!observedSections.length) {
      stop();
      return;
    }

    if (smallScreen.matches) document.documentElement.classList.remove('scroll-story-enabled');
    else {
      prepareText();
      document.documentElement.classList.add('scroll-story-enabled');
    }
    aboutWww?.classList.add('is-enhanced');
    dialSections.forEach((section) => {
      if (!dialStates.has(section)) {
        const state = setupDial(section);
        if (state) dialStates.set(section, state);
      } else {
        section.classList.add('is-enhanced');
        setDialGeometry(dialStates.get(section));
      }
    });
    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSections.add(entry.target);
        else activeSections.delete(entry.target);
      });
      schedule();
    }, { rootMargin: '100% 0px' });
    observedSections.forEach((section) => observer.observe(section));
  };

  if (aboutWwwPin && aboutWwwPointer) {
    aboutWwwPin.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = aboutWwwPin.getBoundingClientRect();
      aboutWwwPointer.style.transform = `translate3d(${event.clientX - bounds.left - 11}px, ${event.clientY - bounds.top - 11}px, 0)`;
      aboutWwwPointer.classList.add('is-visible');
    });
    aboutWwwPin.addEventListener('pointerleave', () => aboutWwwPointer.classList.remove('is-visible'));
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', () => {
    dialSections.forEach((section) => {
      const state = dialStates.get(section);
      if (state) setDialGeometry(state);
    });
    schedule();
  }, { passive: true });
  smallScreen.addEventListener('change', start);
  reducedMotion.addEventListener('change', start);
  start();
  schedule();
})();
