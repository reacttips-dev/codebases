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
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const _ = require('underscore');
const { ActionHistory } = require('@trello/action-history');
const Alerts = require('app/scripts/views/lib/alerts');
const { ApiAjax } = require('app/scripts/network/api-ajax');
const { Auth } = require('app/scripts/db/auth');
const Dialog = require('app/scripts/views/lib/dialog');
const { l } = require('app/scripts/lib/localize');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const {
  maybeDisplayLimitsErrorOnCardAdd,
} = require('app/scripts/views/card/card-limits-error');
const LabelLimitsErrorView = require('app/scripts/views/label/label-limits-error-view');
const SelectCardPosition = require('app/scripts/views/card/select-card-position');
const View = require('app/scripts/views/internal/view');
const templates = require('app/scripts/views/internal/templates');
const { track, trackDebounced } = require('@trello/analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { MoveCardPopover } = require('app/src/components/MoveCardPopover');
const { Analytics } = require('@trello/atlassian-analytics');

const MAX_SUGGESTIONS = 5;

const tooManyCustomFieldsError = 'BOARD_TOO_MANY_CUSTOM_FIELDS';
const tooManyCustomFieldOptionsError = 'CUSTOM_FIELD_TOO_MANY_OPTIONS';

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class CardMoveView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'move card';

    this.prototype.events = {
      'change .js-select-position': 'renderValues',
      'change .js-select-list': 'updatePositionList',
      'change .js-select-board': 'updateBoardData',
      'click .js-submit': 'commitChange',
      'click .js-suggested-move': 'suggestedMove',
    };
  }

  initialize({ onCommit }) {
    this.onCommit = onCommit != null ? onCommit : function () {};
    Analytics.sendScreenEvent({
      name: 'moveCardInlineDialog',
      containers: this.model.getAnalyticsContainers(),
      attributes: {
        cardIsTemplate: this.model.get('isTemplate'),
        cardIsClosed: this.model.get('closed'),
      },
    });
    return this.listenTo(Auth.me().boardList, 'add remove reset', this.render);
  }

  render() {
    const data = {};
    let currentBoard = this.model.getBoard();
    const enterprise = this.model.getBoard().getEnterprise();

    // Don't allow guests on enterprise owned boards to move cards off the current board
    const isGuest = currentBoard.isGuest(Auth.me());

    if (isGuest && currentBoard.get('enterpriseOwned')) {
      data.isMove = true;
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
      data.isMove = true;
      data.hasEnterprise = true;
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
          currentBoard = board;
        }
      }
    }

    data.suggestions = this.getSuggestedMoves();

    let partials = { move_card_controls: templates.move_card_controls };

    if (featureFlagClient.get('fep.nachos_select', false)) {
      renderComponent(
        <MoveCardPopover
          organizations={data.organizations}
          defaultBoardId={currentBoard.id}
          defaultBoardName={currentBoard.name}
          defaultListId={this.model.getList().id}
          defaultListName={this.model.getList().get('name')}
          cardList={this.model.getList().cardList}
          currentIndex={this.model.getList().openCards().indexOf(this.model)}
          // eslint-disable-next-line react/jsx-no-bind
          onSubmit={this.requestChange.bind(this)}
          hasEnterprise={data.hasEnterprise}
          enterpriseName={data.enterpriseName}
          restrictToCurrentBoard={data.restrictToCurrentBoard}
          isMove={data.isMove}
          suggestions={this.getSuggestedMoves()}
        />,
        this.$el.get(0),
      );
    } else {
      partials = { move_card_controls: templates.move_card_controls };

      this.$el.html(
        templates.fill(
          require('app/scripts/views/templates/popover_move_card'),
          data,
          {},
          partials,
        ),
      );
    }

    this.updateBoardData();

    if (data.suggestions.length > 0) {
      trackDebounced.hour(
        'Suggestions',
        'Card Move Menu',
        'Displayed',
        data.suggestions.length,
      );
    }

    return this;
  }

  getSuggestedMoves() {
    const history = ActionHistory.get();

    const board = this.model.getBoard();
    const list = this.model.getList();
    const idList = this.model.get('idList');
    const idBoard = this.model.get('idBoard');

    const suggested = new Set();

    return history
      .filter(
        ({ action, context }) =>
          action.type === 'move' &&
          // Only move to places we've moved to from this list
          context.idList === idList &&
          // For now, restrict this to moves to other lists on the same board
          action.idBoard === idBoard,
      )
      .sort(function (a, b) {
        // For two moves to the same target list,
        // prefer moves with an unambiguous target position, aka 'top' or 'bottom'
        if (a.action.idList === b.action.idList) {
          const aHasPosition = typeof a.action.position === 'string';
          const bHasPosition = typeof b.action.position === 'string';
          if (aHasPosition && !bHasPosition) {
            return -1;
          } else if (bHasPosition && !aHasPosition) {
            return 1;
          } else {
            return 0;
          }
        } else {
          return 0;
        }
      })
      .filter(function ({ action }) {
        if (suggested.has(action.idList)) {
          return false;
        } else {
          suggested.add(action.idList);
          return true;
        }
      })
      .filter(({ action }) => this.model.isValidSuggestion(action))
      .slice(0, MAX_SUGGESTIONS)
      .map(function ({ action }) {
        const targetList = board.listList.get(action.idList);
        const data = targetList.toJSON();
        data.direction =
          targetList.get('pos') > list.get('pos') ? 'right' : 'left';
        data.position = action.position;
        return data;
      });
  }

  suggestedMove(e) {
    const $target = this.$(e.currentTarget);

    const idList = $target.attr('data-id');
    const listSelected = this.model.getBoard().listList.get(idList);
    const indexSelected = (() => {
      switch ($target.attr('data-position')) {
        case 'top':
          return 0;
        case '1':
          return 1;
        default:
          return listSelected.cardList.length;
      }
    })();

    const options = {
      $elem: $target,
      destinationList: listSelected,
    };

    if (maybeDisplayLimitsErrorOnCardAdd(options)) {
      return;
    }

    this.model.moveToList(listSelected, indexSelected);
    track('Card', 'Suggested', 'Move on Same Board');

    this.onCommit();

    PopOver.hide();
  }

  commitChange(e) {
    const $selectBoard = this.$('.js-select-board');
    const $selectList = this.$('.js-select-list');
    const $selectPos = this.$('.js-select-position');

    const idBoardSelected = $selectBoard.find('option:selected').val();
    const idListSelected = $selectList.find('option:selected').val();
    const posSelected = $selectPos.find('option:selected').val();
    const indexSelected = parseInt(
      $selectPos.find('option:selected').prop('index'),
      10,
    );

    return this.requestChange(
      e,
      idBoardSelected,
      idListSelected,
      posSelected,
      indexSelected,
    );
  }

  requestChange(
    e,
    idBoardSelected,
    idListSelected,
    posSelected,
    indexSelected,
  ) {
    let listSelected, options;
    if (idBoardSelected === this.model.getBoard().id) {
      listSelected = this.model.getBoard().listList.get(idListSelected);
      options = {
        $elem: this.$(e.target),
        destinationList: listSelected,
      };
      if (maybeDisplayLimitsErrorOnCardAdd(options)) {
        return;
      }

      this.model.moveToList(listSelected, indexSelected);
      track('Card', 'Move Menu', 'Same Board');
    } else if (
      idBoardSelected != null &&
      idListSelected != null &&
      posSelected != null
    ) {
      const boardSelected = this.modelCache.get('Board', idBoardSelected);
      listSelected =
        boardSelected != null
          ? boardSelected.listList.get(idListSelected)
          : undefined;
      options = {
        $elem: this.$(e.target),
        hasChecklists: this.model.checklistList.length > 0,
        hasAttachments: this.model.attachmentList.length > 0,
        destinationBoard: boardSelected,
        destinationList: listSelected,
      };
      if (maybeDisplayLimitsErrorOnCardAdd(options)) {
        return;
      }
      const hasLabels = this.model.getLabels().length > 0;
      if (hasLabels && boardSelected.isOverLimit('labels', 'perBoard')) {
        PopOver.pushView(new LabelLimitsErrorView());
        return;
      }

      track('Card', 'Move Menu', 'Changed Board');

      const cardsInSelectedList =
        listSelected != null ? listSelected.openCards().length : undefined;
      this.model.recordAction({
        type: 'move',
        idBoard: idBoardSelected,
        idList: idListSelected,
        position: (() => {
          switch (posSelected) {
            case 'top':
              if (cardsInSelectedList > 0) {
                return 'top';
              } else {
                return indexSelected;
              }
            case 'bottom':
              if (cardsInSelectedList > 1) {
                return 'bottom';
              } else {
                return indexSelected;
              }
            default:
              return indexSelected;
          }
        })(),
        fromPosition: this.model.getList().openCards().indexOf(this.model),
      });

      this.model.getList().cardList.remove(this.model);
      // If we're showing a dialog (card detail) then hide it
      Dialog.hide();
      ApiAjax({
        url: `/1/cards/${this.model.id}`,
        type: 'put',
        data: {
          idList: idListSelected,
          idBoard: idBoardSelected,
          pos: posSelected,
        },
        success: (data) => {
          this.model.board = null;
          this.model.set('idBoard', data.idBoard);
          this.model.set('idList', data.idList);
          return this.model.set('pos', data.pos);
        },
        error: (xhr) => {
          this.model.getList().cardList.add(this.model);
          const error =
            xhr.responseJSON != null ? xhr.responseJSON.error : undefined;
          if (error === tooManyCustomFieldsError) {
            return Alerts.show(
              'too many custom fields card',
              'error',
              'moveerror',
              8000,
            );
          } else if (error === tooManyCustomFieldOptionsError) {
            return Alerts.show(
              'too many custom options card',
              'error',
              'moveerror',
              8000,
            );
          } else {
            return Alerts.show(
              'could not move card',
              'error',
              'moveerror',
              5000,
            );
          }
        },
      });
    }

    this.onCommit();

    PopOver.hide();
  }
}
CardMoveView.initClass();

_.extend(CardMoveView.prototype, SelectCardPosition);

module.exports = CardMoveView;
