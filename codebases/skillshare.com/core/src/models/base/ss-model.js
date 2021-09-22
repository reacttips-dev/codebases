

const SSModel = Backbone.Model.extend({

  initialize: function() {
    Backbone.Model.prototype.initialize.apply(this, arguments);
    this.originalAttributes = this.attributes;
  },

  destroy: function(options = {}) {
    if (options.silent) {
      const _this = this;
      this.sync('delete', this, {
        success: function() {
          _this.attributes = _this.originalAttributes;
          _this.set('id', null);
        },
      });
    } else {
      Backbone.Model.prototype.destroy.apply(this, arguments);
    }
  },

});

export default SSModel;

