import InfiniteScrollerCollection from 'core/src/collections/infinite-scroller';
import InlineDiscussion from 'core/src/models/inline-discussion';

const InlineDiscussionsCollection = InfiniteScrollerCollection.extend({

  url: function() {
    return this.modelUrlPrefix + '/' + this._modelId + '/discussions';
  },

  model: InlineDiscussion,

  parse: function(response) {
    InfiniteScrollerCollection.prototype.parse.apply(this, arguments);
    return response.discussions;
  },

  initialize: function(models, options = {}) {
    _.extend(this, _.pick(options, [
      'modelUrlPrefix',
      // We need to prefix these attributes with _ because
      // Backbone 1.2.0 added a collection method 'modelId'
      // for generating unique ids on polymorphic collections
      '_modelId',
    ]));
    InfiniteScrollerCollection.prototype.initialize.apply(this, arguments);
  },

});

export default InlineDiscussionsCollection;

