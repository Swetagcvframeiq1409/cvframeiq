window.COMPANY_PAGE_DATA = {
  // Set SHOW_DRAFT to false at launch to hide draft-only content.
  SHOW_DRAFT: true,
  process: [
    { title: 'Understand', description: 'Start with the operating context, visual inputs, and the need to address.' },
    { title: 'Build', description: 'Shape a computer-vision approach around the intended use case.' },
    { title: 'Validate', description: 'Review the approach against relevant conditions and requirements.' },
    { title: 'Deploy', description: 'Prepare the system for its intended environment.' },
    { title: 'Impact', description: 'Bring useful visual intelligence into the intended operation.' }
  ],
  projects: [
    { category: 'Computer Vision', title: 'Computer Vision for Industry', description: 'Inspection, defect detection, and production-line monitoring for manufacturing.', href: 'features.html', link: 'View capabilities' },
    { category: 'Agriculture', title: 'BeejHealth', description: 'An AI crop-health advisory focused on disease, pest, and nutrient insights.', href: 'beejhealth.html', link: 'Explore BeejHealth' },
    { category: 'Product ecosystem', title: 'FrameIQ AI Store', description: 'A growing library of plug-and-deploy computer-vision models and workflow components.', href: 'ai-store.html', link: 'Explore AI Store' }
  ],
  technologies: [
    { name: 'PyTorch', category: 'AI framework', icon: 'nodes' },
    { name: 'TensorFlow', category: 'AI framework', icon: 'nodes' },
    { name: 'OpenCV', category: 'Computer vision', icon: 'vision' },
    { name: 'YOLOv8', category: 'Object detection', icon: 'target' },
    { name: 'Hugging Face', category: 'AI ecosystem', icon: 'nodes' },
    { name: 'Python', category: 'Programming language', icon: 'code' },
    { name: 'ONNX', category: 'Model interoperability', icon: 'layers' },
    { name: 'FastAPI', category: 'API framework', icon: 'code' },
    { name: 'Docker', category: 'Containers', icon: 'layers' },
    { name: 'AWS', category: 'Cloud platform', icon: 'cloud' }
  ],
  visionStages: [
    { title: 'Pixels', description: 'Images and visual input from the world around us.' },
    { title: 'Vision', description: 'Identify useful signals in visual data.' },
    { title: 'Understanding', description: 'Interpret what those signals mean in context.' },
    { title: 'Intelligence', description: 'Connect visual understanding to relevant insight.' },
    { title: 'Decision', description: 'Use insight to inform what happens next.' }
  ]
};
