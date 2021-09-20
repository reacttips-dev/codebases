// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { Analytics } = require('@trello/atlassian-analytics');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/popover_confirmation_public_boards');
const BoardMemberAddMultipleView = require('app/scripts/views/board-menu/board-member-add-multiple-view');

class ConfirmationPublicBoardsView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'change to public';

    this.prototype.className = 'confirmation-popover';

    this.prototype.events = {
      'click .js-submit': 'selectVis',
      'click .js-action-link': 'renderInvitationLink',

      'mouseenter .js-action-link': 'mouseenter',
      'mouseleave .js-action-link': 'mouseleave',
    };
  }

  render() {
    const data = this.model.toJSON();
    data.isTemplate = this.model.isTemplate();

    this.$el.html(template(data));

    return this;
  }

  selectVis(e) {
    Util.stop(e);

    const traceId = Analytics.startTask({
      taskName: 'edit-board/prefs/permissionLevel',
      source: 'makeBoardPublicInlineDialog',
    });

    const change = this.model.getPref('permissionLevel') !== 'public' ? 1 : 0;

    this.model.setPrefWithTracing('permissionLevel', 'public', {
      taskName: 'edit-board/prefs/permissionLevel',
      source: 'makeBoardPublicInlineDialog',
      traceId,
      next: (_err, res) => {
        if (res) {
          Analytics.sendUpdatedBoardFieldEvent({
            field: 'visibility',
            value: 'public',
            source: 'makeBoardPublicInlineDialog',
            containers: {
              board: {
                id: this.model.id,
              },
              organization: {
                id: this.model.getOrganization()?.id,
              },
              enterprise: {
                id: this.model.getEnterprise()?.id,
              },
            },
            attributes: {
              change,
              taskId: traceId,
            },
          });
        }
      },
    });

    this.model.save();

    return PopOver.hide();
  }

  renderInvitationLink(e) {
    Util.stop(e);
    const view = new BoardMemberAddMultipleView({
      model: this.model,
      modelCache: this.modelCache,
    });
    view.loadOrgData();
    $('.js-open-manage-board-members').removeClass('open-manage-boards-offset');

    PopOver.toggle({
      elem: $('.js-open-manage-board-members'),
      view,
    });

    Analytics.sendClickedLinkEvent({
      linkName: 'inviteToBoardLink',
      source: 'changeBoardVisiblityToPublicConfirmationInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: this.model.getOrganization()?.id,
        },
        enterprise: {
          id: this.model.getEnterprise()?.id,
        },
      },
    });
  }

  mouseenter(e) {
    return $('.js-open-manage-board-members').addClass(
      'open-manage-boards-offset',
    );
  }

  mouseleave(e) {
    return this.setTimeout(
      () =>
        $('.js-open-manage-board-members').removeClass(
          'open-manage-boards-offset',
        ),
      0,
    );
  }
}

ConfirmationPublicBoardsView.initClass();
module.exports = ConfirmationPublicBoardsView;
