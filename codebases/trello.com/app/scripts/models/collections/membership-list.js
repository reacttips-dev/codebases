/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Membership } = require('app/scripts/models/Membership');

class MembershipList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Membership;
  }

  initialize() {
    this.memberIndex = {};

    this.listenTo(this, 'add', (model) => {
      return (this.memberIndex[model.get('idMember')] = model);
    });

    this.listenTo(this, 'remove', (model) => {
      return delete this.memberIndex[model.get('idMember')];
    });

    return this.listenTo(this, 'reset', () => {
      this.memberIndex = {};
      return Array.from(this.models).map(
        (membership) =>
          (this.memberIndex[membership.get('idMember')] = membership),
      );
    });
  }

  getMember(member) {
    const idMember =
      (member != null ? member.id : undefined) != null
        ? member != null
          ? member.id
          : undefined
        : member;
    return this.memberIndex[idMember];
  }
}
MembershipList.initClass();

module.exports.MembershipList = MembershipList;
