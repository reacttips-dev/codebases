import Discussion from 'core/src/models/discussion';

const CommunityDiscussionModel = Discussion.extend({

  initialize: function(attributes, options = {}) {
    if (!_.isUndefined(options.classModel)) {
      this.classModel = options.classModel;
    }
  },

  sync: function(method, model, options) {
    options.data = options.data || {};

    _.extend(options.data, {
      commentSort: this.get('commentSort'),
    });

    return Backbone.sync.apply(this, arguments);
  },
});

export default CommunityDiscussionModel;

