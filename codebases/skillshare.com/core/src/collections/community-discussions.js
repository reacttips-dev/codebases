import DiscussionsCollection from 'core/src/collections/discussions';
import CommunityDiscussionModel from 'core/src/models/community-discussion';

const CommunityDiscussionsCollection = DiscussionsCollection.extend({

  model: CommunityDiscussionModel,

  url: function() {
    let url = this.path;
    const paramString = $.param(this.params);

    if (paramString !== '') {
      url += '?' + paramString;
    }

    return url;
  },

  initialize: function(models, options) {
    _.bindAll(this, 'fetchMore');

    this.sortMethod = options.sortMethod;

    // default value for loadMore
    this.loadMore = true;

    this.params = options.params || {};
    this.path = options.path || '/discussions/community';
    this.page = 0;
  },

  sync: function() {
    return DiscussionsCollection.prototype.sync.apply(this, arguments);
  },

  // call native collection fetch method, passing in extra args
  fetchMore: function(opts) {
    const _this = this;

    const options = _.extend({}, opts, {

      // append to collection instead of replacing
      update: true,

      // don't remove models in our current collection, even if they're not present
      // in server response
      remove: false,

      // success handler, fired after models added
      success: function(collection, response) {
        _this.trigger('update', response);
      },

    });

    this.page += 1;

    options.data = _.extend({}, options.data, {
      offset: this.length,
      sort_method: this.sortMethod,
      page: this.page,
    });

    return this.fetch(options);
  },
});

export default CommunityDiscussionsCollection;

