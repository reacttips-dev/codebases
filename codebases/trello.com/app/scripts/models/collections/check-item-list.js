// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { CheckItem } = require('app/scripts/models/check-item');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');

class CheckItemList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = CheckItem;
  }
  initialize() {
    return this.listenTo(this, 'change:pos', this.sort);
  }

  comparator(checkItem) {
    return checkItem.get('pos');
  }
}
CheckItemList.initClass();

module.exports.CheckItemList = CheckItemList;
