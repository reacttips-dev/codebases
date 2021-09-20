// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const CollectionWithHelpers = require('app/scripts/models/collections/internal/collection-with-helpers');
const { Dates } = require('app/scripts/lib/dates');
const { Invitation } = require('app/scripts/models/invitation');

class InvitationList extends CollectionWithHelpers {
  static initClass() {
    this.prototype.model = Invitation;
  }

  initialize(list, options) {
    this.options = options;
  }

  comparator(invitation) {
    if (invitation.get('dateExpires')) {
      return -Dates.parse(invitation.get('dateExpires'));
    } else {
      return -Infinity;
    }
  }
}
InvitationList.initClass();

module.exports.InvitationList = InvitationList;
