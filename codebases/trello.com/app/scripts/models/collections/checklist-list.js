// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Checklist } = require('app/scripts/models/checklist');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');

class ChecklistList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Checklist;
  }
  initialize() {
    return this.listenTo(this, 'change:pos', this.sort);
  }

  comparator(checklist) {
    return checklist.get('pos');
  }

  idList() {
    return this.pluck('id');
  }
}
ChecklistList.initClass();

module.exports.ChecklistList = ChecklistList;
