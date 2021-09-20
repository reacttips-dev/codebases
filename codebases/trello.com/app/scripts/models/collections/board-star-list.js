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
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { BoardStar } = require('app/scripts/models/BoardStar');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Util } = require('app/scripts/lib/util');
const _ = require('underscore');
const Promise = require('bluebird');

let getVisibleStarredBoards = undefined;

class BoardStarList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = BoardStar;

    getVisibleStarredBoards = function (boardStar) {
      const board = boardStar.getBoard();
      return board && board.isOpen();
    };
  }
  url() {
    return `/1/member/${this.member.id}/boardStars`;
  }

  initialize(list, { member }) {
    this.member = member;
    return this.listenTo(this, 'change:pos', this.sort);
  }

  comparator(boardStar) {
    return boardStar.get('pos') || 0;
  }

  getBoardStar(idBoard) {
    return _.find(this.models, (model) => model.get('idBoard') === idBoard);
  }

  starBoard(idBoard) {
    let pos;
    if (this.getBoardStar(idBoard)) {
      return Promise.reject(new Error('already starred'));
    }

    if (this.length) {
      pos = this.at(this.length - 1).get('pos') + Util.spacing;
    } else {
      pos = Util.spacing;
    }

    return new Promise((resolve) => {
      return this.create(
        {
          idBoard,
          pos,
        },
        { modelCache: this.modelCache },
        resolve,
      );
    });
  }

  unstarBoard(idBoard) {
    const boardStar = this.getBoardStar(idBoard);
    if (boardStar != null) {
      return new Promise(function (resolve, reject) {
        return boardStar.waitForId(boardStar, () =>
          boardStar.destroy({
            success: resolve,
            error(xhr, err) {
              return reject(err);
            },
          }),
        );
      });
    } else {
      return Promise.reject(new Error('not starred'));
    }
  }

  updateStarBoard(idBoard, index) {
    const boardStar = this.getBoardStar(idBoard);
    const pos = this.getNewPos(boardStar, index);

    if (boardStar != null) {
      return boardStar.update({
        pos,
      });
    }
  }

  getBoards() {
    const idBoards = this.getBoardIds();
    return _.compact(this.modelCache.get('Board', idBoards));
  }

  getBoardIds() {
    const models = _.sortBy(this.models, (model) => model.get('pos'));
    return (() => {
      const result = [];
      for (const model of Array.from(models)) {
        result.push(model.get('idBoard'));
      }
      return result;
    })();
  }

  getBoardIndex(idBoard) {
    return this.models
      .filter(getVisibleStarredBoards)
      .indexOf(this.getBoardStar(idBoard));
  }

  getNewPos(boardStar, index) {
    return Util.calcPos(index, this, boardStar, getVisibleStarredBoards);
  }
}
BoardStarList.initClass();

module.exports.BoardStarList = BoardStarList;
