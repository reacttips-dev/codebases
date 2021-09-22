import InfiniteScrollerCollection from 'core/src/collections/infinite-scroller';
import Project from 'core/src/models/project';

const ProjectsCollection = InfiniteScrollerCollection.extend({
  model: Project,

  url: function() {
    let url = this.path;
    const paramString = $.param(this.params);

    if (paramString !== '') {
      url += '?' + paramString;
    }

    return url;
  },

  initialize: function(models, options = {}) {
    _.bindAll(this, 'fetchMore');

    this.page = options.page || 0;
    this.loadMore = options.loadMore || false;
    this.sortMethod = options.sortMethod || undefined;
    this.lastViewTime = options.lastViewTime || null;

    // Add bootstrapped data to the collection
    if (SS.serverBootstrap.projectsData) {
      this.loadMore = SS.serverBootstrap.projectsData.loadMore ? true : false;
      this.page = SS.serverBootstrap.projectsData.page ? parseInt(SS.serverBootstrap.projectsData.page, 10) : 0;
    }

    this.params = options.params || {};
    this.path = options.path || '/projects';
  },

  // parse is given the response JSON object from the server, and
  // returns the array of JSON objects to be converted into the Collection's
  // models. We use this method to extract the meaningful data from the
  // rest of the response and store on the collection before discarding
  // the response object
  parse: function(response) {

    // store the html in an instance variable
    this.content = response.content;

    // store sort method and number of total projects
    this.sortMethod = response.sort;

    // store whether more projects exist for this class
    this.loadMore = response.loadMore;

    // populate the Collection with model data
    return response.projects;
  },

  fetch: function(options = {}) {

    options.data = _.extend({}, options.data, {
      sort: this.sortMethod,
    });

    return Backbone.Collection.prototype.fetch.call(this, options);
  },

  fetchSet: function(options = {}) {

    options.data = _.extend({}, options.data, {
      sort: this.sortMethod,
    });

    return InfiniteScrollerCollection.prototype.fetchSet.call(this, options);
  },

  fetchMore: function(opts) {
    const _this = this;

    const options = _.extend({}, opts, {
      // add models to collection instead of replacing the collection
      update: true,

      // don't remove models in our current collection, even if they're not present
      // in server response
      remove: false,

      // success handler, fired after models added
      success: function(collection, response) {
        _this.trigger('projects:update', response);
        _this.trigger('update', response);
      },

      error: function() {
        _this.trigger('update:error');
      },
    });

    this.page += 1;

    options.data = _.extend({}, options.data, {
      offset: this.length,
      page: this.page,
      slim: 1,
    });
    if (this.lastViewTime) {
      options.data.lastViewTime = this.lastViewTime;
    }

    return this.fetch(options);
  },
});

export default ProjectsCollection;

