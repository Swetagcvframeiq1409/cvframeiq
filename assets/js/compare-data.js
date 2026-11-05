window.FRAMEIQ_COMPARE = {
  questions: [
    { question: 'Where must the video stay?', options: ['It must stay on our site', 'It may leave our site', 'Not sure yet'], row: 'Data location' },
    { question: 'How fast must a result arrive?', options: ['Almost instantly', 'A few seconds is fine', 'Not time-critical'], row: 'Response time' },
    { question: 'What happens if the network drops?', options: ['The system must keep working', 'A short pause is acceptable'], row: 'Network dependence' },
    { question: 'How many cameras and sites?', options: ['One site', 'Several sites', 'Many sites'], row: 'Scaling' },
    { question: 'Who will maintain the hardware?', options: ['We will', 'A partner will', 'Not decided'], row: 'Hardware' },
    { question: 'How often will models need updating?', options: ['Rarely', 'Regularly', 'Not sure yet'], row: 'Updates' }
  ],
  rows: [
    ['Where processing happens', 'on devices near the camera.', 'on remote servers.'],
    ['Response time', 'not limited by the network round trip.', 'includes the network round trip.'],
    ['Network dependence', 'can keep running offline.', 'needs a reliable connection.'],
    ['Data location', 'video can stay on site.', "video is sent to the provider's servers."],
    ['Hardware', 'devices to buy, install and maintain.', 'hardware is managed by the provider.'],
    ['Updates', 'rolled out device by device.', 'updated centrally.'],
    ['Scaling', 'add devices per site.', 'add capacity on demand.'],
    ['Cost shape', 'more upfront, less ongoing.', 'less upfront, ongoing usage cost.']
  ]
};
