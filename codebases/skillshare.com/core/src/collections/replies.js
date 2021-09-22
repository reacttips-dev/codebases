import Reply from 'core/src/models/reply';

const RepliesCollection = Backbone.Collection.extend({

  model: Reply,

  url: function() {
    const commentableType = this.activityModel.get('commentableType') || this.activityModel.get('type');

    return '/comments/' + commentableType
        + '/' + this.activityModel.get('commentableId');
  },

  parse: function(models) {
    return models.map(function(model) {
      return this.model.prototype.parse(model);
    }, this);
  },

  initialize: function(models, options) {
    this.activityModel = options.activityModel;
  },

  create: function(model) {
    model.commentable_type = this.activityModel.get('commentableType');
    model.commentable_id = this.activityModel.get('commentableId');

    return Backbone.Collection.prototype.create.apply(this, arguments);
  },

  fetchMore: function(opts) {
    const _this = this;

    const options = _.extend({}, opts, {
      // add models to collection instead of replacing the collection
      update: true,

      // don't remove models in our current collection, even if they're not present
      // in server response
      remove: false,

      // don't fire the 'add' event on each model addition or the
      // `reset`. we use a single event of our own on final success
      silent: true,

      // success handler, fired after models added
      success: function(collection, response) {
        _this.trigger('update', response);
      },

      error: function() {
        _this.trigger('update:error');
      },
    });

    return this.fetch(options);
  },

});

export default RepliesCollection;

