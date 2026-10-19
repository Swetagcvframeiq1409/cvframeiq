// Replace SITE_URL after the public domain is approved.
window.SITE_URL = 'https://example.invalid';

// Set the Formspree endpoint here; leave empty to use the email fallbacks.
window.FORM_ENDPOINT = '';

window.SITE_PAGES = [
  'index.html',
  'pages/about.html',
  'pages/ai-store.html',
  'pages/beejhealth.html',
  'pages/blog.html',
  'pages/blog-article.html',
  'pages/careers.html',
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
  'pages/docs.html',
  'pages/features.html',
  'pages/gear.html',
  'pages/gear-product.html',
  'pages/getstarted.html',
  'pages/login.html',
  'pages/playground.html',
  'pages/privacy.html',
  'pages/research.html',
  'pages/sectors.html',
  'pages/security.html',
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

// Same details as the live cvframeiq.com site (confirmed by Deepak on 15 Oct 2026).
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
    { label: 'Solutions', href: 'pages/sectors.html' },
    { label: 'Products', href: 'pages/ai-store.html' },
    { label: 'Hardware', href: 'pages/gear.html' },
    { label: 'Demos', href: 'pages/playground.html' },
    { label: 'Resources', href: 'pages/blog.html' },
    { label: 'Company', href: 'pages/about.html' }
  ],
  groups: {
    Solutions: [
      { label: 'All sectors', href: 'pages/sectors.html' },
      { label: 'Agriculture', href: 'pages/sectors/agriculture.html' },
      { label: 'Aviation', href: 'pages/sectors/aviation.html' },
      { label: 'Banking', href: 'pages/sectors/banking.html' },
      { label: 'Healthcare', href: 'pages/sectors/healthcare.html' },
      { label: 'Manufacturing', href: 'pages/sectors/manufacturing.html' },
      { label: 'Retail', href: 'pages/sectors/retail.html' },
      { label: 'Security & Surveillance', href: 'pages/sectors/security-surveillance.html' },
      { label: 'Smart City', href: 'pages/sectors/smart-city.html' },
      { label: 'Events & Entertainment', href: 'pages/sectors/events-entertainment.html' }
    ],
    Products: [
      { label: 'AI Store', href: 'pages/ai-store.html' },
      { label: 'PCB Guardian', href: 'pages/pcb-guardian.html' },
      { label: 'BeejHealth', href: 'pages/beejhealth.html' },
      { label: 'AutoLabel', href: 'pages/autolabel.html' },
      { label: 'PPE Safety', href: 'pages/ppe-safety.html' }
    ],
    Hardware: [
      { label: 'Gear', href: 'pages/gear.html' }
    ],
    Demos: [
      { label: 'Playground', href: 'pages/playground.html' },
      { label: 'PCB Guardian ROI calculator', href: 'pages/roi-pcb-guardian.html' },
      { label: 'PPE Safety ROI calculator', href: 'pages/roi-ppe-safety.html' }
    ],
    Resources: [
      { label: 'Blog', href: 'pages/blog.html' },
      { label: 'Docs', href: 'pages/docs.html' },
      { label: 'Research', href: 'pages/research.html' },
      { label: 'Glossary', href: 'pages/glossary.html' },
      { label: 'Compare approaches', href: 'pages/compare.html' }
    ],
    Company: [
      { label: 'About', href: 'pages/about.html' },
      { label: 'Careers', href: 'pages/careers.html' },
      { label: 'Responsible AI', href: 'pages/responsible-ai.html' },
      { label: 'Security', href: 'pages/security.html' },
      { label: 'Press kit', href: 'pages/press-kit.html' },
      { label: 'Partners', href: 'pages/partners.html' }
    ]
  },
  footer: {
    solutions: [
      { label: 'Sectors', href: 'pages/sectors.html' },
      { label: 'Events & Entertainment', href: 'pages/sectors/events-entertainment.html' }
    ],
    products: [
      { label: 'AI Store', href: 'pages/ai-store.html' },
      { label: 'PCB Guardian', href: 'pages/pcb-guardian.html' },
      { label: 'BeejHealth', href: 'pages/beejhealth.html' },
      { label: 'AutoLabel', href: 'pages/autolabel.html' },
      { label: 'PPE Safety', href: 'pages/ppe-safety.html' }
    ],
    hardware: [{ label: 'Gear', href: 'pages/gear.html' }],
    demos: [
      { label: 'Playground', href: 'pages/playground.html' },
      { label: 'PCB Guardian ROI calculator', href: 'pages/roi-pcb-guardian.html' },
      { label: 'PPE Safety ROI calculator', href: 'pages/roi-ppe-safety.html' }
    ],
    resources: [
      { label: 'Blog', href: 'pages/blog.html' },
      { label: 'Docs', href: 'pages/docs.html' },
      { label: 'Research', href: 'pages/research.html' },
      { label: 'Glossary', href: 'pages/glossary.html' },
      { label: 'Compare', href: 'pages/compare.html' }
    ],
    company: [
      { label: 'About', href: 'pages/about.html' },
      { label: 'Careers', href: 'pages/careers.html' },
      { label: 'Responsible AI', href: 'pages/responsible-ai.html' },
      { label: 'Security', href: 'pages/security.html' },
      { label: 'Partners', href: 'pages/partners.html' },
      { label: 'Press kit', href: 'pages/press-kit.html' },
      { label: 'Contact', href: 'pages/contact.html' }
    ],
    legal: [
      { label: 'Privacy Policy', href: 'pages/privacy.html' },
      { label: 'Terms of Service', href: 'pages/terms.html' },
      { label: 'Security', href: 'pages/security.html' },
      { label: 'Cookie Policy', href: 'pages/cookies.html' }
    ]
  }
};

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
    answer: '[Placeholder: add approved answer]'
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
    answer: '[Placeholder: add approved answer]'
  },
  {
    question: 'What does a typical engagement cost?',
    answer: '[Placeholder: add approved answer]'
  },
  {
    question: 'Can FrameIQ work with our existing ERP or PLC systems?',
    answer: '[Placeholder: add approved answer]'
  }
];
