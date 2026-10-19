window.AI_PRODUCTS = [
  {
    slug: 'traffic-violation-detection-system',
    name: 'Traffic Violation Detection System',
    category: 'Traffic',
    tag: 'Road and site views',
    icon: 'traffic',
    summary: 'A computer vision use case for reviewing vehicle activity in selected road or site camera views.',
    capabilities: [
      'Review vehicle activity in selected camera views',
      'Identify configured traffic events for review',
      'Flag observations for human review',
      'Discuss camera placement and reporting needs'
    ],
    status: 'Enquiry',
    verified: false,
    pendingClaims: ['Product availability, supported scenes, deployment scope and timelines require confirmation.']
  },
  {
    slug: 'ppe-compliance-monitor',
    name: 'PPE Compliance Monitor',
    category: 'Safety',
    tag: 'Workplace vision',
    icon: 'shield',
    summary: 'A computer vision use case for identifying personal protective equipment in workplace camera views.',
    capabilities: [
      'Identify visible helmets and safety vests',
      'Review configured areas in camera views',
      'Flag frames for human review',
      'Discuss event records and reporting needs'
    ],
    status: 'Enquiry',
    verified: false,
    pendingClaims: ['Product availability, supported equipment, deployment scope and timelines require confirmation.']
  },
  {
    slug: 'retail-analytics-system',
    name: 'Retail Analytics System',
    category: 'Retail',
    tag: 'Store operations',
    icon: 'retail',
    summary: 'A computer vision use case for reviewing activity in selected retail areas.',
    capabilities: [
      'Review movement through configured regions',
      'Summarize observed visual patterns for review',
      'Organize observations by selected time periods',
      'Discuss camera coverage and privacy needs'
    ],
    status: 'Enquiry',
    verified: false,
    pendingClaims: ['Product availability, supported scenes, privacy controls, deployment scope and timelines require confirmation.']
  },
  {
    slug: 'restricted-zone-intrusion-alert',
    name: 'Restricted Zone Intrusion Alert',
    category: 'Safety',
    tag: 'Configured areas',
    icon: 'shield',
    summary: 'A computer vision use case for identifying unauthorized presence in configured areas.',
    capabilities: [
      'Review configured areas in camera views',
      'Identify presence for human review',
      'Flag observations in selected views',
      'Discuss site and reporting requirements'
    ],
    status: 'Enquiry',
    verified: false,
    pendingClaims: ['Product availability, supported scenes, deployment scope and timelines require confirmation.']
  },
  {
    slug: 'product-defect-detection',
    name: 'Product Defect Detection',
    category: 'Industry',
    tag: 'Visual inspection',
    icon: 'inspection',
    summary: 'A computer vision use case for reviewing product imagery and highlighting configured visual differences.',
    capabilities: [
      'Review product images or camera frames',
      'Highlight configured surface regions',
      'Support visual review of flagged items',
      'Discuss inspection setup and reference data'
    ],
    status: 'Enquiry',
    verified: false,
    pendingClaims: ['Product availability, supported materials, deployment scope and timelines require confirmation.']
  },
  {
    slug: 'patient-fall-detection',
    name: 'Patient Fall Detection',
    category: 'Health',
    tag: 'Care environments',
    icon: 'health',
    summary: 'A computer vision use case for reviewing movement in selected care-environment camera views.',
    capabilities: [
      'Review movement in selected camera views',
      'Identify configured movement events',
      'Flag observations for staff review',
      'Discuss privacy and site requirements'
    ],
    status: 'Enquiry',
    verified: false,
    pendingClaims: ['Product availability, intended use, privacy controls, deployment scope and timelines require confirmation.']
  },
  {
    slug: 'crop-disease-detection',
    name: 'Crop Disease Detection',
    category: 'Agriculture',
    tag: 'Crop imagery',
    icon: 'agriculture',
    summary: 'A computer vision use case for reviewing crop imagery for visible signs that may need further assessment.',
    capabilities: [
      'Review submitted crop images',
      'Highlight visible areas for closer assessment',
      'Organize observations by image or field context',
      'Discuss crop, capture and validation requirements'
    ],
    status: 'Enquiry',
    verified: false,
    pendingClaims: ['Product availability, crop coverage, intended use, deployment scope and timelines require confirmation.']
  },
  {
    slug: 'shelf-stock-monitoring',
    name: 'Shelf Stock Monitoring',
    category: 'Retail',
    tag: 'Store operations',
    icon: 'retail',
    summary: 'A computer vision use case for reviewing shelf displays and visible product placement in store imagery.',
    capabilities: [
      'Review shelf and display images',
      'Identify configured product or shelf regions',
      'Highlight possible gaps for staff review',
      'Discuss store-specific reporting requirements'
    ],
    status: 'Enquiry',
    verified: false,
    pendingClaims: ['Product availability, supported product sets, deployment scope and timelines require confirmation.']
  },
  {
    slug: 'pcb-inspection',
    name: 'PCB Inspection',
    category: 'Industry',
    tag: 'Demo scene only',
    icon: 'circuit',
    summary: 'An illustrative scene for discussing printed circuit board imagery and visual inspection criteria.',
    capabilities: [
      'Review an illustrative board image',
      'Discuss visual inspection criteria',
      'Consider reference imagery needs',
      'Discuss camera and image requirements'
    ],
    status: 'demo scene only',
    verified: false,
    pendingClaims: ['This is an illustrative Playground scene, not a catalog product.']
  }
];

if (window.LIVE_CARRYOVER?.SHOW_UNCONFIRMED) {
  const carryoverProducts = new Map(window.LIVE_CARRYOVER.aiStore.products.map((product) => [product.slug, product]));
  window.AI_PRODUCTS.forEach((product) => {
    const carryover = carryoverProducts.get(product.slug);
    if (carryover) product.capabilities = carryover.bullets.map((item) => item.text);
  });
}
