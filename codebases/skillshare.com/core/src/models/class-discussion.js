import Discussion from 'core/src/models/discussion';

const ClassDiscussionModel = Discussion.extend({

  initialize: function(attributes, options = {}) {
    if (!_.isUndefined(options.classModel)) {
      this.classModel = options.classModel;
    }
  },

  sync: function(method, model, options) {
    options.data = options.data || {};

    _.extend(options.data, {
      sku: this.classModel.get('sku'),
      classId: this.classModel.id,
      commentSort: this.get('commentSort'),
      type: this.get('sectionType'),
    });

    return Backbone.sync.apply(this, arguments);
  },
});

export default ClassDiscussionModel;

