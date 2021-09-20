// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Board } = require('app/scripts/models/board');

class PublicBoardList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Board;
  }
}
PublicBoardList.initClass();

module.exports.PublicBoardList = PublicBoardList;
