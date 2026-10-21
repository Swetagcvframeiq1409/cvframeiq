// false hides draft posts
window.FRAMEIQ_BLOG_POSTS = [
  {
    id: 'traffic-management-ai',
    slug: 'revolutionizing-traffic-management-with-ai',
    imageSlot: 'blog-traffic',
    title: 'AI for Traffic Management',
    category: 'Smart Cities',
    tags: ['traffic management', 'AI'],
    readTime: '6 min read',
    art: { fill: 'rgba(124,58,237,0.12)', path: 'M30 78h140M40 50l25 28 30-42 25 32 25-18', stroke: '#22d3ee' },
    body: []
  },
  {
    id: 'edge-cloud-video-analytics',
    slug: 'edge-vs-cloud-video-analytics',
    imageSlot: 'blog-edge-cloud',
    title: "Edge vs Cloud Video Analytics: What's Right for You?",
    category: 'Technology',
    tags: ['Edge AI', 'cloud', 'video analytics'],
    readTime: '5 min read',
    art: { fill: 'rgba(34,211,238,0.12)', path: 'M40 70c20-30 42-46 72-46 22 0 40 16 48 40M35 92h130', stroke: '#7c3aed' },
    body: []
  },
  {
    id: 'ai-agriculture-crops',
    slug: 'ai-in-agriculture-monitoring-crops-from-above',
    imageSlot: 'blog-agriculture',
    title: 'AI in Agriculture: Monitoring Crops from Above',
    category: 'Agriculture',
    tags: ['computer vision', 'crop monitoring'],
    readTime: '5 min read',
    art: { fill: 'rgba(124,58,237,0.1)', path: 'M40 80c20-8 28-34 48-34s26 18 48 18 36-10 40-24', stroke: '#22d3ee', circle: { cx: '62', cy: '58', r: '10', fill: '#7c3aed' } },
    body: []
  }
];

if (window.LIVE_CARRYOVER?.SHOW_UNCONFIRMED) {
  const carryoverByTitle = new Map(window.LIVE_CARRYOVER.blog.articles.map((article) => [article.title, article]));
  const liveSlugById = {
    'edge-cloud-video-analytics': 'edge-vs-cloud-video-analytic',
    'ai-agriculture-crops': 'ai-in-agriculture'
  };
  window.FRAMEIQ_BLOG_POSTS.forEach((post) => {
    const carryover = [...carryoverByTitle.values()].find((article) => article.slug === (liveSlugById[post.id] || post.slug));
    if (!carryover) return;
    post.title = carryover.title;
    post.category = carryover.category;
    post.summary = carryover.excerpt;
    post.author = carryover.author;
    post.date = carryover.date;
    post.readTime = carryover.readTime;
    post.sourcePage = carryover.sourcePage;
    post.body = carryover.body.map((block) => ({ ...block, confirmed: false }));
  });
}

// false hides unfinished articles
window.FRAMEIQ_BLOG_POSTS.SHOW_DRAFT = true;
