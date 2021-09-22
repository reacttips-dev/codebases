
const ClassSectionModel = Backbone.Model.extend({

  initialize: function(attributes, options = {}) {
    _.extend(this, _.pick(options, 'urlRoot'));
  },

});

export default ClassSectionModel;

