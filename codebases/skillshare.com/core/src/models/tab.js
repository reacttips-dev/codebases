

const Tab = Backbone.Model.extend({
  activate: function() {
    if (this.get('active')) {
      this.trigger('change:active', this, true, {});
    } else {
      this.set('active', true);
    }
  },

  deactivate: function() {
    this.set('active', false);
  },
});

export default Tab;

