export const FILTER_DEFAULTS = {
  collaborators: [],
  deviceTypes: [
    {
      id: 1,
      name: 'All Types',
      platform: 'all'
    },
    {
      id: 2,
      name: 'Desktop (Web)',
      platform: 'any',
      type: 'desktop'
    },
    {
      id: 3,
      name: 'Mobile Devices',
      platform: 'mobile'
    },
    {
      id: 4,
      name: 'iPhone',
      platform: 'iOS',
      type: 'phone'
    },
    {
      id: 5,
      name: 'iPad',
      platform: 'iOS',
      type: 'tablet'
    },
    {
      id: 6,
      name: 'Android Phone',
      platform: 'Android',
      type: 'phone'
    },
    {
      id: 7,
      name: 'Android Tablet',
      platform: 'Android',
      type: 'tablet'
    }
  ],
  filters: {
    searchTerm: '',
    selectedCollaborator: 0,
    selectedDevice: 0,
    sortType: 0,
    type: 'all'
  },
  filteredDocuments: [],
  documents: [],
  sortTypes: [{
    id: 1,
    name: 'Recent'
  }, {
    id: 2,
    name: 'A-Z'
  }]
}
