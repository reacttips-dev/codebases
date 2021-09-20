// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Enterprise } = require('app/scripts/models/enterprise');
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');

class EnterpriseList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Enterprise;
  }

  initialize() {
    this.listenTo(this, 'change:name', this.sort);
  }

  comparator(enterprise) {
    return enterprise.get('name');
  }
}
EnterpriseList.initClass();

module.exports.EnterpriseList = EnterpriseList;
