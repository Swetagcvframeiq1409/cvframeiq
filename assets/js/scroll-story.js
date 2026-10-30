(() => {
  'use strict';

  const smallScreen = window.matchMedia('(max-width: 899px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const sections = Array.from(document.querySelectorAll('[data-scroll-story]'));
  const activeSections = new Set();
  const story = document.getElementById('home-story');
  const slides = story ? Array.from(story.querySelectorAll('.home-story__slide')) : [];
  const hero = document.querySelector('.hero[data-scroll-story]');
  const statement = document.querySelector('.home-statement[data-scroll-story]');
  const statementCue = statement?.querySelector('.home-statement__scroll-cue');
  const gearStatement = document.querySelector('.gear-statement[data-scroll-story]');
  const gearBundles = document.querySelector('.gear-bundles[data-scroll-story]');
  const gearChapters = document.querySelector('.gear-chapters[data-scroll-story]');
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

  const render = () => {
    frame = 0;
    let practiceIndex = -1;

    activeSections.forEach((section) => {
      const bounds = section.getBoundingClientRect();
      const travel = Math.max(bounds.height - window.innerHeight, 1);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));
      section.style.setProperty('--p', progress.toFixed(4));
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
    document.documentElement.classList.remove('scroll-story-enabled');
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
  };

  const start = () => {
    if (smallScreen.matches || reducedMotion.matches || !('IntersectionObserver' in window)) {
      stop();
      return;
    }

    prepareText();
    document.documentElement.classList.add('scroll-story-enabled');
    observer?.disconnect();
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activeSections.add(entry.target);
        else activeSections.delete(entry.target);
      });
      schedule();
    }, { rootMargin: '100% 0px' });
    sections.forEach((section) => observer.observe(section));
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  smallScreen.addEventListener('change', start);
  reducedMotion.addEventListener('change', start);
  start();
  schedule();
})();
