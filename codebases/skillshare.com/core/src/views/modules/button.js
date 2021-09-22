import SSView from 'core/src/views/base/ss-view';
import TwoPanelSignupView from 'core/src/views/popups/two-panel-signup-view';
import InfoPopoverView from 'core/src/views/modules/info-popover';

const Button = SSView.extend({

  // A button will render itself, but we need a container to append to
  container: null,
  // A button must have a model to sync state to the server.
  // This can be passed in via options, or can be manually derived on initialize when subclassed.
  model: null,
  // Override template in a subclass to define the UI of the button
  template: null,
  // By default all button $el's will be set to the root node of the template, preventing wrapping <div>
  setElementToTemplate: true,
  // This can be overriden depending how we want to calculate state, as it may vary button-to-button.
  initialState: null,
  // We can store the possible tooltip values in a single arr
  tooltips: [],
  // Optionally, we can also assign the button labels for every state
  labels: [],
  // We can assign the button to have info popovers with text
  popovers: [],
  // Whether the button has popovers to display
  hasPopovers: false,
  // Reference to the InfoPopoverView that displays the popover content
  popover: null,
  // Set this to true if the action for the button requires that the user be logged in first
  requiresLogin: false,
  // The redirectTo if this button requires login
  redirectTo: null,
  // Via string to be added to redirectTo when provided
  via: null,

  events: {
    'click': 'onClick',
    'mouseenter': 'onMouseEnter',
    'mouseleave': 'onMouseLeave',
  },

  initialize: function(options) {
    _.bindAll(this, 'update');
    _.extend(this, _.pick(options, [
      'container',
      'model',
      'redirectTo',
      'hasPopovers',
      'requiresLogin',
      'via',
    ]));
    // A button must have an initialState
    // Default to inactive
    if (_.isNull(this.initialState)) {
      this.initialState = Button.states.INACTIVE;
    }
    // If tracking parameters have been set, apply to model
    if (!_.isUndefined(options.modelData) && !_.isUndefined(options.modelData.trackingParams)) {
      this.trackingParams = options.modelData.trackingParams;
      this.model.set('trackingParams', this.trackingParams);
    }
    // Set this initial state on the button's model
    this.setState(this.initialState);
    // Listen for button state change
    this.model.on('change:state', this.update);
    SSView.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    SSView.prototype.render.apply(this, arguments);
    // Make sure the UI is updated on load
    this.update();
  },

  onClick: function() {

    // This button action requires that the user be logged in first
    // so prompt the user to login
    if (this.requiresLogin && SS.currentUser.isGuest()) {
      const redirectTo = this.redirectTo || window.location.href;
      const via = this.via ? `?via=${this.via}` : '';

      new TwoPanelSignupView({
        state: 'signup',
        redirectTo: redirectTo + via,
      });

      return false;
    }

    // Determine the state we want to change to, and set this on the button's model.
    // When set, this will auto change state via update()
    // This can also be listened to outside this class to action more logic based on state
    // ... e.g. when handling multiple buttons
    const newState = this.determineNewState();
    this.setState(newState);
    // Finally sync the button state to the server
    this.sync();
    // Trigger click change event
    this.trigger('click', newState);
    // Attach an active click class to the button
    // (in case we want to add an animation...)
    this.$el.removeClass('click');
    if (this.model.get('state') === Button.states.ACTIVE) {
      this.$el.addClass('click');
    }
  },

  onMouseEnter: function() {
    if (this.model.get('state') === Button.states.ACTIVE) {
      this.setState(Button.states.DEACTIVATE);
    }
  },

  onMouseLeave: function() {
    if (this.model.get('state') === Button.states.DEACTIVATE) {
      this.revertState();
    }
  },

  setState: function(state) {
    // Always remember the previous state, in case we need to revert
    // This is useful for hover events
    this.previousState = this.model.get('state');
    // Actually call set on the model to change state
    this.model.set({ state: state });
  },

  revertState: function() {
    if (!_.isUndefined(this.previousState)) {
      this.setState(this.previousState);
    }
  },

  determineNewState: function() {
    let newState;
    if (this.model.get('state') === Button.states.ACTIVE
        || this.model.get('state') === Button.states.DEACTIVATE) {
      newState = Button.states.INACTIVE;
    } else {
      newState = Button.states.ACTIVE;
    }
    return newState;
  },

  sync: function() {
    const _this = this;
    // Determine which state we just switched to
    switch (this.model.get('state')) {
      // Active state
      case Button.states.ACTIVE:
        this.model.save({}, {
          success: function(model) {
            _this.trigger('save', model);
          },
        });
        break;
        // Inactive
      case Button.states.INACTIVE:
        this.model.destroy({
          success: function() {
            _this.model.unset('id');
            _this.trigger('destroy');
          },
        });
        break;
      default:
        break;
    }
  },


  /*
     * Update the view
     * This function should only handle UI changes, and not interface with the server
     */

  update: function() {
    this.$el.removeClass('active deactivate');
    // Determine which state we just switched to
    switch (this.model.get('state')) {
      // Active
      case Button.states.ACTIVE:
        this.$el.addClass('active');
        this.$el.prop('title', this.tooltips[1]);
        this.$el.data('title', this.popovers[1]);
        break;
        // Inactive
      case Button.states.INACTIVE:
        this.$el.prop('title', this.tooltips[0]);
        this.$el.data('title', this.popovers[0]);
        break;
        // Deactivate Prompt
      case Button.states.DEACTIVATE:
        this.$el.addClass('deactivate');
        break;
      default:
        break;
    }
    // See if we need to update the label of the button
    if (!_.isEmpty(this.labels)) {
      this.$el.html(this.labels[this.model.get('state')]);
    }

    // If we have popovers and we're in a state where the popover gets updated
    // then update the popover content
    if (this.hasPopovers && this.model.get('state') !== Button.states.DEACTIVATE) {
      this.updatePopovers();
    }
  },

  updatePopovers: function() {
    // We already have a popover -- just updates it's contents
    if (this.popover) {
      this.popover.contentEl.html(this.$el.data('title'));
      this.popover.close();
      return;
    }

    this.popover = new InfoPopoverView({
      anchor: this.$el,
    });
  },

});

Button.states = {
  ACTIVE: 1,
  INACTIVE: 0,
  DEACTIVATE: 2,
};

export default Button;

