/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const moment = require('moment');

const InviteAcceptanceNotification = require('app/scripts/views/board/invite-acceptance-notification');
const { Auth } = require('app/scripts/db/auth');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');

module.exports.closeInviteAcceptanceNotification = function () {
  return this.unmountInviteAcceptanceNotification();
};

module.exports.buildInviteAcceptanceNotification = function (members) {
  return (
    <InviteAcceptanceNotification
      members={members}
      // eslint-disable-next-line react/jsx-no-bind
      onClose={() => this.closeInviteAcceptanceNotification()}
      boardId={this.model?.id}
      organizationId={this.model?.getOrganization()?.id}
      enterpriseId={this.model?.getEnterprise()?.id}
    />
  );
};

// The newly signed up invitees we want to identify here are members who:
// - were invited by the current user
// - have completed sign up and joined the board
// - haven't already notified the current user that they signed up
module.exports.getNewlySignedUpInvitees = function () {
  const myId = Auth.me().id;
  const lastViewMoment = moment(this.model.get('previousDateLastView'));
  const membersHash = {};
  this.model.memberList.models.forEach((member) => {
    return (membersHash[member.get('id')] = member);
  });

  return this.model
    .get('memberships')
    .reduce((newlyInvitedMembers, membership) => {
      const member = membersHash[membership.idMember];
      if (
        member &&
        moment(Util.idToDate(member.id)).isAfter(lastViewMoment) &&
        member.get('idMemberReferrer') === myId &&
        member.get('memberType') === 'normal'
      ) {
        return newlyInvitedMembers.concat(member);
      }
      return newlyInvitedMembers;
    }, []);
};

module.exports.renderPopovers = function () {
  const visibleMembers = this.model.orderedVisibleMembers();
  const newInvitees = this.getNewlySignedUpInvitees();
  const isInviteDismissed = Auth.me().isDismissed('notify-invite-acceptance');
  const canRenderInviteAcceptanceNotification =
    !isInviteDismissed &&
    newInvitees.length !== 0 &&
    !this.hasSeenInviteAcceptanceNotification;

  if (canRenderInviteAcceptanceNotification) {
    // Show InviteAcceptanceNotification if:
    // - there are new invitees
    // - Invite Acceptance hasn't been dismissed
    // - TRELP-2295: the notification hasn't been seen already after the initialization of this board
    this.renderInviteAcceptanceNotification(
      newInvitees,
      _.map(visibleMembers, (member) => member.id),
    );
    newInvitees.forEach(function (member) {
      return Analytics.sendOperationalEvent({
        action: 'rendered',
        actionSubject: 'inviteAcceptanceNotification',
        source: 'boardScreen',
        attributes: {
          referringMember: Auth.me().id,
          newMember: member.id,
        },
      });
    });
  } else {
    // No InviteAcceptanceNotification.
    // Track these users as NOT having seen the invite notification
    newInvitees.forEach(function (member) {
      return Analytics.sendOperationalEvent({
        action: 'skipped',
        actionSubject: 'inviteAcceptanceNotification',
        source: 'boardScreen',
        attributes: {
          referringMember: Auth.me().id,
          newMember: member.id,
        },
      });
    });
  }
};

module.exports.renderInviteAcceptanceNotification = function (
  newInvitees,
  visibleMemberIds,
) {
  // Find out where the notification should be displayed
  let avatarPosition = '#member-count-notifications';
  if (newInvitees.length === 1) {
    if (Array.from(visibleMemberIds).includes(newInvitees[0].id)) {
      const possibleAvatarPosition = `#${newInvitees[0].id}-avatar`;
      const newInviteePosition = $(possibleAvatarPosition).offset() != null;
      // if the new members are not visible then
      // attach the notification to the counter
      avatarPosition = newInviteePosition
        ? possibleAvatarPosition
        : '#member-count';
    }
  }

  // Tear down any existing notifications
  this.unmountInviteAcceptanceNotification();

  // Set flag that keeps this notification closed until next board initialization
  this.hasSeenInviteAcceptanceNotification = true;

  // Create a new notification
  this.inviteAcceptanceNotificationDiv = document.createElement('div');
  this.$('#board-header-notification').append(
    this.inviteAcceptanceNotificationDiv,
  );
  this.inviteAcceptanceNotificationComponent = ReactDOM.render(
    this.buildInviteAcceptanceNotification(newInvitees),
    this.inviteAcceptanceNotificationDiv,
  );
  const avatarObject = $(avatarPosition);
  $('.invite-acceptance-notification').css(
    'left',
    avatarObject.offset().left - 16,
  );

  return this;
};

module.exports.unmountInviteAcceptanceNotification = function () {
  if (this.inviteAcceptanceNotificationDiv != null) {
    ReactDOM.unmountComponentAtNode(this.inviteAcceptanceNotificationDiv);
    this.inviteAcceptanceNotificationDiv = null;
    this.inviteAcceptanceNotificationComponent = null;
  }
};
