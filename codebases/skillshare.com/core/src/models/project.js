

const Project = Backbone.Model.extend({

  urlRoot: '/projects',

  initialize: function(attributes, options = {}) {
    if (!_.isUndefined(options.classModel)) {
      this.classModel = options.classModel;
    }
  },

  // store response content as an instance variable for easy access
  parse: function(response) {
    this.content = response.content;

    // don't store content in model attributes since it's now an
    // instance on the object. Backbone model attributes are duplicated
    // for convenience, making it too heavy for this purpose
    delete response.content;

    // the rest of the JSON data will get set to the model attributes
    return response;
  },

  fetch: function(options = {}) {
    options.data = _.extend({}, options.data, {
      id: this.id || null,
      sku: this.classModel.get('sku'),
      classId: this.classModel.id,
    });
    return Backbone.Model.prototype.fetch.apply(this, arguments);
  },

  fetchCreatePage: function(opts) {
    const options = _.extend({}, opts, {
      url: '/projects/create',
    });
    return this.fetch(options);
  },

  fetchUpdatePage: function(opts) {
    const options = _.extend({}, opts, {
      url: '/projects/update',
    });
    return this.fetch(options);
  },

  fetchViewPage: function(opts) {
    const options = _.extend({}, opts, {
      url: '/projects/view',
    });
    return this.fetch(options);
  },

});

export default Project;

