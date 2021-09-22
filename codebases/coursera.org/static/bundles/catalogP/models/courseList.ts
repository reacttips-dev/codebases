import CatalogModel from 'bundles/catalogP/models/catalogModel';

export default CatalogModel.extend({
  includes: {
    courses: {
      resource: 'courses.v1',
      attribute: 'courseIds',
    },
    partners: {
      resource: 'partners.v1',
      attribute: 'partnerIds',
    },
  },

  resourceName: 'courseLists.v1',
});
