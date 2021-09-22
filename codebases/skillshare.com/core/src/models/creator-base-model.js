

const CreatorBaseModel = Backbone.Model.extend({

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);

    // listen for errors to come back from the server. if present,
    // fire an `invalid` event, otherwise, fire a 'valid' event
    this.on('change:errors', this.onErrorChange, this);
  },

  onErrorChange: function(model, value, options) {
    if (!_.isEmpty(value)) {
      this.trigger('invalid', model, value, options);
    } else {
      this.trigger('valid');
    }
  },
});

export default CreatorBaseModel;

