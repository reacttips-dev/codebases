import Tab from 'core/src/models/tab';

const TabsCollection = Backbone.Collection.extend({

  model: Tab,

  initialize: function() {
    this.on('add', this.setupModelListener, this);
    this.on('remove', this.removeModelListener, this);
  },

  setupModelListener: function(model) {
    this.listenTo(model, 'change:active', this.changeActive);

    if (!this.active) {
      if (model.get('active')) {
        this.active = model;
      }
    } else {
      model.deactivate();
    }
  },

  removeModelListener: function(model) {
    this.stopListening(model);
  },

  changeActive: function(model, active) {
    if (active) {
      if (this.active && this.active != model) {
        this.active.deactivate();
      }

      this.active = model;
      this.trigger('activate', model, this);
    }
  },

  activate: function(text) {
    const model = this.detect(function(mdl) {
      return mdl.get('label') == text;
    });

    if (model) {
      model.activate();
    }
  },
});

export default TabsCollection;

