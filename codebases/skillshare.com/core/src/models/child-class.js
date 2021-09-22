import CreatorBaseModel from 'core/src/models/creator-base-model';

const ChildClassModel = CreatorBaseModel.extend({

  constructor: function(attributes, options) {
    this.parentClass = options.parentClass;
    return Backbone.Model.prototype.constructor.apply(this, arguments);
  },

  parse: function(resp) {
    const response = _.clone(resp);
    return response;
  },

  toJSON: function() {
    const response = _.clone(this.attributes);
    return response;
  },
});

export default ChildClassModel;

