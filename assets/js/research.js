(() => {
  'use strict';

  const root = document.querySelector('#rs-research');
  if (!root) return;

  const savedTheme = window.localStorage && window.localStorage.getItem('frameiq-theme');
  const theme = savedTheme === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  document.body?.setAttribute('data-theme', theme);

  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const pillarData = [
    {
      id: 'computer-vision',
      title: 'Computer Vision for Industry',
      description: 'AI-powered defect detection, production line monitoring, and quality inspection built for Indian manufacturing.',
      bullets: [
        'Automated Quality Inspection',
        'Defect Detection & Classification',
        'Production Line Monitoring',
        'Safety & Compliance AI',
        'Predictive Maintenance'
      ],
      icon: 'bi-cpu',
      /* cvindustrial.webp 1200x751 65KB */
      img: { src: '../assets/img/cvindustrial.webp', w: 1200, h: 751, alt: 'Computer vision system monitoring an industrial production line' }
    },
    {
      id: 'smart-agriculture',
      title: 'Smart Agriculture (BeejHealth)',
      description: "India's AI crop health advisory.",
      bullets: [
        'Crop Disease Detection',
        'Pest & Nutrient Analysis',
        'Instant Mobile Diagnosis',
        'Hindi Language Support',
        'Yield Prediction AI'
      ],
      icon: 'bi-flower1',
      /* smartagriculture.webp 1200x674 28KB */
      img: { src: '../assets/img/smartagriculture.webp', w: 1200, h: 674, alt: 'AI monitoring crops from above using drone imagery' }
    },
    {
      id: 'security-surveillance',
      title: 'Security & Surveillance AI',
      description: 'AI-driven monitoring built for threat detection, access control, and operational awareness.',
      bullets: [
        'Real-time Threat Detection',
        'Facial Recognition & Access Control',
        'Anomaly & Intrusion Alerts',
        'Crowd Analytics & Safety',
        'Multi-camera Orchestration'
      ],
      icon: 'bi-shield-check',
      /* security-surveillance-hero.webp 1274x952 906KB (PNG-disguised) */
      img: { src: '../assets/img/security-surveillance-hero.webp', w: 1274, h: 952, alt: 'AI security and surveillance system monitoring multiple camera feeds' }
    },
    {
      id: 'vision-agents',
      title: 'Next-Gen AI Vision Agents',
      description: 'Autonomous AI agents combining vision intelligence with decision-making and self-optimizing workflows.',
      bullets: [
        'Autonomous Vision Systems',
        'Multi-Modal AI (Vision + NLP)',
        'Self-Optimizing Pipelines',
        'Intelligent Workflow Automation',
        'Custom Agent Development'
      ],
      icon: 'bi-diagram-3',
      /* nextgenai.webp 1200x674 34KB */
      img: { src: '../assets/img/nextgenai.webp', w: 1200, h: 674, alt: 'Next-generation AI vision agents with autonomous decision-making' }
    }
  ];

  /* Stats: figures verified against live site (cvframeiq.com).
     7+ Industries and 24/7 Monitoring appear on the live site.
     99.2% Accuracy and <200ms Latency are not confirmed on the live site
     — shown as Draft pending content per brief. */
  const statData = [
    { value: '7+', label: 'Industries', confirmed: true },
    { value: 'Draft \u2014 pending content', label: 'Accuracy', confirmed: false },
    { value: 'Draft \u2014 pending content', label: 'Latency', confirmed: false },
    { value: '24/7', label: 'Monitoring', confirmed: true }
  ];

  const processSteps = [
    {
      title: 'Discovery Call',
      description: 'We map your camera network, operational KPIs, and pain points, then define exactly what AI needs to see and do.'
    },
    {
      title: 'Prototype & Validate',
      description: 'We build a working CV pipeline and validate it on your own footage before any commitment.'
    },
    {
      title: 'Deploy to Production',
      description: 'We integrate with your existing infrastructure and bring the system online with minimal workflow disruption.'
    },
    {
      title: 'Monitor & Evolve',
      description: 'Models continue to improve with new data, live dashboards, alerts, and ongoing engineering support.'
    }
  ];

  const toolData = [
    { name: 'PyTorch', logo: 'pytorch.png' },
    { name: 'TensorFlow', logo: 'tensorflow.png' },
    { name: 'OpenCV', logo: 'opencv.jpg' },
    { name: 'YOLOv8', logo: 'yolov8.png' },
    { name: 'Hugging Face', logo: 'huggingface.png' },
    { name: 'Python', logo: 'python.png' },
    { name: 'ONNX', logo: 'onnx.png' },
    { name: 'FastAPI', logo: 'fastapi.png' },
    { name: 'Docker', logo: 'docker.png' },
    { name: 'AWS', logo: 'aws.png' },
    { name: 'SAM', icon: 'bi-diagram-3' },
    { name: 'Vision Transformers', icon: 'bi-collection' }
  ];

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const createToolChip = (tool) => {
    const chip = make('div', 'res-tool');
    const chipInner = make('span', 'res-tool__inner');

    if (tool.logo) {
      const logo = document.createElement('img');
      logo.src = `../assets/img/techlogo/${tool.logo}`;
      logo.alt = `${tool.name} logo`;
      logo.width = 22;
      logo.height = 22;
      logo.loading = 'lazy';
      logo.decoding = 'async';
      logo.onerror = function () { this.style.display = 'none'; };
      chipInner.appendChild(logo);
    } else {
      const icon = make('i', `bi ${tool.icon}`);
      icon.setAttribute('aria-hidden', 'true');
      chipInner.appendChild(icon);
    }

    const label = document.createElement('span');
    label.textContent = tool.name;
    chipInner.appendChild(label);
    chip.appendChild(chipInner);
    return chip;
  };

  /* Helper: create image figure for pillar panels — lazy below fold */
  const makePillarImg = (imgData, index) => {
    const fig = document.createElement('figure');
    fig.className = 'res-pillar-fig';
    const img = document.createElement('img');
    img.src = imgData.src;
    img.alt = imgData.alt;
    img.width = imgData.w;
    img.height = imgData.h;
    img.loading = index === 0 ? 'eager' : 'lazy';
    img.decoding = 'async';
    img.className = 'res-pillar-img';
    img.onerror = function () { this.closest('.res-pillar-fig')?.classList.add('img-failed'); this.style.display = 'none'; };
    if (img.complete) fig.classList.add('img-loaded');
    else img.addEventListener('load', () => fig.classList.add('img-loaded'));
    fig.appendChild(img);
    return fig;
  };

  const generatePage = () => {
    root.innerHTML = '';

    /* ── Hero: two-column layout, image right ── */
    const hero = make('section', 'res-hero');
    hero.dataset.tone = 'dark';
    const heroWrap = make('div', 'res-wrap');
    heroWrap.style.cssText = 'display:grid;grid-template-columns:1fr;gap:2rem;align-items:center;';

    const heroText = make('div', '');
    const breadcrumb = make('nav', 'res-breadcrumb');
    breadcrumb.setAttribute('aria-label', 'Breadcrumb');
    breadcrumb.innerHTML = '<a href="../index.html">Home</a><span>/</span><a href="blog.html">Resources</a><span>/</span><span>Research</span>';
    const eyebrow = make('p', 'res-eyebrow', 'Research');
    const h1 = make('h1', 'res-page-title', 'Research');
    const lead = make('p', 'res-lead', "Explore FrameIQ's computer vision research focus areas.");
    heroText.append(breadcrumb, eyebrow, h1, lead);

    /* Hero image: Neural Network Core.webp 1536x1024 */
    const heroFig = document.createElement('figure');
    heroFig.className = 'res-hero-fig';
    heroFig.style.cssText = 'aspect-ratio:16/10;display:none;';
    heroFig.setAttribute('aria-hidden', 'true');
    const heroImg = document.createElement('img');
    heroImg.src = '../assets/img/Neural%20Network%20Core.webp';
    heroImg.alt = '';
    heroImg.width = 1536;
    heroImg.height = 1024;
    heroImg.loading = 'eager';
    heroImg.fetchPriority = 'high';
    heroImg.decoding = 'async';
    heroImg.className = 'res-hero-fig__img';
    heroImg.onerror = function () { this.dataset.failed = 'true'; };
    heroFig.appendChild(heroImg);

    heroWrap.append(heroText, heroFig);
    hero.appendChild(heroWrap);

    /* Show hero image from 992px */
    const mq = window.matchMedia('(min-width: 992px)');
    const applyHeroLayout = (matches) => {
      if (matches) {
        heroWrap.style.gridTemplateColumns = '1fr 1fr';
        heroFig.style.display = 'block';
      } else {
        heroWrap.style.gridTemplateColumns = '1fr';
        heroFig.style.display = 'none';
      }
    };
    applyHeroLayout(mq.matches);
    mq.addEventListener('change', (e) => applyHeroLayout(e.matches));

    /* ── Stats band ── */
    const statsSection = make('section', 'res-band res-band--light');
    statsSection.dataset.tone = 'light';
    const statsWrap = make('div', 'res-wrap');
    const statGrid = make('div', 'res-stat-grid');
    statData.forEach((stat) => {
      const item = make('div', 'res-stat');
      const value = make('strong', 'res-stat__value', stat.value);
      if (!stat.confirmed) {
        value.style.cssText = 'font-size:1rem;color:var(--text-muted);font-family:var(--font-sans);letter-spacing:0;';
      }
      const label = make('span', 'res-stat__label', stat.label);
      item.append(value, label);
      statGrid.appendChild(item);
    });
    statsWrap.appendChild(statGrid);
    statsSection.appendChild(statsWrap);

    /* ── Pillars band ── */
    const pillarsSection = make('section', 'res-band res-band--light res-pillar-section');
    pillarsSection.dataset.tone = 'light';
    const pillarWrap = make('div', 'res-wrap res-pillar-layout');

    const stickyColumn = make('div', 'res-pillar-sticky');
    const pillarEyebrow = make('p', 'res-eyebrow', 'Four pillars');
    const pillarTitle = make('h2', 'res-section-title', 'One engineering standard across every focus area');
    const counter = make('div', 'res-pillar-counter', '01 / 04');
    const tabList = make('div', 'res-pillar-tab-list');
    pillarData.forEach((pillar, index) => {
      const tab = make('a', 'res-pillar-tab', pillar.title);
      tab.href = `#${pillar.id}`;
      tab.dataset.index = String(index);
      if (index === 0) tab.classList.add('is-active');
      tabList.appendChild(tab);
    });
    stickyColumn.append(pillarEyebrow, pillarTitle, counter, tabList);

    const panelColumn = make('div', 'res-pillar-panels');
    pillarData.forEach((pillar, index) => {
      const panel = make('article', 'res-pillar-panel', '');
      panel.id = pillar.id;
      panel.dataset.index = String(index);
      panel.setAttribute('tabindex', '-1');
      if (index === 0) panel.classList.add('is-active');

      const panelHeader = make('div', 'res-pillar-panel__header');
      const num = make('span', 'res-pillar-number', String(index + 1).padStart(2, '0'));
      const panelTitle = make('h3', 'res-pillar-panel__title', pillar.title);
      panelHeader.append(num, panelTitle);

      const description = make('p', 'res-pillar-panel__description', pillar.description);
      const list = make('ul', 'res-pillar-list');
      pillar.bullets.forEach((bullet) => {
        const li = make('li', 'res-link-item');
        const icon = make('i', 'bi bi-arrow-up-right');
        icon.setAttribute('aria-hidden', 'true');
        const text = document.createElement('span');
        text.textContent = bullet;
        li.append(icon, text);
        list.appendChild(li);
      });

      /* Panel image — below the bullet list, no text over image */
      const panelImg = makePillarImg(pillar.img, index);

      panel.append(panelHeader, description, list, panelImg);
      panelColumn.appendChild(panel);
    });

    pillarWrap.append(stickyColumn, panelColumn);
    pillarsSection.appendChild(pillarWrap);

    /* ── Process band ── */
    const processSection = make('section', 'res-band res-band--dark res-process-section');
    processSection.dataset.tone = 'dark';
    const processWrap = make('div', 'res-wrap');
    const processEyebrow = make('p', 'res-eyebrow', 'Our Process');
    const processTitle = make('h2', 'res-section-title', 'How we work from idea to live AI');
    const processRail = make('div', 'res-process-rail');
    processSteps.forEach((step, index) => {
      const card = make('article', 'res-process-step');
      card.style.setProperty('--step-index', String(index));
      const number = make('span', 'res-process-number', String(index + 1).padStart(2, '0'));
      const heading = make('h3', 'res-process-title', step.title);
      const copy = make('p', 'res-process-copy', step.description);
      card.append(number, heading, copy);
      processRail.appendChild(card);
    });
    processWrap.append(processEyebrow, processTitle, processRail);
    processSection.appendChild(processWrap);

    /* ── Tooling band ── */
    const toolingSection = make('section', 'res-band res-band--light res-tooling-section');
    toolingSection.dataset.tone = 'light';
    const toolingWrap = make('div', 'res-wrap');
    const toolingEyebrow = make('p', 'res-eyebrow', 'Tooling');
    const toolingTitle = make('h2', 'res-section-title', 'Built on open tooling');
    const marquee = make('div', 'res-marquee');
    const marqueeTrack = make('div', 'res-marquee__track');
    const loopTools = [...toolData, ...toolData];
    loopTools.forEach((tool) => {
      const chip = createToolChip(tool);
      marqueeTrack.appendChild(chip);
    });
    marquee.appendChild(marqueeTrack);
    toolingWrap.append(toolingEyebrow, toolingTitle, marquee);
    toolingSection.appendChild(toolingWrap);

    /* ── Keep exploring ── */
    const keepSection = make('section', 'res-keep-exploring');
    const keepGrid = make('div', 'res-keep-exploring__grid');
    [
      { label: 'Blog', href: 'blog.html', description: 'Explore FrameIQ insights on AI, computer vision, and smart operations.', icon: 'bi-journal-text' },
      { label: 'Glossary', href: 'glossary.html', description: 'Plain-language explanations of computer vision and deployment terms.', icon: 'bi-file-earmark-text' },
      { label: 'Compare', href: 'compare.html', description: 'Neutral questions for comparing edge, cloud, and workflow choices.', icon: 'bi-bar-chart' }
    ].forEach((item) => {
      const link = make('a', 'res-keep-exploring__card');
      link.href = item.href;
      const iconWrap = make('span', 'res-keep-exploring__icon');
      iconWrap.innerHTML = `<i class="bi ${item.icon}" aria-hidden="true"></i>`;
      const body = make('div', 'res-keep-exploring__body');
      body.innerHTML = `<h3>${item.label}</h3><p>${item.description}</p>`;
      link.append(iconWrap, body);
      keepGrid.appendChild(link);
    });
    keepSection.appendChild(keepGrid);

    root.append(hero, statsSection, pillarsSection, processSection, toolingSection, keepSection);

    /* ── Reveal: stats, tools, keep-exploring animate in; hero is always visible ── */
    const revealItems = root.querySelectorAll('.res-stat, .res-tool, .res-keep-exploring__card');
    if (!reducedMotion && 'IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14 });
      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    /* ── Process steps reveal ── */
    const processStepNodes = root.querySelectorAll('.res-process-step');
    if (!reducedMotion && 'IntersectionObserver' in window) {
      const stepObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      processStepNodes.forEach((node) => stepObserver.observe(node));
    } else {
      processStepNodes.forEach((node) => node.classList.add('is-visible'));
    }

    /* ── Pillar tabs ── */
    const tabs = [...root.querySelectorAll('.res-pillar-tab')];
    const panels = [...root.querySelectorAll('.res-pillar-panel')];
    const counterNode = root.querySelector('.res-pillar-counter');
    const setActivePillar = (index) => {
      tabs.forEach((tab, tabIndex) => {
        tab.classList.toggle('is-active', tabIndex === index);
      });
      panels.forEach((panel, panelIndex) => {
        panel.classList.toggle('is-active', panelIndex === index);
      });
      counterNode.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        const index = Number(tab.dataset.index || 0);
        setActivePillar(index);
        panels[index]?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      });
    });

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.length) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => Math.abs(a.boundingClientRect.top - window.innerHeight / 2) - Math.abs(b.boundingClientRect.top - window.innerHeight / 2))[0];
        if (visible) setActivePillar(Number(visible.target.dataset.index || 0));
      }, { threshold: [0, 0.2, 0.5, 0.8], rootMargin: '-15% 0px -15% 0px' });
      panels.forEach((panel) => observer.observe(panel));
    }
  };

  generatePage();
})();
