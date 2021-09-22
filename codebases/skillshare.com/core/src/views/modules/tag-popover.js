import PopoverView from 'core/src/views/modules/popover';
import FollowTagButton from 'core/src/views/modules/buttons/follow-tag-button';
import NumberHelpers from 'core/src/helpers/number-helpers';

const TagPopoverView = PopoverView.extend({

  className: 'popover tag-card-popover',
  placement: 'top',
  showOnHover: true,
  addShadow: true,
  endpoint: '/tags/renderPopover',

  initialize: function() {
    _.bindAll(this, 'onClickFollowButton');
    PopoverView.prototype.initialize.apply(this, arguments);
  },

  onPopoverCreated: function() {
    PopoverView.prototype.onPopoverCreated.apply(this, arguments);
    // Init the follow button
    // Use data from this.templateData, which is set in the endpoint response
    // Only try to create if we have data - this might be the case if the response hasn't completed yet
    if (!_.isEmpty(this.templateData) && this.templateData.followTagButtonData) {
      const { tagId, userIsFollowingTag } = this.templateData.followTagButtonData;

      this.followButton = new FollowTagButton({
        container: this.visibleEl.find('.tag-follow-button-wrapper'),
        classes: 'small',
        userIsFollowingTag: userIsFollowingTag,
        tagId: tagId,
        templateData: {
          size: 'small',
        },
      });

      // handle events this way instead of an event map since this is a popover
      this.followButton.$el.click(this.onClickFollowButton);

    }

  },

  onClickFollowButton: function() {
    // update the follower count locally
    const $numFollowers = this.visibleEl.find('.num-followers');
    const followerCount = NumberHelpers.stripCommas($numFollowers.html());
    if (FollowTagButton.states.ACTIVE === this.followButton.model.get('state')) {
      $numFollowers.text(NumberHelpers.formatWithCommas(followerCount + 1));
    } else {
      $numFollowers.text(NumberHelpers.formatWithCommas(followerCount - 1));
    }
  },

});

export default TagPopoverView;

