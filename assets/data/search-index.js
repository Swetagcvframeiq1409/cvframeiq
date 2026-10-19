window.SEARCH_INDEX = [
  { title: 'Home', url: 'index.html', group: 'Pages', keywords: 'FrameIQ computer vision agentic AI' },
  { title: 'About FrameIQ', url: 'pages/about.html', group: 'Pages', keywords: 'company team mission India story values' },
  { title: 'Contact', url: 'pages/contact.html', group: 'Pages', keywords: 'demo talk project enquiry' },
  { title: 'Sign in', url: 'pages/login.html', group: 'Pages', keywords: 'login account authentication' },
  { title: 'Enquiry', url: 'pages/getstarted.html', group: 'Company', keywords: 'request information account access project contact' },
  { title: 'AI Store', url: 'pages/ai-store.html', group: 'Products', keywords: 'Traffic Violation Detection System PPE Compliance Monitor Retail Analytics System Restricted Zone Intrusion Alert Product Defect Detection Patient Fall Detection Crop Disease Detection Shelf Stock Monitoring computer vision safety retail traffic health industry agriculture' },
  { title: 'BeejHealth', url: 'pages/beejhealth.html', group: 'Products', keywords: 'BeejHealth is an AI crop health advisory for Indian agriculture. Farmers can photograph crops for disease, pest, and nutrient insights. smart agriculture crop health plant disease' },
  { title: 'PCB Guardian', url: 'pages/pcb-guardian.html', group: 'Products', keywords: 'PCB inspection circuit board visual quality inspection product concept to be confirmed' },
  { title: 'PPE Safety', url: 'pages/ppe-safety.html', group: 'Products', keywords: 'PPE safety helmet vest workplace visual review PPE Compliance Monitor' },
  { title: 'AutoLabel', url: 'pages/autolabel.html', group: 'Products', keywords: 'image annotation labeling dataset computer vision product details to be confirmed' },
  { title: 'Computer Vision Research', url: 'pages/research.html', group: 'Pages', keywords: 'computer vision research focus areas visual analytics real-time insights agentic intelligence decision support' },
  { title: 'Features', url: 'pages/features.html', group: 'Pages', keywords: 'Computer Vision for Industry Smart Agriculture BeejHealth Security Surveillance AI Vision Agents manufacturing crop health access control workflow automation' },
  { title: 'PPE Compliance Monitor', url: 'pages/ai-store.html', group: 'Products', keywords: 'safety helmet vest equipment workplace computer vision' },
  { title: 'Gear Store', url: 'pages/gear.html', group: 'Products', keywords: 'hardware cameras edge device accessories products price compare wishlist' },
  { title: 'Security & Surveillance', url: 'pages/sectors/security-surveillance.html', group: 'Pages', keywords: 'security camera monitoring safety' },
  { title: 'AI Vision Agents', url: 'pages/features.html', group: 'Pages', keywords: 'agents automation decisions workflows' },
  { title: 'Blog', url: 'pages/blog.html', group: 'Resources', keywords: 'articles insights updates news' },
  { title: 'Playground', url: 'pages/playground.html', group: 'Resources', keywords: 'interactive demo try experiments' },
  { title: 'Try Live Demo', url: 'pages/playground.html', group: 'Demos', keywords: 'Playground illustrative simulated demo' },
  { title: 'PCB Guardian ROI calculator', url: 'pages/roi-pcb-guardian.html', group: 'Demos', keywords: 'illustrative estimate inputs formula cost inspection' },
  { title: 'PPE Safety ROI calculator', url: 'pages/roi-ppe-safety.html', group: 'Demos', keywords: 'illustrative estimate inputs formula review cost' },
  { title: 'Documentation', url: 'pages/docs.html', group: 'Resources', keywords: 'guides getting started API reference deployment guides planned updates' },
  { title: 'Careers', url: 'pages/careers.html', group: 'Pages', keywords: 'jobs open roles CV application Panvel Maharashtra' },
  { title: 'Responsible AI', url: 'pages/responsible-ai.html', group: 'Company', keywords: 'fairness privacy data handling discussion points' },
  { title: 'Glossary', url: 'pages/glossary.html', group: 'Resources', keywords: 'YOLO edge cloud bounding box computer vision terms' },
  { title: 'Partners', url: 'pages/partners.html', group: 'Company', keywords: 'reseller partner enquiry' },
  { title: 'Press kit', url: 'pages/press-kit.html', group: 'Company', keywords: 'company boilerplate brand colours media' },
  { title: 'Compare approaches', url: 'pages/compare.html', group: 'Resources', keywords: 'generic CCTV analytics edge cloud neutral comparison' },
  { title: 'Sectors', url: 'pages/sectors.html', group: 'Pages', keywords: 'industries computer vision use cases manufacturing agriculture healthcare banking aviation retail smart city security surveillance events entertainment venues' },
  { title: 'Privacy Policy', url: 'pages/privacy.html', group: 'Resources', keywords: 'privacy information rights legal' },
  { title: 'Terms of Service', url: 'pages/terms.html', group: 'Resources', keywords: 'terms website service legal' },
  { title: 'Security', url: 'pages/security.html', group: 'Resources', keywords: 'security information safeguards concern legal' },
  { title: 'Cookie details', url: 'pages/cookies.html', group: 'Resources', keywords: 'cookie privacy' },
  { title: 'Manufacturing', url: 'pages/sectors/manufacturing.html', group: 'Sectors', keywords: 'factory production safety PPE hazard visual review quality control' },
  { title: 'Agriculture', url: 'pages/sectors/agriculture.html', group: 'Sectors', keywords: 'farming crops crop imagery field observation livestock BeejHealth' },
  { title: 'Healthcare', url: 'pages/sectors/healthcare.html', group: 'Sectors', keywords: 'health patient monitoring staff facility safety operations healthcare' },
  { title: 'Security & Surveillance', url: 'pages/sectors/security-surveillance.html', group: 'Sectors', keywords: 'perimeter access control behaviour review asset protection camera views' },
  { title: 'Retail', url: 'pages/sectors/retail.html', group: 'Sectors', keywords: 'footfall movement shelf queue store operations' },
  { title: 'Smart City', url: 'pages/sectors/smart-city.html', group: 'Sectors', keywords: 'smart city traffic infrastructure condition public spaces emergency response' },
  { title: 'Banking', url: 'pages/sectors/banking.html', group: 'Sectors', keywords: 'bank banking finance fraud detection KYC onboarding branch operations compliance records' },
  { title: 'Aviation', url: 'pages/sectors/aviation.html', group: 'Sectors', keywords: 'airport security access baggage runway airside passenger flow' },
  { title: 'Events & Entertainment', url: 'pages/sectors/events-entertainment.html', group: 'Sectors', keywords: 'events entertainment venues crowd flow queues entry operations safety camera views' },
  { title: 'How it Works', url: 'index.html#how-it-works', group: 'Resources', keywords: 'deployment process onboarding' },
  { title: 'Frequently Asked Questions', url: 'index.html#faq', group: 'Resources', keywords: 'FAQ answers support' }
];

if (window.LIVE_CARRYOVER?.SHOW_UNCONFIRMED === true) {
  const labels = new Map(window.LIVE_CARRYOVER.sectors.names.map((sector) => [sector.slug, sector.label]));
  window.SEARCH_INDEX.forEach((item) => {
    const match = item.url.match(/^pages\/sectors\/([^/]+)\.html$/);
    if (match && labels.has(match[1])) item.title = labels.get(match[1]);
  });
}
