/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.

/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
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
// @ts-expect-error Subsequent variable declarations must have the same type.  Variable '_' must be of type 'UnderscoreStatic', but here has type 'any'.
const _ = require('underscore');
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

  // TODO: create TypeScript type for `opts`
  // @ts-expect-error Parameter 'opts' implicitly has an 'any' type.
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
    const enterprise = currentBoard.getEnterprise();

    // `attributes` is the only method of `userInfo` used in this view, but there are many more properties
    // TODO: Create complete type for Auth.me() return value
    // @ts-expect-error Member 'attributes' implicitly has an 'any' type.
    const userInfo: { attributes? } = Auth.me();

    const isBoardEnterpriseOwned = currentBoard.hasEnterprise();

    if (isBoardEnterpriseOwned) {
      const boardEnterpriseId = currentBoard.get('idEnterprise');
      const userEnterprises = userInfo.attributes?.enterpriseLicenses;
      const isUserOwnedBySameEnterpriseAsBoard =
        userEnterprises?.some(
          // @ts-expect-error Parameter 'userEnterprise' implicitly has an 'any' type.
          (userEnterprise) => userEnterprise.idEnterprise === boardEnterpriseId,
        ) || false;

      data.isCopy = true;
      data.hasEnterprise = true;
      data.enterpriseName = enterprise?.get('displayName');

      if (isUserOwnedBySameEnterpriseAsBoard) {
        // allow user to copy cards to other boards in the enterprise
        currentBoard =
          this.model.getBoard().getMembershipFor(Auth.me()) == null
            ? currentBoard
            : null;
        data.organizations = Auth.me().getOpenBoardsInEnterpriseByOrg(
          true,
          enterprise.get('id'),
          currentBoard,
        );
      } else {
        // only allow the user to copy cards to the same board
        data.restrictToCurrentBoard = true;
        data.organizations = [
          {
            displayName:
              currentBoard.getOrganization()?.get('displayName') ||
              l('member boards.boards'),
            boards: [_.extend(currentBoard.toJSON(), { selected: true })],
          },
        ];
      }
    } else {
      currentBoard = this.model
        .getBoard()
        .isEditableByTeamMemberAndIsNotABoardMember()
        ? currentBoard
        : null;
      data.organizations = Auth.me().getOpenBoardsByOrg(true, currentBoard);
    }

    for (const org of data.organizations) {
      for (const board of org.boards) {
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

  keydownEvent(e: KeyboardEvent) {
    if (getKey(e) === Key.Enter) {
      Util.stop(e);
      this.submit(e);
      return;
    }
  }

  submit(e: Event) {
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
      .catch((error: Error) => {
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
