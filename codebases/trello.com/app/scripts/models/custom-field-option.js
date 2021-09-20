// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const TrelloModel = require('app/scripts/models/internal/trello-model');

class CustomFieldOption extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'CustomFieldOption';
  }
  urlRoot() {
    const customField = this.getCustomField();
    return `/1/customField/${customField.id}/options`;
  }

  getCustomField() {
    return this.collection.sourceModel;
  }

  move(index) {
    this.update('pos', this.getCustomField().calcPos(index, this));
    this.collection.sort({ silent: false });
  }
}
CustomFieldOption.initClass();

module.exports.CustomFieldOption = CustomFieldOption;
