import Tag from 'core/src/models/tag';

const TagCollection = Backbone.Collection.extend({

  model: Tag,

  defaults: {
    id: null,
  },

});

export default TagCollection;

