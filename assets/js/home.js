(function () {
  'use strict';
  /* â”€â”€ Hero entrance â”€â”€ */
  var heroSection = document.querySelector('.home-hero');
  if (heroSection) {
    /* add class after paint so CSS transition fires */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { heroSection.classList.add('hero-js-ready'); });
    });
  }

  /* â”€â”€ Hero count-up (fires when stats strip enters viewport) â”€â”€ */
  var heroImage = document.querySelector('.hero-img-main[data-src]');
  var heroImageQuery = window.matchMedia('(min-width: 768px)');
  function loadHeroImage(event) {
    if (!heroImage || !heroImage.dataset.src || !event.matches || heroImage.getAttribute('src')) return;
    heroImage.src = heroImage.dataset.src;
    heroImage.removeAttribute('data-src');
  }
  loadHeroImage(heroImageQuery);
  if (heroImageQuery.addEventListener) heroImageQuery.addEventListener('change', loadHeroImage);
  else heroImageQuery.addListener(loadHeroImage);

  /* ── live results and FAQ ── */
  var carryoverHome = window.LIVE_CARRYOVER && window.LIVE_CARRYOVER.home;
  var homeResultsGrid = document.getElementById('homeResultsGrid');
  var homeFaqList = document.getElementById('homeFaqList');
  if (carryoverHome && homeResultsGrid && Array.isArray(carryoverHome.impactStats)) {
    carryoverHome.impactStats.slice(0, 4).forEach(function (stat) {
      if (!stat || !stat.value || !stat.label) return;
      var card = document.createElement('article');
      card.className = 'home-why__card home-results-card';
      var value = document.createElement('strong');
      value.className = 'home-why__value';
      value.textContent = stat.value === '2 3 wk' ? '2–3 wk' : stat.value;
      var label = document.createElement('span');
      label.className = 'home-why__label';
      label.textContent = stat.label;
      card.append(value, label);
      homeResultsGrid.appendChild(card);
    });
  }
  if (carryoverHome && homeFaqList && Array.isArray(carryoverHome.faq)) {
    carryoverHome.faq.filter(function (item) {
      return item && typeof item.question === 'string' && typeof item.answer === 'string';
    }).forEach(function (item, index) {
      var entry = document.createElement('div');
      entry.className = 'home-faq__item';
      var heading = document.createElement('h3');
      var trigger = document.createElement('button');
      trigger.className = 'home-faq__trigger';
      trigger.type = 'button';
      trigger.id = 'home-faq-question-' + index;
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-controls', 'home-faq-answer-' + index);
      var question = document.createElement('span');
      question.textContent = item.question;
      var icon = document.createElement('i');
      icon.className = 'bi bi-plus-lg';
      icon.setAttribute('aria-hidden', 'true');
      trigger.append(question, icon);
      heading.appendChild(trigger);

      var panel = document.createElement('div');
      panel.className = 'home-faq__panel';
      panel.id = 'home-faq-answer-' + index;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', trigger.id);
      panel.setAttribute('aria-hidden', 'true');
      panel.inert = true;
      var panelInner = document.createElement('div');
      panelInner.className = 'home-faq__panel-inner';
      var answer = document.createElement('p');
      answer.textContent = item.answer;
      panelInner.appendChild(answer);
      panel.appendChild(panelInner);
      entry.append(heading, panel);
      homeFaqList.appendChild(entry);
    });
    homeFaqList.addEventListener('click', function (event) {
      var selected = event.target.closest('.home-faq__trigger');
      if (!selected) return;
      var shouldOpen = selected.getAttribute('aria-expanded') !== 'true';
      homeFaqList.querySelectorAll('.home-faq__trigger').forEach(function (trigger) {
        var open = trigger === selected && shouldOpen;
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        trigger.setAttribute('aria-expanded', String(open));
        if (panel) {
          panel.setAttribute('aria-hidden', String(!open));
          panel.inert = !open;
        }
      });
    });
  }

  var heroStats = document.querySelector('.hero-stats');
  if (heroStats && 'IntersectionObserver' in window) {
    var heroCountObs = new IntersectionObserver(function (entries, obs) {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      heroStats.querySelectorAll('.hero-count').forEach(function (el) {
        var end = Number(el.dataset.count);
        var dec = Number(el.dataset.decimals || 0);
        var t0 = performance.now();
        (function tick(now) {
          var p = Math.min((now - t0) / 1000, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (end * eased).toFixed(dec);
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.4 });
    heroCountObs.observe(heroStats);
  }

  /* â”€â”€ Pointer tilt on image stack (max 3deg, hover only) â”€â”€ */
  var imgStack = document.getElementById('heroImgStack');
  var heroHoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
  var heroReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (imgStack && heroHoverQuery.matches) {
    imgStack.addEventListener('mousemove', function (e) {
      if (heroReducedMotion.matches) return;
      var r = imgStack.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var dx = (e.clientX - cx) / (r.width / 2);
      var dy = (e.clientY - cy) / (r.height / 2);
      imgStack.style.transform = 'perspective(900px) rotateY(' + (dx * 3) + 'deg) rotateX(' + (-dy * 3) + 'deg)';
    }, { passive: true });
    imgStack.addEventListener('mouseleave', function () {
      imgStack.style.transform = '';
    });
    var clearHeroTilt = function (event) {
      if (event.matches) imgStack.style.transform = '';
    };
    if (heroReducedMotion.addEventListener) {
      heroReducedMotion.addEventListener('change', clearHeroTilt);
    } else {
      heroReducedMotion.addListener(clearHeroTilt);
    }
  }

  /* â”€â”€ "See How It Works" smooth scroll â”€â”€ */
  var howItWorksBtn = document.getElementById('heroHowItWorks');
  if (howItWorksBtn) {
    howItWorksBtn.addEventListener('click', function (e) {
      var target = document.getElementById('how-it-works');
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  }

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── helpers ── */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function sectionP(el) {
    var r = el.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
  }

  function bindSpotlight(card) {
    card.addEventListener('mousemove', function (event) {
      var rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
    });
  }

  var techSection = document.querySelector('.home-technologies');
  if (techSection && 'IntersectionObserver' in window) {
    var techCards = Array.from(techSection.querySelectorAll('.home-tech-grid article'));
    var techObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        techObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    techCards.forEach(function (card, index) {
      card.style.setProperty('--i', index);
      bindSpotlight(card);
      techObserver.observe(card);
    });
    techSection.classList.add('js-ready');
  }

  var focusSection = document.querySelector('.home-focus');
  var focusCards = focusSection ? Array.from(focusSection.querySelectorAll('.home-focus-grid article')) : [];
  var processSection = document.querySelector('.home-process');
  var processCards = processSection ? Array.from(processSection.querySelectorAll('.home-process__card')) : [];
  focusCards.forEach(bindSpotlight);
  processCards.forEach(bindSpotlight);
  if ((focusCards.length || processCards.length) && 'IntersectionObserver' in window && !reduceMotion) {
    var focusObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        focusObserver.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    focusCards.concat(processCards).forEach(function (card, index) {
      card.style.setProperty('--i', index);
      focusObserver.observe(card);
    });
    focusSection?.classList.add('js-ready');
    processSection?.classList.add('js-ready');
  }

  /* -- progress bar -- */
  var progressBar = document.querySelector('.home-progress');

  /* ── statement word-reveal ── */
  var statement = document.querySelector('.home-statement');
  var words = [];
  document.querySelectorAll('[data-story-paragraph]').forEach(function (para) {
    var frag = document.createDocumentFragment();
    para.childNodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part || /^\s+$/.test(part)) { frag.append(document.createTextNode(part)); }
          else { var s = document.createElement('span'); s.className = 'home-word'; s.textContent = part; frag.append(s); words.push(s); }
        });
      } else { frag.append(node.cloneNode(true)); }
    });
    para.replaceChildren(frag);
  });

  /* ── story runway (3a: phase1 + phase2) ── */
  var storyRunway = document.getElementById('storyRunway');
  /* ── platform steps (3b: phase3 only) ── */
  var platformStory = document.getElementById('platformStory');
  var phase1 = document.getElementById('ppPhase1');
  var phase2 = document.getElementById('ppPhase2');
  var phase3 = document.getElementById('ppPhase3');
  var ppTarget = document.getElementById('ppTarget');
  var ppDash = document.getElementById('ppDash');
  var ppCurrent = document.getElementById('ppCurrent');
  var ppStepTitle = document.getElementById('ppStepTitle');
  var ppStepDesc = document.getElementById('ppStepDesc');
  var ppBullets = document.getElementById('ppBullets');
  var ppStepNotch = document.getElementById('ppStepNotch');
  var ppLines = [
    document.getElementById('ppLine0'),
    document.getElementById('ppLine1'),
    document.getElementById('ppLine2')
  ];

  var platformSteps = [
    {
      title: 'Understand',
      desc: 'Start with the operating context, visual inputs, and the need to address.',
      bullets: ['Define the visual problem', 'Map data sources and cameras', 'Agree on success criteria'],
      icon: 'bi-bullseye',
      gradA: '#3c2e88', gradB: '#1e1a54',
      imgAlt: 'A camera layout being reviewed over a facility floor plan',
    },
    {
      title: 'Build',
      desc: 'Shape a computer-vision approach around the intended use case.',
      bullets: ['Select model architecture', 'Prepare training data', 'Develop the pipeline'],
      icon: 'bi-cpu',
      gradA: '#2a4a8a', gradB: '#1a2e6a',
      imgAlt: 'An operator monitoring multiple camera feeds at a workstation'
    },
    {
      title: 'Validate',
      desc: 'Review the approach against relevant conditions and requirements.',
      bullets: ['Test on real-world data', 'Measure accuracy and latency', 'Iterate on edge cases'],
      icon: 'bi-patch-check',
      gradA: '#1a6a5a', gradB: '#0e3a3a',
      imgAlt: 'A camera inspecting a product on a factory line'
    },
    {
      title: 'Deploy',
      desc: 'Prepare the system for its intended environment.',
      bullets: ['Edge or cloud deployment', 'Integrate with existing systems', 'Set up monitoring'],
      icon: 'bi-rocket-takeoff',
      gradA: '#4a2a7a', gradB: '#2a1a5a',
      imgAlt: 'An industrial edge-computing cabinet connected to a camera network'
    },
    {
      title: 'Impact',
      desc: 'Bring useful visual intelligence into the intended operation.',
      bullets: ['Track business outcomes', 'Continuous improvement', 'Scale across sites'],
      icon: 'bi-graph-up-arrow',
      gradA: '#5a3a8a', gradB: '#3a1a6a',
      imgAlt: 'A camera network monitored from a control room'
    }
  ];

  var currentPlatformStep = -1;
  var autoplayTimer = null;
  var autoplayLocked = false;

  /* ── Process section images ── */
  var ppImgPaths = [
    'assets/img/story/understand.webp',
    'assets/img/story/build.webp',
    'assets/img/story/validate.webp',
    'assets/img/story/deploy.webp',
    'assets/img/story/impact.webp'
  ];
  var ppVisualRequest = 0;
  var ppStepRequest = 0;
  var ppActiveVisual = null;

  function preloadPlatformImages() {
    ppImgPaths.forEach(function (path) {
      var image = new Image();
      image.decoding = 'async';
      image.src = path;
    });
  }

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(preloadPlatformImages, { timeout: 2000 });
  } else {
    window.setTimeout(preloadPlatformImages, 0);
  }

  function createStepExplorerMarkup() {
    if (!phase3 || phase3.querySelector('.hp-step-content')) return;

    var stepperBtns = platformSteps.map(function (step, index) {
      var active = index === 0;
      return '<button class="hp-step-btn' + (active ? ' is-active' : '') + '"' +
        ' type="button" role="tab"' +
        ' aria-selected="' + active + '"' +
        ' aria-label="Step ' + (index + 1) + ': ' + step.title + '"' +
        ' aria-controls="hp-step-panel"' +
        ' id="hp-step-tab-' + index + '"' +
        ' tabindex="' + (active ? '0' : '-1') + '"' +
        ' data-pp-step="' + index + '">' +
        '<span class="hp-step-btn__icon" aria-hidden="true">' + String(index + 1).padStart(2, '0') + '</span>' +
        '<span class="hp-step-btn__label">' + step.title + '</span>' +
        '</button>';
    }).join('');

    var mobileCards = platformSteps.map(function (step, index) {
      return '<article class="hp-step-mobile-card" data-mobile-step="' + index + '">' +
        '<div class="hp-step-mobile-visual">' +
          '<img src="' + ppImgPaths[index] + '" alt="' + step.imgAlt + '" width="1200" height="900" loading="lazy" decoding="async">' +
        '</div>' +
        '<div class="hp-step-mobile-copy">' +
          '<p class="hp-step-mobile-counter">' + String(index + 1).padStart(2, '0') + ' / 05</p>' +
          '<h3>' + step.title + '</h3>' +
          '<p class="hp-step-mobile-desc">' + step.desc + '</p>' +
          '<ul>' + step.bullets.map(function (bullet) {
            return '<li><i class="bi bi-check2-circle" aria-hidden="true"></i><span>' + bullet + '</span></li>';
          }).join('') + '</ul>' +
        '</div>' +
      '</article>';
    }).join('');

    phase3.innerHTML =
      '<div class="hp-step-desktop">' +
        '<div class="hp-step-content" id="hp-step-panel" role="tabpanel" aria-labelledby="hp-step-tab-0">' +
          '<div class="hp-step-left">' +
            '<span class="hp-step-ghost" aria-hidden="true" id="ppGhost">01</span>' +
            '<div class="hp-step-counter-row" aria-live="polite">' +
              '<span class="hp-step-counter__line" aria-hidden="true"></span>' +
              '<span class="hp-step-counter" id="ppCurrent">01</span>' +
              '<span class="hp-step-counter__sep"> / 05</span>' +
            '</div>' +
            '<h3 class="home-pp-step-title" id="ppStepTitle">Understand</h3>' +
            '<p class="home-pp-desc" id="ppStepDesc">Start with the operating context, visual inputs, and the need to address.</p>' +
            '<ul class="hp-step-bullets" id="ppBullets">' +
              '<li><i class="bi bi-check2-circle" aria-hidden="true"></i><span>Define the visual problem</span></li>' +
              '<li><i class="bi bi-check2-circle" aria-hidden="true"></i><span>Map data sources and cameras</span></li>' +
              '<li><i class="bi bi-check2-circle" aria-hidden="true"></i><span>Agree on success criteria</span></li>' +
            '</ul>' +
          '</div>' +
          '<div class="hp-step-visual" aria-hidden="true">' +
            '<img class="hp-step-img" id="ppStepImg" width="1200" height="900" decoding="async">' +
            '<img class="hp-step-img" id="ppStepImgNext" width="1200" height="900" decoding="async">' +
            '<span class="hp-step-fallback-icon" id="ppFallbackIcon"><i class="bi bi-bullseye" aria-hidden="true"></i></span>' +
            '<span class="hp-step-bracket hp-step-bracket--tl" aria-hidden="true"></span>' +
            '<span class="hp-step-bracket hp-step-bracket--tr" aria-hidden="true"></span>' +
            '<span class="hp-step-bracket hp-step-bracket--bl" aria-hidden="true"></span>' +
            '<span class="hp-step-bracket hp-step-bracket--br" aria-hidden="true"></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="hp-step-stepper-row">' +
        '<nav class="hp-step-stepper" role="tablist" aria-label="How FrameIQ works steps" id="ppStepsNav">' +
          stepperBtns +
        '</nav>' +
        '<div class="hp-step-arrows">' +
          '<button class="hp-step-arrow" type="button" data-platform-step-control="prev" aria-label="Previous step"><i class="bi bi-arrow-left" aria-hidden="true"></i></button>' +
          '<button class="hp-step-arrow" type="button" data-platform-step-control="next" aria-label="Next step"><i class="bi bi-arrow-right" aria-hidden="true"></i></button>' +
        '</div>' +
      '</div>' +
      '<div class="hp-step-mobile-list" aria-label="How FrameIQ works steps">' + mobileCards + '</div>';

    var homePlatform = platformStory && platformStory.closest('.home-platform');
    if (homePlatform) homePlatform.classList.add('is-story-enhanced');
  }

  function refreshPlatformReferences() {
    ppCurrent = document.getElementById('ppCurrent');
    ppStepTitle = document.getElementById('ppStepTitle');
    ppStepDesc = document.getElementById('ppStepDesc');
    ppBullets = document.getElementById('ppBullets');
    ppStepNotch = document.getElementById('ppStepNotch');
  }

  /* Keep the current image visible until the next image is decoded. */
  function ppUpdateVisual(idx) {
    var firstImage = document.getElementById('ppStepImg');
    var secondImage = document.getElementById('ppStepImgNext');
    var fallbackIcon = document.getElementById('ppFallbackIcon');
    var visual = firstImage ? firstImage.closest('.hp-step-visual') : null;
    var ghost = document.getElementById('ppGhost');
    if (ghost) ghost.textContent = String(idx + 1).padStart(2, '0');
    if (!firstImage || !secondImage || !visual) return;
    var path = ppImgPaths[idx];
    var request = ++ppVisualRequest;
    var s = platformSteps[idx];
    visual.style.setProperty('--pp-grad-a', s ? s.gradA || '#6244bd' : '#6244bd');
    visual.style.setProperty('--pp-grad-b', s ? s.gradB || '#253274' : '#253274');
    if (fallbackIcon) {
      var fi = fallbackIcon.querySelector('i');
      if (fi && s) fi.className = 'bi ' + s.icon;
    }
    var image = ppActiveVisual === firstImage ? secondImage : firstImage;
    image.alt = s ? s.imgAlt || '' : '';
    image.src = path;
    var decoded;
    if (typeof image.decode === 'function') {
      decoded = image.decode();
    } else if (image.complete && image.naturalWidth > 0) {
      decoded = Promise.resolve();
    } else {
      decoded = new Promise(function (resolve, reject) {
        image.onload = resolve;
        image.onerror = reject;
      });
    }

    decoded.then(function () {
      if (request !== ppVisualRequest) return;
      var previous = ppActiveVisual;
      image.style.zIndex = '2';
      image.classList.add('hp-img--loaded', 'is-active');
      if (previous && previous !== image) previous.style.zIndex = '1';
      ppActiveVisual = image;
      visual.classList.add('has-loaded-image');
      window.setTimeout(function () {
        if (request === ppVisualRequest && previous && previous !== image) {
          previous.classList.remove('is-active', 'hp-img--loaded');
        }
      }, 220);
    }).catch(function (error) {
      if (request !== ppVisualRequest) return;
      if (!ppActiveVisual) visual.classList.add('hp-visual--fallback');
      console.error('Unable to decode platform story image:', path, error);
    });
  }

  function updatePlatformButtons(stepIndex) {
    /* legacy nav (home-pp-steps-nav) */
    var nav = document.querySelector('.home-pp-steps-nav');
    var total = document.querySelectorAll('[data-pp-step]').length || 1;
    var progress = total > 1 ? (stepIndex / (total - 1)) * 100 : 0;
    if (nav) nav.style.setProperty('--step-progress', progress + '%');

    /* new stepper (hp-step-stepper) */
    var hpNav = document.getElementById('ppStepsNav');
    if (hpNav) hpNav.style.setProperty('--hp-step-progress', progress + '%');
    var desktopControls = window.innerWidth >= 1024;
    var previousControl = document.querySelector('[data-platform-step-control="prev"]');
    var nextControl = document.querySelector('[data-platform-step-control="next"]');
    if (previousControl) previousControl.disabled = desktopControls && stepIndex === 0;
    if (nextControl) nextControl.disabled = desktopControls && stepIndex === platformSteps.length - 1;

    var activeButton = null;
    document.querySelectorAll('[data-pp-step]').forEach(function (btn) {
      var active = Number(btn.dataset.ppStep) === stepIndex;
      btn.classList.toggle('is-active', active);
      btn.classList.toggle('is-completed', Number(btn.dataset.ppStep) < stepIndex);
      btn.setAttribute('aria-selected', String(active));
      btn.setAttribute('tabindex', active ? '0' : '-1');
      if (active) activeButton = btn;
    });
    document.querySelectorAll('[data-mobile-step]').forEach(function (card) {
      var active = Number(card.dataset.mobileStep) === stepIndex;
      card.classList.toggle('is-active', active);
      if (active) card.setAttribute('aria-current', 'step');
      else card.removeAttribute('aria-current');
    });
    if (activeButton && window.innerWidth < 768) {
      var stepper = activeButton.closest('.hp-step-stepper');
      if (stepper) {
        var left = activeButton.offsetLeft - (stepper.clientWidth - activeButton.offsetWidth) / 2;
        stepper.scrollTo({ left: Math.max(0, left), behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
  }

  function setPlatformStep(step) {
    var bounded = clamp(step, 0, platformSteps.length - 1);
    if (bounded === currentPlatformStep) return;
    currentPlatformStep = bounded;
    var request = ++ppStepRequest;

    /* text upward-fade out */
    var left = document.querySelector('.hp-step-left');
    if (left && !reduceMotion) left.classList.add('hp-step-left--changing');

    if (!ppStepTitle) return;
    ppStepTitle.classList.add('is-changing');

    var delay = reduceMotion ? 0 : 120;
    setTimeout(function () {
      if (request !== ppStepRequest) return;
      var s = platformSteps[bounded];
      if (ppCurrent) ppCurrent.textContent = String(bounded + 1).padStart(2, '0');
      if (ppStepNotch) ppStepNotch.textContent = s.title;
      ppStepTitle.textContent = s.title;
      if (ppStepDesc) ppStepDesc.textContent = s.desc;
      if (ppBullets) ppBullets.innerHTML = s.bullets.map(function (b) {
        return '<li><i class="bi bi-check2-circle" aria-hidden="true"></i><span>' + b + '</span></li>';
      }).join('');
      var stepIcon = document.querySelector('.home-platform-step-icon i');
      if (stepIcon) stepIcon.className = 'bi ' + s.icon;
      updatePlatformButtons(bounded);
      ppUpdateVisual(bounded);
      ppStepTitle.classList.remove('is-changing');
      if (left) left.classList.remove('hp-step-left--changing');
      /* update tabpanel labelledby */
      var panel = document.getElementById('hp-step-panel');
      if (panel) panel.setAttribute('aria-labelledby', 'hp-step-tab-' + bounded);
    }, delay);
  }

  function clearAutoplay() {
    if (autoplayTimer) {
      window.clearTimeout(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function queueAutoplay() {
    if (reduceMotion || autoplayLocked || window.innerWidth < 992) return;
    clearAutoplay();
    var section = platformStory || phase3;
    if (!section) return;
    var rect = section.getBoundingClientRect();
    var visible = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
    if (!visible) return;
    autoplayTimer = window.setTimeout(function () {
      var next = currentPlatformStep >= platformSteps.length - 1 ? 0 : currentPlatformStep + 1;
      setPlatformStep(next);
      queueAutoplay();
    }, 7000);
  }

  function unlockAutoplay() {
    autoplayLocked = true;
    clearAutoplay();
  }

  function scrollPlatformToStep(step) {
    if (!platformStory) return;
    if (window.innerWidth < 992 || reduceMotion) {
      var card = platformStory.querySelector('[data-mobile-step="' + step + '"]');
      if (card) card.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center'
      });
      return;
    }
    var start = platformStory.getBoundingClientRect().top + window.scrollY;
    var travel = Math.max(0, platformStory.offsetHeight - window.innerHeight);
    var progress = (step + 0.5) / platformSteps.length;
    window.scrollTo({
      top: start + travel * progress,
      behavior: reduceMotion ? 'auto' : 'smooth'
    });
  }

  function bindMobileStepObserver() {
    var cards = platformStory ? platformStory.querySelectorAll('[data-mobile-step]') : [];
    if (!cards.length || !('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      if (window.innerWidth >= 992 && !reduceMotion) return;
      var visible = entries.filter(function (entry) { return entry.isIntersecting; });
      if (!visible.length) return;
      visible.sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
      setPlatformStep(Number(visible[0].target.dataset.mobileStep));
    }, { rootMargin: '-30% 0px -30% 0px', threshold: [0, 0.25, 0.5, 0.75] });
    Array.prototype.forEach.call(cards, function (card) { observer.observe(card); });
  }

  function bindPlatformControls() {
    document.querySelectorAll('[data-pp-step]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        unlockAutoplay();
        var step = Number(btn.dataset.ppStep);
        setPlatformStep(step);
        scrollPlatformToStep(step);
      });
    });

    /* keyboard on stepper: Left/Right/Home/End */
    var hpNav = document.getElementById('ppStepsNav');
    if (hpNav) {
      hpNav.addEventListener('keydown', function (e) {
        var btns = Array.from(hpNav.querySelectorAll('[data-pp-step]'));
        var cur = btns.indexOf(document.activeElement);
        if (cur < 0) cur = btns.findIndex(function (b) { return Number(b.dataset.ppStep) === currentPlatformStep; });
        var next = -1;
        if (e.key === 'ArrowRight') next = (cur + 1) % btns.length;
        else if (e.key === 'ArrowLeft') next = (cur - 1 + btns.length) % btns.length;
        else if (e.key === 'Home') next = 0;
        else if (e.key === 'End') next = btns.length - 1;
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); return; }
        if (next < 0) return;
        e.preventDefault();
        unlockAutoplay();
        setPlatformStep(next);
        scrollPlatformToStep(next);
        btns[next].focus();
      });
    }

    var prevCtrl = document.querySelector('[data-platform-step-control="prev"]');
    var nextCtrl = document.querySelector('[data-platform-step-control="next"]');
    prevCtrl && prevCtrl.addEventListener('click', function () {
      unlockAutoplay();
      var step = window.innerWidth >= 1024
        ? currentPlatformStep - 1
        : (currentPlatformStep - 1 + platformSteps.length) % platformSteps.length;
      setPlatformStep(step);
      scrollPlatformToStep(step);
    });
    nextCtrl && nextCtrl.addEventListener('click', function () {
      unlockAutoplay();
      var step = window.innerWidth >= 1024
        ? currentPlatformStep + 1
        : (currentPlatformStep + 1) % platformSteps.length;
      setPlatformStep(step);
      scrollPlatformToStep(step);
    });
    window.addEventListener('resize', function () {
      updatePlatformButtons(currentPlatformStep);
    }, { passive: true });

    /* touch swipe on the card */
    var ppCard = document.getElementById('platformPanel');
    if (ppCard && window.innerWidth >= 768) {
      var ppTouchX = null;
      ppCard.addEventListener('touchstart', function (e) {
        ppTouchX = e.touches[0].clientX;
      }, { passive: true });
      ppCard.addEventListener('touchend', function (e) {
        if (ppTouchX === null) return;
        var dx = e.changedTouches[0].clientX - ppTouchX;
        ppTouchX = null;
        if (Math.abs(dx) < 40) return;
        unlockAutoplay();
        setPlatformStep(dx < 0
          ? (currentPlatformStep + 1) % platformSteps.length
          : (currentPlatformStep - 1 + platformSteps.length) % platformSteps.length);
      }, { passive: true });
    }

    var panel = document.getElementById('platformPanel');
    if (panel) {
      panel.addEventListener('pointermove', function (event) {
        var rect = panel.getBoundingClientRect();
        var x = ((event.clientX - rect.left) / rect.width) * 100;
        var y = ((event.clientY - rect.top) / rect.height) * 100;
        panel.style.setProperty('--mx', x + '%');
        panel.style.setProperty('--my', y + '%');
      }, { passive: true });
      panel.addEventListener('pointerleave', function () {
        panel.style.removeProperty('--mx');
        panel.style.removeProperty('--my');
      });
      panel.addEventListener('mouseenter', function () {
        if (!autoplayLocked) clearAutoplay();
      });
      panel.addEventListener('mouseleave', function () {
        if (!autoplayLocked) queueAutoplay();
      });
      panel.addEventListener('focusin', function () {
        if (!autoplayLocked) clearAutoplay();
      });
      panel.addEventListener('focusout', function () {
        if (!autoplayLocked) queueAutoplay();
      });
    }

    if (platformStory && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        var ratio = entries[0] ? entries[0].intersectionRatio : 0;
        if (ratio >= 0.6) {
          if (!autoplayLocked) queueAutoplay();
        } else {
          clearAutoplay();
        }
      }, { threshold: [0.6] });
      observer.observe(platformStory);
    }
  }

  /* Initialise the advanced explorer without leaving the previous section behaviour intact */
  createStepExplorerMarkup();
  refreshPlatformReferences();
  setPlatformStep(0);
  bindPlatformControls();
  bindMobileStepObserver();

  /* ── pillars ── */
  var pillars = Array.from(document.querySelectorAll('.home-pillar-card'));
  var pillarSection = document.querySelector('.home-pillars');
  var pillarDots = Array.from(document.querySelectorAll('[data-pillar-dot]'));
  var pillarDotList = document.querySelector('.home-pillar-dots');
  var pillarCounter = document.getElementById('pillarCounter');
  var activePillarIndex = -1;

  function setActivePillar(index) {
    if (!pillars.length) return;
    activePillarIndex = clamp(index, 0, pillars.length - 1);
    pillarDots.forEach(function (dot, dotIndex) {
      var isActive = dotIndex === activePillarIndex;
      dot.classList.toggle('is-active', isActive);
      if (isActive) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    if (pillarCounter) {
      pillarCounter.textContent = String(activePillarIndex + 1).padStart(2, '0') + ' / 04';
    }
  }

  function getActivePillarIndex() {
    if (!pillars.length || !pillarSection) return 0;

    var sectionRect = pillarSection.getBoundingClientRect();
    var header = document.querySelector('.site-header');
    var headerBottom = header ? header.getBoundingClientRect().bottom : 0;
    if (sectionRect.top >= window.innerHeight) return 0;
    if (sectionRect.bottom <= headerBottom) return pillars.length - 1;

    var markerY = Math.max(headerBottom + 12, Math.min(window.innerHeight * 0.42, window.innerHeight - 1));
    var activeIndex = 0;
    var nearestDistance = Infinity;
    pillars.forEach(function (card, index) {
      var rect = card.getBoundingClientRect();
      var distance = markerY < rect.top ? rect.top - markerY : markerY > rect.bottom ? markerY - rect.bottom : 0;
      if (distance === 0 || distance < nearestDistance) {
        activeIndex = index;
        nearestDistance = distance;
      }
    });
    return activeIndex;
  }

  var pillarUpdateQueued = false;
  function schedulePillarUpdate() {
    if (pillarUpdateQueued) return;
    pillarUpdateQueued = true;
    requestAnimationFrame(function () {
      pillarUpdateQueued = false;
      setActivePillar(getActivePillarIndex());
    });
  }

  window.addEventListener('scroll', schedulePillarUpdate, { passive: true });
  window.addEventListener('resize', schedulePillarUpdate);
  schedulePillarUpdate();

  /* ── single rAF scroll loop ── */
  var ticking = false;
  function onScroll() {
    if (!ticking) { requestAnimationFrame(tick); ticking = true; }
  }
  function tick() {
    ticking = false;
    var scrollTop = window.scrollY || 0;
    var scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

    /* progress bar */
    if (progressBar) progressBar.style.transform = 'scaleX(' + clamp(scrollTop / scrollable, 0, 1) + ')';

    /* statement words */
    if (statement && !reduceMotion) {
      var p = sectionP(statement);
      words.forEach(function (w, i) {
        w.style.opacity = clamp((p * words.length - i) / 1.5, 0.68, 1).toFixed(2);
      });
    }

    /* story runway phases (3a) */
    if (storyRunway && !reduceMotion) {
      var sp = sectionP(storyRunway);
      var inP1 = sp < 0.5;
      var inP2 = sp >= 0.5;
      if (phase1) phase1.classList.toggle('is-out', !inP1);
      if (phase2) { phase2.classList.toggle('is-in', inP2); phase2.classList.toggle('is-out', !inP2); }
      if (inP2) {
        var p2 = (sp - 0.5) / 0.5;
        ppLines.forEach(function (line, i) {
          if (line) line.classList.toggle('is-lit', p2 > (i / ppLines.length));
        });
      }
      if (ppTarget) {
        var sz = Math.round(112 - sp * 40);
        ppTarget.style.width = sz + 'px';
        ppTarget.style.height = sz + 'px';
      }
      if (ppDash) ppDash.style.width = (sp * 100).toFixed(1) + '%';
    }

    /* platform steps (3b) — drive on all viewport widths */
    if (platformStory && !reduceMotion && window.innerWidth >= 992) {
      var pp = sectionP(platformStory);
      var step = clamp(Math.floor(pp * platformSteps.length), 0, platformSteps.length - 1);
      setPlatformStep(step);
    }

  }

  if (!reduceMotion) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', tick);
    tick();
  }

  /* Dot clicks intentionally scroll only in response to a direct user action. */
  if (pillarDotList) {
    pillarDotList.addEventListener('click', function (event) {
      var clickedDot = event.target.closest('[data-pillar-dot]');
      if (!clickedDot) return;

      var index = pillarDots.indexOf(clickedDot);
      if (event.detail > 0) {
        var listLeft = pillarDotList.getBoundingClientRect().left;
        var nearestDistance = Infinity;
        pillarDots.forEach(function (dot, dotIndex) {
          var visualLeft = listLeft + dotIndex * 16 + (activePillarIndex < dotIndex ? 16 : 0);
          var visualWidth = dotIndex === activePillarIndex ? 24 : 8;
          var distance = Math.abs(event.clientX - (visualLeft + visualWidth / 2));
          if (distance < nearestDistance) {
            nearestDistance = distance;
            if (distance <= 16) index = dotIndex;
          }
        });
        if (pillarDots[index] !== clickedDot) pillarDots[index].focus({ preventScroll: true });
      }

      if (pillars[index]) {
        pillars[index].scrollIntoView({
          behavior: reduceMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    });
  }

  /* ── reveal ── */
  var reveals = Array.from(document.querySelectorAll('[data-reveal]'));
  if ('IntersectionObserver' in window && !reduceMotion) {
    document.documentElement.classList.add('js-reveal');
    var revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { revealObs.observe(el); });
  }
  setTimeout(function () { reveals.forEach(function (el) { el.classList.add('is-visible'); }); }, 2500);

  /* ── count-up ── */
  if ('IntersectionObserver' in window && !reduceMotion) {
    var countObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var end = Number(el.dataset.count);
        var suffix = el.dataset.suffix || '';
        var dec = String(end).split('.')[1];
        var t0 = performance.now();
        (function count(now) {
          var pv = clamp((now - t0) / 900, 0, 1);
          el.textContent = (end * (1 - Math.pow(1 - pv, 3))).toFixed(dec ? dec.length : 0) + suffix;
          if (pv < 1) requestAnimationFrame(count);
        })(t0);
        obs.unobserve(el);
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach(function (el) { countObs.observe(el); });
  }

  /* ── industries carousel (rebuilt Prompt 24) ── */
  var hiSectors = window.SECTORS || [];
  /* ordered list matching the 8 pill buttons */
  var hiData = [
    {
      slug: 'manufacturing',
      icon: 'bi-gear-wide-connected',
      img:  'assets/img/manufacturing.webp',
      alt:  'Industrial camera above a manufacturing conveyor',
      gradA: '#6244bd', gradB: '#253274',
      chips: ['Safety & PPE', 'Quality control', 'Hazard detection'],
      href: 'pages/sectors/manufacturing.html'
    },
    {
      slug: 'agriculture',
      icon: 'bi-flower2',
      img:  'assets/img/Agriculture.webp',
      alt:  'A crop field with a smartphone in the foreground',
      gradA: '#1e6b52', gradB: '#134e4a',
      chips: ['Crop imagery review', 'Field observation', 'Livestock observation'],
      href: 'pages/sectors/agriculture.html'
    },
    {
      slug: 'healthcare',
      icon: 'bi-heart-pulse',
      img:  'assets/img/healthcare.webp',
      alt:  'Hospital corridor monitored by AI vision system',
      gradA: '#1a7a82', gradB: '#1a4e7a',
      chips: ['Patient monitoring', 'Facility safety', 'Staff & access'],
      href: 'pages/sectors/healthcare.html'
    },
    {
      slug: 'retail',
      icon: 'bi-bag',
      img:  'assets/img/retail.webp',
      alt:  'Retail store aisle with shelf-monitoring camera',
      gradA: '#8c3070', gradB: '#4a2878',
      chips: ['Footfall & movement', 'Shelf review', 'Queue review'],
      href: 'pages/sectors/retail.html'
    },
    {
      slug: 'smart-city',
      icon: 'bi-buildings',
      img:  'assets/img/smart-cities.webp',
      alt:  'City intersection with traffic monitoring cameras',
      gradA: '#2a5ea8', gradB: '#1e2e7a',
      chips: ['Traffic', 'Infrastructure condition', 'Public spaces'],
      href: 'pages/sectors/smart-city.html'
    },
    {
      slug: 'banking',
      icon: 'bi-bank',
      img:  'assets/img/build-image.webp',
      alt:  'An operator monitoring multiple camera feeds at a workstation',
      gradA: '#3c3a88', gradB: '#5a4420',
      chips: ['Fraud detection', 'Branch operations', 'KYC & onboarding'],
      href: 'pages/sectors/banking.html'
    },
    {
      slug: 'aviation',
      icon: 'bi-airplane',
      img:  'assets/img/aviation.webp',
      alt:  'An industrial camera network connected to an edge-computing cabinet',
      gradA: '#2878b0', gradB: '#1e3a88',
      chips: ['Security & access', 'Baggage operations', 'Passenger flow'],
      href: 'pages/sectors/aviation.html'
    },
    {
      slug: 'security-surveillance',
      icon: 'bi-shield-check',
      img:  'assets/img/impact.webp',
      alt:  'A camera network monitored from a control room',
      gradA: '#5c2e8a', gradB: '#6a1e30',
      chips: ['Perimeter', 'Access control', 'Behaviour review'],
      href: 'pages/sectors/security-surveillance.html'
    }
  ];

  var hiTabs   = Array.from(document.querySelectorAll('.hi-pills [role="tab"]'));
  var hiPanel  = document.getElementById('hi-panel');
  var hiImg    = hiPanel ? hiPanel.querySelector('.hi-art__img') : null;
  var hiArt    = hiPanel ? hiPanel.querySelector('.hi-art') : null;
  var hiIcon   = hiPanel ? hiPanel.querySelector('.hi-art__icon i') : null;
  var hiNum    = document.getElementById('hi-number');
  var hiTag    = document.getElementById('hi-tag');
  var hiTitle  = document.getElementById('hi-title');
  var hiDesc   = document.getElementById('hi-desc');
  var hiChips  = document.getElementById('hi-chips');
  var hiCta    = document.getElementById('hi-cta');
  var hiPrev   = document.getElementById('hi-prev');
  var hiNext   = document.getElementById('hi-next');
  var hiIdx    = 0;
  var hiAutoTimer = null;
  var hiAutoPaused = false;
  var HI_AUTOPLAY_MS = 6000;

  /* get summary from SECTORS data, strip trailing "on enquiry" sentence if a shorter
     version exists — we only trim the display copy, never rewrite meaning */
  function hiSummary(slug) {
    var s = hiSectors.find(function (x) { return x.slug === slug; });
    if (!s) return 'More details coming soon';
    /* shorten: remove the last sentence if it ends with "on enquiry." */
    var text = s.summary || 'More details coming soon';
    var shortened = text.replace(/[^.!?]*(?:confirmed|discussed) on enquiry\.?\s*$/i, '').trim();
    return shortened || text;
  }

  /* preload an image by slug index */
  function hiPreload(idx) {
    var d = hiData[idx];
    if (!d || !d.img) return;
    var pre = new Image();
    pre.src = d.img;
  }

  function hiApply(idx, animate) {
    var d = hiData[idx];
    if (!d) return;

    /* update ARIA on tabs */
    hiTabs.forEach(function (btn, i) {
      var active = i === idx;
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
      /* reset pill fill animation */
      btn.classList.remove('hi-pill--playing');
    });
    if (hiPanel) hiPanel.setAttribute('aria-labelledby', 'hi-tab-' + idx);

    /* animate panel */
    if (animate && hiPanel && !reduceMotion) {
      hiPanel.classList.remove('hi-is-changing');
      void hiPanel.offsetWidth;
      hiPanel.classList.add('hi-is-changing');
    }

    /* swap image */
    if (hiImg) {
      if (d.img) {
        hiImg.src = d.img;
        hiImg.alt = d.alt;
        hiImg.loading = idx === 0 ? 'eager' : 'lazy';
        hiImg.classList.remove('hi-img--error');
        hiArt && hiArt.classList.remove('hi-art--fallback');
      } else {
        /* no photo — show fallback immediately */
        hiImg.classList.add('hi-img--error');
        hiArt && hiArt.classList.add('hi-art--fallback');
      }
    }
    /* fallback gradient colours */
    if (hiArt) {
      hiArt.style.setProperty('--hi-grad-a', d.gradA);
      hiArt.style.setProperty('--hi-grad-b', d.gradB);
    }
    /* fallback icon */
    if (hiIcon) hiIcon.className = 'bi ' + d.icon;

    /* update text after short delay so crossfade covers the swap */
    var delay = (animate && !reduceMotion) ? 140 : 0;
    setTimeout(function () {
      if (hiNum)   hiNum.textContent   = String(idx + 1).padStart(2, '0') + ' / 08';
      if (hiTag)   hiTag.textContent   = hiTabs[idx] ? hiTabs[idx].textContent : '';
      if (hiTitle) hiTitle.textContent = hiTabs[idx] ? hiTabs[idx].textContent : '';
      if (hiDesc)  hiDesc.textContent  = hiSummary(d.slug);
      if (hiChips) {
        hiChips.innerHTML = d.chips.map(function (c) {
          return '<li><i class="bi bi-check2" aria-hidden="true"></i>' + c + '</li>';
        }).join('');
      }
      if (hiCta) hiCta.href = d.href;
      if (hiPanel) hiPanel.classList.remove('hi-is-changing');
    }, delay);

    /* preload next */
    hiPreload((idx + 1) % hiData.length);
  }

  function hiGo(idx, animate, userInitiated) {
    hiIdx = ((idx % hiData.length) + hiData.length) % hiData.length;
    hiApply(hiIdx, animate !== false);
    var activeBtn = hiTabs[hiIdx];
    /* scroll pill row container horizontally — only on explicit user action, never on autoplay or init */
    if (userInitiated && activeBtn) {
      var pillRow = activeBtn.closest('.hi-pills');
      if (pillRow) {
        var btnLeft = activeBtn.offsetLeft;
        var btnRight = btnLeft + activeBtn.offsetWidth;
        var rowLeft = pillRow.scrollLeft;
        var rowRight = rowLeft + pillRow.clientWidth;
        /* only scroll if the pill is outside the visible strip */
        if (btnLeft < rowLeft || btnRight > rowRight) {
          pillRow.scrollTo({
            left: btnLeft - Math.max(0, (pillRow.clientWidth - activeBtn.offsetWidth) / 2),
            behavior: reduceMotion ? 'auto' : 'smooth'
          });
        }
      }
    }
    /* restart pill fill on active tab */
    if (!reduceMotion) {
      setTimeout(function () {
        if (activeBtn) {
          activeBtn.classList.remove('hi-pill--playing');
          void activeBtn.offsetWidth;
          activeBtn.classList.add('hi-pill--playing');
        }
      }, 20);
    }
  }

  /* autoplay */
  function hiStartAuto() {
    if (reduceMotion || hiAutoPaused) return;
    hiStopAuto();
    hiAutoTimer = window.setInterval(function () {
      if (!document.hidden) hiGo(hiIdx + 1, true);
    }, HI_AUTOPLAY_MS);
  }
  function hiStopAuto() {
    if (hiAutoTimer) { window.clearInterval(hiAutoTimer); hiAutoTimer = null; }
  }

  /* start/stop autoplay based on section visibility */
  var hiSectionVisible = false;
  if ('IntersectionObserver' in window) {
    var hiVisObs = new IntersectionObserver(function (entries) {
      hiSectionVisible = entries[0] ? entries[0].isIntersecting : false;
      if (hiSectionVisible) { hiStartAuto(); } else { hiStopAuto(); }
    }, { threshold: 0.3 });
    var hiSection = document.getElementById('industries-section');
    if (hiSection) hiVisObs.observe(hiSection);
  }

  /* pause on tab hidden */
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { hiStopAuto(); } else { hiStartAuto(); }
  });

  /* pause on hover / focus */
  if (hiPanel) {
    hiPanel.addEventListener('mouseenter', hiStopAuto);
    hiPanel.addEventListener('mouseleave', hiStartAuto);
    hiPanel.addEventListener('focusin',    hiStopAuto);
    hiPanel.addEventListener('focusout',   hiStartAuto);
  }

  /* tab clicks */
  hiTabs.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      hiAutoPaused = true;
      hiStopAuto();
      hiGo(i, true, true);
    });
    btn.addEventListener('keydown', function (e) {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
      e.preventDefault();
      var next = e.key === 'Home' ? 0
               : e.key === 'End'  ? hiTabs.length - 1
               : (i + (e.key === 'ArrowRight' ? 1 : -1) + hiTabs.length) % hiTabs.length;
      hiAutoPaused = true;
      hiStopAuto();
      hiGo(next, true, true);
      hiTabs[next].focus({ preventScroll: true });
    });
  });

  /* prev / next arrows */
  if (hiPrev) hiPrev.addEventListener('click', function () {
    hiAutoPaused = true; hiStopAuto(); hiGo(hiIdx - 1, true, true);
  });
  if (hiNext) hiNext.addEventListener('click', function () {
    hiAutoPaused = true; hiStopAuto(); hiGo(hiIdx + 1, true, true);
  });

  /* touch swipe on card */
  if (hiPanel) {
    var hiTouchX = null;
    hiPanel.addEventListener('touchstart', function (e) {
      hiTouchX = e.touches[0].clientX;
    }, { passive: true });
    hiPanel.addEventListener('touchend', function (e) {
      if (hiTouchX === null) return;
      var dx = e.changedTouches[0].clientX - hiTouchX;
      hiTouchX = null;
      if (Math.abs(dx) < 40) return;
      hiAutoPaused = true; hiStopAuto();
      hiGo(dx < 0 ? hiIdx + 1 : hiIdx - 1, true, true);
    }, { passive: true });
  }

  /* image onerror fallback */
  if (hiImg) {
    hiImg.addEventListener('error', function () {
      hiImg.classList.add('hi-img--error');
      hiArt && hiArt.classList.add('hi-art--fallback');
    });
  }

  /* initialise — no animation, no pill scroll, no page movement */
  hiGo(0, false, false);
  /* autoplay starts via IntersectionObserver when section scrolls into view */

  /* ── blog cards ── */
  var blogGrid = document.getElementById('homeBlogGrid');
  if (blogGrid) {
    /* primary source: live carryover articles (always confirmed) */
    var carryoverBlog = window.LIVE_CARRYOVER && window.LIVE_CARRYOVER.blog && window.LIVE_CARRYOVER.blog.articles;
    var blogIcons = ['bi-cpu', 'bi-tree', 'bi-cloud'];
    var displayed = [];
    if (carryoverBlog && carryoverBlog.length) {
      displayed = carryoverBlog.slice(0, 3).map(function (a) {
        return { title: a.title, category: a.category, readTime: a.readTime, slug: a.slug };
      });
    } else {
      /* fallback: blog-posts.js entries with confirmed body blocks only */
      displayed = (window.FRAMEIQ_BLOG_POSTS || []).filter(function (post) {
        return post.body && post.body.some(function (block) { return block && block.confirmed === true; });
      }).slice(0, 3);
    }
    if (displayed.length === 0) {
      var bandEl = blogGrid.closest('.home-band');
      if (bandEl) bandEl.setAttribute('hidden', '');
      return;
    }
    blogGrid.innerHTML = displayed.map(function (post, i) {
      var href = post.slug ? 'pages/blog-article.html?slug=' + post.slug : 'pages/blog.html';
      var blogImages = {
        'revolutionizing-traffic-management-with-ai': {
          src: 'assets/img/revolutiontraffic.webp',
          alt: 'Traffic cameras overlooking a city flyover at dusk',
          position: '50% 45%'
        },
        'edge-vs-cloud-video-analytic': {
          src: 'assets/img/edge-and-cloudai.webp',
          alt: 'An edge camera and server connected to cloud computing',
          position: '70% 12%'
        },
        'ai-in-agriculture': {
          src: 'assets/img/agricultureai.webp',
          alt: 'A drone surveying crops across a field at sunset',
          position: '50% 25%'
        }
      };
      var image = blogImages[post.slug];
      var art = image
        ? '<img class="home-blog-card__image" src="' + image.src + '" width="1600" height="1000" loading="lazy" alt="' + image.alt + '" style="object-position:' + image.position + ';transform-origin:' + image.position + '">'
        : '<i class="bi ' + (blogIcons[i] || 'bi-cpu') + '" aria-hidden="true"></i>';
      return '<article class="home-blog-card" style="--i:' + i + '">' +
        '<div class="home-blog-card__art">' + art + '</div>' +
        '<div class="home-blog-card__body">' +
        '<div class="home-blog-card__tag">' + (post.category || 'Engineering') + '</div>' +
        '<div class="home-blog-card__title">' + post.title + '</div>' +
        '<div class="home-blog-card__footer">' +
        '<a class="home-blog-card__read" href="' + href + '">Read article <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>' +
        '<span class="home-blog-card__meta">' + (post.readTime || '') + '</span>' +
        '</div></div></article>';
    }).join('');

    /* reveal: fade+slide on viewport entry, staggered by --i */
    var blogBand = blogGrid.closest('.home-blog-band');
    var blogCards = Array.from(blogGrid.querySelectorAll('.home-blog-card'));
    var prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    if (blogBand && blogCards.length && 'IntersectionObserver' in window) {
      if (prefersMotion) {
        /* hide cards until observed; js-ready triggers CSS opacity:0 */
        blogBand.classList.add('js-ready');
      }
      var blogObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.15 });
      blogCards.forEach(function (card) { blogObs.observe(card); });
    }
  }

  var pendingCopy = 'Coming soon';
  var carriedHome = window.LIVE_CARRYOVER && window.LIVE_CARRYOVER.home;
  var resultsIntro = document.getElementById('home-results-intro');
  if (resultsIntro) resultsIntro.textContent = carriedHome && carriedHome.testimonialIntro
    ? carriedHome.testimonialIntro.text
    : pendingCopy;

  var resultsTrack = document.getElementById('home-results-track');
  var resultsCarousel = document.getElementById('home-results-carousel');
  var resultsDots = document.getElementById('home-results-dots');
  if (resultsTrack && resultsCarousel && resultsDots) {
    var carriedTestimonials = carriedHome && Array.isArray(carriedHome.testimonials)
      ? carriedHome.testimonials
      : [];
    var sectors = [
      { tag: 'MANUFACTURING', key: 'MANUFACTURING' },
      { tag: 'AGRICULTURE', key: 'AGRICULTURE' },
      { tag: 'RETAIL', key: 'RETAIL' },
      { tag: 'SMART CITY', key: 'SMART CITY' }
    ];
    sectors.forEach(function (sector) {
      var testimonial = carriedTestimonials.find(function (item) {
        return item.sector === sector.key;
      });
      var role = testimonial && testimonial.role ? testimonial.role : pendingCopy;
      var company = pendingCopy;
      if (sector.key === 'MANUFACTURING' && testimonial && role.indexOf(' · ') !== -1) {
        var roleParts = role.split(' · ');
        role = roleParts.shift();
        company = roleParts.join(' · ') || pendingCopy;
      }

      var slide = document.createElement('article');
      slide.className = 'home-results-slide';
      slide.setAttribute('data-reveal', '');
      var tag = document.createElement('span');
      tag.className = 'home-results-slide__sector';
      tag.textContent = sector.tag;
      var quote = document.createElement('blockquote');
      quote.textContent = testimonial && testimonial.quote ? testimonial.quote : pendingCopy;
      var person = document.createElement('div');
      person.className = 'home-results-slide__person';
      var name = document.createElement('div');
      name.className = 'home-results-slide__name';
      name.textContent = testimonial && testimonial.name ? testimonial.name : pendingCopy;
      var roleText = document.createElement('div');
      roleText.className = 'home-results-slide__role';
      roleText.textContent = role;
      var companyText = document.createElement('div');
      companyText.className = 'home-results-slide__company';
      companyText.textContent = company;
      person.append(name, roleText, companyText);
      slide.append(tag, quote, person);
      resultsTrack.appendChild(slide);
    });

    var resultSlides = Array.from(resultsTrack.children);
    var currentResultsPage = 0;
    var resultsPageSize = 1;
    var swipeStartX = null;

    function renderResultsCarousel() {
      resultsPageSize = window.innerWidth < 768 ? 1 : 2;
      var pageCount = Math.ceil(resultSlides.length / resultsPageSize);
      currentResultsPage = Math.min(currentResultsPage, pageCount - 1);
      var offset = currentResultsPage * resultsPageSize;
      var firstSlide = resultSlides[offset];
      var slideWidth = firstSlide ? firstSlide.getBoundingClientRect().width : 0;
      var gap = parseFloat(window.getComputedStyle(resultsTrack).gap) || 0;
      resultsTrack.style.transform = 'translateX(-' + ((slideWidth + gap) * offset) + 'px)';
      resultSlides.forEach(function (slide, index) {
        var visible = index >= offset && index < offset + resultsPageSize;
        slide.setAttribute('aria-hidden', String(!visible));
        slide.inert = !visible;
      });
      resultsDots.replaceChildren();
      for (var pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'home-results-dot' + (pageIndex === currentResultsPage ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Show client result ' + (pageIndex + 1));
        if (pageIndex === currentResultsPage) dot.setAttribute('aria-current', 'true');
        dot.addEventListener('click', function (targetPage) {
          return function () {
            currentResultsPage = targetPage;
            renderResultsCarousel();
          };
        }(pageIndex));
        resultsDots.appendChild(dot);
      }
    }

    function moveResults(direction) {
      var pageCount = Math.ceil(resultSlides.length / resultsPageSize);
      currentResultsPage = (currentResultsPage + direction + pageCount) % pageCount;
      renderResultsCarousel();
    }

    document.querySelector('[data-results-prev]')?.addEventListener('click', function () { moveResults(-1); });
    document.querySelector('[data-results-next]')?.addEventListener('click', function () { moveResults(1); });
    resultsCarousel.addEventListener('keydown', function (event) {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
      event.preventDefault();
      moveResults(event.key === 'ArrowRight' ? 1 : -1);
    });
    resultsCarousel.addEventListener('pointerdown', function (event) {
      swipeStartX = event.clientX;
    }, { passive: true });
    resultsCarousel.addEventListener('pointerup', function (event) {
      if (swipeStartX === null) return;
      var distance = event.clientX - swipeStartX;
      swipeStartX = null;
      if (Math.abs(distance) > 40) moveResults(distance < 0 ? 1 : -1);
    }, { passive: true });
    resultsCarousel.addEventListener('pointercancel', function () { swipeStartX = null; });
    window.addEventListener('resize', renderResultsCarousel, { passive: true });
    renderResultsCarousel();

    if ('IntersectionObserver' in window && !reduceMotion) {
      var resultRevealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      resultsTrack.querySelectorAll('[data-reveal]').forEach(function (element) {
        resultRevealObserver.observe(element);
      });
    } else {
      resultsTrack.querySelectorAll('[data-reveal]').forEach(function (element) {
        element.classList.add('is-visible');
      });
    }
  }

  var resultStatCards = Array.from(document.querySelectorAll('.home-results-stat'));
  if (resultStatCards.length && 'IntersectionObserver' in window && !reduceMotion) {
    var resultCountObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var value = entry.target.querySelector('.home-results-stat__value');
        if (value) {
          var range = value.dataset.resultRange;
          var target = Number(value.dataset.resultCount);
          var decimals = Number(value.dataset.resultDecimals || 0);
          var suffix = value.dataset.resultSuffix || '';
          var start = performance.now();
          function updateResultCount(now) {
            var progress = Math.min((now - start) / 1200, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            if (range) {
              var rangeParts = range.split(',').map(Number);
              value.textContent = Math.round(rangeParts[0] * eased) + '–' +
                Math.round(rangeParts[1] * eased) + ' wk';
            } else {
              value.textContent = (target * eased).toFixed(decimals) + suffix;
            }
            if (progress < 1) window.requestAnimationFrame(updateResultCount);
          }
          window.requestAnimationFrame(updateResultCount);
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    resultStatCards.forEach(function (card) { resultCountObserver.observe(card); });
  }

  var faqHost = document.getElementById('home-faq-list');
  var carriedFaq = carriedHome && Array.isArray(carriedHome.faq) ? carriedHome.faq : [];
  if (faqHost) {
    Array.from({ length: 8 }).forEach(function (_, index) {
      var itemData = carriedFaq[index];
      var questionId = 'home-faq-question-' + index;
      var answerId = 'home-faq-answer-' + index;
      var item = document.createElement('article');
      item.className = 'home-faq-item is-visible' + (index === 0 ? ' is-open' : '');
      item.setAttribute('data-reveal', '');
      item.style.setProperty('--i', index);
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'home-faq-question';
      button.id = questionId;
      button.setAttribute('aria-expanded', String(index === 0));
      button.setAttribute('aria-controls', answerId);
      var question = document.createElement('span');
      question.textContent = itemData && itemData.question ? itemData.question : pendingCopy;
      var icon = document.createElement('i');
      icon.className = 'bi bi-plus-lg';
      icon.setAttribute('aria-hidden', 'true');
      button.append(question, icon);
      var panel = document.createElement('div');
      panel.className = 'home-faq-answer';
      panel.id = answerId;
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', questionId);
      var answer = document.createElement('p');
      answer.textContent = itemData && itemData.answer ? itemData.answer : pendingCopy;
      panel.appendChild(answer);
      panel.setAttribute('aria-hidden', String(index !== 0));
      panel.inert = index !== 0;
      if (index === 0) panel.style.maxHeight = 'none';
      else {
        panel.style.maxHeight = '0px';
      }
      button.addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        if (open) return;
        faqHost.querySelectorAll('.home-faq-item').forEach(function (other) {
          var otherButton = other.querySelector('.home-faq-question');
          var otherPanel = other.querySelector('.home-faq-answer');
          other.classList.remove('is-open');
          otherButton.setAttribute('aria-expanded', 'false');
          otherPanel.setAttribute('aria-hidden', 'true');
          otherPanel.inert = true;
          otherPanel.style.maxHeight = '0px';
        });
        item.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
        panel.setAttribute('aria-hidden', 'false');
        panel.inert = false;
        panel.style.maxHeight = answer.scrollHeight + 20 + 'px';
      });
      item.append(button, panel);
      faqHost.appendChild(item);
      if (index === 0) panel.style.maxHeight = answer.scrollHeight + 20 + 'px';
    });
    window.addEventListener('resize', function () {
      var openPanel = faqHost.querySelector('.home-faq-item.is-open .home-faq-answer');
      var openAnswer = openPanel && openPanel.querySelector('p');
      if (openPanel && openAnswer) openPanel.style.maxHeight = openAnswer.scrollHeight + 20 + 'px';
    }, { passive: true });
    if ('IntersectionObserver' in window && !reduceMotion) {
      var faqRevealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12 });
      faqHost.querySelectorAll('[data-reveal]').forEach(function (element) {
        faqRevealObserver.observe(element);
      });
    } else {
      faqHost.querySelectorAll('[data-reveal]').forEach(function (element) {
        element.classList.add('is-visible');
      });
    }
  }

  var homeContactForm = document.getElementById('home-contact-form');
  if (homeContactForm) {
    var contactMessage = document.getElementById('home-contact-message');
    homeContactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!homeContactForm.reportValidity()) return;
      var fields = new FormData(homeContactForm);
      var email = window.SITE_CONTACT && window.SITE_CONTACT.email
        ? window.SITE_CONTACT.email
        : 'official@cvframeiq.com';
      if (String(fields.get('_gotcha') || '').trim()) {
        contactMessage.textContent = 'We could not process this enquiry. Please email ' + email + '.';
        return;
      }
      var messageLines = [
        'Industry: ' + (fields.get('sector') || 'Not selected'),
        'Message: ' + (fields.get('projectDetails') || ''),
        'Name: ' + (fields.get('firstName') || '') + ' ' + (fields.get('lastName') || ''),
        'Work email: ' + (fields.get('workEmail') || ''),
        'Company: ' + (fields.get('company') || 'Not provided')
      ];
      var subject = 'Home page enquiry';
      var mailto = 'mailto:' + email + '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(messageLines.join('\n'));
      var endpoint = window.FORM_ENDPOINT;
      var submitButton = homeContactForm.querySelector('.home-contact-submit');
      if (!endpoint) {
        contactMessage.textContent = 'Contact form is not connected yet. Click below to send this by email.';
        var emailLink = document.createElement('a');
        emailLink.href = mailto;
        emailLink.textContent = 'Send this by email';
        contactMessage.appendChild(document.createElement('br'));
        contactMessage.appendChild(emailLink);
        return;
      }
      submitButton.disabled = true;
      submitButton.setAttribute('aria-busy', 'true');
      contactMessage.textContent = '';
      fetch(endpoint, { method: 'POST', body: fields, headers: { Accept: 'application/json' } })
        .then(function (response) {
          if (!response.ok) throw new Error('Form endpoint returned ' + response.status);
          contactMessage.textContent = 'Your enquiry has been submitted successfully.';
          homeContactForm.reset();
        })
        .catch(function (error) {
          console.error('Home contact form could not be submitted.', error);
          contactMessage.textContent = 'We could not send your enquiry right now. Please email ' + email + '.';
          var fallbackLink = document.createElement('a');
          fallbackLink.href = mailto;
          fallbackLink.textContent = 'Send this by email';
          contactMessage.appendChild(document.createElement('br'));
          contactMessage.appendChild(fallbackLink);
        })
        .finally(function () {
          submitButton.disabled = false;
          submitButton.removeAttribute('aria-busy');
        });
    });
  }
})();


  /* spotlight + reveal for new sections */
  (function () {
    /* spotlight on process and why cards */
    document.querySelectorAll('.home-process__card, .home-why__card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    /* reveal observer for new data-reveal blocks */
    if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var obs = new IntersectionObserver(function (entries, o) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-visible');
          o.unobserve(e.target);
        });
      }, { threshold: 0.12 });
      document.querySelectorAll('.home-process__steps[data-reveal], .home-why__grid[data-reveal], .home-trusted__inner[data-reveal], .home-process__pill[data-reveal], .home-why__cta[data-reveal]').forEach(function (el) {
        obs.observe(el);
      });
    }
    var updateBackToTop = function () {
      var backToTop = document.querySelector('.back-to-top');
      if (!backToTop) return;
      var mobile = window.matchMedia('(max-width: 767px)').matches;
      backToTop.classList.toggle('is-visible', mobile && window.scrollY > 400);
    };
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    window.addEventListener('resize', updateBackToTop, { passive: true });
    document.addEventListener('DOMContentLoaded', updateBackToTop, { once: true });
    updateBackToTop();
  })();
