// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

const { Auth } = require('app/scripts/db/auth');
const MemberBoardProfileView = require('app/scripts/views/member/member-board-profile-view');
const Dialog = require('app/scripts/views/lib/dialog');
const { Controller } = require('app/scripts/controller');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const MemberOnBoardView = require('app/scripts/views/member-menu-profile/member-on-board-view');
let DragSort = require('app/scripts/views/lib/drag-sort');
const { Util } = require('app/scripts/lib/util');
DragSort = require('app/scripts/views/lib/drag-sort');
const BoardHeaderAllMembersView = require('app/scripts/views/board/board-header-all-members-view');
const {
  maybeDisplayMemberLimitsError,
} = require('app/scripts/views/board-menu/member-limits-error');
const BoardMemberAddMultipleView = require('app/scripts/views/board-menu/board-member-add-multiple-view');

const MAX_FACEPILE_SIZE = 5;

module.exports.onMemberAdd = function () {
  return this.renderBoardHeaderFacepileDebounced();
};

module.exports.renderBoardHeaderFacepile = function () {
  const $target = this.$('.js-fill-facepile');
  let visibleMembers = this.model.orderedVisibleMembers();
  const numMembers = visibleMembers.length;
  visibleMembers = visibleMembers.slice(0, MAX_FACEPILE_SIZE);
  const overflowMemberCount = numMembers - MAX_FACEPILE_SIZE;

  if (overflowMemberCount > 0) {
    this.$('.js-fill-board-member-count').text(`+${overflowMemberCount}`);
  } else {
    this.$('.js-fill-board-member-count').text('');
  }

  let z = visibleMembers.length;
  const subviews = Array.from(visibleMembers).map((member) =>
    this.subview(MemberOnBoardView, member, { board: this.model, zIndex: z-- }),
  );

  if ($target.length > 0) {
    this.ensureSubviews(subviews, $target);
  }

  this.defer(() => {
    // Disallow adding members to cards from facepile when board is in template mode
    if (!this.model.isTemplate()) {
      DragSort.refreshDraggableSidebarMembers();
    }

    return this.renderPopovers();
  });

  return this;
};

module.exports.openAllMembers = function (e) {
  // activated only when there's member overflow from facepile
  Util.stop(e);

  Analytics.sendClickedButtonEvent({
    buttonName: 'allBoardMembersButton',
    source: 'boardScreen',
  });

  const newInvitees = this.getNewlySignedUpInvitees();

  return PopOver.toggle({
    elem: this.$('.js-open-show-all-board-members'),
    view: BoardHeaderAllMembersView,
    options: {
      model: this.model,
      modelCache: this.modelCache,
      newInvitees,
    },
  });
};

module.exports.openAddMembers = function (e) {
  if (e) {
    Util.stop(e);
  }
  const inviteButton = this.$('.js-open-manage-board-members');

  if (maybeDisplayMemberLimitsError(inviteButton, this.model)) {
    return;
  }
  Analytics.sendClickedButtonEvent({
    buttonName: 'inviteToBoardButton',
    source: 'boardScreen',
  });

  const view = new BoardMemberAddMultipleView({
    model: this.model,
    modelCache: this.modelCache,
  });
  view.loadOrgData();

  PopOver.toggle({
    elem: inviteButton,
    view,
  });
};

module.exports.joinBoard = function (e) {
  Util.stop(e);

  Analytics.sendClickedButtonEvent({
    buttonName: 'joinBoardButton',
    source: 'boardScreen',
  });

  if (maybeDisplayMemberLimitsError($(e.target), this.model, Auth.me())) {
    return;
  }

  const traceId = Analytics.startTask({
    taskName: 'edit-board/members/join',
    source: 'boardScreen',
  });

  this.$('.js-join-board').remove();

  this.model.joinBoard(
    traceId,
    tracingCallback(
      {
        taskName: 'edit-board/members/join',
        source: 'boardScreen',
        traceId,
      },
      (error, response) => {
        if (response) {
          Analytics.sendTrackEvent({
            action: 'joined',
            actionSubject: 'board',
            source: 'boardScreen',
            containers: {
              board: {
                id: this.model.id,
              },
              organization: {
                id: this.model.getOrganization()?.id,
              },
            },
            attributes: {
              taskId: traceId,
            },
          });
        }
      },
    ),
  );
};

module.exports.showMemberProfile = function (member) {
  Controller.saveMemberBoardProfileLocation(member, this.model.id);

  Dialog.show({
    view: new MemberBoardProfileView({
      model: member,
      board: this.model,
      modelCache: this.modelCache,
    }),
    maxWidth: 500,
    hide: () => Controller.setBoardLocation(this.model.id),
  });
};
