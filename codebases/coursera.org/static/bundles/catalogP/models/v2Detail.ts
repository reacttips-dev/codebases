import CatalogModel from 'bundles/catalogP/models/catalogModel';

const v2Detail = CatalogModel.extend({
  fields: ['plannedLaunchDate'],

  includes: {
    sessions: {
      resource: 'onDemandSessions.v1',
      attribute: 'onDemandSessions',
    },
  },

  resourceName: 'v2Details.v1',
});

export default v2Detail;
