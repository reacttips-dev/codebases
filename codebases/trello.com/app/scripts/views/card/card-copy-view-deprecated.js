/********************
 * DO NOT UPDATE THIS FILE
 *
 * This is being left as a safety fallback under feature flag `enterprise.allow-enterprise-users-to-copy-enterprise-cards`
 * This file will be deleted when the feature flag is removed according to https://trello.com/c/VGE8H3ka/392-remove-feature-flag-for-copy-cards-date-tbd
 * Please make any new updates to the refactored file: card-copy-view.ts
 */

/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const Alerts = require('app/scripts/views/lib/alerts');
const { Auth } = require('app/scripts/db/auth');
const { getKey, Key } = require('@trello/keybindings');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const {
  maybeDisplayLimitsErrorOnCardAdd,
} = require('app/scripts/views/card/card-limits-error');
const { l } = require('app/scripts/lib/localize');
const LabelLimitsErrorView = require('app/scripts/views/label/label-limits-error-view');
const SelectCardPosition = require('app/scripts/views/card/select-card-position');
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { Analytics } = require('@trello/atlassian-analytics');
const f = require('effing');
const _ = require('underscore');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class CardCopyView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'copy card';

    this.prototype.showCurrentPosition = true;

    this.prototype.events = {
      'change .js-select-position': 'renderValues',
      'change .js-select-list': 'updatePositionList',
      'change .js-select-board': 'updateBoardData',

      'keydown textarea[name="name"]': 'keydownEvent',
      'click .js-submit': 'submit',
      'submit form': 'submit',
    };
  }

  initialize(opts) {
    Analytics.sendScreenEvent({
      name: 'copyCardInlineDialog',
      containers: this.model.getAnalyticsContainers(),
      attributes: {
        cardIsTemplate: this.model.get('isTemplate'),
        cardIsClosed: this.model.get('closed'),
      },
    });
    return (this.onCopy = opts.onCopy != null ? opts.onCopy : function () {});
  }

  render() {
    const data = this.model.toJSON();
    data.numChecklists = this.model.checklistList.length;
    data.numMembers = data.idMembers.length;
    data.numLabels =
      (data.idLabels != null ? data.idLabels.length : undefined) != null
        ? data.idLabels != null
          ? data.idLabels.length
          : undefined
        : 0;
    data.numAttachments = data.badges.attachments;
    data.numComments = data.badges.comments;
    data.numStickers = data.stickers.length;

    data.hasChecklists = data.numChecklists > 0;
    data.hasMembers = data.idMembers.length > 0;
    data.hasLabels = data.numLabels > 0;
    data.hasAttachments = data.badges.attachments > 0;
    data.hasStickers = data.stickers.length > 0;

    // Don't show option to copy comments hidden on templates
    data.hasComments =
      data.badges.comments > 0 && !this.model.getBoard().isTemplate();

    data.hasStuff =
      data.hasChecklists ||
      data.hasMembers ||
      data.hasLabels ||
      data.hasAttachments ||
      data.hasComments ||
      data.hasStickers;

    data.loading = this.loading;

    let currentBoard = this.model.getBoard();
    const enterprise = this.model.getBoard().getEnterprise();

    // Don't allow guests on enterprise owned boards to copy cards off the current board
    const isGuest = currentBoard.isGuest(Auth.me());

    if (isGuest && currentBoard.get('enterpriseOwned')) {
      data.isCopy = true;
      data.hasEnterprise = true;
      data.enterpriseName =
        enterprise != null ? enterprise.get('displayName') : undefined;
      data.restrictToCurrentBoard = true;
      data.organizations = [
        {
          displayName:
            __guard__(currentBoard.getOrganization(), (x) =>
              x.get('displayName'),
            ) || l('member boards.boards'),
          boards: [_.extend(currentBoard.toJSON(), { selected: true })],
        },
      ];
    } else if (enterprise != null) {
      data.isCopy = true;
      data.hasEnterprise = enterprise != null;
      currentBoard =
        this.model.getBoard().getMembershipFor(Auth.me()) == null
          ? currentBoard
          : null;
      data.organizations = Auth.me().getOpenBoardsInEnterpriseByOrg(
        true,
        enterprise.get('id'),
        currentBoard,
      );
      data.enterpriseName = enterprise.get('displayName');
    } else {
      currentBoard = this.model
        .getBoard()
        .isEditableByTeamMemberAndIsNotABoardMember()
        ? currentBoard
        : null;
      data.organizations = Auth.me().getOpenBoardsByOrg(true, currentBoard);
    }

    for (const org of Array.from(data.organizations)) {
      for (const board of Array.from(org.boards)) {
        if (board.id === this.model.get('idBoard')) {
          board.selected = true;
        }
      }
    }

    const partials = { move_card_controls: templates.move_card_controls };

    this.$el.html(
      templates.fill(
        require('app/scripts/views/templates/card_copy'),
        data,
        { editable: this.model.editable() },
        partials,
      ),
    );

    this.updateBoardData();

    return this;
  }

  getData() {
    this.loading = true;

    return Promise.all([
      ModelLoader.loadCardCopyData(this.model.get('idBoard'), this.model.id),
      ModelLoader.loadBoardMinimal(this.model.get('idBoard')),
    ]).finally(() => {
      this.loading = false;
      return this.render();
    });
  }

  keydownEvent(e) {
    if (getKey(e) === Key.Enter) {
      Util.stop(e);
      this.submit(e);
      return;
    }
  }

  submit(e) {
    Util.stop(e);

    const nameInput = this.$('textarea[name="name"]');

    // return if the user hasn't entered a title
    if (nameInput.val().trim() === '') {
      nameInput.focus().select();
      return;
    }

    const idListSelected = this.$('.js-select-list')
      .find('option:selected')
      .val();
    const idBoardSelected = this.$('.js-select-board')
      .find('option:selected')
      .val();
    const boardSelected = this.modelCache.get('Board', idBoardSelected);
    const listSelected =
      boardSelected != null
        ? boardSelected.listList.get(idListSelected)
        : undefined;
    const options = {
      $elem: this.$(e.target),
      hasChecklists: this.model.checklistList.length > 0,
      hasAttachments: this.model.attachmentList.length > 0,
      destinationBoard: boardSelected,
      destinationList: listSelected,
    };
    if (maybeDisplayLimitsErrorOnCardAdd(options)) {
      return;
    }

    const mandatoryFieldsToKeep = ['start', 'due'];
    const optionalFieldsToKeep = this.$('input:checkbox:checked')
      .get()
      .map(f.get('name'));
    const fieldsToKeep = mandatoryFieldsToKeep.concat(optionalFieldsToKeep);

    if (idBoardSelected !== this.model.getBoard().id) {
      const hasLabels =
        this.model.getLabels().length > 0 && _.contains(fieldsToKeep, 'labels');
      if (hasLabels && boardSelected.isOverLimit('labels', 'perBoard')) {
        PopOver.pushView(new LabelLimitsErrorView());
        return;
      }
    }

    // prevent card copy spamming
    this.$('.js-submit').attr('disabled', 'disabled');

    const traceId = Analytics.startTask({
      taskName: 'create-card/copy',
      source: 'copyCardInlineDialog',
    });

    this.model
      .copyTo({
        name: nameInput.val().trim(),
        idList: idListSelected,
        pos: this.$('.js-select-position').find('option:selected').val(),
        keepFromSource: fieldsToKeep,
        traceId,
      })
      .then(() => {
        PopOver.hide();
        this.onCopy();

        Analytics.sendTrackEvent({
          action: 'copied',
          actionSubject: 'card',
          source: 'copyCardInlineDialog',
          containers: {
            card: {
              id: this.model.id,
            },
            board: {
              id: this.model.getBoard().id,
            },
          },
          attributes: {
            isCardTemplate: !!this.model.get('isTemplate'),
            isBoardTemplate: this.model.getBoard().isTemplate(),
            taskId: traceId,
          },
        });

        Analytics.taskSucceeded({
          taskName: 'create-card/copy',
          source: 'copyCardInlineDialog',
          traceId,
        });
      })
      .catch((error) => {
        PopOver.hide();
        Alerts.flash('could not copy card', 'error', 'card-copy');

        Analytics.sendOperationalEvent({
          action: 'failed',
          actionSubject: 'cardCopy',
          source: 'copyCardInlineDialog',
          containers: {
            card: {
              id: this.model.id,
            },
            board: {
              id: this.model.getBoard().id,
            },
          },
          attributes: {
            isCardTemplate: !!this.model.get('isTemplate'),
            isBoardTemplate: this.model.getBoard().isTemplate(),
            taskId: traceId,
          },
        });

        Analytics.taskFailed({
          taskName: 'create-card/copy',
          traceId,
          source: 'copyCardInlineDialog',
          error,
        });
      });
  }
}
CardCopyView.initClass();

_.extend(CardCopyView.prototype, SelectCardPosition);

module.exports = CardCopyView;
