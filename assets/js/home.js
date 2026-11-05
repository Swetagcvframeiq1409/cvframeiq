(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMobile = window.innerWidth < 768;

  /* ── helpers ── */
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function sectionP(el) {
    var r = el.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
  }

  var metricsHost = document.querySelector('[data-home-metrics]');
  var verifiedStats = (window.LIVE_CARRYOVER?.home?.stats || []).filter(function (stat) {
    return stat.verified === true;
  });
  if (metricsHost && verifiedStats.length) {
    metricsHost.replaceChildren();
    verifiedStats.forEach(function (stat) {
      var article = document.createElement('article');
      article.setAttribute('data-reveal', '');
      var value = document.createElement('strong');
      value.textContent = stat.value;
      var label = document.createElement('span');
      label.textContent = stat.label;
      var visual = document.createElement('div');
      visual.className = 'home-metric-visual';
      var icon = document.createElement('i');
      icon.className = 'bi ' + stat.icon;
      icon.setAttribute('aria-hidden', 'true');
      visual.append(icon);
      article.append(value, label, visual);
      metricsHost.append(article);
    });
  }

  /* ── progress bar ── */
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
  var ppLines = [
    document.getElementById('ppLine0'),
    document.getElementById('ppLine1'),
    document.getElementById('ppLine2')
  ];

  var platformSteps = [
    {
      title: 'Understand',
      desc: 'Start with the operating context, visual inputs, and the need to address.',
      bullets: ['Define the visual problem', 'Map data sources and cameras', 'Agree on success criteria']
    },
    {
      title: 'Build',
      desc: 'Shape a computer-vision approach around the intended use case.',
      bullets: ['Select model architecture', 'Prepare training data', 'Develop the pipeline']
    },
    {
      title: 'Validate',
      desc: 'Review the approach against relevant conditions and requirements.',
      bullets: ['Test on real-world data', 'Measure accuracy and latency', 'Iterate on edge cases']
    },
    {
      title: 'Deploy',
      desc: 'Prepare the system for its intended environment.',
      bullets: ['Edge or cloud deployment', 'Integrate with existing systems', 'Set up monitoring']
    },
    {
      title: 'Impact',
      desc: 'Bring useful visual intelligence into the intended operation.',
      bullets: ['Track business outcomes', 'Continuous improvement', 'Scale across sites']
    }
  ];

  var currentPlatformStep = -1;

  function setPlatformStep(step) {
    if (step === currentPlatformStep) return;
    currentPlatformStep = step;
    if (!ppStepTitle) return;
    ppStepTitle.classList.add('is-changing');
    setTimeout(function () {
      var s = platformSteps[step];
      if (ppCurrent) ppCurrent.textContent = String(step + 1).padStart(2, '0');
      ppStepTitle.textContent = s.title;
      if (ppStepDesc) ppStepDesc.textContent = s.desc;
      if (ppBullets) ppBullets.innerHTML = s.bullets.map(function (b) {
        return '<li><i class="bi bi-check-circle-fill" aria-hidden="true"></i><span>' + b + '</span></li>';
      }).join('');
      ppStepTitle.classList.remove('is-changing');
      document.querySelectorAll('[data-pp-step]').forEach(function (btn) {
        btn.classList.toggle('is-active', Number(btn.dataset.ppStep) === step);
      });
    }, 225);
  }

  /* Initialise step 0 immediately so the panel is never empty */
  setPlatformStep(0);

  /* ── pillars ── */
  var pillars = Array.from(document.querySelectorAll('.home-pillar-card'));

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
        w.style.opacity = clamp((p * words.length - i) / 1.5, 0.25, 1).toFixed(2);
      });
    }

    /* story runway phases (3a) */
    if (storyRunway && !reduceMotion && !isMobile) {
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
    if (platformStory && !reduceMotion) {
      var pp = sectionP(platformStory);
      var step = clamp(Math.floor(pp * platformSteps.length), 0, platformSteps.length - 1);
      setPlatformStep(step);
    }

    /* pillars dot update only — no blur/opacity (CSS z-index handles stacking) */
    if (window.innerWidth >= 768) {
      pillars.forEach(function (card, i) {
        var r = card.getBoundingClientRect();
        card.style.filter = '';
        card.style.opacity = '';
        document.querySelectorAll('[data-pillar-dot]').forEach(function (dot, di) {
          dot.classList.toggle('is-active', di === i && r.top < window.innerHeight * 0.65 && r.bottom > 0);
        });
      });
    }
  }

  if (!reduceMotion) {
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { isMobile = window.innerWidth < 768; tick(); });
    tick();
  }

  /* ── platform step buttons (manual) ── */
  document.querySelectorAll('[data-pp-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setPlatformStep(Number(btn.dataset.ppStep));
    });
  });

  /* ── pillar dot clicks ── */
  document.querySelectorAll('[data-pillar-dot]').forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      if (window.innerWidth < 768) {
        var list = document.querySelector('.home-pillar-list');
        if (list && pillars[i]) list.scrollTo({ left: pillars[i].offsetLeft - list.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
      } else {
        pillars[i].scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  /* Mobile carousel: track active dot + counter via scroll event */
  var pillarList = document.querySelector('.home-pillar-list');
  var pillarCounter = document.getElementById('pillarCounter');
  if (pillarList && pillarCounter) {
    pillarList.addEventListener('scroll', function () {
      var listRect = pillarList.getBoundingClientRect();
      var best = 0, bestOverlap = -1;
      pillars.forEach(function (card, i) {
        var r = card.getBoundingClientRect();
        var overlap = Math.min(r.right, listRect.right) - Math.max(r.left, listRect.left);
        if (overlap > bestOverlap) { bestOverlap = overlap; best = i; }
      });
      pillarCounter.textContent = String(best + 1).padStart(2, '0') + ' / 04';
      document.querySelectorAll('[data-pillar-dot]').forEach(function (dot, di) {
        dot.classList.toggle('is-active', di === best);
      });
    }, { passive: true });
  }

  /* Mobile carousel: track active dot via IntersectionObserver */
  if ('IntersectionObserver' in window) {
    var carouselObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = pillars.indexOf(e.target);
        if (idx < 0 || window.innerWidth >= 768) return;
        document.querySelectorAll('[data-pillar-dot]').forEach(function (dot, di) {
          dot.classList.toggle('is-active', di === idx);
        });
      });
    }, { threshold: 0.5 });
    pillars.forEach(function (card) { carouselObs.observe(card); });
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

  /* ── industries ── */
  var sectors = window.SECTORS || [];
  var slugs = ['manufacturing', 'agriculture', 'healthcare', 'retail', 'smart-city', 'banking', 'aviation', 'security-surveillance'];
  var icons = ['bi-buildings', 'bi-tree', 'bi-hospital', 'bi-bag', 'bi-buildings-fill', 'bi-bank', 'bi-airplane', 'bi-shield-check'];
  var industryBtns = Array.from(document.querySelectorAll('.home-industry-pills [role="tab"]'));
  var industryIdx = 0;

  function selectIndustry(idx) {
    industryIdx = (idx + industryBtns.length) % industryBtns.length;
    var sector = sectors.find(function (s) { return s.slug === slugs[industryIdx]; });
    industryBtns.forEach(function (b, i) {
      b.setAttribute('aria-selected', String(i === industryIdx));
      b.tabIndex = i === industryIdx ? 0 : -1;
    });
    var panel = document.querySelector('.home-industry-panel');
    panel.classList.remove('is-changing');
    void panel.offsetWidth;
    panel.classList.add('is-changing');
    setTimeout(function () {
      document.querySelector('#industry-number').textContent = String(industryIdx + 1).padStart(2, '0') + ' / 08';
      document.querySelector('.home-industry-copy h3').textContent = industryBtns[industryIdx].textContent;
      document.querySelector('.home-industry-copy p').textContent = sector ? sector.summary : 'Draft — pending content';
      document.querySelector('.home-industry-art i').className = 'bi ' + icons[industryIdx];
      var link = document.querySelector('.home-industry-copy a');
      link.href = slugs[industryIdx] === 'smart-city' ? 'pages/sectors/smart-city.html' : 'pages/sectors/' + slugs[industryIdx] + '.html';
    }, 170);
  }

  industryBtns.forEach(function (btn, i) {
    btn.addEventListener('click', function () { selectIndustry(i); });
    btn.addEventListener('keydown', function (e) {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      var next = e.key === 'Home' ? 0 : e.key === 'End' ? industryBtns.length - 1 : (i + (e.key === 'ArrowRight' ? 1 : -1) + industryBtns.length) % industryBtns.length;
      selectIndustry(next);
      industryBtns[next].focus();
    });
  });
  var leftArrow = document.querySelector('.home-industry-arrow--left');
  var rightArrow = document.querySelector('.home-industry-arrow--right');
  if (leftArrow) leftArrow.addEventListener('click', function () { selectIndustry(industryIdx - 1); });
  if (rightArrow) rightArrow.addEventListener('click', function () { selectIndustry(industryIdx + 1); });

  /* ── blog cards ── */
  var blogGrid = document.getElementById('homeBlogGrid');
  if (blogGrid) {
    var posts = (window.FRAMEIQ_BLOG_POSTS || []).filter(function (post) {
      return window.SITE_FLAGS?.SHOW_DRAFTS || post.body?.some(function (block) { return block?.confirmed === true; });
    });
    var carryoverBlog = window.LIVE_CARRYOVER && window.LIVE_CARRYOVER.blog && window.LIVE_CARRYOVER.blog.articles;
    var blogIcons = ['bi-cpu', 'bi-tree', 'bi-cloud'];
    var displayed = posts.slice(0, 3);
    if (displayed.length === 0 && carryoverBlog) {
      displayed = carryoverBlog.slice(0, 3).map(function (a) {
        return { title: a.title, category: a.category, summary: a.excerpt, readTime: a.readTime, slug: a.slug };
      });
    }
    if (displayed.length === 0) {
      blogGrid.closest('.home-band')?.setAttribute('hidden', '');
      return;
    }
    blogGrid.innerHTML = displayed.map(function (post, i) {
      var href = post.slug ? 'pages/blog-article.html?slug=' + post.slug : 'pages/blog.html';
      return '<article class="home-blog-card">' +
        '<div class="home-blog-card__art"><i class="bi ' + (blogIcons[i] || 'bi-cpu') + '" aria-hidden="true"></i></div>' +
        '<div class="home-blog-card__body">' +
        '<div class="home-blog-card__tag">' + (post.category || 'Engineering') + '</div>' +
        '<div class="home-blog-card__title">' + post.title + '</div>' +
        '<div class="home-blog-card__footer">' +
        '<a class="home-blog-card__read" href="' + href + '">Read article <i class="bi bi-arrow-up-right" aria-hidden="true"></i></a>' +
        '<span class="home-blog-card__meta">' + (post.readTime || '') + '</span>' +
        '</div></div></article>';
    }).join('');
  }

  /* ── testimonials ── */
  var testimonialHost = document.getElementById('homeTestimonials');
  if (testimonialHost) {
    var tList = [];
    if (!window.SITE_FLAGS?.SHOW_DRAFTS) {
      testimonialHost.closest('.home-band')?.setAttribute('hidden', '');
      return;
    }
    testimonialHost.innerHTML = tList.map(function (t) {
      var initials = (t.name || 'N').split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
      return '<article class="home-quote-card">' +
        '<blockquote>' + (t.quote || '') + '</blockquote>' +
        '<div class="home-quote-card__person">' +
        '<div class="home-quote-card__avatar">' + initials + '</div>' +
        '<div><div class="home-quote-card__name">' + (t.name || '') + '</div>' +
        '<div class="home-quote-card__role">' + (t.role || '') + '</div></div>' +
        '</div></article>';
    }).join('');
  }
})();
