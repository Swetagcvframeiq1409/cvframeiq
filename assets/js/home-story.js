(() => {
  'use strict';

  const section = document.querySelector('.hs-story');
  if (!section) return;

  const beats = Array.from(section.querySelectorAll('[data-hs-beat]'));
  const counter = section.querySelector('.hs-counter');
  const progressDot = section.querySelector('.hs-progress__dot');
  const rings = Array.from(section.querySelectorAll('.hs-ring'));
  const dots = Array.from(section.querySelectorAll('.hs-dot'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileViewport = window.matchMedia('(max-width: 767px)');
  let activeBeat = -1;
  let frame = 0;

  let storyObserver = null;
  function watchStoryVisibility() {
    if (storyObserver) storyObserver.disconnect();
    document.body.classList.remove('story-active');
    if (!mobileViewport.matches || !('IntersectionObserver' in window)) return;
    storyObserver = new IntersectionObserver((entries) => {
      document.body.classList.toggle('story-active', Boolean(entries[0] && entries[0].isIntersecting));
    }, { threshold: 0 });
    storyObserver.observe(section);
  }
  watchStoryVisibility();
  if (mobileViewport.addEventListener) mobileViewport.addEventListener('change', watchStoryVisibility);
  else mobileViewport.addListener(watchStoryVisibility);

  // ── Background image layers ──
  const bgImgs = [0, 1, 2].map(i => document.getElementById('hs-bg-' + i));

  function setBgLayer(index) {
    bgImgs.forEach((img, i) => {
      if (!img) return;
      const active = i === index;
      img.classList.toggle('is-active', active);
    });
  }

  // Hide broken images — keep gradient fallback, no broken icon
  bgImgs.forEach(img => {
    if (!img) return;
    img.addEventListener('error', () => {
      img.style.display = 'none';
    });
  });

  function splitWords(element) {
    if (element.dataset.hsReady) return;

    const text = element.textContent.trim();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    let index = 0;
    textNodes.forEach((textNode) => {
      const fragment = document.createDocumentFragment();
      textNode.textContent.split(/(\s+)/).forEach((part) => {
        if (!part || /^\s+$/.test(part)) {
          fragment.append(document.createTextNode(part));
          return;
        }
        const word = document.createElement('span');
        word.className = 'hs-word';
        word.setAttribute('aria-hidden', 'true');
        word.textContent = part;
        word.style.setProperty('--hs-word-index', String(index));
        fragment.append(word);
        index += 1;
      });
      textNode.replaceWith(fragment);
    });

    element.setAttribute('aria-label', text);
    element.dataset.hsReady = 'true';
  }

  section.querySelectorAll('[data-hs-words]').forEach(splitWords);
  const wordGroups = beats.map((beat) => Array.from(beat.querySelectorAll('.hs-word')));

  function setBeat(index) {
    if (index === activeBeat) return;
    const previousBeat = activeBeat;
    activeBeat = index;
    beats.forEach((beat, position) => {
      const active = position === index;
      const leaving = position === previousBeat;
      beat.classList.toggle('is-current', active);
      beat.classList.toggle('is-leaving', leaving);
      beat.setAttribute('aria-hidden', String(!active));
      if (leaving) {
        window.setTimeout(() => {
          if (position !== activeBeat) beat.classList.remove('is-leaving');
        }, 650);
      }
    });
    if (counter) counter.textContent = `${String(index + 1).padStart(2, '0')} / 03`;
    // Drive background image layer
    setBgLayer(index);
  }

  function render() {
    frame = 0;
    if (reducedMotion.matches) {
      activeBeat = -1;
      beats.forEach((beat) => beat.setAttribute('aria-hidden', 'false'));
      wordGroups.flat().forEach((word) => word.classList.add('is-lit'));
      rings.forEach((ring) => { ring.style.transform = ''; });
      dots.forEach((dot) => { dot.style.transform = ''; });
      if (progressDot) progressDot.style.top = '';
      if (counter) counter.textContent = '01 / 03';
      // Show first image layer instantly in reduced-motion mode
      setBgLayer(0);
      return;
    }

    const bounds = section.getBoundingClientRect();
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, -bounds.top / travel));
    const beatPosition = Math.min(beats.length, progress * beats.length);
    const index = Math.min(beats.length - 1, Math.floor(beatPosition));
    const beatProgress = Math.min(1, beatPosition - index);

    section.style.setProperty('--hs-progress', progress.toFixed(4));
    section.style.setProperty('--hs-x', `${25 + progress * 50}%`);
    section.style.setProperty('--hs-y', `${24 + progress * 34}%`);
    setBeat(index);

    wordGroups.forEach((words, beatIndex) => {
      words.forEach((word, wordIndex) => {
        const lit = beatIndex === index && wordIndex / Math.max(words.length, 1) <= beatProgress + 0.08;
        word.classList.toggle('is-lit', lit);
      });
    });

    if (progressDot) progressDot.style.top = `${progress * 100}%`;
    rings.forEach((ring, ringIndex) => {
      const direction = ringIndex % 2 ? 1 : -1;
      ring.style.transform = `translate3d(-50%, calc(-50% + ${direction * progress * (18 + ringIndex * 12)}px), 0)`;
    });
    dots.forEach((dot, dotIndex) => {
      const direction = dotIndex % 2 ? -1 : 1;
      dot.style.transform = `translate3d(0, ${direction * progress * (14 + dotIndex * 10)}px, 0)`;
    });
  }

  function schedule() {
    if (!frame) frame = window.requestAnimationFrame(render);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  reducedMotion.addEventListener('change', schedule);
  render();
})();
