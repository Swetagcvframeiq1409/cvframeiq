(() => {
  'use strict';

  /* ── helpers ─────────────────────────────────────────── */
  const posts = Array.isArray(window.FRAMEIQ_BLOG_POSTS) ? window.FRAMEIQ_BLOG_POSTS : [];

  /* Image map: slug -> { src, w, h, alt } */
  const imgMap = {
    'revolutionizing-traffic-management-with-ai': {
      src: '../assets/img/revolutiontraffic.webp',
      w: 1200, h: 800,
      alt: 'AI-powered traffic management system monitoring city intersections'
    },
    'edge-vs-cloud-video-analytics': {
      src: '../assets/img/edge-and-cloudai.webp',
      w: 1200, h: 800,
      alt: 'Edge and cloud AI video analytics architecture comparison'
    },
    'ai-in-agriculture-monitoring-crops-from-above': {
      src: '../assets/img/smartagriculture.webp',
      w: 1200, h: 674,
      alt: 'AI monitoring crops from above using drone imagery and deep learning'
    }
  };

  /* Fallback for any post not in the map */
  const fallbackImg = {
    src: '../assets/img/agricultureai.webp',
    w: 1200, h: 800,
    alt: 'AI computer vision technology'
  };

  const iconFor = (cat) => {
    if (cat === 'Agriculture') return 'bi-flower1';
    if (cat === 'Technology') return 'bi-cpu';
    return 'bi-buildings';
  };

  const urlFor = (post) => `blog-article.html?slug=${encodeURIComponent(post.slug)}`;

  /* ── image figure (radius 20px, border, glow, object-fit cover) ── */
  const makeFig = (post, isHero) => {
    const img = imgMap[post.slug] || fallbackImg;
    const fig = document.createElement('figure');
    fig.className = 'rs-fig' + (isHero ? ' rs-fig--hero' : ' rs-fig--card');
    if (isHero) {
      fig.style.cssText = 'aspect-ratio:16/10;';
    } else {
      fig.style.cssText = 'aspect-ratio:16/10;';
    }

    const el = document.createElement('img');
    el.src = img.src;
    el.alt = img.alt;
    el.width = img.w;
    el.height = img.h;
    el.decoding = 'async';
    if (!isHero) el.loading = 'lazy';
    el.className = 'rs-fig__img';
    el.onerror = function () { this.dataset.failed = 'true'; };
    fig.appendChild(el);
    return fig;
  };

  /* ── featured card (55% media / 45% text, desktop) ─── */
  const makeFeatured = (post) => {
    const link = document.createElement('a');
    link.className = 'rs-featured';
    link.href = urlFor(post);
    link.setAttribute('aria-label', `Featured: ${post.title}`);

    link.appendChild(makeFig(post, true));

    const body = document.createElement('div');
    body.className = 'rs-featured__body';
    body.innerHTML = `
      <span class="rs-category">${post.category || ''}</span>
      <h2 class="rs-featured__title">${post.title}</h2>
      <p class="rs-featured__excerpt">${post.excerpt || 'Draft \u2014 pending content'}</p>
      <div class="rs-featured__meta">
        ${post.readTime ? `<span class="rs-meta">${post.readTime}</span>` : ''}
        <span class="rs-status">Coming soon</span>
      </div>
      <span class="rs-link" aria-disabled="true" role="link" tabindex="-1">
        Read article <i class="bi bi-arrow-right" aria-hidden="true"></i>
      </span>`;
    link.appendChild(body);
    return link;
  };

  /* ── grid card ───────────────────────────────────────── */
  const makeCard = (post, delay) => {
    const link = document.createElement('a');
    link.className = 'rs-card rs-reveal';
    link.href = urlFor(post);
    link.dataset.cat = post.category || '';
    link.dataset.search = [post.title, post.category, post.excerpt, ...(post.tags || [])].join(' ');
    if (delay) link.style.setProperty('--rs-delay', `${delay}ms`);

    link.appendChild(makeFig(post, false));

    const body = document.createElement('div');
    body.className = 'rs-card__body';
    body.innerHTML = `
      <span class="rs-category">${post.category || ''}</span>
      <h3 class="rs-card__title">${post.title}</h3>
      <p class="rs-card__excerpt">${post.excerpt || 'Draft \u2014 pending content'}</p>
      <div class="rs-card__foot">
        ${post.readTime ? `<span class="rs-meta">${post.readTime}</span>` : ''}
        <span class="rs-status">Coming soon</span>
      </div>`;
    link.appendChild(body);
    return link;
  };

  /* ── boot ────────────────────────────────────────────── */
  const root = document.getElementById('rs-blog');
  if (!root || !posts.length) return;

  /* featured */
  const featuredEl = document.getElementById('rs-featured');
  if (featuredEl) featuredEl.appendChild(makeFeatured(posts[0]));

  /* grid — ALL posts */
  const grid = document.getElementById('rs-grid');
  if (grid) {
    posts.forEach((post, i) => grid.appendChild(makeCard(post, i * 60)));
  }

  /* ── chip counts ─────────────────────────────────────── */
  const chips = [...root.querySelectorAll('.rs-chip')];
  const cards = [...(grid ? grid.querySelectorAll('.rs-card') : [])];

  const countFor = (cat) => cat === 'All'
    ? cards.length
    : cards.filter((c) => c.dataset.cat === cat).length;

  chips.forEach((chip) => {
    const cat = chip.dataset.cat;
    const n = countFor(cat);
    chip.textContent = cat === 'All' ? `All ${n}` : `${cat} ${n}`;
    chip.setAttribute('aria-pressed', chip.classList.contains('is-active') ? 'true' : 'false');
  });

  /* ── filter + search ─────────────────────────────────── */
  const searchInput = document.getElementById('rs-search');
  const countEl = document.getElementById('rs-count');
  const emptyEl = document.getElementById('rs-empty');
  const clearBtn = document.getElementById('rs-clear');

  let activeCat = 'All';

  /* restore hash on load */
  const hashCat = decodeURIComponent(window.location.hash.slice(1)).toLowerCase();
  if (hashCat) {
    const match = chips.find((c) => c.dataset.cat.toLowerCase() === hashCat);
    if (match) {
      activeCat = match.dataset.cat;
      chips.forEach((c) => {
        const active = c === match;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }
  }

  const render = () => {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    let visible = 0;

    cards.forEach((card) => {
      const catMatch = activeCat === 'All' || card.dataset.cat === activeCat;
      const text = (card.dataset.search || card.textContent).toLowerCase();
      const queryMatch = !query || query.split(/\s+/).filter(Boolean).every((w) => text.includes(w));
      const show = catMatch && queryMatch;
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (countEl) countEl.textContent = `${visible} ${visible === 1 ? 'article' : 'articles'}`;
    if (emptyEl) emptyEl.hidden = visible !== 0;
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      activeCat = chip.dataset.cat;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      const hash = activeCat === 'All' ? '' : `#${activeCat.toLowerCase().replace(/\s+/g, '-')}`;
      history.replaceState(null, '', window.location.pathname + window.location.search + hash);
      render();
    });

    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); chip.click(); }
    });
  });

  if (searchInput) searchInput.addEventListener('input', render);

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      activeCat = 'All';
      chips.forEach((c) => {
        const active = c.dataset.cat === 'All';
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
      history.replaceState(null, '', window.location.pathname + window.location.search);
      render();
    });
  }

  render();

  /* ── reveal (below-fold only) ────────────────────────── */
  if (window.RS && typeof window.RS.reveal === 'function') window.RS.reveal();
})();
