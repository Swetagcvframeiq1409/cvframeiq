(() => {
  'use strict';

  const posts = window.FRAMEIQ_BLOG_POSTS;
  const grid = document.querySelector('#blog-grid');
  if (!grid) return;
  if (!Array.isArray(posts)) {
    console.error('Blog could not initialize because the article data is unavailable.');
    return;
  }

  const state = { query: '', category: 'All' };
  const showDraft = posts.SHOW_DRAFT === true;
  const visiblePosts = posts.filter((post) => showDraft || (Array.isArray(post.body) && post.body.some((block) => block?.confirmed === true)));
  const featuredMedia = document.querySelector('[data-blog-featured-media]');
  const featuredCategory = document.querySelector('[data-blog-featured-category]');
  const featuredTitle = document.querySelector('[data-blog-featured-title]');
  const featuredExcerpt = document.querySelector('[data-blog-featured-excerpt]');
  const featuredMeta = document.querySelector('[data-blog-featured-meta]');
  const featuredLink = document.querySelector('[data-blog-featured-link]');
  const popularGrid = document.querySelector('#blog-popular-grid');
  const filters = document.querySelector('#blog-filter');
  const topicsHost = document.querySelector('#blog-topics');
  const search = document.querySelector('#blog-search');
  const clearSearch = document.querySelector('.blog-search__clear');
  const clearAll = document.querySelector('#blog-clear-all');
  const empty = document.querySelector('#blog-empty');
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const categories = ['All', ...new Set(visiblePosts.map((post) => post.category).filter(Boolean))];
  const articleUrl = (post) => `${window.getPageHref('pages/blog-article.html')}?slug=${encodeURIComponent(post.slug)}`;

  const renderFeatured = () => {
    if (!featuredMedia || !visiblePosts.length) return;
    const post = visiblePosts[0];
    appendCover(featuredMedia, post, 'eager');
    window.initPhotos?.(featuredMedia);
    if (featuredCategory) {
      featuredCategory.textContent = post.category || '';
      featuredCategory.hidden = !post.category;
    }
    if (featuredTitle) featuredTitle.textContent = post.title || '';
    if (featuredExcerpt) {
      featuredExcerpt.textContent = post.summary || '';
      featuredExcerpt.hidden = !post.summary;
    }
    if (featuredMeta) {
      const pieces = [];
      if (post.readTime) pieces.push(post.readTime);
      if (post.date) pieces.push(post.date);
      featuredMeta.textContent = pieces.join(' · ');
      featuredMeta.hidden = pieces.length === 0;
    }
    if (featuredLink) featuredLink.href = articleUrl(post);
  };

  const renderPopular = () => {
    if (!popularGrid) return;
    const list = document.createElement('div');
    list.className = 'blog-popular__list';
    visiblePosts.slice(1, 5).forEach((post, index) => {
      const item = document.createElement('a');
      item.className = 'blog-popular__item';
      item.href = articleUrl(post);
      item.innerHTML = `
        <span class="blog-popular__num">${String(index + 1).padStart(2, '0')}</span>
        <span class="blog-popular__title">${post.title || ''}</span>
        <span class="blog-popular__meta">${post.category || ''} · ${post.readTime || ''}</span>
        <span class="blog-popular__arrow" aria-hidden="true">→</span>
      `;
      list.append(item);
    });
    popularGrid.replaceChildren(list);
  };

  const renderTopics = () => {
    if (!topicsHost) return;
    topicsHost.replaceChildren();
    categories.filter((category) => category !== 'All').forEach((category) => {
      const count = visiblePosts.filter((post) => post.category === category).length;
      const button = make('button', `blog-topic${state.category === category ? ' is-active' : ''}`, '');
      button.type = 'button';
      button.dataset.topic = category;
      button.append(make('span', '', category));
      button.append(make('span', 'blog-topic__count', String(count)));
      topicsHost.append(button);
    });
  };

  categories.forEach((category) => {
    const button = make('button', `blog-filter__button${category === state.category ? ' is-active' : ''}`, category);
    button.type = 'button';
    button.dataset.category = category;
    button.setAttribute('aria-pressed', String(category === state.category));
    filters.append(button);
  });

  topicsHost?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-topic]');
    if (!button) return;
    state.category = button.dataset.topic;
    state.query = '';
    search.value = '';
    renderTopics();
    render();
    document.querySelector('#all-insights')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  const appendCover = (host, post, loading) => {
    const imageSlot = post.imageSlot;
    if (imageSlot) {
      host.dataset.photo = imageSlot;
      host.dataset.photoLoading = loading;
      const image = make('img');
      image.hidden = true;
      image.alt = '';
      image.width = 800;
      image.height = 450;
      host.append(image);
    }
    host.classList.add('photo-frame');
    host.style.aspectRatio = '16 / 9';
  };
  const cardFor = (post, index) => {
    const card = make('article', 'blog-card');
    const cover = make('div', 'blog-card__art');
    appendCover(cover, post, index === 0 ? 'eager' : 'lazy');
    const content = make('div', 'blog-card__content');
    const meta = make('div', 'blog-card__meta');
    if (post.category) meta.append(make('span', 'blog-category', post.category));
    if (post.readTime) meta.append(make('span', '', post.readTime));
    const articleUrl = `${window.getPageHref('pages/blog-article.html')}?slug=${encodeURIComponent(post.slug)}`;
    const heading = make('h2');
    const titleLink = make('a', '', post.title);
    titleLink.href = articleUrl;
    heading.append(titleLink);
    const excerpt = post.summary ? make('p', 'blog-card__excerpt', post.summary) : null;
    const tags = make('div', 'blog-card__tags');
    tags.setAttribute('aria-label', 'Topics');
    (Array.isArray(post.tags) ? post.tags : []).forEach((tag) => tags.append(make('span', '', tag)));
    const more = make('a', 'blog-card__link');
    more.href = articleUrl;
    more.append(document.createTextNode('Read more '));
    const arrow = make('span', '', '→');
    arrow.setAttribute('aria-hidden', 'true');
    more.append(arrow);
    content.append(meta, heading);
    if (excerpt) content.append(excerpt);
    content.append(tags, more);
    card.append(cover, content);
    return card;
  };

  const updateUrl = () => {
    const params = new URLSearchParams();
    if (state.category !== 'All') params.set('category', state.category);
    if (state.query.trim()) params.set('q', state.query.trim());
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`;
    window.history.replaceState(null, '', nextUrl);
  };

  const render = () => {
    updateUrl();
    const query = state.query.trim().toLocaleLowerCase();
    const results = visiblePosts.filter((post) => {
      const searchable = [post.title, post.category, ...(Array.isArray(post.tags) ? post.tags : [])].join(' ').toLocaleLowerCase();
      return (state.category === 'All' || post.category === state.category) && (!query || searchable.includes(query));
    });
    grid.replaceChildren(...results.map(cardFor));
    window.initPhotos?.(grid);
    grid.hidden = results.length === 0;
    empty.hidden = results.length !== 0;
    document.querySelector('#blog-result-count').textContent = `${results.length} ${results.length === 1 ? 'insight' : 'insights'}`;
    clearSearch.hidden = state.query.length === 0;
    clearAll.hidden = state.query.length === 0 && state.category === 'All';
    filters.querySelectorAll('[data-category]').forEach((button) => {
      const active = button.dataset.category === state.category;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  };

  const clearFilters = () => {
    state.query = '';
    state.category = 'All';
    search.value = '';
    render();
  };
  const params = new URLSearchParams(window.location.search);
  state.query = params.get('q') || '';
  search.value = state.query;
  if (categories.includes(params.get('category'))) state.category = params.get('category');
  search.addEventListener('input', () => {
    state.query = search.value;
    render();
  });
  clearSearch.addEventListener('click', () => {
    state.query = '';
    search.value = '';
    render();
    search.focus();
  });
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('[data-category]');
    if (!button) return;
    state.category = button.dataset.category;
    renderTopics();
    render();
  });
  clearAll.addEventListener('click', clearFilters);
  document.querySelectorAll('[data-blog-clear]').forEach((button) => button.addEventListener('click', clearFilters));
  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('[data-reveal]').forEach((node) => revealObserver.observe(node));
  renderFeatured();
  renderPopular();
  renderTopics();
  render();
})();
