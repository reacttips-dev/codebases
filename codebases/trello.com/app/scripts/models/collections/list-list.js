// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { List } = require('app/scripts/models/list');
const { Util } = require('app/scripts/lib/util');

class ListList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = List;
  }
  initialize(models, options) {
    this.listenTo(this, 'change:pos', this.sort);
    this.board = options.board;
  }

  comparator(list) {
    return list.get('pos') || 0;
  }

  calcPos(index, list, includeList) {
    return Util.calcPos(index, this, list, null, includeList);
  }

  url() {
    return `/1/boards/${this.board.id}/lists`;
  }
}
ListList.initClass();

module.exports.ListList = ListList;
