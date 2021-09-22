

const InfiniteScrollerCollection = Backbone.Collection.extend({

  page: 1,

  loadMore: false,

  initialize: function(models, options = {}) {

    _.extend(this, _.pick(options, [
      'page',
      'loadMore',
    ]));

    _.bindAll(this, 'fetchMore');
  },

  parse: function(response) {
    this.loadMore = response.loadMore;

    return response;
  },

  // Handles fetching a brand new set of items
  fetchSet: function(options = {}) {
    const _this = this;

    options.data = options.data || {};

    this.page = 1;

    _.extend(options, {
      success: _.wrap(options.success, function(orig, collection, response) {
        _this.trigger('set', response, options);
        if (orig) {
          orig.apply(this, Array.prototype.splice.call(arguments, 1));
        }
      }),
      error: _.wrap(options.error, function(orig) {
        _this.trigger('set:error');
        if (orig) {
          orig.apply(this, Array.prototype.splice.call(arguments, 1));
        }
      }),
    });

    _.extend(options.data, {
      page: this.page,
    });

    return this.fetch(options);
  },

  // Handles fetching more items from the current set
  fetchMore: function(options = {}) {
    options.data = options.data || {};

    this.page += 1;

    _.extend(options, {
      // Add models to the collection instead of replacing the collection
      update: true,
      // Don't remove models in our current collection, even if they're not present
      // in server response
      remove: false,
      success: (collection, response) => {
        this.trigger('update', response, options);
      },
      error: () => {
        this.trigger('update:error');
      },
    });

    _.extend(options.data, {
      page: this.page,
    });

    return this.fetch(options);
  },

});

export default InfiniteScrollerCollection;

