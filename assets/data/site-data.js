window.SITE_URL = 'https://example.invalid';

// leave empty to use email fallbacks
window.FORM_ENDPOINT = '';
window.SITE_FLAGS = { SHOW_DRAFTS: false };

window.SITE_PAGES = [
  'index.html',
  'pages/about.html',
  'pages/ai-store.html',
  'pages/beejhealth.html',
  'pages/blog.html',
  'pages/blog-article.html',
  'pages/careers.html',
  'pages/culture.html',
  'pages/team.html',
  'pages/security.html',
  'pages/pcb-guardian.html',
  'pages/ppe-safety.html',
  'pages/autolabel.html',
  'pages/contact.html',
  'pages/roi-pcb-guardian.html',
  'pages/roi-ppe-safety.html',
  'pages/responsible-ai.html',
  'pages/glossary.html',
  'pages/partners.html',
  'pages/press-kit.html',
  'pages/compare.html',
  'pages/cookies.html',
  'pages/features.html',
  'pages/hardware/gear.html',
  'pages/gear-product.html',
  'pages/hardware/edge-starter-kit.html',
  'pages/hardware/smart-factory-kit.html',
  'pages/getstarted.html',
  'pages/login.html',
  'pages/playground.html',
  'pages/privacy.html',
  'pages/research.html',
  'pages/sectors.html',
  'pages/terms.html',
  'pages/sectors/agriculture.html',
  'pages/sectors/aviation.html',
  'pages/sectors/banking.html',
  'pages/sectors/healthcare.html',
  'pages/sectors/manufacturing.html',
  'pages/sectors/retail.html',
  'pages/sectors/security-surveillance.html',
  'pages/sectors/smart-city.html',
  'pages/sectors/events-entertainment.html'
];

window.SITE_CONTACT = {
  phone: '+91 94231 49303',
  phoneHref: 'tel:+919423149303',
  email: 'official@cvframeiq.com',
  location: 'Panvel, Maharashtra, India',
  hours: 'Mon–Fri, 9am–6pm IST',
  registration: { label: 'CIN', value: 'ACO-8968' }
};

window.NAV_DATA = {
  main: [
    { label: 'Home', href: 'index.html' },
    { label: 'Solutions', href: 'pages/sectors.html' },
    { label: 'Products', href: 'pages/ai-store.html' },
    { label: 'Hardware', href: 'pages/hardware/gear.html' },
    { label: 'Demos', href: 'pages/playground.html' },
    { label: 'Resources', href: 'pages/blog.html' },
    { label: 'About', href: 'pages/about.html' }
  ],
  groups: {
    Solutions: [
      { label: 'All sectors', description: 'Explore how computer vision can be applied across industries.', href: 'pages/sectors.html' },
      { label: 'Banking & Finance', description: 'Explore computer vision use cases for banking and finance.', href: 'pages/sectors/banking.html' },
      { label: 'Aviation', description: 'Explore computer vision use cases for aviation.', href: 'pages/sectors/aviation.html' },
      { label: 'Infrastructure', description: 'Explore computer vision use cases for infrastructure environments.', href: 'pages/sectors/smart-city.html' },
      { label: 'Security & Surveillance', description: 'Explore computer vision use cases for security and surveillance.', href: 'pages/sectors/security-surveillance.html' },
      { label: 'Healthcare & Medical', description: 'Explore computer vision use cases for healthcare and medical environments.', href: 'pages/sectors/healthcare.html' },
      { label: 'Events & Entertainment', description: 'Use cases to discuss for selected event and entertainment venues.', href: 'pages/sectors/events-entertainment.html' },
      { label: 'Manufacturing', description: 'Explore computer vision use cases for manufacturing.', href: 'pages/sectors/manufacturing.html' },
      { label: 'Agriculture', description: 'Explore computer vision use cases for agriculture.', href: 'pages/sectors/agriculture.html' },
      { label: 'Retail', description: 'Explore computer vision use cases for retail.', href: 'pages/sectors/retail.html' }
    ],
    Products: [
      { label: 'AI Store', description: 'Explore FrameIQ computer vision products for industry use cases.', href: 'pages/ai-store.html' },
      { label: 'PCB Guardian', description: 'Discuss a computer-vision PCB inspection concept with FrameIQ.', href: 'pages/pcb-guardian.html' },
      { label: 'BeejHealth', description: 'BeejHealth is an AI crop health advisory for Indian agriculture.', href: 'pages/beejhealth.html' },
      { label: 'AutoLabel', description: 'Discuss image annotation and data preparation requirements with FrameIQ.', href: 'pages/autolabel.html' },
      { label: 'PPE Safety', description: 'Explore the existing PPE Compliance Monitor listing and discuss workplace visual-review requirements.', href: 'pages/ppe-safety.html' }
    ],
    Hardware: [
      { label: 'Gear (all hardware)', description: 'Explore cameras, processing units, sensor kits and development boards.', href: 'pages/hardware/gear.html' },
      { label: 'Edge Starter Kit', description: 'Discuss edge hardware options from the FrameIQ catalog.', href: 'pages/hardware/edge-starter-kit.html' },
      { label: 'Smart Factory Kit', description: 'AI-powered defect detection, production line monitoring, and quality inspection built for Indian manufacturing.', href: 'pages/hardware/smart-factory-kit.html' },
      { label: 'Request a Hardware Quote', description: 'Speak with FrameIQ AI about computer vision, AI automation, and smart monitoring', href: 'pages/hardware/request-quote.html' },
      { label: 'Book a Hardware Demo', description: 'Speak with FrameIQ AI about computer vision, AI automation, and smart monitoring', href: 'pages/hardware/book-demo.html' }
    ],
    Demos: [
      { label: 'Playground', description: 'Explore the FrameIQ AI Playground.', href: 'pages/playground.html' },
      { label: 'PCB Guardian ROI calculator', description: 'Explore an illustrative PCB inspection time and value estimate.', href: 'pages/roi-pcb-guardian.html' },
      { label: 'PPE Safety ROI calculator', description: 'Explore an illustrative PPE video-review time and value estimate.', href: 'pages/roi-ppe-safety.html' }
    ],
    Resources: [
      { label: 'Blog', description: 'Explore FrameIQ insights on AI, computer vision, smart cities, agriculture.', href: 'pages/blog.html' },
      { label: 'Research', description: "Explore FrameIQ's computer vision research focus areas.", href: 'pages/research.html' },
      { label: 'Glossary', description: 'Plain-language explanations of common computer-vision and deployment terms.', href: 'pages/glossary.html' },
      { label: 'Compare approaches', description: 'Neutral questions for comparing video analytics and edge or cloud deployment.', href: 'pages/compare.html' }
    ],
    About: [
      { label: 'About Us', description: 'FrameIQ AI was incorporated in June 2025 in Panvel, Maharashtra, India.', href: 'pages/about.html' },
      { label: 'Culture', description: 'How we work, collaborate, and celebrate together at FrameIQ.', href: 'pages/culture.html' },
      { label: 'Team', description: 'Meet the people building bold AI solutions.', href: 'pages/team.html' },
      { label: 'Join Us', description: 'We are a young company based in Panvel, Maharashtra.', href: 'pages/careers.html' },
      { label: 'How We Work', description: 'Our principles, process, and approach to delivery.', href: 'pages/how-we-work.html' },
      { label: 'Security', description: 'How FrameIQ approaches security and responsible handling of data.', href: 'pages/security.html' }
    ]
  },
  footer: {
    solutions: [],
    products: [
      { label: 'AI Store', href: 'pages/ai-store.html' },
      { label: 'PCB Guardian', href: 'pages/pcb-guardian.html' },
      { label: 'BeejHealth', href: 'pages/beejhealth.html' },
      { label: 'AutoLabel', href: 'pages/autolabel.html' },
      { label: 'PPE Safety', href: 'pages/ppe-safety.html' }
    ],
    hardware: [
      { label: 'Gear (all hardware)', href: 'pages/hardware/gear.html' },
      { label: 'Edge Starter Kit', href: 'pages/hardware/edge-starter-kit.html' },
      { label: 'Smart Factory Kit', href: 'pages/hardware/smart-factory-kit.html' },
      { label: 'Request a Hardware Quote', href: 'pages/hardware/request-quote.html' },
      { label: 'Book a Hardware Demo', href: 'pages/hardware/book-demo.html' }
    ],
    demos: [
      { label: 'Playground', href: 'pages/playground.html' },
      { label: 'PCB Guardian ROI calculator', href: 'pages/roi-pcb-guardian.html' },
      { label: 'PPE Safety ROI calculator', href: 'pages/roi-ppe-safety.html' }
    ],
    resources: [
      { label: 'Blog', href: 'pages/blog.html' },
      { label: 'Research', href: 'pages/research.html' },
      { label: 'Glossary', href: 'pages/glossary.html' },
      { label: 'Compare', href: 'pages/compare.html' }
    ],
    company: [
      { label: 'About', href: 'pages/about.html' },
      { label: 'Culture', href: 'pages/culture.html' },
      { label: 'Team', href: 'pages/team.html' },
      { label: 'How We Work', href: 'pages/how-we-work.html' },
      { label: 'Careers', href: 'pages/careers.html' },
      { label: 'Responsible AI', href: 'pages/responsible-ai.html' },
      { label: 'Partners', href: 'pages/partners.html' },
      { label: 'Press kit', href: 'pages/press-kit.html' },
      { label: 'Contact', href: 'pages/contact.html' }
    ],
    legal: [
      { label: 'Security', href: 'pages/security.html' },
      { label: 'Privacy Policy', href: 'pages/privacy.html' },
      { label: 'Terms of Service', href: 'pages/terms.html' },
      { label: 'Cookie Policy', href: 'pages/cookies.html' }
    ]
  }
};

window.NAV_DATA.footer.solutions = window.NAV_DATA.groups.Solutions;

window.FOOTER_SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/cvframeiq', icon: 'github' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/cvframeiq', icon: 'linkedin' }
];

window.FAQ_DATA = [
  {
    question: 'What industries does FrameIQ serve?',
    answer: 'FrameIQ lists use cases to discuss for manufacturing, agriculture, healthcare, security & surveillance, retail, smart cities, banking, aviation, and events & entertainment. Suitability and scope are confirmed on enquiry.'
  },
  {
    question: 'How long does it take to go live?',
    answer: 'Deployment timing depends on project scope, validation requirements, and deployment environment. Contact FrameIQ to discuss your requirements.'
  },
  {
    question: 'Do I need existing AI/ML infrastructure?',
    answer: ''
  },
  {
    question: 'What is the FrameIQ AI Store?',
    answer: 'The FrameIQ AI Store is a growing library of plug-and-deploy computer vision models and AI workflow components designed for common monitoring, inspection, and automation use cases. It helps teams start faster without building from scratch.'
  },
  {
    question: 'What is BeejHealth?',
    answer: 'BeejHealth is FrameIQ’s AI crop health advisory focused on Indian agriculture. Farmers can photograph crops for disease, pest, and nutrient insights.'
  },
  {
    question: 'Is my data secure? Can I deploy on-premise?',
    answer: ''
  },
  {
    question: 'What does a typical engagement cost?',
    answer: ''
  },
  {
    question: 'Can FrameIQ work with our existing ERP or PLC systems?',
    answer: ''
  }
];
