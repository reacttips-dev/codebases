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
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const $ = require('jquery');
const { ModelLoader } = require('app/scripts/db/model-loader');
const Payloads = require('app/scripts/network/payloads').default;
const _ = require('underscore');
const { l } = require('app/scripts/lib/localize');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

const SelectCardPosition = {
  renderValues() {
    const idBoard = this.$('.js-select-board option:selected').val();
    const idList = this.$('.js-select-list option:selected').val();
    let pos =
      parseInt(
        this.$('.js-select-position option:selected').prop('index'),
        10,
      ) + 1;

    const board = this.modelCache.get('Board', idBoard);
    const boardName = board.get('name');
    const list = _.find(board.listList.models, ({ id }) => id === idList);

    this.$('.js-board-value').text(boardName);

    // It's possible that the board has no open lists, in which case we need to disable
    // some of the controls
    if (list != null) {
      const listName = list.get('name');
      pos = pos.toString();

      this.$('.js-list-value').text(listName);
      this.$('.js-pos-value').text(pos);

      this.$(
        '.js-select-list,.js-select-position,.js-commit-position,.js-submit',
      ).removeAttr('disabled');
    } else {
      this.$('.js-list-value')
        .empty()
        .append($('<i></i>').text(l('no lists')));
      this.$('.js-pos-value')
        .empty()
        .append($('<i></i>').text(l('n/a')));

      this.$(
        '.js-select-list,.js-select-position,.js-commit-position,.js-submit',
      ).attr('disabled', 'disabled');
    }
  },

  updateBoardData() {
    const $selectBoard = this.$('.js-select-board');
    const idBoardSelected = $selectBoard.find('option:selected').val();

    if (idBoardSelected === this.model.getBoard().id) {
      this._boardData = this.model.getBoard();
      for (const list of Array.from(this._boardData.listList.models)) {
        list.cardCount = this._boardData.listList
          .get(list.id)
          .openCards().length;
      }
      this.updateListList();
    } else if (idBoardSelected != null) {
      this.$('.js-submit').attr('disabled', 'disabled');
      ModelLoader.loadBoardData(idBoardSelected, Payloads.cardsAndListsMinimal)
        .then(() => {
          this._boardData = this.modelCache.get('Board', idBoardSelected);
          // updateListList also updates position and rerenders the view
          return this.updateListList();
        })
        .done();
    }
  },

  updateListList() {
    let idListSelected;
    const $selectBoard = this.$('.js-select-board');
    const $selectList = this.$('.js-select-list').empty();

    const idBoardSelected = $selectBoard.find('option:selected').val();

    const idListCurrent = this.model.getList().id;
    if (idBoardSelected === this.model.getBoard().id) {
      idListSelected = idListCurrent;
    } else {
      idListSelected = __guard__(this._boardData.listList.at(0), (x) => x.id);
    }

    for (const list of Array.from(this._boardData.listList.models)) {
      const $option = $('<option>').val(list.id).appendTo($selectList);

      list.id === idListCurrent
        ? // l is going to return HTML (e.g. it's going to escape things)
          $option.format('current list', { listName: list.get('name') })
        : $option.text(list.get('name'));

      if (list.id === idListSelected) {
        $option.attr('selected', 'selected');
      }
    }

    return this.updatePositionList();
  },

  updatePositionList() {
    let currentIndex, left, selectedIndex;
    const $selectList = this.$('.js-select-list');
    const $selectPos = this.$('.js-select-position').empty();
    const idListSelected = $selectList.find('option:selected').val();

    if (idListSelected == null) {
      this.renderValues();
      return;
    }

    const listSelected =
      (left = this._boardData.listList.get(idListSelected)) != null
        ? left
        : this._boardData.listList.at(0);

    const sameList =
      (listSelected != null ? listSelected.id : undefined) ===
      this.model.getList().id;
    let maxIndex = this._boardData.listList.get(idListSelected).cardList.length;

    if (sameList) {
      currentIndex = this.model.getList().openCards().indexOf(this.model);
      selectedIndex = currentIndex;
      if (!this.showCurrentPosition) {
        // if we are copying the card, we should be able to move to any location still
        maxIndex -= 1;
      }
    } else {
      currentIndex = -1;
      selectedIndex = maxIndex;
    }

    for (
      let i = 0, end = maxIndex, asc = 0 <= end;
      asc ? i <= end : i >= end;
      asc ? i++ : i--
    ) {
      const indexString = String(i + 1);

      const desc =
        i === currentIndex
          ? l('current position', { index: indexString })
          : indexString;

      const pos =
        i === 0 ? 'top' : i === maxIndex ? 'bottom' : listSelected.calcPos(i);

      const $option = $('<option>').val(pos).text(desc).appendTo($selectPos);

      if (i === selectedIndex) {
        $option.attr('selected', 'selected');
      }
    }

    this.$('.js-pos-value').text(String(selectedIndex));

    this.renderValues();
  },
};

module.exports = SelectCardPosition;
