// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CardMemberMenuView = require('app/scripts/views/member-menu-profile/card-member-menu-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const template = require('app/scripts/views/templates/member_on_card');
const { Analytics } = require('@trello/atlassian-analytics');

const CardViewHelpers = {
  openMemberOnCardMenu(e) {
    Util.stop(e);

    const elem = this.$(e.target).closest('.member');
    const idMem = elem.attr('data-idmem');
    const member = this.modelCache.get('Member', idMem);
    const card = this.model;
    const board = this.model.getBoard();

    PopOver.toggle({
      elem,
      view: CardMemberMenuView,
      options: { model: member, modelCache: this.modelCache, card, board },
    });
  },

  getMemberOnCardHtml(member) {
    const data = member.toJSON();

    const board = this.model.getBoard();
    data.isVirtual =
      board?.getOrganization()?.isVirtual(member) || board?.isVirtual(member);
    data.isDeactivated = board?.isDeactivated(member);

    return template(data);
  },

  recordAtMentionClick(e) {
    Util.stop(e);
    const board = this.model.getBoard();
    // Get member from DOM
    const elem = this.$(e.target).closest('.atMention');
    const idMem = elem?.text()?.substring(1);
    const member = this.modelCache.findOne('Member', 'username', idMem);

    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'mention',
      actionSubjectId: 'memberMention',
      source: 'cardDetailScreen',
      containers: {
        workspace: {
          id: board?.getOrganization()?.id,
        },
        board: {
          id: board?.id,
        },
        card: {
          id: this.model.id,
        },
      },
      attributes: {
        mentionedMemberId: member?.id,
      },
    });
  },
};

module.exports = CardViewHelpers;
