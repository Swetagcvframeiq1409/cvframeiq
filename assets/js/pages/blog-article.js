(() => {
  'use strict';

  const posts = window.FRAMEIQ_BLOG_POSTS;
  const page = document.querySelector('[data-ba-page]');
  const notFound = document.querySelector('[data-ba-not-found]');
  if (!page || !notFound) return;
  if (!Array.isArray(posts)) {
    console.error('Insight could not initialize because blog data is unavailable.');
    notFound.hidden = false;
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');
  const post = posts.find((item) => item.slug === slug);
  const showDraft = posts.SHOW_DRAFT === true;
  const draftNotice = document.querySelector('[data-blog-draft]');
  if (draftNotice) draftNotice.hidden = !showDraft;
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const appendHeadingText = (heading, text) => {
    text.split(/([^\s]+-[^\s]+)/g).forEach((part) => {
      if (!part) return;
      if (part.includes('-')) {
        const compound = make('span', 'heading-compound', part);
        heading.append(compound);
      } else {
        heading.append(document.createTextNode(part));
      }
    });
  };
  const title = post?.title;
  const hasConfirmedContent = Array.isArray(post?.body) && post.body.some((block) => block?.confirmed === true);
  if (!post || !title || (!showDraft && !hasConfirmedContent)) {
    notFound.hidden = false;
    document.title = 'Insight not found | FrameIQ';
    return;
  }

  page.hidden = false;

  const heading = document.querySelector('[data-ba-title]');
  heading.textContent = title;
  document.querySelector('.ba-meta').after(heading);
  const category = document.querySelector('[data-ba-category]');
  category.textContent = post.category || '';
  category.hidden = !post.category;
  const readingTime = document.querySelector('[data-ba-reading-time]');
  readingTime.textContent = post.readTime || '';
  readingTime.hidden = !post.readTime;
  document.querySelector('[data-ba-summary]').textContent = post.summary || '';
  document.querySelector('[data-ba-summary]').hidden = !post.summary;

  const tagsHost = document.querySelector('[data-ba-tags]');
  (Array.isArray(post.tags) ? post.tags : []).forEach((tag) => tagsHost.append(make('span', 'ba-tag', tag)));

  const cover = document.querySelector('[data-ba-cover]');
  const imageSlot = post.imageSlot;
  if (imageSlot) {
    cover.dataset.photo = imageSlot;
    cover.dataset.photoLoading = 'eager';
    const image = make('img', 'ba-cover__image');
    image.hidden = true;
    image.alt = '';
    image.width = 1600;
    image.height = 900;
    cover.append(image);
  }
  cover.classList.add('photo-frame');
  window.initPhotos?.(cover);

  const body = document.querySelector('[data-ba-body]');
  const showUnconfirmed = showDraft;
  const articleBlocks = Array.isArray(post.body)
    ? post.body.filter((block) => block?.confirmed === true || showUnconfirmed)
    : [];
  const hasUnconfirmedBlocks = articleBlocks.some((block) => block.confirmed !== true);
  if (hasUnconfirmedBlocks) tagsHost.append(make('span', 'ba-tag ba-tag--unconfirmed', 'Unconfirmed'));
  tagsHost.hidden = tagsHost.childElementCount === 0;
  if (articleBlocks.length) {
    articleBlocks.forEach((block) => {
      if (block.type === 'heading' && block.text) {
        const heading = make('h2');
        appendHeadingText(heading, block.text);
        body.append(heading);
      } else if (block.type === 'paragraph' && block.text) {
        body.append(make('p', '', block.text));
      }
    });
  } else {
    if (post.summary) body.append(make('p', '', post.summary));
    body.append(make('p', 'ba-coming-soon', 'The full article is coming soon.'));
  }

  const headings = [...body.querySelectorAll('h2')];
  if (headings.length >= 3) {
    const toc = document.querySelector('[data-ba-toc]');
    const list = make('ol', 'ba-toc__list');
    headings.forEach((item, index) => {
      const id = `ba-section-${index + 1}`;
      item.id = id;
      const link = make('a', '', item.textContent);
      link.href = `#${id}`;
      const entry = make('li');
      entry.append(link);
      list.append(entry);
    });
    toc.append(make('h2', '', 'On this page'), list);
    toc.hidden = false;
  }

  const date = post.date;
  const author = post.author;
  const meta = document.querySelector('[data-ba-published]');
  if (date || author) {
    const pieces = [];
    if (date) pieces.push(date);
    if (author) pieces.push(`By ${author}`);
    meta.textContent = pieces.join(' · ');
    meta.hidden = false;
  }
  const relatedHost = document.querySelector('[data-ba-related]');
  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 2);
  related.forEach((item) => {
    const link = make('a', 'ba-related__link', item.title);
    link.href = `${window.getPageHref('pages/blog-article.html')}?slug=${encodeURIComponent(item.slug)}`;
    relatedHost.append(link);
  });
  const relatedSection = document.querySelector('[data-ba-related-section]');
  relatedSection.hidden = related.length === 0;

  const postIndex = posts.findIndex((item) => item.slug === post.slug);
  const neighboringPosts = [
    { label: 'Previous insight', item: posts[postIndex - 1] },
    { label: 'Next insight', item: posts[postIndex + 1] }
  ].filter(({ item }) => item);
  const postNavigation = document.querySelector('[data-ba-post-navigation]');
  neighboringPosts.forEach(({ label, item }) => {
    const link = make('a', 'ba-post-navigation__link');
    link.href = `${window.getPageHref('pages/blog-article.html')}?slug=${encodeURIComponent(item.slug)}`;
    link.append(make('span', 'ba-post-navigation__label', label), make('strong', '', item.title));
    postNavigation.append(link);
  });
  postNavigation.hidden = neighboringPosts.length === 0;

  const siteUrl = String(window.SITE_URL || '').replace(/\/+$/, '');
  const canonical = `${siteUrl}/pages/blog-article.html?slug=${encodeURIComponent(post.slug)}`;
  const titleSuffix = ' | FrameIQ';
  const pageTitle = title.length + titleSuffix.length < 60
    ? `${title}${titleSuffix}`
    : `${title.slice(0, 46).trimEnd()}…${titleSuffix}`;
  document.querySelector('link[rel="canonical"]').href = canonical;
  document.querySelector('meta[property="og:url"]').content = canonical;
  document.querySelector('meta[property="og:title"]').content = pageTitle;
  const description = String(post.summary || `${title} — a FrameIQ insight in ${post.category || 'computer vision'}.`).slice(0, 157);
  document.querySelector('meta[name="description"]').content = description;
  document.querySelector('meta[property="og:description"]').content = description;
  document.title = pageTitle;

  const copyButton = document.querySelector('[data-ba-copy-link]');
  const copyStatus = document.querySelector('[data-ba-copy-status]');
  copyButton?.addEventListener('click', async () => {
    try {
      await window.FrameIQForms.copyText(canonical);
      copyStatus.textContent = 'Article link copied.';
    } catch (error) {
      console.error('Article link could not be copied.', error);
      copyStatus.textContent = 'Copy was unavailable. Copy the link from the address bar.';
    }
  });

  const progress = document.querySelector('[data-ba-progress]');
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const amount = scrollable > 0 ? Math.min(100, Math.max(0, window.scrollY / scrollable * 100)) : 0;
    progress.style.transform = `scaleX(${amount / 100})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
})();
