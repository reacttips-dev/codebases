import Button from 'core/src/views/modules/button';
import NumberHelpers from 'core/src/helpers/number-helpers';
import template from 'text!core/src/templates/modules/buttons/follow-button.mustache';

const FollowUserButton = Button.extend({

  classes: 'grey small',
  template: template,
  tooltips: [
    'Follow',
    'Unfollow',
    'Unfollow',
  ],
  labels: [
    'Follow',
    'Following',
    'Following',
  ],

  requiresLogin: true,

  initialize: function(options = {}) {
    _.extend(this, _.pick(options, [
      'classes',
      'noFollow',
      'redirectTo',
    ]));
    // Store a model ref for our user that can be followed
    this.user = options.modelData.user;
    const data = {
      childUid: this.user.get('uid'),
    };
      // By passing an id, we're saying the user has already activated the button state
    if (options.modelData.followingId !== false) {
      _.extend(data, {
        id: options.modelData.followingId,
      });
    }

    // This is a model for the follow action itself
    // allow an optional model to be passed in for the case where we have
    // multiple follow buttons that should be synced
    if (_.has(options, 'model')) {
      this.model = options.model;
    } else {
      this.model = new Backbone.Model(data);
    }
    this.model.urlRoot = '/users/follow';
    // Set initial state
    this.initialState = !_.isUndefined(this.model.get('id'))
      ? Button.states.ACTIVE : Button.states.INACTIVE;
    // Listen for save event (follow)
    this.on('save', this.onFollow);
    Button.prototype.initialize.apply(this, arguments);
  },

  render: function() {
    Button.prototype.render.apply(this, arguments);
    this.$el.addClass(this.classes);
    if (this.noFollow) {
      this.$el.attr('rel', 'nofollow');
    }
  },

  onClick: function() {
    // Here we want to update the total follower count on the user model we just followed/unfollowed
    // Ensure num is an int
    const currCount = NumberHelpers.stripCommas(this.user.get('numFollowers'));
    if (!_.isUndefined(currCount)) {
      let newCount;
      if (this.determineNewState() === Button.states.ACTIVE) {
        newCount = currCount + 1;
      } else {
        newCount = currCount - 1;
      }
      // Update user to follow model with new count
      // This will not be synced to the server. FE use only.
      this.user.set({ numFollowers: newCount.toString() });
    }
    // Also update the current user model (the user who clicked)
    const currFollowingCount = NumberHelpers.stripCommas(SS.currentUser.get('numFollowing'));
    if (!_.isUndefined(currFollowingCount)) {
      let newFollowingCount;
      if (this.determineNewState() === Button.states.ACTIVE) {
        newFollowingCount = currFollowingCount + 1;
      } else {
        newFollowingCount = currFollowingCount - 1;
      }
      SS.currentUser.set({ numFollowing: newFollowingCount.toString() });
      SS.currentUser.trigger('updateNumFollowing', newFollowingCount.toString());
    }
    Button.prototype.onClick.apply(this, arguments);
  },

  onFollow: function() {
    // Track event
    const params = {};
    if (!_.isUndefined(this.trackingParams)) {
      _.extend(params, this.trackingParams);
    }
    SS.EventTracker.track('Followed User', '', params);
  },

});

export default FollowUserButton;

