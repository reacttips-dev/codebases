// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const TrelloModel = require('app/scripts/models/internal/trello-model');

class Tag extends TrelloModel {
  static initClass() {
    this.prototype.typeName = 'Tag';
  }
  urlRoot() {
    return `${this.getOrganization().url()}/tags`;
  }

  getOrganization() {
    return this.collection.sourceModel;
  }
}
Tag.initClass();

module.exports.Tag = Tag;
