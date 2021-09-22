import Review from 'core/src/models/review';

const ReviewsCollection = Backbone.Collection.extend({

  model: Review,

  page: 0,

  loadMore: true,

  path: null,

  initialize: function(models, options = {}) {
    Backbone.Collection.prototype.initialize.apply(this, arguments);

    this.path = options.path;
    this.params = options.params || {};
  },

  url: function() {
    let url = this.path;
    const paramString = $.param(this.params);

    if (paramString !== '') {
      url += '?' + paramString;
    }

    return url;
  },

  // parse is given the response JSON object from the server, and
  // returns the array of JSON objects to be converted into the Collection's
  // models. We use this method to extract the meaningful data from the
  // rest of the response and store on the collection before discarding
  // the response object
  parse: function(response) {
    // store whether more archive reviews exist
    this.loadMoreArchiveReviews = response.loadMoreArchiveReviews;

    // populate the Collection with model data
    return response.archiveReviews;
  },

  fetch: function(options) {
    const _this = this;

    const params = options || {};

    const collectionParams = _.extend({}, params, {
      // success handler, fired after models added
      success: function(collection, response) {
        _this.trigger('update', response);
      },
    });

    collectionParams.data = _.extend({}, collectionParams.data, {
    });

    return Backbone.Collection.prototype.fetch.call(this, collectionParams);
  },
});

export default ReviewsCollection;

