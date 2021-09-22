import SSView from 'core/src/views/base/ss-view';
import template from 'text!core/src/templates/shared/_tab.mustache';

const TabItemView = SSView.extend({

  tagName: 'li',
  template: template,

  events: {
    'click': 'onClick',
  },

  className: function() {
    const classNames = ['tab', 'left'];
    if (this.model.get('active')) {
      classNames.push('active');
    }
    return classNames.join(' ');
  },

  templateData: function() {
    return this.model.attributes;
  },

  initialize: function() {
    this.listenTo(this.model, 'change:active', this.updateActiveClass);
  },

  onClick: function(event) {
    event.preventDefault();
    this.model.activate();
  },

  updateActiveClass: function(model, active) {
    this.$el.toggleClass('active', active);
  }
});

export default TabItemView;
