// TODO: These generic product names need confirming before launch.
window.HARDWARE = [
  {
    id: 'ai-vision-pro-camera',
    imageSlot: 'gear-camera',
    icon: 'camera',
    name: 'AI Vision Pro Camera',
    category: 'Vision Systems',
    price: 10700,
    stockStatus: 'Check availability',
    estimatedDelivery: '[Placeholder]',
    estimatedDeliveryPlaceholder: true,
    description: '[Placeholder: description]',
    descriptionPlaceholder: true,
    compatibility: []
  },
  {
    id: 'nvidia-jetson-kit',
    imageSlot: 'gear-board',
    icon: 'chip',
    name: 'NVIDIA Jetson Kit',
    category: 'Processing Units',
    price: 14000,
    stockStatus: 'Check availability',
    estimatedDelivery: '[Placeholder]',
    estimatedDeliveryPlaceholder: true,
    description: '[Placeholder: description]',
    descriptionPlaceholder: true,
    compatibility: []
  },
  {
    id: 'industrial-cv-camera',
    imageSlot: 'gear-camera-2',
    icon: 'camera',
    name: 'Industrial CV Camera',
    category: 'Vision Systems',
    price: 9000,
    stockStatus: 'Check availability',
    estimatedDelivery: '[Placeholder]',
    estimatedDeliveryPlaceholder: true,
    description: '[Placeholder: description]',
    descriptionPlaceholder: true,
    compatibility: []
  },
  {
    id: 'edge-ai-processor-x1',
    imageSlot: 'gear-processor',
    icon: 'cpu',
    name: 'Edge AI Processor X1',
    category: 'Processing Units',
    price: 24800,
    stockStatus: 'Check availability',
    estimatedDelivery: '[Placeholder]',
    estimatedDeliveryPlaceholder: true,
    description: '[Placeholder: description]',
    descriptionPlaceholder: true,
    compatibility: []
  },
  {
    id: 'raspberry-pi-ai-dev-board',
    imageSlot: 'gear-devboard',
    icon: 'board',
    name: 'Raspberry Pi AI Dev Board',
    category: 'Development Boards',
    price: 20650,
    stockStatus: 'Check availability',
    estimatedDelivery: '[Placeholder]',
    estimatedDeliveryPlaceholder: true,
    description: '[Placeholder: description]',
    descriptionPlaceholder: true,
    compatibility: []
  },
  {
    id: 'multi-sensor-array',
    imageSlot: 'gear-sensor',
    icon: 'sensor',
    name: 'Multi-Sensor Array',
    category: 'Sensor Kits',
    price: 16500,
    stockStatus: 'Out of stock',
    estimatedDelivery: '[Placeholder]',
    estimatedDeliveryPlaceholder: true,
    description: '[Placeholder: description]',
    descriptionPlaceholder: true,
    compatibility: []
  }
];

if (window.LIVE_CARRYOVER?.SHOW_UNCONFIRMED) {
  const carryoverProducts = new Map(window.LIVE_CARRYOVER.gear.products.map((product) => [product.id, product]));
  window.HARDWARE.forEach((product) => {
    const carryover = carryoverProducts.get(product.id);
    if (!carryover) return;
    product.name = carryover.name;
    product.category = carryover.category;
    product.price = carryover.price;
    product.rating = carryover.rating;
    if (carryover.stockStatus) product.stockStatus = carryover.stockStatus;
  });
}
