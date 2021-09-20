/* eslint-disable
    eqeqeq,
    */
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const editInProgressTemplate = require('app/scripts/views/templates/edit_in_progress');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const CardMemberSelectView = require('app/scripts/views/card/card-member-select-view');
const { Util } = require('app/scripts/lib/util');
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
const cardDetailAddButtonTemplate = require('app/scripts/views/templates/card_detail_add_button');

module.exports.renderEditing = function () {
  const members = this.model.memberEditingList.models;

  const data = {
    members: members
      .filter((mem) => !Auth.isMe(mem) && mem.get('editing') != null)
      .map((mem) => ({
        ...mem.toJSON(),
        icon: mem.get('editing').action === 'commenting' ? 'comment' : 'edit',
      })),
  };

  const commentsData = {
    members: data.members.filter((mem) => mem.icon === 'comment'),
  };

  const descriptionData = {
    members: data.members.filter((mem) => mem.icon === 'edit'),
  };

  this.$('.js-editing-members-comments')
    .empty()
    .append(editInProgressTemplate(commentsData))
    .toggleClass('hide', commentsData.members.length === 0);

  this.$('.js-editing-members-description')
    .empty()
    .append(editInProgressTemplate(descriptionData))
    .toggleClass('hide', descriptionData.members.length === 0);

  return this;
};

module.exports.openEditMembersPopOver = function (elem) {
  PopOver.toggle({
    elem,
    view: CardMemberSelectView,
    options: { model: this.model, modelCache: this.modelCache },
  });
};

module.exports.editMembersMain = function (e) {
  Util.stop(e);
  this.openEditMembersPopOver(this.$('.js-details-edit-members'));
  Analytics.sendClickedButtonEvent({
    buttonName: 'membersButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      type: 'badge',
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });
};

module.exports.changeMembersSidebar = function (e) {
  Util.stop(e);

  Analytics.sendClickedButtonEvent({
    buttonName: 'membersButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      type: 'sidebar',
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });

  this.openEditMembersPopOver(this.$('.js-change-card-members'));
};

module.exports.join = function (e) {
  Util.stop(e);
  const source = 'cardDetailScreen';
  const traceId = Analytics.startTask({
    taskName: 'edit-card/idMembers',
    source,
  });

  this.model.addMemberWithTracing(
    Auth.myId(),
    traceId,
    tracingCallback(
      {
        taskName: 'edit-card/idMembers',
        traceId,
        source,
      },
      (_err, res) => {
        if (res) {
          Analytics.sendUpdatedCardFieldEvent({
            field: 'idMembers',
            source,
            containers: {
              card: { id: this.model.id },
              board: { id: this.model.get('idBoard') },
              list: { id: this.model.get('idList') },
            },
            attributes: {
              taskId: traceId,
            },
          });
        }
      },
    ),
  );
  return Analytics.sendClickedButtonEvent({
    buttonName: 'joinCardButton',
    source: 'cardDetailScreen',
    containers: this.model.getAnalyticsContainers(),
    attributes: {
      cardIsTemplate: this.model.get('isTemplate'),
      cardIsClosed: this.model.get('closed'),
    },
  });
};

module.exports.renderMembers = function (e) {
  const $memberList = this.$('.js-card-detail-members-list').empty();
  const members = this.model.memberList.filterDeactivated({
    model: this.model.getBoard(),
  }).models;
  const memberHtml = Array.from(members)
    .map((member) => this.getMemberOnCardHtml(member))
    .join('');
  $memberList.html(memberHtml);

  if (this.model.editable() && !this.isOnBoardTemplate()) {
    $memberList.append(
      cardDetailAddButtonTemplate({
        klass: 'js-details-edit-members mod-round',
      }),
    );
  }

  this.$('.js-card-detail-members').toggleClass('hide', members.length === 0);

  this.renderSuggestedActions();

  return this;
};
