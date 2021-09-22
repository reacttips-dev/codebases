import Watchlist from 'core/src/models/watchlist';

const ClassModel = Backbone.Model.extend({
  // required fields: id, sku, classUrl
  // optional fields: sourceType  // as far as I can tell server only responds for 'Classes'
  defaults: {
    sourceType: 'Classes',
  },

  constructor: function() {
    this.userWatchlist = new Watchlist();
    Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  // We intercept the response and store the content as a property of the
  // model, for easier access
  parse: function(response) {
    this.content = response.content;
    delete response.content;

    // TODO: needs a refactor, watchlist data is not currently uniform across server calls
    let sku = response.sku;
    if (!response.sku && response.parentClass) {
      sku = response.parentClass.sku;
    }

    // Always ensure the watchlist model is set with default attributes for this class
    this.userWatchlist.set({
      parent_sku: sku,
      username: SS.serverBootstrap.userData.username,
    });

    // Update the watchlist model with the watchlist data
    if (response.userWatchlist && response.userWatchlist.id) {
      this.userWatchlist.set({ isWatching: true, id: response.userWatchlist.id });
    }

    // our response from the server may not have all the model
    // attributes we need, so use an extend just in cases
    return response;
  },

  sync: function(method, model, options) {
    options.data = options.data || {};
    _.extend(options.data, {
      sku: this.get('sku'),
      classId: this.id,
    });
    return Backbone.sync.apply(this, arguments);
  },

  fetchHomeContent: function(options = {}) {
    options.data = options.data || {};
    options.url = '/classes/view';
    options.data.id = this.id;
    return this.fetch(options);
  },

  fetchClassroom: function(options = {}) {
    options.url = '/classroom';
    return this.fetch(options);
  },

  fetchSyllabus: function(options = {}) {
    options.url = '/projectGuide';
    return this.fetch(options);
  },
});

export default ClassModel;

