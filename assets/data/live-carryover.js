window.LIVE_CARRYOVER = {
  SHOW_REVIEW_BANNER: false,
  SHOW_UNCONFIRMED: true,
  reviewNotice: 'Review build: some figures, quotes and images are carried over from the current live site and are pending verification.',
  home: {
    sourcePage: '/',
    stats: [
      { value: '7+', label: 'INDUSTRIES', sourcePage: '/' },
      { value: '99.2%', label: 'ACCURACY', sourcePage: '/' },
      { value: '<200ms', label: 'LATENCY', sourcePage: '/' },
      { value: '24/7', label: 'MONITORING', sourcePage: '/' }
    ],
    impactStats: [
      { value: '80%', label: 'AVG. INCIDENT REDUCTION', sourcePage: '/' },
      { value: '2 3 wk', label: 'TYPICAL GO-LIVE', sourcePage: '/' },
      { value: '99.2%', label: 'MODEL ACCURACY', sourcePage: '/' },
      { value: '7+', label: 'SECTORS DEPLOYED', sourcePage: '/' }
    ],
    testimonialIntro: { text: 'From factory floors to farm fields here\'s what early FrameIQ partners are saying.', sourcePage: '/' },
    testimonials: [
      {
        quote: '“FrameIQ deployed a PPE compliance system at our Pune plant in under 3 weeks. Helmet and vest violations dropped by 80% in the first month. Genuinely impressive turnaround.”',
        name: 'Vikram Desai',
        role: 'Head of EHS · Precision Metals Ltd.',
        rating: 5,
        sector: 'MANUFACTURING',
        sourcePage: '/'
      },
      {
        quote: '“BeejHealth identified a fungal infection in our cotton crop two weeks before it became visible. Saved us from losing nearly 40% of the harvest. This is the future of farming.”',
        name: 'Ramesh Patil',
        role: 'Farm Owner · Vidarbha, Maharashtra',
        rating: 5,
        sector: 'AGRICULTURE',
        sourcePage: '/'
      }
    ],
    faq: [
      {
        question: 'What industries does FrameIQ serve?',
        answer: 'FrameIQ serves manufacturing, agriculture, healthcare, security & surveillance, retail, smart cities, banking, and aviation. Our computer vision solutions are adaptable to any industry that requires visual intelligence, quality inspection, or automation.',
        sourcePage: '/'
      },
      {
        question: 'How long does it take to go live?',
        answer: 'Typical deployment takes 2 6 weeks. A standard use case like PPE detection or defect inspection can be live in 2 weeks. Fully custom agentic pipelines with ERP/PLC integration take 4 8 weeks including testing and validation. We always start with a 1 2 week prototype so you see real results before committing.',
        sourcePage: '/'
      },
      {
        question: 'Do I need existing AI/ML infrastructure?',
        answer: 'No. FrameIQ provides end-to-end solutions hardware recommendations, cloud or edge setup, model training, and full software stack. We work with your existing CCTV and infra, or build from scratch. Most clients use existing cameras.',
        sourcePage: '/'
      },
      {
        question: 'What is the FrameIQ AI Store?',
        answer: 'The AI Store is a catalog of ready-to-deploy computer vision models covering Traffic, Safety, Retail, Healthcare, Industry, and Agriculture use cases. You can procure and deploy these models without needing an in-house AI team just plug into your existing cameras.',
        sourcePage: '/'
      },
      {
        question: 'What is BeejHealth?',
        answer: 'BeejHealth is India\'s first AI-powered crop health advisory. Farmers photograph their crops via a mobile app, and our vision AI instantly diagnoses diseases, nutrient deficiencies, and pest infestations with treatment recommendations in Hindi, Marathi, and English.',
        sourcePage: '/'
      },
      {
        question: 'Is my data secure? Can I deploy on-premise?',
        answer: 'Yes. We offer full on-premise deployment where your video data never leaves your network. For cloud deployments, all data is encrypted in transit and at rest. We never share your data with third parties, and you retain full ownership of all trained models.',
        sourcePage: '/'
      },
      {
        question: 'What does a typical engagement cost?',
        answer: 'Starter solutions begin at ₹80,000 for a single-site deployment (e.g., traffic violation detection or PPE compliance). Full enterprise pipelines are custom-scoped. We offer a free 2-week pilot on your actual data before any billing begins.',
        sourcePage: '/'
      },
      {
        question: 'Can FrameIQ work with our existing ERP or PLC systems?',
        answer: 'Yes. Our solutions integrate with SAP, Oracle, and custom ERP systems via REST APIs and webhooks. For manufacturing, we also support direct PLC/SCADA integration to trigger automated responses (e.g., line stoppage on defect detection).',
        sourcePage: '/'
      }
    ]
  },
  sectors: {
    sourcePage: '/sectors',
    names: [
      { slug: 'banking', name: 'BANKING & FINANCE', label: 'Banking & Finance', sourcePage: '/sectors' },
      { slug: 'aviation', name: 'AVIATION', label: 'Aviation', sourcePage: '/sectors' },
      { slug: 'smart-city', name: 'INFRASTRUCTURE', label: 'Infrastructure', sourcePage: '/sectors' },
      { slug: 'security-surveillance', name: 'SECURITY & SURVEILLANCE', label: 'Security & Surveillance', sourcePage: '/sectors' },
      { slug: 'healthcare', name: 'HEALTHCARE & MEDICAL', label: 'Healthcare & Medical', sourcePage: '/sectors' },
      { slug: 'events-entertainment', name: 'EVENTS & ENTERTAINMENT', label: 'Events & Entertainment', sourcePage: '/sectors' },
      { slug: 'manufacturing', name: 'MANUFACTURING', label: 'Manufacturing', sourcePage: '/sectors' }
    ],
    impacts: [
      { slug: 'banking', sector: 'BANKING & FINANCE', items: ['60% ↓ fraud incidents', '40% ↑ faster onboarding', '₹25-40L savings/branch'], sourcePage: '/sectors' },
      { slug: 'aviation', sector: 'AVIATION', items: ['50% ↓ security incidents', '35% ↑ baggage efficiency', '₹1.5-3Cr savings/airport'], sourcePage: '/sectors' },
      { slug: 'smart-city', sector: 'INFRASTRUCTURE', items: ['40% ↓ congestion', '50% ↑ response time', '₹5-10Cr savings/project'], sourcePage: '/sectors' },
      { slug: 'security-surveillance', sector: 'SECURITY & SURVEILLANCE', items: ['80% ↓ incidents', '60% ↓ manpower costs', '₹30-50L savings/facility'], sourcePage: '/sectors' },
      { slug: 'healthcare', sector: 'HEALTHCARE & MEDICAL', items: ['65% ↓ patient incidents', '50% ↑ compliance', '₹20-40L savings/hospital'], sourcePage: '/sectors' },
      { slug: 'events-entertainment', sector: 'EVENTS & ENTERTAINMENT', items: ['60% ↑ crowd flow', '50% ↓ incidents', '₹20-40L savings/event'], sourcePage: '/sectors' },
      { slug: 'manufacturing', sector: 'MANUFACTURING', items: ['70% ↓ accidents', '60% ↑ quality', '₹40-60L savings/plant'], sourcePage: '/sectors' }
    ]
  },
  gear: {
    sourcePage: '/gear',
    heroRating: { value: '4.8', sourcePage: '/gear' },
    categories: [
      { name: 'Vision Systems', sourcePage: '/gear' },
      { name: 'Processing Units', sourcePage: '/gear' },
      { name: 'Sensor Kits', sourcePage: '/gear' },
      { name: 'Development Boards', sourcePage: '/gear' }
    ],
    priceRanges: [
      { label: 'Under ₹10,000', min: 0, max: 9999, sourcePage: '/gear' },
      { label: '₹10,000 ₹20,000', min: 10000, max: 20000, sourcePage: '/gear' },
      { label: '₹20,000 ₹25,000', min: 20000, max: 25000, sourcePage: '/gear' },
      { label: '₹25,000+', min: 25000, max: null, sourcePage: '/gear' }
    ],
    stockFilter: { label: 'In Stock Only', sourcePage: '/gear' },
    products: [
      { id: 'ai-vision-pro-camera', name: 'AI Vision Pro Camera', category: 'Vision Systems', price: 10700, rating: '4.8', sourcePage: '/gear' },
      { id: 'nvidia-jetson-kit', name: 'NVIDIA Jetson Kit', category: 'Processing Units', price: 14000, rating: '4.9', sourcePage: '/gear' },
      { id: 'industrial-cv-camera', name: 'Industrial CV Camera', category: 'Vision Systems', price: 9000, rating: '4.3', sourcePage: '/gear' },
      { id: 'edge-ai-processor-x1', name: 'Edge AI Processor X1', category: 'Processing Units', price: 24800, rating: '4.7', sourcePage: '/gear' },
      { id: 'multi-sensor-array', name: 'Multi-Sensor Array Kit', category: 'Sensor Kits', price: 16500, rating: '4.9', stockStatus: 'Out of stock', sourcePage: '/gear' },
      { id: 'raspberry-pi-ai-dev-board', name: 'Raspberry Pi AI Dev Board', category: 'Development Boards', price: 20650, rating: '4.8', sourcePage: '/gear' }
    ]
  },
  aiStore: {
    sourcePage: '/ai-store',
    categories: ['All products', 'Safety', 'Retail', 'Traffic', 'Health', 'Industry', 'Agriculture'].map((name) => ({ name, sourcePage: '/ai-store' })),
    products: [
      { slug: 'traffic-violation-detection-system', bullets: ['No helmet / overloading detection', 'Live CCTV / video file support', 'Violation report with timestamps', 'Dashboard with violation heatmap'].map((text) => ({ text, sourcePage: '/ai-store' })), sourcePage: '/ai-store' },
      { slug: 'ppe-compliance-monitor', bullets: ['Helmet, vest, glove, boot detection', 'Real-time alert to supervisor', 'Daily compliance report PDF', 'Works on existing CCTV'].map((text) => ({ text, sourcePage: '/ai-store' })), sourcePage: '/ai-store' },
      { slug: 'retail-analytics-system', bullets: ['Footfall counting (in/out)', 'Zone heatmap & dwell time', 'Queue & billing counter alerts', 'Weekly business insights report'].map((text) => ({ text, sourcePage: '/ai-store' })), sourcePage: '/ai-store' },
      { slug: 'restricted-zone-intrusion-alert', bullets: ['Custom zone boundary drawing', 'Day + night (IR) camera support', 'SMS / email / buzzer alert', 'Incident video clip auto-save'].map((text) => ({ text, sourcePage: '/ai-store' })), sourcePage: '/ai-store' },
      { slug: 'product-defect-detection', bullets: ['Trained on your product images', 'Real-time conveyor belt inspection', 'Defect classification report', '99%+ accuracy on trained defects'].map((text) => ({ text, sourcePage: '/ai-store' })), sourcePage: '/ai-store' },
      { slug: 'patient-fall-detection', bullets: ['Pose-based, no face recognition', 'Instant nurse station alert', 'Works in low light / night', 'HIPAA-friendly local processing'].map((text) => ({ text, sourcePage: '/ai-store' })), sourcePage: '/ai-store' },
      { slug: 'crop-disease-detection', bullets: ['Mobile app (Android + iOS)', '20+ crop & disease types', 'Works offline (edge model)', 'Treatment recommendation in Hindi'].map((text) => ({ text, sourcePage: '/ai-store' })), sourcePage: '/ai-store' },
      { slug: 'shelf-stock-monitoring', bullets: ['Empty shelf real-time alert', 'Planogram compliance check', 'Out-of-stock report per SKU zone', 'Works with existing shelf cameras'].map((text) => ({ text, sourcePage: '/ai-store' })), sourcePage: '/ai-store' }
    ]
  },
  about: {
    sourcePage: '/about',
    registrationLine: { value: 'REGISTERED LLP · CIN: ACO-8968', sourcePage: '/about' },
    registration: {
      entity: { value: 'FrameIQ AI', sourcePage: '/about' },
      entityType: { value: 'LLP', sourcePage: '/about' },
      registrationLabel: { value: 'CIN', sourcePage: '/about' },
      registrationNumber: { value: 'ACO-8968', sourcePage: '/about' },
      incorporationDate: { value: 'June 05, 2025', sourcePage: '/about' },
      location: { value: 'India', sourcePage: '/about' },
      status: { value: 'Active', sourcePage: '/about' }
    },
    milestones: [
      { date: 'JUNE 05, 2025', title: 'FrameIQ AI Incorporated', description: 'Officially registered as a Limited Liability Partnership in India. CIN: ACO-8968.', sourcePage: '/about' },
      { date: 'MID 2025', title: 'Vision & Strategy Defined', description: 'AI Vision Products for industry PCB inspection, PPE safety, traffic analytics, and agricultural AI.', sourcePage: '/about' },
      { date: '2025', title: 'Product Development Begins', description: 'Work starts on industrial QC AI, BeejHealth crop advisory, and AI Store models.', sourcePage: '/about' },
      { date: '2025', title: 'BeejHealth in Development', description: 'India\'s first AI-powered crop health advisory system for Indian farmers takes shape.', sourcePage: '/about' },
      { date: '2025 2026', title: 'AI Products Launched', description: 'AutoLabel, BeejHealth, and Traffic Intelligence System go live across sectors.', sourcePage: '/about' },
      { date: '2026 & BEYOND', title: 'Scaling Across India', description: 'Growing team, expanding client partnerships, and building trust across industries.', sourcePage: '/about' }
    ],
    values: [
      { title: 'Innovation First', description: 'We push the boundaries of what\'s possible with AI. Every challenge is an opportunity to build something that\'s never existed before.', sourcePage: '/about' },
      { title: 'Customer Obsessed', description: 'We don\'t just build features we solve real problems. Our customers\' success is our north star.', sourcePage: '/about' },
      { title: 'India First', description: 'Built for Indian conditions Indian agriculture, Indian manufacturing. Our solutions are designed for Bharat, not just metros.', sourcePage: '/about' },
      { title: 'Transparency', description: 'Open communication, honest relationships. We tell you when something isn\'t ready and own our mistakes.', sourcePage: '/about' },
      { title: 'Speed & Excellence', description: 'We ship fast without compromising quality. Great products need both urgency and craft.', sourcePage: '/about' },
      { title: 'Responsible AI', description: 'AI must benefit everyone. We build with fairness, privacy, and sustainability in mind.', sourcePage: '/about' }
    ]
  },
  contact: {
    sourcePage: '/contact',
    hours: { value: 'Mon–Fri, 9am–6pm IST', sourcePage: '/contact' },
    responseCard: {
      title: 'Within 24 hrs',
      subtitle: 'On all business days',
      sourcePage: '/contact'
    },
    responsePromise: {
      title: '24-Hour Promise',
      text: 'We\'re a new company we respond fast. Every inquiry gets a personal reply within 24 business hours.',
      sourcePage: '/contact'
    },
    responseIntro: {
      text: 'Fill the form below no account needed. Tell us about your project and we\'ll reply within 24 hours.',
      sourcePage: '/contact'
    }
  },
  blog: {
    sourcePage: '/blog',
    articles: [
      {
        slug: 'revolutionizing-traffic-management-with-ai',
        title: 'Revolutionizing Traffic Management with AI',
        category: 'Smart Cities',
        excerpt: 'How computer vision is solving congestion, improving safety, and making cities smarter through real-time traffic analysis.',
        author: 'Alex Thompson',
        readTime: '5 min read',
        date: '2/1/2025',
        imageSlot: 'blog-traffic',
        body: [
          { type: 'paragraph', text: 'Traffic congestion is more than just an annoyance; it\'s a major economic and environmental issue. Traditional traffic management systems, reliant on timed signals and manual monitoring, struggle to adapt to the dynamic nature of modern urban flow. Enter Artificial Intelligence and Computer Vision.' },
          { type: 'heading', text: 'The Power of Vision-Based Detection' },
          { type: 'paragraph', text: 'By leveraging high-definition cameras and edge computing, FrameIQ\'s algorithms can analyze traffic patterns in real-time. Unlike inductive loops that only detect vehicle presence, computer vision can identify vehicle types (cars, buses, trucks), detect lane violations, and even recognize pedestrian density at crosswalks.' },
          { type: 'heading', text: 'Adaptive Traffic Signal Control' },
          { type: 'paragraph', text: 'One of the most impactful applications is adaptive signal control. Instead of fixed timers, AI systems adjust traffic light duration based on actual queue lengths. Early deployments have shown a reduction in wait times by up to 40% and a significant decrease in vehicle emissions due to less idling.' },
          { type: 'heading', text: 'Incident Detection & Response' },
          { type: 'paragraph', text: 'Accidents and breakdowns are primary causes of unexpected congestion. AI systems can instantly detect stalled vehicles or accidents and alert traffic management centers. This rapid detection enables faster emergency response and quicker rerouting of traffic, minimizing the ripple effect of delays.' },
          { type: 'heading', text: 'About Alex Thompson' },
          { type: 'paragraph', text: 'Alex Thompson is a thought leader in AI and computer vision, with over 10 years of experience building cutting-edge solutions for Fortune 500 companies.' }
        ],
        sourcePage: '/blog/revolutionizing-traffic-management-with-ai'
      },
      {
        slug: 'edge-vs-cloud-video-analytic',
        title: 'Edge vs Cloud Video Analytic: What\'s Right for You?',
        category: 'Technology',
        excerpt: 'A comprehensive comparison of processing architectures to help you choose the best deployment strategy for your computer vision needs.',
        author: 'James Wilson',
        readTime: '7 min read',
        date: '1/28/2025',
        imageSlot: 'blog-edge-cloud',
        body: [
          { type: 'paragraph', text: 'When deploying computer vision solutions, one of the critical architectural decisions is where to process the video data: at the Edge (on-premise devices) or in the Cloud. Both approaches have distinct advantages and trade-offs.' },
          { type: 'heading', text: 'The Case for Edge Computing' },
          { type: 'paragraph', text: 'Edge computing processes data locally on the device or a nearby server. The primary benefit is **latency**. For applications requiring immediate action like autonomous vehicle braking or industrial safety shutoffs the milliseconds saved by processing locally are crucial. Additionally, Edge processing reduces bandwidth costs since raw video doesn\'t need to be streamed to a central server, only the insights.' },
          { type: 'heading', text: 'The Power of Cloud Analytics' },
          { type: 'paragraph', text: 'Cloud computing offers virtually infinite scalability and storage. It\'s ideal for historical analysis, training complex models, and aggregating data from multiple locations. If your application involves long-term trend analysis or requires heavy computational power that exceeds local device capabilities, the Cloud is often the superior choice.' },
          { type: 'heading', text: 'Hybrid: The Best of Both Worlds?' },
          { type: 'paragraph', text: 'Increasingly, businesses are adopting a hybrid approach. Critical, real-time inferences happen at the Edge, while metadata and key frames are sent to the Cloud for long-term storage and deeper analysis. This balances performance, cost, and capability.' },
          { type: 'heading', text: 'About James Wilson' },
          { type: 'paragraph', text: 'James Wilson is a thought leader in AI and computer vision, with over 10 years of experience building cutting-edge solutions for Fortune 500 companies.' }
        ],
        sourcePage: '/blog/edge-vs-cloud-video-analytic'
      },
      {
        slug: 'ai-in-agriculture',
        title: 'AI in Agriculture: Monitoring Crops from Above',
        category: 'Agriculture',
        excerpt: 'Leveraging drone imagery and deep learning to optimize crop yields, detect diseases early, and automate farming operations.',
        author: 'Priya Sharma',
        readTime: '6 min read',
        date: '1/25/2025',
        imageSlot: 'blog-agriculture',
        body: [
          { type: 'paragraph', text: 'Precision agriculture is undergoing a revolution driven by AI and aerial imagery. Drones equipped with multispectral cameras are providing data that ground-level surveys simply cannot match.' },
          { type: 'heading', text: 'Early Disease Detection' },
          { type: 'paragraph', text: 'Subtle changes in plant color, often invisible to the naked eye, can indicate early signs of stress or disease. Computer vision models trained on thousands of plant images can detect these patterns days or weeks before they become widespread. This allows farmers to target treatment only where needed, reducing chemical usage and costs.' },
          { type: 'heading', text: 'Yield Estimation & Harvest Planning' },
          { type: 'paragraph', text: 'Accurate yield estimation is vital for logistics and market planning. AI models can count fruits or assess biomass volume from aerial scans with remarkable accuracy. This data helps farmers plan efficient harvest schedules and manage supply chain expectations.' },
          { type: 'heading', text: 'Automated Livestock Monitoring' },
          { type: 'paragraph', text: 'It\'s not just about crops. Aerial computer vision is also used to monitor livestock health and grazing patterns. Systems can count herds, detect stray animals, and even identify behavior indicative of illness or predator threats.' },
          { type: 'heading', text: 'About Priya Sharma' },
          { type: 'paragraph', text: 'Priya Sharma is a thought leader in AI and computer vision, with over 10 years of experience building cutting-edge solutions for Fortune 500 companies.' }
        ],
        sourcePage: '/blog/ai-in-agriculture'
      }
    ]
  },
  imageAssets: [
    { slot: 'sector-banking', url: 'https://images.unsplash.com/photo-1601597111158-2fceff292cdc?auto=format&fit=crop&q=80&w=1000', alt: 'BANKING & FINANCE', sourcePage: '/sectors' },
    { slot: 'sector-aviation', url: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=1000', alt: 'AVIATION', sourcePage: '/sectors' },
    { slot: 'sector-smart-city', url: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&q=80&w=1000', alt: 'INFRASTRUCTURE', sourcePage: '/sectors' },
    { slot: 'sector-security', url: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=1000', alt: 'SECURITY & SURVEILLANCE', sourcePage: '/sectors' },
    { slot: 'sector-healthcare', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000', alt: 'HEALTHCARE & MEDICAL', sourcePage: '/sectors' },
    { slot: 'sector-events', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000', alt: 'EVENTS & ENTERTAINMENT', sourcePage: '/sectors' },
    { slot: 'sector-manufacturing', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000', alt: 'MANUFACTURING', sourcePage: '/sectors' },
    { slot: 'gear-board', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', alt: 'Electronic development board', sourcePage: '/gear' },
    { slot: 'gear-devboard', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', alt: 'Electronic development board', sourcePage: '/gear' },
    { slot: 'blog-traffic', url: 'https://cvframeiq.com/blog/Revolutionizing%20Traffic%20Management%20with%20AI.jpg', alt: 'Revolutionizing Traffic Management with AI', sourcePage: '/blog' },
    { slot: 'blog-edge-cloud', url: 'https://cvframeiq.com/blog/Edge%20vs%20Cloud%20Video%20Analytic%20What%23U0393%23U00c7%23U00d6s%20Right%20for%20You.jpg', alt: 'Edge vs Cloud Video Analytic: What\'s Right for You?', sourcePage: '/blog' },
    { slot: 'blog-agriculture', url: 'https://cvframeiq.com/blog/drone-spraying-fertilizer-vegetable-green-plants-agriculture-technology-farm-automation.jpg', alt: 'AI in Agriculture: Monitoring Crops from Above', sourcePage: '/blog' }
  ],
  skippedImages: [
    { slot: 'gear-camera', sourcePage: '/gear', reason: 'The live image was electronic circuit artwork rather than the listed camera; skipped as mismatched.' },
    { slot: 'gear-camera-2', sourcePage: '/gear', reason: 'The live Industrial CV Camera image failed to load in Playwright; skipped as broken.' },
    { slot: 'gear-processor', sourcePage: '/gear', reason: 'The live Edge AI Processor X1 image depicts a phone; skipped as mismatched.' },
    { slot: 'gear-sensor', sourcePage: '/gear', reason: 'The live Multi-Sensor Array image was a generic processor-board close-up, not a sensor array; kept as a designed tile.' }
  ]
};

// Live blog dates precede the June 5, 2025 incorporation date shown on the live About page.
function tagLiveSources(value, sourcePage) {
  if (Array.isArray(value)) {
    value.forEach((item) => tagLiveSources(item, sourcePage));
  } else if (value && typeof value === 'object') {
    const itemSource = value.sourcePage || sourcePage;
    if (itemSource && !value.sourcePage) value.sourcePage = itemSource;
    Object.entries(value).forEach(([key, child]) => {
      if (key !== 'sourcePage') tagLiveSources(child, itemSource);
    });
  }
}
tagLiveSources(window.LIVE_CARRYOVER);
