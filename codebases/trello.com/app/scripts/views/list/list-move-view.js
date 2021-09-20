/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const Alerts = require('app/scripts/views/lib/alerts');
const { Analytics } = require('@trello/atlassian-analytics');
const { Auth } = require('app/scripts/db/auth');
const { ModelLoader } = require('app/scripts/db/model-loader');
const Payloads = require('app/scripts/network/payloads').default;
const {
  maybeDisplayLimitsErrorOnCardAdd,
} = require('app/scripts/views/card/card-limits-error');
const LabelLimitsErrorView = require('app/scripts/views/label/label-limits-error-view');
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const _ = require('underscore');
const template = require('app/scripts/views/templates/popover_move_list');
const { l } = require('app/scripts/lib/localize');
const { showFlag } = require('@trello/nachos/experimental-flags');

const tooManyCustomFieldsError = 'BOARD_TOO_MANY_CUSTOM_FIELDS';
const tooManyCustomFieldOptionsError = 'CUSTOM_FIELD_TOO_MANY_OPTIONS';

class ListMoveView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'move list';

    this.prototype.tagName = 'form';

    this.prototype.events = {
      'change .js-select-list-pos': 'renderValues',
      'change .js-select-board': 'updateBoardData',
      'click .js-commit-position': 'commitChange',
      submit: 'commitChange',
    };
  }

  initialize() {
    Analytics.sendScreenEvent({
      name: 'moveListInlineDialog',
      containers: {
        list: {
          id: this.model.id,
        },
        board: {
          id: this.model.getBoard()?.id,
        },
        organization: {
          id: this.model.getBoard()?.getOrganization()?.id,
        },
      },
    });
  }

  render() {
    const view = this;
    const { model } = view;

    const data = {};
    let currentBoard = this.model.getBoard();
    const enterprise = this.model.getBoard().getEnterprise();

    // Don't allow guests on enterprise owned boards to move lists off the current board
    const isGuest = currentBoard.isGuest(Auth.me());

    if (isGuest && currentBoard.get('enterpriseOwned')) {
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
        if (board.id === model.get('idBoard')) {
          board.selected = true;
        }
      }
    }

    this.$el.html(template(data));

    this.updateBoardData();

    return this;
  }

  renderValues() {
    const $el = $(this.el);

    const idBoard = $el.find('.js-select-board option:selected').val();
    const index = parseInt(
      $el.find('.js-select-list-pos option:selected').text(),
      10,
    );

    const board = this.modelCache.get('Board', idBoard);
    const boardName = board.get('name');

    $el.find('.js-board-value').text(boardName);
    $el.find('.js-pos-value').text(String(index));
  }

  updateBoardData() {
    const $el = $(this.el);
    const $selectBoard = $el.find('.js-select-board');
    const idBoardSelected = $selectBoard.find('option:selected').val();

    if (idBoardSelected === this.model.getBoard().id) {
      this._boardData = this.model.getBoard();
      for (const list of Array.from(this._boardData.listList.models)) {
        list.cardCount = this._boardData.listList
          .get(list.id)
          .openCards().length;
      }
      this.updateListList();
    } else {
      const $otherSelects = $el.find('.select-list,.select-position');
      $otherSelects.attr('disabled', 'disabled');
      ModelLoader.loadBoardData(idBoardSelected, Payloads.listsMinimal)
        .then(() => {
          this._boardData = this.modelCache.get('Board', idBoardSelected);
          this.updateListList();
          return $otherSelects.removeAttr('disabled');
        })
        .done();
    }
  }

  updateListList() {
    let count, currentIndex;
    const view = this;
    const { model } = view;

    const $selectList = this.$('.js-select-list-pos');
    $selectList.empty();

    const openLists = this._boardData.listList.models;
    const isCurrentBoard = this._boardData.id === this.model.getBoard().id;

    if (isCurrentBoard) {
      currentIndex = _.indexOf(openLists, this.model);
      count = openLists.length;
    } else {
      currentIndex = -1;
      count = openLists.length + 1;
    }

    for (
      let i = 0, end = count, asc = 0 <= end;
      asc ? i < end : i > end;
      asc ? i++ : i--
    ) {
      const indexString = String(i + 1);
      const desc =
        i === currentIndex
          ? l('current position', { index: indexString })
          : indexString;

      const pos = this._boardData.listList.calcPos(i, model);
      const $option = $('<option>').val(pos).text(desc).appendTo($selectList);
      if (i === currentIndex) {
        $option.attr('selected', 'selected');
      }
    }

    const $commitButton = this.$('.js-commit-position');
    const $limitExceededError = this.$('.js-list-limit-exceeded');
    if (!isCurrentBoard) {
      const tooManyLists =
        this._boardData.isOverLimit('lists', 'totalPerBoard') ||
        this._boardData.isOverLimit('lists', 'openPerBoard');
      $commitButton
        .toggleClass('disabled', tooManyLists)
        .prop('disabled', tooManyLists);
      $limitExceededError.toggleClass('hide', !tooManyLists);
    } else {
      $commitButton.toggleClass('disabled', false).prop('disabled', false);
      $limitExceededError.toggleClass('hide', true);
    }

    return this.renderValues();
  }

  commitChange(e) {
    Util.stop(e);

    const $selectListPos = this.$('.js-select-list-pos');
    const listPosSelected = parseInt(
      $selectListPos.find('option:selected').val(),
      10,
    );
    const idBoardSelected = this.$('.js-select-board option:selected').val();

    this.model.getBoard().composer.save('vis', false);

    const originalBoardId = this.model.getBoard().id;
    const originalPosition = this.model.get('pos');

    if (idBoardSelected === originalBoardId) {
      this.model.update({ pos: listPosSelected });

      Analytics.sendTrackEvent({
        action: 'moved',
        actionSubject: 'list',
        source: 'moveListInlineDialog',
        containers: {
          list: {
            id: this.model.id || '',
          },
          board: {
            id: this.model.getBoard()?.id || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });
    } else if (idBoardSelected != null && listPosSelected != null) {
      if (this.model.cardList.length > 0) {
        let hasChecklists;
        let hasAttachments = (hasChecklists = false);
        this.model.cardList.forEach(function (card) {
          hasAttachments = hasAttachments || card.attachmentList.length > 0;
          return (hasChecklists =
            hasChecklists || card.checklistList.length > 0);
        });

        const options = {
          $elem: $(e.target),
          hasChecklists,
          hasAttachments,
          destinationBoard: this._boardData,
        };
        if (maybeDisplayLimitsErrorOnCardAdd(options)) {
          return;
        }
      }

      const hasLabels = this.model.cardList.filter(
        (c) => c.getLabels().length > 0,
      );
      if (hasLabels && this._boardData.isOverLimit('labels', 'perBoard')) {
        PopOver.pushView(new LabelLimitsErrorView());
        return;
      }

      const next = (response) => {
        const error = response != null ? response.message : undefined;

        if (error) {
          this.model.set(
            { idBoard: originalBoardId, pos: originalPosition },
            next,
          );
        }

        if (error === tooManyCustomFieldsError) {
          Alerts.show('too many custom fields', 'error', 'movelist', 8000);
        } else if (error === tooManyCustomFieldOptionsError) {
          Alerts.show('too many custom options', 'error', 'movelist', 8000);
        } else if (error === 'unauthorized board permission requested') {
          const msg = l('alerts.cannot move list to observer board');
          showFlag({
            id: 'movelist',
            title: msg,
            appearance: 'error',
            isAutoDismiss: true,
            msTimeout: 8000,
          });
        }
      };

      this.model.update(
        { idBoard: idBoardSelected, pos: listPosSelected },
        next,
      );

      Analytics.sendTrackEvent({
        action: 'moved',
        actionSubject: 'list',
        source: 'moveListInlineDialog',
        attributes: {
          boardSourceId: originalBoardId,
        },
        containers: {
          list: {
            id: this.model.id || '',
          },
          board: {
            id: idBoardSelected || '',
          },
          organization: {
            id: this.model.getBoard()?.getOrganization()?.id || '',
          },
        },
      });
    }

    PopOver.hide();
  }
}

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
ListMoveView.initClass();
module.exports = ListMoveView;
