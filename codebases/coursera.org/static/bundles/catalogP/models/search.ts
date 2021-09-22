import Backbone from 'backbone-associations';
import CatalogModel from 'bundles/catalogP/models/catalogModel';
import SearchDebug from 'bundles/catalogP/models/searchDebug';

const Search = CatalogModel.extend({
  resourceName: 'search.v1',

  fields: ['courseIds'],

  includes: {
    courses: {
      resource: 'courses.v1',
      attribute: 'courseIds',
    },
  },

  relations: [
    {
      type: Backbone.One,
      key: 'debugData',
      relatedModel: SearchDebug,
      options: {
        parse: true,
      },
    },
  ],
});

export default Search;
