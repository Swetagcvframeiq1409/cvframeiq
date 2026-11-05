(() => {
  'use strict';
  const posts = window.FRAMEIQ_BLOG_POSTS || []; const slug = new URLSearchParams(location.search).get('slug'); const post = posts.find((item) => item.slug === slug); const root = document.querySelector('#rs-article-page');
  if (!root || !post) { document.querySelector('#rs-not-found').hidden = false; return; }
  document.title = `${post.title} | FrameIQ`;
  root.querySelector('[data-title]').textContent = post.title; root.querySelector('[data-category]').textContent = post.category || 'Insight'; root.querySelector('[data-meta]').textContent = [post.author, post.date, post.readTime].filter(Boolean).join(' | ');
  const body = root.querySelector('[data-body]');
  const blocks = Array.isArray(post.body) ? post.body.filter((block) => block && block.confirmed !== false) : [];
  if (!blocks.length) body.appendChild(Object.assign(document.createElement('p'), { className: 'rs-status', textContent: 'Draft - pending content' }));
  blocks.forEach((block) => { if (block.type === 'heading') body.appendChild(Object.assign(document.createElement('h2'), { textContent: block.text })); if (block.type === 'paragraph') body.appendChild(Object.assign(document.createElement('p'), { textContent: block.text })); });
  const more = root.querySelector('[data-more]'); posts.filter((item) => item.slug !== post.slug).forEach((item) => { const link = document.createElement('a'); link.className = 'rs-card'; link.href = `blog-article.html?slug=${encodeURIComponent(item.slug)}`; link.innerHTML = `<div class="rs-thumb"><i class="bi bi-book" aria-hidden="true"></i></div><div class="rs-card__body"><span class="rs-category">${item.category || 'Insight'}</span><h3>${item.title}</h3></div>`; more.appendChild(link); });
  root.hidden = false; RS.progressBar(); RS.reveal();
})();
