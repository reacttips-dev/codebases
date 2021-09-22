import Utils from 'core/src/base/utils';
import UserModel from 'core/src/models/user';
import SSView from 'core/src/views/base/ss-view';
import FollowUserButtonView from 'core/src/views/modules/buttons/follow-user-button';
import RemoveGroupMemberPopup from 'core/src/views/popups/remove-group-member-popup';
import ClassesPopoverView from 'core/src/views/modules/classes-popover';
import UserListItemViewTemplate from 'text!core/src/templates/users/_list-row.mustache';
import ActionButtonTemplate from 'text!core/src/templates/custom-lists/action-button.mustache';
import GroupManageMembersMenuTemplate from 'text!core/src/templates/groups/group-manage-members-menu.mustache';

const UserListItemView = SSView.extend({

  tagName: 'div',

  className: function() {
    return this.model.get('isGroup') ? 'user-list-row group-member-row' : 'user-list-row';
  },

  template: UserListItemViewTemplate,

  templatePartials: {
    'custom-lists/action-button': ActionButtonTemplate,
    'groups/group-manage-members-menu': GroupManageMembersMenuTemplate,
  },

  events: {
    'click .js-remove-group-member': 'onClickRemoveMember',
    'click .js-follow-unfollow-user': 'onFollowUnfollow',
  },

  initialize: function() {
    this.listenTo(this.model, 'change:followingCircle', this.onFollowingCircleChange);
    this.followingCircle = this.model.get('followingCircle');

    SSView.prototype.initialize.apply(this, arguments);
  },

  templateData: function() {
    return _.extend(this.model.attributes, {
      hideAdminMenu: parseInt(this.model.get('uid'), 10) === parseInt(SS.currentUser.id, 10),
    });
  },

  onClickRemoveMember: function() {
    this.closeActionMenu();

    new RemoveGroupMemberPopup({
      model: this.model,
    });
  },

  followUser: function() {
    const url = '/users/follow';
    const data = {
      childUid: this.model.get('uid'),
    };

    Utils.ajaxRequest(url, {
      type: 'POST',
      dataType: 'json',
      data,
      success: () => {
        this.model.set({
          followingCircle: this.model.get('uid'),
        });
      },
    });
  },

  unFollowUser: function() {
    const url = `/users/follow/${this.model.get('uid')}`;

    Utils.ajaxRequest(url, {
      type: 'DELETE',
      dataType: 'json',
      success: () => {
        this.model.set({
          followingCircle: false,
        });
      },
    });
  },

  onFollowUnfollow: function() {
    this.closeActionMenu();
    const isFollowingUser = this.model.get('followingCircle');

    if (isFollowingUser) {
      this.unFollowUser();
    } else {
      this.followUser();
    }
  },

  closeActionMenu: function() {
    if (this.actionMenu) {
      this.actionMenu.close();
    }
  },

  onFollowingCircleChange: function() {
    this.render();
  },

  afterRender: function() {
    SSView.prototype.afterRender.apply(this, arguments);

    const userUid = parseInt(this.model.get('uid'), 10);
    const currentUserId = parseInt(SS.currentUser.id, 10);
    if (userUid !== currentUserId) {
      if (this.$('.follow-button-wrapper').length) {
        const followingId = this.model.get('followingCircle') ? this.model.get('followingCircle') : false;
        new FollowUserButtonView({
          container: this.$('.follow-button-wrapper'),
          classes: 'btn small',
          modelData: {
            user: new UserModel({ uid: userUid }),
            followingId: followingId,
            trackingParams: { via: 'user-list-row' },
          },
        });
      }

      this.actionMenu = new ClassesPopoverView({
        anchor: this.$('.list-item-action-btn'),
        el: this.$('.list-item-action-menu'),
        parentView: this,
      });
    }
  },
});

export default UserListItemView;

