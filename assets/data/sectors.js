window.SECTORS = [
  {
    slug: 'banking',
    imageSlot: 'sector-banking',
    name: 'Banking',
    icon: 'bank',
    summary: 'Explore computer vision use cases for reviewing activity in selected banking environments. Data access, privacy considerations and scope are discussed on enquiry.',
    groups: [
      { title: 'Fraud detection', items: ['Review selected visual events for staff assessment', 'Flag configured activity for human review', 'Discuss camera placement and review workflows'] },
      { title: 'KYC & onboarding', items: ['Review document capture areas', 'Discuss image-quality review steps', 'Consider visual checks within an onboarding workflow'] },
      { title: 'Branch operations', items: ['Review movement in configured branch areas', 'Observe queue and counter activity', 'Discuss branch-specific reporting needs'] },
      { title: 'Compliance records', items: ['Organize selected visual events for review', 'Discuss retention and access requirements', 'Consider record formats for an enquiry scope'] }
    ],
    relatedCategories: [],
    playgroundScene: '',
    status: 'draft'
  },
  {
    slug: 'aviation',
    imageSlot: 'sector-aviation',
    name: 'Aviation',
    icon: 'airplane',
    summary: 'Consider computer vision use cases for selected airport and airside camera views. Site requirements, safety procedures and operational scope are confirmed on enquiry.',
    groups: [
      { title: 'Security & access', items: ['Review configured entry areas', 'Identify presence for staff review', 'Discuss access-zone camera coverage'] },
      { title: 'Baggage operations', items: ['Review selected baggage-handling views', 'Observe configured movement zones', 'Discuss image review and reporting needs'] },
      { title: 'Runway/airside monitoring', items: ['Review configured airside areas', 'Flag selected visual events for review', 'Discuss camera placement and operating conditions'] },
      { title: 'Passenger flow', items: ['Review movement through selected public areas', 'Observe configured queue zones', 'Discuss privacy and reporting requirements'] }
    ],
    relatedCategories: ['Traffic'],
    playgroundScene: 'traffic',
    status: 'draft'
  },
  {
    slug: 'healthcare',
    imageSlot: 'sector-healthcare',
    name: 'Healthcare',
    icon: 'hospital',
    summary: 'Explore visual use cases for selected care and facility environments. Any proposed use is scoped with attention to site needs, privacy and staff review.',
    groups: [
      { title: 'Patient monitoring', items: ['Review movement in selected camera views', 'Identify configured movement events', 'Flag observations for staff review'] },
      { title: 'Staff & access', items: ['Review configured staff-only areas', 'Observe access points in selected views', 'Discuss permissions and review processes'] },
      { title: 'Facility safety', items: ['Review configured corridors and common areas', 'Flag selected visual observations for review', 'Discuss camera coverage and privacy needs'] },
      { title: 'Operations', items: ['Review activity in selected facility zones', 'Organize observations for staff assessment', 'Discuss workflows and reporting requirements'] }
    ],
    relatedCategories: ['Health', 'Safety'],
    playgroundScene: '',
    status: 'draft'
  },
  {
    slug: 'manufacturing',
    imageSlot: 'sector-manufacturing',
    name: 'Manufacturing',
    icon: 'factory',
    summary: 'Explore computer vision use cases for selected production and facility views. The process, environment and review requirements are confirmed on enquiry.',
    groups: [
      { title: 'Safety & PPE', items: ['Identify visible helmets and safety vests', 'Review configured areas in camera views', 'Flag frames for human review'] },
      { title: 'Hazard detection', items: ['Review selected production and facility views', 'Flag configured visual events for review', 'Discuss site-specific review criteria'] },
      { title: 'Vehicle safety', items: ['Review vehicle activity in selected views', 'Observe configured routes and zones', 'Discuss camera placement and review needs'] },
      { title: 'Quality control', items: ['Review product images or camera frames', 'Highlight configured surface regions', 'Discuss inspection setup and reference data'] }
    ],
    relatedCategories: ['Safety', 'Industry', 'Traffic'],
    playgroundScene: 'pcb',
    status: 'draft'
  },
  {
    slug: 'security-surveillance',
    imageSlot: 'sector-security-surveillance',
    name: 'Security & Surveillance',
    icon: 'security',
    summary: 'Consider visual review use cases for configured sites and camera networks. Use cases, access requirements and human review workflows are discussed on enquiry.',
    groups: [
      { title: 'Perimeter', items: ['Review configured boundary areas', 'Identify presence for human review', 'Discuss camera coverage and site layout'] },
      { title: 'Access control', items: ['Review selected entry and exit areas', 'Observe configured access zones', 'Discuss event review and permissions'] },
      { title: 'Behaviour review', items: ['Review selected activity in camera views', 'Flag configured observations for staff review', 'Discuss context and review requirements'] },
      { title: 'Asset protection', items: ['Review selected areas around assets', 'Identify configured visual events for review', 'Discuss camera placement and record needs'] }
    ],
    relatedCategories: ['Safety'],
    playgroundScene: 'ppe',
    status: 'draft'
  },
  {
    slug: 'smart-city',
    imageSlot: 'sector-infrastructure',
    name: 'Smart City',
    icon: 'city',
    summary: 'Explore computer vision use cases for selected public and infrastructure camera views. Deployment scope and operating requirements are confirmed on enquiry.',
    groups: [
      { title: 'Traffic', items: ['Review vehicle activity in selected road views', 'Identify configured traffic events for review', 'Discuss intersection and camera requirements'] },
      { title: 'Infrastructure condition', items: ['Review selected infrastructure imagery', 'Highlight configured visual areas for assessment', 'Discuss capture and inspection requirements'] },
      { title: 'Public spaces', items: ['Review movement in configured public areas', 'Observe selected zones for staff assessment', 'Discuss privacy and reporting needs'] },
      { title: 'Emergency response', items: ['Review selected camera views during an event', 'Flag configured observations for staff review', 'Discuss escalation and workflow requirements'] }
    ],
    relatedCategories: ['Traffic', 'Industry'],
    playgroundScene: 'traffic',
    status: 'draft'
  },
  {
    slug: 'retail',
    imageSlot: 'sector-retail',
    name: 'Retail',
    icon: 'retail',
    summary: 'Explore computer vision use cases for reviewing selected store areas and shelf imagery. Store context, privacy needs and reporting scope are discussed on enquiry.',
    groups: [
      { title: 'Footfall & movement', items: ['Review movement through configured regions', 'Summarize observed visual patterns for review', 'Discuss camera coverage and privacy needs'] },
      { title: 'Shelf review', items: ['Review shelf and display images', 'Identify configured product or shelf regions', 'Highlight possible gaps for staff review'] },
      { title: 'Queue review', items: ['Review activity in configured queue areas', 'Observe selected time periods for staff assessment', 'Discuss store-specific reporting requirements'] },
      { title: 'Store operations', items: ['Review activity in selected retail areas', 'Organize observations for staff review', 'Discuss store layout and camera requirements'] }
    ],
    relatedCategories: ['Retail'],
    playgroundScene: '',
    status: 'draft'
  },
  {
    slug: 'agriculture',
    imageSlot: 'sector-agriculture',
    name: 'Agriculture',
    icon: 'agriculture',
    summary: 'Explore visual use cases for crop, field and livestock imagery. Crop advisory details are available through BeejHealth; scope and suitability are confirmed on enquiry.',
    groups: [
      { title: 'Crop imagery review', items: ['Review submitted crop images', 'Highlight visible areas for closer assessment', 'Discuss crop, capture and validation requirements'] },
      { title: 'Field observation', items: ['Review selected field imagery', 'Organize observations by image or field context', 'Discuss capture and review workflows'] },
      { title: 'Livestock observation', items: ['Review selected livestock imagery', 'Observe configured visual patterns for review', 'Discuss site, capture and staff needs'] },
      { title: 'Records', items: ['Organize observations by image or field context', 'Discuss record formats and access needs', 'Explore crop advisory information through BeejHealth'] }
    ],
    relatedCategories: ['Agriculture'],
    playgroundScene: 'crop',
    status: 'draft'
  },
  {
    slug: 'events-entertainment',
    imageSlot: 'sector-events-entertainment',
    name: 'Events & Entertainment',
    icon: 'ticket',
    summary: 'Consider computer vision use cases for selected event and entertainment venues. Crowd-flow context, camera placement, privacy needs and staff review workflows are use cases to discuss; suitability and scope are confirmed on enquiry.',
    groups: [
      { title: 'Entry & queue review', items: ['Review configured entry and queue areas', 'Observe selected movement patterns for staff assessment', 'Discuss venue layout and camera coverage'] },
      { title: 'Crowd-flow context', items: ['Review activity in selected venue views', 'Organize observations for event staff review', 'Discuss operating context and privacy needs'] },
      { title: 'Venue operations', items: ['Review selected public and back-of-house areas', 'Flag configured visual events for human review', 'Discuss reporting and escalation workflows'] },
      { title: 'Event safety', items: ['Consider use cases to discuss with venue teams', 'Review camera placement and operating requirements', 'Confirm suitability and scope on enquiry'] }
    ],
    relatedCategories: [],
    playgroundScene: '',
    status: 'draft'
  }
];

if (window.LIVE_CARRYOVER?.SHOW_UNCONFIRMED === true) {
  const liveSectors = window.LIVE_CARRYOVER.sectors.names;
  const liveNames = new Map(liveSectors.map((sector) => [sector.slug, sector.label]));
  const liveOrder = new Map(liveSectors.map((sector, index) => [sector.slug, index]));
  window.SECTORS.forEach((sector) => {
    if (liveNames.has(sector.slug)) sector.name = liveNames.get(sector.slug);
  });
  window.SECTORS.sort((left, right) => {
    const leftIndex = liveOrder.get(left.slug);
    const rightIndex = liveOrder.get(right.slug);
    if (leftIndex === undefined) return rightIndex === undefined ? 0 : 1;
    if (rightIndex === undefined) return -1;
    return leftIndex - rightIndex;
  });
}
