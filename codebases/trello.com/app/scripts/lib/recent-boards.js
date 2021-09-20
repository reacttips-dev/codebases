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
const _ = require('underscore');
const { ApiError } = require('app/scripts/network/api-error');
const { Auth } = require('app/scripts/db/auth');
const { ModelCache } = require('app/scripts/db/model-cache');
const { ModelLoader } = require('app/scripts/db/model-loader');
const Payloads = require('app/scripts/network/payloads').default;
const Promise = require('bluebird');
const { SidebarState } = require('app/scripts/view-models/sidebar-state');

class RecentBoards {
  static initClass() {
    this.prototype._idBoardsFetching = [];
  }

  _fetchUnknownBoards(idBoards, fetchUnknownBoardsCallback) {
    const idBoardsMissing = _.chain(idBoards)
      .difference(this._idBoardsFetching)
      .reject((idBoard) => ModelCache.get('Board', idBoard) != null)
      .value();

    if (idBoardsMissing.length === 0) {
      return;
    }

    this._idBoardsFetching = this._idBoardsFetching.concat(idBoardsMissing);

    const boards = idBoardsMissing.map((idBoard) => {
      return ModelLoader.loadBoardData(
        idBoard,
        Payloads.boardMinimal,
      ).catch(ApiError.NotFound, ApiError.Unauthorized, () =>
        SidebarState.pullBoard(idBoard),
      );
    });

    return Promise.all(boards)
      .then(() => {
        this._idBoardsFetching = _.difference(
          this._idBoardsFetching,
          idBoardsMissing,
        );
        if (fetchUnknownBoardsCallback) {
          fetchUnknownBoardsCallback(idBoardsMissing);
        }
      })
      .done();
  }

  getBoards(model, fetchUnknownBoardsCallback) {
    const me = Auth.me();
    return _.chain(SidebarState.getRecentBoards())
      .difference(model.boardStarList.getBoardIds())
      .tap((idBoards) =>
        this._fetchUnknownBoards(idBoards, fetchUnknownBoardsCallback),
      )
      .map((idBoard) => ModelCache.get('Board', idBoard))
      .compact()
      .filter((board) => board.isViewableBy(me) && board.isOpen())
      .value();
  }
}
RecentBoards.initClass();
module.exports.RecentBoards = RecentBoards;
