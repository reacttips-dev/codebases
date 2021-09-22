import CatalogModel from 'bundles/catalogP/models/catalogModel';

const v1Detail = CatalogModel.extend({
  fields: [
    'classId',
    'aboutTheCourse',
    'aboutTheInstructor',
    'courseFormat',
    'courseSyllabus',
    'faq',
    'recommendedBackground',
    'shortDescription',
    'readings',
    'video',
  ],

  includes: {
    sessions: {
      resource: 'v1Sessions.v1',
      attribute: 'sessionIds',
    },
    upcomingSession: {
      resource: 'v1Sessions.v1',
      attribute: 'upcomingSessionId',
    },
  },

  resourceName: 'v1Details.v1',
});

export default v1Detail;
