// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');
let CardMemberMenuView;
const MemberMiniProfileView = require('app/scripts/views/member-menu-profile/member-mini-profile-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const templates = require('app/scripts/views/internal/templates');

module.exports = CardMemberMenuView = (function () {
  CardMemberMenuView = class CardMemberMenuView extends MemberMiniProfileView {
    static initClass() {
      this.prototype.events = { 'click .js-remove-member': 'removeMember' };
    }

    initialize() {
      super.initialize(...arguments);
      this.card = this.options.card;
    }

    renderMenu() {
      this.$el.append(
        templates.fillMenu(
          require('app/scripts/views/templates/member_on_card_menu'),
          this.model.toJSON(),
          { editable: this.card.editable() },
        ),
      );
      return this;
    }

    removeMember(e) {
      PopOver.hide();
      const modelId = this.model.id;
      const source = 'cardMemberMenuInlineDialog';
      const traceId = Analytics.startTask({
        taskName: 'edit-card/idMembers',
        source,
      });

      this.card.removeMemberWithTracing(
        modelId,
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
                  card: { id: this.card.id },
                  board: { id: this.card.get('idBoard') },
                  list: { id: this.card.get('idList') },
                },
                attributes: {
                  taskId: traceId,
                },
              });
            }
          },
        ),
      );
    }
  };
  CardMemberMenuView.initClass();
  return CardMemberMenuView;
})();
