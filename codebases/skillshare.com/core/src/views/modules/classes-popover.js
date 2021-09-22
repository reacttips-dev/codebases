import PopoverView from 'core/src/views/modules/popover';

const ClassesPopoverView = PopoverView.extend({

  showOnHover: true,

  parentView: false,

  HOVER_OPEN_DELAY: 0,

  HOVER_CLOSE_DELAY: 200,

  plugged: false,

  initialize: function(options) {
    PopoverView.prototype.initialize.apply(this, arguments);
    this.parentView = options.parentView;

    this.on('popover:open', _.bind(this.onActionMenuPopover, this));
    this.on('popover:close', _.bind(function() {
      this.plugged = false;
    }, this));
  },

  onActionMenuPopover: function(el) {
    if (this.plugged) {
      return;
    }

    this.plugged = true;
    this.menuElement = el.popoverEl;
    _.each(this.parentView.events, function(callbackName, actionSelectorPair) {
      const pair = actionSelectorPair.split(' ');
      const selector = pair[1];
      const action = pair[0];
      $(selector, this.menuElement).on(action, _.bind(this.parentView[callbackName], this.parentView));
    }, this);
  },
});

export default ClassesPopoverView;

