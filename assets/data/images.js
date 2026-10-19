// LoremFlickr was unreliable (HTTP 500) so it is OFF. Add licensed photos to assets/img/photos/ instead.
window.IMAGE_CONFIG = { USE_TEMP_REMOTE: false };
window.LOCAL_PHOTOS = [];
window.LOCAL_PHOTOS_READY = fetch(new URL('./local-photos.js', document.currentScript.src), { cache: 'no-store' })
  .then((response) => response.ok ? response.text() : '')
  .then((source) => {
    const match = source.match(/^\s*window\.LOCAL_PHOTOS\s*=\s*(\[[\s\S]*\]);\s*$/);
    if (!match) return [];
    const slots = JSON.parse(match[1]);
    return Array.isArray(slots) && slots.every((slot) => typeof slot === 'string') ? slots : [];
  })
  .then((slots) => {
    window.LOCAL_PHOTOS = slots;
    return slots;
  })
  .catch(() => {
    window.LOCAL_PHOTOS = [];
    return [];
  });

window.SITE_IMAGES = {
  'home-hero': {
    local: 'assets/img/photos/home-hero.jpg',
    alt: 'Computer vision system monitoring an industrial production line',
    keywords: 'city',
    lock: 1,
    width: 1600,
    height: 900
  },
  'about-hero': {
    local: 'assets/img/photos/about-hero.jpg',
    alt: 'Team collaborating around a computer vision project',
    keywords: 'office',
    lock: 2,
    width: 1600,
    height: 900
  },
  'sector-banking': {
    local: 'assets/img/photos/sector-banking.jpg',
    alt: 'Modern bank interior with customer service counters',
    keywords: 'bank',
    lock: 3,
    width: 800,
    height: 450
  },
  'sector-aviation': {
    local: 'assets/img/photos/sector-aviation.jpg',
    alt: 'Passenger aircraft at an airport gate',
    keywords: 'airplane',
    lock: 4,
    width: 800,
    height: 450
  },
  'sector-healthcare': {
    local: 'assets/img/photos/sector-healthcare.jpg',
    alt: 'Healthcare professionals in a modern clinical setting',
    keywords: 'hospital',
    lock: 5,
    width: 800,
    height: 450
  },
  'sector-manufacturing': {
    local: 'assets/img/photos/sector-manufacturing.jpg',
    alt: 'Automated machinery on a factory production line',
    keywords: 'factory',
    lock: 6,
    width: 800,
    height: 450
  },
  'sector-security': {
    local: 'assets/img/photos/sector-security.jpg',
    alt: 'Security camera overlooking a public entrance',
    keywords: 'surveillance',
    lock: 7,
    width: 800,
    height: 450
  },
  'sector-smart-city': {
    local: 'assets/img/photos/sector-smart-city.jpg',
    alt: 'Urban traffic moving through a modern city intersection',
    keywords: 'skyline',
    lock: 8,
    width: 800,
    height: 450
  },
  'sector-events': {
    local: 'assets/img/photos/sector-events.jpg',
    alt: 'Event venue prepared for attendees',
    keywords: 'event venue',
    lock: 24,
    width: 800,
    height: 450
  },
  'sector-retail': {
    local: 'assets/img/photos/sector-retail.jpg',
    alt: 'Organized retail shelves in a grocery store',
    keywords: 'shop',
    lock: 9,
    width: 800,
    height: 450
  },
  'sector-agriculture': {
    local: 'assets/img/photos/sector-agriculture.jpg',
    alt: 'Aerial view of crop fields',
    keywords: 'farm',
    lock: 10,
    width: 800,
    height: 450
  },
  'beejhealth-hero': {
    local: 'assets/img/photos/beejhealth-hero.jpg',
    alt: 'Healthy green crops growing in an agricultural field',
    keywords: 'leaf',
    lock: 11,
    width: 1600,
    height: 900
  },
  'research-hero': {
    local: 'assets/img/photos/research-hero.jpg',
    alt: 'Computer vision researcher reviewing visual data on a screen',
    keywords: 'circuit',
    lock: 12,
    width: 1600,
    height: 900
  },
  'gear-camera': {
    local: 'assets/img/photos/gear-camera.jpg',
    alt: 'Industrial machine vision camera and lens',
    keywords: 'camera',
    lock: 13,
    width: 800,
    height: 450
  },
  'gear-board': {
    local: 'assets/img/photos/gear-board.jpg',
    alt: 'Electronic development board with processor components',
    keywords: 'circuit',
    lock: 14,
    width: 800,
    height: 450
  },
  'gear-processor': {
    local: 'assets/img/photos/gear-processor.jpg',
    alt: 'Close-up of an electronic processor on a circuit board',
    keywords: 'microchip',
    lock: 15,
    width: 800,
    height: 450
  },
  'gear-devboard': {
    local: 'assets/img/photos/gear-devboard.jpg',
    alt: 'Single-board computer used for edge computing',
    keywords: 'electronics',
    lock: 16,
    width: 800,
    height: 450
  },
  'gear-sensor': {
    local: 'assets/img/photos/gear-sensor.jpg',
    alt: 'Multi-Sensor Array Kit',
    keywords: 'sensor array',
    lock: 25,
    width: 800,
    height: 450
  },
  'blog-traffic': {
    local: 'assets/img/photos/blog-traffic.jpg',
    alt: 'City traffic viewed from above at a busy intersection',
    keywords: 'traffic',
    lock: 17,
    width: 800,
    height: 450
  },
  'blog-edge-cloud': {
    local: 'assets/img/photos/blog-edge-cloud.jpg',
    alt: 'Data center servers supporting cloud computing',
    keywords: 'server',
    lock: 18,
    width: 800,
    height: 450
  },
  'blog-agriculture': {
    local: 'assets/img/photos/blog-agriculture.jpg',
    alt: 'Aerial view of cultivated farmland',
    keywords: 'tractor',
    lock: 19,
    width: 800,
    height: 450
  },
  'ai-store-hero': {
    local: 'assets/img/photos/ai-store-hero.jpg',
    alt: 'Industrial camera observing activity in a factory',
    keywords: 'robot',
    lock: 20,
    width: 1600,
    height: 900
  },
  'careers-team': {
    local: 'assets/img/photos/careers-team.jpg',
    alt: 'Colleagues working together around a table',
    keywords: 'office',
    lock: 21,
    width: 1600,
    height: 900
  },
  'login-bg': {
    local: 'assets/img/photos/login-bg.jpg',
    alt: 'Modern technology workspace with computer equipment',
    keywords: 'abstract',
    lock: 22,
    width: 1600,
    height: 900
  },
  'gear-camera-2': {
    local: 'assets/img/photos/gear-camera-2.jpg',
    alt: 'Industrial surveillance camera for machine vision',
    keywords: 'cctv',
    lock: 23,
    width: 800,
    height: 450
  }
};

window.PHOTO_ICONS = {
  'home-hero': 'cameraStill',
  'research-hero': 'cpu',
  'sector-banking': 'bank',
  'sector-aviation': 'airplane',
  'sector-healthcare': 'hospital',
  'sector-manufacturing': 'factory',
  'sector-security': 'shieldCheck',
  'sector-smart-city': 'city',
  'sector-events': 'ticket',
  'sector-retail': 'retail',
  'sector-agriculture': 'agriculture',
  'beejhealth-hero': 'leaf',
  'gear-camera': 'camera',
  'gear-camera-2': 'camera',
  'gear-board': 'chip',
  'gear-sensor': 'sensor',
  'gear-processor': 'cpu',
  'gear-devboard': 'board',
  'blog-traffic': 'signpost',
  'blog-edge-cloud': 'cloud',
  'blog-agriculture': 'agriculture',
  'ai-store-hero': 'robot',
  'about-hero': 'users',
  'careers-team': 'users',
  'login-bg': 'security'
};

window.getImage = function getImage(slot, source = 'local', root = document.body.dataset.root || '') {
  const image = window.SITE_IMAGES?.[slot];
  if (!image) {
    console.error(`Image data is unavailable for slot "${slot}".`);
    return '';
  }
  if (source === 'temp') {
    return `https://loremflickr.com/${image.width}/${image.height}/${encodeURIComponent(image.keywords)}?lock=${image.lock}`;
  }
  if (source === 'picsum') return `https://picsum.photos/seed/${encodeURIComponent(slot)}/${image.width}/${image.height}`;
  if (source === 'local') return `${root || './'}${image.local}`;
  console.error(`Unknown image source "${source}" for slot "${slot}".`);
  return '';
};
