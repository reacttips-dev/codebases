/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Board } = require('app/scripts/models/board');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Util } = require('app/scripts/lib/util');

class BoardList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Board;
  }

  initialize() {
    this.comparatorCache = {};
    this.listenTo(this, 'change:name change:idOrganization', () => {
      this.comparatorCache = {};
      return this.sort;
    });
  }

  comparator(board) {
    const boardId = board.id;
    let ret = this.comparatorCache[boardId];
    if (!ret) {
      // Sort by org name, then board name
      const org = board.getOrganization();
      const orgName = (org ? org.get('displayName') : undefined) || '';
      const boardName = board.get('name') || '';
      ret = this.comparatorCache[boardId] =
        Util.rpad(orgName, 64).toUpperCase() + boardName.toUpperCase();
    }

    return ret;
  }
}
BoardList.initClass();

module.exports.BoardList = BoardList;
