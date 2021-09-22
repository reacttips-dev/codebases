
const TranscriptsSectionModel = Backbone.Model.extend({

  lessonId: undefined,

  initialize: function(attributes, options = {}) {
    _.extend(this, _.pick(options, ['urlRoot', 'lessonId']));
  },

});

export default TranscriptsSectionModel;
