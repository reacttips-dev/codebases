import Discussion from 'core/src/models/discussion';

const DiscussionsCollection = Backbone.Collection.extend({
  model: Discussion,

  url: function() {
    return '/discussions/index';
  },

  // parse is given the response JSON object from the server, and
  // returns the array of JSON objects to be converted into the Collection's
  // models. We use this method to extract the meaningful data from the
  // rest of the response and store on the collection before discarding
  // the response object
  parse: function(response) {

    // store the html in an instance variable
    // this is a HACK. don't treat it as doing anything
    // meaningful other than temporary storage until its rendered
    this.content = response.content;

    // store number of total threads
    this.totalThreads = parseInt(response.totalNumDiscussions, 10);

    // store whether more discussions exist
    this.loadMore = response.loadMore;

    // store last fetch time
    response.discussions.lastFetchTime = (new Date()).getTime();

    // popuplate the Collection with model data
    return response.discussions;
  },

  fetch: function(opts = {}) {
    const _this = this;

    const options = _.extend({}, opts, {
      // success handler, fired after models added
      success: function(collection, response) {
        _this.trigger('update', response);
      },
    });

    options.data = _.extend({}, options.data, {
      sort_method: this.sortMethod,
    });

    return Backbone.Collection.prototype.fetch.call(this, options);
  },

});

export default DiscussionsCollection;

