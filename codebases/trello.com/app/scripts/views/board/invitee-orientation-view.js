/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const MemberOnBoardView = require('app/scripts/views/member-menu-profile/member-on-board-view');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/invitee-orientation');
const { idToDate } = require('app/common/lib/util/date');
const { truncate } = require('@trello/strings');
const _ = require('underscore');

const FACEPILE_MAX_VISIBLE = 3;

class InviteeOrientationView extends View {
  static initClass() {
    this.prototype.className = 'invitee-orientation-wrapper';

    this.prototype.events = { 'click .js-close-orientation': 'onClose' };
  }

  initialize() {
    // This view can only be rendered once, as re-rendering would run the
    // animations again. It's safe to only render once because the information
    // here is static - we do not depend on api requests or websocket messages.
    return (this.hasRendered = false);
  }

  getInviteToken() {
    return Util.inviteTokenFor(this.model.id);
  }

  getMemberForAvatar() {
    const inviteToken = this.getInviteToken();
    const idInviter = inviteToken.split('-')[1];
    let avatarMember = this.modelCache.get('Member', idInviter);

    if (avatarMember == null) {
      avatarMember = this.model.adminList.models[0];
    }

    return avatarMember;
  }

  renderableMembers() {
    const renderableMembers = this.model
      .orderedVisibleMembers()
      .slice(0, FACEPILE_MAX_VISIBLE);

    if (Auth.isLoggedIn()) {
      // In all other facepiles, the currently-logged-in member is always first,
      // but here they don't want to be first, they want to see everyone else
      // that's on the board - that's the point of this feature. Put them last.
      const me = renderableMembers.shift();
      renderableMembers.push(me);
    }

    return renderableMembers;
  }

  shouldSeePopover() {
    // you should see the popover if:
    // 1) you are logged in
    return (
      Auth.isLoggedIn() &&
      // 2) you haven't dismissed the popover before
      !Auth.me().isDismissed('invitee-orientation') &&
      // 3) you have an invite token for this board
      this.getInviteToken() &&
      // 4) your account is newer than the threshold
      idToDate(Auth.myId()) >= new Date('2019-06-15')
    );
  }

  renderFacepile() {
    const subviews = Array.from(this.renderableMembers()).map((member) =>
      this.subview(MemberOnBoardView, member, {
        board: this.model,
        notClickable: true,
        small: true,
        hideBadges: true,
      }),
    );

    return this.ensureSubviews(
      subviews.reverse(),
      this.$('.js-invitee-orientation-facepile'),
    );
  }

  _getDataForMessage() {
    const allVisibleMembers = this.model.orderedVisibleMembers();
    const renderableMembers = this.renderableMembers();

    return {
      visibleMembersCount: allVisibleMembers.length,
      maxVisible: FACEPILE_MAX_VISIBLE,
      firstMemberFullName: truncate(renderableMembers[0].get('fullName'), 30),
      boardName: this.model.get('name'),
    };
  }

  _getDataForAvatar() {
    return {
      inviterAvatarUrl: this.getMemberForAvatar().get('avatarUrl'),
      inviterFullName: this.getMemberForAvatar().getMemberViewTitle(),
      inviterUsername: this.getMemberForAvatar().get('username'),
      inviterInitials: this.getMemberForAvatar().get('initials'),
    };
  }

  render() {
    if (!this.shouldSeePopover() || this.hasRendered) {
      return this;
    }

    let data = {};
    data = _.extend(data, this._getDataForAvatar());
    data = _.extend(data, this._getDataForMessage());

    this.$el.html(template(data));
    this.renderFacepile();

    const $messageContainer = this.$el.find(
      '.invitee-orientation-message-container',
    );
    const $avatarContainer = this.$el.find(
      '.invitee-orientation-avatar-container',
    );
    setTimeout(() => $avatarContainer.addClass('active'), 1200);
    setTimeout(() => $messageContainer.addClass('active'), 1350);

    this.hasRendered = true;

    return this;
  }

  onClose() {
    Auth.me().dismiss('invitee-orientation');
    return this.remove();
  }
}

InviteeOrientationView.initClass();
module.exports = InviteeOrientationView;
