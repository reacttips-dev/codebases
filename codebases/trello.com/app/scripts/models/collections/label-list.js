// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Label } = require('app/scripts/models/label');

class LabelList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Label;
  }
}
LabelList.initClass();

module.exports.LabelList = LabelList;
