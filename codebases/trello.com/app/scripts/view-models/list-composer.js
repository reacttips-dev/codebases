/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const {
  LocalStorageModel,
} = require('app/scripts/view-models/internal/local-storage-model');

module.exports.ListComposer = class ListComposer extends LocalStorageModel {
  constructor(board, options) {
    super(null, options);
    this.board = board;
    this.waitForId(this.board, (idBoard) => {
      this.set({ id: `boardListComposerSettings-${idBoard}` });
      return this.fetch();
    });
  }

  default() {
    return {
      title: null,
      vis: false,
    };
  }

  clear() {
    return this.save(this.default());
  }

  clearItems() {
    this.save({
      title: '',
    });
  }

  getBoard() {
    return this.board;
  }

  toJSON(param) {
    if (param == null) {
      param = {};
    }
    const { board } = param;
    const json = super.toJSON(...arguments);
    if (board) {
      json.board = this.getBoard().toJSON();
    }
    return json;
  }
};
