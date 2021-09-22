import PopoverView from 'core/src/views/modules/popover';
import Button from 'core/src/views/modules/button';
import FollowUserButton from 'core/src/views/modules/buttons/follow-user-button';
import User from 'core/src/models/user';
import NumberHelpers from 'core/src/helpers/number-helpers';

const UserPopoverView = PopoverView.extend({

  className: 'popover user-card-popover',
  placement: 'top',
  showOnHover: true,
  addShadow: true,
  endpoint: '/users/renderPopover',

  initialize: function() {
    _.bindAll(this, 'onChangeFollowState');
    PopoverView.prototype.initialize.apply(this, arguments);
  },

  onPopoverCreated: function() {
    PopoverView.prototype.onPopoverCreated.apply(this, arguments);
    // Init the follow button
    // Use data from this.templateData, which is set in the endpoint response
    // Only try to create if we have data - this might be the case if the response hasn't completed yet
    if (!_.isEmpty(this.templateData)) {
      const data = _.omit(this.templateData, 'id');
      _.extend(data, { uid: this.templateData.id });
      // This is the user we're taking action on
      this.user = new User(data);
      // Only render a follow button if it's not the current user.
      // Temporarily don't render the button if the user is not logged in.
      // The full fix is to require user login on Follow click if not logged in.
      if (parseInt(this.user.get('uid'), 10) !== SS.currentUser.get('id')) {
        const followBtn = new FollowUserButton({
          container: this.visibleEl.find('.user-follow-button-wrapper'),
          classes: 'small',
          modelData: {
            user: this.user,
            followingId: this.templateData.userIsFollowing ? this.templateData.id : false,
            trackingParams: { source: 'User Popover' },
          },
        });
        followBtn.model.on('change:state', this.onChangeFollowState);
      }
    }
  },

  onChangeFollowState: function(e) {
    if (e.get('state') !== Button.states.DEACTIVATE) {
      const numFollowers = NumberHelpers.stripCommas(this.user.get('numFollowers'));
      this.visibleEl.find('.num-followers strong').html(numFollowers);
      // Notify any listeners that the user followed/unfollowed
      // This can be used to update other views of an updated user following count
      SS.events.trigger('followedUser');
    }
  },

});

export default UserPopoverView;

