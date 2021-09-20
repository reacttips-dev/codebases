// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Organization } = require('app/scripts/models/organization');

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}

class OrganizationList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Organization;
  }
  initialize() {
    this.listenTo(this, 'change:name', this.sort);
  }

  comparator(organization) {
    return __guard__(organization.get('name'), (x) => x.toUpperCase()) || '';
  }
}
OrganizationList.initClass();

module.exports.OrganizationList = OrganizationList;
