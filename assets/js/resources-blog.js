(() => {
  'use strict';
  const posts = Array.isArray(window.FRAMEIQ_BLOG_POSTS) ? window.FRAMEIQ_BLOG_POSTS : [];
  const iconFor = (post) => post.category === 'Agriculture' ? 'bi-flower1' : post.category === 'Technology' ? 'bi-cpu' : 'bi-buildings';
  const urlFor = (post) => `blog-article.html?slug=${encodeURIComponent(post.slug)}`;
  const text = (value) => value || 'Draft - pending content';
  const card = (post, featured = false) => {
    const link = document.createElement('a'); link.className = featured ? 'rs-featured rs-reveal' : 'rs-card rs-reveal'; link.href = urlFor(post); link.dataset.cat = post.category || '';
    const thumb = document.createElement('div'); thumb.className = 'rs-thumb'; thumb.appendChild(Object.assign(document.createElement('i'), { className: `bi ${iconFor(post)}`, ariaHidden: 'true' })); link.appendChild(thumb);
    const body = document.createElement('div'); body.className = featured ? 'rs-featured__body' : 'rs-card__body';
    body.innerHTML = `<span class="rs-category">${text(post.category)}</span><${featured ? 'h2' : 'h3'}>${text(post.title)}</${featured ? 'h2' : 'h3'}><p>${text(post.summary)}</p><span class="rs-meta">${text(post.author)}${post.date ? ` · ${post.date}` : ''}${post.readTime ? ` · ${post.readTime}` : ''}</span><span class="rs-link">${featured ? 'Read article' : 'Read article'} <i class="bi bi-arrow-right" aria-hidden="true"></i></span>`;
    link.appendChild(body); return link;
  };
  const root = document.querySelector('#rs-blog'); if (!root || !posts.length) return;
  document.querySelector('#rs-featured').appendChild(card(posts[0], true));
  const grid = document.querySelector('#rs-grid');
  posts.forEach((post, index) => { const item = card(post); item.style.setProperty('--rs-delay', `${index * 60}ms`); grid.appendChild(item); });
  const popular = document.querySelector('#rs-popular');
  if (posts.length >= 6) { posts.slice(0, 6).forEach((post) => { const link = document.createElement('a'); link.href = urlFor(post); link.innerHTML = `<small>${text(post.date)} | ${text(post.category)}</small><strong>${text(post.title)}</strong>`; popular.appendChild(link); }); } else { popular.closest('.rs-band').remove(); }
  const search = document.querySelector('#rs-search');
  RS.filterList({ root, chipSelector: '.rs-chip', itemSelector: '.rs-card', searchInput: search, emptyEl: document.querySelector('#rs-empty') });
  RS.reveal();
})();
