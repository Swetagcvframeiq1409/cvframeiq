/* BeejHealth content. Only items with confirmed:true are shown publicly.
   Change a flag to true once Deepak confirms the item. */
window.BEEJHEALTH = {
  SHOW_UNCONFIRMED: false, // dev only: true shows every item with an "Unconfirmed" tag
  intro: {
    name: 'BeejHealth',
    summary: 'BeejHealth is an AI crop health advisory for Indian agriculture. Farmers can photograph crops for disease, pest, and nutrient insights.',
    confirmed: true
  },
  workflow: [
    { title: 'Capture', text: 'Take photos of the crop with a smartphone.', confirmed: true },
    { title: 'AI analysis', text: 'Computer vision reviews the images for visible signs of disease, pests or nutrient issues.', confirmed: true },
    { title: 'Follow-up questions', text: 'The advisory can ask for more context about the crop and field.', confirmed: true },
    { title: 'Summary report', text: 'A structured summary with suggested next steps.', confirmed: true },
    { title: 'Expert review', text: 'Optional review by an agricultural expert.', confirmed: false },
    { title: 'Track and monitor', text: 'Keep crop records over time.', confirmed: false }
  ],
  focusAreas: [
    { title: 'Row crops', text: 'Field crops grown in rows.', confirmed: false },
    { title: 'Plantations', text: 'Large-scale plantation crops.', confirmed: false },
    { title: 'Orchards and vineyards', text: 'Fruit and vine crops.', confirmed: false }
  ],
  crops: [
    { title: 'Supported crops', text: '[Placeholder: confirmed crop list]', confirmed: false }
  ],
  platformFeatures: [
    { title: 'Languages', text: '[Placeholder: confirmed languages]', confirmed: false },
    { title: 'Mobile access', text: '[Placeholder: confirmed platforms]', confirmed: false },
    { title: 'Reports', text: '[Placeholder: confirmed report formats]', confirmed: false }
  ],
  technology: [
    { title: 'Technology', text: '[Placeholder: confirmed technology details]', confirmed: false }
  ],
  roadmap: [
    { title: 'Phase 1', text: '[Placeholder: confirmed roadmap item]', confirmed: false }
  ]
};
