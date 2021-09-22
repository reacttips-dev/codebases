import Backbone from 'backbone';

const CatalogCollection = Backbone.Collection.extend({
  // this can be overwritten. By default, the collection uses the resourceName,
  // includes, and fields from the defined model
  resourceName: '',
  fields: null,
  includes: null,
});

export default CatalogCollection;
